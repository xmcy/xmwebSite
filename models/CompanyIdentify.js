var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var companySchema = new Schema({
    region: {}, // province, city, district
    name:  String, //公司名称
    num : String, //统一社会信用代码
    owner: String, //法人代表
    expired: String, //营业期限
    img: String, //营业执照照片
    status: String, //状态 审核中 审核通过 审核驳回
    rejectMsg: String, //审核驳回时的通知信息
    verifiedAt: Date, //认证日期
    createdAt: { type: Date, default: Date.now },
    user : {type: String, ref : 'User'},   // 关联的User
});

var CompanyIdentify = mongoose.model("CompanyIdentify", companySchema);

module.exports = CompanyIdentify;