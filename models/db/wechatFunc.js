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
var InviteCode = require('../activity/InviteCode')
var PubHistory = require('../publish/PubHistory')
var CategorySetting = require('../admincenter/CategorySetting')
var SearchRecommend = require('../admincenter/SearchRecommend')
var Install = require('../publish/Install')
var pubhistories = require('../publish/PubHistory')
var Ebook = require('../admincenter/Ebook')

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

var wechatFunc = {
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

  setDataForWeHomeSiteMap: function (req, res, params , staticforder, defaultTempPath) {
    var promotionForManufacture=PubHistory.aggregate([{ $match: {resType:"Manufacture",promotionEnd:{$gt:new Date()}} }, { $sample: { size: 32 } } ]).limit(6)
    return {
      siteConfig: wechatFunc.siteInfos('幸福天地'),
      documentList: params.docs,
      promotionForManufacture:promotionForManufacture,
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },
  setDataForWeCenterSiteMap: function (req, res, params , staticforder, defaultTempPath) {
    var myInstallList = Install.find({user: req.session.user._id,isDeleted:false}).sort({'refreshedAt': -1})
    /*console.log(req.session.user._id);*/
    return {
      siteConfig: wechatFunc.siteInfos('幸福天地'),
      myInstallList: myInstallList,
      userInfo: req.session.user,
      documentList: params.docs,
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },
  setDataForChangeFixSiteMap: function (req, res, params , staticforder, defaultTempPath) {
    var id=req.query.id;
    var myInstallList = Install.find({_id:id}).sort({'createdAt': -1})
    /*console.log(myInstallList);*/
    return {
      siteConfig: wechatFunc.siteInfos('幸福天地'),
      myInstallList: myInstallList,
      documentList: params.docs,
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },
  setDataForMagazineSiteMap: function (req, res, params , staticforder, defaultTempPath) {
    //var magazineList=ebooks.find().sort({"createdAt":-1})
    return {
      siteConfig: wechatFunc.siteInfos('幸福天地'),
      documentList: params.docs,
      EbookList:Ebook.find({}).sort({createdAt:-1}),
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },
  setDataForresourceRelease: function (req, res, params , staticforder, defaultTempPath) {
    //var magazineList=ebooks.find().sort({"createdAt":-1})
    if(req.query.id){
      return {
        siteConfig: wechatFunc.siteInfos('幸福天地'),
        documentList: params.docs,
        resourceDetail:PubHistory.findOne({_id:req.query.id}).populate('categoryL1').populate('categoryL2').populate('categoryL3'),
        EbookList:Ebook.find({}).sort({createdAt:-1}),
        logined: req.session.logined,
        staticforder: staticforder,
        layout: defaultTempPath
      }
    }else {
      var resourceDetail={}
      resourceDetail.isEdit='ok'
      return {
        siteConfig: wechatFunc.siteInfos('幸福天地'),
        documentList: params.docs,
        resourceDetail:resourceDetail,
        // EbookList:Ebook.find({}).sort({createdAt:-1}),
        logined: req.session.logined,
        staticforder: staticforder,
        layout: defaultTempPath
      }
    }

  },
  setDataForPriceListSiteMap: function (req, res, params , staticforder, defaultTempPath) {
    return {
      siteConfig: wechatFunc.siteInfos('幸福天地'),
      documentList: params.docs,
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },
  setDataForMakeListSiteMap: function (req, res, params , staticforder, defaultTempPath) {
    var makeList= pubhistories.find({ "isDeleted" : false}).sort({'createdAt': -1}).limit(15)
    return {
      siteConfig: wechatFunc.siteInfos('幸福天地'),
      makeList:makeList,
      documentList: params.docs,
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    }

  },
  setDataForMakeDetailSiteMap: function (req, res, params , staticforder, defaultTempPath) {
    var id = req.query.value;
    var detailMakeList=pubhistories.find({ "_id" : id}).sort({'createdAt': -1})
    PubHistory.update({_id:id}, { $inc: { pageview: 1 }}).exec()
    return {
      siteConfig: wechatFunc.siteInfos('幸福天地'),
      detailMakeList:detailMakeList,
      documentList: params.docs,
      moment:moment,
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },
  setDataForWeFixListSiteMap: function (req, res, params , staticforder, defaultTempPath) {
    var text=req.query.text;
    var myInstallList = Install.find({isDeleted:false}).sort({'createdAt': -1}).limit(15)
    return {
      siteConfig: wechatFunc.siteInfos('幸福天地'),
      documentList: params.docs,
      myInstallList:myInstallList,
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    }

  },
  setDataForweForgetPasswordSiteMap: function (req, res, params , staticforder, defaultTempPath) {
  return {
    siteConfig: wechatFunc.siteInfos('幸福天地'),
    documentList: params.docs,
    logined: req.session.logined,
    staticforder: staticforder,
    layout: defaultTempPath
  }

},
  setDataForweActivityNextSiteMap: function (req, res, params , staticforder, defaultTempPath) {
    return {
      siteConfig: wechatFunc.siteInfos('幸福天地'),
      inviteCode:InviteCode.findOne({user:req.session.user._id}),
      documentList: params.docs,
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    }

  },
setDataForweICanFixSiteMap: function (req, res, params , staticforder, defaultTempPath) {
  return {
    siteConfig: wechatFunc.siteInfos('幸福天地'),
    documentList: params.docs,
    logined: req.session.logined,
    staticforder: staticforder,
    layout: defaultTempPath
  }

},
  setDataForweActivitySiteMap: function (req, res, params , staticforder, defaultTempPath) {
  return {
    siteConfig: wechatFunc.siteInfos('幸福天地'),
    documentList: params.docs,
    logined: req.session.logined,
    staticforder: staticforder,
    layout: defaultTempPath
  }

},
  setDataForWeDetailFixSiteMap: function (req, res, params , staticforder, defaultTempPath) {
    var id= req.query.value;
    var detailList=Install.find({_id:id}).sort({'createdAt': -1})
    return {
      siteConfig: wechatFunc.siteInfos('幸福天地'),
      detailList:detailList,
      documentList: params.docs,
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },
  setDataForWeIPriceSiteMap: function (req, res, params , staticforder, defaultTempPath) {
    return {
      siteConfig: wechatFunc.siteInfos('幸福天地'),
      documentList: params.docs,
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    }
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

        if (type == 'getHomeInfo') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/wechat/getHomeInfo'
          res.render(targetPath, wechatFunc.setDataForWeHomeSiteMap(req, res, params, temp.alias))
        }else if (type == 'userCenter') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/wechat/userCenter'
          res.render(targetPath, wechatFunc.setDataForWeCenterSiteMap(req, res, params, temp.alias))
        }else if (type == 'weAboutOus') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/wechat/weAboutOus'
          res.render(targetPath, wechatFunc.setDataForweActivitySiteMap(req, res, params, temp.alias))
        }else if (type == 'weActivity') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/wechat/weActivity'
          res.render(targetPath, wechatFunc.setDataForweActivitySiteMap(req, res, params, temp.alias))
        }else if (type == 'weActivityNext') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/wechat/weActivityNext'
          res.render(targetPath, wechatFunc.setDataForweActivityNextSiteMap(req, res, params, temp.alias))
        }else if (type == 'weChangeMyFix') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/wechat/weChangeMyFix'
          res.render(targetPath, wechatFunc.setDataForChangeFixSiteMap(req, res, params, temp.alias))
        }else if (type == 'weDetailFix') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/wechat/weDetailFix'
          res.render(targetPath, wechatFunc.setDataForWeDetailFixSiteMap(req, res, params, temp.alias))
        }else if (type == 'weFixList') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/wechat/weFixList'
          res.render(targetPath, wechatFunc.setDataForWeFixListSiteMap(req, res, params, temp.alias))
        }else if (type == 'weForgetPassword') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/wechat/weForgetPassword'
          res.render(targetPath, wechatFunc.setDataForweForgetPasswordSiteMap(req, res, params, temp.alias))
        }else if (type == 'weICanFix') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/wechat/weICanFix'
          res.render(targetPath, wechatFunc.setDataForweICanFixSiteMap(req, res, params, temp.alias))
        }else if (type == 'weIprice') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/wechat/weIprice'
          res.render(targetPath, wechatFunc.setDataForWeIPriceSiteMap(req, res, params, temp.alias))
        }else if (type == 'weMagazine') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/wechat/weMagazine'
          res.render(targetPath, wechatFunc.setDataForMagazineSiteMap(req, res, params, temp.alias))
        }else if (type == 'weMakeDetail') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/wechat/weMakeDetail'
          res.render(targetPath, wechatFunc.setDataForMakeDetailSiteMap(req, res, params, temp.alias))
        }else if (type == 'weMakeList') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/wechat/weMakeList'
          res.render(targetPath, wechatFunc.setDataForMakeListSiteMap(req, res, params, temp.alias))
        }else if (type == 'wePriceList') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/wechat/wePriceList'
          res.render(targetPath, wechatFunc.setDataForPriceListSiteMap(req, res, params, temp.alias))
        }else if (type == 'weAboutOus') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/wechat/weAboutOus'
          res.render(targetPath, wechatFunc.setDataForweActivitySiteMap(req, res, params, temp.alias))
        } else if (type == 'weRegister') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/wechat/weRegister'
          res.render(targetPath, wechatFunc.setDataForMagazineSiteMap(req, res, params, temp.alias))
        } else if (type == 'resourceRelease') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/wechat/resourceRelease'
          res.render(targetPath, wechatFunc.setDataForresourceRelease(req, res, params, temp.alias))
        }
      }else {
        res.writeHeader(200, {'Content-Type': 'text/javascript;charset=UTF-8'})
        res.end('亲爱哒，请先在后台安装并启用模板喔~!')
      }
    })
  }
}

module.exports = wechatFunc
