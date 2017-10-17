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
var Company = require('../models/Company')

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
var citypartnerFunc = require('../models/db/citypartnerFunc')
var CompanyIdentify = require('../models/CompanyIdentify')

var returnUsersRouter = function (io) {
  // 校验是否登录
  function isLogined (req) {
    return req.session.logined
  }
  router.get('/cityPartner', function (req, res, next) {
    if (!isLogined(req)) {
      res.redirect('/users/transition')
    }else {
      citypartnerFunc.renderToTargetPageByType(req, res, 'cityPartner', {title: '城市运营商', page: 'cityPartner'})
    }
  })

  router.get('/userinfo', function (req, res, next) {
    if (!isLogined(req)) {
      res.redirect('/users/transition')
    }else {
      citypartnerFunc.renderToTargetPageByType(req, res, 'userinfo', {title: '用户信息', page: 'userinfo'})
    }
  })

  router.get('/precisionPromotion', function (req, res, next) {
    if (!isLogined(req)) {
      res.redirect('/users/transition')
    }else {
      citypartnerFunc.renderToTargetPageByType(req, res, 'precisionPromotion', {title: '精准推广收入', page: 'precisionPromotion'})
    }
  })

  router.get('/brandPromotion', function (req, res, next) {
    if (!isLogined(req)) {
      res.redirect('/users/transition')
    }else {
      citypartnerFunc.renderToTargetPageByType(req, res, 'brandPromotion', {title: '品牌推广收入', page: 'brandPromotion'})
    }
  })

  router.get('/tenderBid', function (req, res, next) {
    if (!isLogined(req)) {
      res.redirect('/users/transition')
    }else {
      citypartnerFunc.renderToTargetPageByType(req, res, 'tenderBid', {title: '招投标收入', page: 'tenderBid'})
    }
  })


  return router
}

module.exports = returnUsersRouter
