/**
 * Created by xiao on 2017/4/20.
 */
// 文档对象
var _ = require('lodash')

var Content = require('../Content')
    // 文章类别对象
var ContentCategory = require('../ContentCategory')
var PublishConfig = require('../publish/PublishConfig')
    // 文章标签对象
var ContentTags = require('../ContentTags')
    // 文章模板对象
var ContentTemplate = require('../ContentTemplate')
var SearchRecommend = require('../admincenter/SearchRecommend')
var BrandPromotion = require('../admincenter/BrandPromotion')
var Ebook = require('../admincenter/Ebook')
var Tender = require('../tender/Tender')
var Bid = require('../tender/Bid')
var Defaults = require('../tender/Defaults')
var TemplateItems = require('../TemplateItems')
var Demands = require('../publish/Demands')
var PubHistory = require('../publish/PubHistory')
var Install = require('../publish/Install')
var Favorites = require('../Favorites')
var IdCardIdentify = require('../IdCardIdentify')
var CompanyIdentify = require('../CompanyIdentify')
var Company = require('../Company')
var User = require('../User')
    // 广告对象
var Ads = require('../Ads')
    // 留言对象
var Message = require('../Message')
var settings = require('./settings')
    // 数据库操作对象
var DbOpt = require('../Dbopt')
    // 消息对象
var UserNotify = require('../UserNotify')
    // 时间格式化
var moment = require('moment')
    // 缓存
var cache = require('../../util/cache')
    // 系统消息
var Notify = require('../Notify')

function isLogined(req) {
    return req.session.logined
}

var tenderFunc = {
    siteInfos: function(title, cmsDescription, keyWords) {
        var discrip
        var key

        if (cmsDescription) {
            discrip = cmsDescription
        } else {
            discrip = settings.CMSDISCRIPTION
        }

        if (keyWords) {
            key = keyWords + ',' + settings.SITEBASICKEYWORDS
        } else {
            key = settings.SITEKEYWORDS
        }

        return {
            title: title + ' | ' + settings.SITETITLE,
            cmsDescription: discrip,
            keywords: key,
            siteIcp: settings.SITEICP,
            version: settings.SITEVERSION
        }
    },
    getFrontTemplate: function(req, res, callBack) {
        cache.get(settings.session_secret + '_siteTemplate', function(siteTemplate) {
            if (siteTemplate) {
                callBack(siteTemplate)
            } else {
                ContentTemplate.getDefaultTemp(res, function(doc) {
                    if (doc) {
                        cache.set(settings.session_secret + '_siteTemplate', doc, 1000 * 60 * 60 * 24); // 缓存一天
                    }
                    callBack(doc)
                })
            }
        })
    },
    getCategoryList: function() {
        return ContentCategory.find({ 'parentID': '0', 'state': '1' }, 'name defaultUrl').sort({ 'sortId': 1 }).find()
    },

    setDataForHtmlSiteMap: function(req, res, params, staticforder, defaultTempPath) {
        var ebookData = Ebook.find({}).sort({createdAt:-1})
        var searchRecommendForManufacture = SearchRecommend.findOne({ type: 'Manufacture', where: 'hotsearch' })
        var searchRecommendForMaterial = SearchRecommend.findOne({ type: 'Material', where: 'hotsearch' })
        var searchRecommendForEquipment = SearchRecommend.findOne({ type: 'Equipment', where: 'hotsearch' })
        var searchRecommendForDemands = SearchRecommend.findOne({ type: 'Demands', where: 'hotsearch' })
        var searchRecommendForSearch = SearchRecommend.findOne({ where: 'searchbox' })
        var searchRecommendForFix = Install.findOne({ type: 'Install', where: 'hotsearch' })

        return {
            title: "招投标发布-幸福天地",
            searchRecommendForManufacture: searchRecommendForManufacture,
            searchRecommendForMaterial: searchRecommendForMaterial,
            searchRecommendForEquipment: searchRecommendForEquipment,
            searchRecommendForDemands: searchRecommendForDemands,
            searchRecommendForSearch: searchRecommendForSearch,
            searchRecommendForFix: searchRecommendForFix,
            ebookData: ebookData,
            siteConfig: tenderFunc.siteInfos('幸福天地'),
            documentList: params.docs,
            cateList: tenderFunc.getCategoryList(),
            logined: req.session.logined,
            staticforder: staticforder,
            layout: defaultTempPath
        }
    },
    setDataForShopbid: function(req, res, params, staticforder, defaultTempPath,targetPath) {
        var isbind=false
        Company.findOne({user:req.session.user._id},function (err,company) {
            if(company.withdrawAccount.length>0) {
                for (var i = 0; i < company.withdrawAccount.length; i++) {
                    if (company.withdrawAccount[i].type == "alipay") {
                        isbind=true
                    }
                }
            }
            res.render(targetPath,  {
                title: "招投标发布-幸福天地",
                companyInfo:company,
                isbind:isbind,
                siteConfig: tenderFunc.siteInfos('幸福天地'),
                documentList: params.docs,
                cateList: tenderFunc.getCategoryList(),
                logined: req.session.logined,
                staticforder: staticforder,
                layout: defaultTempPath
            })
        })
    },
    setDataForShopAccount: function(req, res, params, staticforder, defaultTempPath) {
        var company = Company.findOne({ user: req.session.user._id })
        return {
            siteConfig: tenderFunc.siteInfos('幸福天地'),
            documentList: params.docs,
            company: company,
            cateList: tenderFunc.getCategoryList(),
            logined: req.session.logined,
            staticforder: staticforder,
            layout: defaultTempPath
        }
    },
    setDataForBid: function(req, res, params, staticforder, defaultTempPath, targetPath) {
        var ebookData = Ebook.find({}).sort({createdAt:-1})
        var searchRecommendForManufacture = SearchRecommend.findOne({ type: 'Manufacture', where: 'hotsearch' })
        var searchRecommendForMaterial = SearchRecommend.findOne({ type: 'Material', where: 'hotsearch' })
        var searchRecommendForEquipment = SearchRecommend.findOne({ type: 'Equipment', where: 'hotsearch' })
        var searchRecommendForDemands = SearchRecommend.findOne({ type: 'Demands', where: 'hotsearch' })
        var searchRecommendForSearch = SearchRecommend.findOne({ where: 'searchbox' })
        var searchRecommendForFix = Install.findOne({ type: 'Install', where: 'hotsearch' })

        Tender.findOne({ _id: req.query.id }).populate('categoryL1 categoryL2 blackList inviteList bidders chosenBidder company').exec(function(err, doc) {
            res.render(targetPath, {
                title: "招投标发布-幸福天地",
                searchRecommendForManufacture: searchRecommendForManufacture,
                searchRecommendForMaterial: searchRecommendForMaterial,
                searchRecommendForEquipment: searchRecommendForEquipment,
                searchRecommendForDemands: searchRecommendForDemands,
                searchRecommendForSearch: searchRecommendForSearch,
                searchRecommendForFix: searchRecommendForFix,
                ebookData: ebookData,
                tenderInfo: doc,
                moment: moment,
                siteConfig: tenderFunc.siteInfos('幸福天地'),
                documentList: params.docs,
                cateList: tenderFunc.getCategoryList(),
                logined: req.session.logined,
                staticforder: staticforder,
                layout: defaultTempPath
            })
        })

    },

    setDataForTender: function(req, res, params, staticforder, defaultTempPath) {
        var ebookData = Ebook.find({}).sort({createdAt:-1})
        var searchRecommendForManufacture = SearchRecommend.findOne({ type: 'Manufacture', where: 'hotsearch' })
        var searchRecommendForMaterial = SearchRecommend.findOne({ type: 'Material', where: 'hotsearch' })
        var searchRecommendForEquipment = SearchRecommend.findOne({ type: 'Equipment', where: 'hotsearch' })
        var searchRecommendForDemands = SearchRecommend.findOne({ type: 'Demands', where: 'hotsearch' })
        var searchRecommendForSearch = SearchRecommend.findOne({ where: 'searchbox' })
        var currentCateListForSecond = ContentCategory.find({ 'parentID': 'H124B2BCx', 'state': '1' })
        var searchRecommendForFix = Install.findOne({ type: 'Install', where: 'hotsearch' })
        var defaultsCount = Defaults.find({ user: req.session.user._id, createdAt: { $gte: moment().startOf('month') } }).count()

        return {
            title: "招投标发布-幸福天地",
            searchRecommendForManufacture: searchRecommendForManufacture,
            searchRecommendForMaterial: searchRecommendForMaterial,
            searchRecommendForEquipment: searchRecommendForEquipment,
            searchRecommendForDemands: searchRecommendForDemands,
            searchRecommendForSearch: searchRecommendForSearch,
            searchRecommendForFix: searchRecommendForFix,
            ebookData: ebookData,
            defaultsCount: defaultsCount,
            currentCateListForSecond: currentCateListForSecond,
            siteConfig: tenderFunc.siteInfos('幸福天地'),
            documentList: params.docs,
            cateList: tenderFunc.getCategoryList(),
            logined: req.session.logined,
            staticforder: staticforder,
            layout: defaultTempPath
        }
    },

    setDataForTenderlist: function(req, res, params, staticforder, defaultTempPath) {
        var ebookData = Ebook.find({}).sort({createdAt:-1})
        var searchRecommendForManufacture = SearchRecommend.findOne({ type: 'Manufacture', where: 'hotsearch' })
        var searchRecommendForMaterial = SearchRecommend.findOne({ type: 'Material', where: 'hotsearch' })
        var searchRecommendForEquipment = SearchRecommend.findOne({ type: 'Equipment', where: 'hotsearch' })
        var searchRecommendForDemands = SearchRecommend.findOne({ type: 'Demands', where: 'hotsearch' })
        var searchRecommendForSearch = SearchRecommend.findOne({ where: 'searchbox' })
        var searchRecommendForFix = Install.findOne({ type: 'Install', where: 'hotsearch' })
        var companyList=BrandPromotion.aggregate([{ $match: {promotionEnd:{$gt:new Date()}} }, { $sample: { size: 16 } } ])

        var currentCateListForSecond = ContentCategory.find({ 'parentID': 'H124B2BCx', 'state': '1' })
        return {
            title: "招投标搜索-幸福天地",
            searchRecommendForManufacture: searchRecommendForManufacture,
            searchRecommendForMaterial: searchRecommendForMaterial,
            searchRecommendForEquipment: searchRecommendForEquipment,
            searchRecommendForDemands: searchRecommendForDemands,
            searchRecommendForSearch: searchRecommendForSearch,
            searchRecommendForFix: searchRecommendForFix,
            ebookData: ebookData,
            companyList:companyList,
            currentCateListForSecond: currentCateListForSecond,
            siteConfig: tenderFunc.siteInfos('幸福天地'),
            documentList: params.docs,
            cateList: tenderFunc.getCategoryList(),
            logined: req.session.logined,
            staticforder: staticforder,
            layout: defaultTempPath
        }
    },


    setDataForTenderinfo: function(req, res, params, staticforder, defaultTempPath, targetPath) {
        var ebookData = Ebook.find({}).sort({createdAt:-1})
        var searchRecommendForManufacture = SearchRecommend.findOne({ type: 'Manufacture', where: 'hotsearch' })
        var searchRecommendForMaterial = SearchRecommend.findOne({ type: 'Material', where: 'hotsearch' })
        var searchRecommendForEquipment = SearchRecommend.findOne({ type: 'Equipment', where: 'hotsearch' })
        var searchRecommendForDemands = SearchRecommend.findOne({ type: 'Demands', where: 'hotsearch' })
        var searchRecommendForSearch = SearchRecommend.findOne({ where: 'searchbox' })
        var searchRecommendForFix = Install.findOne({ type: 'Install', where: 'hotsearch' })
        Tender.update({ _id: req.query.id }, { $inc: { pageview: 1 } }).exec()
        var bidCount = Bid.find({ user: req.session.user._id, createdAt: { $gte: moment().startOf('day') } }).count()
        var isBidBrandPromotion = BrandPromotion.findOne({ user: req.session.user._id, promotionEnd: { $gt: new Date() } })
        var companyIdentifyInfo = CompanyIdentify.findOne({ user: req.session.user._id })
        var favorites = Favorites.findOne({ url: "/tender/tenderinfo?id=" + req.query.id, user: req.session.user._id })
        var isTender = false;
        var isShield = false
        var isBidder = false
        Tender.findOne({ _id: req.query.id }).populate('categoryL1 categoryL2 blackList inviteList chosenBidder company').exec(function(err, doc) {
            var opts = [{
                path: 'bidders',
                select: 'price details depositRate serviceEnd contacts phoneNum user',
                model: 'Bid',
                populate: {
                    path: 'user',
                    select: '_id company idCardIdentify companyIdentify',
                    model: 'User',
                    populate: {
                        path: 'company idCardIdentify companyIdentify',
                        select: 'companyName region status depositAccount'
                    }
                }
            }]

            Tender.populate([doc], opts, function(err, docs) {
                doc = docs[0]
                var isInvite = false;
                if (doc.user == req.session.user._id) {
                    isTender = true
                }
                    for (var i = 0; i < doc.inviteList.length; i++) {
                        if (doc.inviteList[i]._id == req.session.user.company) {
                            isInvite = true
                        }
                    }
                    for (var j = 0; j < doc.blackList.length; j++) {
                        if (doc.blackList[j]._id == req.session.user.company) {
                            isShield = true
                        }
                    }
                    for (var z = 0; z < doc.bidders.length; z++) {
                        if (doc.bidders[z].user._id == req.session.user._id) {
                            isBidder = true
                        }
                    }
                    BrandPromotion.find({user:{$in:doc.bidderUsers}},function (err,bp) {
                        for(var i=0;i<bp.length;i++){
                            for(var j=0;j<doc.bidders.length;j++){
                                if(doc.bidders[j].user._id==bp[i].user){
                                    doc.bidders[j]._doc.hasBrandPro=true
                                }
                            }
                        }
                        if (doc.tenderType == 2) {
                            res.render(targetPath, {
                                title: doc._doc.title + "-幸福天地",
                                searchRecommendForManufacture: searchRecommendForManufacture,
                                searchRecommendForMaterial: searchRecommendForMaterial,
                                searchRecommendForEquipment: searchRecommendForEquipment,
                                searchRecommendForDemands: searchRecommendForDemands,
                                searchRecommendForSearch: searchRecommendForSearch,
                                searchRecommendForFix: searchRecommendForFix,
                                ebookData: ebookData,
                                bidCount: bidCount,
                                isShield: isShield,
                                isTender: isTender,
                                isInvite: isInvite,
                                isBidder: isBidder,
                                favorites: favorites,
                                isBidBrandPromotion: isBidBrandPromotion,
                                companyIdentifyInfo: companyIdentifyInfo,
                                tenderInfo: doc,
                                moment: moment,
                                siteConfig: tenderFunc.siteInfos('幸福天地'),
                                documentList: params.docs,
                                cateList: tenderFunc.getCategoryList(),
                                logined: req.session.logined,
                                staticforder: staticforder,
                                layout: defaultTempPath
                            })

                        } else {
                            res.render(targetPath, {
                                title: doc._doc.title + "-幸福天地",
                                searchRecommendForManufacture: searchRecommendForManufacture,
                                searchRecommendForMaterial: searchRecommendForMaterial,
                                searchRecommendForEquipment: searchRecommendForEquipment,
                                searchRecommendForDemands: searchRecommendForDemands,
                                searchRecommendForSearch: searchRecommendForSearch,
                                searchRecommendForFix: searchRecommendForFix,
                                ebookData: ebookData,
                                bidCount: bidCount,
                                isTender: isTender,
                                favorites: favorites,
                                isShield: isShield,
                                isInvite: isInvite,
                                isBidder: isBidder,
                                isBidBrandPromotion: isBidBrandPromotion,
                                companyIdentifyInfo: companyIdentifyInfo,
                                tenderInfo: doc,
                                moment: moment,
                                siteConfig: tenderFunc.siteInfos('幸福天地'),
                                documentList: params.docs,
                                cateList: tenderFunc.getCategoryList(),
                                logined: req.session.logined,
                                staticforder: staticforder,
                                layout: defaultTempPath
                            })
                        }
                    })

            })
        })

    },
    renderToTargetPageByType: function(req, res, type, params) {
        this.getFrontTemplate(req, res, function(temp) {
            var targetPath
            if (temp) {
                var layoutFortender = settings.SYSTEMTEMPFORDER + temp.alias + '/public/layoutFortender'
                var layoutFortenderinfo = settings.SYSTEMTEMPFORDER + temp.alias + '/public/layoutForIndex'
                var layoutFortenderlist = settings.SYSTEMTEMPFORDER + temp.alias + '/public/layoutForsecondDemand'
                var layoutForshop = settings.SYSTEMTEMPFORDER + temp.alias + '/public/layoutForshop'
                if (type == 'tender') {
                    targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/tender/tender'
                    res.render(targetPath, tenderFunc.setDataForTender(req, res, params, temp.alias, layoutFortender))
                } else if (type == 'tenderinfo') {
                    targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/tender/tenderinfo'
                    tenderFunc.setDataForTenderinfo(req, res, params, temp.alias, layoutFortenderinfo, targetPath)
                } else if (type == 'tenderlist') {
                    targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/tender/tenderlist'
                    res.render(targetPath, tenderFunc.setDataForTenderlist(req, res, params, temp.alias, layoutFortenderlist))
                } else if (type == 'shopaccount') {
                    targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/tender/shopaccount'
                    res.render(targetPath, tenderFunc.setDataForShopAccount(req, res, params, temp.alias, layoutForshop))
                } else if (type == 'shoptender') {
                    targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/tender/shoptender'
                    res.render(targetPath, tenderFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, layoutForshop))
                }else if (type == 'tenderAndBid') {
                    targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/tender/tenderAndBid'
                    res.render(targetPath, tenderFunc.setDataForHtmlSiteMap(req, res, params, temp.alias))
                } else if (type == 'shopbid') {
                    targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/tender/shopbid'
                    tenderFunc.setDataForShopbid(req, res, params, temp.alias, layoutForshop,targetPath)
                } else if (type == 'bid') {
                    targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/tender/bid'
                    tenderFunc.setDataForBid(req, res, params, temp.alias, layoutFortender, targetPath)
                } else {
                    res.writeHeader(200, { 'Content-Type': 'text/javascript;charset=UTF-8' })
                    res.end('亲爱哒，请先在后台安装并启用模板喔~!')
                }
            }
        })
    },
}
module.exports = tenderFunc