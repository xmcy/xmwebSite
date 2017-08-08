var mongoose = require('mongoose')
var Schema = mongoose.Schema

// 交易流水数据模型

var transSchema = new Schema({
    transNum: String, // 流水号
    transType: String, // 交易项目 企业保证金、招标保证金、招标定金、招标尾款、定金尾款提现、保证金提现
    price: Number, // 价格
    payType: String, // 支付方式 微信支付、支付宝支付
    payInfo: {}, // 第三方支付返回的具体支付信息
    refund: { type: Boolean, default: false }, // 是否退款或提现

    createdAt: { type: Date, default: Date.now },
    user: { type: String, ref: 'User' }, // 关联的User
})

var Transactions = mongoose.model('Transactions', transSchema)

module.exports = Transactions