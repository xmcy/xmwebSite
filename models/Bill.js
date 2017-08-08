var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var billsSchema = new Schema({
    billNum:String, // 账单编码yyyyyMMDDhhmmssXXXXX
    billName: String, // 商品名称 品牌推广服务、精准推广服务
    billType: String, // 商品类型 服务、商品
    payType: String, // 支付方式 微信支付、支付宝支付
    payInfo: {}, // 第三方支付返回的具体支付信息
    user: {type: String, ref : 'User'}, // 关联的User
    price: Number, // 价格
    billState: { type: String, default: '未支付' }, //未支付、已支付
    paidAt: Date, // 支付时间
    createdAt: { type: Date, default: Date.now },
});

var Bill = mongoose.model("Bill", billsSchema);

module.exports = Bill;