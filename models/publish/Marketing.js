var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var marketingSchema = new Schema({
    region: {}, // province, city, district
    type: String, //策划类别
    originalPrice: Number, //原价
    discountPrice: Number, //则扣价格
    images: [], // 图片集合
    title: String, //标题
    contacts: String, //联系人
    phoneNum: String, //联系电话
    details: String, //详情
    createdAt: { type: Date, default: Date.now },
    user: {type: String, ref : 'User'},   // 关联的User
    category: {type: String, ref : 'ContentCategory'},//关联的资源类别
    refreshedAt: { type: Date, default: Date.now },//更新时间
    isDeleted: { type: Boolean, default: false }, //是否删除标识
    isShowing: { type: Boolean, default: true }, //是否正在显示
    isTop: { type: Boolean, default: false }, //是否置顶显示
    adsFrom: Date, //推广开始时间
    adsTo: Date,//推广截至时间    
});

var Marketing = mongoose.model("Marketing", marketingSchema);

module.exports = Marketing;