var express = require('express')
var router = express.Router()
var _ = require('lodash')
var url = require('url')
var moment = require('moment')
var DbOpt = require('../models/Dbopt')
var request=require('request')

var AdminGroup = require('../models/AdminGroup')
var Advice = require('../models/Advice')
var validator = require('validator')
var settings = require('../models/db/settings')
var adminFunc = require('../models/db/adminFunc')
var shortid = require('shortid')
var SMS = require('../models/SMS')
var smsUtils = require('../util/smsUtils')

var CategoryRecommend = require('../models/admincenter/CategoryRecommend')
var CategorySetting = require('../models/admincenter/CategorySetting')
var Ebook = require('../models/admincenter/Ebook')
var News = require('../models/admincenter/News')
var BrandPromotion = require('../models/admincenter/BrandPromotion')
var PrecisePromotion = require('../models/admincenter/PrecisePromotion')
var Slide = require('../models/admincenter/Slide')
var VR = require('../models/admincenter/VR')
var Bill = require('../models/Bill')
var Company = require('../models/Company')
var Content = require('../models/Content')
var Tender = require('../models/tender/Tender')
var TenderCash = require('../models/tender/TenderCash')
var Complain = require('../models/tender/Complain')
var TenderBill = require('../models/tender/TenderBill')
var Transactions = require('../models/tender/Transactions')
var Bid = require('../models/tender/Bid')
var SearchRecommend = require('../models/admincenter/SearchRecommend')
var CompanyIdentify = require('../models/CompanyIdentify')
var IdCardIdentify = require('../models/IdCardIdentify')
var User = require('../models/User')
var WxCheck = require('../models/WxCheck')
var Wx = require('../models/Wx')
var PriceConfig = require('../models/admincenter/PriceConfig')
var PubHistory = require('../models/publish/PubHistory')


router.caseSensitive = true

// router.get('/manage/adviceMng', function(req, res) {
//     if (adminFunc.checkAdminPower(req, 'promotionManage_view')) {
//         res.render('manage/lanmai/brandPromotionMng', adminFunc.setBrandPromotionMngPageInfo(req, res, settings.promotionManage))
//     } else {
//         res.render('manage/public/notice', adminFunc.setDataForInfo('danger', '对不起，您无权查看 <strong>' + settings['promotionManage'][1] + '</strong> 模块！'))
//     }
// })
router.get('/manage/brandPromotionMng', function(req, res) {
    if (adminFunc.checkAdminPower(req, 'promotionManage_view')) {
        res.render('manage/lanmai/brandPromotionMng', adminFunc.setBrandPromotionMngPageInfo(req, res, settings.promotionManage))
    } else {
        res.render('manage/public/notice', adminFunc.setDataForInfo('danger', '对不起，您无权查看 <strong>' + settings['promotionManage'][1] + '</strong> 模块！'))
    }
})
router.get('/manage/articlecontentManage', function(req, res) {
    if (adminFunc.checkAdminPower(req, 'articleManage_content_view')) {
        res.render('manage/lanmai/article', adminFunc.setPageInfoforarticle(req, res, ['articleManage_content', '文章管理']))
    } else {
        res.render('manage/public/notice', adminFunc.setDataForInfo('danger', '对不起，您无权查看 <strong>' + '文章管理' + '</strong> 模块！'))
    }
})
router.get('/manage/articleManage', function(req, res) {
    if (adminFunc.checkAdminPower(req, 'articleManage_cateGory_view')) {
        res.render('manage/lanmai/articleCategorys', adminFunc.setPageInfo(req, res, ['articleManage_cateGory', '文章类别管理']))
    } else {
        res.render('manage/public/notice', adminFunc.setDataForInfo('danger', '对不起，您无权查看 <strong>' + '文章类别管理' + '</strong> 模块！'))
    }
})

router.get('/manage/newsManage', function(req, res) {
    if (adminFunc.checkAdminPower(req, 'newsManage_view')) {
        res.render('manage/lanmai/news', adminFunc.setPageInfo(req, res, ['newsManage', '新闻管理']))
    } else {
        res.render('manage/public/notice', adminFunc.setDataForInfo('danger', '对不起，您无权查看 <strong>' + '新闻管理' + '</strong> 模块！'))
    }
})
router.get('/manage/precisePromotion', function(req, res) {
    if (adminFunc.checkAdminPower(req, 'prcdManage_view')) {
        res.render('manage/lanmai/PrecisePromotion', adminFunc.setBrandPromotionMngPageInfo(req, res, settings.PrecisePromotion))
    } else {
        res.render('manage/public/notice', adminFunc.setDataForInfo('danger', '对不起，您无权查看 <strong>' + settings['PrecisePromotion'][1] + '</strong> 模块！'))
    }
})
router.get('/manage/TenderManage', function(req, res) {
    if (adminFunc.checkAdminPower(req, 'TenderManage_view')) {
        res.render('manage/lanmai/TenderManage', adminFunc.setPageInfo(req, res, ['TenderManage', '招投标管理']))
    } else {
        res.render('manage/public/notice', adminFunc.setDataForInfo('danger', '对不起，您无权查看 <strong>' + '招投标管理' + '</strong> 模块！'))
    }
})
router.get('/manage/complainManage', function(req, res) {
    if (adminFunc.checkAdminPower(req, 'complainManage_view')) {
        res.render('manage/lanmai/complainManage', adminFunc.setPageInfo(req, res, ['complainManage', '投诉管理']))
    } else {
        res.render('manage/public/notice', adminFunc.setDataForInfo('danger', '对不起，您无权查看 <strong>' + '投诉管理' + '</strong> 模块！'))
    }
})
router.get('/manage/withdrawCashManage', function(req, res) {
    if (adminFunc.checkAdminPower(req, 'withdrawCashManage_view')) {
        res.render('manage/lanmai/withdrawCashManage', adminFunc.setPageInfo(req, res, ['withdrawCashManage', '提现管理']))
    } else {
        res.render('manage/public/notice', adminFunc.setDataForInfo('danger', '对不起，您无权查看 <strong>' + '提现管理' + '</strong> 模块！'))
    }
})

// 数字期刊
router.get('/manage/adviceMng', function(req, res) {
    if (adminFunc.checkAdminPower(req, 'ebookManage_view')) {
        res.render('manage/lanmai/ebookManage', adminFunc.setPageInfo(req, res, settings.ebookManage))
    } else {
        res.render('manage/public/notice', adminFunc.setDataForInfo('danger', '对不起，您无权查看 <strong>' + settings['ebookManage'][1] + '</strong> 模块！'))
    }
})
router.get('/manage/baoxiuManage', function(req, res) {
    if (adminFunc.checkAdminPower(req, 'baoxiuManage_view')) {
        res.render('manage/lanmai/baoxiuManage', adminFunc.setPageInfo(req, res, ['baoxiuManage', '报修管理']))
    } else {
        res.render('manage/public/notice', adminFunc.setDataForInfo('danger', '对不起，您无权查看 <strong>' + '报修' + '</strong> 模块！'))
    }
})
router.get('/manage/jianyiManage', function(req, res) {
    if (adminFunc.checkAdminPower(req, 'jianyiManage_view')) {
        res.render('manage/lanmai/jianyiManage', adminFunc.setPageInfo(req, res,['jianyiManage', '建议管理'] ))
    } else {
        res.render('manage/public/notice', adminFunc.setDataForInfo('danger', '对不起，您无权查看 <strong>' + '建议' + '</strong> 模块！'))
    }
})
// 数字期刊添加页面(默认)
router.get('/manage/addEbookManage', function(req, res) {
    if (!_.isEmpty(req.query.uid)) {
        if (adminFunc.checkAdminPower(req, 'ebookManage_modify')) {
            adminFunc.setPageInfoForAddEbookManage(req, res, ['ebookManage_add', '修改数字期刊'], 'manage/lanmai/addEbookManage')
        } else {
            res.render('manage/public/notice', adminFunc.setDataForInfo('danger', '对不起，您无权修改 <strong>' + settings['ebookManage'][1] + '</strong> 模块！'))
        }
    } else {
        if (adminFunc.checkAdminPower(req, 'ebookManage_add')) {
            res.render('manage/lanmai/addEbookManage', adminFunc.setPageInfo(req, res, ['ebookManage_add', '新增数字期刊']))
        } else {
            res.render('manage/public/notice', adminFunc.setDataForInfo('danger', '对不起，您无权新增 <strong>' + settings['ebookManage'][1] + '</strong> 模块！'))
        }
    }
})

// vr展馆
router.get('/manage/vrManage', function(req, res) {
    if (adminFunc.checkAdminPower(req, 'vrManage_view')) {
        res.render('manage/lanmai/vrManage', adminFunc.setPageInfo(req, res, settings.vrManage))
    } else {
        res.render('manage/public/notice', adminFunc.setDataForInfo('danger', '对不起，您无权查看 <strong>' + settings['vrManage'][1] + '</strong> 模块！'))
    }
})

// vr展馆添加页面
router.get('/manage/addVrManage', function(req, res) {
    if (!_.isEmpty(req.query.uid)) {
        if (adminFunc.checkAdminPower(req, 'vrManage_modify')) {
            adminFunc.setPageInfoForAddVrManage(req, res, ['vrManage_add', '修改VR'], 'manage/lanmai/addVrManage')
        } else {
            res.render('manage/public/notice', adminFunc.setDataForInfo('danger', '对不起，您无权修改 <strong>' + settings['vrManage'][1] + '</strong> 模块！'))
        }
    } else {
        if (adminFunc.checkAdminPower(req, 'vrManage_add')) {
            res.render('manage/lanmai/addVrManage', adminFunc.setPageInfo(req, res, ['vrManage_add', '新增VR']))
        } else {
            res.render('manage/public/notice', adminFunc.setDataForInfo('danger', '对不起，您无权新增 <strong>' + settings['vrManage'][1] + '</strong> 模块！'))
        }
    }
})

// 首页轮播图
router.get('/manage/slideManage', function(req, res) {
    if (adminFunc.checkAdminPower(req, 'slideManage_view')) {
        res.render('manage/lanmai/slideManage', adminFunc.setPageInfo(req, res, ['slideManage', '首页轮播图']))
    } else {
        res.render('manage/public/notice', adminFunc.setDataForInfo('danger', '对不起，您无权查看 <strong>' + '首页轮播图' + '</strong> 模块！'))
    }
})

// 首页轮播图添加页面(默认)
router.get('/manage/addSlideManage', function(req, res) {
    if (!_.isEmpty(req.query.uid)) {
        if (adminFunc.checkAdminPower(req, 'slideManage_modify')) {
            adminFunc.setPageInfoForAddSlideManage(req, res, ['slideManage', '修改首页轮播图'], 'manage/lanmai/addSlideManage')
        } else {
            res.render('manage/public/notice', adminFunc.setDataForInfo('danger', '对不起，您无权修改 <strong>' + settings['ebookManage'][1] + '</strong> 模块！'))
        }
    } else {
        if (adminFunc.checkAdminPower(req, 'slideManage_add')) {
            res.render('manage/lanmai/addSlideManage', adminFunc.setPageInfo(req, res, ['slideManage', '新增首页轮播图']))
        } else {
            res.render('manage/public/notice', adminFunc.setDataForInfo('danger', '对不起，您无权新增 <strong>' + settings['ebookManage'][1] + '</strong> 模块！'))
        }
    }
})

// 搜索推荐
router.get('/manage/searchRcdManage', function(req, res) {
    if (adminFunc.checkAdminPower(req, 'searchRcdManage_view')) {
        res.render('manage/lanmai/searchRcdManage', adminFunc.setPageInfo(req, res, ['searchRcdManage', '搜索推荐']))
    } else {
        res.render('manage/public/notice', adminFunc.setDataForInfo('danger', '对不起，您无权查看 <strong>' + '搜索推荐' + '</strong> 模块！'))
    }
})

// 二级栏目设置推荐
router.get('/manage/categorySettingMng', function(req, res) {
    if (adminFunc.checkAdminPower(req, 'categorySettingMng_view')) {
        res.render('manage/lanmai/categorySettingMng', adminFunc.setPageInfo(req, res, ['categorySettingMng', '二级栏目设置及推荐']))
    } else {
        res.render('manage/public/notice', adminFunc.setDataForInfo('danger', '对不起，您无权查看 <strong>' + '二级栏目设置' + '</strong> 模块！'))
    }
})

// 信息审核
router.get('/manage/userManage_verify', function(req, res) {
    if (adminFunc.checkAdminPower(req, 'userManage_verify_view')) {
        res.render('manage/lanmai/userManage_verify', adminFunc.setPageInfo(req, res, ['userManage_verify', '信息审核']))
    } else {
        res.render('manage/public/notice', adminFunc.setDataForInfo('danger', '对不起，您无权查看 <strong>' + '信息审核' + '</strong> 模块！'))
    }
})

router.post('/manage/wxMenu', function(req, res, next) {
    var requestData={
        "button":[
            {
                "type":"view",
                "name":"找制作",
                "url":"http://www.adquan.net/wechat/weMakeList"
            },
            {
                "type":"view",
                "name":"找安装",
                "url":"http://www.adquan.net/wechat/weFixList"
            },
            {
                "type":"view",
                "name":"看杂志",
                "url":"https://adquan.net/ebook/m3"
            }
        ]
    }
    Wx.findOne({},function (err,wx) {
        console.log(wx.accessToken)
        request({
            url: 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token=' + wx.accessToken,
            method: "POST",
            // json: true,
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(requestData)
        }, function (error, response, body) {
            console.log(error)
            console.log(body)
        })
    })
})


// 数字期刊或vr查询
router.post('/manage/searchManageFilter', function(req, res, next) {
    var resType = req.body.resType
    var adType = req.body.adType
    var order = req.body.order
    var page = parseInt(req.body.page)
    var limit = parseInt(req.body.limit)
    if (!page) {
        page = 1
    }
    if (!limit) {
        limit = 15
    }
    // if (!_.isEmpty(req.body.order)) {
    //     order = req.body.order
    // }
    var startNum = (page - 1) * limit

    var query = {}

    query.adType=adType

    if (resType!=="") {
        query.resType = resType
    }
    var resultNum = Advice.find(query).count()
    Advice.find(query).sort(order).skip(startNum).limit(limit).exec(function(err, docs) {
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

})

// 数字期刊增加或修改
router.post('/manage/updateEbook', function(req, res, next) {
    var error = ''
    if (adminFunc.checkAdminPower(req, 'ebookManage_add')) {
        if (_.isEmpty(req.body.region)) {
            error = '地域为空，格式错误'
        } else if (_.isEmpty(req.body.title)) {
            error = '标题为空，错误'
        } else if (_.isEmpty(req.body.coverImg)) {
            error = '封面为空，错误'
        } else if (_.isEmpty(req.body.onlineView)) {
            error = '在线浏览地址为空'
        } else if (_.isEmpty(req.body.downloadUrl)) {
            error = '下载地址为空'
        }
        req.body.region = JSON.parse(req.body.region)
        if (error) {
            res.end(error)
        } else {
            var params = url.parse(req.url, true)
            var targetId = params.query.uid
            if (_.isEmpty(targetId)) {
                var ebook = new Ebook(req.body)
                ebook.save(function(err) {
                    if (err) {
                        res.end(err)
                    } else {
                        res.end('success')
                    }
                })
            } else {
                Ebook.update({ _id: targetId }, { $set: req.body }, function(err, result) {
                    if (err) {
                        res.end(err)
                    } else {
                        res.end('success')
                    }
                })
            }
        }
    } else {
        res.end(settings.system_noPower)
    }
})

// VR增加或修改
router.post('/manage/updateVR', function(req, res, next) {
    var error = ''
    if (_.isEmpty(req.body.region)) {
        error = '地域为空，格式错误'
    } else if (_.isEmpty(req.body.title)) {
        error = '标题为空，错误'
    } else if (_.isEmpty(req.body.type)) {
        error = '类型为空，错误'
    } else if (_.isEmpty(req.body.company)) {
        error = '关联的商铺为空，错误'
    } else if (_.isEmpty(req.body.imgs)) {
        error = '封面为空，错误'
    } else if (_.isEmpty(req.body.onlineView)) {
        error = '在线浏览地址为空'
    } else if (_.isEmpty(req.body.recommend)) {
        error = '是否推荐为空'
    }
    req.body.region = JSON.parse(req.body.region)
    if (error) {
        res.end(error)
    } else {
        var params = url.parse(req.url, true)
        var targetId = params.query.uid
        if (_.isEmpty(targetId)) {
            if (adminFunc.checkAdminPower(req, 'vrManage_add')) {
                if (req.body.recommend) {
                    req.body.recommendAt = new Date().getTime()
                }
                var vR = new VR(req.body)
                vR.save(function(err) {
                    if (err) {
                        res.end(err)
                    } else {
                        res.json({ 'result': 'success' })
                    }
                })
            } else {
                res.end(settings.system_noPower)
            }
        } else {
            if (adminFunc.checkAdminPower(req, 'vrManage_modify')) {
                if (req.body.recommend) {
                    req.body.recommendAt = new Date().getTime()
                } else {
                    req.body.recommendAt = ''
                }
                VR.update({ _id: targetId }, { $set: req.body }, function(err, result) {
                    if (err) {
                        res.end(err)
                    } else {
                        res.json({ 'result': 'success' })
                    }
                })
            } else {
                res.end(settings.system_noPower)
            }
        }
    }
})

// 删除数字期刊
router.post('/manage/deleteEbook', function(req, res, next) {
    if (adminFunc.checkAdminPower(req, 'ebookManage_del')) {
        Ebook.findOneAndRemove({ _id: req.body.uid }, function(err, doc) {
            if (err) {
                res.end(err)
            } else if (!_.isEmpty(doc)) {
                res.end('success')
            } else {
                res.end('删除失败')
            }
        })
    } else {
        res.end(settings.system_noPower)
    }
})

// 删除VR
router.post('/manage/deleteVR', function(req, res, next) {
    if (adminFunc.checkAdminPower(req, 'vrManage_del')) {
        VR.findOneAndRemove({ _id: req.body.uid }, function(err, doc) {
            if (err) {
                res.end(err)
            } else if (!_.isEmpty(doc)) {
                res.end('success')
            } else {
                res.end('删除失败')
            }
        })
    } else {
        res.end(settings.system_noPower)
    }
})

// 首页轮播图增加或修改
router.post('/manage/updateSlide', function(req, res, next) {
    var error = ''
    if (adminFunc.checkAdminPower(req, 'ebookManage_add')) {
        if (_.isEmpty(req.body.region)) {
            error = '地域为空，格式错误'
        } else if (_.isEmpty(req.body.where)) {
            error = '位置为空，错误'
        } else if (_.isEmpty(req.body.img)) {
            error = '图片为空，错误'
        } else if (_.isEmpty(req.body.jump)) {
            error = '跳转地址为空'
        }
        req.body.region = JSON.parse(req.body.region)
        if (error) {
            res.end(error)
        } else {
            var params = url.parse(req.url, true)
            var targetId = params.query.uid
            if (_.isEmpty(targetId)) {
                var slide = new Slide(req.body)
                slide.save(function(err) {
                    if (err) {
                        res.end(err)
                    } else {
                        res.end('success')
                    }
                })
            } else {
                Slide.update({ _id: targetId }, { $set: req.body }, function(err, result) {
                    if (err) {
                        res.end(err)
                    } else {
                        res.end('success')
                    }
                })
            }
        }
    } else {
        res.end(settings.system_noPower)
    }
})

// 删除首页轮播图
router.post('/manage/deleteSlide', function(req, res, next) {
    if (adminFunc.checkAdminPower(req, 'slideManage_del')) {
        Slide.findOneAndRemove({ _id: req.body.uid }, function(err, doc) {
            if (err) {
                res.end(err)
            } else if (!_.isEmpty(doc)) {
                res.end('success')
            } else {
                res.end('删除失败')
            }
        })
    } else {
        res.end(settings.system_noPower)
    }
})

// 首页轮播图或搜索查询
router.post('/manage/searchManageSlideFilter', function(req, res, next) {
    var resType = req.body.resType
    var where = req.body.where
    var type = req.body.type
    var text = req.body.text
    var region = req.body.region
    var order = req.body.order
    var page = parseInt(req.body.page)
    var limit = parseInt(req.body.limit)
    if (!page) {
        page = 1
    }
    if (!limit) {
        limit = 15
    }
    // if (!_.isEmpty(req.body.order)) {
    //     order = req.body.order
    // }
    var startNum = (page - 1) * limit

    var query = {}
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
    }
    if (text && text.length > 1 && text.length <= 20) {
        query.text = { $regex: new RegExp(text, 'i') }
    }
    if (where && where.length > 1) {
        query.where = where
    }

    if (type && type.length > 1) {
        query.type = type
    }

    var model
    if (resType == 'Slide') {
        model = Slide
    } else if (resType == 'SearchRecommend') {
        model = SearchRecommend
    }
    if (model) {
        var resultNum = model.find(query).count()
        model.find(query).sort(order).skip(startNum).limit(limit).exec(function(err, docs) {
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
    } else {
        res.end('查询失败')
    }
})

// 搜索推荐添加页面(默认)
router.post('/manage/addSearchRcdManage', function(req, res) {
    var error = ''
    if (_.isEmpty(req.body.region)) {
        error = '地域为空，格式错误'
    } else if (_.isEmpty(req.body.where)) {
        error = '位置为空，错误'
    } else if (_.isEmpty(req.body.type)) {
        error = '类型为空，错误'
    } else if (_.isEmpty(req.body.text)) {
        error = '文字为空'
    }
    req.body.region = JSON.parse(req.body.region)
    if (error) {
        res.end(error)
    } else {
        var params = url.parse(req.url, true)
        var targetId = params.query.uid
        if (_.isEmpty(targetId)) {
            if (adminFunc.checkAdminPower(req, 'searchRcdManage_add')) {
                var searchRecommend = new SearchRecommend(req.body)
                searchRecommend.save(function(err) {
                    if (err) {
                        res.end(err)
                    } else {
                        res.end('success')
                    }
                })
            } else {
                res.end('对不起，您无权修改搜索推荐模块！')
            }
        } else {
            if (adminFunc.checkAdminPower(req, 'searchRcdManage_add')) {
                SearchRecommend.update({ _id: targetId }, { $set: req.body }, function(err, result) {
                    if (err) {
                        res.end(err)
                    } else {
                        res.end('success')
                    }
                })
            } else {
                res.end('对不起，您无权新增搜索推荐模块！')
            }
        }
    }
})

// 删除搜索推荐
router.post('/manage/searchRcdManageDel', function(req, res, next) {
    if (adminFunc.checkAdminPower(req, 'searchRcdManage_del')) {
        SearchRecommend.findOneAndRemove({ _id: req.body.uid }, function(err, doc) {
            if (err) {
                res.end(err)
            } else if (!_.isEmpty(doc)) {
                res.end('success')
            } else {
                res.end('删除失败')
            }
        })
    } else {
        res.end(settings.system_noPower)
    }
})

// 二级栏目设置添加页面(默认)
router.post('/manage/CategorySetting', function(req, res) {
    var error = ''
    if (_.isEmpty(req.body.icon)) {
        error = '图标为空，错误'
    } else if (_.isEmpty(req.body.category)) {
        error = '关联的栏目为空，错误'
    } else if (_.isEmpty(req.body.type)) {
        error = '类型为空，错误'
    }
    if (error) {
        res.end(error)
    } else {
        var params = url.parse(req.url, true)
        var targetId = params.query.uid
        if (_.isEmpty(targetId)) {
            if (adminFunc.checkAdminPower(req, 'categorySettingMng_add')) {
                var categorySetting = new CategorySetting(req.body)
                categorySetting.save(function(err) {
                    if (err) {
                        res.end(err)
                    } else {
                        res.end('success')
                    }
                })
            } else {
                res.end('对不起，您无权修改搜索推荐模块！')
            }
        } else {
            if (adminFunc.checkAdminPower(req, 'categorySettingMng_modify')) {
                CategorySetting.update({ _id: targetId }, { $set: req.body }, function(err, result) {
                    if (err) {
                        res.end(err)
                    } else {
                        res.end('success')
                    }
                })
            } else {
                res.end('对不起，您无权新增搜索推荐模块！')
            }
        }
    }
})

// 二级栏目推荐添加页面(默认)
router.post('/manage/CategoryRecommend', function(req, res) {
    var error = ''
    var resType = req.body.resType
    if (_.isEmpty(req.body.items)) {
        error = '推荐的栏目为空，错误'
    } else if (_.isEmpty(req.body.type)) {
        error = '类型为空，错误'
    }
    var model
    if (resType == 'CategorySetting') {
        model = CategorySetting
    } else if (resType == 'CategoryRecommend') {
        model = CategoryRecommend
    }

    if (error) {
        res.end(error)
    } else {
        if (model) {
            var params = url.parse(req.url, true)
            var targetId = params.query.uid
            if (_.isEmpty(targetId)) {
                if (adminFunc.checkAdminPower(req, 'categorySettingMng_add')) {
                    var categorySetting = new model(req.body)
                    categorySetting.save(function(err) {
                        if (err) {
                            res.end(err)
                        } else {
                            res.end('success')
                        }
                    })
                } else {
                    res.end('对不起，您无权修改搜索推荐模块！')
                }
            } else {
                if (adminFunc.checkAdminPower(req, 'categorySettingMng_modify')) {
                    model.update({ _id: targetId }, { $set: req.body }, function(err, result) {
                        if (err) {
                            res.end(err)
                        } else {
                            res.end('success')
                        }
                    })
                } else {
                    res.end('对不起，您无权新增搜索推荐模块！')
                }
            }
        } else {
            res.end('查询失败')
        }
    }
})

// 二级栏目设置推荐查询
router.post('/manage/searchManageCategorySettingFilter', function(req, res, next) {
    var resType = req.body.resType
    var type = req.body.type
    var order = req.body.order
    var page = parseInt(req.body.page)
    var limit = parseInt(req.body.limit)
    if (!page) {
        page = 1
    }
    if (!limit) {
        limit = 15
    }
    // if (!_.isEmpty(req.body.order)) {
    //     order = req.body.order
    // }
    var startNum = (page - 1) * limit

    var query = {}

    if (!_.isEmpty(type)) {
        query.type = type
    }

    var model
    if (resType == 'CategorySetting') {
        model = CategorySetting
    } else if (resType == 'CategoryRecommend') {
        model = CategoryRecommend
    }
    if (model) {
        var resultNum = model.find(query).count()
        model.find(query).sort(order).skip(startNum).limit(limit).exec(function(err, docs) {
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
    } else {
        res.end('查询失败')
    }
})

// 二级栏目设置单条查询
router.post('/manage/searchManageCategorySettingByOne', function(req, res, next) {
    var resType = req.body.resType
    var id = req.body.id

    var query = {}
    if (!_.isEmpty(id)) {
        query._id = id
    }
    var model
    if (resType == 'CategorySetting') {
        model = CategorySetting
    } else if (resType == 'CategoryRecommend') {
        model = CategoryRecommend
    }
    if (model) {
        model.findOne(query).exec(function(err, docs) {
            if (err) {
                res.end(err)
            } else if (!_.isEmpty(docs)) {
                res.json(docs)
            } else {
                res.end('查询为空')
            }
        })
    } else {
        res.end('查询失败')
    }
})

// 删除二级栏目设置
router.post('/manage/categorySettingMngDel', function(req, res, next) {
    if (adminFunc.checkAdminPower(req, 'categorySettingMng_del')) {
        var resType = req.body.resType
        var model
        if (resType == 'CategorySetting') {
            model = CategorySetting
        } else if (resType == 'CategoryRecommend') {
            model = CategoryRecommend
        }
        model.findOneAndRemove({ _id: req.body.uid }, function(err, doc) {
            if (err) {
                res.end(err)
            } else if (!_.isEmpty(doc)) {
                res.end('success')
            } else {
                res.end('删除失败')
            }
        })
    } else {
        res.end(settings.system_noPower)
    }
})

// 信息审核查询列表
router.post('/manage/userManageVerifyFilter', function(req, res, next) {
    var resType = req.body.resType
    var name = req.body.name
    var owner = req.body.owner
    var num = req.body.num
    var status = req.body.status
    var page = parseInt(req.body.page)
    var limit = parseInt(req.body.limit)
    if (!page) {
        page = 1
    }
    if (!limit) {
        limit = 15
    }
    if (!_.isEmpty(req.body.order)) {
        order = req.body.order
    }

    var startNum = (page - 1) * limit

    var query = {}

    // if (!_.isEmpty(type)) {
    //     query.type = type
    // }
    //
    if (owner && owner.length > 1) {
        query.owner = { $regex: new RegExp(owner, 'i') }
    }
    if (name && name.length > 1) {
        query.name = { $regex: new RegExp(name, 'i') }
    }
    if (num) {
        query.num = num
    }
    if (status) {
        query.status = status
    }

    var model
    if (resType == 'IdCardIdentify') {
        model = IdCardIdentify
    } else if (resType == 'CompanyIdentify') {
        model = CompanyIdentify
    }
    if (model) {
        var resultNum = model.find(query).count()
        model.find(query).sort(order).skip(startNum).limit(limit).exec(function(err, docs) {
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
    } else {
        res.end('查询失败')
    }
})

// 信息审核单条查询
router.post('/manage/userManageVerifyByOne', function(req, res, next) {
    var resType = req.body.resType
    var id = req.body.id

    var query = {}
    if (!_.isEmpty(id)) {
        query._id = id
    }
    var model
    if (resType == 'IdCardIdentify') {
        model = IdCardIdentify
    } else if (resType == 'CompanyIdentify') {
        model = CompanyIdentify
    }
    if (model) {
        model.findOne(query).exec(function(err, docs) {
            if (err) {
                res.end(err)
            } else if (!_.isEmpty(docs)) {
                res.json(docs)
            } else {
                res.end('查询为空')
            }
        })
    } else {
        res.end('查询失败')
    }
})

// 信息审核修改
router.post('/manage/userManageVerifyChange', function(req, res) {
    var error = ''
    var resType = req.body.resType
    var status = req.body.status
    var rejectMsg = req.body.rejectMsg
    var companyName=req.body.name
    if(req.body.region){
        var regionStr=[]
        regionStr=req.body.region.split('/')
        var region={}
        region.province=regionStr[0]
        region.city=regionStr.length>1?regionStr[1]:""
        region.district=regionStr.length>2?regionStr[2]:""
        req.body.region=region
    }

    if (_.isEmpty(req.body.status)) {
        error = '状态为空，错误'
    }
    if (_.isEmpty(req.body.rejectMsg) && status == '审核驳回') {
        error = '审核驳回时的通知信息为空，错误'
    }

    var model
    if (resType == 'IdCardIdentify') {
        model = IdCardIdentify
    } else if (resType == 'CompanyIdentify') {
        model = CompanyIdentify
    }

    if (error) {
        res.end(error)
    } else {
        if (model) {
            if (adminFunc.checkAdminPower(req, 'userManage_verify_modify')) {
                var verifiedAt = new Date().getTime()
                req.body.verifiedAt = verifiedAt
                model.findByIdAndUpdate(req.body.id , { $set: req.body }, function(err, result) {
                    if (err) {
                        res.end(err)
                    } else {
                        if (!_.isEmpty(result)) {
                            Company.update({ user: result.user }, { $set: { companyName: companyName, region:region  } }, function(err, doc) {
                                if (!_.isEmpty(doc)) {
                                    res.end('success')
                                } else {
                                    res.end('失败')
                                }
                            })
                        } else {
                            res.end('已经审核过了，不允许再次审核')
                        }
                    }
                })
            } else {
                res.end('对不起，您无权修改信息审核模块！')
            }
        } else {
            res.end('查询失败')
        }
    }
})

function checkCode(req, cb) {
    var errors
    var phoneNum = req.body.phoneNum
    var code = req.body.code
    var isLogin = req.body.isLogin

    if (isLogin) {
        cb(true)
    } else {
        // 数据校验
        if (!validator.isNumeric(phoneNum) || phoneNum.length != 11 || !validator.isNumeric(code)) {
            errors = '电话号码或验证码无效'
        }
        if (errors) {
            cb(false)
        } else {
            // 校验短信验证码
            SMS.findOne({ phoneNum: phoneNum }, function(err, sms) {
                if (err) {
                    cb(false)
                } else {
                    if (!_.isEmpty(sms)) {
                        var createdAt = moment(sms.createdAt, 'YYYYMMDDHHmmss')
                        var exp = createdAt.add(sms.duration, 'minutes')
                        if (sms.code == code) {
                            cb(true)
                        } else {
                            cb(false)
                        }
                    } else {
                        cb(false)
                    }
                }
            }).sort({ createdAt: -1 }).limit(1)
        }
    }
}

// 新增普通用户
router.post('/manage/addNewUser', function(req, res) {
    var error
    var phoneNum = req.body.phoneNum
    var region = req.body.region
    var companyName = req.body.companyName
    var contacts = req.body.contacts
    var email = req.body.email

    if (_.isEmpty(req.body.phoneNum)) {
        error = '手机号码为空'
    }

    if (error) {
        res.end(error)
    } else {
        var checkPass = false
        checkCode(req, function(isOk) {
            checkPass = isOk
            if (!checkPass) {
                checkPass = adminFunc.checkAdminPower(req, 'userManage_user_add')
            }

            if (checkPass) {
                User.findOne({ phoneNum: phoneNum }, function(err, doc) {
                    if (err) {
                        res.end(err)
                    } else if (!_.isEmpty(doc)) {
                        if (isOk) {
                            res.json({ result: 'success', company: doc.comany })
                        } else {
                            res.end('手机号码已被注册')
                        }
                    } else {
                        var userName = shortid.generate()
                            // var password = _.random(100000, 999999).toString()
                            // TODO 添加用户时的默认密码需要改成随机值
                        var password = '586972'
                        passwordEn = DbOpt.encrypt(password, settings.encrypt_key)
                        var newUser = new User({ userName: userName, password: passwordEn, phoneNum: phoneNum })
                        newUser.save(function(err) {
                            if (err) {
                                res.end(err)
                            } else {
                                // TODO 发送短信给用户告知登陆手机号和密码
                                // smsUtils.sendVerifyCodeSMS(phoneNum, 1, function (err) {})
                                var comany = new Company({ region: region, phoneNum: phoneNum, companyName: companyName, contacts: contacts, email: email, user: newUser._id })
                                comany.save(function(err) {
                                    if (err) {
                                        res.end(err)
                                    } else {
                                        newUser.company = comany._id
                                        newUser.save(function(err) {
                                            res.json({ result: 'success', company: comany._id })
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            } else {
                res.end('对不起，您无权操作新增用户模块！')
            }
        })
    }
})

// 根据电话查询管理企业信息
router.post('/manage/queryCompanyInfoByPhoneNum', function(req, res) {
    var error
    var phoneNum = req.body.phoneNum

    if (_.isEmpty(req.body.phoneNum)) {
        error = '手机号码为空'
    }

    if (error) {
        res.end(error)
    } else {
        User.findOne({ phoneNum: phoneNum }, { company: 1 }).populate('company').exec(function(err, company) {
            if (err) {
                res.end(err)
            } else if (!_.isEmpty(company)) {
                res.json({ company: company })
            }
        })
    }
})

// 新建品牌推广服务
// 参数：
// phoneNum: 用户手机号
// companyId: 企业ID
// period：推广周期 1季度、半年、1年
// priorShow：是否选择优先展示
// eBook： 是否选择数字期刊
// VR：是否选择VR展馆
// weMedia：是否选择自媒体渠道
router.post('/manage/addNewPromotion', function(req, res, next) {
    var companyId = req.body.companyId
    var period = req.body.period
    var priorShow = true
    var eBook = req.body.eBook === 'true' ? true : false
    var VR = req.body.VR === 'true' ? true : false
    var weMedia = req.body.weMedia === 'true' ? true : false
    var payType = req.body.payType
    var phoneNum = req.body.phoneNum
    var serviceItems = 0
    var totalPrice = 0
    var discountPrice = 0

    var doc = { company: companyId, period: period }

    if (priorShow) {
        serviceItems++
        totalPrice += PriceConfig.priorShowPrice
        doc.priorShowState = '沟通传递素材'
    } else {
        doc.priorShowState = '未购买'
    }
    if (eBook) {
        serviceItems++
        totalPrice += PriceConfig.eBookPrice
        doc.eBookState = '沟通传递素材'
    } else {
        doc.eBookState = '未购买'
    }
    if (VR) {
        serviceItems++
        totalPrice += PriceConfig.VRPrice
        doc.VRState = '沟通传递素材'
    } else {
        doc.VRState = '未购买'
    }
    if (weMedia) {
        serviceItems++
        totalPrice += PriceConfig.weMediaPrice
        doc.weMediaState = '沟通传递素材'
    } else {
        doc.weMediaState = '未购买'
    }

    if (period == '1季度') {
        totalPrice *= 3
    } else if (period == '半年') {
        totalPrice *= 6
    } else if (period == '1年') {
        totalPrice *= 12
    }

    discountPrice = totalPrice

    if (serviceItems == 1) {
        if (period == '1季度') {
            discountPrice = discountPrice * PriceConfig.discountOneQuarter1
        } else if (period == '半年') {
            discountPrice = discountPrice * PriceConfig.discountHalfYear1
        } else if (period == '1年') {
            discountPrice = discountPrice * PriceConfig.discountOneYear1
        }
    } else if (serviceItems == 2) {
        if (period == '1季度') {
            discountPrice = discountPrice * PriceConfig.discountOneQuarter2
        } else if (period == '半年') {
            discountPrice = discountPrice * PriceConfig.discountHalfYear2
        } else if (period == '1年') {
            discountPrice = discountPrice * PriceConfig.discountOneYear2
        }
    } else if (serviceItems == 3) {
        if (period == '1季度') {
            discountPrice = discountPrice * PriceConfig.discountOneQuarter3
        } else if (period == '半年') {
            discountPrice = discountPrice * PriceConfig.discountHalfYear3
        } else if (period == '1年') {
            discountPrice = discountPrice * PriceConfig.discountOneYear3
        }
    } else if (serviceItems == 4) {
        if (period == '1季度') {
            discountPrice = discountPrice * PriceConfig.discountOneQuarter4
        } else if (period == '半年') {
            discountPrice = discountPrice * PriceConfig.discountHalfYear4
        } else if (period == '1年') {
            discountPrice = discountPrice * PriceConfig.discountOneYear4
        }
    }

    if (_.isUndefined(doc.period) || discountPrice <= 0) {
        res.end('新增失败')
    } else {
        var checkPass = false
        checkCode(req, function(isOk) {
            checkPass = isOk
            if (!checkPass) {
                checkPass = adminFunc.checkAdminPower(req, 'promotionManage_add')
            }
            if (checkPass) {
                User.findOne({ phoneNum: phoneNum }, { _id: 1 }, function(err, user) {
                    if (err) {
                        res.end('新增失败')
                    } else {
                        Bill.findOne({ user: user._id, billName: '品牌推广服务' }, function(err, b) {
                            if (!_.isEmpty(b) && b.billState == '已支付') {
                                res.end('您已购买品牌推广服务')
                            } else if (!_.isEmpty(b) && b.billState == '未支付') {
                                // 未支付的品牌推广服务订单和项目允许修改
                                BrandPromotion.findOneAndUpdate({ user: user._id }, { $set: doc }, function(err, bp) {
                                    b.payType = payType
                                    b.price = Math.round(discountPrice)
                                    b.save(function(err) {
                                        res.end('该用户存在未支付的品牌推广服务订单')
                                    })
                                })
                            } else {
                                var bill = new Bill({ billNum: moment().format('YYYYMMDDHHmmss') + _.random(10000, 99999), billName: '品牌推广服务', billType: '服务', payType: payType, user: user._id, price: Math.round(discountPrice) })
                                bill.save(function(err) {
                                    if (err) {
                                        res.end(err)
                                    } else {
                                        doc.user = user._id
                                        doc.bill = bill._id
                                        var promotion = new BrandPromotion(doc)
                                        promotion.save(function(err) {
                                            if (err) {
                                                res.end(err)
                                            } else {
                                                // 发送短信给用户告知品牌推广服务费订单已生成，请登陆进行支付
                                                smsUtils.sendNotifySMS_qcloud(phoneNum, smsUtils.code15, ['品牌推广服务'], function(err) {})
                                                res.end('success')
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            } else {
                res.end('您无权操作新增品牌推广模块！')
            }
        })
    }
})

// 品牌推广搜索结果过滤接口
// 参数：
// companyName（可选）：公司名称搜索条件
// region（可选）：区域对象{ province:'', city:'', district:'' }
// priorShow（可选）: 是否勾选了优先展示
// eBook（可选）：是否勾选了数字期刊
// VR（可选）：是否勾选了VR展馆
// weMedia（可选）：是否勾选了自媒体渠道
// period（可选）：推广周期
// billState（可选）：支付状态
// expire（可选）：过期状态
// order（可选）：排序字段 默认{createdAt: -1}
// page（必选）：当前页面
// limit（必选）：每页记录条数 默认每页15条
router.post('/manage/searchPromotionFilter', function(req, res, next) {
    var companyName = req.body.companyName
    var region = req.body.region
    var priorShow = Boolean(req.body.priorShow)
    var eBook = Boolean(req.body.eBook)
    var VR = Boolean(req.body.VR)
    var weMedia = Boolean(req.body.weMedia)
    var period = req.body.period
    var billState = req.body.billState
    var expire = Boolean(req.body.expire)

    var order = { createdAt: -1 }
    var page = parseInt(req.body.page)
    var limit = parseInt(req.body.limit)
    if (!page) {
        page = 1
    }
    if (!limit) {
        limit = 15
    }
    if (!_.isEmpty(req.body.order)) {
        order = req.body.order
    }
    var startNum = (page - 1) * limit

    // Company表过滤条件
    var companyFilter = {}
    if (!_.isEmpty(region.province) && _.isEmpty(region.city) && _.isEmpty(region.district)) {
        companyFilter = {
            'region.province': region.province
        }
    } else if (!_.isEmpty(region.province) && !_.isEmpty(region.city) && _.isEmpty(region.district)) {
        companyFilter = {
            'region.province': region.province,
            'region.city': region.city
        }
    } else if (!_.isEmpty(region.province) && !_.isEmpty(region.city) && !_.isEmpty(region.district)) {
        companyFilter = {
            'region.province': region.province,
            'region.city': region.city,
            'region.district': region.district
        }
    }

    if (companyName && companyName.length > 1 && companyName.length <= 20) {
        companyFilter.companyName = { $regex: new RegExp(companyName, 'i') }
    }

    // BrandPromotion表过滤条件
    var promotionFilter = {}
    if (priorShow) {
        promotionFilter.priorShowState = { $ne: '未购买' }
    }
    if (eBook) {
        promotionFilter.eBookState = { $ne: '未购买' }
    }
    if (VR) {
        promotionFilter.VRState = { $ne: '未购买' }
    }
    if (weMedia) {
        promotionFilter.weMediaState = { $ne: '未购买' }
    }
    if (period) {
        promotionFilter.period = period
    }
    // TODO 过期状态过滤要完善
    if (expire) {
        // promotionFilter.promotionEnd = {}
    }

    // Bill表过滤条件
    var billFilter = {}
    if (billState) {
        billFilter.billState = billState
    }

    BrandPromotion.find(promotionFilter)
        .populate({ path: 'bill', select: { billState: 1 }, match: billFilter })
        .populate({ path: 'company', match: companyFilter })
        .sort(order).exec(function(err, docs) {
            if (err) {
                res.end(err)
            } else if (!_.isEmpty(docs)) {
                var newDocs = []
                for (var idx in docs) {
                    if (docs[idx].bill && docs[idx].company) {
                        newDocs.push(docs[idx])
                    }
                }
                var resultNum = newDocs.length
                newDocs = _.slice(newDocs, startNum, startNum + limit)

                var pageInfo = {
                    'totalItems': resultNum,
                    'currentPage': page,
                    'limit': limit,
                    'startNum': startNum + 1
                }
                var datasInfo = {
                    docs: newDocs,
                    pageInfo: pageInfo
                }
                res.json(datasInfo)
            } else {
                res.end('查询为空')
            }
        })
})

// 精准推广查询接口
router.post('/manage/searchPrecisePromotionFilter', function(req, res, next) {
    var region = req.body.region
    var period = req.body.period
    var billState = req.body.billState

    var order = { createdAt: -1 }
    var page = parseInt(req.body.page)
    var limit = parseInt(req.body.limit)
    if (!page) {
        page = 1
    }
    if (!limit) {
        limit = 15
    }
    if (!_.isEmpty(req.body.order)) {
        order = req.body.order
    }
    var startNum = (page - 1) * limit

    var promotionFilter = {}
    if (!_.isEmpty(region)) {
        promotionFilter.regions = region
    }
    if (!_.isEmpty(period)) {
        promotionFilter.period = period
    }
    // Bill表过滤条件
    var billFilter = {}
    if (!_.isEmpty(billState)) {
        billFilter.billState = billState
    }
    PrecisePromotion.find(promotionFilter)
        .populate({ path: 'bill', select: { billState: 1 }, match: billFilter })
        .sort(order).exec(function(err, docs) {
            if (err) {
                res.end(err)
            } else if (!_.isEmpty(docs)) {
                var newDocs = []
                for (var idx in docs) {
                    if (docs[idx].bill) {
                        newDocs.push(docs[idx])
                    }
                }
                var resultNum = newDocs.length
                newDocs = _.slice(newDocs, startNum, startNum + limit)

                var pageInfo = {
                    'totalItems': resultNum,
                    'currentPage': page,
                    'limit': limit,
                    'startNum': startNum + 1
                }
                var datasInfo = {
                    docs: newDocs,
                    pageInfo: pageInfo
                }
                res.json(datasInfo)
            } else {
                res.end('查询为空')
            }
        })
})

// //精准推广开关接口
router.post('/manage/precisePromotionChange', function(req, res, next) {
    if (adminFunc.checkAdminPower(req, 'prcdManage_modify')) {
        var id = req.body.id
        var isShowing = req.body.isShowing

        PrecisePromotion.findOneAndUpdate({ _id: req.body.id }, { $set: { isShowing: !isShowing } }, function(err, doc) {
            if (err) {
                res.end(err)
            } else if (!_.isEmpty(doc)) {
                res.end('success')
            } else {
                res.end('修改失败')
            }
        })
    } else {
        res.end(settings.system_noPower)
    }
})

router.post('/manage/triggerResShow', function(req, res, next) {
    if (adminFunc.checkAdminPower(req, 'contentManage_content_modify')) {
        var resId = req.body.resId
            PubHistory.findOne({_id: resId, isDeleted: false}, function (err, doc) {
                if (err) {
                    res.end(err)
                } else if (!_.isEmpty(doc)) {
                    doc.isShowing = !doc.isShowing
                    doc.save(function (err) {
                        if (err) {
                            res.end(err)
                        } else {
                            PrecisePromotion.findOneAndUpdate({
                                pubHistory: resId,
                                isShowing: true
                            }, {isShowing: false}, function (err, doc) {
                                if (err) {
                                    res.end(err)
                                } else {
                                    res.end('success')
                                }
                            })
                        }
                    })
                } else {
                    res.end('操作失败')
                }
            })
    }else{
        res.end(settings.system_noPower)
    }
})

// 更新品牌推广服务项目状态
// 参数：
// promotionId：品牌推广ID
// priorShow：是否正在更新优先展示
// eBook： 是否正在更新数字期刊
// VR：是否正在更新VR展馆
// weMedia：是否正在更新自媒体渠道
// state：服务状态值 沟通传递素材 -> 制作中 -> 服务中
// imgs：对应服务的素材图片
router.post('/manage/updatePromotion', function(req, res, next) {
    var promotionId = req.body.promotionId
    var priorShow = Boolean(req.body.priorShow)
    var eBook = Boolean(req.body.eBook)
    var VR = Boolean(req.body.VR)
    var weMedia = Boolean(req.body.weMedia)
    var state = req.body.state
    var imgs = req.body.imgs
    var update = {}

    if (_.indexOf(['沟通传递素材', '制作中', '服务中'], state) >= 0) {
        if (priorShow) {
            update = { priorShowImgs: imgs, priorShowState: state }
        }
        if (eBook) {
            update = { ebookImgs: imgs, eBookState: state }
        }
        if (VR) {
            update = { vrImgs: imgs, VRState: state }
        }
        if (weMedia) {
            update = { weMediaImgs: imgs, weMediaState: state }
        }
        if (adminFunc.checkAdminPower(req, 'promotionManage_modify')) {
            BrandPromotion.findOneAndUpdate({ _id: promotionId }, { $set: update }, function(err, doc) {
                if (err) {
                    res.end(err)
                } else if (!_.isEmpty(doc)) {
                    res.json({ result: 'success' })
                } else {
                    res.end('更新失败')
                }
            })
        } else {
            res.end(settings.system_noPower)
        }
    } else {
        res.end('服务状态值错误')
    }
})

router.post('/manage/deleteResource', function(req, res, next) {
    if (adminFunc.checkAdminPower(req, 'contentManage_content_del')) {
        PubHistory.findOneAndRemove({ _id: req.body.id }, function(err, doc) {
            if (err) {
                res.end(err)
            } else if (!_.isEmpty(doc)) {
                PrecisePromotion.findOneAndRemove({ pubHistory: req.body.id, promotionEnd: { $gt: new Date() } }, function(err, precisePromotion) {
                    if (err) {
                        res.end(err)
                    } else {
                        res.end('success')
                    }
                })
            } else {
                res.end('删除失败')
            }
        })
    } else {
        res.end(settings.system_noPower)
    }
})

router.post('/manage/tenderDelById', function(req, res, next) {
    if (adminFunc.checkAdminPower(req, 'TenderManage_del')) {
        Tender.findOneAndUpdate({ _id: req.body.id }, { isCanceled: true, cancelDetail: "您发布的招标内容不合法" }, function(err, doc) {
            if (err) {
                res.end(err)
            } else if (!_.isEmpty(doc)) {
                Bid.remove({ _id: { $in: doc.bidders } }, function(err, bid) {
                    if (err) {
                        res.end(err)
                    } else {
                        TenderBill.findOne({ targetId: doc._id, billType: "招标保证金", billState: "已支付" }, function(err, tenderBill) {
                            if (err) {
                                res.end(err)
                            } else if (_.isEmpty(tenderBill)) {
                                res.end("success")
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
                                            var newTran = new Transactions({ transNum: result.out_refund_no, transType: '招标保证金退款', price: -result.total_fee / 100, payType: payType, payInfo: result, user: tenderBill.user })
                                            newTran.save(function(err) {
                                                res.end("success")
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
                                            var newTran = new Transactions({ transNum: moment().format('YYYYMMDDHHmmss') + _.random(1000, 9999), transType: '招标保证金退款', price: -result.send_back_fee, payType: payType, payInfo: result, user: tenderBill.user })
                                            newTran.save(function(err) {
                                                res.end("success")
                                            })
                                        }
                                    }).catch(error => res.end(error))
                                }
                            }
                        })
                    }
                })
            } else {
                res.end('删除失败')
            }
        })
    } else {
        res.end(settings.system_noPower)
    }
})

// 招标搜索结果过滤接口
// 参数：
// text（可选）：搜索文本内容2到20个字符
// region（可选）：区域对象{ province:'', city:'', district:'' }
// types（可选）: 子类型数组
// tenderType（可选）：招标方式
// status（可选）：状态类型
// order（可选）：排序字段 默认{refreshedAt: -1}
// page（必选）：当前页面
// limit（必选）：每页记录条数 默认每页15条
router.post('/manage/searchTenderFilterByAdmin', function(req, res, next) {
    if (adminFunc.checkAdminPower(req, 'TenderManage_view')) {
        var text = req.body.text
        var region = {}
        var tenderType = req.body.tenderType
        var status = req.body.status
        var order = { createdAt: -1 }
        var page = parseInt(req.body.page)
        var limit = parseInt(req.body.limit)
        if (!page) {
            page = 1
        }
        if (!limit) {
            limit = 15
        }
        if (!_.isEmpty(req.body.order)) {
            order = req.body.order
        }
        if (!_.isEmpty(req.body.region)) {
            region = req.body.region
        }

        var startNum = (page - 1) * limit

        var query = {}
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
        }

        if (text && text.length > 1 && text.length <= 20) {
            query.title = { $regex: new RegExp(text, 'i') }
        }

        if (tenderType) {
            query.tenderType = tenderType
        }
        if (status) {
            query.status = status
        }
        query.isCanceled = false
        var resultNum = Tender.find(query).count()
        Tender.find(query).sort(order).skip(startNum).limit(limit).populate('categoryL1 categoryL2 company').exec(function(err, docs) {
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
    } else {
        res.end(settings.system_noPower)
    }
})

router.post('/manage/searchCashFilterByAdmin', function(req, res, next) {
    if (adminFunc.checkAdminPower(req, 'withdrawCashManage_view')) {
        var status = req.body.status
        var order = { createdAt: -1 }
        var page = parseInt(req.body.page)
        var limit = parseInt(req.body.limit)
        if (!page) {
            page = 1
        }
        if (!limit) {
            limit = 15
        }
        if (!_.isEmpty(req.body.order)) {
            order = req.body.order
        }
        var startNum = (page - 1) * limit

        var query = {}

        if (status) {
            query.status = status
        }

        var resultNum = TenderCash.find(query).count()
        TenderCash.find(query).sort(order).skip(startNum).limit(limit).populate('targetId').populate('user', 'nickName phoneNum').exec(function(err, docs) {
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
    } else {
        res.end(settings.system_noPower)
    }

})


router.post('/manage/searchComplainFilterByAdmin', function(req, res, next) {
    if (adminFunc.checkAdminPower(req, 'complainManage_view')) {
        var order = { createdAt: -1 }
        var page = parseInt(req.body.page)
        var limit = parseInt(req.body.limit)
        if (!page) {
            page = 1
        }
        if (!limit) {
            limit = 15
        }
        if (!_.isEmpty(req.body.order)) {
            order = req.body.order
        }

        var startNum = (page - 1) * limit

        var query = {}
        if (!_.isEmpty(req.body.isSoluted)) {
            query.isSoluted = req.body.isSoluted
        }
        var resultNum = Complain.find(query).count()
        Complain.find(query).sort(order).skip(startNum).limit(limit).populate('tender').populate('user targetUser', 'nickName phoneNum').populate('targetCompany company','companyName phoneNum').exec(function(err, docs) {
            if (err) {
                res.json(err)
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
    } else {
        res.end(settings.system_noPower)
    }

})

// 企业提现转账接口
router.post('/manage/transferCash', function(req, res, next) {
    if (adminFunc.checkAdminPower(req, 'withdrawCashManage_add')) {
        var error
        if(!req.body.tenderId){
            error="tenderId为空"
        }else if(!req.body.price){
            error="价格为空"
        }else if(!req.body.companyId){
            error="companyId为空"
        }else if(!req.body.userId){
            error="userId为空"
        }
        var su=req.session.user
        if(error){
            res.json({error:error})
        }else {
            var tenderId=req.body.tenderId
            var price=req.body.price
            var companyId=req.body.companyId
            var userId=req.body.userId
            Tender.findOne({_id:tenderId},function (err,tender) {
                if(err){
                    res.json({error:err})
                }else if(_.isEmpty(tender)){
                    res.json({error:"当前投标不存在"})
                }else {
                    if(tender.withdrawDeposit==3){
                        res.json({error:"当前投标已提现"})
                    }else if(tender.withdrawDeposit==1){
                        res.json({error:"当前投标还未请求提现"})
                    }else if(tender.withdrawDeposit==2){
                        var totalPrice=tender.downpayment+tender.finalpayment
                        if(totalPrice==price){
                            Company.findOne({_id:companyId},function (err,company) {
                                if(err){
                                    res.json({error:err})
                                }else if(_.isEmpty(tender)){
                                    res.json({error:"当前投标公司不存在"})
                                }else {
                                    var payTypeNum;
                                    for(var j=0;j<company.withdrawAccount.length;j++){
                                        if(company.withdrawAccount[j].type=='alipay'){
                                            payTypeNum=company.withdrawAccount[j].account
                                        }
                                    }
                                    if(payTypeNum){
                                        var option = {
                                            out_biz_no: moment().format('YYYYMMDDHHmmss') + _.random(1000, 9999), // 商户转账唯一订单号
                                            payee_account: payTypeNum, // 支付宝账号
                                            remark:"招标定金尾款提现",
                                            payer_show_name:"幸福天地",
                                            // amount: 0.1 // 转账金额 最少0.1
                                            amount: (price*0.97).toFixed(2) // 转账金额 最少0.1
                                        }

                                        alipay.transfer(option).then(function(result) {
                                            if (result.code == '10000' &&
                                                result.msg == 'Success') {
                                                var newTran = new Transactions({ transNum: moment().format('YYYYMMDDHHmmss') + _.random(1000, 9999),refund:true, transType: '定金尾款提现', price: -price, payType: '支付宝支付', payInfo: result, user: userId })
                                                newTran.save(function(err) {
                                                    Tender.findByIdAndUpdate(tenderId,{
                                                        $set: {
                                                        withdrawDeposit: 3
                                                    },
                                                        $addToSet: { transactions: newTran._id }},function (err,ter) {
                                                    })
                                                    Company.findByIdAndUpdate(companyId,{$set:{cashAccount:company.cashAccount-price}},function (err,com) {
                                                        
                                                    })
                                                    TenderCash.findOneAndUpdate({targetId:tenderId},{$set:{status:3}},function (err,tc) {
                                                        
                                                    })
                                                    res.json({result:"success"})
                                                })
                                            }
                                        })
                                    }else {
                                        res.json({error:"当前投标公司支付宝账户不存在"})
                                    }
                                }
                            })
                        }else {
                            res.json({error:"当前提现请求金额不正确"})
                        }

                    }
                }
            })

        }

    } else {
        res.end(settings.system_noPower)
    }

})

// 投诉解决接口
router.post('/manage/agreeToSolute', function(req, res, next) {
    if (adminFunc.checkAdminPower(req, 'complainManage_modify')) {
        var error
        if(!req.body.tenderId){
            error="tenderId为空"
        }

        if(error){
            res.json({error:error})
        }else {
            Tender.findOne({_id:req.body.tenderId,isCanceled:true,status:{$gt:2,$lt:6}}).populate('chosenBidder user').exec(function (err,tender) {
                if(err){
                    res.json({error:err})
                }else if(_.isEmpty(tender)){
                    res.json({error:"查不到符合条件的招标，请检查数据库"})
                }else {
                    var su=tender.user
                    if(tender.status==3){//招标状态为3，只退招标保证金
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
                                                    Complain.findOneAndUpdate({tender:req.body.tenderId},{$set:{isSoluted:true}},function (err) {
                                                        res.json({result:"success"})
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
                                                    Complain.findOneAndUpdate({tender:req.body.tenderId},{$set:{isSoluted:true}},function (err) {
                                                        res.json({result:"success"})
                                                    })
                                                }
                                            }).catch(function(error) { res.end(error) })
                                        }
                                    }
                                })
                            }else {
                                Complain.findOneAndUpdate({tender:req.body.tenderId},{$set:{isSoluted:true}},function (err) {
                                    res.json({result:"success"})
                                })
                            }
                        })
                    }else if(tender.status==4){//招标状态为4，退招标保证金和定金
                        TenderBill.findOne({
                            billState:"已支付",
                            billType: '招标保证金',
                            targetId:  tender._id
                        }, function(err, tenderBill) {
                            if (!_.isEmpty(tenderBill)) {
                                //发送短信
                                smsUtils.sendNotifySMS_qcloud(su.phoneNum, smsUtils.code7, ['招标保证金', tenderBill.price], function(err) {})
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
                                                }
                                            })
                                        } else if (payType == '支付宝支付') {
                                            var refund = {
                                                refundNo: transNum,
                                                refundAmount: tenderBill.price,
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
                                                }
                                            }).catch(function(error) { res.end(error) })
                                        }
                                    }
                                })
                            }
                        })
                        TenderBill.findOne({
                            billState:"已支付",
                            billType: '招标定金',
                            targetId:  tender._id
                        }, function(err, tenderBill) {
                            if (!_.isEmpty(tenderBill)) {
                                //发送短信
                                smsUtils.sendNotifySMS_qcloud(su.phoneNum, smsUtils.code7, ['招标定金', tenderBill.price], function(err) {})
                                Transactions.update({
                                    transNum:tenderBill.billNum,
                                    transType: '招标定金'
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
                                                        transType: '招标定金退款',
                                                        price: -result.total_fee / 100,
                                                        payType: payType,
                                                        payInfo: result,
                                                        user: su._id
                                                    })
                                                    newTran.save(function(err) {})
                                                    Complain.findOneAndUpdate({tender:req.body.tenderId},{$set:{isSoluted:true}},function (err) {
                                                        res.json({result:"success"})
                                                    })
                                                    Company.findOneAndUpdate({ user: tender.chosenBidderUser }, { $inc: { cashAccount: -tenderBill.price } }, function(err, company) {})
                                                }
                                            })
                                        } else if (payType == '支付宝支付') {
                                            var refund = {
                                                refundNo: transNum,
                                                refundAmount: tenderBill.price,
                                                // refundAmount: 0.01
                                            }
                                            alipay.refund(tenderBill.billNum, refund).then(function(result) {
                                                if (result.code == '10000' &&
                                                    result.msg == 'Success') {
                                                    var newTran = new Transactions({
                                                        transNum: moment().format('YYYYMMDDHHmmss') + _.random(1000, 9999),
                                                        transType: '招标定金退款',
                                                        price: -result.send_back_fee,
                                                        payType: payType,
                                                        payInfo: result,
                                                        user: su._id
                                                    })
                                                    newTran.save(function(err) {})
                                                    Complain.findOneAndUpdate({tender:req.body.tenderId},{$set:{isSoluted:true}},function (err) {
                                                        res.json({result:"success"})
                                                    })
                                                    Company.findOneAndUpdate({ user: tender.chosenBidderUser }, { $inc: { cashAccount: -tenderBill.price } }, function(err, company) {})
                                                }
                                            }).catch(function(error) { res.end(error) })
                                        }
                                    }
                                })
                            }
                        })
                    }else {
                        Company.findOne({_id:tender.chosenBidder.company},function (err,company) {
                            if(_.isEmpty(company)){
                                res.json({ error: "查不到此投标公司" })
                            }else if(_.isEmpty(company.withdrawAccount)){
                                res.json({ error: "查不到此投标公司账户" })
                            }else {
                                var alipayAccount
                                for(var i=0;i<company.withdrawAccount.length;i++){
                                    if(company.withdrawAccount[i].type=='alipay'){
                                        alipayAccount=company.withdrawAccount[i].account
                                    }
                                }
                                var finalpayment=Math.round(tender.chosenBidder.price*(1-tender.chosenBidder.depositRate))
                                if(alipayAccount){
                                    if(tender.deposit){
                                        if(tender.deposit<finalpayment){
                                            TenderBill.findOne({
                                                billState:"已支付",
                                                billType: '招标保证金',
                                                targetId:  tender._id
                                            }, function(err, tenderBill1) {
                                                if (!_.isEmpty(tenderBill1)) {
                                                    //发送短信
                                                    Transactions.update({
                                                        transNum:tenderBill1.billNum,
                                                        transType: '招标保证金'
                                                    },{$set:{refund: true}},{ multi: true }, function(err, raw) {
                                                        if (err) {
                                                            res.json({ error: err })
                                                        } else {
                                                            TenderBill.findOne({
                                                                billState:"已支付",
                                                                billType: '招标定金',
                                                                targetId:  tender._id
                                                            }, function(err, tenderBill) {
                                                                if (!_.isEmpty(tenderBill)) {
                                                                    //发送短信
                                                                    Transactions.update({
                                                                        transNum:tenderBill.billNum,
                                                                        transType: '招标定金',
                                                                        refund: true
                                                                    },{ multi: true }, function(err, raw) {
                                                                        if (err) {
                                                                            res.json({ error: err })
                                                                        } else {
                                                                            Company.findOneAndUpdate({ user: tender.chosenBidderUser }, { $inc: { cashAccount: -tenderBill.price } }, function(err, company) {
                                                                                if(_.isEmpty(company)){
                                                                                    res.json({ error: "未找到公司" })
                                                                                }else{
                                                                                    var option = {
                                                                                        out_biz_no: moment().format('YYYYMMDDHHmmss') + _.random(1000, 9999), // 商户转账唯一订单号
                                                                                        payee_account: alipayAccount, // 支付宝账号
                                                                                        remark:"招标定金尾款",
                                                                                        payer_show_name:"幸福天地",
                                                                                        // amount: 0.1 // 转账金额 最少0.1
                                                                                        amount: ((tender.downpayment+tender.deposit)*0.97).toFixed(2) // 转账金额 最少0.1
                                                                                    }

                                                                                    alipay.transfer(option).then(function(result) {
                                                                                        if (result.code == '10000' &&
                                                                                            result.msg == 'Success') {
                                                                                            var newTran = new Transactions({ transNum: moment().format('YYYYMMDDHHmmss') + _.random(1000, 9999),refund:true, transType: '招标定金尾款', price: -(tender.downpayment+tender.deposit), payType: '支付宝支付', payInfo: result, user: tender.chosenBidderUser })
                                                                                            newTran.save(function(err) {
                                                                                                Tender.findByIdAndUpdate(req.body.tenderId,{
                                                                                                    $set: {
                                                                                                        withdrawDeposit: 3
                                                                                                    },
                                                                                                    $addToSet: { transactions: newTran._id }},function (err,ter) {
                                                                                                })
                                                                                                Complain.findOneAndUpdate({tender:req.body.tenderId},{$set:{isSoluted:true}},function (err) {})
                                                                                                res.json({result:"success"})
                                                                                            })
                                                                                        }
                                                                                    })
                                                                                }
                                                                            })
                                                                        }
                                                                    })
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                        }else {
                                            TenderBill.findOne({
                                                billState:"已支付",
                                                billType: '招标保证金',
                                                targetId:  tender._id
                                            }, function(err, tenderBill1) {
                                                if (!_.isEmpty(tenderBill1)) {
                                                    //发送短信
                                                    Transactions.update({
                                                        transNum:tenderBill1.billNum,
                                                        transType: '招标保证金'
                                                    },{$set:{refund: true}},{ multi: true }, function(err, raw) {
                                                        if (err) {
                                                            res.json({ error: err })
                                                        } else {
                                                            var payType = tenderBill1.payType
                                                            var transNum = moment().format('YYYYMMDDHHmmss') + _.random(1000, 9999)
                                                            if (payType == '微信支付') {
                                                                var refund = {
                                                                    out_trade_no: tenderBill1.billNum,
                                                                    out_refund_no: transNum,
                                                                    total_fee: (tenderBill1.price-finalpayment)*100,
                                                                    refund_fee: (tenderBill1.price-finalpayment)*100
                                                                    // total_fee: 1,
                                                                    // refund_fee: 1
                                                                }
                                                                tenpay.refund(refund, function(err, result) {
                                                                    if (result.return_code == 'SUCCESS' &&
                                                                        result.return_msg == 'OK') {
                                                                        var newTran = new Transactions({
                                                                            transNum: result.out_refund_no,
                                                                            transType: '招标保证金剩余退款',
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
                                                                    refundAmount: tenderBill1.price
                                                                    // refundAmount: 0.01
                                                                }
                                                                alipay.refund(tenderBill1.billNum, refund).then(function(result) {
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
                                                                    }
                                                                }).catch(function(error) { res.end(error) })
                                                            }
                                                            TenderBill.findOne({
                                                                billState:"已支付",
                                                                billType: '招标定金',
                                                                targetId:  tender._id
                                                            }, function(err, tenderBill) {
                                                                if (!_.isEmpty(tenderBill)) {
                                                                    //发送短信
                                                                    Transactions.update({
                                                                        transNum:tenderBill.billNum,
                                                                        transType: '招标定金'
                                                                    },{$set:{refund: true}},{ multi: true }, function(err, raw) {
                                                                        if (err) {
                                                                            res.json({ error: err })
                                                                        } else {
                                                                            Company.findOneAndUpdate({ user: tender.chosenBidderUser }, { $inc: { cashAccount: -tenderBill.price } }, function(err, company) {
                                                                                if(_.isEmpty(company)){
                                                                                    res.json({ error: "未找到公司" })
                                                                                }else{
                                                                                    var option = {
                                                                                        out_biz_no: moment().format('YYYYMMDDHHmmss') + _.random(1000, 9999), // 商户转账唯一订单号
                                                                                        payee_account: alipayAccount, // 支付宝账号
                                                                                        remark:"招标定金尾款",
                                                                                        payer_show_name:"幸福天地",
                                                                                        // amount: 0.1 // 转账金额 最少0.1
                                                                                        amount: ((tender.downpayment+finalpayment)*0.97).toFixed(2) // 转账金额 最少0.1
                                                                                    }

                                                                                    alipay.transfer(option).then(function(result) {
                                                                                        if (result.code == '10000' &&
                                                                                            result.msg == 'Success') {
                                                                                            var newTran = new Transactions({ transNum: moment().format('YYYYMMDDHHmmss') + _.random(1000, 9999),refund:true, transType: '招标定金尾款', price: -(tender.downpayment+finalpayment), payType: '支付宝支付', payInfo: result, user: tender.chosenBidderUser })
                                                                                            newTran.save(function(err) {
                                                                                                Tender.findByIdAndUpdate(req.body.tenderId,{
                                                                                                    $set: {
                                                                                                        withdrawDeposit: 3
                                                                                                    },
                                                                                                    $addToSet: { transactions: newTran._id }},function (err,ter) {
                                                                                                })

                                                                                                Complain.findOneAndUpdate({tender:req.body.tenderId},{$set:{isSoluted:true}},function (err) {})
                                                                                                res.json({result:"success"})
                                                                                            })
                                                                                        }
                                                                                    })
                                                                                }
                                                                            })
                                                                        }
                                                                    })
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    }else {
                                        //发送短信，没有招标保证金，只能转定金
                                        TenderBill.findOne({
                                            billState:"已支付",
                                            billType: '招标定金',
                                            targetId:  tender._id
                                        }, function(err, tenderBill) {
                                            if (!_.isEmpty(tenderBill)) {
                                                //发送短信
                                                Transactions.update({
                                                    transNum:tenderBill.billNum,
                                                    transType: '招标定金',
                                                    refund: true
                                                },{ multi: true }, function(err, raw) {
                                                    if (err) {
                                                        res.json({ error: err })
                                                    } else {
                                                        Company.findOneAndUpdate({ user: tender.chosenBidderUser }, { $inc: { cashAccount: -tenderBill.price } }, function(err, company) {
                                                            if(_.isEmpty(company)){
                                                                res.json({ error: "未找到公司" })
                                                            }else{
                                                                var option = {
                                                                    out_biz_no: moment().format('YYYYMMDDHHmmss') + _.random(1000, 9999), // 商户转账唯一订单号
                                                                    payee_account: alipayAccount, // 支付宝账号
                                                                    remark:"招标定金尾款",
                                                                    payer_show_name:"幸福天地",
                                                                    // amount: 0.1 // 转账金额 最少0.1
                                                                    amount: ((tender.downpayment)*0.97).toFixed(2), // 转账金额 最少0.1
                                                                }

                                                                alipay.transfer(option).then(function(result) {
                                                                    if (result.code == '10000' &&
                                                                        result.msg == 'Success') {
                                                                        var newTran = new Transactions({ transNum: moment().format('YYYYMMDDHHmmss') + _.random(1000, 9999),refund:true, transType: '招标定金尾款', price: -(tender.downpayment+tender.deposit), payType: '支付宝支付', payInfo: result, user: tender.chosenBidderUser })
                                                                        newTran.save(function(err) {
                                                                            Tender.findByIdAndUpdate(req.body.tenderId,{
                                                                                $set: {
                                                                                    withdrawDeposit: 3
                                                                                },
                                                                                $addToSet: { transactions: newTran._id }},function (err,ter) {
                                                                            })
                                                                            Complain.findOneAndUpdate({tender:req.body.tenderId},{$set:{isSoluted:true}},function (err) {})
                                                                            res.json({result:"success"})
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }

                                }else {
                                    res.json({ error: "此投标公司没有支付宝账户" })
                                }
                            }
                        })

                    }
                }
            })
        }

    } else {
        res.end(settings.system_noPower)
    }

})

//投诉关闭接口
router.post('/manage/deagreeToSolute', function(req, res, next) {
    if (adminFunc.checkAdminPower(req, 'complainManage_modify')) {
        Complain.findOneAndUpdate({_id:req.body.complainId},{$set:{isSoluted:true}},function(err, docs) {
            if (err) {
                res.json(err)
            } else if (!_.isEmpty(docs)) {
                res.json({result:"关闭成功"})
            } else {
                res.json({result:"关闭失败"})
            }
        })
    } else {
        res.end(settings.system_noPower)
    }

})

//新增文章接口
router.post('/manage/addArticle', function(req, res, next) {
    var title=req.body.title
    var tags=req.body.tags
    var keywords=req.body.keywords
    var oldAuthor=req.body.oldAuthor
    var sImg=req.body.sImg
    var discription=req.body.discription
    var category=req.body.category
    var from=req.body.from
    var author=req.session.user._id
    var itemId=req.body.itemId
    var doc={
        title:title,
        tags:tags,
        keywords:keywords,
        oldAuthor:oldAuthor,
        sImg:sImg,
        discription:discription,
        category:category,
        from:from,
        author:author
    }
    if(!_.isEmpty(itemId)){
        Content.findOneAndUpdate({contentNum:itemId},doc,function (err,cont) {
            res.end("success")
        })
    }else {
        var contentNum=moment().format('YYYYMMDDHHmmss') + _.random(10000, 99999)
        doc.contentNum=contentNum
        var content=new Content(doc)
        content.save(function (err,cont) {
            res.end("success")
        })
    }
})

//置顶文章接口
router.post('/manage/topArticle', function(req, res, next) {
    if (adminFunc.checkAdminPower(req, 'articleManage_content_modify')) {
        var itemId=req.body.itemId
        if(itemId){
            Content.findOneAndUpdate({_id:itemId},{$set:{isTop:true}},function (err,cont) {
                res.end("success")
            })
        }else {
            res.end("no id")
        }
    } else {
        res.end(settings.system_noPower)
    }

})

//置顶新闻接口
router.post('/manage/topNews', function(req, res, next) {
    if (adminFunc.checkAdminPower(req, 'newsManage_modify')) {
        var itemId=req.body.itemId
        if(itemId){
            News.findOneAndUpdate({_id:itemId},{$set:{isTop:true}},function (err,cont) {
                res.end("success")
            })
        }else {
            res.end("no id")
        }
    } else {
        res.end(settings.system_noPower)
    }

})

//取消置顶文章接口
router.post('/manage/cancletopArticle', function(req, res, next) {
    if (adminFunc.checkAdminPower(req, 'articleManage_content_modify')) {
        var itemId=req.body.itemId
        if(itemId){
            Content.findOneAndUpdate({_id:itemId},{$set:{isTop:false}},function (err,cont) {
                res.end("success")
            })
        }else {
            res.end("no id")
        }
    } else {
        res.end(settings.system_noPower)
    }

})

//取消置顶新闻接口
router.post('/manage/cancletopNews', function(req, res, next) {
    if (adminFunc.checkAdminPower(req, 'newsManage_modify')) {
        var itemId=req.body.itemId
        if(itemId){
            News.findOneAndUpdate({_id:itemId},{$set:{isTop:false}},function (err,cont) {
                res.end("success")
            })
        }else {
            res.end("no id")
        }
    } else {
        res.end(settings.system_noPower)
    }

})

//删除文章接口
router.post('/manage/delArticle', function(req, res, next) {
    if (adminFunc.checkAdminPower(req, 'articleManage_content_del')) {
        var itemId=req.body.itemId
        if(itemId){
            Content.findOneAndUpdate({_id:itemId},{$set:{isDeleted:true}},function (err,cont) {
                res.end("success")
            })
        }else {
            res.end("no id")
        }
    } else {
        res.end(settings.system_noPower)
    }

})

//删除新闻接口
router.post('/manage/delNews', function(req, res, next) {
    if (adminFunc.checkAdminPower(req, 'newsManage_del')) {
        var itemId=req.body.itemId
        if(itemId){
            News.findOneAndUpdate({_id:itemId},{$set:{isDeleted:true}},function (err,cont) {
                res.end("success")
            })
        }else {
            res.end("no id")
        }
    } else {
        res.end(settings.system_noPower)
    }

})
//文章检索
router.post('/manage/searchArticleFilter', function(req, res, next) {

    var order = req.body.order
    var title = req.body.title
    var from = req.body.from
    var isDeleted = req.body.isDeleted
    var isTop = req.body.isTop
    var page = parseInt(req.body.page)
    var limit = parseInt(req.body.limit)
    if (!page) {
        page = 1
    }
    if (!limit) {
        limit = 15
    }

    var startNum = (page - 1) * limit

    var query = {}

    if (title && title.length > 1 && title.length <= 20) {
        query.title = { $regex: new RegExp(title, 'i') }
    }
    if (from && from.length > 1) {
        query.from = from
    }
    if (isDeleted!==undefined&&isDeleted!=='') {
        if(isDeleted=="true"){
            query.isDeleted=true
        }else {
            query.isDeleted = false
        }
    }
    if (isTop!==undefined&&isTop!=='') {
        if(isTop=="true"){
            query.isTop=true
        }else {
            query.isTop = false
        }
    }

    var resultNum = Content.find(query).count()
    Content.find(query).sort(order).skip(startNum).limit(limit).exec(function(err, docs) {
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
})

//文章检索
router.post('/manage/searchNewsFilter', function(req, res, next) {

    var order = req.body.order
    var title = req.body.title
    var isDeleted = req.body.isDeleted
    var isTop = req.body.isTop
    var page = parseInt(req.body.page)
    var limit = parseInt(req.body.limit)
    if (!page) {
        page = 1
    }
    if (!limit) {
        limit = 15
    }

    var startNum = (page - 1) * limit

    var query = {}

    if (title && title.length > 1 && title.length <= 20) {
        query.title = { $regex: new RegExp(title, 'i') }
    }

    if (isDeleted!==undefined&&isDeleted!=='') {
        if(isDeleted=="true"){
            query.isDeleted=true
        }else {
            query.isDeleted = false
        }
    }
    if (isTop!==undefined&&isTop!=='') {
        if(isTop=="true"){
            query.isTop=true
        }else {
            query.isTop = false
        }
    }

    var resultNum = News.find(query).count()
    News.find(query).sort(order).skip(startNum).limit(limit).exec(function(err, docs) {
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
})

//新增新闻接口
router.post('/manage/addNews', function(req, res, next) {
    if (adminFunc.checkAdminPower(req, 'newsManage_add')) {
        var title=req.body.title
        var website=req.body.website
        var onlineView=req.body.onlineView
        var coverImg=req.body.coverImg
        var newsDate=req.body.newsDate
        var itemId=req.body.itemId

        var doc={
            title:title,
            website:website,
            onlineView:onlineView,
            coverImg:coverImg,
            newsDate:newsDate
        }
        if(!_.isEmpty(itemId)){
            News.findOneAndUpdate({_id:itemId},doc,function (err,cont) {
                res.end("success")
            })
        }else {
            var content=new News(doc)
            content.save(function (err,cont) {
                res.end("success")
            })
        }

    } else {
        res.end(settings.system_noPower)
    }

})

module.exports = router