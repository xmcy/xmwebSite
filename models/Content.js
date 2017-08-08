/**
 * Created by Administrator on 2015/4/15.
 * 管理员用户组对象
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var shortid = require('shortid');
var ContentCategory = require('./ContentCategory');
var AdminUser = require('./AdminUser');
var ContentSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    contentNum:String,
    title:  String,
    category : { type : String , ref : 'ContentType'}, //文章类别
    sortPath : String, //存储所有父节点结构
    tags : String, // 描述
    keywords : String,
    oldAuthor : String,
    from : { type: String, default: '1' }, // 来源 1为原创 2为转载
    sImg : { type: String, default: "/upload/images/defaultImg.jpg" }, // 文章小图
    discription : String,
    isDeleted: { type: Boolean, default: false }, // 是否删除标识
    isTop: { type: Boolean, default: false }, // 是否置顶显示
    createdAt: { type: Date, default: Date.now },
    updateDate: { type: Date, default: Date.now }, // 更新时间
    author : { type: String , ref : 'AdminUser'}, // 文档作者
    clickNum : { type: Number, default: 1 }
});



ContentSchema.statics = {
//更新评论数
    updateCommentNum : function(contentId,key,callBack){
        Content.findOne({'_id' : contentId},'commentNum',function(err,doc){
            if(err){
                res.end(err)
            }
            if(key === 'add'){
                doc.commentNum = doc.commentNum + 1;
            }else if(key === 'del'){
                doc.commentNum = doc.commentNum - 1;
            }
            doc.save(function(err){
                if(err) throw err;
                callBack();
            })
        })
    }

};



var Content = mongoose.model("Content",ContentSchema);

module.exports = Content;

