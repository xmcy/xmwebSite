var mongoose = require('mongoose')
var Schema = mongoose.Schema

var slideSchema = new Schema({
  region: {}, // province, city, district
  where: String, // 位置 homepage
  img: String, // 图片地址
  jump: String, // 跳转地址
  rank: Number, // 权重值
  isShowing: { type: Boolean, default: true }, //是否显示
  createdAt: { type: Date, default: Date.now }
})

var Slide = mongoose.model('Slide', slideSchema)

module.exports = Slide