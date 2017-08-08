/**
 * Created by xiao on 2017/7/6.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var complainSchema = new Schema({
    complainNum:String, // 投诉编号

    details: String, // 投诉内容

    tender: { type: String, ref: 'Tender' }, // 关联的招标

    targetUser: { type: String, ref: 'User' }, // 被投诉的User
    targetCompany: { type: String, ref: 'Company' }, // 被投诉的User
    user: { type: String, ref: 'User' }, // 投诉的User
    company: { type: String, ref: 'Company' }, // 投诉的User

    isSoluted:{ type: Boolean, default:false  },
    createdAt: { type: Date, default: Date.now },
});

var Complain = mongoose.model("Complain", complainSchema);

module.exports = Complain;