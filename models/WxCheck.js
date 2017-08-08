var mongoose = require('mongoose')
var Schema = mongoose.Schema

var WxCheckSchema = new Schema({
  openId: String , // 制作宝公众号openId
  wechatId: String, // 微信UnionId

  createdAt: { type: Date, default: Date.now }
})

var WxCheck = mongoose.model('WxCheck', WxCheckSchema)

module.exports = WxCheck
