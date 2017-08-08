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

var TemplateItems = require('../TemplateItems')
var Demands = require('../publish/Demands')
var PubHistory = require('../publish/PubHistory')
var Install = require('../publish/Install')
var Favorites = require('../Favorites')
var IdCardIdentify = require('../IdCardIdentify')
var CompanyIdentify = require('../CompanyIdentify')
var Company = require('../Company')
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

function isLogined (req) {
  return req.session.logined
}

var resFunc = {
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
  getCategoryList: function () {
    return ContentCategory.find({'parentID': '0', 'state': '1'}, 'name defaultUrl').sort({'sortId': 1}).find()
  },

  setDataForHtmlSiteMap: function (req, res, params , staticforder, defaultTempPath) {
    return {
      siteConfig: resFunc.siteInfos('制作宝'),
      documentList: params.docs,
      cateTypes: resFunc.getCategoryList(),
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },
  renderToTargetPageByType: function (req, res, type, params) {
    this.getFrontTemplate(req, res, function (temp) {
      var targetPath
      if (temp) {
        var layoutForResourceSet = settings.SYSTEMTEMPFORDER + temp.alias + '/public/layoutForResourceHeader'
        var layoutForIndexSet = settings.SYSTEMTEMPFORDER + temp.alias + '/public/layoutForIndex'
        var layoutForsecondDemand = settings.SYSTEMTEMPFORDER + temp.alias + '/public/layoutForsecondDemand'
        var layoutForFixList = settings.SYSTEMTEMPFORDER + temp.alias + '/public/layoutForFixList'
        var layoutForMyFix = settings.SYSTEMTEMPFORDER + temp.alias + '/public/layoutForMyFix'
        var layoutForBrandSeriesHeader = settings.SYSTEMTEMPFORDER + temp.alias + '/public/layoutForBrandSeriesHeader'
        var layoutForContentHeader = settings.SYSTEMTEMPFORDER + temp.alias + '/public/layoutForContentHeader'
        if (type == 'resourceIndex') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/resourceIndex'
          res.render(targetPath, resFunc.setDataForResIndex(req, res, params, temp.alias, layoutForResourceSet))
        } else if (type == 'resourceMachine') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/resourceMachine'
          resFunc.setDataForMachine(req, res, params, temp.alias, layoutForResourceSet, targetPath)
        } else if (type == 'resourceEquipmentEdit') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/resourceMachine'
          resFunc.setDataForresourceEquipmentEdit(req, res, params, temp.alias, layoutForResourceSet, targetPath)
        } else if (type == 'resourceMagazine') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/resourceMagazine'
          res.render(targetPath, resFunc.setDataForMagazine(req, res, params, temp.alias, layoutForResourceSet))
        } else if (type == 'resourceMake') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/resourceMake'
          resFunc.setDataForCommonPage(req, res, params, temp.alias, layoutForResourceSet, targetPath)
        }  else if (type == 'resourceMakeEdit') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/resourceMake'
          resFunc.setDataForCommonPageEdit(req, res, params, temp.alias, layoutForResourceSet, targetPath)
        } else if (type == 'resourceMaterial') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/resourceMaterial'
          resFunc.setDataForMaterial(req, res, params, temp.alias, layoutForResourceSet, targetPath)
        } else if (type == 'resourceMaterialEdit') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/resourceMaterial'
          resFunc.setDataForMaterialEdit(req, res, params, temp.alias, layoutForResourceSet, targetPath)
        } else if (type == 'resourceNewsmedia') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/resourceNewsmedia'
          res.render(targetPath, resFunc.setDataForCommonPage(req, res, params, temp.alias, layoutForResourceSet))
        } else if (type == 'resourceOut') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/resourceOut'
          res.render(targetPath, resFunc.setDataForResOut(req, res, params, temp.alias, layoutForResourceSet))
        } else if (type == 'resourcePaper') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/resourcePaper'
          res.render(targetPath, resFunc.setDataForPaper(req, res, params, temp.alias, layoutForResourceSet))
        } else if (type == 'resourceRadio') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/resourceRadio'
          res.render(targetPath, resFunc.setDataForRadio(req, res, params, temp.alias, layoutForResourceSet))
        } else if (type == 'demandRelease') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/demandRelease'
          res.render(targetPath, resFunc.setDataForDemandRelease(req, res, params, temp.alias, layoutForResourceSet))
        }else if (type == 'demandReleaseEdit') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/demandRelease'
          resFunc.setDataForDemandReleaseEdit(req, res, params, temp.alias, layoutForResourceSet, targetPath)
        } else if (type == '01') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/01'
          res.render(targetPath, resFunc.setDataForHtmlSiteMap(req, res, params, temp.alias))
        }else if (type == 'shopsecond') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/shopsecond'
          resFunc.setDataForSecondDemand(req, res, params, temp.alias, layoutForsecondDemand, targetPath)
        } else if (type == 'secondDemand') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/secondDemand'
          resFunc.setDataForSecondDemand(req, res, params, temp.alias, layoutForsecondDemand, targetPath)
        }else if (type == 'resourceFixList') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/resourceFixList'
          resFunc.setDataForResourceFixList(req, res, params, temp.alias, layoutForsecondDemand, targetPath)
        }else if (type == 'myFix') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/myFix'
          resFunc.setDataForFix(req, res, params, temp.alias,layoutForsecondDemand,targetPath)
        }else if (type == 'changeMyFix') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/changeMyFix'
          resFunc.setDataForChangeMyFix(req, res, params, temp.alias,layoutForsecondDemand,targetPath)

        }else if (type == 'resourceListMachine') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/resourceListMachine'
          resFunc.setDataForResourceListMachine(req, res, params, temp.alias, layoutForsecondDemand, targetPath)
        }else if (type == 'resourceListAll') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/resourceListAll'
          resFunc.setDataForResourceListAll(req, res, params, temp.alias, layoutForsecondDemand, targetPath)
        }else if (type == 'resourceListMake') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/resourceListMake'
          resFunc.setDataForResourceListMake(req, res, params, temp.alias, layoutForsecondDemand, targetPath)
        }else if (type == 'resourceListMaterial') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/resourceListMaterial'
          resFunc.setDataForResourceListMaterial(req, res, params, temp.alias, layoutForsecondDemand, targetPath)
        } else if (type == 'resourceSale') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/resourceSale'
          res.render(targetPath, resFunc.setDataForCommonPage(req, res, params, temp.alias, layoutForResourceSet))
        } else if (type == 'resourceTv') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/resourceTv'
          res.render(targetPath, resFunc.setDataForTv(req, res, params, temp.alias, layoutForResourceSet))
        } else if (type == 'dMachine') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/dMachine'
          resFunc.setDataFordMachine(req, res, params, temp.alias, layoutForIndexSet, targetPath)
        }else if (type == 'dMagazine') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/dMagazine'
          res.render(targetPath, resFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, layoutForIndexSet))
        }else if (type == 'dMake') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/dMake'
          resFunc.setDataFordMake(req, res, params, temp.alias, layoutForIndexSet, targetPath)
        }else if (type == 'dMaterial') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/dMaterial'
          resFunc.setDataFordMaterial(req, res, params, temp.alias, layoutForIndexSet, targetPath)
        }else if (type == 'dDemand') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/dDemand'
          resFunc.setDataFordDemand(req, res, params, temp.alias, layoutForIndexSet, targetPath)
        }else if (type == 'dOut') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/dOut'
          res.render(targetPath, resFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, layoutForIndexSet))
        }else if (type == 'dPaper') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/dPaper'
          res.render(targetPath, resFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, layoutForIndexSet))
        }else if (type == 'dSale') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/dSale'
          res.render(targetPath, resFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, layoutForIndexSet))
        }else if (type == 'dTv') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/dTv'
          res.render(targetPath, resFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, layoutForIndexSet))
        }else if (type == 'dRadio') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/dRadio'
          res.render(targetPath, resFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, layoutForIndexSet))
        }else if (type == 'vr') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/vr'
          res.render(targetPath, resFunc.setDataForVr(req, res, params, temp.alias, layoutForBrandSeriesHeader))
        }else if (type == 'digitalMagazine') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/digitalMagazine'
          res.render(targetPath, resFunc.setDataForDigitalMagazine(req, res, params, temp.alias, layoutForBrandSeriesHeader))
        }else if (type == 'brandWin') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/brandWin'
          res.render(targetPath, resFunc.setDataForBrandWin(req, res, params, temp.alias, layoutForBrandSeriesHeader))
        }else if (type == 'newslist') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/newslist'
          res.render(targetPath, resFunc.setDataFornewslist(req, res, params, temp.alias, layoutForBrandSeriesHeader))
        } else if (type == 'reportslist') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/reportslist'
          res.render(targetPath, resFunc.setDataForreportslist(req, res, params, temp.alias, layoutForBrandSeriesHeader))
        }else if (type == 'newscontent') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/resource/newscontent'
          res.render(targetPath, resFunc.setDataForArticle(req, res, params, temp.alias, layoutForContentHeader))
        }else {
          res.writeHeader(200, {'Content-Type': 'text/javascript;charset=UTF-8'})
          res.end('亲爱哒，请先在后台安装并启用模板喔~!')
        }
      }
    })
  },

  setDataForResIndex: function (req, res, params , staticforder, defaultTempPath) {
    return {
      siteConfig: resFunc.siteInfos('制作宝'),
      cateList: resFunc.getCategoryList(),
      title: '广告资源发布-制作宝',
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },
  setDataForDemandRelease: function (req, res, params , staticforder, defaultTempPath) {
    var DemandRelease = {}
    DemandRelease.isEdit = false
    return {siteConfig: resFunc.siteInfos('制作宝'),
      currentCateList: resFunc.getCategoryList(),
      hangyeleibie: PublishConfig.hangyeleibie,
      zuixiaozhouqi: PublishConfig.zuixiaozhouqi,
      dailifangshi: PublishConfig.dailifangshi,
      DemandRelease: DemandRelease,
      title: '广告需求发布-制作宝',
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },
  setDataForDemandReleaseEdit: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    if (_.isEmpty(req.query.id)) {
      res.redirect('/users/home')
      return
    }
    Demands.findOne({resNum: req.query.id}, function (err, DemandRelease) {
      if (err) {
        res.end(err)
      } else {
        DemandRelease._doc.isEdit = true
        res.render(targetPath, {
          siteConfig: resFunc.siteInfos('制作宝'),
          currentCateList: resFunc.getCategoryList(),
          hangyeleibie: PublishConfig.hangyeleibie,
          zuixiaozhouqi: PublishConfig.zuixiaozhouqi,
          dailifangshi: PublishConfig.dailifangshi,
          DemandRelease: DemandRelease,
          title: '广告需求发布编辑-制作宝',
          logined: req.session.logined,
          staticforder: staticforder,
          layout: defaultTempPath
        })
      }
    })
  },
  setDataForResourceMap: function (req, res, params , staticforder, defaultTempPath) {
    var currentCateList = ContentCategory.find({parentID: req.query.parentID, state: '1'}).sort({'sortId': 1})
    return {
      siteConfig: resFunc.siteInfos('制作宝'),
      documentList: params.docs,
      cateList: resFunc.getCategoryList(),
      cateTypes: resFunc.getCategoryList(),
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },
  setDataForResOut: function (req, res, params , staticforder, defaultTempPath) {
    var currentCateList = ContentCategory.find({parentID: req.query.parentID, state: '1'}).sort({'sortId': 1})
    return {
      siteConfig: resFunc.siteInfos('制作宝'),
      currentCateList: currentCateList,
      zhaoming: PublishConfig.zhaoming,
      zuixiaozhouqi: PublishConfig.zuixiaozhouqi,
      dailifangshi: PublishConfig.dailifangshi,
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },
  setDataForMaterial: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    ContentCategory.find({parentID: req.query.parentID, state: '1'}, function (err, docs) {
      var currentCateListForSecond = docs
      var ids = _.pluck(docs, '_id')
      ContentCategory.find({parentID: {$in: ids}, state: '1'}, function (err, currentCateList) {
        var material = {}
        material.isEdit = false
        res.render(targetPath, {
          siteConfig: resFunc.siteInfos('制作宝'),
          currentCateList: currentCateList,
          currentCateListForSecond: currentCateListForSecond,
          material: material,
          title: '广告材料资源发布-制作宝',
          cailiaopinpai: PublishConfig.cailiaopinpai,
          logined: req.session.logined,
          staticforder: staticforder,
          layout: defaultTempPath
        })
      })
    })
  },
  setDataForMachine: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    ContentCategory.find({parentID: req.query.parentID, state: '1'}, function (err, docs) {
      var currentCateListForSecond = docs
      var ids = _.pluck(docs, '_id')
      ContentCategory.find({parentID: {$in: ids}, state: '1'}, function (err, currentCateList) {
        var equipment = {}
        equipment.isEdit = false
        res.render(targetPath, {
          siteConfig: resFunc.siteInfos('制作宝'),
          currentCateList: currentCateList,
          currentCateListForSecond: currentCateListForSecond,
          shebeipinpai: PublishConfig.shebeipinpai,
          equipment: equipment,
          title: '广告设备资源发布-制作宝',
          logined: req.session.logined,
          staticforder: staticforder,
          layout: defaultTempPath
        })
      })
    })
  },
  setDataForPaper: function (req, res, params , staticforder, defaultTempPath) {
    var currentCateList = ContentCategory.find({parentID: req.query.parentID, state: '1'}).sort({'sortId': 1})
    return {
      siteConfig: resFunc.siteInfos('制作宝'),
      currentCateList: currentCateList,
      baozhileixing: PublishConfig.baozhileixing,
      faxingzhouqi: PublishConfig.faxingzhouqi,
      baozhiguanggaoxingshi: PublishConfig.baozhiguanggaoxingshi,
      banmianguige: PublishConfig.banmianguige,
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },

  setDataForMagazine: function (req, res, params , staticforder, defaultTempPath) {
    var currentCateList = ContentCategory.find({parentID: req.query.parentID, state: '1'}).sort({'sortId': 1})
    return {
      siteConfig: resFunc.siteInfos('制作宝'),
      currentCateList: currentCateList,
      zazhileixing: PublishConfig.zazhileixing,
      zazhiguanggaoxingshi: PublishConfig.zazhiguanggaoxingshi,
      faxingzhouqi: PublishConfig.faxingzhouqi,
      baozhiguanggaoxingshi: PublishConfig.baozhiguanggaoxingshi,
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },
  setDataForTv: function (req, res, params , staticforder, defaultTempPath) {
    var currentCateList = ContentCategory.find({parentID: req.query.parentID, state: '1'}).sort({'sortId': 1})
    return {
      siteConfig: resFunc.siteInfos('制作宝'),
      currentCateList: currentCateList,
      dianshilanmuleibei: PublishConfig.dianshilanmuleibei,
      dianshiguanggaoxingshi: PublishConfig.dianshiguanggaoxingshi,
      guigeshichang: PublishConfig.guigeshichang,
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },
  setDataForRadio: function (req, res, params , staticforder, defaultTempPath) {
    var currentCateList = ContentCategory.find({parentID: req.query.parentID, state: '1'}).sort({'sortId': 1})
    return {
      siteConfig: resFunc.siteInfos('制作宝'),
      currentCateList: currentCateList,
      guangboleixing: PublishConfig.guangboleixing,
      guangboguanggaoxingshi: PublishConfig.guangboguanggaoxingshi,
      shiduanpinci: PublishConfig.shiduanpinci,
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },
  // 策划、新媒体、制作
  setDataForCommonPage: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    ContentCategory.find({parentID: req.query.parentID, state: '1'}, function (err, docs) {
      var currentCateListForSecond = docs
      var ids = _.pluck(docs, '_id')
      ContentCategory.find({parentID: {$in: ids}, state: '1'}, function (err, currentCateList) {
        var manufacture = {}
        manufacture.isEdit = false
        res.render(targetPath, {
          siteConfig: resFunc.siteInfos('制作宝'),
          manufacture: manufacture,
          title: '广告制作资源发布-制作宝',
          currentCateList: currentCateList,
          currentCateListForSecond: currentCateListForSecond,
          logined: req.session.logined,
          staticforder: staticforder,
          layout: defaultTempPath
        })
      })
    })
  },
  setDataForresourceEquipmentEdit: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    if (_.isEmpty(req.query.id)) {
      res.redirect('/users/home')
      return
    }
    PubHistory.findOne({resNum: req.query.id}, function (err, equipment) {
      if (err) {
        res.end(err)
      } else {
        ContentCategory.find({parentID: req.query.parentID, state: '1'}, function (err, docs) {
          var currentCateListForSecond = docs
          var ids = _.pluck(docs, '_id')
          ContentCategory.find({parentID: {$in: ids}, state: '1'}, function (err, currentCateList) {
            equipment._doc.isEdit = true
            res.render(targetPath, {
              siteConfig: resFunc.siteInfos('制作宝'),
              currentCateList: currentCateList,
              currentCateListForSecond: currentCateListForSecond,
              shebeipinpai: PublishConfig.shebeipinpai,
              title: '广告设备资源发布编辑-制作宝',
              logined: req.session.logined,
              equipment: equipment,
              staticforder: staticforder,
              layout: defaultTempPath
            })
          })
        })
      }
    })
  },
  setDataForMaterialEdit: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    if (_.isEmpty(req.query.id)) {
      res.redirect('/users/home')
      return
    }
    PubHistory.findOne({resNum: req.query.id}, function (err, material) {
      if (err) {
        res.end(err)
      } else {
        ContentCategory.find({parentID: req.query.parentID, state: '1'}, function (err, docs) {
          var currentCateListForSecond = docs
          var ids = _.pluck(docs, '_id')
          ContentCategory.find({parentID: {$in: ids}, state: '1'}, function (err, currentCateList) {
            material._doc.isEdit = true
            res.render(targetPath, {
              siteConfig: resFunc.siteInfos('制作宝'),
              currentCateList: currentCateList,
              title: '广告材料资源发布编辑-制作宝',
              currentCateListForSecond: currentCateListForSecond,
              cailiaopinpai: PublishConfig.cailiaopinpai,
              material: material,
              logined: req.session.logined,
              staticforder: staticforder,
              layout: defaultTempPath
            })
          })
        })
      }
    })
  },

  setDataForCommonPageEdit: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    if (_.isEmpty(req.query.id)) {
      res.redirect('/users/home')
      return
    }
    var ebookData = Ebook.find({}).sort({createdAt:-1})

    PubHistory.findOne({resNum: req.query.id}, function (err, manufacture) {
      if (err) {
        res.end(err)
      }else {
        ContentCategory.find({parentID: req.query.parentID, state: '1'}, function (err, docs) {
          var currentCateListForSecond = docs
          var ids = _.pluck(docs, '_id')
          ContentCategory.find({parentID: {$in: ids}, state: '1'}, function (err, currentCateList) {
            manufacture._doc.isEdit = true
            res.render(targetPath, {
              siteConfig: resFunc.siteInfos('制作宝'),
              manufacture: manufacture,
              title: '广告制作资源发布编辑-制作宝',
              ebookData: ebookData,
              currentCateList: currentCateList,
              currentCateListForSecond: currentCateListForSecond,
              logined: req.session.logined,
              staticforder: staticforder,
              layout: defaultTempPath
            })
          })
        })
      }
    })
  },

  setDataFordMaterial: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    if (_.isEmpty(req.query.id)) {
      res.redirect('/users/home')
      return
    }
    var searchRecommendForManufacture = SearchRecommend.findOne({type: 'Manufacture',where: 'hotsearch'})
    var searchRecommendForMaterial = SearchRecommend.findOne({type: 'Material',where: 'hotsearch'})
    var searchRecommendForEquipment = SearchRecommend.findOne({type: 'Equipment',where: 'hotsearch'})
    var searchRecommendForDemands = SearchRecommend.findOne({type: 'Demands',where: 'hotsearch'})
    var searchRecommendForFix = Install.findOne({type: 'Install',where: 'hotsearch'})
    var searchRecommendForSearch = SearchRecommend.findOne({where: 'searchbox'})
    var ebookData = Ebook.find({}).sort({createdAt:-1})
    var companyList=BrandPromotion.aggregate([{ $match: {promotionEnd:{$gt:new Date()}} }, { $sample: { size: 16 } } ])
    var promotionForMaterial=PubHistory.aggregate([{ $match: {resType:"Material",promotionEnd:{$gt:new Date()}} }, { $sample: { size: 32 } } ])

    PubHistory.update({resNum: req.query.id}, { $inc: { pageview: 1 }}).exec()
    PubHistory.findOne({resNum: req.query.id}).populate('categoryL2 categoryL3', 'name').exec(function (err, material) {
      if (err) {
        res.end(err)
      }else {
        var companyIdentify = CompanyIdentify.findOne({user: material.user})
        var idCardIdentify = IdCardIdentify.findOne({user: material.user})
        var company = Company.findOne({user: material.user})
        var title = material.title + '- 制作宝'
        if (!material.promotionRegions || material.promotionRegions.length == 0 || !material.promotionEnd || material.promotionEnd <= new Date()) {
          material._doc.isPromotion = false
        }else {
          material._doc.isPromotion = true
        }
        if (!req.session.logined) {
          material._doc.phoneNum = material.phoneNum.substring(0, 3) + '****' + material.phoneNum.substring(7, 11)
          res.render(targetPath, {
            siteConfig: resFunc.siteInfos('制作宝'),
            cateList: resFunc.getCategoryList(),
            logined: req.session.logined,
            searchRecommendForManufacture: searchRecommendForManufacture,
            searchRecommendForMaterial: searchRecommendForMaterial,
            searchRecommendForEquipment: searchRecommendForEquipment,
            searchRecommendForDemands: searchRecommendForDemands,
            searchRecommendForSearch: searchRecommendForSearch,
            searchRecommendForFix:searchRecommendForFix,
            ebookData: ebookData,
            promotionForMaterial:promotionForMaterial,
            companyList:companyList,
            title: title,
            companyIdentify: companyIdentify,
            company: company,
            idCardIdentify: idCardIdentify,
            material: material,
            staticforder: staticforder,
            layout: defaultTempPath
          })
        }else {
          var url = '/resource/dmaterial?id=' + req.query.id
          Favorites.findOne({url: url, user: req.session.user._id}, function (err, doc) {
            if (err) {
              res.end(err)
            } else if (!_.isEmpty(doc)) {
              material._doc.isCollect = true
            } else {
              material._doc.isCollect = false
            }
            res.render(targetPath, {
              siteConfig: resFunc.siteInfos('制作宝'),
              cateList: resFunc.getCategoryList(),
              logined: req.session.logined,
              promotionForMaterial:promotionForMaterial,
              searchRecommendForManufacture: searchRecommendForManufacture,
              searchRecommendForMaterial: searchRecommendForMaterial,
              searchRecommendForEquipment: searchRecommendForEquipment,
              searchRecommendForDemands: searchRecommendForDemands,
              searchRecommendForSearch: searchRecommendForSearch,
              searchRecommendForFix:searchRecommendForFix,
              ebookData: ebookData,
              title: title,
              companyList:companyList,
              companyIdentify: companyIdentify,
              company: company,
              idCardIdentify: idCardIdentify,
              material: material,
              staticforder: staticforder,
              layout: defaultTempPath
            })
          })
        }
      }
    })
  },

  setDataFordMake: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    if (_.isEmpty(req.query.id)) {
      res.redirect('/users/home')
      return
    }
    var searchRecommendForManufacture = SearchRecommend.findOne({type: 'Manufacture',where: 'hotsearch'})
    var searchRecommendForMaterial = SearchRecommend.findOne({type: 'Material',where: 'hotsearch'})
    var searchRecommendForEquipment = SearchRecommend.findOne({type: 'Equipment',where: 'hotsearch'})
    var searchRecommendForDemands = SearchRecommend.findOne({type: 'Demands',where: 'hotsearch'})
    var searchRecommendForFix = Install.findOne({type: 'Install',where: 'hotsearch'})
    var searchRecommendForSearch = SearchRecommend.findOne({where: 'searchbox'})
    var ebookData = Ebook.find({}).sort({createdAt:-1})
    var companyList=BrandPromotion.aggregate([{ $match: {promotionEnd:{$gt:new Date()}} }, { $sample: { size: 16 } } ])
    var promotionForManufacture=PubHistory.aggregate([{ $match: {resType:"Manufacture",promotionEnd:{$gt:new Date()}} }, { $sample: { size: 32 } } ])

    PubHistory.update({resNum: req.query.id}, { $inc: { pageview: 1 }}).exec()
    PubHistory.findOne({resNum: req.query.id}).populate('categoryL2 categoryL3', 'name').exec(function (err, manufacture) {
      if (err) {
        res.end(err)
      }else {
        var companyIdentify = CompanyIdentify.findOne({user: manufacture.user})
        var idCardIdentify = IdCardIdentify.findOne({user: manufacture.user})
        var company = Company.findOne({user: manufacture.user})
        var title = manufacture.title + '- 制作宝'
        if (!manufacture.promotionRegions || manufacture.promotionRegions.length == 0 || !manufacture.promotionEnd || manufacture.promotionEnd <= new Date()) {
          manufacture._doc.isPromotion = false
        }else {
          manufacture._doc.isPromotion = true
        }

        if (!req.session.logined) {
          manufacture._doc.phoneNum = manufacture.phoneNum.substring(0, 3) + '****' + manufacture.phoneNum.substring(7, 11)
          res.render(targetPath, {
            siteConfig: resFunc.siteInfos('制作宝'),
            cateList: resFunc.getCategoryList(),
            logined: req.session.logined,
            company: company,
            promotionForManufacture:promotionForManufacture,
            searchRecommendForManufacture: searchRecommendForManufacture,
            searchRecommendForMaterial: searchRecommendForMaterial,
            searchRecommendForEquipment: searchRecommendForEquipment,
            searchRecommendForDemands: searchRecommendForDemands,
            searchRecommendForSearch: searchRecommendForSearch,
            searchRecommendForFix:searchRecommendForFix,
            ebookData: ebookData,
            companyList:companyList,
            title: title,
            companyIdentify: companyIdentify,
            idCardIdentify: idCardIdentify,
            moment: moment,
            manufacture: manufacture,
            staticforder: staticforder,
            layout: defaultTempPath
          })
        }else {
          var url = '/resource/dMake?id=' + req.query.id
          Favorites.findOne({url: url, user: req.session.user._id}, function (err, doc) {
            if (err) {
              res.end(err)
            } else if (!_.isEmpty(doc)) {
              manufacture._doc.isCollect = true
            } else {
              manufacture._doc.isCollect = false
            }
            res.render(targetPath, {
              siteConfig: resFunc.siteInfos('制作宝'),
              cateList: resFunc.getCategoryList(),
              logined: req.session.logined,
              promotionForManufacture:promotionForManufacture,
              searchRecommendForManufacture: searchRecommendForManufacture,
              searchRecommendForMaterial: searchRecommendForMaterial,
              searchRecommendForEquipment: searchRecommendForEquipment,
              searchRecommendForDemands: searchRecommendForDemands,
              searchRecommendForSearch: searchRecommendForSearch,
              searchRecommendForFix:searchRecommendForFix,
              ebookData: ebookData,
              companyList:companyList,
              companyIdentify: companyIdentify,
              company: company,
              title: title,
              moment: moment,
              idCardIdentify: idCardIdentify,
              manufacture: manufacture,
              staticforder: staticforder,
              layout: defaultTempPath
            })
          })
        }
      }
    })
  },
  setDataFordMachine: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    if (_.isEmpty(req.query.id)) {
      res.redirect('/users/home')
      return
    }
    var searchRecommendForManufacture = SearchRecommend.findOne({type: 'Manufacture',where: 'hotsearch'})
    var searchRecommendForMaterial = SearchRecommend.findOne({type: 'Material',where: 'hotsearch'})
    var searchRecommendForEquipment = SearchRecommend.findOne({type: 'Equipment',where: 'hotsearch'})
    var searchRecommendForDemands = SearchRecommend.findOne({type: 'Demands',where: 'hotsearch'})
    var searchRecommendForFix = Install.findOne({type: 'Install',where: 'hotsearch'})
    var searchRecommendForSearch = SearchRecommend.findOne({where: 'searchbox'})
    var ebookData = Ebook.find({}).sort({createdAt:-1})
    var companyList=BrandPromotion.aggregate([{ $match: {promotionEnd:{$gt:new Date()}} }, { $sample: { size: 16 } } ])
    var promotionForEquipment=PubHistory.aggregate([{ $match: {resType:"Equipment",promotionEnd:{$gt:new Date()}} }, { $sample: { size: 32 } } ])

    PubHistory.update({resNum: req.query.id}, { $inc: { pageview: 1 }}).exec()
    PubHistory.findOne({resNum: req.query.id}).populate('categoryL2 categoryL3', 'name').exec(function (err, equipment) {
      if (err) {
        res.end(err)
      }else {
        var companyIdentify = CompanyIdentify.findOne({user: equipment.user})
        var idCardIdentify = IdCardIdentify.findOne({user: equipment.user})
        var company = Company.findOne({user: equipment.user})
        var title = equipment.title + '- 制作宝'

        if (!equipment.promotionRegions || equipment.promotionRegions.length == 0 || !equipment.promotionEnd || equipment.promotionEnd <= new Date()) {
          equipment._doc.isPromotion = false
        }else {
          equipment._doc.isPromotion = true
        }
        if (!req.session.logined) {
          equipment._doc.phoneNum = equipment.phoneNum.substring(0, 3) + '****' + equipment.phoneNum.substring(7, 11)
          res.render(targetPath, {
            siteConfig: resFunc.siteInfos('制作宝'),
            cateList: resFunc.getCategoryList(),
            logined: req.session.logined,
            company: company,
            promotionForEquipment:promotionForEquipment,
            searchRecommendForManufacture: searchRecommendForManufacture,
            searchRecommendForMaterial: searchRecommendForMaterial,
            searchRecommendForEquipment: searchRecommendForEquipment,
            searchRecommendForDemands: searchRecommendForDemands,
            searchRecommendForSearch: searchRecommendForSearch,
            searchRecommendForFix:searchRecommendForFix,
            ebookData: ebookData,
            companyList:companyList,
            companyIdentify: companyIdentify,
            title: title,
            idCardIdentify: idCardIdentify,
            equipment: equipment,
            staticforder: staticforder,
            layout: defaultTempPath
          })
        }else {
          var url = '/resource/dMachine?id=' + req.query.id
          Favorites.findOne({url: url, user: req.session.user._id}, function (err, doc) {
            if (err) {
              res.end(err)
            } else if (!_.isEmpty(doc)) {
              equipment._doc.isCollect = true
            } else {
              equipment._doc.isCollect = false
            }
            res.render(targetPath, {
              siteConfig: resFunc.siteInfos('制作宝'),
              cateList: resFunc.getCategoryList(),
              logined: req.session.logined,
              promotionForEquipment:promotionForEquipment,
              searchRecommendForManufacture: searchRecommendForManufacture,
              searchRecommendForMaterial: searchRecommendForMaterial,
              searchRecommendForEquipment: searchRecommendForEquipment,
              searchRecommendForDemands: searchRecommendForDemands,
              searchRecommendForSearch: searchRecommendForSearch,
              searchRecommendForFix:searchRecommendForFix,
              ebookData: ebookData,
              title: title,
              companyList:companyList,
              companyIdentify: companyIdentify,
              company: company,
              idCardIdentify: idCardIdentify,
              equipment: equipment,
              staticforder: staticforder,
              layout: defaultTempPath
            })
          })
        }
      }
    })
  },
  setDataFordDemand: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    if (_.isEmpty(req.query.id)) {
      res.redirect('/users/home')
      return
    }
    var searchRecommendForManufacture = SearchRecommend.findOne({type: 'Manufacture',where: 'hotsearch'})
    var searchRecommendForMaterial = SearchRecommend.findOne({type: 'Material',where: 'hotsearch'})
    var searchRecommendForEquipment = SearchRecommend.findOne({type: 'Equipment',where: 'hotsearch'})
    var searchRecommendForDemands = SearchRecommend.findOne({type: 'Demands',where: 'hotsearch'})
    var searchRecommendForFix = Install.findOne({type: 'Install',where: 'hotsearch'})
    var searchRecommendForSearch = SearchRecommend.findOne({where: 'searchbox'})
    var ebookData = Ebook.find({}).sort({createdAt:-1})

    var companyList=BrandPromotion.aggregate([{ $match: {promotionEnd:{$gt:new Date()}} }, { $sample: { size: 16 } } ])
    var promotionForAll=PubHistory.aggregate([{ $match: {promotionEnd:{$gt:new Date()}} }, { $sample: { size: 32 } } ])

    Demands.update({resNum: req.query.id}, { $inc: { pageview: 1 }}).exec()

    Demands.findOne({resNum: req.query.id}).populate('categoryL1 categoryL2', 'name').exec(function (err, demands) {
      if (err) {
        res.end(err)
      } else if (!_.isEmpty(demands)) {
        var title = demands.title + '- 制作宝'
        var company = Company.findOne({user: demands.user})
        if (!req.session.logined) {
          demands._doc.phoneNum = demands.phoneNum.substring(0, 3) + '****' + demands.phoneNum.substring(7, 11)
          res.render(targetPath, {
            siteConfig: resFunc.siteInfos('制作宝'),
            searchRecommendForManufacture: searchRecommendForManufacture,
            searchRecommendForMaterial: searchRecommendForMaterial,
            searchRecommendForEquipment: searchRecommendForEquipment,
            searchRecommendForDemands: searchRecommendForDemands,
            searchRecommendForSearch: searchRecommendForSearch,
            searchRecommendForFix:searchRecommendForFix,
            ebookData: ebookData,
            company:company,
            promotionForAll:promotionForAll,
            companyList:companyList,
            title: title,
            cateList: resFunc.getCategoryList(),
            logined: req.session.logined,
            demands: demands,
            staticforder: staticforder,
            layout: defaultTempPath
          })
        }else {
          var url = '/resource/dDemand?id=' + req.query.id
          Favorites.findOne({url: url, user: req.session.user._id}, function (err, doc) {
            if (err) {
              res.end(err)
            } else if (!_.isEmpty(doc)) {
              demands._doc.isCollect = true
            } else {
              demands._doc.isCollect = false
            }
            res.render(targetPath, {
              siteConfig: resFunc.siteInfos('制作宝'),
              cateList: resFunc.getCategoryList(),
              logined: req.session.logined,
              searchRecommendForManufacture: searchRecommendForManufacture,
              searchRecommendForMaterial: searchRecommendForMaterial,
              searchRecommendForEquipment: searchRecommendForEquipment,
              searchRecommendForDemands: searchRecommendForDemands,
              searchRecommendForSearch: searchRecommendForSearch,
              searchRecommendForFix:searchRecommendForFix,
              ebookData: ebookData,
              company:company,
              promotionForAll:promotionForAll,
              companyList:companyList,
              title: title,
              demands: demands,
              staticforder: staticforder,
              layout: defaultTempPath
            })
          })
        }
      }
    })
  },
  setDataForSecondDemand: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    var searchRecommendForManufacture = SearchRecommend.findOne({type: 'Manufacture',where: 'hotsearch'})
    var searchRecommendForMaterial = SearchRecommend.findOne({type: 'Material',where: 'hotsearch'})
    var searchRecommendForEquipment = SearchRecommend.findOne({type: 'Equipment',where: 'hotsearch'})
    var searchRecommendForDemands = SearchRecommend.findOne({type: 'Demands',where: 'hotsearch'})
    var searchRecommendForFix=Install.findOne({type : "Install",where : "hotsearch"})
    var searchRecommendForSearch = SearchRecommend.findOne({where: 'searchbox'})
    var ebookData = Ebook.find({}).sort({createdAt:-1})
    var companyList=BrandPromotion.aggregate([{ $match: {promotionEnd:{$gt:new Date()}} }, { $sample: { size: 16 } } ])
    var promotionForAll=PubHistory.aggregate([{ $match: {promotionEnd:{$gt:new Date()}} }, { $sample: { size: 6 } } ])

    res.render(targetPath, {
      siteConfig: resFunc.siteInfos('制作宝'),
      ebookData: ebookData,
      title: '广告需求- 需求搜索 - 制作宝',
      searchRecommendForManufacture: searchRecommendForManufacture,
      searchRecommendForMaterial: searchRecommendForMaterial,
      searchRecommendForEquipment: searchRecommendForEquipment,
      searchRecommendForDemands: searchRecommendForDemands,
      searchRecommendForFix:searchRecommendForFix,
      searchRecommendForSearch: searchRecommendForSearch,
      companyList:companyList,
      promotionForAll:promotionForAll,
      currentCateList: resFunc.getCategoryList(),
      cateList: resFunc.getCategoryList(),
      hangyeleibie: PublishConfig.hangyeleibie,
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    })
  },
  setDataForResourceFixList: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    var searchRecommendForManufacture=SearchRecommend.findOne({type : "Manufacture",where : "hotsearch"})
    var searchRecommendForMaterial=SearchRecommend.findOne({type : "Material",where : "hotsearch"})
    var searchRecommendForEquipment=SearchRecommend.findOne({type : "Equipment",where : "hotsearch"})
    var searchRecommendForDemands=SearchRecommend.findOne({type : "Demands",where : "hotsearch"})
    var searchRecommendForFix=Install.findOne({type : "Install",where : "hotsearch"})
    var searchRecommendForSearch=SearchRecommend.findOne({where : "searchbox"})
    var ebookData=Ebook.find({}).sort({createdAt:-1})
    var companyList=BrandPromotion.aggregate([{ $match: {promotionEnd:{$gt:new Date()}} }, { $sample: { size: 16 } } ])
    var promotionForAll=PubHistory.aggregate([{ $match: {promotionEnd:{$gt:new Date()}} }, { $sample: { size: 5 } } ])

    res.render(targetPath, {
      siteConfig: resFunc.siteInfos('制作宝'),
      ebookData:ebookData,
      title:'安装列表- 安装搜索 - 制作宝',
      searchRecommendForManufacture:searchRecommendForManufacture,
      searchRecommendForMaterial:searchRecommendForMaterial,
      searchRecommendForEquipment:searchRecommendForEquipment,
      searchRecommendForDemands:searchRecommendForDemands,
      searchRecommendForSearch:searchRecommendForSearch,
      searchRecommendForFix:searchRecommendForFix,
      currentCateList: resFunc.getCategoryList(),
      companyList:companyList,
      promotionForAll:promotionForAll,
      cateList: resFunc.getCategoryList(),
      hangyeleibie: PublishConfig.hangyeleibie,
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    })
  },
  setDataForResourceListMaterial: function (req, res, params , staticforder, defaultTempPath, targetPath) { 
    var typeThree = req.params.typeThree
    var searchRecommendForManufacture = SearchRecommend.findOne({type: 'Manufacture',where: 'hotsearch'})
    var searchRecommendForMaterial = SearchRecommend.findOne({type: 'Material',where: 'hotsearch'})
    var searchRecommendForEquipment = SearchRecommend.findOne({type: 'Equipment',where: 'hotsearch'})
    var searchRecommendForDemands = SearchRecommend.findOne({type: 'Demands',where: 'hotsearch'})
    var searchRecommendForFix=Install.findOne({type : "Install",where : "hotsearch"})
    var searchRecommendForSearch = SearchRecommend.findOne({where: 'searchbox'})
    var ebookData = Ebook.find({}).sort({createdAt:-1})
    var promotionForMaterial=PubHistory.aggregate([{ $match: {resType:"Material",promotionEnd:{$gt:new Date()}} }, { $sample: { size: 9 } } ])
    var companyList=BrandPromotion.aggregate([{ $match: {promotionEnd:{$gt:new Date()}} }, { $sample: { size: 16 } } ])

    if (!typeThree) {
      ContentCategory.find({parentID: 'HyD8BhH0x', state: '1'}, function (err, docs) {
        var typeThreeObj = {}
        var ids = _.pluck(docs, '_id')
        var currentCateList = ContentCategory.find({parentID: {$in: ids}, state: '1'}, {name: 1})
        res.render(targetPath, {
          siteConfig: resFunc.siteInfos('制作宝'),
          currentCateList: currentCateList,
          cateList: resFunc.getCategoryList(),
          typeThreeObj: typeThreeObj,
          promotionForMaterial:promotionForMaterial,
          ebookData: ebookData,
          companyList:companyList,
          title: '广告材料- 资源搜索 - 制作宝',
          searchRecommendForManufacture: searchRecommendForManufacture,
          searchRecommendForMaterial: searchRecommendForMaterial,
          searchRecommendForEquipment: searchRecommendForEquipment,
          searchRecommendForDemands: searchRecommendForDemands,
          searchRecommendForSearch: searchRecommendForSearch,
          searchRecommendForFix:searchRecommendForFix,
          cailiaopinpai: PublishConfig.cailiaopinpai,
          logined: req.session.logined,
          staticforder: staticforder,
          layout: defaultTempPath
        })
      }).sort({'sortId': 1})
    }else {
      ContentCategory.findOne({homePage: typeThree}, function (err, typeThreeObj) {
        var currentCateList = ContentCategory.find({parentID: typeThreeObj._id, state: '1'}, {name: 1}).sort({'sortId': 1})
        res.render(targetPath, {
          siteConfig: resFunc.siteInfos('制作宝'),
          currentCateList: currentCateList,
          cateList: resFunc.getCategoryList(),
          typeThreeObj: typeThreeObj,
          companyList:companyList,
          promotionForMaterial:promotionForMaterial,
          searchRecommendForManufacture: searchRecommendForManufacture,
          searchRecommendForMaterial: searchRecommendForMaterial,
          searchRecommendForEquipment: searchRecommendForEquipment,
          searchRecommendForDemands: searchRecommendForDemands,
          searchRecommendForSearch: searchRecommendForSearch,
          searchRecommendForFix:searchRecommendForFix,
          ebookData: ebookData,
          title: typeThreeObj.name + '- 资源搜索 - 制作宝',
          cailiaopinpai: PublishConfig.cailiaopinpai,
          logined: req.session.logined,
          staticforder: staticforder,
          layout: defaultTempPath
        })
      })
    }
  },
  setDataForResourceListMachine: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    var typeThree = req.params.typeThree
    var searchRecommendForManufacture = SearchRecommend.findOne({type: 'Manufacture',where: 'hotsearch'})
    var searchRecommendForMaterial = SearchRecommend.findOne({type: 'Material',where: 'hotsearch'})
    var searchRecommendForEquipment = SearchRecommend.findOne({type: 'Equipment',where: 'hotsearch'})
    var searchRecommendForDemands = SearchRecommend.findOne({type: 'Demands',where: 'hotsearch'})
    var searchRecommendForSearch = SearchRecommend.findOne({where: 'searchbox'})
    var searchRecommendForFix=Install.findOne({type : "Install",where : "hotsearch"})
    var ebookData = Ebook.find({}).sort({createdAt:-1})
    var companyList=BrandPromotion.aggregate([{ $match: {promotionEnd:{$gt:new Date()}} }, { $sample: { size: 16 } } ])
    var promotionForEquipment=PubHistory.aggregate([{ $match: {resType:"Equipment",promotionEnd:{$gt:new Date()}} }, { $sample: { size: 9 } } ])

    if (!typeThree) {
      ContentCategory.find({parentID: 'BJJ_r2BRg', state: '1'}, function (err, docs) {
        var typeThreeObj = {}
        var ids = _.pluck(docs, '_id')
        var currentCateList = ContentCategory.find({parentID: {$in: ids}, state: '1'}, {name: 1})
        res.render(targetPath, {
          siteConfig: resFunc.siteInfos('制作宝'),
          currentCateList: currentCateList,
          typeThreeObj: typeThreeObj,
          cateList: resFunc.getCategoryList(),
          promotionForEquipment:promotionForEquipment,
          title: '广告设备- 资源搜索 - 制作宝',
          searchRecommendForManufacture: searchRecommendForManufacture,
          searchRecommendForMaterial: searchRecommendForMaterial,
          searchRecommendForEquipment: searchRecommendForEquipment,
          searchRecommendForDemands: searchRecommendForDemands,
          searchRecommendForSearch: searchRecommendForSearch,
          searchRecommendForFix:searchRecommendForFix,
          ebookData: ebookData,
          companyList:companyList,
          shebeipinpai: PublishConfig.shebeipinpai,
          logined: req.session.logined,
          staticforder: staticforder,
          layout: defaultTempPath
        })
      }).sort({'sortId': 1})
    }else {
      ContentCategory.findOne({homePage: typeThree}, function (err, typeThreeObj) {
        var currentCateList = ContentCategory.find({parentID: typeThreeObj._id, state: '1'}, {name: 1}).sort({'sortId': 1})
        res.render(targetPath, {
          siteConfig: resFunc.siteInfos('制作宝'),
          currentCateList: currentCateList,
          cateList: resFunc.getCategoryList(),
          typeThreeObj: typeThreeObj,
          title: typeThreeObj.name + '- 资源搜索 - 制作宝',
          promotionForEquipment:promotionForEquipment,
          searchRecommendForManufacture: searchRecommendForManufacture,
          searchRecommendForMaterial: searchRecommendForMaterial,
          searchRecommendForEquipment: searchRecommendForEquipment,
          searchRecommendForDemands: searchRecommendForDemands,
          searchRecommendForSearch: searchRecommendForSearch,
          searchRecommendForFix:searchRecommendForFix,
          ebookData: ebookData,
          companyList:companyList,
          shebeipinpai: PublishConfig.shebeipinpai,
          logined: req.session.logined,
          staticforder: staticforder,
          layout: defaultTempPath
        })
      })
    }
  },
  setDataForResourceListMake: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    var typeThree = req.params.typeThree
    var searchRecommendForManufacture = SearchRecommend.findOne({type: 'Manufacture',where: 'hotsearch'})
    var searchRecommendForMaterial = SearchRecommend.findOne({type: 'Material',where: 'hotsearch'})
    var searchRecommendForEquipment = SearchRecommend.findOne({type: 'Equipment',where: 'hotsearch'})
    var searchRecommendForDemands = SearchRecommend.findOne({type: 'Demands',where: 'hotsearch'})
    var searchRecommendForFix=Install.findOne({type : "Install",where : "hotsearch"})
    var searchRecommendForSearch = SearchRecommend.findOne({where: 'searchbox'})
    var ebookData = Ebook.find({}).sort({createdAt:-1})
    var companyList=BrandPromotion.aggregate([{ $match: {promotionEnd:{$gt:new Date()}} }, { $sample: { size: 16 } } ])
    var promotionForManufacture=PubHistory.aggregate([{ $match: {resType:"Manufacture",promotionEnd:{$gt:new Date()}} }, { $sample: { size:9 } } ])
    if (!typeThree) {
      ContentCategory.find({parentID: 'H124B2BCx', state: '1'}, function (err, docs) {
        var typeThreeObj = {}
        var ids = _.pluck(docs, '_id')
        var currentCateList = ContentCategory.find({parentID: {$in: ids}, state: '1'}, {name: 1})
        res.render(targetPath, {
          siteConfig: resFunc.siteInfos('制作宝'),
          title: '广告制作- 资源搜索 - 制作宝',
          currentCateList: currentCateList,
          typeThreeObj: typeThreeObj,
          promotionForManufacture:promotionForManufacture,
          searchRecommendForManufacture: searchRecommendForManufacture,
          searchRecommendForMaterial: searchRecommendForMaterial,
          searchRecommendForEquipment: searchRecommendForEquipment,
          searchRecommendForDemands: searchRecommendForDemands,
          searchRecommendForSearch: searchRecommendForSearch,
          searchRecommendForFix:searchRecommendForFix,
          ebookData: ebookData,
          companyList:companyList,
          cateList: resFunc.getCategoryList(),
          logined: req.session.logined,
          staticforder: staticforder,
          layout: defaultTempPath
        })
      }).sort({'sortId': 1})
    }else {
      ContentCategory.findOne({homePage: typeThree}, function (err, typeThreeObj) {
        var currentCateList = ContentCategory.find({parentID: typeThreeObj._id, state: '1'}, {name: 1}).sort({'sortId': 1})
        res.render(targetPath, {
          siteConfig: resFunc.siteInfos('制作宝'),
          currentCateList: currentCateList,
          typeThreeObj: typeThreeObj,
          title: typeThreeObj.name + '- 资源搜索 - 制作宝',
          promotionForManufacture:promotionForManufacture,
          searchRecommendForManufacture: searchRecommendForManufacture,
          searchRecommendForMaterial: searchRecommendForMaterial,
          searchRecommendForEquipment: searchRecommendForEquipment,
          searchRecommendForDemands: searchRecommendForDemands,
          searchRecommendForSearch: searchRecommendForSearch,
          searchRecommendForFix:searchRecommendForFix,
          cateList: resFunc.getCategoryList(),
          ebookData: ebookData,
          companyList:companyList,
          logined: req.session.logined,
          staticforder: staticforder,
          layout: defaultTempPath
        })
      })
    }
  },

  setDataForResourceListAll: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    var searchRecommendForManufacture = SearchRecommend.findOne({type: 'Manufacture',where: 'hotsearch'})
    var searchRecommendForMaterial = SearchRecommend.findOne({type: 'Material',where: 'hotsearch'})
    var searchRecommendForEquipment = SearchRecommend.findOne({type: 'Equipment',where: 'hotsearch'})
    var searchRecommendForDemands = SearchRecommend.findOne({type: 'Demands',where: 'hotsearch'})
    var searchRecommendForFix=Install.findOne({type : "Install",where : "hotsearch"})
    var searchRecommendForSearch = SearchRecommend.findOne({where: 'searchbox'})
    var companyList=BrandPromotion.aggregate([{ $match: {promotionEnd:{$gt:new Date()}} }, { $sample: { size: 16 } } ])
    var ebookData = Ebook.find({}).sort({createdAt:-1})
    var promotionForAll=PubHistory.aggregate([{ $match: {promotionEnd:{$gt:new Date()}} }, { $sample: { size: 9 } } ])

    res.render(targetPath, {
          siteConfig: resFunc.siteInfos('制作宝'),
          title: '广告制作- 资源搜索 - 制作宝',
          searchRecommendForManufacture: searchRecommendForManufacture,
          companyList:companyList,
          searchRecommendForMaterial: searchRecommendForMaterial,
          searchRecommendForEquipment: searchRecommendForEquipment,
          searchRecommendForDemands: searchRecommendForDemands,
          searchRecommendForSearch: searchRecommendForSearch,
          searchRecommendForFix:searchRecommendForFix,
          ebookData: ebookData,
          promotionForAll:promotionForAll,
          cateList: resFunc.getCategoryList(),
          logined: req.session.logined,
          staticforder: staticforder,
          layout: defaultTempPath
        })
  },
  // 数字期刊的Data
  setDataForDigitalMagazine: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    var currentCateList = ContentCategory.find({parentID: req.query.parentID, state: '1'}).sort({'createdAt': -1})
    var ebookData = Ebook.find({}).sort({createdAt:-1})
    var title = '数字期刊- 制作宝'
    return {
      siteConfig: resFunc.siteInfos('制作宝'),
      documentList: params.docs,
      title: title,
      EbookList:Ebook.find({}).sort({createdAt:-1}),
      ebookData: ebookData,
      cateTypes: resFunc.getCategoryList(),
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },

  setDataFornewslist: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    var currentCateList = ContentCategory.find({parentID: req.query.parentID, state: '1'}).sort({'createdAt': -1})
    var ebookData = Ebook.find({}).sort({createdAt:-1})
    var title = '文章头条列表- 制作宝'
    return {
      siteConfig: resFunc.siteInfos('制作宝'),
      documentList: params.docs,
      title: title,
      ebookData: ebookData,
      cateTypes: resFunc.getCategoryList(),
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },

  setDataForreportslist: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    var currentCateList = ContentCategory.find({parentID: req.query.parentID, state: '1'}).sort({'createdAt': -1})
    var ebookData = Ebook.find({}).sort({createdAt:-1})
    var title = '媒体报道列表- 制作宝'
    return {
      siteConfig: resFunc.siteInfos('制作宝'),
      documentList: params.docs,
      title: title,
      ebookData: ebookData,
      cateTypes: resFunc.getCategoryList(),
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },
  setDataForArticle: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    var currentCateList = ContentCategory.find({parentID: req.query.parentID, state: '1'}).sort({'createdAt': -1})
    var ebookData = Ebook.find({}).sort({createdAt:-1})
    var title = '文章头条- 制作宝'
    if(req.query.id){
      var articleDetail=Content.findOne({contentNum:req.query.id})
      return {
        siteConfig: resFunc.siteInfos('制作宝'),
        documentList: params.docs,
        title: title,
        ebookData: ebookData,
        moment:moment,
        articleDetail:articleDetail,
        cateTypes: resFunc.getCategoryList(),
        logined: req.session.logined,
        staticforder: staticforder,
        layout: defaultTempPath
      }
    }else {
      res.redirect('../../users/home')
    }

  },

  setDataForFix: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    var searchRecommendForManufacture=SearchRecommend.findOne({type : "Manufacture",where : "hotsearch"})
    var searchRecommendForMaterial=SearchRecommend.findOne({type : "Material",where : "hotsearch"})
    var searchRecommendForEquipment=SearchRecommend.findOne({type : "Equipment",where : "hotsearch"})
    var searchRecommendForDemands=SearchRecommend.findOne({type : "Demands",where : "hotsearch"})
    var searchRecommendForFix=Install.findOne({type : "Install",where : "hotsearch"})
    var searchRecommendForSearch=SearchRecommend.findOne({where : "searchbox"})
    var companyList=BrandPromotion.aggregate([{ $match: {promotionEnd:{$gt:new Date()}} }, { $sample: { size: 16 } } ])
    var ebookData=Ebook.find({}).sort({createdAt:-1})

    res.render(targetPath, {
      siteConfig: resFunc.siteInfos('制作宝'),
      ebookData:ebookData,
      title:'发布安装 - 制作宝',
      searchRecommendForManufacture:searchRecommendForManufacture,
      searchRecommendForFix:searchRecommendForFix,
      searchRecommendForMaterial:searchRecommendForMaterial,
      searchRecommendForEquipment:searchRecommendForEquipment,
      searchRecommendForDemands:searchRecommendForDemands,
      searchRecommendForSearch:searchRecommendForSearch,
      companyList:companyList,
      currentCateList: resFunc.getCategoryList(),
      cateList: resFunc.getCategoryList(),
      hangyeleibie: PublishConfig.hangyeleibie,
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    })
  },
  setDataForChangeMyFix: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    var id=req.query.fixid;
    var myInstallList01 = Install.find({_id:id}).sort({'createdAt': -1})
    var searchRecommendForManufacture=SearchRecommend.findOne({type : "Manufacture",where : "hotsearch"})
    var searchRecommendForMaterial=SearchRecommend.findOne({type : "Material",where : "hotsearch"})
    var searchRecommendForEquipment=SearchRecommend.findOne({type : "Equipment",where : "hotsearch"})
    var searchRecommendForDemands=SearchRecommend.findOne({type : "Demands",where : "hotsearch"})
    var searchRecommendForFix=Install.findOne({type : "Install",where : "hotsearch"})
    var searchRecommendForSearch=SearchRecommend.findOne({where : "searchbox"})
    var ebookData=Ebook.find({}).sort({createdAt:-1})
    var companyList=BrandPromotion.aggregate([{ $match: {promotionEnd:{$gt:new Date()}} }, { $sample: { size: 16 } } ])

    res.render(targetPath, {
      siteConfig: resFunc.siteInfos('制作宝'),
      ebookData:ebookData,
      title:'安装修改 - 制作宝',
      companyList:companyList,
      myInstallList01:myInstallList01,
      searchRecommendForManufacture:searchRecommendForManufacture,
      searchRecommendForMaterial:searchRecommendForMaterial,
      searchRecommendForEquipment:searchRecommendForEquipment,
      searchRecommendForDemands:searchRecommendForDemands,
      searchRecommendForSearch:searchRecommendForSearch,
      searchRecommendForFix:searchRecommendForFix,
      currentCateList: resFunc.getCategoryList(),
      cateList: resFunc.getCategoryList(),
      hangyeleibie: PublishConfig.hangyeleibie,
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    })
  },
  // 品牌推广
  setDataForBrandWin: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    var currentCateList = ContentCategory.find({parentID: req.query.parentID, state: '1'}).sort({'sortId': 1})
    var ebookData = Ebook.find({}).sort({createdAt:-1})
    var title = '品牌推广- 制作宝'
    if (req.session.logined) {
      return {
        siteConfig: resFunc.siteInfos('制作宝'),
        documentList: params.docs,
        cateTypes: resFunc.getCategoryList(),
        ebookData: ebookData,
        title: title,
        companyIdentifyInfo: Company.findOne({user: req.session.user._id}),
        logined: req.session.logined,
        staticforder: staticforder,
        layout: defaultTempPath
      }
    }else {
      return {
        siteConfig: resFunc.siteInfos('制作宝'),
        documentList: params.docs,
        cateTypes: resFunc.getCategoryList(),
        ebookData: ebookData,
        title: title,
        logined: req.session.logined,
        staticforder: staticforder,
        layout: defaultTempPath
      }
    }
  },
  // vr
  setDataForVr: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    var currentCateList = ContentCategory.find({parentID: req.query.parentID, state: '1'}).sort({'sortId': 1})
    var ebookData = Ebook.find({}).sort({createdAt:-1})
    var title = 'vr展馆- 制作宝'
    return {
      siteConfig: resFunc.siteInfos('制作宝'),
      documentList: params.docs,
      ebookData: ebookData,
      cateTypes: resFunc.getCategoryList(),
      logined: req.session.logined,
      title: title,
      staticforder: staticforder,
      layout: defaultTempPath
    }
  }
}

module.exports = resFunc
