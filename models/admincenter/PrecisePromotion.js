var mongoose = require('mongoose')
var Schema = mongoose.Schema

var promotionSchema = new Schema({
  title: {type: String, default: '精准推广服务'},

  period: String, // 推广周期 1季度、半年、1年
  promotionBegin: Date, // 推广开始时间 服务正式上线开始计时
  promotionEnd: Date, // 推广结束时间

  regions: [], // 推广的地区 地区数组
  category: {type: String, ref: 'ContentCategory'}, // 关联的一级栏目ID

  pubHistory: {type: String, ref: 'PubHistory'}, // 关联的资源表
  bill: {type: String, ref: 'Bill'}, // 关联的账单ID
  user: {type: String, ref: 'User'}, // 关联的User

  isShowing: { type: Boolean, default: true }, // 是否正在显示
  createdAt: { type: Date, default: Date.now }
})

promotionSchema.statics = {
  addNewPromotion: function (period, regions, category, pubHistory, bill, user, callBack) {
    var doc = {period: period, regions: regions, category: category, pubHistory: pubHistory, bill: bill, user: user}
    var promotion = new PrecisePromotion(doc)
    promotion.save(function (err) {
      callBack(err, promotion)
    })
  }
}

var PrecisePromotion = mongoose.model('PrecisePromotion', promotionSchema)

module.exports = PrecisePromotion
