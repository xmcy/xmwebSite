var mongoose = require('mongoose')
var Schema = mongoose.Schema

var pubHistorySchema = new Schema({
  resNum: String, // id
  region: {}, // province, city, district
  // type: {type: String, ref: 'ContentCategory'}, // 三级类目ID

  resType: String, // 资源类别标识 Manufacture\Material\Equipment
  categoryL1: {type: String, ref: 'ContentCategory'}, // 关联的一级栏目ID
  categoryL2: {type: String, ref: 'ContentCategory'}, // 关联的二级栏目ID
  categoryL3: {type: String, ref: 'ContentCategory'}, // 关联的三级栏目ID
  installType: String, // 安装方式
  brand: String, // 品牌
  freightType: String, // 运费支付方式
  originalPrice: Number, // 原价
  discountPrice: Number, // 则扣价格
  images: [], // 图片集合
  title: String, // 标题
  contacts: String, // 联系人
  phoneNum: String, // 联系电话
  details: String, // 详情
  pageview: { type: Number, default: 0 }, // 浏览量
  createdAt: { type: Date, default: Date.now },
  user: {type: String, ref: 'User'}, // 关联的User

  promotionRegions: [], // 是否正在推广
  promotionBegin: Date, // 推广开始时间 服务正式上线开始计时
  promotionEnd: Date, // 推广结束时间

  refreshedAt: { type: Date, default: Date.now }, // 更新时间
  isDeleted: { type: Boolean, default: false }, // 是否删除标识
  isShowing: { type: Boolean, default: true }, // 是否正在显示
  isTop: { type: Boolean, default: false }, // 是否置顶显示 
})

var PubHistory = mongoose.model('PubHistory', pubHistorySchema)

module.exports = PubHistory
