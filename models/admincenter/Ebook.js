var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ebookSchema = new Schema({
  region: {}, // province, city, district
  title: String, // 标题
  coverImg: String, // 封面图片url
  onlineView: String, // 在线浏览url
  downloadUrl: String, // 下载url
  onlineConut:{ type: Number, default: 0 }, // 在线浏览量
  downloadConut:{ type: Number, default: 0 }, // 下载量
  createdAt: { type: Date, default: Date.now }
})

var Ebook = mongoose.model('Ebook', ebookSchema)

module.exports = Ebook
