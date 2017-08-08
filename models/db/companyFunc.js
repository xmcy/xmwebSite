var _ = require('lodash')
var mongoose = require('mongoose')
var Content = require('../Content')
var User = require('../User')

var ContentTemplate = require('../ContentTemplate')
var IdCardIdentify = require('../IdCardIdentify')
var CompanyIdentify = require('../CompanyIdentify')
var ContentCategory = require('../ContentCategory')
var Company = require('../Company')
var BrandPromotion = require('../admincenter/BrandPromotion')
var PubHistory = require('../publish/PubHistory')
var CategorySetting = require('../admincenter/CategorySetting')
var SearchRecommend = require('../admincenter/SearchRecommend')
var Favorites = require('../Favorites')
var Ebook = require('../admincenter/Ebook')
var Score = require('../tender/Score')

var TemplateItems = require('../TemplateItems')
var settings = require('./settings')

var DbOpt = require('../Dbopt')
var UserNotify = require('../UserNotify')
var moment = require('moment')
var cache = require('../../util/cache')
var Notify = require('../Notify')

function isLogined (req) {
  return req.session.logined
}

var companyFunc = {
  siteInfos: function (title, cmsDescription, keyWords) {
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

  setDataForHtmlSiteMap: function (req, res, params , staticforder, defaultTempPath) {
    return {
      siteConfig: companyFunc.siteInfos('制作宝'),
      documentList: params.docs,
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },
  setDataForShopcertificate: function (req, res, params , staticforder, defaultTempPath,targetPath) {
    var infoCertificationManagement={}
    CompanyIdentify.findOne({user: req.session.user._id}, function (err, companyIdentify) {
      if (err) {
        res.end(err)
      }else {
        if (companyIdentify == null) {
          infoCertificationManagement.companyIdentifystatus = null
        } else {
          infoCertificationManagement.companyIdentifystatus = companyIdentify.status
        }
        res.render(targetPath, {
          siteConfig: companyFunc.siteInfos('制作宝'),
          documentList: params.docs,
          logined: req.session.logined,
          infoCertificationManagement:infoCertificationManagement,
          staticforder: staticforder,
          layout: defaultTempPath
        })
      }
    })
  },

  // 缓存前台模板
  getFrontTemplate: function (req, res, callBack) {
    cache.get(settings.session_secret + '_siteTemplate', function (siteTemplate) {
      if (siteTemplate) {
        callBack(siteTemplate)
      }else {
        ContentTemplate.getDefaultTemp(res, function (doc) {
          if (doc) {
            cache.set(settings.session_secret + '_siteTemplate', doc , 1000 * 60 * 60 * 24); // 缓存一天
          }
          callBack(doc)
        })
      }
    })
  },

  // 根据模板获取跳转链接
  renderToTargetPageByType: function (req, res, type, params) {
    this.getFrontTemplate(req, res, function (temp) {
      var targetPath
      if (temp) {
        var layoutForshop = settings.SYSTEMTEMPFORDER + temp.alias + '/public/layoutForshop'
        var layoutForShopspcific = settings.SYSTEMTEMPFORDER + temp.alias + '/public/layoutForShopspcific'

        if (type == 'shopcertificate') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/shopcertificate'
          companyFunc.setDataForShopcertificate(req, res, params, temp.alias, layoutForshop,targetPath)
        } else if (type == 'shopinfo') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/shopinfo'
          companyFunc.setDataForShopInfo(req, res, params, temp.alias, layoutForshop, targetPath)
        // res.render(targetPath, companyFunc.setDataForShopInfo(req, res, params, temp.alias, layoutForshop))
        }else if (type == 'shoppromote') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/shoppromote'
          companyFunc.setDataForShopPromote(req, res, params, temp.alias, layoutForshop, targetPath)
        }else if (type == 'shopcenter') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/shopcenter'
          res.render(targetPath, companyFunc.setDataForShopCenter(req, res, params, temp.alias, layoutForshop))
        // companyFunc.setDataForShopcenter(req, res, params, temp.alias, layoutForshop, targetPath)
        }else if (type == 'shopindex') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/shopindex'
          companyFunc.setDataForShopIndex(req, res, params, temp.alias, layoutForshop, targetPath)
        // res.render(targetPath, companyFunc.setDataForShopIndex(req, res, params, temp.alias, layoutForshop))
        }else if (type == 'licenseCertification') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/licenseCertification'
          res.render(targetPath, companyFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, layoutForshop))
        }else if (type == 'licenseCertification2') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/licenseCertification2'
          companyFunc.setDataForLicenseCertification2(req, res, params, temp.alias, layoutForshop, targetPath)
        }else if (type == 'licenseCertification3') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/licenseCertification3'
          companyFunc.setDataForLicenseCertification3(req, res, params, temp.alias, layoutForshop, targetPath)
        }else if (type == 'shopcomment') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/shopcomment'
          companyFunc.setDataForShopcomment(req, res, params, temp.alias, layoutForShopspcific, targetPath)
        }else if (type == 'shopSpecific1') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/shopSpecific1'
          companyFunc.setDataForShopSpecific1(req, res, params, temp.alias, layoutForShopspcific, targetPath)
        }else if (type == 'shopSpecific2') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/shopSpecific2'
          companyFunc.setDataForShopSpecific2(req, res, params, temp.alias, layoutForShopspcific, targetPath)
        }
      }else {
        res.writeHeader(200, {'Content-Type': 'text/javascript;charset=UTF-8'})
        res.end('亲爱哒，请先在后台安装并启用模板喔~!')
      }
    })
  },
  setDataForLicenseCertification2: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    var LicenseCertification2Data = {}
    var su = req.session.user
    if (_.isEmpty(su)) {
      res.end(settings.system_illegal_param)
    } else {
      CompanyIdentify.findOne({user: su._id}, function (err, companyIdentify) {
        if (err) {
          res.end(err)
        }else {
          res.render(targetPath, {
            siteConfig: companyFunc.siteInfos('制作宝'),
            documentList: params.docs,
            cateTypes: companyFunc.getCategoryList(),
            LicenseCertification2Data: companyIdentify,
            logined: req.session.logined,
            staticforder: staticforder,
            layout: defaultTempPath
          })
        }
      })
    }
  },
  getCategoryList: function () {
    return ContentCategory.find({'parentID': '0', 'state': '1'}, 'name defaultUrl homePage').sort({'sortId': 1}).find()
  },
  setDataForLicenseCertification3: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    var su = req.session.user
    if (_.isEmpty(su)) {
      res.end(settings.system_illegal_param)
    } else {
      CompanyIdentify.findOne({user: su._id}, function (err, companyIdentify) {
        if (err) {
          res.end(err)
        }else {
          res.render(targetPath, {
            siteConfig: companyFunc.siteInfos('制作宝'),
            documentList: params.docs,
            cateTypes: companyFunc.getCategoryList(),
            LicenseCertification2Data: companyIdentify,
            logined: req.session.logined,
            staticforder: staticforder,
            layout: defaultTempPath
          })
        }
      })
    }
  },

  setDataForShopCenter: function (req, res, params , staticforder, defaultTempPath) {
    return {
      siteConfig: companyFunc.siteInfos('制作宝'),
      companyInfo: Company.findOne({user: req.session.user._id}),
      companyIdentify: CompanyIdentify.findOne({user: req.session.user._id}),
      promotion: BrandPromotion.findOne({user: req.session.user._id}).populate('bill', 'billState'),
      logined: req.session.logined,
      moment:moment,
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },
  setDataForShopInfo: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    ContentCategory.find({parentID: '0', state: '1'}, function (err, docs) {
      var cateList = docs
      var ids = _.pluck(docs, '_id')
      ContentCategory.find({parentID: {$in: ids}},function (err,currentCateListForSecond) {
        var currentCateListForSecond =currentCateListForSecond
        var companyIdentifyInfo=CompanyIdentify.findOne({user:req.session.user._id})
        var data = {
          siteConfig: companyFunc.siteInfos('制作宝'),
          cateList:cateList ,
          companyIdentifyInfo:companyIdentifyInfo,
          currentCateListForSecond:currentCateListForSecond,
          companyInfo: Company.findOne({user: req.session.user._id}),
          logined: req.session.logined,
          staticforder: staticforder,
          layout: defaultTempPath
        }
        res.render(targetPath, data)
      })
    }).sort({'sortId': 1})
  },

  setDataForShopPromote: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    res.render(targetPath, {
      siteConfig: companyFunc.siteInfos('制作宝'),
      companyInfo: Company.findOne({user: req.session.user._id}, {_id: 1}),
      promotion: BrandPromotion.findOne({user: req.session.user._id}).populate('bill', 'billState'),
      logined: req.session.logined,
      moment:moment,
      staticforder: staticforder,
      layout: defaultTempPath
    })
  },

  setDataForShopIndex: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    var data = {
      siteConfig: companyFunc.siteInfos('制作宝'),
      allRes: PubHistory.find({user: req.session.user._id, isDeleted: false, isShowing: true}, {title: 1,resNum:1}),
      companyInfo: Company.findOne({user: req.session.user._id}, {_id: 1, homePageBanner: 1, homePageBody: 1}),
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    }
    res.render(targetPath, data)
  },

  setDataForShopcomment: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    var searchRecommendForManufacture=SearchRecommend.findOne({type : "Manufacture",where : "hotsearch"})
    var searchRecommendForMaterial=SearchRecommend.findOne({type : "Material",where : "hotsearch"})
    var searchRecommendForEquipment=SearchRecommend.findOne({type : "Equipment",where : "hotsearch"})
    var searchRecommendForDemands=SearchRecommend.findOne({type : "Demands",where : "hotsearch"})
    var searchRecommendForSearch=SearchRecommend.findOne({where : "searchbox"})
    var ebookData=Ebook.find({}).sort({createdAt:-1})
    var scoreCount=Score.find({targetUser:req.query.id}).count();
    var scoreHasImgCount=Score.find({targetUser:req.query.id,images :{ $not: { $size: 0 } }}).count();
    var avequality=5
    var avedescribe=5
    var aveattitude=5
    var avespeed=5
    var goodRate=0
    var goocount=0
    var avequalityTol=0
    var avedescribeTol=0
    var aveattitudeTol=0
    var avespeedTol=0
    Score.find({targetUser:req.query.id}).populate('company').populate('tender','title').sort({createdAt:-1}).exec(function (err,score) {
      for(var i=0;i<score.length;i++){
        avequalityTol+=score[i].quality
        avedescribeTol+=score[i].describe
        aveattitudeTol+=score[i].attitude
        avespeedTol+=score[i].speed
        if(score[i].quality+score[i].describe+score[i].attitude+score[i].speed>=12){
          goocount++;
        }
      }
      goodRate=(goocount/score.length).toFixed(2)*100
      avequality=(avequalityTol/score.length).toFixed(1)
      avedescribe=(avedescribeTol/score.length).toFixed(1)
      aveattitude=(aveattitudeTol/score.length).toFixed(1)
      avespeed=(avespeedTol/score.length).toFixed(1)
      if (!req.session.logined) {
        var isCollect = "collect"
        var data = {
          siteConfig: companyFunc.siteInfos('制作宝'),
          isCollect:isCollect,
          avequality:avequality,
          avedescribe:avedescribe,
          aveattitude:aveattitude,
          avespeed:avespeed,
          goodRate:goodRate,
          goocount:goocount,
          moment:moment,
          companyIdentify:CompanyIdentify.findOne({user:req.query.id}),
          idCardIdentify:IdCardIdentify.findOne({user:req.query.id}),
          catL1List: ContentCategory.find({'parentID': '0', 'state': '1'}).sort({'sortId': 1}), // 1级类目列表用在搜索框
          searchRecommendForManufacture:searchRecommendForManufacture,
          searchRecommendForMaterial:searchRecommendForMaterial,
          searchRecommendForEquipment:searchRecommendForEquipment,
          searchRecommendForDemands:searchRecommendForDemands,
          searchRecommendForSearch:searchRecommendForSearch,
          ebookData:ebookData,
          scoreCount:scoreCount,
          scoreHasImgCount:scoreHasImgCount,
          score:score,
          brandPromotion: BrandPromotion.findOne({user: req.query.id, promotionEnd: {$gte: new Date()}}),
          categorySettingList: CategorySetting.find({}).populate('category'),
          resCount: PubHistory.find({user: req.query.id, isDeleted: false, isShowing: true}).count(),
          companyInfo: Company.findOne({user: req.query.id}),
          logined: req.session.logined,
          staticforder: staticforder,
          layout: defaultTempPath
        }
        res.render(targetPath, data)
      }else {
        Favorites.findOne({url:"/users/shopSpecific1?id="+req.query.id, user: req.session.user._id},function (err,doc) {
          if (err) {
            res.end(err)
          } else if (!_.isEmpty(doc)) {
            var isCollect = "collected"
            var data = {
              siteConfig: companyFunc.siteInfos('制作宝'),
              isCollect:isCollect,
              scoreCount:scoreCount,
              score:score,
              goocount:goocount,
              avequality:avequality,
              avedescribe:avedescribe,
              aveattitude:aveattitude,
              avespeed:avespeed,
              scoreHasImgCount:scoreHasImgCount,
              goodRate:goodRate,
              moment:moment,
              brandPromotion: BrandPromotion.findOne({user: req.query.id, promotionEnd: {$gte: new Date()}}),
              companyIdentify:CompanyIdentify.findOne({user:req.query.id}),
              idCardIdentify:IdCardIdentify.findOne({user:req.query.id}),
              catL1List: ContentCategory.find({'parentID': '0', 'state': '1'}).sort({'sortId': 1}), // 1级类目列表用在搜索框
              searchRecommendForManufacture:searchRecommendForManufacture,
              searchRecommendForMaterial:searchRecommendForMaterial,
              searchRecommendForEquipment:searchRecommendForEquipment,
              searchRecommendForDemands:searchRecommendForDemands,
              searchRecommendForSearch:searchRecommendForSearch,
              ebookData:ebookData,
              categorySettingList: CategorySetting.find({}).populate('category'),
              resCount: PubHistory.find({user: req.query.id, isDeleted: false, isShowing: true}).count(),
              companyInfo: Company.findOne({user: req.query.id}),
              logined: req.session.logined,
              staticforder: staticforder,
              layout: defaultTempPath
            }
            res.render(targetPath, data)
          } else {
            var isCollect = "collect"
            var data = {
              siteConfig: companyFunc.siteInfos('制作宝'),
              isCollect:isCollect,
              scoreCount:scoreCount,
              score:score,
              avequality:avequality,
              avedescribe:avedescribe,
              aveattitude:aveattitude,
              avespeed:avespeed,
              goodRate:goodRate,
              moment:moment,
              scoreHasImgCount:scoreHasImgCount,
              goocount:goocount,
              brandPromotion: BrandPromotion.findOne({user: req.query.id, promotionEnd: {$gte: new Date()}}),
              companyIdentify:CompanyIdentify.findOne({user:req.query.id}),
              idCardIdentify:IdCardIdentify.findOne({user:req.query.id}),
              catL1List: ContentCategory.find({'parentID': '0', 'state': '1'}).sort({'sortId': 1}), // 1级类目列表用在搜索框
              searchRecommendForManufacture:searchRecommendForManufacture,
              searchRecommendForMaterial:searchRecommendForMaterial,
              searchRecommendForEquipment:searchRecommendForEquipment,
              searchRecommendForDemands:searchRecommendForDemands,
              searchRecommendForSearch:searchRecommendForSearch,
              ebookData:ebookData,
              categorySettingList: CategorySetting.find({}).populate('category'),
              resCount: PubHistory.find({user: req.query.id, isDeleted: false, isShowing: true}).count(),
              companyInfo: Company.findOne({user: req.query.id}),
              logined: req.session.logined,
              staticforder: staticforder,
              layout: defaultTempPath
            }
            res.render(targetPath, data)
          }
        })

      }
    })

   
  },


  setDataForShopSpecific1: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    var searchRecommendForManufacture=SearchRecommend.findOne({type : "Manufacture",where : "hotsearch"})
    var searchRecommendForMaterial=SearchRecommend.findOne({type : "Material",where : "hotsearch"})
    var searchRecommendForEquipment=SearchRecommend.findOne({type : "Equipment",where : "hotsearch"})
    var searchRecommendForDemands=SearchRecommend.findOne({type : "Demands",where : "hotsearch"})
    var searchRecommendForSearch=SearchRecommend.findOne({where : "searchbox"})
    var ebookData=Ebook.find({}).sort({createdAt:-1})
    var scoreCount=Score.find({targetUser:req.query.id}).count();
    var avequality=5
    var avedescribe=5
    var aveattitude=5
    var avespeed=5
    var goodRate=0
    var goocount=0
    var avequalityTol=0
    var avedescribeTol=0
    var aveattitudeTol=0
    var avespeedTol=0
    Score.find({targetUser:req.query.id},function (err,score) {
      for (var i = 0; i < score.length; i++) {
        avequalityTol += score[i].quality
        avedescribeTol += score[i].describe
        aveattitudeTol += score[i].attitude
        avespeedTol += score[i].speed
        if (score[i].quality + score[i].describe + score[i].attitude + score[i].speed >= 12) {
          goocount++;
        }
      }
      goodRate = (goocount / score.length).toFixed(2) * 100
      avequality = (avequalityTol / score.length).toFixed(1)
      avedescribe = (avedescribeTol / score.length).toFixed(1)
      aveattitude = (aveattitudeTol / score.length).toFixed(1)
      avespeed = (avespeedTol / score.length).toFixed(1)
      if (!req.session.logined) {
        var isCollect = "collect"
        var data = {
          siteConfig: companyFunc.siteInfos('制作宝'),
          isCollect: isCollect,
          companyIdentify: CompanyIdentify.findOne({user: req.query.id}),
          idCardIdentify: IdCardIdentify.findOne({user: req.query.id}),
          catL1List: ContentCategory.find({'parentID': '0', 'state': '1'}).sort({'sortId': 1}), // 1级类目列表用在搜索框
          searchRecommendForManufacture: searchRecommendForManufacture,
          searchRecommendForMaterial: searchRecommendForMaterial,
          searchRecommendForEquipment: searchRecommendForEquipment,
          searchRecommendForDemands: searchRecommendForDemands,
          searchRecommendForSearch: searchRecommendForSearch,
          ebookData: ebookData,
          scoreCount:scoreCount,
          score:score,
          avequality:avequality,
          avedescribe:avedescribe,
          aveattitude:aveattitude,
          avespeed:avespeed,
          goodRate:goodRate,
          brandPromotion: BrandPromotion.findOne({user: req.query.id, promotionEnd: {$gte: new Date()}}),
          categorySettingList: CategorySetting.find({}).populate('category'),
          resCount: PubHistory.find({user: req.query.id, isDeleted: false, isShowing: true}).count(),
          companyInfo: Company.findOne({user: req.query.id}),
          logined: req.session.logined,
          staticforder: staticforder,
          layout: defaultTempPath
        }
        res.render(targetPath, data)
      } else {
        Favorites.findOne({
          url: "/users/shopSpecific1?id=" + req.query.id,
          user: req.session.user._id
        }, function (err, doc) {
          if (err) {
            res.end(err)
          } else if (!_.isEmpty(doc)) {
            var isCollect = "collected"
            var data = {
              siteConfig: companyFunc.siteInfos('制作宝'),
              isCollect: isCollect,
              companyIdentify: CompanyIdentify.findOne({user: req.query.id}),
              idCardIdentify: IdCardIdentify.findOne({user: req.query.id}),
              catL1List: ContentCategory.find({'parentID': '0', 'state': '1'}).sort({'sortId': 1}), // 1级类目列表用在搜索框
              searchRecommendForManufacture: searchRecommendForManufacture,
              searchRecommendForMaterial: searchRecommendForMaterial,
              searchRecommendForEquipment: searchRecommendForEquipment,
              searchRecommendForDemands: searchRecommendForDemands,
              searchRecommendForSearch: searchRecommendForSearch,
              ebookData: ebookData,
              scoreCount:scoreCount,
              score:score,
              avequality:avequality,
              avedescribe:avedescribe,
              aveattitude:aveattitude,
              avespeed:avespeed,
              goodRate:goodRate,
              brandPromotion: BrandPromotion.findOne({user: req.query.id, promotionEnd: {$gte: new Date()}}),
              categorySettingList: CategorySetting.find({}).populate('category'),
              resCount: PubHistory.find({user: req.query.id, isDeleted: false, isShowing: true}).count(),
              companyInfo: Company.findOne({user: req.query.id}),
              logined: req.session.logined,
              staticforder: staticforder,
              layout: defaultTempPath
            }
            res.render(targetPath, data)
          } else {
            var isCollect = "collect"
            var data = {
              siteConfig: companyFunc.siteInfos('制作宝'),
              isCollect: isCollect,
              companyIdentify: CompanyIdentify.findOne({user: req.query.id}),
              idCardIdentify: IdCardIdentify.findOne({user: req.query.id}),
              catL1List: ContentCategory.find({'parentID': '0', 'state': '1'}).sort({'sortId': 1}), // 1级类目列表用在搜索框
              searchRecommendForManufacture: searchRecommendForManufacture,
              searchRecommendForMaterial: searchRecommendForMaterial,
              searchRecommendForEquipment: searchRecommendForEquipment,
              searchRecommendForDemands: searchRecommendForDemands,
              searchRecommendForSearch: searchRecommendForSearch,
              ebookData: ebookData,
              scoreCount:scoreCount,
              score:score,
              avequality:avequality,
              avedescribe:avedescribe,
              aveattitude:aveattitude,
              avespeed:avespeed,
              goodRate:goodRate,
              brandPromotion: BrandPromotion.findOne({user: req.query.id, promotionEnd: {$gte: new Date()}}),

              categorySettingList: CategorySetting.find({}).populate('category'),
              resCount: PubHistory.find({user: req.query.id, isDeleted: false, isShowing: true}).count(),
              companyInfo: Company.findOne({user: req.query.id}),
              logined: req.session.logined,
              staticforder: staticforder,
              layout: defaultTempPath
            }
            res.render(targetPath, data)
          }
        })

      }
    })

  },

  setDataForShopSpecific2: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    var searchRecommendForManufacture=SearchRecommend.findOne({type : "Manufacture",where : "hotsearch"})
    var searchRecommendForMaterial=SearchRecommend.findOne({type : "Material",where : "hotsearch"})
    var searchRecommendForEquipment=SearchRecommend.findOne({type : "Equipment",where : "hotsearch"})
    var searchRecommendForDemands=SearchRecommend.findOne({type : "Demands",where : "hotsearch"})
    var searchRecommendForSearch=SearchRecommend.findOne({where : "searchbox"})
    var ebookData=Ebook.find({}).sort({createdAt:-1})
    var scoreCount=Score.find({targetUser:req.query.id}).count();
    var avequality=5
    var avedescribe=5
    var aveattitude=5
    var avespeed=5
    var goodRate=0
    var goocount=0
    var avequalityTol=0
    var avedescribeTol=0
    var aveattitudeTol=0
    var avespeedTol=0
    Score.find({targetUser:req.query.id},function (err,score) {
      for (var i = 0; i < score.length; i++) {
        avequalityTol += score[i].quality
        avedescribeTol += score[i].describe
        aveattitudeTol += score[i].attitude
        avespeedTol += score[i].speed
        if (score[i].quality + score[i].describe + score[i].attitude + score[i].speed >= 12) {
          goocount++;
        }
      }
      goodRate = (goocount / score.length).toFixed(2) * 100
      avequality = (avequalityTol / score.length).toFixed(1)
      avedescribe = (avedescribeTol / score.length).toFixed(1)
      aveattitude = (aveattitudeTol / score.length).toFixed(1)
      avespeed = (avespeedTol / score.length).toFixed(1)
      if (!req.session.logined) {
        var isCollect = "collect"
        var data = {
          siteConfig: companyFunc.siteInfos('制作宝'),
          isCollect: isCollect,
          companyIdentify: CompanyIdentify.findOne({user: req.query.id}),
          idCardIdentify: IdCardIdentify.findOne({user: req.query.id}),
          catL1List: ContentCategory.find({'parentID': '0', 'state': '1'}).sort({'sortId': 1}), // 1级类目列表用在搜索框
          searchRecommendForManufacture: searchRecommendForManufacture,
          searchRecommendForMaterial: searchRecommendForMaterial,
          searchRecommendForEquipment: searchRecommendForEquipment,
          searchRecommendForDemands: searchRecommendForDemands,
          searchRecommendForSearch: searchRecommendForSearch,
          brandPromotion: BrandPromotion.findOne({user: req.query.id, promotionEnd: {$gte: new Date()}}),
          ebookData: ebookData,
          scoreCount:scoreCount,
          score:score,
          avequality:avequality,
          avedescribe:avedescribe,
          aveattitude:aveattitude,
          avespeed:avespeed,
          goodRate:goodRate,
          categorySettingList: CategorySetting.find({}).populate('category'),
          resCount: PubHistory.find({user: req.query.id, isDeleted: false, isShowing: true}).count(),
          companyInfo: Company.findOne({user: req.query.id}),
          logined: req.session.logined,
          staticforder: staticforder,
          layout: defaultTempPath
        }
        res.render(targetPath, data)
      } else {
        Favorites.findOne({
          url: "/users/shopSpecific1?id=" + req.query.id,
          user: req.session.user._id
        }, function (err, doc) {
          if (err) {
            res.end(err)
          } else if (!_.isEmpty(doc)) {
            var isCollect = "collected"
            var data = {
              siteConfig: companyFunc.siteInfos('制作宝'),
              isCollect: isCollect,
              companyIdentify: CompanyIdentify.findOne({user: req.query.id}),
              idCardIdentify: IdCardIdentify.findOne({user: req.query.id}),
              catL1List: ContentCategory.find({'parentID': '0', 'state': '1'}).sort({'sortId': 1}), // 1级类目列表用在搜索框
              searchRecommendForManufacture: searchRecommendForManufacture,
              searchRecommendForMaterial: searchRecommendForMaterial,
              searchRecommendForEquipment: searchRecommendForEquipment,
              searchRecommendForDemands: searchRecommendForDemands,
              searchRecommendForSearch: searchRecommendForSearch,
              ebookData: ebookData,
              brandPromotion: BrandPromotion.findOne({user: req.query.id, promotionEnd: {$gte: new Date()}}),
              scoreCount:scoreCount,
              score:score,
              avequality:avequality,
              avedescribe:avedescribe,
              aveattitude:aveattitude,
              avespeed:avespeed,
              goodRate:goodRate,
              categorySettingList: CategorySetting.find({}).populate('category'),
              resCount: PubHistory.find({user: req.query.id, isDeleted: false, isShowing: true}).count(),
              companyInfo: Company.findOne({user: req.query.id}),
              logined: req.session.logined,
              staticforder: staticforder,
              layout: defaultTempPath
            }
            res.render(targetPath, data)
          } else {
            var isCollect = "collect"
            var data = {
              siteConfig: companyFunc.siteInfos('制作宝'),
              isCollect: isCollect,
              scoreCount:scoreCount,
              score:score,
              avequality:avequality,
              avedescribe:avedescribe,
              aveattitude:aveattitude,
              avespeed:avespeed,
              goodRate:goodRate,
              companyIdentify: CompanyIdentify.findOne({user: req.query.id}),
              idCardIdentify: IdCardIdentify.findOne({user: req.query.id}),
              catL1List: ContentCategory.find({'parentID': '0', 'state': '1'}).sort({'sortId': 1}), // 1级类目列表用在搜索框
              searchRecommendForManufacture: searchRecommendForManufacture,
              searchRecommendForMaterial: searchRecommendForMaterial,
              searchRecommendForEquipment: searchRecommendForEquipment,
              searchRecommendForDemands: searchRecommendForDemands,
              searchRecommendForSearch: searchRecommendForSearch,
              ebookData: ebookData,
              brandPromotion: BrandPromotion.findOne({user: req.query.id, promotionEnd: {$gte: new Date()}}),
              categorySettingList: CategorySetting.find({}).populate('category'),
              resCount: PubHistory.find({user: req.query.id, isDeleted: false, isShowing: true}).count(),
              companyInfo: Company.findOne({user: req.query.id}),
              logined: req.session.logined,
              staticforder: staticforder,
              layout: defaultTempPath
            }
            res.render(targetPath, data)
          }
        })
      }
    })
  }
}

var findInPromise = function (model, userId) {
  var promise = new mongoose.Promise()
  model.find({user: userId, isDeleted: false, isShowing: true}, {title: 1}, function (err, docs) {
    promise.resolve(err, docs)
  })
  return promise
}
module.exports = companyFunc
