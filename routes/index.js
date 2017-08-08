var express = require('express')
var router = express.Router()
var _ = require('lodash')
var mongoose = require('mongoose')

// 数据库操作对象
var DbOpt = require('../models/Dbopt')
var Content = require('../models/Content')
var ContentCategory = require('../models/ContentCategory')
var PubHistory = require('../models/publish/PubHistory')
var Demands = require('../models/publish/Demands')
var PriceConfig = require('../models/admincenter/PriceConfig')
var PriceConfig2 = require('../models/admincenter/PriceConfig2')
var News = require('../models/admincenter/News')
var PrecisePromotion = require('../models/admincenter/PrecisePromotion')
var Bill = require('../models/Bill')
var Favorites = require('../models/Favorites')
var smsUtils = require('../util/smsUtils')
var Tender = require('../models/tender/Tender')
var Company = require('../models/Company')

var shortid = require('shortid')
var validator = require('validator')
var moment = require('moment')
var settings = require('../models/db/settings')
var siteFunc = require('../models/db/siteFunc')
var url = require('url')
var cache = require('../util/cache')

/* GET home page. */
router.get('/', function(req, res, next) {
    siteFunc.renderToTargetPageByType(req, res, 'userHome', { title: '主页', page: 'userHome' })
})

// 缓存站点地图
router.get('/sitemap.html', function(req, res, next) {
    var siteMapNeedData
    cache.get(settings.session_secret + '_siteMapHtml', function(siteMapHtml) {
        if (siteMapHtml) {
            siteMapNeedData = siteMapHtml
            siteFunc.renderToTargetPageByType(req, res, 'sitemap', { docs: siteMapNeedData })
        } else {
            Content.find({ 'type': 'content', 'state': true }, 'title', function(err, docs) {
                if (err) {
                    res.end(err)
                } else {
                    siteMapNeedData = docs
                    cache.set(settings.session_secret + '_siteMapHtml', docs, 1000 * 60 * 60 * 24); // 缓存一天
                    siteFunc.renderToTargetPageByType(req, res, 'sitemap', { docs: siteMapNeedData })
                }
            })
        }
    })
})

// 文档详情页面
router.get('/details/:url', function(req, res, next) {
    var url = req.params.url
    var currentId = url.split('.')[0]
    if (shortid.isValid(currentId)) {
        Content.findOne({ '_id': currentId, 'state': true }).populate('category').populate('author').exec(function(err, result) {
            if (err) {
                res.log(err)
            } else {
                if (result) {
                    // 更新访问量
                    result.clickNum = result.clickNum + 1
                    result.save(function() {
                        var cateParentId = result.sortPath.split(',')[1]
                        var cateQuery = { 'sortPath': { $regex: new RegExp(cateParentId, 'i') } }

                        siteFunc.getContentsCount(req, res, cateParentId, cateQuery, function(count) {
                            siteFunc.renderToTargetPageByType(req, res, 'detail', { count: count, cateQuery: cateQuery, detail: result })
                        })
                    })
                } else {
                    siteFunc.renderToTargetPageByType(req, res, 'error', { info: '非法操作!', message: settings.system_illegal_param, page: 'do404' })
                }
            }
        })
    } else {
        siteFunc.renderToTargetPageByType(req, res, 'error', { info: '非法操作!', message: settings.system_illegal_param, page: 'do500' })
    }
})

// 分类列表页面  http://127.0.0.1/DoraCms___VylIn1IU-1.html
router.get('/:defaultUrl', function(req, res, next) {
    var defaultUrl = req.params.defaultUrl
    var url = defaultUrl.split('___')[1]
    var indexUrl = defaultUrl.split('—')[0]
    if (indexUrl == 'page') { // 首页的分页
        var indexPage = defaultUrl.split('—')[1].split('.')[0]
        if (indexPage && validator.isNumeric(indexPage)) {
            req.query.page = indexPage
        }
        siteFunc.renderToTargetPageByType(req, res, 'index')
    } else {
        var currentUrl = url
        if (url) {
            if (url.indexOf('—') >= 0) {
                currentUrl = url.split('—')[0]
                var catePageNo = (url.split('—')[1]).split('.')[0]
                if (catePageNo && validator.isNumeric(catePageNo)) {
                    req.query.page = catePageNo
                }
            }
            queryCatePage(req, res, currentUrl)
        } else {
            next()
        }
    }
})

// 分类列表页面  http://127.0.0.1/front-development/AngluarJs___EyW7kj6w
router.get('/:forder/:defaultUrl', function(req, res, next) {
    var defaultUrl = req.params.defaultUrl
    var url = defaultUrl.split('___')[1]
    var currentUrl = url
    if (url) {
        if (url.indexOf('—') >= 0) {
            currentUrl = url.split('—')[0]
            var catePageNo = (url.split('—')[1]).split('.')[0]
            if (catePageNo && validator.isNumeric(catePageNo)) {
                req.query.page = catePageNo
            }
        }
        queryCatePage(req, res, currentUrl)
    } else {
        next()
    }
})

// 分类页面路由设置
function queryCatePage(req, res, cateId) {
    if (shortid.isValid(cateId)) {
        ContentCategory.findOne({ '_id': cateId }).populate('contentTemp').exec(function(err, result) {
            if (err) {
                siteFunc.renderToTargetPageByType(req, res, 'error', { info: '页面未找到!', message: err.message, page: 'do500' })
            } else {
                if (result) {
                    var contentQuery = { 'sortPath': { $regex: new RegExp(result._id, 'i') }, 'state': true }
                    var cateParentId = result.sortPath.split(',')[1]
                    var cateQuery = { 'sortPath': { $regex: new RegExp(cateParentId, 'i') } }

                    siteFunc.renderToTargetPageByType(req, res, 'contentList', { contentQuery: contentQuery, cateQuery: cateQuery, result: result })
                } else {
                    siteFunc.renderToTargetPageByType(req, res, 'error', { info: '非法操作!', message: settings.system_illegal_param, page: 'do500' })
                }
            }
        })
    } else {
        siteFunc.renderToTargetPageByType(req, res, 'error', { info: '非法操作!', message: settings.system_illegal_param, page: 'do500' })
    }
}

router.post('/searchResFilterByBusiness', function(req, res, next) {
    var categoryL2 = req.body.categoryL2
    var userId = req.body.userId
    var order = { isTop: -1, refreshedAt: -1 }
    var page = parseInt(req.body.page)
    var limit = parseInt(req.body.limit)
    if (!page) {
        page = 1
    }
    if (!limit) {
        limit = 15
    }

    var query = {}

    if (!_.isEmpty(req.body.categoryL2)) {
        query.categoryL2 = categoryL2
    }
    var startNum = (page - 1) * limit

    // 最多只能显示100条数据，防止八爪鱼等软件爬取数据
    if (startNum >= 100) {
        res.end('请输入更详细的查询条件')
    } else {
        query.user = userId
        query.isShowing = true
        query.isDeleted = false

        var resultNum = PubHistory.find(query).count()
        PubHistory.find(query).sort(order).skip(startNum).limit(limit).exec(function(err, docs) {
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

// 资源搜索结果过滤接口
// 参数：
// resType（可选）：类型 制作、材料、设备
// text（可选）：搜索文本内容2到20个字符
// region（可选）：区域对象{ province:'', city:'', district:'' }
// types（可选）: 子类型数组
// freightType（可选）：运费支付方式
// priceFrom（可选）：价格区间
// priceTo（可选）：价格区间
// installType（可选）：安装类型
// brand（可选）：品牌
// order（可选）：排序字段 默认{refreshedAt: -1}
// page（必选）：当前页面
// limit（必选）：每页记录条数 默认每页15条
router.post('/searchResFilter', function(req, res, next) {
    var resType = req.body.resType
    var text = req.body.text
    var region = {}
    var types = req.body.types
    var freightType = req.body.freightType
    var priceFrom = parseInt(req.body.priceFrom)
    var priceTo = parseInt(req.body.priceTo)
    var installType = req.body.installType
    var brand = req.body.brand
    var order = { refreshedAt: -1 }
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

    // 最多只能显示100条数据，防止八爪鱼等软件爬取数据
    if (startNum >= 100) {
        res.end('请输入更详细的查询条件')
    } else {
        var queryReg = {}
        if (!_.isEmpty(region.province) && _.isEmpty(region.city) && _.isEmpty(region.district)) {
            queryReg = {
                'region.province': region.province
            }
        } else if (!_.isEmpty(region.province) && !_.isEmpty(region.city) && _.isEmpty(region.district)) {
            queryReg = {
                'region.province': region.province,
                'region.city': region.city
            }
        } else if (!_.isEmpty(region.province) && !_.isEmpty(region.city) && !_.isEmpty(region.district)) {
            queryReg = {
                'region.province': region.province,
                'region.city': region.city,
                'region.district': region.district
            }
        } else {
            region = { province: '湖北' }
        }

        var query = {}
        if (!_.isEmpty(queryReg)) {
            query.$or = [queryReg, { promotionRegions: region.province }]
        }

        if (resType) {
            query.resType = resType
        }

        query.isShowing = true
        query.isDeleted = false
        if (text && text.length <= 20) {
            query.title = { $regex: new RegExp(text, 'i') }
        }

        // 子类型
        if (!_.isEmpty(types) && !_.isEmpty(resType)) {
            query.categoryL3 = { $in: types }
        }
        if (_.isEmpty(resType)) {
            query.categoryL1 = { $in: types }
        }
        // 运费支付
        if (freightType) {
            query.freightType = freightType
        }
        // 价格区间
        if (priceFrom && priceTo) {
            query.$and = [{
                discountPrice: {
                    $gte: priceFrom
                }
            }, {
                discountPrice: {
                    $lte: priceTo
                }
            }]
        }

        if (resType == 'Manufacture') {
            if (installType) {
                query.installType = installType
            }
        } else if (resType == 'Material') {
            if (!_.isEmpty(brand)) {
                query.brand = { $in: brand }
            }
        } else if (resType == 'Equipment') {
            if (!_.isEmpty(brand)) {
                query.brand = { $in: brand }
            }
            if (installType) {
                query.installType = installType
            }
        }

        var resultNum = PubHistory.find(query).count()

        PubHistory.aggregate([
            { $match: query },
            {
                $project: {
                    resNum: 1,
                    region: 1,
                    resType: 1,
                    categoryL1: 1,
                    categoryL2: 1,
                    categoryL3: 1,
                    installType: 1,
                    brand: 1,
                    freightType: 1,
                    originalPrice: 1,
                    discountPrice: 1,
                    images: 1,
                    title: 1,
                    contacts: 1,
                    details: 1,
                    pageview: 1,
                    createdAt: 1,
                    user: 1,
                    promotionRegions: 1,
                    promotionBegin: 1,
                    promotionEnd: 1,
                    refreshedAt: 1,
                    isDeleted: 1,
                    isShowing: 1,
                    isTop: 1,
                    isPromotion: {
                        $cond: { if: { $and: [{ $in: [region.province, '$promotionRegions'] }, { $gte: ['$promotionEnd', new Date()] }] }, then: 1, else: 0 }
                    }
                }
            },
            { $sort: _.extend({ isPromotion: -1 }, order) },
            { $skip: startNum },
            { $limit: limit }
        ]).exec(function(err, aggrDocs) {
            if (err) {
                res.end(err)
            } else if (!_.isEmpty(aggrDocs)) {
                var opts = [{
                    path: 'categoryL1',
                    select: 'name',
                    model: 'ContentCategory'
                }, {
                    path: 'categoryL2',
                    select: 'name',
                    model: 'ContentCategory'
                }, {
                    path: 'categoryL3',
                    select: 'name',
                    model: 'ContentCategory'
                }, {
                    path: 'user',
                    select: '_id company idCardIdentify companyIdentify',
                    model: 'User',
                    populate: {
                        path: 'company idCardIdentify companyIdentify',
                        select: 'companyName status'
                    }
                }]

                PubHistory.populate(aggrDocs, opts, function(err, docs) {
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
                })
            } else {
                res.end('查询为空')
            }
        })
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
router.post('/searchTenderFilter', function(req, res, next) {
    var text = req.body.text
    var region = {}
    var types = req.body.types
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

    // 最多只能显示100条数据，防止八爪鱼等软件爬取数据
    if (startNum >= 100) {
        res.end('请输入更详细的查询条件')
    } else {
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

        if (!_.isEmpty(types)) {
            query.categoryL2 = { $in: types }
        }

        if (tenderType) {
            query.tenderType = tenderType
        }
        if (status) {
            query.status = status
            query.tenderEnd = { $gt: new Date() }
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
    }
})

//文章搜索接口过滤
router.post('/searchArticleFilter', function(req, res, next) {
    var order = {createdAt: -1 }
    var page = parseInt(req.body.page)
    var limit = parseInt(req.body.limit)
    if (!page) {
        page = 1
    }
    if (!limit) {
        limit = 15
    }
    var startNum = (page - 1) * limit

    var resultNum = Content.find({isDeleted:false}).count()
    Content.aggregate([
        { $match: {isDeleted:false} },
        {
            $project: {
                contentNum: 1,
                title: 1,
                category: 1,
                tags: 1,
                keywords: 1,
                oldAuthor: 1,
                from: 1,
                sImg: 1,
                discription: 1,
                isDeleted: 1,
                createdAt: 1,
                updateDate: 1,
                author: 1,
                clickNum: 1,
                isTop:1,
                Top: {
                    $cond: { if:{$gte:['$isTop',true]}, then: 1, else: 0 }
                }
            }
        },
        { $sort: _.extend({ Top: -1 }, order) },
        { $skip: startNum },
        { $limit: limit }
    ]).exec(function(err, docs) {
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

//新闻搜索接口过滤
router.post('/searchNewsFilter', function(req, res, next) {
    var order = {newsDate: -1 }
    var page = parseInt(req.body.page)
    var limit = parseInt(req.body.limit)
    if (!page) {
        page = 1
    }
    if (!limit) {
        limit = 15
    }
    var startNum = (page - 1) * limit

    var resultNum = News.find({isDeleted:false}).count()
    News.aggregate([
        { $match: {isDeleted:false} },
        {
            $project: {
                title: 1,
                website: 1,
                coverImg: 1,
                onlineView: 1,
                newsDate: 1,
                isDeleted: 1,
                createdAt: 1,
                isTop:1,
                Top: {
                    $cond: { if:{$gte:['$isTop',true]}, then: 1, else: 0 }
                }
            }
        },
        { $sort: _.extend({ Top: -1 }, order) },
        { $skip: startNum },
        { $limit: limit }
    ]).exec(function(err, docs) {
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
// 需求搜索结果过滤接口
// 参数：
// text（可选）：搜索文本内容2到20个字符
// region（可选）：区域对象{ province:'', city:'', district:'' }
// types（可选）: 子类型数组
// priceFrom（可选）：价格区间
// priceTo（可选）：价格区间
// classify（可选）：行业数组
// order（可选）：排序字段 默认{refreshedAt: -1}
// page（必选）：当前页面
// limit（必选）：每页记录条数 默认每页15条
router.post('/searchDemandsFilter', function(req, res, next) {
    var text = req.body.text
    var region = {}
    var types = req.body.types
    var priceFrom = parseInt(req.body.priceFrom)
    var priceTo = parseInt(req.body.priceTo)
    var classify = req.body.classify
    var page = parseInt(req.body.page)
    var limit = parseInt(req.body.limit)
    var order = { refreshedAt: -1 }

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

    // 最多只能显示100条数据，防止八爪鱼等软件爬取数据
    if (startNum >= 100) {
        res.end('请输入更详细的查询条件')
    } else {
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

        query.isShowing = true
        query.isDeleted = false
        if (text && text.length > 1 && text <= 20) {
            query.title = { $regex: new RegExp(text, 'i') }
        }

        // 子类型
        if (!_.isEmpty(types)) {
            query.categoryL1 = { $in: types }
        }
        // 所属行业
        if (!_.isEmpty(classify)) {
            query.classify = { $in: classify }
        }
        // 价格区间
        if (priceFrom && priceTo && priceTo > 0) {
            query.$and = [{
                price: {
                    $gte: priceFrom
                }
            }, {
                price: {
                    $lte: priceTo
                }
            }]
        }

        var resultNum = Demands.find(query).count()
        Demands.find(query).sort(order).skip(startNum).limit(limit).populate('categoryL1 categoryL2', 'name').exec(function(err, docs) {
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

// 非登录状态通过父类别得到子类别
router.post('/getChildType', function(req, res, next) {
    var currentCateList = ContentCategory.find({ parentID: req.body.parentID, state: '1' }).sort({ 'sortId': 1 })
    res.json({
        currentCateList: currentCateList
    })
})

// 根据服务时间和服务项目查询服务价格
// 参数：
// period：推广周期 1季度、半年、1年
// priorShow：是否选择优先展示
// eBook： 是否选择数字期刊
// VR：是否选择VR展馆
// weMedia：是否选择自媒体渠道
router.post('/queryBrandPromotionPrice', function(req, res, next) {
    var period = req.body.period
    var priorShow = Boolean(req.body.priorShow)
    var eBook = req.body.eBook == 'true' ? true : false
    var VR = req.body.VR == 'true' ? true : false
    var weMedia = req.body.weMedia == 'true' ? true : false

    var serviceItems = 0
    var totalPrice = 0
    var discountPrice = 0

    if (priorShow) {
        serviceItems++
        totalPrice += PriceConfig.priorShowPrice
    }
    if (eBook) {
        serviceItems++
        totalPrice += PriceConfig.eBookPrice
    }
    if (VR) {
        serviceItems++
        totalPrice += PriceConfig.VRPrice
    }
    if (weMedia) {
        serviceItems++
        totalPrice += PriceConfig.weMediaPrice
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

    res.json({ discountPrice: discountPrice, totalPrice: totalPrice })
})

// 根据推广时间和省份数量查询精准推广服务价格
// 参数：
// period：推广周期 1季度、半年、1年
// provinceNum: 推广省份数组
router.post('/queryPrecisePromotionPrice', function(req, res, next) {
    var period = req.body.period
    var provinceNum = req.body.provinceNum

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

    res.json({ price: discountPrice })
})

// 收藏
router.post('/collectRes', function(req, res, next) {
    var error
    if (_.isEmpty(req.body.type)) {
        error = '类型为空'
    } else if (_.isEmpty(req.body.title)) {
        error = '标题为空'
    } else if (_.isEmpty(req.body.url)) {
        error = 'url路径为空'
    }
    // findOneAndRemove
    var type = req.body.type
    var title = req.body.title
    var url = req.body.url
    var su = req.session.user
    if (_.isEmpty(su)) {
        res.end(settings.system_illegal_param)
    } else if (error) {
        res.end(error)
    } else {
        req.body.user = su._id
        Favorites.findOneAndRemove({ url: url, user: su._id }, function(err, doc) {
            if (err) {
                res.end(err)
            } else if (!_.isEmpty(doc)) {
                res.end('success1')
            } else {
                var favorites = new Favorites(req.body)
                favorites.save(function(err) {
                    if (err) {
                        res.end(err)
                    } else {
                        res.end('success2')
                    }
                })
            }
        })
    }
})

// 精准推广新增
router.post('/insertPro', function(req, res, next) {
    var error
    var su = req.session.user
        // 必填项：地域、类别、原价、折扣价、图片、标题、联系人、联系方式、详细信息
    if (_.isEmpty(req.body.regions)) {
        error = '地域为空'
    } else if (_.isEmpty(req.body.period)) {
        error = '一级类目为空'
    } else if (_.isEmpty(req.body.payType)) {
        error = '二级类目为空'
    }

    if (_.isEmpty(su)) {
        res.end(settings.system_illegal_param)
    } else if (error) {
        res.end(error)
    } else {
        // 开始精准推广流程
        // 1、计算价格
        var period = req.body.period
        var regions = req.body.regions && req.body.regions !== null ? req.body.regions.split(',') : []
        var provinceNum = regions.length
        var payType = req.body.payType
        var categoryL1 = req.body.categoryL1
        var pubHistoryId = req.body.pubHistoryId
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
        var bill = new Bill({ billNum: moment().format('YYYYMMDDHHmmss') + _.random(10000, 99999), billName: '精准推广服务', billType: '服务', payType: payType, user: su._id, price: Math.ceil(discountPrice) })
        bill.save(function(err) {
            if (err) {
                res.end(err)
            } else {
                // 3、写promotion表
                var doc = { period: period, regions: regions, category: categoryL1, pubHistory: pubHistoryId, bill: bill._id, user: su._id }
                var pp = new PrecisePromotion(doc)
                pp.save(function(err) {
                    if (err) {
                        res.end(err)
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
    }
})
router.post('/searchCompany', function(req, res, next) {
    var text = req.body.text
    var regionArr=[]
    var region={}

    if (!_.isEmpty(req.body.region)) {
        regionArr = req.body.region.split('/')
        if(regionArr[0]){
            region.province=regionArr[0]
        }
        if(regionArr[1]){
            region.city=regionArr[1]
        }
        if(regionArr[2]){
            region.district=regionArr[2]
        }
    }

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

        if (text && text.length <= 20) {
            query.companyName = { $regex: new RegExp(text, 'i') }
        }

        Company.find(query).limit(25).exec(function(err, docs) {
            if (err) {
                res.end(err)
            } else if (!_.isEmpty(docs)) {
                res.json({result:docs})
            } else {
                res.end('查询为空')
            }
        })

})

module.exports = router