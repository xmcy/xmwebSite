var config = require('../config')
var CryptoJS = require('../libs/crypto')

var appid = config.appid
var bucket = config.bucket
var sid = config.sid
var skey = config.skey

var getSignature = function (once, fileid) {
  var that = this
  var random = parseInt(Math.random() * Math.pow(2, 32))
  var now = parseInt(new Date().getTime() / 1000)
  var e = now + 60; // 签名过期时间为当前+60s
  var path = ''; // 多次签名这里填空
  if (once) {
    e = 0 // 单次签名 expire==0
    path = fileid
  }

  var str = 'a=' + appid + '&k=' + sid + '&e=' + e + '&t=' + now + '&r=' + random +
    '&f=' + path + '&b=' + bucket
  var sha1Res = CryptoJS.HmacSHA1(str, skey)
  var strWordArray = CryptoJS.enc.Utf8.parse(str)
  var resWordArray = sha1Res.concat(strWordArray)
  var res = resWordArray.toString(CryptoJS.enc.Base64)
  return res
}

function getAppSign () { // 获取签名 必填参数
  return getSignature(false)
}

// fileid ，唯一标识存储资源的相对路径。格式为 /appid/bucketname/dirname/[filename]，
// 并且需要对其中非 '/' 字符进行 UrlEncode 编码。 当操作对象为文件夹时，filename 缺省，filename 中要包含文件后缀名。
function getAppSignOnce (fileid) { // 单次签名，必填参数
  return getSignature(true, fileid)
}

module.exports = {
  getAppSign: getAppSign,
  getAppSignOnce: getAppSignOnce
}
