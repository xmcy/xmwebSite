var https = require('https')
var crypto = require('crypto')
var moment = require('moment')
var _ = require('lodash')
var shortid = require('shortid')
var SMS = require('../models/SMS')

// 说明：主账号，登陆云通讯网站后，可在控制台首页看到开发者主账号ACCOUNT SID
var accountSid = '8a216da8567745c001567febb21f088d'

// 说明：主账号Token，登陆云通讯网站后，可在控制台首页看到开发者主账号AUTH TOKEN
var accountToken = 'bc0db4903019410aa96ba351b7696346'

// 说明：请使用管理控制台中已创建应用的APPID
var appId = '8a216da8567745c001567febb26b0892'

// 说明：生成环境请求地址：app.cloopen.com
var serverIP = 'app.cloopen.com'

// 说明：请求端口 ，无论生产环境还是沙盒环境都为8883
var serverPort = '8883'

// 说明：REST API版本号保持不变
var softVersion = '2013-12-26'

function sendVerifyCodeSMS(to, tempId, cb) {
    var ts = moment().format('YYYYMMDDHHmmss')
    var sigStr = accountSid + accountToken + ts
    var sigParameter = crypto.createHash('md5').update(sigStr).digest('hex').toUpperCase()
    var auth = accountSid + ':' + ts

    var code = _.random(1000, 9999)

    var newObj = new SMS({ createdAt: ts, code: code, duration: 5, phoneNum: to })
    newObj.save(function(err) {
        if (err) {
            console.log(err)
            return
        }

        var postData = { to: to, appId: appId, templateId: tempId, datas: [code, 5] }
        var reqdata = JSON.stringify(postData)

        var options = {
            hostname: serverIP,
            port: serverPort,
            path: '/2013-12-26/Accounts/' + accountSid + '/SMS/TemplateSMS?sig=' + sigParameter,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
                'Content-Length': reqdata.length,
                'Authorization': new Buffer(auth).toString('base64')
            }
        }

        var req = https.request(options, function(res) {
            res.on('data', function(buffer) {
                // {"statusCode":"000000","templateSMS":{"smsMessageSid":"3661c73af9064ddda039e95ae0562037","dateCreated":"20170328133334"}}
                if (JSON.parse(buffer.toString()).statusCode == '000000') {
                    cb()
                } else {
                    cb({ msg: '发送验证码失败' })
                }
            })
        })

        req.write(reqdata)
        req.on('response', function(response) {
            req.end()
        })

        req.on('error', function(e) {
            console.log(new Error('problem with request: ' + e.message))
            req.end()
        })
    })
}

// /////////////////////////////////////////////////////////
// /////////////////////腾讯云短信接口///////////////////////
// ////////////////////////////////////////////////////////

// https://yun.tim.qq.com/v5/tlssmssvr/sendsms?sdkappid=xxxxx&random=xxxx
// var sig = sha256(appkey=$strAppKey&random=$strRand&time=$strTime&mobile=$strMobile)

// {
//     "tel": { //如需使用国际电话号码通用格式，如："+8613788888888" ，请使用sendisms接口见下注
//         "nationcode": "86", //国家码
//         "mobile": "13788888888" //手机号码
//     }, 
//     "sign": "腾讯云", //短信签名，如果使用默认签名，该字段可缺省
//     "tpl_id": 19, //业务在控制台审核通过的模板ID
//      //假定这个模板为：您的{1}是{2}，请于{3}分钟内填写。如非本人操作，请忽略本短信。
//     "params": [
//         "验证码", 
//         "1234", 
//         "4"
//     ], //参数，分别对应上面假定模板的{1}，{2}，{3}
//     "sig": "30db206bfd3fea7ef0db929998642c8ea54cc7042a779c5a0d9897358f6e9505", //app凭证，具体计算方式见下注
//     "time": 1457336869, //unix时间戳，请求发起时间，如果和系统时间相差超过10分钟则会返回失败
//     "extend": "", //通道扩展码，可选字段，默认没有开通(需要填空)。
//     //在短信回复场景中，腾讯server会原样返回，开发者可依此区分是哪种类型的回复
//     "ext": "" //用户的session内容，腾讯server回包中会原样返回，可选字段，不需要就填空。
// }

var sdkappid = '1400047966'
var appkey = '351a0db4702e0307679888707f520761'
var hostname = 'yun.tim.qq.com'

function getSig(mobile, time, random) {
    var sigStr = 'appkey=' + appkey + '&random=' + random + '&time=' + time + '&mobile=' + mobile
    var sig = crypto.createHash('sha256').update(sigStr).digest('hex')
    return sig
}

function postData(method, data, random, cb) {
    var reqdata = JSON.stringify(data)
    var buf = new Buffer(reqdata, 'utf8')

    var options = {
        hostname: hostname,
        path: '/v5/tlssmssvr/' + method + '?sdkappid=' + sdkappid + '&random=' + random,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Content-Length': buf.byteLength
        }
    }

    var req = https.request(options, function(res) {
        res.on('data', function(buffer) {
            // {
            //     "result": 0, //0表示成功(计费依据)，非0表示失败
            //     "errmsg": "OK", //result非0时的具体错误信息
            //     "ext": "", //用户的session内容，腾讯server回包中会原样返回
            //     "sid": "xxxxxxx", //标识本次发送id，标识一次短信下发记录
            //     "fee": 1 //短信计费的条数
            // }
            if (JSON.parse(buffer.toString()).result == 0) {
                cb()
            } else {
                cb({ msg: '发送验证码失败' })
            }
        })
    })

    req.write(buf)
    req.on('response', function(response) {
        req.end()
    })

    req.on('error', function(e) {
        console.log(new Error('problem with request: ' + e.message))
        req.end()
    })
}

// 发送验证码
// mobile: 目标手机号
// tempId: 模板Id
// duration: 验证码有效时间
// cb: 回掉函数
function sendVerifyCodeSMS_qcloud(mobile, tempId, duration, cb) {
    var code = _.random(1000, 9999)
    var ts = moment().format('YYYYMMDDHHmmss')

    var sms = new SMS({ createdAt: ts, code: code, duration: duration, phoneNum: mobile })
    sms.save(function(err) {
        if (err) {
            console.log(err)
            return
        }
        var time = Math.round(new Date().getTime() / 1000)
        var random = _.random(100000, 999999)
        var sig = getSig(mobile, time, random)
        var data = { tel: { nationcode: '86', mobile: mobile }, tpl_id: tempId, params: [code + '', duration + ''], sig: sig, time: time }

        postData('sendsms', data, random, cb)
    })
}

// 指定模板单发短信
// mobile: 目标手机号
// tempId: 模板Id
// params: 参数 无参数时直接传空
// cb: 回掉函数
function sendNotifySMS_qcloud(mobile, tempId, params, cb) {
    var time = Math.round(new Date().getTime() / 1000)
    var random = _.random(100000, 999999)
    var sig = getSig(mobile, time, random)
    var data = { tel: { nationcode: '86', mobile: mobile }, tpl_id: tempId, params: params, sig: sig, time: time }

    postData('sendsms', data, random, cb)
}

// 指定模板群发短信
// mobiles: 目标手机号
// tempId: 模板Id
// params: 参数 无参数时直接传空
// cb: 回掉函数
function sendNotifyMultiSMS_qcloud(mobiles, tempId, params, cb) {
    var time = Math.round(new Date().getTime() / 1000)
    var random = _.random(100000, 999999)
    var sig = getSig(mobiles.join(','), time, random)
    var tels = []
    for (var idx in mobiles) {
        tels.push({ nationcode: '86', mobile: mobiles[idx] })
    }
    var data = { tel: tels, tpl_id: tempId, params: params, sig: sig, time: time }

    postData('sendmultisms2', data, random, cb)
}


//53909     小区：{1}，具体地点：{2}，收到新的投诉建议，请您尽快处理！
//56717     普通短信	2017-11-14 12:07:40	报事建议回复	感谢您的报事建议，物业处理情况：{1}
//56718     普通短信	2017-11-14 12:11:30	用户填写报事建议后提醒收到	感谢您的报事建议，我们已经收到，物业工作人员正在处理中！

var exports = module.exports = {
    sendVerifyCodeSMS: sendVerifyCodeSMS,
    sendVerifyCodeSMS_qcloud: sendVerifyCodeSMS_qcloud,
    sendNotifySMS_qcloud: sendNotifySMS_qcloud,
    sendNotifyMultiSMS_qcloud: sendNotifyMultiSMS_qcloud,
    code27: 53909,
    code28: 53952,
    code29: 56717,
    code30: 56718

}