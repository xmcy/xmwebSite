var mongoose = require('mongoose')
var Schema = mongoose.Schema

var WxSchema = new Schema({
  accessToken: { type: String, unique: true }, // 公众号accessToken全局唯一

  createdAt: { type: Date, default: Date.now }
})

var Wx = mongoose.model('Wx', WxSchema)

module.exports = Wx
