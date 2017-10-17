var express = require('express')
var router = express.Router()
var url = require('url')
var _ = require('lodash')
var qr = require('qr-image')
var request=require('request')
// 验证
var validator = require('validator')
    // 文章类别对象
var ContentCategory = require('../models/ContentCategory')
    // 用户实体类
var User = require('../models/User')
var AdminUser = require('../models/AdminUser')
    // 留言实体类
var Message = require('../models/Message')
    // 文档对象
var Content = require('../models/Content')
    // 数据库操作对象
var DbOpt = require('../models/Dbopt')
var PubHistory = require('../models/publish/PubHistory')
var Demands = require('../models/publish/Demands')
var PriceConfig2 = require('../models/admincenter/PriceConfig2')
var BrandPromotion = require('../models/admincenter/BrandPromotion')
var PrecisePromotion = require('../models/admincenter/PrecisePromotion')
var Company = require('../models/Company')
var Bid = require('../models/tender/Bid')
var Tender = require('../models/tender/Tender')
var TenderCash = require('../models/tender/TenderCash')
var TenderBill = require('../models/tender/TenderBill')
var Transactions = require('../models/tender/Transactions')
var Defaults = require('../models/tender/Defaults')
var Score = require('../models/tender/Score')
var Complain = require('../models/tender/Complain')
var tenderConfig = require('../models/tender/TenderConfig')
var CompanyIdentify = require('../models/CompanyIdentify')



// 加密类
var crypto = require('crypto')
    // 系统相关操作
var system = require('../util/system')
    // 时间格式化
var moment = require('moment')
    // 站点配置
var settings = require('../models/db/settings')
var resFunc = require('../models/db/resFunc')
var tenderFunc = require('../models/db/tenderFunc')
var shortid = require('shortid')
    // 数据校验
var filter = require('../util/filter')
    // 系统消息
var UserNotify = require('../models/UserNotify')
var Wx = require('../models/Wx')
var Notify = require('../models/Notify')

var SMS = require('../models/SMS')
var smsUtils = require('../util/smsUtils')

var config = require('../config')

var siteFunc = require('../models/db/siteFunc')

// 校验是否登录
function isLogined(req) {
    return req.session.logined
}

router.get('/tender', function(req, res, next) {
    var su = req.session.user
    if (_.isEmpty(su)) {
        res.redirect('/users/transition')
    } else {
        tenderFunc.renderToTargetPageByType(req, res, 'tender', { title: '招投标-招标发布', page: 'tender' })
    }
})
router.get('/tenderinfo', function(req, res, next) {
    if (req.query.id) {
        var su = req.session.user
        if (_.isEmpty(su)) {
            res.redirect('/users/transition')
        } else {
            tenderFunc.renderToTargetPageByType(req, res, 'tenderinfo', { title: '招投标-招标详情', page: 'tenderinfo' })
        }
    } else {
        res.redirect('/users/home')
    }
})
router.get('/tenderlist', function(req, res, next) {
    if (isLogined) {
        tenderFunc.renderToTargetPageByType(req, res, 'tenderlist', { title: '招投标-招标列表', page: 'tenderlist' })
    } else {
        res.redirect('/users/transition')
    }
})
router.get('/shopaccount', function(req, res, next) {
    if (isLogined) {
        tenderFunc.renderToTargetPageByType(req, res, 'shopaccount', { title: '招投标-企业账户', page: 'shopaccount' })
    } else {
        res.redirect('/users/transition')
    }
})
router.get('/shoptender', function(req, res, next) {
    if (isLogined) {
        tenderFunc.renderToTargetPageByType(req, res, 'shoptender', { title: '招投标-企业招标', page: 'shoptender' })
    } else {
        res.redirect('/users/transition')
    }
})

router.get('/tenderAndBid', function(req, res, next) {
    tenderFunc.renderToTargetPageByType(req, res, 'tenderAndBid', { title: '招投标-招投标介绍', page: 'tenderAndBid' })
})

router.get('/shopbid', function(req, res, next) {
    var su = req.session.user
    if (_.isEmpty(su)) {
        res.redirect('/users/transition')
    } else {
        tenderFunc.renderToTargetPageByType(req, res, 'shopbid', { title: '招投标-企业投标', page: 'shopbid' })
    }
})
router.get('/bid', function(req, res, next) {
    var su = req.session.user
    if (_.isEmpty(su)) {
        res.redirect('/users/transition')
    } else {
        tenderFunc.renderToTargetPageByType(req, res, 'bid', { title: '招投标-投标录入', page: 'bid' })
    }
})

// 根据地区选择公司默认按照企业保证金降序排列
// 参数：
// region
router.post('/queryCompanyByRegion', function(req, res, next) {
    var error
    var query = {}
    var region = {}

    if (!_.isEmpty(req.body.region)) {
        region = req.body.region
    }

    if (!_.isEmpty(region.province) && _.isEmpty(region.city) && _.isEmpty(region.district)) {
        query = {
            'region.province': region.province
        }
    } else if (!_.isEmpty(region.province) && !_.isEmpty(region.city) && _.isEmpty(region.district)) {
        query = {
            'region.province': region.province,
            'region.city': region.city
        }
    } else if (!_.isEmpty(region.province) && !_.isEmpty(region.city) && !_.isEmpty(region.district)) {
        query = {
            'region.province': region.province,
            'region.city': region.city,
            'region.district': region.district
        }
    } else {
        error = '地区为空'
    }

    if (error) {
        res.json({ error: error })
    } else {
        Company.find(query, {
            companyName: 1,
            depositAccount: 1
        }).sort({ depositAccount: -1 }).limit(100).exec(function(err, docs) {
            if (err) {
                res.json({ error: err })
            } else if (!_.isEmpty(docs)) {
                res.json({ docs: docs })
            } else {
                res.json({ error: '查询为空' })
            }
        })
    }
})

// 新增招标接口
// 参数：
// categoryL1：一级类目ID
// categoryL2：二级类目ID
// title
// details
// files
// region
// blackList
// inviteList
// tenderEnd
// serviceEnd
// deposit
// tenderType
// hasDesign
// needInstall
// contacts
// phoneNum
router.post('/insertTender', function(req, res, next) {
    var error
    var su = req.session.user

    if (_.isEmpty(req.body.categoryL1)) {
        error = '一级类目为空'
    } else if (_.isEmpty(req.body.categoryL2)) {
        error = '请选择招标类目'
    } else if (_.isEmpty(req.body.title) || req.body.title.length < 10) {
        error = '标题长度需大于10个字符'
    } else if (_.isEmpty(req.body.details) || req.body.details.length < 10) {
        error = '详情长度需大于10个字符'
    } else if (_.isEmpty(req.body.tenderEnd)) {
        error = '投标截止时间为空'
    } else if (_.isEmpty(req.body.serviceEnd)) {
        error = '制作截止时间为空'
    } else if (_.isEmpty(req.body.tenderType)) {
        error = '招标方式为空'
    } else if (_.isEmpty(req.body.hasDesign)) {
        error = '是否有设计稿为空'
    } else if (_.isEmpty(req.body.needInstall)) {
        error = '是否需要安装为空'
    } else if (_.isEmpty(req.body.contacts)) {
        error = '联系人为空'
    } else if (_.isEmpty(req.body.phoneNum)) {
        error = '联系方式为空'
    } else if (_.isEmpty(req.body.vnum)) {
        error = '验证码为空'
    }

    // 非空校验完成 下面进行逻辑校验
    if (!error) {
        // 投标截至时间最少1小时 最长48小时
        var te = moment(req.body.tenderEnd)
        var te1 = moment().add(1, 'hour')
        var te2 = moment().add(48, 'hour')
        var deposit = !_.isEmpty(req.body.deposit) ? parseInt(req.body.deposit) : 0

        if (te.isBefore(te1)) {
            error = '投标截至时间需大于1小时'
        } else if (te.isAfter(te2)) {
            error = '投标截至时间需小于48小时'
        } else if (deposit > 2000) {
            error = '保证金数量需小于2000'
        } else if (req.body.vnum != req.session.vnum) {
            error = '验证码错误'
        } else if (moment(req.body.tenderEnd).isAfter(moment(req.body.serviceEnd))) {
            error = '制作截至时间不能早于招标截至时间'
        }
    }

    if (_.isEmpty(su)) {
        res.json({ error: settings.system_illegal_param })
    } else if (error) {
        res.json({ error: error })
    } else {
        // 判断用户当月违约次数 每个自然月违约3次后 当月不能再发布招标
        var monthBegin = moment().startOf('month')
        Defaults.find({ user: su._id, createdAt: { $gte: monthBegin } }, function(err, defaults) {
            if (!_.isEmpty(defaults) && defaults.length >= tenderConfig.defaultsPerMouthLimition) {
                res.json({ error: '当月您已违约3次，本月您不能发布新的招标' })
            } else {
                var doc = {
                    tenderNum: moment().format('YYYYMMDDHHmmss') + _.random(1000, 9999),
                    categoryL1: req.body.categoryL1,
                    categoryL2: req.body.categoryL2,
                    title: req.body.title,
                    details: req.body.details,
                    files: req.body.files,
                    region: req.body.region,
                    blackList: req.body.blackList,
                    inviteList: req.body.inviteList,
                    tenderEnd: moment(req.body.tenderEnd),
                    serviceEnd: moment(req.body.serviceEnd),
                    tenderType: req.body.tenderType,
                    hasDesign: validator.toBoolean(req.body.hasDesign, true),
                    needInstall: validator.toBoolean(req.body.needInstall, true),
                    contacts: req.body.contacts,
                    phoneNum: req.body.phoneNum,
                    qq: req.body.qqContacts? req.body.qqContacts:"",
                    status: 2,
                    user: su._id,
                    company: su.company
                }

                var tender = new Tender(doc)
                tender.save(function(err) {
                    if (err) {
                        res.json({ error: err })
                    } else {
                        // TODO 插入微信推送队列、短信发送队列、邮件推送队列
                        if (!_.isEmpty(req.body.inviteList)) {
                            var type = req.body.tenderType == 1 ? '公开招标' : '邀请招标'
                            Company.find({ _id: { $in: req.body.inviteList } }).populate('user').exec(function(err, companies) {
                                var phoneNums = []
                                var requestData={
                                    "template_id":"0Hwn5Tz0ScoyCs2gW4MwWQrBtqW0uCJJ4ZtPkV21Rio",
                                    "topcolor":"#FF0000",
                                    "data":{
                                        "name": {
                                            "color":"#173177"
                                        },
                                        "remark":{
                                            "color":"#173177"
                                        }
                                    }
                                }
                                Wx.findOne({},function (err,wx) {
                                    for (var idx in companies) {
                                        phoneNums.push(companies[idx].user.phoneNum)
                                        if(companies[idx].user.wechatId){
                                            requestData.touser=companies[idx].user.wechatId
                                            requestData.data["name"].value=companies[idx].companyName
                                            requestData.data["remark"].value=companies[idx].companyName
                                            console.log(requestData)
                                            request({
                                                url: 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' + wx.accessToken,
                                                method: "POST",
                                                // json: true,
                                                headers: {
                                                    "content-type": "application/json"
                                                },
                                                body: JSON.stringify(requestData)
                                            }, function (error, response, body) {
                                                console.log(error)
                                                console.log(response)
                                            })
                                        }
                                    }
                                    smsUtils.sendNotifyMultiSMS_qcloud(phoneNums, smsUtils.code12, [type, req.body.title], function(err) {})

                                })
                            })
                        }
                        if (deposit >= 100) {
                            var bill = new TenderBill({
                                billNum: moment().format('YYYYMMDDHHmmss') + _.random(1000, 9999),
                                targetId: tender._id,
                                billType: '招标保证金',
                                user: su._id,
                                price: Math.round(parseInt(req.body.deposit))
                            })
                            bill.save(function(err) {
                                res.json({
                                    'result': 'success',
                                    'billId': bill._id,
                                    'tenderId': tender._id
                                })
                            })
                        } else {
                            res.json({
                                'result': 'success'
                            })
                        }
                    }
                })
            }
        })
    }
})

// 0、已经投过标不能再投
// 0、投标时间截至不能投标
// 1、招标名额已满后不能投标
// 2、公开招标屏蔽列表中的企业不能投标
// 3、公开招标制定区域的企业才能投标
// 4、邀请招标邀请列表中的企业才能投标
function bidInner(req, res, su, tenderId, action, bid) {
    Bid.findOne({ user: su._id, tender: tenderId }, function(err, myBid) {
        if (!_.isEmpty(myBid)) {
            res.json({ error: '您已经投过此招标' })
        } else {
            Tender.findById(tenderId).populate('user').exec(function(err, tender) {
                if (_.isEmpty(tender)) {
                    res.json({ error: '未查询到招标信息' })
                } else {
                    if (moment(tender.tenderEnd).isBefore(new Date())) {
                        res.json({ error: '投标已截至' })
                    } else {
                        if (!_.isEmpty(tender.bidders) && tender.bidders.length >= tender.bidderLimit) {
                            res.json({ error: '投标名额已满' })
                        } else {
                            if (tender.tenderType == 1) { // 公开招标
                                // 屏蔽列表中的企业不能投标
                                if (!_.isEmpty(tender.blackList) && _.indexOf(tender.blackList, su.company) >= 0) {
                                    res.json({ error: '您暂时不能投标' })
                                } else {
                                    // 不在招标方指定区域中的企业不能投标
                                    var tenderRegion = tender.region
                                    Company.findOne({ user: su._id }, function(err, company) {
                                        if (!_.isEmpty(company) && !_.isEmpty(company.region)) {
                                            var canBid = false
                                            if (!_.isEmpty(tenderRegion.province) && _.isEmpty(tenderRegion.city) && _.isEmpty(tenderRegion.district)) {
                                                if (tenderRegion.province == company.region.province) {
                                                    canBid = true
                                                }
                                            } else if (!_.isEmpty(tenderRegion.province) && !_.isEmpty(tenderRegion.city) && _.isEmpty(tenderRegion.district)) {
                                                if (tenderRegion.province == company.region.province &&
                                                    tenderRegion.city == company.region.city) {
                                                    canBid = true
                                                }
                                            } else if (!_.isEmpty(tenderRegion.province) && !_.isEmpty(tenderRegion.city) && !_.isEmpty(tenderRegion.district)) {
                                                if (tenderRegion.province == company.region.province &&
                                                    tenderRegion.city == company.region.city &&
                                                    tenderRegion.district == company.region.district) {
                                                    canBid = true
                                                }
                                            }

                                            if (canBid) {
                                                if (action == 'canBid') {
                                                    res.json({
                                                        'result': 'success'
                                                    })
                                                } else if (action == 'insertBid') {
                                                    //投标
                                                    bid.save(function(err) {
                                                        if (err) {
                                                            res.json({ error: err })
                                                        } else {
                                                            // TODO 插入微信推送队列、短信发送队列、邮件推送队列
                                                            if (!_.isEmpty(tender.bidders)) {
                                                                tender.bidders.push(bid._id)
                                                                tender.bidderUsers.push(su._id)
                                                            } else {
                                                                tender.bidders = [bid._id]
                                                                tender.bidderUsers = [su._id]
                                                            }
                                                            tender.save(function(err) {
                                                                smsUtils.sendNotifySMS_qcloud(tender.user.phoneNum, smsUtils.code11, [tender.bidders.length, moment(tender.tenderEnd).format('YYYY-MM-DD HH:mm:ss')], function(err) {})
                                                                res.json({
                                                                    'result': 'success'
                                                                })
                                                            })
                                                        }
                                                    })
                                                }
                                            } else {
                                                res.json({ error: '招标方指定区域的企业才能投标' })
                                            }
                                        }
                                    })
                                }
                            } else if (tender.tenderType == 2) { // 邀请招标
                                if (!_.isEmpty(tender.inviteList) && _.indexOf(tender.inviteList, su.company) >= 0) {
                                    if (action == 'canBid') {
                                        res.json({
                                            'result': 'success'
                                        })
                                    } else if (action == 'insertBid') {
                                        //投标
                                        bid.save(function(err) {
                                            if (err) {
                                                res.json({ error: err })
                                            } else {
                                                // TODO 插入微信推送队列、短信发送队列、邮件推送队列
                                                if (!_.isEmpty(tender.bidders)) {
                                                    tender.bidders.push(bid._id)
                                                    tender.bidderUsers.push(su._id)
                                                } else {
                                                    tender.bidders = [bid._id]
                                                    tender.bidderUsers = [su._id]
                                                }
                                                tender.save(function(err) {
                                                    smsUtils.sendNotifySMS_qcloud(tender.user.phoneNum, smsUtils.code11, [tender.bidders.length, moment(tender.tenderEnd).format('YYYY-MM-DD HH:mm:ss')], function(err) {})
                                                    res.json({
                                                        'result': 'success'
                                                    })
                                                })
                                            }
                                        })
                                    }
                                } else {
                                    res.json({ error: '招标方邀请的企业才能投标' })
                                }
                            }
                        }
                    }
                }
            })
        }
    })
}

function preBidFilter(req, res, su, tenderId, action, bid) {
    // 进行投标逻辑判断
    // 1、判断企业是否进行了企业认证 只有企业认证通过了才能投标
    // 2、判断用户是否购买品牌推广 没购买每天只能投5次标
    CompanyIdentify.findOne({ user: su._id, status: '审核通过' }, function(err, identify) {
        if (_.isEmpty(identify)) {
            res.json({ error: '您的企业还未进行企业认证或正在审核中，认证通过后将获得投标资格' })
        } else {
            BrandPromotion.findOne({ user: su._id, promotionEnd: { $gte: new Date() } }, function(err, bp) {
                if (_.isEmpty(bp)) {
                    // 未购买品牌推广或品牌推广已经过期
                    Bid.find({ user: su._id, createdAt: { $gte: moment().startOf('day') } }, function(err, bids) {
                        if (!_.isElement(bids) && bids.length >= tenderConfig.noneBrandPromotionLimition) {
                            res.json({ error: '今日投标次数已用完，购买品牌推广服务每天投标次数将不受限制' })
                        } else {
                            bidInner(req, res, su, tenderId, action, bid)
                        }
                    })
                } else {
                    bidInner(req, res, su, tenderId, action, bid)
                }
            })
        }
    })
}

// 能否投标接口
router.post('/canBid', function(req, res, next) {
    var error
    var su = req.session.user
    var tenderId = req.body.tenderId

    if (_.isEmpty(su)) {
        error = '请登陆后操作'
    } else if (_.isEmpty(tenderId)) {
        error = '招标信息ID为空'
    }

    if (error) {
        res.json({ error: error })
    } else {
        preBidFilter(req, res, su, tenderId, 'canBid', null)
    }
})

// 投标接口
router.post('/insertBid', function(req, res, next) {
    var error
    var su = req.session.user

    if (_.isEmpty(req.body.tenderId)) {
        error = '招标编号为空'
    } else if (_.isEmpty(req.body.price)) {
        error = '价格为空'
    } else if (_.isEmpty(req.body.details) || req.body.details.length < 10) {
        error = '详情长度需大于10个字符'
    } else if (_.isEmpty(req.body.depositRate)) {
        error = '定金比例为空'
    } else if (_.isEmpty(req.body.serviceEnd)) {
        error = '承诺交付时间为空'
    } else if (_.isEmpty(req.body.contacts)) {
        error = '联系人为空'
    } else if (_.isEmpty(req.body.phoneNum)) {
        error = '联系方式为空'
    } else if (_.isEmpty(req.body.vnum)) {
        error = '验证码为空'
    }

    // 非空校验完成 下面进行逻辑校验
    if (!error) {
        // 定金比例介于（0, 100）
        var depositRate = !_.isEmpty(req.body.depositRate) ? parseFloat(req.body.depositRate) : 0
        depositRate *= 100

        if (depositRate >= 100 || depositRate <= 0) {
            error = '定金比例需大于0小于100'
        } else if (req.body.vnum != req.session.vnum) {
            error = '验证码错误'
        }
    }

    if (_.isEmpty(su)) {
        res.json({ error: settings.system_illegal_param })
    } else if (error) {
        res.json({ error: error })
    } else {
        var tenderId = req.body.tenderId
        var doc = {
            price: parseInt(req.body.price),
            details: req.body.details,
            depositRate: parseFloat(req.body.depositRate),
            serviceEnd: moment(req.body.serviceEnd),
            contacts: req.body.contacts,
            phoneNum: req.body.phoneNum,
            tender: req.body.tenderId,
            user: su._id,
            company: su.company
        }
        var bid = new Bid(doc)

        preBidFilter(req, res, su, tenderId, 'insertBid', bid)
    }
})

// 第二步：选择中标人
router.post('/chosenBidder', function(req, res, next) {
    var error
    var su = req.session.user

    if (_.isEmpty(req.body.tenderId)) {
        error = '招标号为空'
    } else if (_.isEmpty(req.body.bidderId)) {
        error = '投标号为空'
    }

    if (_.isEmpty(su)) {
        res.json({ error: settings.system_illegal_param })
    } else if (error) {
        res.json({ error: error })
    } else {
        var tenderId = req.body.tenderId
        var bidderId = req.body.bidderId

        Bid.findById(bidderId, function(err, bid) {
            if (!_.isEmpty(bid)) {
                Tender.findOne({ _id: tenderId, user: su._id }, function(err, tender) {
                    if (!_.isEmpty(tender) && _.indexOf(tender.bidders, bidderId) >= 0) {
                        tender.chosenBidder = bidderId
                        tender.chosenBidderUser = bid.user
                        tender.status = 3
                        tender.timeRcdStep2 = new Date()
                        tender.save(function(err) {
                            if (err) {
                                res.json({ error: err })
                            } else {
                                // TODO 发送短信给中标人提示已经中标及定金支付情况
                                var needPay = Math.round(bid.price * bid.depositRate)
                                User.findById(bid.user, function(err, user) {
                                    if (!_.isEmpty(user)) {
                                        // 发送短信给中标人提示已经中标及定金支付情况
                                        smsUtils.sendNotifySMS_qcloud(user.phoneNum, smsUtils.code10, [needPay], function(err) {})
                                    }
                                })
                                var bill = new TenderBill({
                                    billNum: moment().format('YYYYMMDDHHmmss') + _.random(1000, 9999),
                                    targetId: tender._id,
                                    billType: '招标定金',
                                    user: su._id,
                                    price: Math.round(needPay)
                                })
                                bill.save(function(err) {})
                                res.json({
                                    'result': 'success'
                                })
                            }
                        })
                    } else {
                        res.json({ error: '操作失败' })
                    }
                })
            } else {
                res.json({ error: '操作失败' })
            }
        })
    }
})

// 绑定和换绑提现账户接口
// 参数
// code: 验证码
// type: 账户类型 alipay/wxpay
// account: 账户
// isBind：true绑定账户 false换绑账户
router.post('/bindWithdrawAccount', function(req, res, next) {
    var error
    var su = req.session.user

    if (_.isEmpty(req.body.code)) {
        error = '验证码为空'
    } else if (_.isEmpty(req.body.type)) {
        error = '账户类型为空'
    } else if (_.isEmpty(req.body.account)) {
        error = '待绑定账户为空'
    } else if (_.isEmpty(req.body.isBind)) {
        error = '绑定换绑标识为空'
    }

    if (_.isEmpty(su)) {
        res.json({ error: settings.system_illegal_param })
    } else if (error) {
        res.json({ error: error })
    } else {
        var code = req.body.code
        var type = req.body.type
        var account = req.body.account
        var isBind = validator.toBoolean(req.body.isBind)
        var phoneNum = su.phoneNum

        SMS.findOne({ phoneNum: phoneNum }, function(err, sms) {
            if (err) {
                res.end(err)
            } else {
                if (!_.isEmpty(sms)) {
                    var createdAt = moment(sms.createdAt, 'YYYYMMDDHHmmss')
                    var exp = createdAt.add(sms.duration, 'minutes')
                    if (sms.code == code) {
                        if (moment().isBefore(exp)) {
                            if (isBind) {
                                Company.findOneAndUpdate({ user: su._id }, {
                                    $addToSet: {
                                        withdrawAccount: {
                                            type: type,
                                            account: account
                                        }
                                    }
                                }, function(err, company) {
                                    if (err) {
                                        res.json({ error: err })
                                    } else {
                                        sms.remove(function(err) {})
                                        res.json({ result: 'success' })
                                    }
                                })
                            } else {
                                Company.findOneAndUpdate({ user: su._id }, { $pull: { withdrawAccount: { type: type } } }, { multi: true }, function(err, company) {
                                    if (err) {
                                        res.json({ error: err })
                                    } else {
                                        Company.findOneAndUpdate({ user: su._id }, {
                                            $addToSet: {
                                                withdrawAccount: {
                                                    type: type,
                                                    account: account
                                                }
                                            }
                                        }, function(err, company) {
                                            if (err) {
                                                res.json({ error: err })
                                            } else {
                                                sms.remove(function(err) {})
                                                res.json({ result: 'success' })
                                            }
                                        })
                                    }
                                })
                            }
                        } else {
                            sms.remove(function(err) {})
                            res.json({ error: '验证码已过期' })
                        }
                    } else {
                        res.json({ error: '验证码错误' })
                    }
                } else {
                    res.json({ error: '电话号码或验证码无效' })
                }
            }
        }).sort({ createdAt: -1 }).limit(1)
    }
})

router.post('/queryMyBidsByOne', function(req, res, next) {
    var error
    var su = req.session.user

    if (_.isEmpty(req.body.tenderId)) {
        error = '查询id为空'
    }

    if (_.isEmpty(su)) {
        res.json({ error: settings.system_illegal_param })
    } else if (error) {
        res.json({ error: error })
    } else {
        Tender.findOne({ _id: req.body.tenderId }).populate('categoryL1 categoryL2', 'name').populate('chosenBidder').exec(function(err, docs) {
            if (err) {
                res.json({ error: err })
            } else if (!_.isEmpty(docs)) {
                res.json(docs)
            } else {
                res.json({ error: '查询为空' })
            }
        })
    }
})

// 查询我的投标
// 参数：
// type（必选）： 查询类型 1 招标中 2 已中标 3 未中标 4 已交付 5 已取消
// order（可选）：排序字段 默认{refreshedAt: -1}
// page（必选）：当前页面
// limit（必选）：每页记录条数 默认每页15条
router.post('/queryMyBids', function(req, res, next) {
    var error
    var su = req.session.user
    var order = { createdAt: -1 }
    var page = 1
    var limit = 15

    if (!_.isEmpty(req.body.page)) {
        page = parseInt(req.body.page)
    }
    if (!_.isEmpty(req.body.limit)) {
        limit = parseInt(req.body.limit)
    }
    if (!_.isEmpty(req.body.order)) {
        order = req.body.order
    }

    if (_.isEmpty(req.body.type)) {
        error = '查询类型为空'
    }

    if (_.isEmpty(su)) {
        res.json({ error: settings.system_illegal_param })
    } else if (error) {
        res.json({ error: error })
    } else {
        var query = { bidderUsers: su._id, isCanceled: false }
        var type = req.body.type
        if (type == "投标中") { // 招标中
            query.status = 2
            query.tenderEnd = { $gt: new Date() }
        } else if (type == "已中标") { // 已中标
            query.status = { $gte: 3, $lt: 6 }
            query.chosenBidderUser = su._id
        } else if (type == "未中标") { // 未中标
            query.status = { $gte: 3 }
            query.chosenBidderUser = { $ne: su._id }
        } else if (type == "已交付") { // 已交付
            query.status = 6
            query.chosenBidderUser = su._id
        } else if (type == "已取消") { // 已取消
            query.isCanceled = true
        }

        var startNum = (page - 1) * limit
        var resultNum = Tender.find(query).count()
        Tender.find(query).sort(order).skip(startNum).limit(limit).populate('categoryL1 categoryL2', 'name').populate('bidders').exec(function(err, docs) {
            if (err) {
                res.end(err)
            } else if (!_.isEmpty(docs)) {
                var pageInfo = {
                    'totalItems': resultNum,
                    'currentPage': page,
                    'limit': limit,
                    'startNum': startNum + 1
                }
                var datasInfo = {
                    docs: docs,
                    pageInfo: pageInfo,
                    id: su._id
                }
                res.json(datasInfo)
            } else {
                res.json({ error: '查询为空' })
            }
        })
    }
})

// 查询我的交易流水接口
router.post('/queryMyTransactions', function(req, res, next) {
    var su = req.session.user
    var order = { createdAt: -1 }
    var page = 1
    var limit = 5

    if (!_.isEmpty(req.body.page)) {
        page = parseInt(req.body.page)
    }
    if (!_.isEmpty(req.body.limit)) {
        limit = parseInt(req.body.limit)
    }
    if (!_.isEmpty(req.body.order)) {
        order = req.body.order
    }

    if (_.isEmpty(su)) {
        res.json({ error: settings.system_illegal_param })
    } else {
        var startNum = (page - 1) * limit
        var resultNum = Transactions.find({ user: su._id }).count()
        Transactions.find({ user: su._id }).sort(order).skip(startNum).limit(limit).exec(function(err, docs) {
            if (err) {
                res.end(err)
            } else if (!_.isEmpty(docs)) {
                var pageInfo = {
                    'totalItems': resultNum,
                    'currentPage': page,
                    'limit': limit,
                    'startNum': startNum + 1
                }
                var datasInfo = {
                    docs: docs,
                    pageInfo: pageInfo
                }
                res.json(datasInfo)
            } else {
                res.json({ error: '查询为空' })
            }
        })
    }
})

// 投标验收接口
// 参数
// tenderId
router.post('/tenderConform', function(req, res, next) {
    var error
    var su = req.session.user

    if (_.isEmpty(req.body.tenderId)) {
        error = '招标ID为空'
    }

    if (_.isEmpty(su)) {
        res.json({ error: settings.system_illegal_param })
    } else if (error) {
        res.json({ error: error })
    } else {
        Tender.findOneAndUpdate({ _id: req.body.tenderId, isCanceled: false, user: su._id, status: 4 }, {
            $set: {
                status: 5,
                timeRcdStep4: new Date()
            }
        }, function(err, tender) {
            if (err) {
                res.json({ error: '操作失败' })
            } else if (!_.isEmpty(tender)) {
                Bid.findById(tender.chosenBidder, function(err, bid) {
                    // 创建尾款订单
                    if (!_.isEmpty(bid)) {
                        var needPay = Math.round(bid.price - tender.downpayment)

                        User.findById(bid.user, function(err, user) {
                            if (!_.isEmpty(user)) {
                                // 发送短信给中标人提示已经通过验收
                                smsUtils.sendNotifySMS_qcloud(user.phoneNum, smsUtils.code17, [needPay], function(err) {})
                            }
                        })
                        var bill = new TenderBill({
                            billNum: moment().format('YYYYMMDDHHmmss') + _.random(1000, 9999),
                            targetId: tender._id,
                            billType: '招标尾款',
                            user: su._id,
                            price: Math.round(needPay)
                        })
                        bill.save(function(err) {})
                        res.json({ result: 'success' })
                    } else {
                        tender.status = 4
                        tender.timeRcdStep4 = null
                        tender.save(function(err) {})
                        res.json({ error: '操作失败' })
                    }
                })
            }
        })
    }
})

function cancelTenderInner(req, res, su, action) {
    Tender.findOne({ _id: req.body.tenderId, isCanceled: false, user: su._id }, function(err, tender) {
        if (err) {
            res.json({ error: err })
        } else if (!_.isEmpty(tender)) {
            // 1、投标过程中取消 -> 无责任
            // 1、招标时间截至后投标数量未达到预期的数量在选标阶段关闭招标 -> 无责任
            // 2、招标时间截至后投标数量达到预期的数量在选标阶段关闭招标 -> 招标方责任
            // 3、招标数量未达到预期数量，选标时间截止后招标方未能选择中标方导致招标关闭 -> 无责任
            // 4、招标数量达到预期数量，选标时间截止后招标方未能选择中标方导致招标关闭 -> 招标方责任
            // 5、支付定金时间截至后，招标方未支付定金导致招标关闭 -> 招标方责任
            if ((moment().isBefore(moment(tender.tenderEnd)) && tender.status == 2)) {
                if (action == 'canCancelMyTender') {
                    res.json({ result: '您可以无责任取消此次招标' })
                } else if (action == 'cancelMyTender') {
                    TenderBill.findOne({
                        billState:"已支付",
                        billType: '招标保证金',
                        targetId:  tender._id
                    }, function(err, tenderBill) {
                        if (!_.isEmpty(tenderBill)) {
                            //发送短信
                            smsUtils.sendNotifySMS_qcloud(su.phoneNum, smsUtils.code7, ['招标保证金退款', tenderBill.price], function(err) {})
                            Transactions.update({
                                transNum:tenderBill.billNum,
                                transType: '招标保证金'
                            },{$set:{refund: true}},{ multi: true }, function(err, raw) {
                                if (err) {
                                    res.json({ error: err })
                                } else {
                                    var payType = tenderBill.payType
                                    var transNum = moment().format('YYYYMMDDHHmmss') + _.random(1000, 9999)
                                    if (payType == '微信支付') {
                                        var refund = {
                                            out_trade_no: tenderBill.billNum,
                                            out_refund_no: transNum,
                                            total_fee: tenderBill.price*100,
                                            refund_fee: tenderBill.price*100
                                            // total_fee: 1,
                                            // refund_fee: 1
                                        }
                                        tenpay.refund(refund, function(err, result) {
                                            if (result.return_code == 'SUCCESS' &&
                                                result.return_msg == 'OK') {
                                                var newTran = new Transactions({
                                                    transNum: result.out_refund_no,
                                                    transType: '招标保证金退款',
                                                    price: -result.total_fee / 100,
                                                    payType: payType,
                                                    payInfo: result,
                                                    user: su._id
                                                })
                                                newTran.save(function(err) {})
                                                tender.isCanceled = true
                                                tender.cancelDetail = '招标方在招标阶段取消招标'
                                                tender.save(function(err) {
                                                    res.json({ result: 'success' })
                                                })
                                            }
                                        })
                                    } else if (payType == '支付宝支付') {
                                        var refund = {
                                            refundNo: transNum,
                                            refundAmount: tenderBill.price
                                            // refundAmount: 0.01
                                        }
                                        alipay.refund(tenderBill.billNum, refund).then(function(result) {
                                            if (result.code == '10000' &&
                                                result.msg == 'Success') {
                                                var newTran = new Transactions({
                                                    transNum: moment().format('YYYYMMDDHHmmss') + _.random(1000, 9999),
                                                    transType: '招标保证金退款',
                                                    price: -result.send_back_fee,
                                                    payType: payType,
                                                    payInfo: result,
                                                    user: su._id
                                                })
                                                newTran.save(function(err) {})
                                                tender.isCanceled = true
                                                tender.cancelDetail = '招标方在招标阶段取消招标'
                                                tender.save(function(err) {
                                                    res.json({ result: 'success' })
                                                })
                                            }
                                        }).catch(function(error) { res.end(error) })
                                    }
                                }
                            })
                        }else {
                            tender.isCanceled = true
                            tender.cancelDetail = '招标方在招标阶段取消招标'
                            tender.save(function(err) {
                                res.json({ result: 'success' })
                            })
                        }
                    })

                }
            } else if (moment().isAfter(moment(tender.tenderEnd)) && tender.status == 2 && tender.bidders.length < tender.bidderLimit) {
                if (action == 'canCancelMyTender') {
                    res.json({ result: '您可以无责任取消此次招标' })
                } else if (action == 'cancelMyTender') {
                    TenderBill.findOne({
                        billState:"已支付",
                        billType: '招标保证金',
                        targetId:  tender._id
                    }, function(err, tenderBill) {
                        if (!_.isEmpty(tenderBill)) {
                            //发送短信
                            smsUtils.sendNotifySMS_qcloud(su.phoneNum, smsUtils.code7, ['招标保证金退款', tenderBill.price], function(err) {})
                            Transactions.update({
                                transNum:tenderBill.billNum,
                                transType: '招标保证金'
                            },{$set:{refund: true}},{ multi: true }, function(err, raw) {
                                if (err) {
                                    res.json({ error: err })
                                } else {
                                    var payType = tenderBill.payType
                                    var transNum = moment().format('YYYYMMDDHHmmss') + _.random(1000, 9999)
                                    if (payType == '微信支付') {
                                        var refund = {
                                            out_trade_no: tenderBill.billNum,
                                            out_refund_no: transNum,
                                            total_fee: tenderBill.price*100,
                                            refund_fee: tenderBill.price*100
                                            // total_fee: 1,
                                            // refund_fee: 1
                                        }
                                        tenpay.refund(refund, function(err, result) {
                                            if (result.return_code == 'SUCCESS' &&
                                                result.return_msg == 'OK') {
                                                var newTran = new Transactions({
                                                    transNum: result.out_refund_no,
                                                    transType: '招标保证金退款',
                                                    price: -result.total_fee / 100,
                                                    payType: payType,
                                                    payInfo: result,
                                                    user: su._id
                                                })
                                                newTran.save(function(err) {})
                                                tender.isCanceled = true
                                                tender.cancelDetail = '招标方因投标数未达到目标数量取消招标'
                                                tender.save(function(err) {
                                                    res.json({ result: 'success' })
                                                })
                                            }
                                        })
                                    } else if (payType == '支付宝支付') {
                                        var refund = {
                                            refundNo: transNum,
                                            refundAmount: tenderBill.price
                                            // refundAmount: 0.01
                                        }
                                        alipay.refund(tenderBill.billNum, refund).then(function(result) {
                                            if (result.code == '10000' &&
                                                result.msg == 'Success') {
                                                var newTran = new Transactions({
                                                    transNum: moment().format('YYYYMMDDHHmmss') + _.random(1000, 9999),
                                                    transType: '招标保证金退款',
                                                    price: -result.send_back_fee,
                                                    payType: payType,
                                                    payInfo: result,
                                                    user: su._id
                                                })
                                                newTran.save(function(err) {})
                                                tender.isCanceled = true
                                                tender.cancelDetail = '招标方因投标数未达到目标数量取消招标'
                                                tender.save(function(err) {
                                                    res.json({ result: 'success' })
                                                })
                                            }
                                        }).catch(function(error) { res.end(error) })
                                    }
                                }
                            })
                        }else {
                            tender.isCanceled = true
                            tender.cancelDetail = '招标方因投标数未达到目标数量取消招标'
                            tender.save(function(err) {
                                res.json({ result: 'success' })
                            })
                        }
                    })

                }
            } else if ((moment().isAfter(moment(tender.tenderEnd)) && tender.status == 2 && tender.bidders.length >= tender.bidderLimit) ||
                tender.status == 3) {
                if (action == 'canCancelMyTender') {
                    res.json({ result: '取消此次招标您将产生违约记录，每个自然月违规3次后，当月您将不能发布新的招标' })
                } else if (action == 'cancelMyTender') {
                    var defaults = new Defaults({ tender: tender._id, user: tender.user, company: tender.company })
                    defaults.save(function(err) {
                        TenderBill.findOne({
                            billState:"已支付",
                            billType: '招标保证金',
                            targetId:  tender._id
                        }, function(err, tenderBill) {
                            if (!_.isEmpty(tenderBill)) {
                                //发送短信
                                smsUtils.sendNotifySMS_qcloud(su.phoneNum, smsUtils.code7, ['招标保证金退款', tenderBill.price], function(err) {})
                                Transactions.update({
                                    transNum:tenderBill.billNum,
                                    transType: '招标保证金'
                                },{$set:{refund: true}},{ multi: true }, function(err, raw) {
                                    if (err) {
                                        res.json({ error: err })
                                    } else {
                                        var payType = tenderBill.payType
                                        var transNum = moment().format('YYYYMMDDHHmmss') + _.random(1000, 9999)
                                        if (payType == '微信支付') {
                                            var refund = {
                                                out_trade_no: tenderBill.billNum,
                                                out_refund_no: transNum,
                                                total_fee: tenderBill.price*100,
                                                refund_fee: tenderBill.price*100
                                                // total_fee: 1,
                                                // refund_fee: 1
                                            }
                                            tenpay.refund(refund, function(err, result) {
                                                if (result.return_code == 'SUCCESS' &&
                                                    result.return_msg == 'OK') {
                                                    var newTran = new Transactions({
                                                        transNum: result.out_refund_no,
                                                        transType: '招标保证金退款',
                                                        price: -result.total_fee / 100,
                                                        payType: payType,
                                                        payInfo: result,
                                                        user: su._id
                                                    })
                                                    newTran.save(function(err) {})
                                                    tender.isCanceled = true
                                                    tender.cancelDetail = '招标方违约取消招标已做相应违约处理'
                                                    tender.save(function(err) {
                                                        res.json({ result: 'success' })
                                                    })
                                                }
                                            })
                                        } else if (payType == '支付宝支付') {
                                            var refund = {
                                                refundNo: transNum,
                                                refundAmount: tenderBill.price
                                                // refundAmount: 0.01
                                            }
                                            alipay.refund(tenderBill.billNum, refund).then(function(result) {
                                                if (result.code == '10000' &&
                                                    result.msg == 'Success') {
                                                    var newTran = new Transactions({
                                                        transNum: moment().format('YYYYMMDDHHmmss') + _.random(1000, 9999),
                                                        transType: '招标保证金退款',
                                                        price: -result.send_back_fee,
                                                        payType: payType,
                                                        payInfo: result,
                                                        user: su._id
                                                    })
                                                    newTran.save(function(err) {})
                                                    tender.isCanceled = true
                                                    tender.cancelDetail = '招标方违约取消招标已做相应违约处理'
                                                    tender.save(function(err) {
                                                        res.json({ result: 'success' })
                                                    })
                                                }
                                            }).catch(function(error) { res.end(error) })
                                        }
                                    }
                                })
                            }else {
                                tender.isCanceled = true
                                tender.cancelDetail = '招标方违约取消招标已做相应违约处理'
                                tender.save(function(err) {
                                    res.json({ result: 'success' })
                                })
                            }
                        })

                    })
                }
            }
        } else {
            res.json({ error: '操作失败' })
        }
    })
}

// 判断能否取消我的招标
// 参数：
// tenderId
router.post('/canCancelMyTender', function(req, res, next) {
    var error
    var su = req.session.user

    if (_.isEmpty(req.body.tenderId)) {
        error = '招标ID为空'
    }

    if (_.isEmpty(su)) {
        res.json({ error: settings.system_illegal_param })
    } else if (error) {
        res.json({ error: error })
    } else {
        cancelTenderInner(req, res, su, 'canCancelMyTender')
    }
})

// 取消我的招标
// 参数：
// tenderId
router.post('/cancelMyTender', function(req, res, next) {
    var error
    var su = req.session.user

    if (_.isEmpty(req.body.tenderId)) {
        error = '招标ID为空'
    }

    if (_.isEmpty(su)) {
        res.json({ error: settings.system_illegal_param })
    } else if (error) {
        res.json({ error: error })
    } else {
        cancelTenderInner(req, res, su, 'cancelMyTender')
    }
})

// 退企业保证金接口
// 参数：
// payType
router.post('/refundCompanyDeposit', function(req, res, next) {
    var error
    var su = req.session.user

    if (_.isEmpty(su)) {
        res.json({ error: settings.system_illegal_param })
    } else {
        var code = req.body.code
        var phoneNum = su.phoneNum
        SMS.findOne({ phoneNum: phoneNum }, function(err, sms) {
            if (err) {
                res.json({ error: err })
            } else {
                if (!_.isEmpty(sms)) {
                    var createdAt = moment(sms.createdAt, 'YYYYMMDDHHmmss')
                    var exp = createdAt.add(sms.duration, 'minutes')
                    if (sms.code == code) {
                        if (moment().isBefore(exp)) {
                            // 当前没有招投标进行中则可以退企业保证金
                            Bid.find({ user: su._id }).populate('tender').exec(function(err, bids) {
                                var canRefund = true
                                if (!_.isEmpty(bids) && bids.length > 0) {
                                    for (var idx in bids) {
                                        var bid = bids[idx]
                                        if (bid.tender.status != 6 && !bid.tender.isCanceled && bid.tender.chosenBidderUser == su._id) {
                                            canRefund = false
                                            break
                                        }
                                    }
                                }
                                if (!canRefund) {
                                    res.json({ error: '您有正在进行中的投标暂时不能退企业保证金，全部投标状态变成已交付或已取消后您可以随时退企业保证金' })
                                } else {
                                    Tender.find({
                                        user: su._id,
                                        status: { $ne: 6 },
                                        isCanceled: false
                                    }, function(err, tenders) {
                                        if (!_.isEmpty(tenders) && tenders.length > 0) {
                                            res.json({ error: '您有正在进行中的招标暂时不能退企业保证金，全部招标状态变成已交付或已取消后您可以随时退企业保证金' })
                                        } else {
                                            Transactions.find({
                                                user: su._id,
                                                transType: '企业保证金',
                                                refund: false
                                            }, function(err, trans) {
                                                if (!_.isEmpty(trans)) {
                                                    Company.findOne({ user: su._id }, function(err, cpy) {
                                                        if (!_.isEmpty(cpy)) {
                                                            //发送短信
                                                            smsUtils.sendNotifySMS_qcloud(su.phoneNum, smsUtils.code7, ['企业保证金', cpy.depositAccount], function(err) {})
                                                            cpy.depositAccount = 0
                                                            cpy.save(function(err) {
                                                                Transactions.update({
                                                                    user: su._id,
                                                                    transType: '企业保证金',
                                                                    refund: true
                                                                }, { multi: true }, function(err, raw) {
                                                                    if (err) {
                                                                        res.json({ error: err })
                                                                    } else {
                                                                        for (var idx in trans) {
                                                                            var tran = trans[idx]
                                                                            var payType = tran.payType
                                                                            var transNum = moment().format('YYYYMMDDHHmmss') + _.random(1000, 9999)

                                                                            if (payType == '微信支付') {
                                                                                var refund = {
                                                                                    out_trade_no: tran.transNum,
                                                                                    out_refund_no: transNum,
                                                                                    total_fee: tran.price*100,
                                                                                    refund_fee: tran.price*100,
                                                                                    // total_fee: 1,
                                                                                    // refund_fee: 1
                                                                                }
                                                                                tenpay.refund(refund, function(err, result) {
                                                                                    if (result.return_code == 'SUCCESS' &&
                                                                                        result.return_msg == 'OK') {
                                                                                        var newTran = new Transactions({
                                                                                            transNum: result.out_refund_no,
                                                                                            transType: '企业保证金退款',
                                                                                            price: -result.total_fee / 100,
                                                                                            payType: payType,
                                                                                            payInfo: result,
                                                                                            user: su._id
                                                                                        })
                                                                                        newTran.save(function(err) {})
                                                                                    }
                                                                                })
                                                                            } else if (payType == '支付宝支付') {
                                                                                var refund = {
                                                                                    refundNo: transNum,
                                                                                    refundAmount: tran.price,
                                                                                    // refundAmount: 0.01
                                                                                }
                                                                                alipay.refund(tran.transNum, refund).then(function(result) {
                                                                                    if (result.code == '10000' &&
                                                                                        result.msg == 'Success') {
                                                                                        var newTran = new Transactions({
                                                                                            transNum: moment().format('YYYYMMDDHHmmss') + _.random(1000, 9999),
                                                                                            transType: '企业保证金退款',
                                                                                            price: -result.send_back_fee,
                                                                                            payType: payType,
                                                                                            payInfo: result,
                                                                                            user: su._id
                                                                                        })
                                                                                        newTran.save(function(err) {})
                                                                                    }
                                                                                }).catch(function(error) { res.end(error) })
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                            res.json({ result: '退款成功，请打开微信或支付宝查询退款结果' })
                                        }
                                    })
                                }
                            })
                        } else {
                            sms.remove(function(err) {})
                            res.json({ error: '验证码已过期' })
                        }
                    } else {
                        res.json({ error: '验证码错误' })
                    }
                } else {
                    res.json({ error: '电话号码或验证码无效' })
                }
            }
        }).sort({ createdAt: -1 }).limit(1)
    }
})

// 招投标评价入口
// 参数：
// type：评价类型 0：评价招标方 1：评价中标方
// tenderId：招标ID
// quality：产品质量分数
// describe：描述相符分数
// attitude：服务态度分数
// speed：交付速度分数
// details：评价详情分数
// images：图片
// anonymous：是否匿名
router.post('/tenderJudgement', function(req, res, next) {
    var error
    var su = req.session.user
    var type = req.body.type
    var tenderId = req.body.tenderId
    var quality = req.body.quality
    var describe = req.body.describe
    var attitude = req.body.attitude
    var speed = req.body.speed
    var details = req.body.details
    var images = req.body.images && req.body.images !== null ? req.body.images.split(',') : []
    var anonymous = req.body.anonymous

    if (_.isEmpty(su)) {
        error = '请登陆后操作'
    } else if (_.isEmpty(tenderId)) {
        error = '招标信息ID为空'
    } else if (_.isEmpty(quality)) {
        error = '产品质量为空'
    } else if (_.isEmpty(describe)) {
        error = '描述相符为空'
    } else if (_.isEmpty(attitude)) {
        error = '服务态度为空'
    } else if (_.isEmpty(speed)) {
        error = '交付速度为空'
    } else if (_.isEmpty(details)) {
        error = '评价内容为空'
    } else if (_.isEmpty(type)) {
        error = '评价方向为空'
    } else if (_.isEmpty(anonymous)) {
        error = '是否匿名为空'
    }

    if (!error) {
        if (quality > 5) {
            error = '产品质量分数不能大于5'
        } else if (describe > 5) {
            error = '描述相符分数不能大于5'
        } else if (attitude > 5) {
            error = '服务态度分数不能大于5'
        } else if (speed > 5) {
            error = '交付速度分数不能大于5'
        }
    }

    if (error) {
        res.json({ error: error })
    } else {
        if (type == 0) {
            // 评价招标方
            Tender.findOne({ _id: tenderId, status: 6, chosenBidderUser: su._id }).populate('chosenBidderUser', 'phoneNum').exec(function(err, tender) {
                if (_.isEmpty(tender)) {
                    res.json({ error: '未查询到招标信息' })
                } else {
                    // 时间超过一个月不能互评
                    if (moment().isAfter(moment(tender.timeRcdStep5).add(30, 'month'))) {
                        res.json({ error: '评价失败，已超过一个月互评限制' })
                    } else {
                        var doc = {
                            quality: quality,
                            describe: describe,
                            attitude: attitude,
                            speed: speed,
                            total: parseInt(quality) + parseInt(describe) + parseInt(attitude) + parseInt(speed),
                            anonymous: anonymous,
                            images: images,
                            details: details,
                            tender: tender._id,
                            targetUser: tender.user,
                            user: su._id,
                            company: su.company,
                            createdAt: new Date()
                        }
                        Score.findOneAndUpdate({
                            tender: tender._id,
                            user: su._id
                        }, { $set: doc }, { upsert: true }, function(err, score) {
                            tender.timeRcdStep6 = new Date()
                            tender.save(function() {
                                //通知中标方
                                smsUtils.sendNotifySMS_qcloud(tender.chosenBidderUser.phoneNum, smsUtils.code25, [], function(err) {})
                            })
                        })
                        res.json({ result: 'success' })
                    }
                }
            })
        } else if (type == 1) {
            // 评价中标方
            Tender.findOne({ _id: tenderId, status: 6, user: su._id }, function(err, tender) {
                if (_.isEmpty(tender)) {
                    res.json({ error: '未查询到招标信息' })
                } else {
                    // 时间超过一个月不能互评
                    if (moment().isAfter(moment(tender.timeRcdStep5).add(30, 'month'))) {
                        res.json({ error: '评价失败，已超过一个月互评限制' })
                    } else {
                        var doc = {
                            quality: quality,
                            describe: describe,
                            attitude: attitude,
                            speed: speed,
                            total: parseInt(quality) + parseInt(describe) + parseInt(attitude) + parseInt(speed),
                            anonymous: anonymous,
                            images: images,
                            details: details,
                            tender: tender._id,
                            targetUser: tender.chosenBidderUser,
                            user: su._id,
                            company: su.company,
                            createdAt: new Date()
                        }
                        Score.findOneAndUpdate({
                            tender: tender._id,
                            user: su._id
                        }, { $set: doc }, { upsert: true }, function(err, score) {
                            tender.timeRcdStep6 = new Date()
                            tender.save(function() {})
                        })
                        res.json({ result: 'success' })
                    }
                }
            })
        }
    }
})


router.post('/tenderJudgementBack', function(req, res, next) {
    var error
    var su = req.session.user
    var tenderId = req.body.tenderId
    var returnDetail = req.body.returnDetail

    if (_.isEmpty(su)) {
        error = '请登陆后操作'
    } else if (_.isEmpty(tenderId)) {
        error = '招标信息ID为空'
    } else if (_.isEmpty(returnDetail)) {
        error = '回复信息为空'
    }

    if (error) {
        res.json({ error: error })
    } else {
        Score.findOneAndUpdate({
            tender: tenderId,
            targetUser: su._id
        }, { $set: { returnDetail: returnDetail } }, function(err, score) {
            if (err) {
                res.json({ error: err })
            } else if (!_.isEmpty(score)) {
                res.json({ result: 'success' })
            } else {
                res.json({ error: "更新失败" })
            }
        })
    }
})

function updateTender(res, billNum, payType, payInfo) {
    TenderBill.findOneAndUpdate({ billNum: billNum }, {
        $set: {
            billState: '已支付',
            payType: payType,
            payInfo: payInfo,
            paidAt: new Date()
        }
    }, function(err, bill) {
        if (err) {
            res.end(err)
        } else if (!_.isEmpty(bill)) {
            var transaction = new Transactions({
                transNum: bill.billNum,
                transType: bill.billType,
                price: bill.price,
                payType: payType,
                payInfo: payInfo,
                user: bill.user
            })
            transaction.save(function(err) {
                if (bill.billType == '企业保证金') {
                    Company.findOneAndUpdate({ user: bill.user }, { $inc: { depositAccount: bill.price } }, function(err, company) {
                        res.end('success')
                    })
                } else if (bill.billType == '招标保证金') {
                    // 更新保证金及可接受投标数量
                    Tender.findOneAndUpdate({ _id: bill.targetId }, {
                        $set: {
                            deposit: bill.price,
                            bidderLimit: Math.round(bill.price / 100 + 5)
                        },
                        $addToSet: { transactions: transaction._id }
                    }, function(err, tender) {
                        res.end('success')
                    })
                } else if (bill.billType == '招标定金') {
                    // 更新定金、状态步骤、步骤完成时间
                    Tender.findOneAndUpdate({ _id: bill.targetId }, {
                        $set: {
                            downpayment: bill.price,
                            status: 4,
                            timeRcdStep3: new Date()
                        },
                        $addToSet: { transactions: transaction._id }
                    }, function(err, tender) {
                        User.findById(tender.chosenBidderUser, function(err, user) {
                            if (!_.isEmpty(user)) {
                                // 通知中标方已收到定金
                                smsUtils.sendNotifySMS_qcloud(user.phoneNum, smsUtils.code9, [bill.price, moment(tender.serviceEnd).format('YYYY-MM-DD HH:mm:ss')], function(err) {})
                            }
                            User.findById(tender.user, function(err, user) {
                                if (!_.isEmpty(user)) {
                                    // 通知招标方定金支付成功
                                    smsUtils.sendNotifySMS_qcloud(user.phoneNum, smsUtils.code18, [bill.price, moment(tender.serviceEnd).format('YYYY-MM-DD HH:mm:ss')], function(err) {})
                                }
                            })
                        })
                        Company.findOneAndUpdate({ user: tender.chosenBidderUser }, { $inc: { cashAccount: bill.price } }, function(err, company) {})
                        res.end('success')
                    })
                } else if (bill.billType == '招标尾款') {
                    // 更新尾款、状态步骤、步骤完成时间
                    Tender.findOneAndUpdate({ _id: bill.targetId }, {
                        $set: {
                            finalpayment: bill.price,
                            status: 6,
                            timeRcdStep5: new Date()
                        },
                        $addToSet: { transactions: transaction._id }
                    }, function(err, tender) {
                        var su = tender.user
                        TenderBill.findOne({
                            billState: "已支付",
                            billType: '招标保证金',
                            targetId: bill.targetId
                        }, function(err, tenderBill) {
                            if (!_.isEmpty(tenderBill)) {
                                //发送短信
                                smsUtils.sendNotifySMS_qcloud(su.phoneNum, smsUtils.code7, ['招标保证金', tenderBill.price], function(err) {})
                                Transactions.update({
                                    transNum: tenderBill.billNum,
                                    transType: '招标保证金',
                                    refund: true
                                }, { multi: true }, function(err, raw) {
                                    if (err) {
                                        res.json({ error: err })
                                    } else {
                                        var payType = tenderBill.payType
                                        var transNum = moment().format('YYYYMMDDHHmmss') + _.random(1000, 9999)
                                        if (payType == '微信支付') {
                                            var refund = {
                                                out_trade_no: tenderBill.billNum,
                                                out_refund_no: transNum,
                                                total_fee: tenderBill.price*100,
                                                refund_fee: tenderBill.price*100
                                                // total_fee: 1,
                                                // refund_fee: 1
                                            }
                                            tenpay.refund(refund, function(err, result) {
                                                if (result.return_code == 'SUCCESS' &&
                                                    result.return_msg == 'OK') {
                                                    var newTran = new Transactions({
                                                        transNum: result.out_refund_no,
                                                        transType: '招标保证金退款',
                                                        price: -result.total_fee / 100,
                                                        payType: payType,
                                                        payInfo: result,
                                                        user: su
                                                    })
                                                    newTran.save(function(err) {})
                                                }
                                            })
                                        } else if (payType == '支付宝支付') {
                                            var refund = {
                                                refundNo: transNum,
                                                refundAmount: tenderBill.price
                                                // refundAmount: 0.01
                                            }
                                            alipay.refund(tenderBill.billNum, refund).then(function(result) {
                                                if (result.code == '10000' &&
                                                    result.msg == 'Success') {
                                                    var newTran = new Transactions({
                                                        transNum: moment().format('YYYYMMDDHHmmss') + _.random(1000, 9999),
                                                        transType: '招标保证金退款',
                                                        price: -result.send_back_fee,
                                                        payType: payType,
                                                        payInfo: result,
                                                        user: su
                                                    })
                                                    newTran.save(function(err) {})
                                                }
                                            }).catch(function(error) { res.end(error) })
                                        }
                                    }
                                })
                            }
                        })
                        User.findById(tender.chosenBidderUser, function(err, user) {
                            if (!_.isEmpty(user)) {
                                // 通知中标方提取定金和尾款
                                smsUtils.sendNotifySMS_qcloud(user.phoneNum, smsUtils.code5, [bill.price, tender.downpayment + bill.price], function(err) {})
                            }
                            User.findById(tender.user, function(err, user) {
                                if (!_.isEmpty(user)) {
                                    // 通知招标方进行评价
                                    smsUtils.sendNotifySMS_qcloud(user.phoneNum, smsUtils.code3, [bill.price], function(err) {})
                                }
                            })
                        })
                        Company.findOneAndUpdate({ user: tender.chosenBidderUser }, { $inc: { cashAccount: bill.price } }, function(err, company) {})
                        res.end('success')
                    })
                }
            })
        }
    })
}

router.post('/alipay-tender-cb-32askjf4nkD77S68hrq8jdjF4urj3ak58298hk53513999', function(req, res) {
    var signStatus = alipay.verifyCallback(req.body)
    if (signStatus === false) {
        return res.error('回调签名验证未通过')
    }

    var invoiceStatus = req.body['trade_status']
    if (invoiceStatus !== 'TRADE_SUCCESS') {
        return res.send('success')
    }
    var billNum = req.body['out_trade_no']

    updateTender(res, billNum, '支付宝支付', req.body)
})

router.post('/tenpay-tender-cb-83kjdjF294nkDjfakhra8894urj3958shk5137q53297S6', middleware, function(req, res) {
    var payInfo = req.weixin
    var billNum = payInfo.out_trade_no
    if (payInfo && payInfo.result_code == 'SUCCESS' && payInfo.return_code == 'SUCCESS') {
        updateTender(res, billNum, '微信支付', payInfo)
    }
})

// 自己根据招标状态搜索结果过滤接口searchTenderByStatus
// 参数：
// status（必选）：状态类型
// order（可选）：排序字段 默认{createdAt: -1}
// page（必选）：当前页面
// limit（必选）：每页记录条数 默认每页15条
router.post('/searchTenderByStatus', function(req, res, next) {
    var status = req.body.resType
    var order = { createdAt: -1 }
    var page = parseInt(req.body.page)
    var limit = parseInt(req.body.limit)
    if (!page) {
        page = 1
    }
    if (!limit) {
        limit = 5
    }

    var startNum = (page - 1) * limit
    var su = req.session.user
    if (_.isEmpty(su)) {
        res.end(settings.system_illegal_param)
    } else {
        var query = {}
        query.isCanceled = false
        query.user = su._id

        if (status == '招标中') {
            query.status = 2
            query.tenderEnd = { $gt: new Date() }
        } else if (status == '选标中') {
            query.status = 2
            query.tenderEnd = { $lt: new Date() }
        } else if (status == '已选标') {
            query.status = { $gte: 3, $lt: 6 }
        } else if (status == '已交付') {
            query.status = 6
        } else if (status == '已取消') {
            query.isCanceled = true
        }
        var resultNum = Tender.find(query).count()
        Tender.find(query).sort(order).skip(startNum).limit(limit).populate('categoryL1 categoryL2', 'name').exec(function(err, docs) {
            if (err) {
                res.end(err)
            } else if (!_.isEmpty(docs)) {
                var pageInfo = {
                    'totalItems': resultNum,
                    'currentPage': page,
                    'limit': limit,
                    'startNum': startNum + 1
                }
                var datasInfo = {
                    docs: docs,
                    pageInfo: pageInfo
                }
                res.json(datasInfo)
            } else {
                res.end('查询为空')
            }
        })
    }
})

//通过招标id找到招标信息和中标人信息
router.post('/searchTenderByBid', function(req, res, next) {

    var su = req.session.user
    if (_.isEmpty(su)) {
        res.end(settings.system_illegal_param)
    } else {
        Tender.findOne({ _id: req.body.id }).populate('categoryL1 categoryL2', 'name').populate('chosenBidder company').exec(function(err, docs) {
            if (err) {
                res.end(err)
            } else if (!_.isEmpty(docs)) {
                if (docs.chosenBidder) {
                    Company.findOne({ _id: docs.chosenBidder.company }, function(err, company) {
                        if (err) {
                            res.end(err)
                        } else if (!_.isEmpty(company)) {
                            var datasInfo = {
                                docs: docs,
                                bidCompany: company
                            }
                            res.json(datasInfo)
                        }
                    })

                } else {
                    res.end('查询不到中标人')
                }

            } else {
                res.end('查询为空')
            }
        })
    }
})

function payBillInner(req, res, bill, payType) {
    if (payType == '微信支付') {
        var notify_url = (settings.debug ? 'http://www.100ns.cn:81' : 'http://www.91zhizuo.com') + '/tender/tenpay-tender-cb-83kjdjF294nkDjfakhra8894urj3958shk5137q53297S6'

        var order = {
            out_trade_no: bill.billNum,
            body: bill.billType,
            total_fee: bill.price*100,
            // total_fee: 1,
            trade_type: 'NATIVE',
            product_id: bill.billType,
            notify_url: notify_url
        }
        tenpay.getNativePayParams(order, function(err, result) {
            if (err) {
                if (err == 'ORDERPAID') {
                    updateTender(res, bill.billName, '微信支付', null)
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
        var notify_url = (settings.debug ? 'http://www.100ns.cn:81' : 'http://www.91zhizuo.com') + '/tender/alipay-tender-cb-32askjf4nkD77S68hrq8jdjF4urj3ak58298hk53513999'

        var order = {
            tradeNo: bill.billNum, // 必填 商户订单主键, 就是你要生成的
            subject: bill.billType, // 必填 商品概要
            body: bill.billType, // 可选 订单描述
            totalAmount: bill.price,  // 必填 多少钱
            // totalAmount: 0.01,
            notifyUrl: notify_url,
            timeExpress: 30 // 可选 支付超时, 默认为5分钟
        }
        alipay.createQRPay(order).then(function(result) {
            console.log(result)
            if (result.code == '10000' &&
                result.msg == 'Success') {
                var img = qr.image(result.qr_code, { size: 10 })
                res.writeHead(200, { 'Content-Type': 'image/png' })
                img.pipe(res)
            } else {
                res.end('订单支付失败')
            }
        }).catch(function(error) { res.end(error) })
    }
}

// 第二步、第三步、第五步：支付招标保证金、支付定金、支付尾款
// 参数：
// tenderId：招标ID
// payType: 支付方式 微信支付、支付宝支付
// status：状态编码 2、3、5
router.get('/payTenderBill', function(req, res, next) {
    var su = req.session.user
    var tenderId = req.query.tenderId
    var payType = req.query.payType
    var status = !_.isEmpty(req.query.status) ? parseInt(req.query.status) : 0

    if (_.isEmpty(su)) {
        res.json(settings.system_illegal_param)
    } else if (status == 2 || status == 3 || status == 5) {
        Tender.findOne({ _id: tenderId, user: su._id, status: status }).exec(function(err, tender) {
            if(status == 3){
                TenderBill.findOne({ user: su._id, targetId: tender._id, billState: '未支付' ,billType:"招标定金"}, function(err, bill) {
                    if (err) {
                        res.end(err)
                    } else if (!_.isEmpty(bill)) {
                        payBillInner(req, res, bill, payType)
                    } else {
                        res.end('订单不存在')
                    }
                }).sort({ createdAt: -1 }).limit(1)
            }else if(status == 5){
                TenderBill.findOne({ user: su._id, targetId: tender._id, billState: '未支付',billType:"招标尾款" }, function(err, bill) {
                    if (err) {
                        res.end(err)
                    } else if (!_.isEmpty(bill)) {
                        payBillInner(req, res, bill, payType)
                    } else {
                        res.end('订单不存在')
                    }
                }).sort({ createdAt: -1 }).limit(1)
            }else {
                TenderBill.findOne({ user: su._id, targetId: tender._id, billState: '未支付', billType:"招标保证金" }, function(err, bill) {
                    if (err) {
                        res.end(err)
                    } else if (!_.isEmpty(bill)) {
                        payBillInner(req, res, bill, payType)
                    } else {
                        res.end('订单不存在')
                    }
                }).sort({ createdAt: -1 }).limit(1)
            }

        })
    } else {
        res.end('状态错误')
    }
})

// 支付企业保证金
// 参数：
// money：金额只是是2000 5000 10000中的其中一个
// payType: 支付方式 微信支付、支付宝支付
router.get('/payCompanyDeposit', function(req, res, next) {
    var su = req.session.user
    var money = req.query.money
    var payType = req.query.payType

    if (_.isEmpty(su)) {
        res.json(settings.system_illegal_param)
    } else if (money == 2000 || money == 5000 || money == 10000) {
        var doc = {
            billNum: moment().format('YYYYMMDDHHmmss') + _.random(1000, 9999),
            billType: '企业保证金',
            user: su._id,
            price: money
        }
        TenderBill.findOne({ user: su._id, billType: '企业保证金', billState: '未支付' }, function(err, bill) {
            if (err) {
                res.end(err)
            } else if (!_.isEmpty(bill)) {
                payBillInner(req, res, bill, payType)
            } else {
                var newBill = new TenderBill(doc)
                newBill.save(function(err) {
                    if (err) {
                        res.end(err)
                    } else if (!_.isEmpty(newBill)) {
                        payBillInner(req, res, newBill, payType)
                    } else {
                        res.end('订单不存在')
                    }
                })
            }
        }).sort({ createdAt: -1 }).limit(1)
    } else {
        res.end('金额错误')
    }
})


// 评论搜索结果过滤接口
// 参数：
//userId(必选)
// type（必选）: 类型 1：全部 2;含图片  3：差评
// page（必选）：当前页面
// limit（必选）：每页记录条数 默认每页15条
router.post('/searchCommentsFilter', function(req, res, next) {
        var error
        var type = req.body.type
        var userId = req.body.userId
        var page = parseInt(req.body.page)
        var limit = parseInt(req.body.limit)
        var order = { createdAt: -1 }
        if (!page) {
            page = 1
        }
        if (!limit) {
            limit = 15
        }

        if (!type || !userId) {
            error = '查询参数为空'
        }
        if (error) {
            res.end(error)
        } else {
            var startNum = (page - 1) * limit
            var isUser = userId == req.session.user._id
            var query = {}

            query.targetUser = userId
                // 类型
            if (type == "2") {
                query.images = { $not: { $size: 0 } }
            } else if (type == "3") {
                query.total = { $lt: 12 }
            }

            var resultNum = Score.find(query).count()
            Score.find(query).sort(order).skip(startNum).limit(limit).populate('company', 'companyName companyLogo').populate('tender', 'title').exec(function(err, docs) {
                if (err) {
                    res.end(err)
                } else if (!_.isEmpty(docs)) {
                    var pageInfo = {
                        'totalItems': resultNum,
                        'currentPage': page,
                        'limit': limit,
                        'startNum': startNum + 1
                    }
                    var datasInfo = {
                        docs: docs,
                        pageInfo: pageInfo,
                        isUser: isUser
                    }
                    res.json(datasInfo)
                } else {
                    res.end('查询为空')
                }
            })
        }

    })
    //提现
router.post('/insertCash', function(req, res, next) {
    var error
    var su = req.session.user

    if (_.isEmpty(req.body.payType)) {
        error = '支付方式为空'
    } else if (_.isEmpty(req.body.targetId)) {
        error = '招标id为空'
    } else if (_.isEmpty(req.body.price)) {
        error = '提现金额为空'
    } else if (_.isEmpty(req.body.status)) {
        error = '状态为空'
    } else if (_.isEmpty(req.body.vnum)) {
        error = '验证码为空'
    }

    if (_.isEmpty(su)) {
        res.json({ error: settings.system_illegal_param })
    } else if (error) {
        res.json({ error: error })
    } else {
        SMS.findOne({ phoneNum: su.phoneNum }, function(err, sms) {
            if (err) {
                res.end(err)
            } else {
                if (!_.isEmpty(sms)) {
                    var createdAt = moment(sms.createdAt, 'YYYYMMDDHHmmss')
                    var exp = createdAt.add(sms.duration, 'minutes')
                    if (sms.code == req.body.vnum) {
                        if (moment().isBefore(exp)) {
                            Tender.findOne({ _id: req.body.targetId }, function(err, tender) {
                                if (_.isEmpty(tender)) {
                                    res.json({ error: '当前招标不存在' })
                                } else if (tender.withdrawDeposit == 2 || tender.withdrawDeposit == 3) {
                                    res.json({ error: '当前招标已提现，不允许重复提现' })
                                } else {
                                    TenderCash.findOne({ targetId: req.body.targetId }, function(err, ten) {
                                        if (!_.isEmpty(ten)) {
                                            res.json({ error: '当前招标已提现，不允许重复提现' })
                                        } else {
                                            var doc = {
                                                billNum: moment().format('YYYYMMDDHHmmss') + _.random(1000, 9999),
                                                payType: req.body.payType,
                                                targetId: req.body.targetId,
                                                price: req.body.price,
                                                status: req.body.status,
                                                user: su._id,
                                                company: su.company
                                            }

                                            var tenderCash = new TenderCash(doc)
                                            tenderCash.save(function(err) {
                                                if (err) {
                                                    res.json({ error: err })
                                                } else {
                                                    // TODO 提现插入微信推送队列、短信发送队列、邮件推送队列
                                                    Tender.findByIdAndUpdate(req.body.targetId, { $set: { withdrawDeposit: 2 } }, function(err, tender1) {
                                                        if (!_.isEmpty(tender1)) {
                                                            smsUtils.sendNotifySMS_qcloud(su.phoneNum, smsUtils.code4, [req.body.price, "1-2"], function(err) {})
                                                            smsUtils.sendNotifySMS_qcloud("18627765097", smsUtils.code26, ["提现申请"], function(err) {})
                                                            res.json({ result: "success" })
                                                        } else {
                                                            res.json({ error: "提现失败" })
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })

                        } else {
                            sms.remove(function(err) {})
                            res.end('验证码已过期')
                        }
                    } else {
                        res.end('验证码错误')
                    }
                } else {
                    res.end('电话号码或验证码无效')
                }
            }
        }).sort({ createdAt: -1 }).limit(1)
    }
})


//单独验证图形验证码接口
router.post('/checkVnum',function (req,res,next) {
    var error
    if (!req.body.vnum||req.body.vnum != req.session.vnum) {
        error = '验证码错误'
    }
    if(error){
        res.json({result:"no"})
    }else {
        res.json({result:"success"})
    }
})

//投诉
//投诉类型 type 1:招标人发起投诉 2:投标人发起投诉
router.post('/insertComplain', function(req, res, next) {
    var error
    var su = req.session.user

    if (_.isEmpty(req.body.type)) {
        error = '投诉类型为空'
    } else if (_.isEmpty(req.body.tenderId)) {
        error = '招标id为空'
    } else if (_.isEmpty(req.body.details)) {
        error = '投诉内容为空'
    } else if (_.isEmpty(req.body.targetCompany)) {
        error = '被投诉的Company为空'
    } else if (_.isEmpty(req.body.company)) {
        error = '投诉Company为空'
    }

    if (_.isEmpty(su)) {
        res.json({ error: settings.system_illegal_param })
    } else if (error) {
        res.json({ error: error })
    } else {
        if (req.body.type == 1) {
            Tender.findOne({ _id: req.body.tenderId }, function(err, tender) {
                if (_.isEmpty(tender)) {
                    res.json({ error: '当前招标不存在' })
                } else if (tender.tenderComplain) {
                    res.json({ error: '已投诉，不允许重复投诉' })
                } else if(tender.bidderComplain){
                    res.json({ error: '投标方已投诉，投诉正在解决当中' })
                }else {
                    var doc = {
                        complainNum: moment().format('YYYYMMDDHHmmss') + _.random(1000, 9999),
                        tender: req.body.tenderId,
                        targetCompany: req.body.targetCompany,
                        company: req.body.company,
                        targetUser: req.body.targetUser,
                        details: req.body.details,
                        user: su._id
                    }
                    var complain = new Complain(doc)
                    complain.save(function(err) {
                        if (err) {
                            res.json({ error: err })
                        } else {
                            // TODO 投诉插入微信推送队列、短信发送队列、邮件推送队列

                            Tender.findByIdAndUpdate(req.body.tenderId, {$set: {tenderComplain: complain._id}}, function (err, tender1) {
                                if (!_.isEmpty(tender1)) {
                                    User.findOne({_id:req.body.targetUser},function (err,user) {
                                        smsUtils.sendNotifySMS_qcloud("18627765097", smsUtils.code26, ["投诉申请"], function(err) {})
                                        smsUtils.sendNotifySMS_qcloud(user.phoneNum, smsUtils.code24, ['招标方',tender.tenderNum, req.body.details], function(err) {})
                                    })
                                    res.json({result: "success"})
                                } else {
                                    res.json({error: "投诉失败"})
                                }
                            })
                        }
                    })
                }
            })
        } else if (req.body.type == 2) {
            Tender.findOne({ _id: req.body.tenderId }, function(err, tender) {
                if (_.isEmpty(tender)) {
                    res.json({ error: '当前招标不存在' })
                } else if (tender.bidderComplain) {
                    res.json({ error: '已投诉，不允许重复投诉' })
                } else if(tender.tenderComplain){
                    res.json({ error: '招标方已投诉，投诉正在解决当中' })
                }else {
                    var doc = {
                        complainNum: moment().format('YYYYMMDDHHmmss') + _.random(1000, 9999),
                        tender: req.body.tenderId,
                        targetUser: req.body.targetUser,
                        details: req.body.details,
                        targetCompany: req.body.targetCompany,
                        company: req.body.company,
                        user: su._id
                    }
                    var complain = new Complain(doc)
                    complain.save(function(err) {
                        if (err) {
                            res.json({ error: err })
                        } else {
                            // TODO 投诉插入微信推送队列、短信发送队列、邮件推送队列
                            Tender.findByIdAndUpdate(req.body.tenderId, { $set: { bidderComplain: complain._id } }, function(err, tender1) {
                                if (!_.isEmpty(tender1)) {
                                    User.findOne({_id:req.body.targetUser},function (err,user) {
                                        smsUtils.sendNotifySMS_qcloud(user.phoneNum, smsUtils.code24, ['中标方',tender.tenderNum, req.body.details], function(err) {})
                                    })
                                    res.json({result: "success"})
                                } else {
                                    res.json({ error: "投诉失败" })
                                }
                            })
                        }
                    })
                }
            })
        } else {
            res.json({ error: settings.system_illegal_param })
        }
    }
})

module.exports = router