var express = require('express')
var router = express.Router()
var url = require('url')
var _ = require('lodash')
var moment = require('moment')
var qr = require('qr-image')

var Bill = require('../models/Bill')
var settings = require('../models/db/settings')
var PubHistory = require('../models/publish/PubHistory')
var BrandPromotion = require('../models/admincenter/BrandPromotion')
var PrecisePromotion = require('../models/admincenter/PrecisePromotion')

var _tenpay = require('../libs/pay/tenpay/tenpay')
var _alipay = require('../libs/pay/alipay/alipay_f2f')
var alipay = new _alipay(require('../libs/pay/alipay/config.js'))
var tenpay = new _tenpay(require('../libs/pay/tenpay/config.js'))
var middleware = tenpay.middlewareForExpress()

function updatePromotion(res, billNum, payType, payInfo, model) {
    Bill.findOneAndUpdate({ billNum: billNum }, { $set: { billState: '已支付', payType: payType, payInfo: payInfo, paidAt: new Date() } }, function(err, bill) {
        if (err) {
            res.end(err)
        } else if (!_.isEmpty(bill)) {
            model.findOne({ bill: bill._id }, function(err, bp) {
                if (!_.isEmpty(bp)) {
                    var et = bp.period == '1年' ? 12 : (bp.period == '半年' ? 6 : 3)

                    // 续费操作
                    if (!_.isEmpty(bp.promotionBegin) && !_.isEmpty(bp.promotionEnd) && moment().isBefore(bp.promotionEnd)) {
                        bp.promotionEnd = moment(bp.promotionEnd).add(et, 'month')
                    } else {
                        bp.promotionBegin = new Date()
                        bp.promotionEnd = moment().add(et, 'month')
                    }
                    bp.save(function(err) {
                        if (err) {
                            res.end(err)
                        } else {
                            if (model == PrecisePromotion) {
                                if (_.isEmpty(bp.regions)) {
                                    bp.regions = []
                                }
                                PubHistory.findByIdAndUpdate({ _id: bp.pubHistory }, { $set: { promotionRegions: bp.regions, promotionBegin: bp.promotionBegin, promotionEnd: bp.promotionEnd } }, function(err, pub) {
                                    if (err) {
                                        res.end(err)
                                    } else {
                                        res.end('success')
                                    }
                                })
                            } else {
                                res.end('success')
                            }
                        }
                    })
                }
            })
        }
    })
}

router.post('/alipay-brand-promotion-cb-jdjF4urjkD751399932askjfak587S3hk532984n68hrq8', function(req, res) {
    var signStatus = alipay.verifyCallback(req.body)

    if (signStatus === false) {
        return res.error('回调签名验证未通过')
    }

    var invoiceStatus = req.body['trade_status']
    if (invoiceStatus !== 'TRADE_SUCCESS') {
        return res.send('success')
    }
    var billNum = req.body['out_trade_no']

    updatePromotion(res, billNum, '支付宝支付', req.body, BrandPromotion)
})

router.post('/alipay-precise-promotion-cb-4n9329868hrq82askjfak587SjdjF4urkD751399j3hk53', function(req, res) {
    var signStatus = alipay.verifyCallback(req.body)
    if (signStatus === false) {
        return res.error('回调签名验证未通过')
    }
    var invoiceStatus = req.body['trade_status']
    if (invoiceStatus !== 'TRADE_SUCCESS') {
        return res.send('success')
    }
    var billNum = req.body['out_trade_no']
    updatePromotion(res, billNum, '支付宝支付', req.body, PrecisePromotion)
})

router.post('/tenpay-brand-promotion-cb-751394nkDjfakhrq894urj39587S6832askjdjFhk53298', middleware, function(req, res) {
    var payInfo = req.weixin
    var billNum = payInfo.out_trade_no
    if (payInfo && payInfo.result_code == 'SUCCESS' && payInfo.return_code == 'SUCCESS') {
        updatePromotion(res, billNum, '微信支付', payInfo, BrandPromotion)
    }
})

router.post('/tenpay-precise-promotion-cb-rq894urj395751394nkDjfakh87S68hk533139kjdjFhk', middleware, function(req, res) {
    var payInfo = req.weixin
    var billNum = payInfo.out_trade_no
    if (payInfo && payInfo.result_code == 'SUCCESS' && payInfo.return_code == 'SUCCESS') {
        updatePromotion(res, billNum, '微信支付', payInfo, PrecisePromotion)
    }
})

// 推广服务订单支付接口
router.get('/payPromotionBill', function(req, res, next) {
    var error
    var su = req.session.user
    var billNum = req.query.billNum // 订单编号
    var payType = req.query.payType // 支付类型 微信支付、支付宝支付
    var promotionType = req.query.promotionType // 推广类型 品牌推广服务、精准推广服务

    if (_.isEmpty(billNum)) {
        error = '订单号为空'
    }
    if (_.isEmpty(payType)) {
        error = '支付类型为空'
    }
    if (_.isEmpty(promotionType)) {
        error = '推广类型为空'
    }
    if (_.isEmpty(su)) {
        error = '请登陆后再支付'
    }

    if (error) {
        res.end(error)
    } else {
        Bill.findOne({ billNum: billNum, user: su._id, billState: '未支付' }, function(err, bill) {
            if (err) {
                res.end(err)
            } else if (!_.isEmpty(bill)) {
                if (payType == '微信支付') {
                    var notify_url = (settings.debug ? 'http://www.100ns.cn:81' : 'http://www.91zhizuo.com') + '/users/tenpay-brand-promotion-cb-751394nkDjfakhrq894urj39587S6832askjdjFhk53298'
                    if (promotionType == '精准推广服务') {
                        notify_url = (settings.debug ? 'http://www.100ns.cn:81' : 'http://www.91zhizuo.com') + '/users/tenpay-precise-promotion-cb-rq894urj395751394nkDjfakh87S68hk533139kjdjFhk'
                    }
                    var order = {
                        out_trade_no: bill.billNum,
                        body: bill.billName,
                        total_fee: bill.price*100,
                        // total_fee: 1,
                        trade_type: 'NATIVE',
                        product_id: bill.billType,
                        notify_url: notify_url
                    }
                    tenpay.getNativePayParams(order, function(err, result) {
                        if (err) {
                            if (err == 'ORDERPAID') {
                                if (promotionType == '精准推广服务') {
                                    updatePromotion(res, bill.billName, '微信支付', null, PrecisePromotion)
                                } else {
                                    updatePromotion(res, bill.billName, '微信支付', null, BrandPromotion)
                                }
                            } else {
                                res.end(err)
                            }
                        } else {
                            if (result.return_code == 'SUCCESS' &&
                                result.return_msg == 'OK' &&
                                result.code_url.length > 0) {
                                var img = qr.image(result.code_url, { size: 10 })
                                res.writeHead(200, { 'Content-Type': 'image/png' })
                                img.pipe(res)
                            } else {
                                res.end('订单支付失败')
                            }
                        }
                    })
                } else if (payType == '支付宝支付') {
                    var notify_url = (settings.debug ? 'http://www.100ns.cn:81' : 'http://www.91zhizuo.com') + '/users/alipay-brand-promotion-cb-jdjF4urjkD751399932askjfak587S3hk532984n68hrq8'
                    if (promotionType == '精准推广服务') {
                        notify_url = (settings.debug ? 'http://www.100ns.cn:81' : 'http://www.91zhizuo.com') + '/users/alipay-precise-promotion-cb-4n9329868hrq82askjfak587SjdjF4urkD751399j3hk53'
                    }

                    var order = {
                        tradeNo: bill.billNum, // 必填 商户订单主键, 就是你要生成的
                        subject: bill.billType, // 必填 商品概要
                        body: bill.billName, // 可选 订单描述
                        totalAmount: bill.price,  // 必填 多少钱
                        // totalAmount: 0.01,
                        timeExpress: 30, // 可选 支付超时, 默认为5分钟
                        notifyUrl: notify_url,
                    }
                    alipay.createQRPay(order).then(function(result) {
                        if (result.code == '10000' &&
                            result.msg == 'Success') {
                            var img = qr.image(result.qr_code, { size: 10 })
                            res.writeHead(200, { 'Content-Type': 'image/png' })
                            img.pipe(res)
                        } else {
                            res.end('订单支付失败')
                        }
                    }).catch(error => res.end(error))
                }
            } else {
                res.end('订单不存在')
            }
        })
    }
})

// 查看订单详情接口
router.post('/queryBillDetail', function(req, res, next) {
    var error
    var su = req.session.user
    var billNum = req.body.billNum // 订单编号
    var promotionType = req.body.promotionType // 推广类型 品牌推广服务、精准推广服务

    if (_.isEmpty(billNum)) {
        error = '订单号为空'
    }
    if (_.isEmpty(promotionType)) {
        error = '推广类型为空'
    }

    if (error) {
        res.end(error)
    } else {
        var model = PrecisePromotion
        if (promotionType == '品牌推广服务') {
            model = BrandPromotion
        }
        model.findOne({ bill: billNum, user: su._id }).populate('category', 'name').populate('bill', 'billNum billName billType payType price billState').exec(function(err, bill) {
            if (err) {
                res.end(err)
            } else if (!_.isEmpty(bill)) {
                res.json({ billDetail: bill })
            } else {
                res.end('订单不存在')
            }
        })
    }
})

// 删除订单接口，支持批量删除
router.post('/deleteBill', function(req, res, next) {
    var error
    var su = req.session.user
    var billNums = req.body.billNums // 订单编号数组

    if (_.isEmpty(billNums)) {
        error = '订单号为空'
    }

    if (error) {
        res.end(error)
    } else {
        Bill.find({ user: su._id, _id: { $in: billNums }, billState: '未支付' }, function(err, bills) {
            if (err) {
                res.end(err)
            } else if (!_.isEmpty(bills)) {
                for (var idx in bills) {
                    var bill = bills[idx]
                        // 未支付状态的订单删除时连带删除推广表中的记录
                    var model = PrecisePromotion
                    if (bill.billName == '品牌推广服务') {
                        model = BrandPromotion
                    }
                    model.findOneAndRemove({ bill: bill._id, user: su._id }, function(err, p) {})
                    bill.remove(function(err) {})
                }
                res.json({ result: 'success' })
            } else {
                res.json({ result: 'error' })
            }
        })
    }
})

module.exports = router