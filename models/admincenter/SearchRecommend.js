var mongoose = require('mongoose')
var Schema = mongoose.Schema

var hotSearchSchema = new Schema({
  region: {}, // province, city, district
  type: String, // 类型取值Homepage\Manufacture\Material\Equipment\Demands（在首页、制作二级页、材料二级页、设备二级页、需求二级页热搜内容不一样）
  where: String, // 位置取值searchbox\hotsearch（searchbox只有一条记录，hotsearch也只有一条记录但是用#连接多个值，如：控制器#无极灯#霓虹灯）
  text: String, // 文字内容
  rank: { type: Number, default: 0 }, // 权重值
  createdAt: { type: Date, default: Date.now }
})

var SearchRecommend = mongoose.model('SearchRecommend', hotSearchSchema)

module.exports = SearchRecommend