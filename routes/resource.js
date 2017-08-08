var express = require('express')
var router = express.Router()
var url = require('url')
var _ = require('lodash')
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
var Bill = require('../models/Bill')
var Install = require('../models/publish/Install')

// 加密类
var crypto = require('crypto')
    // 系统相关操作
var system = require('../util/system')
    // 时间格式化
var moment = require('moment')
    // 站点配置
var settings = require('../models/db/settings')
var resFunc = require('../models/db/resFunc')
var shortid = require('shortid')
    // 数据校验
var filter = require('../util/filter')
    // 系统消息
var UserNotify = require('../models/UserNotify')
var Notify = require('../models/Notify')

var SMS = require('../models/SMS')
var smsUtils = require('../util/smsUtils')

var config = require('../config')

var siteFunc = require('../models/db/siteFunc')

var returnUsersRouter = function(io) {

    // 校验是否登录
    function isLogined(req) {
        return req.session.logined
    }

    router.get('/shopsecond', function(req, res, next) {
        resFunc.renderToTargetPageByType(req, res, 'shopsecond', { title: '企业二级', page: 'shopsecond' })
    })

    router.get('/vr', function(req, res, next) {
        if (isLogined(req)) {
            // res.redirect("/reIndex")
            resFunc.renderToTargetPageByType(req, res, 'vr', { title: 'VR展馆', page: '' })
        } else {
            resFunc.renderToTargetPageByType(req, res, 'vr', { title: 'VR展馆', page: '' })
        }
    })
    router.get('/newslist', function(req, res, next) {
        if (isLogined(req)) {
            // res.redirect("/reIndex")
            resFunc.renderToTargetPageByType(req, res, 'newslist', { title: '新闻列表页', page: '' })
        } else {
            resFunc.renderToTargetPageByType(req, res, 'newslist', { title: '新闻列表页', page: '' })
        }
    })
    router.get('/reportslist', function(req, res, next) {
        if (isLogined(req)) {
            // res.redirect("/reIndex")
            resFunc.renderToTargetPageByType(req, res, 'reportslist', { title: '报道列表页', page: '' })
        } else {
            resFunc.renderToTargetPageByType(req, res, 'reportslist', { title: '报道列表页', page: '' })
        }
    })
    router.get('/newscontent', function(req, res, next) {
        if (isLogined(req)) {
            // res.redirect("/reIndex")
            resFunc.renderToTargetPageByType(req, res, 'newscontent', { title: '新闻详情页', page: '' })
        } else {
            resFunc.renderToTargetPageByType(req, res, 'newscontent', { title: '新闻详情页', page: '' })
        }
    })

    router.get('/demandRelease', function(req, res, next) {
        if (isLogined(req)) {
            // res.redirect("/reIndex")
            resFunc.renderToTargetPageByType(req, res, 'demandRelease', { title: '需求发布录入页面', page: 'demandRelease' })
        } else {
            res.redirect("/users/transition")
        }
    })

    router.get('/demandReleaseEdit', function(req, res, next) {
        resFunc.renderToTargetPageByType(req, res, 'demandReleaseEdit', { title: '需求发布录入编辑页面', page: 'demandReleaseEdit' })
    })

    router.get('/01', function(req, res, next) {
        resFunc.renderToTargetPageByType(req, res, '01', { title: '材料', page: '01' })
    })

    router.get('/secondDemand', function(req, res, next) {
        resFunc.renderToTargetPageByType(req, res, 'secondDemand', { title: '二级需求', page: 'secondDemand' })
    })

    // 资源发布页面首页
    router.get('/reIndex', function(req, res, next) {
        if (isLogined(req)) {
            // res.redirect("/reIndex")
            resFunc.renderToTargetPageByType(req, res, 'resourceIndex', { title: '资源发布首页', page: 'resourceIndex' })
        } else {
            res.redirect("/users/transition")
        }
    })

    // 资源发布广告设备页面
    router.get('/shebei', function(req, res, next) {
        if (!isLogined(req)) {
            res.redirect('/users/transition')
        } else {
            resFunc.renderToTargetPageByType(req, res, 'resourceMachine', { title: '资源发布-广告设备发布', page: 'resourceMachine' })
        }
    })

    router.get('/EquipmentForEdit', function(req, res, next) {
            if (!(isLogined(req) || req.query.id)) {
                res.redirect('/users/transition')
            } else {
                resFunc.renderToTargetPageByType(req, res, 'resourceEquipmentEdit', { title: '资源发布-广告设备发布', page: 'resourceEquipmentEdit' })
            }
        })
        // 资源发布杂志广告页面
        /*  router.get('/zazhi', function (req, res, next) {
            resFunc.renderToTargetPageByType(req, res, 'resourceMagazine', {title: '资源发布-杂志广告发布',page: 'resourceMagazine'})
          })*/

    // 资源发布广告制作页面
    router.get('/zhizuo', function(req, res, next) {
        if (!isLogined(req)) {
            res.redirect('/users/transition')
        } else {
            resFunc.renderToTargetPageByType(req, res, 'resourceMake', { title: '资源发布-广告制作发布', page: 'resourceMake' })
        }
    })

    router.get('/ManufactureForEdit', function(req, res, next) {
        if (!(isLogined(req) || req.query.id)) {
            res.redirect('/users/transition')
        } else {
            resFunc.renderToTargetPageByType(req, res, 'resourceMakeEdit', { title: '资源发布-广告制作发布', page: 'resourceMakeEdit' })
        }
    })

    // 资源发布广告材料页面
    router.get('/cailiao', function(req, res, next) {
        if (!isLogined(req)) {
            res.redirect('/users/transition')
        } else {
            resFunc.renderToTargetPageByType(req, res, 'resourceMaterial', { title: '资源发布-广告材料发布', page: 'resourceMaterial' })
        }
    })

    // 发布安装的界面
    router.get('/myFix', function(req, res, next) {
        if (!isLogined(req)) {
            res.redirect('/users/transition')
        } else {
            resFunc.renderToTargetPageByType(req, res, 'myFix', { title: '资源发布-安装发布页', page: 'myFix' })
        }
    })

    // 修改安装信息的界面
    router.get('/changeMyFix', function(req, res, next) {
        if (!isLogined(req)) {
            res.redirect('/users/transition')
        } else {
            resFunc.renderToTargetPageByType(req, res, 'changeMyFix', { title: '资源发布-修改安装信息页', page: 'changeMyFix' })
        }
    })

    // 资源广告制作列表页面
    router.get('/resourceFixList', function(req, res, next) {
        resFunc.renderToTargetPageByType(req, res, 'resourceFixList', { title: '资源列表-安装列表', page: 'resourceFixList' })
    })

    router.get('/MaterialForEdit', function(req, res, next) {
            if (!(isLogined(req) || req.query.id)) {
                res.redirect('/users/transition')
            } else {
                resFunc.renderToTargetPageByType(req, res, 'resourceMaterialEdit', { title: '资源发布-广告材料发布', page: 'resourceMaterialEdit' })
            }
        })
        // 资源发布新媒体页面
        /*  router.get('/xinmeiti', function (req, res, next) {
            resFunc.renderToTargetPageByType(req, res, 'resourceNewsmedia', {title: '资源发布-新媒体发布',page: 'resourceNewsmedia'})
          })*/

    // 资源发布户外广告页面
    /*  router.get('/huwai', function (req, res, next) {
        resFunc.renderToTargetPageByType(req, res, 'resourceOut', {title: '资源发布-户外广告发布',page: 'resourceNewsOut'})
      })*/

    // 资源发布户外广告页面
    /*  router.get('/baozhi', function (req, res, next) {
        resFunc.renderToTargetPageByType(req, res, 'resourcePaper', {title: '资源发布-报纸广告发布',page: 'resourcePaper'})
      })*/

    // 资源发布广播广告页面
    /*  router.get('/guangbo', function (req, res, next) {
        resFunc.renderToTargetPageByType(req, res, 'resourceRadio', {title: '资源发布-广播广告发布',page: 'resourceRadio'})
      })*/

    // 资源发布广播广告页面
    /*  router.get('/tuiguang', function (req, res, next) {
        resFunc.renderToTargetPageByType(req, res, 'resourceSale', {title: '资源发布-营销策划发布',page: 'resourceSale'})
      })*/

    // 资源发布电视广告页面
    /* router.get('/dianshi', function (req, res, next) {
       resFunc.renderToTargetPageByType(req, res, 'resourceTv', {title: '资源发布-电视广告发布',page: 'resourceTv'})
     })*/

    // 需求详情页
    router.get('/dDemand', function(req, res, next) {
        resFunc.renderToTargetPageByType(req, res, 'dDemand', { title: '需求-详情页', page: 'dDemand' })
    })

    // 广告设备详情广告页面
    router.get('/dMachine', function(req, res, next) {
        resFunc.renderToTargetPageByType(req, res, 'dMachine', { title: '广告设备-详情页', page: 'dMachine' })
    })

    // 杂志广告详情页面
    /*  router.get('/dMagazine', function (req, res, next) {
        resFunc.renderToTargetPageByType(req, res, 'dMagazine', {title: '杂志广告-详情页',page: 'dMagazine'})
      })*/

    // 广告制作详情页面
    router.get('/dMake', function(req, res, next) {
        resFunc.renderToTargetPageByType(req, res, 'dMake', { title: '广告制作-详情页', page: 'dMake' })
    })

    // 广告材料详情页面
    router.get('/dMaterial', function(req, res, next) {
        resFunc.renderToTargetPageByType(req, res, 'dMaterial', { title: '广告材料-详情页', page: 'dMaterial' })
    })

    // 新媒体广告详情页面
    /*  router.get('/dNewMedia', function (req, res, next) {
        resFunc.renderToTargetPageByType(req, res, 'dNewMedia', {title: '新媒体-详情页',page: 'dNewMedia'})
      })*/

    // 户外广告详情页面
    /*  router.get('/dOut', function (req, res, next) {
        resFunc.renderToTargetPageByType(req, res, 'dOut', {title: '户外广告-详情页',page: 'dOut'})
      })*/

    // 户外广告详情页面
    /*
      router.get('/dPaper', function (req, res, next) {
        resFunc.renderToTargetPageByType(req, res, 'dPaper', {title: '广告材料-详情页',page: 'dPaper'})
      })
    */

    // 营销策划详情页面
    /*  router.get('/dSale', function (req, res, next) {
        resFunc.renderToTargetPageByType(req, res, 'dSale', {title: '营销策划-详情页',page: 'dSale'})
      })*/

    // 电视广告详情页面
    /*  router.get('/dTv', function (req, res, next) {
        resFunc.renderToTargetPageByType(req, res, 'dTv', {title: '电视广告-详情页',page: 'dTv'})
      })*/

    // 广播广告详情页面
    /*  router.get('/dRadio', function (req, res, next) {
        resFunc.renderToTargetPageByType(req, res, 'dRadio', {title: '广播广告-详情页',page: 'dRadio'})
      })*/

    router.get('/equipment/:typeThree', function(req, res, next) {
        if (!!(req.params.typeThree || req.params.typeThree != '')) {
            resFunc.renderToTargetPageByType(req, res, 'resourceListMachine', { title: '资源列表-广告设备页', page: 'resourceListMachine' })
        } else {
            next()
        }
    })

    router.get('/manufacture/:typeThree', function(req, res, next) {
        if (!!(req.params.typeThree || req.params.typeThree != '')) {
            resFunc.renderToTargetPageByType(req, res, 'resourceListMake', { title: '资源列表-广告制作页', page: 'resourceListMake' })
        } else {
            next()
        }
    })

    router.get('/material/:typeThree', function(req, res, next) {
        if (!!(req.params.typeThree || req.params.typeThree != '')) {
            resFunc.renderToTargetPageByType(req, res, 'resourceListMaterial', { title: '资源列表-广告材料页', page: 'resourceListMaterial' })
        } else {
            next()
        }
    })

    // 资源广告设备列表页面
    router.get('/resourceListMachine', function(req, res, next) {
        resFunc.renderToTargetPageByType(req, res, 'resourceListMachine', { title: '资源列表-广告设备页', page: 'resourceListMachine' })
    })

    // 资源广告制作列表页面
    router.get('/resourceListMake', function(req, res, next) {
            resFunc.renderToTargetPageByType(req, res, 'resourceListMake', { title: '资源列表-广告制作页', page: 'resourceListMake' })
        })
        // 资源广告全部列表页面
    router.get('/resourceListAll', function(req, res, next) {
        resFunc.renderToTargetPageByType(req, res, 'resourceListAll', { title: '资源列表-广告全部页', page: 'resourceListAll' })
    })

    // 资源广告材料列表页面
    router.get('/resourceListMaterial', function(req, res, next) {
        resFunc.renderToTargetPageByType(req, res, 'resourceListMaterial', { title: '资源列表-广告材料页', page: 'resourceListMaterial' })
    })

    // 资源广告材料列表页面
    router.get('/digitalMagazine', function(req, res, next) {
        resFunc.renderToTargetPageByType(req, res, 'digitalMagazine', { title: '品牌推广-数字期刊', page: 'digitalMagazine' })
    })

    // 品牌推广页面
    router.get('/brandWin', function(req, res, next) {
        resFunc.renderToTargetPageByType(req, res, 'brandWin', { title: '品牌推广-品牌推广', page: 'brandWin' })
    })

    // 资源新增和更新接口
    // 参数：
    // resType：资源类别名称 Manufacture\Material\Equipment
    // region：所在地区
    // categoryL1：一级类目ID
    // categoryL2：二级类目ID
    // categoryL3：三级类目ID
    // originalPrice：原价
    // discountPrice：折扣价
    // images：图片数组
    // title：标题
    // contacts：联系人
    // phoneNum：联系电话
    // details：详情
    // promotion：精准推广对象{period: '', regions: []}
    router.post('/updateOrInsertRes', function(req, res, next) {
        var error
        var su = req.session.user
            // 必填项：地域、类别、原价、折扣价、图片、标题、联系人、联系方式、详细信息
        if (_.isEmpty(req.body.region)) {
            error = '地域为空'
        } else if (_.isEmpty(req.body.categoryL1)) {
            error = '一级类目为空'
        } else if (_.isEmpty(req.body.categoryL2)) {
            error = '二级类目为空'
        } else if (_.isEmpty(req.body.categoryL3)) {
            error = '三级类目为空'
        } else if (_.isEmpty(req.body.images) || !_.isArray(req.body.images)) {
            error = '上传图片为空'
        } else if (_.isEmpty(req.body.title) || req.body.title.length < 10 || req.body.title.length > 50) {
            error = '标题长度需大于10小于50个字符'
        } else if (_.isEmpty(req.body.contacts)) {
            error = '联系人为空'
        } else if (_.isEmpty(req.body.phoneNum)) {
            error = '联系方式为空'
        }

        if (!validator.isNumeric(req.body.originalPrice)) {
            delete req.body.originalPrice
        }
        if (!validator.isNumeric(req.body.discountPrice)) {
            delete req.body.discountPrice
            delete req.body.originalPrice
        }

        if (_.isEmpty(su)) {
            res.json({ error: 'settings.system_illegal_param' })
        } else if (error) {
            res.json({ error: error })
        } else {
            var params = url.parse(req.url, true)
            var uid = params.query.uid
            if (uid) {
                PubHistory.findOne({ resNum: uid }, { user: 1 }, function(err, doc) {
                    if (!_.isEmpty(doc) && doc.user == su._id) {
                        req.body.refreshedAt = new Date()
                        PubHistory.update({ resNum: uid }, { $set: req.body }, function(err, result) {
                            if (err) {
                                res.json({ error: err })
                            } else {
                                res.json({
                                    'result': 'success'
                                })
                            }
                        })
                    } else {
                        res.json({
                            'result': '更新失败'
                        })
                    }
                })
            } else { // 新增资源
                req.body.user = su._id
                req.body.resNum = moment().format('YYYYMMDDHHmmss') + _.random(10000, 99999)
                var pubHistory = new PubHistory(req.body)
                pubHistory.save(function(err) {
                    if (err) {
                        res.json({ error: err })
                    } else {
                        var promotion = req.body.promotion
                            // 开始精准推广流程 
                        if (!_.isEmpty(promotion)) {
                            // 1、计算价格
                            var period = promotion.period
                            var regions = promotion.regions
                            var provinceNum = regions.length
                            var payType = promotion.payType
                            var totalPrice = 0
                            var discountPrice = 0
                            totalPrice += PriceConfig2.precisePromotionPrice
                            if (period == '1季度') {
                                totalPrice *= 3
                                discountPrice = totalPrice * provinceNum * PriceConfig2.discountOneQuarter * PriceConfig2.discountRate[provinceNum - 1]
                            } else if (period == '半年') {
                                totalPrice *= 6
                                discountPrice = totalPrice * provinceNum * PriceConfig2.discountHalfYear * PriceConfig2.discountRate[provinceNum - 1]
                            } else if (period == '1年') {
                                totalPrice *= 12
                                discountPrice = totalPrice * provinceNum * PriceConfig2.discountOneYear * PriceConfig2.discountRate[provinceNum - 1]
                            }

                            // 2、生成订单
                            var bill = new Bill({ billNum: moment().format('YYYYMMDDHHmmss') + _.random(10000, 99999), billName: '精准推广服务', billType: '服务', payType: payType, user: su._id, price: Math.round(discountPrice) })
                            bill.save(function(err) {
                                if (err) {
                                    res.json({ error: err })
                                } else {
                                    // 3、写promotion表
                                    var doc = { period: period, regions: regions, category: req.body.categoryL1, pubHistory: pubHistory._id, bill: bill._id, user: su._id }
                                    var pp = new PrecisePromotion(doc)
                                    pp.save(function(err) {
                                        if (err) {
                                            res.json({ error: err })
                                        } else {
                                            // 发送短信给用户告知精准推广服务费订单已生成
                                            smsUtils.sendNotifySMS_qcloud(su.phoneNum, smsUtils.code15, ['精准推广服务'], function(err) {})
                                            res.json({
                                                'result': 'success',
                                                'billReady': true,
                                                'billNum': bill.billNum
                                            })
                                        }
                                    })
                                }
                            })
                        } else {
                            res.json({
                                'result': 'success'
                            })
                        }
                    }
                })
            }
        }
    })

    // 发布需求发布接口
    router.post('/uploadDemandRelease', function(req, res, next) {
        var error
        var su = req.session.user
        if (_.isEmpty(req.body.region)) {
            error = '地域为空，格式错误'
        } else if (_.isEmpty(req.body.classify)) {
            error = '行业为空'
        } else if (_.isEmpty(req.body.categoryL1)) {
            error = '需求类别为空'
        } else if (_.isEmpty(req.body.categoryL2)) {
            error = '需求子类别为空'
        } else if (_.isEmpty(req.body.price)) {
            error = '原价为空，格式错误'
        } else if (_.isEmpty(req.body.title || req.body.title.length < 10 || req.body.title.length > 50)) {
            error = '标题长度需大于10小于50个字符'
        } else if (_.isEmpty(req.body.contacts)) {
            error = '联系人为空'
        } else if (_.isEmpty(req.body.phoneNum)) {
            error = '联系方式为空，格式错误'
        } else if (_.isEmpty(req.body.details) || req.body.details.length < 20) {
            error = '请输入大于20个字的详细信息'
        }

        if (_.isEmpty(su)) {
            res.end(settings.system_illegal_param)
        } else if (error) {
            res.end(error)
        } else {
            if(req.body.isEdit=="true"){
                Demands.findOneAndUpdate({_id:req.body.demandId},{$set:req.body},function (err,demands) {
                    if (err) {
                        res.end(err)
                    } else if(!_.isEmpty(demands)){
                        res.json({
                            'result': 'success'
                        })
                    }
                })
            }else {
                User.findOne({ _id: su._id }, function(err, user) {
                    if (err) {
                        res.end(err)
                    } else {
                        req.body.user = su._id
                        req.body.resNum = moment().format('YYYYMMDDHHmmss') + _.random(10000, 99999)
                        var demands = new Demands(req.body)
                        demands.save(function(err) {
                            if (err) {
                                res.end(err)
                            } else {
                                res.json({
                                    'result': 'success'
                                })
                            }
                        })
                    }
                })

            }
        }
    })

    // 通过父类别得到子类别
    router.post('/getChildType', function(req, res, next) {
        var error
        var su = req.session.user
        if (_.isEmpty(su)) {
            res.end(settings.system_illegal_param)
        } else {
            var currentCateList = ContentCategory.find({ parentID: req.body.parentID, state: '1' }).sort({ 'sortId': 1 })
            res.json({
                currentCateList: currentCateList
            })
        }
    })

    // 新建或修改安装信息
    router.post('/updateOrInsertInstall', function(req, res, next) {
        var error
        var su = req.session.user
            // 必填项：标题、服务地区、联系方式、联系人、详情
        if (_.isEmpty(req.body.title) || req.body.title.length > 50) {
            error = '请输入50个字以内的标题'
        } else if (_.isEmpty(req.body.serviceRegion)) {
            error = '服务地区为空'
        } else if (_.isEmpty(req.body.phoneNum)) {
            error = '联系方式为空'
        } else if (_.isEmpty(req.body.name)) {
            error = '联系人为空'
        } else if (_.isEmpty(req.body.details) || req.body.details.length < 10 ) {
            error = '请输入大于20个字以上的详情信息'
        }

        if (_.isEmpty(su)) {
            res.end(settings.system_illegal_param)
        } else if (error) {
            res.end(error)
        } else {
            var params = url.parse(req.url, true)
            var uid = params.query.uid
            if (uid) { // 更新安装信息
                Install.findOneAndUpdate({ _id: uid, user: su._id, isDeleted: false }, { $set: req.body }, function(err, doc) {
                    if (err) {
                        res.end(err)
                    } else if (!_.isEmpty(doc)) {
                        res.json({
                            'result': 'success'
                        })
                    } else {
                        res.json({
                            'result': '更新失败'
                        })
                    }
                })
            } else { // 新增安装信息
                req.body.user = su._id

                var install = new Install(req.body)
                install.save(function(err) {
                    if (err) {
                        res.end(err)
                    } else {
                        res.json({
                            'result': 'success'
                        })
                    }
                })
            }
        }
    })

    // pc需要验证手机的方式新建或修改安装信息
    router.post('/webUpdateOrInsertInstall', function(req, res, next) {
        var error
        var su = req.session.user
        var code = req.body.code;
        // 必填项：标题、服务地区、联系方式、联系人、详情
        if (_.isEmpty(req.body.title) || req.body.title.length > 50) {
            error = '请输入50个字以内的标题'
        } else if (_.isEmpty(req.body.serviceRegion)) {
            error = '服务地区为空'
        } else if (_.isEmpty(req.body.phoneNum)) {
            error = '联系方式为空'
        } else if (_.isEmpty(req.body.name)) {
            error = '联系人为空'
        } else if (_.isEmpty(req.body.details) || req.body.details.length < 10 || req.body.details.length > 200) {
            error = '请输入10到200个字的详情信息'
        }

        if (_.isEmpty(su)) {
            res.end(settings.system_illegal_param)
        } else if (error) {
            res.end(error)
        } else {
            var params = url.parse(req.url, true)
            var uid = params.query.uid
            if (uid) { // 更新安装信息
                /*更新信息新号码校验的过程开始*/
                if (error) {
                    res.end(error)
                } else {
                    // 校验短信验证码
                    var phoneNum = req.body.phoneNum;
                    SMS.findOne({ phoneNum: phoneNum }, function(err, sms) {
                        if (err) {
                            res.end(err)
                        } else {
                            if (!_.isEmpty(sms)) {
                                var createdAt = moment(sms.createdAt, 'YYYYMMDDHHmmss')
                                var exp = createdAt.add(sms.duration, 'minutes')
                                if (sms.code == code) {
                                    if (moment().isBefore(exp)) {
                                        /*测试卷开始*/
                                        Install.findOneAndUpdate({ _id: uid, user: su._id, isDeleted: false }, { $set: { title: req.body.title, serviceRegion: req.body.serviceRegion, phoneNum: req.body.phoneNum, name: req.body.name, details: req.body.details } }, function(err, doc) {
                                                if (err) {
                                                    res.end(err)
                                                } else if (!_.isEmpty(doc)) {
                                                    res.json({
                                                        'result': 'success'
                                                    })
                                                } else {
                                                    res.json({
                                                        'result': '更新失败'
                                                    })
                                                }
                                            })
                                            /*测试卷开始*/
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
                /*更新信息新号码校验的过程结束*/
            } else { // 新增安装信息
                req.body.user = su._id
                    //校验验证码开始
                if (error) {
                    res.end(error)
                } else {
                    // 校验短信验证码
                    var phoneNum = req.body.phoneNum;
                    SMS.findOne({ phoneNum: phoneNum }, function(err, sms) {
                        if (err) {
                            res.end(err)
                        } else {
                            if (!_.isEmpty(sms)) {
                                var createdAt = moment(sms.createdAt, 'YYYYMMDDHHmmss')
                                var exp = createdAt.add(sms.duration, 'minutes')
                                if (sms.code == code) {
                                    if (moment().isBefore(exp)) {
                                        //安装信息录入
                                        var install = new Install({ title: req.body.title, serviceRegion: req.body.serviceRegion, phoneNum: req.body.phoneNum, name: req.body.name, details: req.body.details })
                                        install.save(function(err) {
                                            if (err) {
                                                res.end(err)
                                            } else {
                                                res.json({
                                                    'result': 'success'
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
                //校验验证码结束
            }
        }
    })

    // 查询安装信息
    router.post('/queryInstalls', function(req, res, next) {
        var text = req.body.text
        var serviceRegion = req.body.region
        var order = { refreshedAt: -1 }

        var page = parseInt(req.body.page)
        var limit = parseInt(req.body.limit)
        if (!page) {
            page = 1
        }
        if (!limit) {
            limit = 15
        }
        var startNum = (page - 1) * limit

        // 最多只能显示100条数据，防止八爪鱼等软件爬取数据
        if (startNum >= 100) {
            res.end('请输入更详细的查询条件')
        } else {
            if (_.isEmpty(req.body.text)) {
                text = ''
            } else if (!_.isEmpty(req.body.text) || req.body.title.text > 30) {
                text = text.substr(0, 30)
            }

            if (!_.isEmpty(req.body.order)) {
                order = req.body.order
            }

            var query = {}
            if (!_.isEmpty(serviceRegion.province) && _.isEmpty(serviceRegion.city) && _.isEmpty(serviceRegion.district)) {
                query = {
                    'serviceRegion.province': serviceRegion.province
                }
            } else if (!_.isEmpty(serviceRegion.province) && !_.isEmpty(serviceRegion.city) && _.isEmpty(serviceRegion.district)) {
                query = {
                    'serviceRegion.province': serviceRegion.province,
                    'serviceRegion.city': serviceRegion.city
                }
            } else if (!_.isEmpty(serviceRegion.province) && !_.isEmpty(serviceRegion.city) && !_.isEmpty(serviceRegion.district)) {
                query = {
                    serviceRegion: serviceRegion
                }
            }
            if (text) {
                query.title = { $regex: new RegExp(text, 'i') }
            }

            query.isDeleted = false

            var resultNum = Install.find(query).count()
            Install.find(query, function(err, docs) {
                if (err) {
                    res.end(err)
                } else if (!_.isEmpty(docs)) {
                    var pageInfo = {
                        'totalItems': resultNum,
                        'currentPage': page,
                        'limit': limit,
                        'sta rtNum': startNum + 1
                    }
                    var datasInfo = {
                        docs: docs,
                        pageInfo: pageInfo
                    }
                    res.json(datasInfo)
                } else {
                    res.end('查询为空')
                }
            }).sort(order).skip(startNum).limit(limit)
        }
    })

    //刷新当前的安装的信息
    router.post('/refreshFixRes', function(req, res, next) {
        var su = req.session.user
        var resId = req.body.resId
        if (_.isEmpty(su)) {
            res.end(settings.system_illegal_param)
        } else {
            Install.findOneAndUpdate({ _id: resId, user: su._id, isDeleted: false, isShowing: true }, { $set: { refreshedAt: Date.now() } }, function(err, doc) {
                if (err) {
                    res.end(err)
                } else if (!_.isEmpty(doc)) {
                    res.end('success')
                } else {
                    res.end('更新失败')
                }
            })
        }
    })

    //刷新安装浏览量
    router.post('/incInstallPageview', function(req, res, next) {
        var resId = req.body.resId
        Install.findOneAndUpdate({ _id: resId, isDeleted: false, isShowing: true }, { $inc: { pageview: 1 } }, function(err, doc) {
            if (err) {
                res.end(err)
            } else {
                res.end('success')
            }
        })
    })

    // 查询个人安装信息
    router.post('/queryUserCenterInstalls', function(req, res, next) {
        var su = req.session.user
        var text = req.body.text
        var serviceRegion = req.body.region
        var order = { refreshedAt: -1 }

        var page = parseInt(req.body.page)
        var limit = parseInt(req.body.limit)
        if (!page) {
            page = 1
        }
        if (!limit) {
            limit = 15
        }
        var startNum = (page - 1) * limit

        if (_.isEmpty(req.body.text)) {
            text = ''
        } else if (!_.isEmpty(req.body.text) || req.body.title.text > 30) {
            text = text.substr(0, 30)
        }

        if (!_.isEmpty(req.body.order)) {
            order = req.body.order
        }

        var query = {}

        query.isDeleted = false
        query.user = su._id;

        var resultNum = Install.find(query).count()
        Install.find(query, function(err, docs) {
            if (err) {
                res.end(err)
            } else if (!_.isEmpty(docs)) {
                var pageInfo = {
                    'totalItems': resultNum,
                    'currentPage': page,
                    'limit': limit,
                    'sta rtNum': startNum + 1
                }
                var datasInfo = {
                    docs: docs,
                    pageInfo: pageInfo
                }
                res.json(datasInfo)
            } else {
                res.end('查询为空')
            }
        }).sort(order).skip(startNum).limit(limit)
    })

    // 删除我的安装信息
    router.post('/deleteMyInstall', function(req, res, next) {
        var error
        var su = req.session.user
        var id = req.body.id

        if (_.isEmpty(su)) {
            res.end(settings.system_illegal_param)
        } else {
            Install.findOneAndUpdate({ _id: id, user: su._id }, { $set: { isDeleted: true } }, function(err, doc) {
                if (err) {
                    res.end(err)
                } else if (!_.isEmpty(doc)) {
                    res.json({
                        'result': 'success'
                    })
                } else {
                    res.json({
                        'result': '更新失败'
                    })
                }
            })
        }
    })

    // 我的安装信息显示开关接口
    router.post('/triggerMyInstallShowing', function(req, res, next) {
        var su = req.session.user
        var id = req.body.id

        if (_.isEmpty(su)) {
            res.end(settings.system_illegal_param)
        } else {
            Install.findOne({ _id: id, user: su._id }, function(err, doc) {
                if (err) {
                    res.end(err)
                } else if (!_.isEmpty(doc)) {
                    doc.isShowing = !doc.isShowing
                    doc.save(function(err) {
                        if (err) {
                            res.end(err)
                        } else {
                            res.end('success')
                        }
                    })
                } else {
                    res.end('操作失败')
                }
            })
        }
    })

    return router
}

module.exports = returnUsersRouter