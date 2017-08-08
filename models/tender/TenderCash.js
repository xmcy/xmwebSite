/**
 * Created by xiao on 2017/7/3.
 */
var mongoose = require('mongoose')
var Schema = mongoose.Schema

// 提现数据模型

var TenderCashSchema = new Schema({
    billNum: String, // 账单编码yyyyyMMDDhhmmssXXXXX
    payType: String, // 提现方式 微信、支付宝
    targetId: { type: String, ref: 'Tender' }, // 关联的招标

    price: Number, // 价格
    status:{ type: Number, default: 1, enum: [1, 2, 3] }, //状态类型 1: 请求提现，2: 审核中，3：提现完成
    createdAt: { type: Date, default: Date.now },
    user: { type: String, ref: 'User' }, // 关联的User
    company: { type: String, ref: 'Company' }, // 关联的User
})

var TenderCash = mongoose.model('TenderCash', TenderCashSchema)

module.exports = TenderCash