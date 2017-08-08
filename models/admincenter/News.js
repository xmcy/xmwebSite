var mongoose = require('mongoose')
var Schema = mongoose.Schema

var newsSchema = new Schema({
  title: String, // 标题
  website: String, // 新闻来源 网易等
  coverImg: String, // 封面图片url
  onlineView: String, // 在线浏览url
  newsDate:{ type: Date},// 文章发布时间
  isDeleted: { type: Boolean, default: false }, // 是否删除标识
  isTop: { type: Boolean, default: false }, // 是否置顶显示
  createdAt: { type: Date, default: Date.now }
})

var News = mongoose.model('News', newsSchema)

module.exports = News
