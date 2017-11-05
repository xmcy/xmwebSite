var express = require('express')
var router = express.Router()
var url = require('url')
var _ = require('lodash')
var validator = require('validator')
var request=require('request')
var ContentCategory = require('../../models/ContentCategory')
var User = require('../../models/User')
var Advice = require('../../models/Advice')
var WxCheck = require('../../models/WxCheck')
var Wx = require('../../models/Wx')
var AdminUser = require('../../models/AdminUser')
var Message = require('../../models/Message')
var Content = require('../../models/Content')
var DbOpt = require('../../models/Dbopt')
var PubHistory = require('../../models/publish/PubHistory')
var Demands = require('../../models/publish/Demands')
var PriceConfig2 = require('../../models/admincenter/PriceConfig2')
var PrecisePromotion = require('../../models/admincenter/PrecisePromotion')
var Bill = require('../../models/Bill')
var Install = require('../../models/publish/Install')

var crypto = require('crypto')
var system = require('../../util/system')
var moment = require('moment')
var settings = require('../../models/db/settings')
var wechatFunc = require('../../models/db/wechatFunc')
var filter = require('../../util/filter')
var config = require('../../config')

var UserNotify = require('../../models/UserNotify')
var Notify = require('../../models/Notify')

var SMS = require('../../models/SMS')
var smsUtils = require('../../util/smsUtils')
var weChat=require('../../weChat')

// 校验是否登录
function isLogined (req) {
  return req.session.logined
}

router.post('/checksignature', function (req, res, next) {
 //来自微信的请求 /wechat/checksignature?signature=84ef1261eaf09aedf2048181491beaf0e19e1765&timestamp=1501223619&nonce=977794337&openid=oBTpowi2oHrHjvZ_NMHSGSsfn6OQ
  var openid=req.query.openid
  User.find({bOpenId:openid},function (err,u) {
    if(u&&!u.bOpenId){
      WxCheck.findOne({openId:openid},function (err,wxCheck) {
        if(_.isEmpty(wxCheck)){
          Wx.findOne({},function (err,wx) {
            var url2='https://api.weixin.qq.com/cgi-bin/user/info?access_token='+wx.accessToken+'&openid='+openid+'&lang=zh_CN '
            request.get({
              url:url2
            },function (error, response, body) {
              if(response.statusCode == 200){
                var data1 = JSON.parse(body);
                var unionid=data1.unionid
                User.findOne({wechatId:unionid},function (err,user) {
                  if(!_.isEmpty(user)){
                    User.findByIdAndUpdate(user._id,{$set:{bOpenId:openid}},function (err,u) {
                      res.send('ok')
                    })
                  }else {
                    var doc={}
                    doc.wechatId=unionid
                    doc.openId=openid
                    var wxcheck=new WxCheck(doc)
                    wxcheck.save(function (err,wx) {
                      res.send('ok')
                    })
                  }
                })
              }else{
                console.log(response.statusCode);
                res.send('ok')
              }
            })
          })
        }else {
          res.send('ok')
        }
      })
    }else {
      res.send('ok')
    }
  })
  //1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
  // var signature = req.query.signature,//微信加密签名
  //     timestamp = req.query.timestamp,//时间戳
  //     nonce = req.query.nonce,//随机数
  //     echostr = req.query.echostr;//随机字符串
  //
  // //2.将token、timestamp、nonce三个参数进行字典序排序
  // var array = [weChat.token,timestamp,nonce];
  // array.sort();
  //
  // //3.将三个参数字符串拼接成一个字符串进行sha1加密
  // var tempStr = array.join('');
  // const hashCode = crypto.createHash('sha1'); //创建加密类型
  // var resultCode = hashCode.update(tempStr,'utf8').digest('hex'); //对传入的字符串进行加密
  //
  // //4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
  // if(resultCode === signature){
  //   res.send(echostr);
  // }else{
  //   res.send('mismatch');
  // }
})

router.get('/checkUser', function (req, res, next) {
    var notify_url = 'http://www.91zhizuo.com' + '/wechat/checkUserForTwo'
    var scope = 'snsapi_userinfo';
    res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid='+settings.wxid
        +'&redirect_uri='+encodeURIComponent(notify_url)+'&response_type=code&scope='+scope+'&state=STATE#wechat_redirect');
})

router.get('/checkUserForTwo', function (req, res, next) {
    var url='https://api.weixin.qq.com/sns/oauth2/access_token?appid='+settings.wxid+'&secret='+settings.wxsecret
        +'&code='+req.query.code+'&grant_type=authorization_code '
    request.get({
      url:url
    },function (error, response, body) {
      if(response.statusCode == 200){
        var data = JSON.parse(body);
        console.log(data)
        var access_token = data.access_token;
        var openid = data.openid;
        var url2='https://api.weixin.qq.com/sns/userinfo?access_token='+access_token+'&openid='+openid+'&lang=zh_CN '
        request.get({
          url:url2
        },function (error, response, body) {
          if(response.statusCode == 200){
            var data1 = JSON.parse(body);
            var unionid=data1.unionid
            User.findOne({wechatId:unionid},function (err,user) {
              if(!_.isEmpty(user)){
                User.findByIdAndUpdate(user._id,{$set:{bOpenId:openid}},function (err,u) {
                  
                })
              }else {
                var doc={}
                doc.wechatId=unionid
                doc.openId=openid
                var wxcheck=new WxCheck(doc)
                wxcheck.save(function (err,wx) {

                })
              }
            })
          }else{
            console.log(response.statusCode);
          }
        })
      }else{
        console.log(response.statusCode);
      }
    })
})
// 不需要登陆的路由直接渲染
router.get('/getHomeInfo', function (req, res, next) {
  wechatFunc.renderToTargetPageByType(req, res, 'getHomeInfo', {title: '欢迎来到幸福天地!',page: 'getHomeInfo'})
})
router.get('/weActivity', function (req, res, next) {
  wechatFunc.renderToTargetPageByType(req, res, 'weActivity', {title: '欢迎来到幸福天地!',page: 'weActivity'})
})
router.get('/weActivityNext', function (req, res, next) {
  wechatFunc.renderToTargetPageByType(req, res, 'weActivityNext', {title: '欢迎来到幸福天地!',page: 'weActivityNext'})
})
router.get('/weDetailFix', function (req, res, next) {
  wechatFunc.renderToTargetPageByType(req, res, 'weDetailFix', {title: '欢迎来到幸福天地!',page: 'weDetailFix'})
})
router.get('/weFixList', function (req, res, next) {
  wechatFunc.renderToTargetPageByType(req, res, 'weFixList', {title: '欢迎来到幸福天地!',page: 'weFixList'})
})
router.get('/weForgetPassword', function (req, res, next) {
  wechatFunc.renderToTargetPageByType(req, res, 'weForgetPassword', {title: '欢迎来到幸福天地!',page: 'weForgetPassword'})
})
router.get('/weAboutOus', function (req, res, next) {
  wechatFunc.renderToTargetPageByType(req, res, 'weAboutOus', {title: '欢迎来到幸福天地!',page: 'weAboutOus'})
})
router.get('/weMagazine', function (req, res, next) {
  wechatFunc.renderToTargetPageByType(req, res, 'weMagazine', {title: '欢迎来到幸福天地!',page: 'weMagazine'})
})
router.get('/weMakeDetail', function (req, res, next) {
  wechatFunc.renderToTargetPageByType(req, res, 'weMakeDetail', {title: '欢迎来到幸福天地!',page: 'weMakeDetail'})
})
router.get('/weMakeList', function (req, res, next) {
  wechatFunc.renderToTargetPageByType(req, res, 'weMakeList', {title: '欢迎来到幸福天地!',page: 'weMakeList'})
})
router.get('/weAboutOus', function (req, res, next) {
  wechatFunc.renderToTargetPageByType(req, res, 'weAboutOus', {title: '欢迎来到幸福天地!',page: 'weAboutOus'})
})
router.get('/wePriceList', function (req, res, next) {
  wechatFunc.renderToTargetPageByType(req, res, 'wePriceList', {title: '欢迎来到幸福天地!',page: 'weMakeDetail'})
})
router.get('/weRegister', function (req, res, next) {
  wechatFunc.renderToTargetPageByType(req, res, 'weRegister', {title: '欢迎来到幸福天地!',page: 'weRegister'})
})
router.get('/resourceRelease', function (req, res, next) {
  wechatFunc.renderToTargetPageByType(req, res, 'resourceRelease', {title: '欢迎来到幸福天地!',page: 'resourceRelease'})
})
// 需要登陆的路由判断登陆状态
router.get('/userCenter', function (req, res, next) {
  if (isLogined(req)) {
    wechatFunc.renderToTargetPageByType(req, res, 'userCenter', {title: '欢迎来到幸福天地！',page: ''})
  }else {
    wechatFunc.renderToTargetPageByType(req, res, 'weRegister', {title: '欢迎加入幸福天地！',page: ''})
  /*wechatFunc.renderToTargetPageByType(req, res, 'userCenter', {title: '欢迎加入幸福天地！',page: ''})*/
  }
})

router.get('/weChangeMyFix', function (req, res) {
  if (isLogined(req)) {
    wechatFunc.renderToTargetPageByType(req, res, 'weChangeMyFix', {title: '欢迎来到幸福天地！',page: ''})
  }else {
    wechatFunc.renderToTargetPageByType(req, res, 'weRegister', {title: '欢迎加入幸福天地！',page: ''})
  /*wechatFunc.renderToTargetPageByType(req, res, 'weChangeMyFix', {title: '欢迎加入幸福天地！',page: ''})*/
  }
})
router.get('/weICanFix', function (req, res, next) {
  if (isLogined(req)) {
    wechatFunc.renderToTargetPageByType(req, res, 'weICanFix', {title: '欢迎来到幸福天地！',page: ''})
  }else {
    wechatFunc.renderToTargetPageByType(req, res, 'weRegister', {title: '欢迎加入幸福天地！',page: ''})
  /* wechatFunc.renderToTargetPageByType(req, res, 'weICanFix', {title: '欢迎加入幸福天地！',page: ''})*/
  }
})
router.get('/weIprice', function (req, res, next) {
  if (isLogined(req)) {
    wechatFunc.renderToTargetPageByType(req, res, 'weIprice', {title: '欢迎来到幸福天地！',page: ''})
  }else {
    wechatFunc.renderToTargetPageByType(req, res, 'weRegister', {title: '欢迎加入幸福天地！',page: ''})
  /*wechatFunc.renderToTargetPageByType(req, res, 'weIprice', {title: '欢迎加入幸福天地！',page: ''})*/
  }
})

// 通过父类别得到子类别
router.post('/getChildType', function (req, res, next) {
  var currentCateList = ContentCategory.find({parentID: req.body.parentID, state: '1'}).sort({'sortId': 1})
  res.json({
    currentCateList: currentCateList
  })
})



//投诉建议
router.post('/InsertAdvice', function (req, res, next) {
      // var phoneNumArr=['13367255218','15927095400','13871312213','18571557923']
      var phoneNumArr=['18571557923']
      var dataObj={
        resNum:moment().format('YYYYMMDDHHmmss') + _.random(10000, 99999),
        resType:req.body.resType,
        images:req.body.images,
        contacts:req.body.contacts,
        phoneNum:req.body.phoneNum,
        details:req.body.details,
        detailPlace:req.body.detailPlace
      }
    var advice=new Advice(dataObj)
    advice.save(function (err) {
      if (err) {
        res.json({ error: err })
      } else {
        if(req.body.resType=="1"||req.body.resType=="2"||req.body.resType=="3"){
            console.log("get")
          // phoneNumArr.push('18702786303')
        }else if(req.body.resType=="4"){
          phoneNumArr.push('13971651751')
          phoneNumArr.push('15172316250')
        }else if(req.body.resType=="5"||req.body.resType=="6"){
          phoneNumArr.push('13871457538')
          phoneNumArr.push('18071022988')
        }else if(req.body.resType=="7"){
          phoneNumArr.push('13007107822')
          phoneNumArr.push('18986180878')
        }
        smsUtils.sendNotifyMultiSMS_qcloud(phoneNumArr,smsUtils.code27,[req.body.resourceTypeText,req.body.detailPlace],function (err) {
          console.log(err)
        })
        res.json({
          'result': 'success'
        })
      }
    })
  
})


module.exports = router
