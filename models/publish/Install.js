var mongoose = require('mongoose')
var Schema = mongoose.Schema

var installSchema = new Schema({
    name: String, // 姓名
    phoneNum: String,
    title: String, // 标题
    details: String, // 详情
    serviceRegion: {}, // 服务地区province, city, district
    pageview: { type: Number, default: 0 },
    user: { type: String, ref: 'User' }, // 关联的User
    isShowing: { type: Boolean, default: true }, //是否正在显示
    isDeleted: { type: Boolean, default: false }, // 是否删除标识
    createdAt: { type: Date, default: Date.now },
    refreshedAt: { type: Date, default: Date.now }, // 更新时间
})

var Install = mongoose.model('Install', installSchema)

module.exports = Install