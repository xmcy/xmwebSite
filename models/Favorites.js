var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var materialSchema = new Schema({
    type: String, //收藏的类别 zy:资源、qk:期刊、sp:商铺、xq:需求.zb:招标
    title: String, //标题
    url: String, //收藏对象不包含域名的url路径
    createdAt: { type: Date, default: Date.now },
    user: {type: String, ref : 'User'},   // 关联的User
});

var Favorites = mongoose.model("Favorites", materialSchema);

module.exports = Favorites;