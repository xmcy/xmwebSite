var mongoose = require('mongoose')
var Schema = mongoose.Schema

var VRSchema = new Schema({
  region: {}, // province, city, district
  type: String, // 类别 制作、材料、设备
  title: String, // 标题
  imgs: [], // 封面图片url可多张
  company: {type: String, ref : 'Company'}, // 关联的商铺
  onlineView: String, // 在线浏览url
  recommend: Boolean, // 是否推荐
  recommendAt: Date, // 开始推荐时间
  createdAt: { type: Date, default: Date.now }
})

var VR = mongoose.model('VR', VRSchema)

module.exports = VR
