var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var outdoorSchema = new Schema({
    region: {}, // province, city, district
    location: [], //经纬度坐标
    type: String, //户外类别
    peopleFlow: Number, //人流
    carFlow: Number, //车流
    size: {}, //媒体规格 长 宽 面
    price: Number, //执行价格
    lighting: String, //照明类型
    deliveryTime: String, //最早投放日期
    deliveryUnit: String, //最小投放周期
    proxy: String, //代理方式
    propertyExpire: Date, //产权到期
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

var Outdoor = mongoose.model("Outdoor", outdoorSchema);

module.exports = Outdoor;