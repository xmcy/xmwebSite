var mongoose = require('mongoose')
var Schema = mongoose.Schema

var promotionSchema = new Schema({
  company: {type: String, ref: 'Company'}, // 关联的公司

  title: {type: String, default: '品牌推广服务'},

  period: String, // 推广周期 1季度、半年、1年
  promotionBegin: Date, // 推广开始时间 服务正式上线开始计时
  promotionEnd: Date, // 推广结束时间

  // 服务状态：未购买 -> 沟通传递素材 -> 制作中 -> 服务中
  priorShowState: { type: String, default: '沟通传递素材' }, // 优先展示
  eBookState: { type: String, default: '未购买' }, // 数字期刊
  VRState: { type: String, default: '未购买' }, // VR展馆
  weMediaState: { type: String, default: '未购买' }, // 自媒体渠道

  priorShowImgs: [], // 优先展示素材
  ebookImgs: [], // 数字期刊图片素材
  vrImgs: [], // VR图片素材
  weMediaImgs: [], // 自媒体文章二维码

  bill: {type: String, ref: 'Bill'}, // 关联的账单ID
  user: {type: String, ref: 'User'}, // 关联的User
  createdAt: { type: Date, default: Date.now }
})

var BrandPromotion = mongoose.model('BrandPromotion', promotionSchema)

module.exports = BrandPromotion
