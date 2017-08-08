var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var companySchema = new Schema({
    region: {}, // province, city, district
    address: String, // 不包含省市区的详细地址
    companyName: String,
    companyLogo: { type: String, default: 'https://cdn.adquan.net/images/def-img/company-logo.png' },
    contacts: String, // 联系人
    phoneNum: String,
    email: String,
    qq: String,
    businessScope: [], // 经营范围
    companyDes: String, // 公司简介
    homePageBanner: [], // 企业首页banner图片格式[{img: '', resId: ''}, {img: '', resId}]
    homePageBody: [], // 企业首页body图片格式[{img: '', resId: ''}, {img: '', resId}]

    depositAccount: { type: Number, default: 0 }, // 企业保证金 只有缴纳了保证金的企业才能参与投标
    cashAccount: { type: Number, default: 0 }, // 现金账户 企业接单收入存在这个账户中
    withdrawAccount: [], // 提现账号[{type:'alipay', account:''}, {type:'wxpay', account:''}] 目前支持支付宝账号提现

    // 企业综合评分 后台跑服务每周更新一次
    quality: { type: Number, default: 5 },
    describe: { type: Number, default: 5 },
    attitude: { type: Number, default: 5 },
    speed: { type: Number, default: 5 },

    user: { type: String, ref: 'User' }, // 关联的User
    createdAt: { type: Date, default: Date.now },
});

var Company = mongoose.model("Company", companySchema);

module.exports = Company;