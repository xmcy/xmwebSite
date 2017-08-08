var mongoose = require('mongoose')
var Schema = mongoose.Schema

var fd4rSchema = new Schema({
    flag: { type: String, default: 'FunnyData4Res', unique: true },
    resCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
})

var FunnyData4Res = mongoose.model('FunnyData4Res', fd4rSchema)

module.exports = FunnyData4Res