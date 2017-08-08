var mongoose = require('mongoose')
var Schema = mongoose.Schema

var inviteCodeSchema = new Schema({
  code: String, // 邀请码
  taskNum: { type: Number, default: 20 },
  invitedNum: { type: Number, default: 0 },
  finished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  user: {type: String, ref: 'User'}, // 关联的User
})

var InviteCode = mongoose.model('InviteCode', inviteCodeSchema)

module.exports = InviteCode
