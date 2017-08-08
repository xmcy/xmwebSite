var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var materialSchema = new Schema({
    resNum:String,//id
    region: {}, // province, city, district
    supplyRegions: [], //供货区域
    type: {type: String, ref : 'ContentCategory'}, //材料类别
    brand: String, //材料品牌
    freightType: String, //运费支付方式
    originalPrice: Number, //原价
    discountPrice: Number, //则扣价格
    images: [], // 图片集合
    title: String, //标题
    contacts: String, //联系人
    phoneNum: String, //联系电话
    details: String, //详情
    pageview: Number, //浏览量
    createdAt: { type: Date, default: Date.now },
    user: {type: String, ref : 'User'},   // 关联的User
    resType: {type: String, default : 'Material'},//资源类别标识
    category: {type: String, ref : 'ContentCategory'},//关联的资源类别
    refreshedAt: { type: Date, default: Date.now },//更新时间
    isDeleted: { type: Boolean, default: false }, //是否删除标识
    isShowing: { type: Boolean, default: true }, //是否正在显示
    isTop: { type: Boolean, default: false }, //是否置顶显示
    adsFrom: Date, //推广开始时间
    adsTo: Date,//推广截至时间    
});

var Material = mongoose.model("Material", materialSchema);

module.exports = Material;