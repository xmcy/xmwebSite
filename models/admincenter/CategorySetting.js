var mongoose = require('mongoose')
var Schema = mongoose.Schema

var categorySettingSchema = new Schema({
  type: String, // 类型取值Manufacture\Material\Equipment
  category: {type: String, ref : 'ContentCategory'}, // 关联的栏目
  icon: String, // 栏目logo
  rank: { type: Number, default: 0 }, // 权重值
  createdAt: { type: Date, default: Date.now }
})

var CategorySetting = mongoose.model('CategorySetting', categorySettingSchema)

module.exports = CategorySetting