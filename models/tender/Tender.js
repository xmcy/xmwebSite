var mongoose = require('mongoose')
var Schema = mongoose.Schema

// 招标数据模型

var tenderSchema = new Schema({
    tenderNum: String, // 招标编号
    // 发布录入字段
    categoryL1: { type: String, ref: 'ContentCategory' }, // 关联的一级栏目ID
    categoryL2: { type: String, ref: 'ContentCategory' }, // 关联的二级栏目ID
    title: String, // 标题
    details: String, // 详情
    files: [], // 文件集合
    region: {}, // province, city, district 招标区域
    blackList: [{ type: String, ref: 'Company' }], // 屏蔽服务商
    inviteList: [{ type: String, ref: 'Company' }], // 邀请服务商
    tenderEnd: Date, // 投标截至时间 最少1小时 最长48小时
    serviceEnd: Date, // 服务商交付截至时间
    deposit: Number, // 保证金 最大2000元对应25个投标
    tenderType: { type: Number, enum: [1, 2] }, // 招标方式 1: 公开招标，2: 邀请招标
    hasDesign: Boolean, // 是否有设计稿
    needInstall: Boolean, // 是否需要安装
    contacts: String, // 联系人
    phoneNum: String, // 联系电话
    qq: String, // 联系qq

    // 招标状态管理
    // 状态类型 1: 发布招标，2: 选择服务商，3：缴纳定金，4：制作验收，5：缴纳尾款，6：评价
    status: { type: Number, default: 1, enum: [1, 2, 3, 4, 5, 6] },
    bidderLimit: { type: Number, default: 5 }, // 投标人数量限制 保证金缴纳越多投标人数量越大 保证金÷100+5
    isCanceled: { type: Boolean, default: false }, // 是否取消招标
    cancelDetail: String, // 招标取消原因

    // 投标人管理
    bidders: [{ type: String, ref: 'Bid' }], // 收到的投标
    chosenBidder: { type: String, ref: 'Bid' }, // 中标
    bidderUsers: [{ type: String, ref: 'User' }], // 收到的投标人
    chosenBidderUser: { type: String, ref: 'User' }, // 中标人

    // 钱管理
    transactions: [{ type: String, ref: 'Transactions' }], // 关联的交易流水
    downpayment: Number, // 支付定金金额
    finalpayment: Number, // 支付尾款金额

    tenderComplain:{ type: String, ref: 'Complain' },   //招标人发起投诉
    bidderComplain:{ type: String, ref: 'Complain' },   //投标人发起投诉
    
    withdrawDeposit:{ type: Number, default: 1, enum: [1, 2, 3] },//提现状态1: 未提现，2: 审核中，3：提现完成
    // 时间管理
    timeRcdStep1: { type: Date, default: Date.now }, // 第一步时间记录
    timeRcdStep2: Date, // 第二步时间记录
    timeRcdStep3: Date, // 第三步时间记录
    timeRcdStep4: Date, // 第四步时间记录
    timeRcdStep5: Date, // 第五步时间记录
    timeRcdStep6: Date, // 第六步时间记录

    pageview: { type: Number, default: 0 }, // 浏览量
    createdAt: { type: Date, default: Date.now },

    user: { type: String, ref: 'User' }, // 关联的User
    company: { type: String, ref: 'Company' }, // 关联的公司
})

var Tender = mongoose.model('Tender', tenderSchema)

module.exports = Tender