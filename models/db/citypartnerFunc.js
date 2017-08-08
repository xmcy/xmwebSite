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

var citypartnerFunc = {
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
      siteConfig: citypartnerFunc.siteInfos('制作宝'),
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
        var cityPartner = settings.SYSTEMTEMPFORDER + temp.alias + '/public/cityPartner'
        if (type == 'cityPartner') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/citypartner/cityPartner'
          res.render(targetPath, citypartnerFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, cityPartner))
          // citypartnerFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, cityPartner,targetPath)
        } else if (type == 'userinfo') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/citypartner/userinfo'
          // citypartnerFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, cityPartner, targetPath)
        res.render(targetPath, citypartnerFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, cityPartner))
        }else if (type == 'precisionPromotion') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/citypartner/precisionPromotion'
          res.render(targetPath, citypartnerFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, cityPartner))

          // citypartnerFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, cityPartner, targetPath)
        }else if (type == 'brandPromotion') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/citypartner/brandPromotion'
          // res.render(targetPath, citypartnerFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, cityPartner))
          res.render(targetPath, citypartnerFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, cityPartner))

          // citypartnerFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, cityPartner, targetPath)
        }else if (type == 'tenderBid') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/citypartner/tenderBid'
          // citypartnerFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, cityPartner, targetPath)
          res.render(targetPath, citypartnerFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, cityPartner))

          // res.render(targetPath, citypartnerFunc.setDataForShopIndex(req, res, params, temp.alias, cityPartner))
        }
      }else {
        res.writeHeader(200, {'Content-Type': 'text/javascript;charset=UTF-8'})
        res.end('亲爱哒，请先在后台安装并启用模板喔~!')
      }
    })
  },
  getCategoryList: function () {
    return ContentCategory.find({'parentID': '0', 'state': '1'}, 'name defaultUrl homePage').sort({'sortId': 1}).find()
  },







}

var findInPromise = function (model, userId) {
  var promise = new mongoose.Promise()
  model.find({user: userId, isDeleted: false, isShowing: true}, {title: 1}, function (err, docs) {
    promise.resolve(err, docs)
  })
  return promise
}
module.exports = citypartnerFunc
