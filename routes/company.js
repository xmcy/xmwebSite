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
var companyFunc = require('../models/db/companyFunc')
var CompanyIdentify = require('../models/CompanyIdentify')

var returnUsersRouter = function (io) {
  // 校验是否登录
  function isLogined (req) {
    return req.session.logined
  }
  router.get('/shopcertificate', function (req, res, next) {
    if (!isLogined(req)) {
      res.redirect('/users/transition')
    }else {
      companyFunc.renderToTargetPageByType(req, res, 'shopcertificate', {title: '企业认证', page: 'shopcertificate'})
    }
  })

  router.get('/shopcenter', function (req, res, next) {
    if (!isLogined(req)) {
      res.redirect('/users/transition')
    }else {
      companyFunc.renderToTargetPageByType(req, res, 'shopcenter', {title: '企业资源', page: 'shopcenter'})
    }
  })

  router.get('/shopinfo', function (req, res, next) {
    if (!isLogined(req)) {
      res.redirect('/users/transition')
    }else {
      companyFunc.renderToTargetPageByType(req, res, 'shopinfo', {title: '企业信息', page: 'shopinfo'})
    }
  })

  router.get('/shoppromote', function (req, res, next) {
    if (!isLogined(req)) {
      res.redirect('/users/transition')
    }else {
      companyFunc.renderToTargetPageByType(req, res, 'shoppromote', {title: '企业品牌推广', page: 'shoppromote'})
    }
  })

  router.get('/shopindex', function (req, res, next) {
    if (!isLogined(req)) {
      res.redirect('/users/transition')
    }else {
      companyFunc.renderToTargetPageByType(req, res, 'shopindex', {title: '企业首页', page: 'shopindex'})
    }
  })

  router.get('/shopSpecific1', function (req, res, next) {
    if(req.query.id){
      companyFunc.renderToTargetPageByType(req, res, 'shopSpecific1', {title: '企业详情页1',page: 'shopSpecific1'})
    }else {
      res.redirect('/users/home')
    }
  })

  router.get('/shopSpecific2', function (req, res, next) {
    if(req.query.id) {
      companyFunc.renderToTargetPageByType(req, res, 'shopSpecific2', {title: '企业详情页1', page: 'shopSpecific2'})
    }else{
      res.redirect('/users/home')
    }
  })

  router.get('/shopcomment', function (req, res, next) {
    if(req.query.id){
      companyFunc.renderToTargetPageByType(req, res, 'shopcomment', {title: '企业评论',page: 'shopcomment'})
    }else {
      res.redirect('/users/home')
    }
  })

  router.get('/licenseCertification', function (req, res, next) {
    if (!isLogined(req)) {
      res.redirect('/users/transition')
    }else {
      CompanyIdentify.findOne({user: req.session.user._id}, function (err, doc) {
        if(!_.isEmpty(doc)){
          if (doc.status == "审核通过" || doc.status == "审核驳回") {
            companyFunc.renderToTargetPageByType(req, res, 'licenseCertification3', {
              title: '营业执照信息审核完成',
              page: 'licenseCertification3'
            })
          } else if (doc.status == "审核中") {
            companyFunc.renderToTargetPageByType(req, res, 'licenseCertification2', {
              title: '营业执照信息审核',
              page: 'licenseCertification2'
            })
          }
        }else {
          companyFunc.renderToTargetPageByType(req, res, 'licenseCertification', {
            title: '营业执照信息提交',
            page: 'licenseCertification'
          })
        }
      })
    }
  })

  router.post('/updateCompanyInfo', function (req, res, next) {
    var error
    // if (_.isEmpty(req.body.companyName)) {
    //   error = '企业名称为空'
    // } else if (_.isEmpty(req.body.businessScope)) {
    //   error = '经营范围为空'
    // } else if (_.isEmpty(req.body.companyLogo)) {
    //   error = '企业logo为空'
    // } else if (_.isEmpty(req.body.companyDes)) {
    //   error = '企业简介为空'
    // } else if (_.isEmpty(req.body.region) || _.isEmpty(req.body.address)) {
    //   error = '请选择并输入企业详细地址'
    // } else if (_.isEmpty(req.body.contacts)) {
    //   error = '企业联系人为空'
    // } else if (_.isEmpty(req.body.phoneNum)) {
    //   error = '企业联系电话为空'
    // }
    var su = req.session.user
    if (_.isEmpty(su)) {
      res.end(settings.system_illegal_param)
    } else {
      var companyId = req.body.id
      if (!_.isEmpty(companyId)) {
        Company.update({_id: companyId, user: req.session.user._id}, {$set: req.body}, function (err, result) {
          if (err) {
            res.end(err)
          }else {
            res.json({
              'result': 'success'
            })
          }
        })
      } else {
        res.end('修改企业信息失败')
      }
    }
  })

  // 更新首页内容接口
  // 参数：
  // homePageBanner：图片资源对象 [{img: '', resId: ''}, {img: '', resId}], 可以传空数组[]
  // homePageBody：图片资源对象 [{img: '', resId: ''}, {img: '', resId}], 可以传空数组[]
  // companyId: 企业ID
  router.post('/updateHomepage', function (req, res, next) {
    var error
    var homePageBanner = req.body.homePageBanner
    var homePageBody = req.body.homePageBody
    var companyId = req.body.companyId

    if (_.isEmpty(companyId)) {
      error = '企业ID错误'
    }
    var su = req.session.user
    if (_.isEmpty(su)) {
      res.end(settings.system_illegal_param)
    } else {
      if (error) {
        res.end(error)
      } else {
        Company.findOneAndUpdate({_id: companyId, user: req.session.user._id}, {
          $set: {
            homePageBanner: homePageBanner,
            homePageBody: homePageBody
          }
        }, function (err, doc) {
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

  return router
}

module.exports = returnUsersRouter
