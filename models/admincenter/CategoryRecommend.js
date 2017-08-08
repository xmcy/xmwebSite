var mongoose = require('mongoose')
var Schema = mongoose.Schema

var categoryRcdSchema = new Schema({
  type: String, // 类型取值Manufacture\Material\Equipment 每个大类目只有一条记录
  items: String, // 推荐的栏目用#拼接，如：控制器#无极灯#霓虹灯
  rank: { type: Number, default: 0 }, // 权重值
  createdAt: { type: Date, default: Date.now }
})

var CategoryRecommend = mongoose.model('CategoryRecommend', categoryRcdSchema)

module.exports = CategoryRecommend