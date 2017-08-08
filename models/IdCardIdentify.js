var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var idCardSchema = new Schema({
    realName:  String,
    idCardNum : String,
    frontImg: String, //身份证正面
    backImg: String, //身份证反面
    status: String, //状态 审核中 审核通过 审核驳回
    rejectMsg: String, //审核驳回时的通知信息
    verifiedAt: Date, //认证日期
    createdAt: { type: Date, default: Date.now },
    user : {type: String, ref : 'User'},   // 关联的User
});

var IdCardIdentify = mongoose.model("IdCardIdentify", idCardSchema);

module.exports = IdCardIdentify;