var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tenderBillsSchema = new Schema({
    billNum: String, // 账单编码yyyyyMMDDhhmmssXXXXX
    billType: String, // 订单类型 企业保证金、招标保证金、招标定金、招标尾款
    payType: String, // 支付方式 微信支付、支付宝支付
    targetId: String, // 目标数据表记录ID
    payInfo: {}, // 第三方支付返回的具体支付信息
    user: { type: String, ref: 'User' }, // 关联的User
    price: Number, // 价格
    billState: { type: String, default: '未支付' }, //未支付、已支付
    paidAt: Date, // 支付时间
    createdAt: { type: Date, default: Date.now },
});

var TenderBill = mongoose.model("TenderBill", tenderBillsSchema);

module.exports = TenderBill;