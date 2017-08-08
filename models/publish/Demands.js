var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var demandsSchema = new Schema({
    resNum:String,//id
    region: {}, // province, city, district
    classify: String, //行业
    categoryL1: {type: String, ref : 'ContentCategory'},//关联的资源一级类目
    categoryL2: {type: String, ref : 'ContentCategory'},//关联的资源二级类目
    price: Number, //预算
    title: String, //标题
    contacts: String, //联系人
    phoneNum: String, //联系电话
    details: String, //详情
    pageview: Number, //浏览量
    createdAt: { type: Date, default: Date.now },
    user: {type: String, ref : 'User'},   // 关联的User
    refreshedAt: { type: Date, default: Date.now },//更新时间
    isDeleted: { type: Boolean, default: false }, //是否删除标识
    isShowing: { type: Boolean, default: true }, //是否正在显示
});

var Demands = mongoose.model("Demands", demandsSchema);

module.exports = Demands;