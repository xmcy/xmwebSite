/**
 * Created by xiao on 2017/11/4.
 */
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var historySchema = new Schema({
    resNum: String, // id
    content:String,//回复内容
    createdAt: { type: Date, default: Date.now },

    refreshedAt: { type: Date, default: Date.now }, // 更新时间
    isDeleted: { type: Boolean, default: false }, // 是否删除标识
    isShowing: { type: Boolean, default: true }, // 是否正在显示
    isTop: { type: Boolean, default: false }, // 是否置顶显示
})

var History = mongoose.model('History', historySchema)

module.exports = History
