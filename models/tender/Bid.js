var mongoose = require('mongoose')
var Schema = mongoose.Schema

// 投标数据模型

var bidSchema = new Schema({
    // 发布录入字段
    price: Number, // 报价
    details: String, // 详情
    depositRate: Number, // 支付定金比例
    serviceEnd: Date, // 交付截至时间
    contacts: String, // 联系人
    phoneNum: String, // 联系电话
    transactions: [{ type: String, ref: 'Transactions' }], // 关联的交易流水
    tender: { type: String, ref: 'Tender' }, // 关联的招标
    createdAt: { type: Date, default: Date.now },
    user: { type: String, ref: 'User' }, // 关联的User
    company: { type: String, ref: 'Company' }, // 关联的公司
})

var Bid = mongoose.model('Bid', bidSchema)

module.exports = Bid