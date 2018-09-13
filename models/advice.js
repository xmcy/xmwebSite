/**
 * Created by xiao on 2017/11/4.
 */
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var adviceSchema = new Schema({
    adType: String, // 1:居民投诉 2:居民报修 3：居民建议
    resNum: String, // id

    resType: String, // 社区类别
    images: [], // 图片集合

    content: {type: String, default: ''}, //回复消息
    contacts: String, // 联系人
    phoneNum: String, // 联系电话
    details: String, // 详情
    detailPlace:String,//具体地点
    createdAt: { type: Date, default: Date.now },

    refreshedAt: { type: Date, default: Date.now }, // 更新时间
    isDeleted: { type: Boolean, default: false }, // 是否删除标识
    isShowing: { type: Boolean, default: true }, // 是否正在显示
    isTop: { type: Boolean, default: false }, // 是否置顶显示
})

var Advice = mongoose.model('Advice', adviceSchema)

module.exports = Advice
