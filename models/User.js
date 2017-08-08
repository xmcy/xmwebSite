var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserSchema = new Schema({
  userName: { type: String, unique: true }, // 全局唯一
  nickName: String, // 昵称
  password: String, // 登陆密码 两种登陆方式 1、手机动态码 2、手机号/邮箱+密码登陆
  avatar: { type: String, default: 'https://cdn.adquan.net/images/def-img/user-logo.png' },
  gender: String,
  brithday: {}, // year, month, day
  region: {}, // province, city, district
  inviteCode: String, // 注册时填写的邀请码

  email: { type: String},
  emailVerified: { type: Boolean, default: false },
  phoneNum: { type: String, unique: true },
  phoneNumVerified: { type: Boolean, default: false },

  qqId: String, // QQ快捷登陆
  qqBind: { type: Boolean, default: false },
  wechatId: String, // 微信快捷登陆
  aOpenId: String, // 网站应用微信openId
  bOpenId: String, // 制作宝公众号应用微信openId
  wechatBind: { type: Boolean, default: false },

  idCard: {}, // verified imgUrl
  businessLicense: {}, // verified imgUrl

  group: { type: String, default: '0' }, // 用户组
  retrieve_time: Number, // 用户发送激活请求的时间

  comments: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },

  company: { type: String, ref: 'Company' }, // 关联的企业
  idCardIdentify: { type: String, ref: 'IdCardIdentify' }, // 实名认证情况
  companyIdentify: { type: String, ref: 'CompanyIdentify' }, // 营业执照认证情况

})

var User = mongoose.model('User', UserSchema)

module.exports = User
