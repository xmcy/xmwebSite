var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var scoreSchema = new Schema({
    // 产品质量 描述相符 服务态度 交付速度
    quality: Number,
    describe: Number,
    attitude: Number,
    speed: Number,
    total: Number,
    anonymous: { type: Boolean, default: false },
    images: [], // 评价图片
    details: String, // 评价内容
    returnDetail:String,

    tender: { type: String, ref: 'Tender' }, // 关联的招标

    targetUser: { type: String, ref: 'User' }, // 被评价的User
    user: { type: String, ref: 'User' }, // 评价的User
    company: { type: String, ref: 'Company' }, // 关联的公司
    createdAt: { type: Date, default: Date.now },
});

var Score = mongoose.model("Score", scoreSchema);

module.exports = Score;