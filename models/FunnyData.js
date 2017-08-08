var mongoose = require('mongoose')
var Schema = mongoose.Schema

var fdSchema = new Schema({
    newResCount: { type: Number, default: 0 },
    newUserCount: { type: Number, default: 0 },
    searchCount: { type: Number, default: 0 },
    pageViewCount: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now }
})

var FunnyData = mongoose.model('FunnyData', fdSchema)

module.exports = FunnyData