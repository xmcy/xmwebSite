var mongoose = require('mongoose')
var Schema = mongoose.Schema

var smsSchema = new Schema({
  createdAt: String,
  code: String,
  duration: Number,
  phoneNum: String
})

var SMS = mongoose.model('SMS', smsSchema)

module.exports = SMS
