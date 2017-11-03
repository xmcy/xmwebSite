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

var sdkappid = '1400032545'
var appkey = 'affa35660c6808fa9b839d00aae244dc'
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

// 30176	普通短信	2017-07-24 11:24:42	定金尾款提取提醒	   您已提取本次投标定金和尾款{1}元，预期到账时间{2}个工作日，感谢您使用幸福天地招投标系统，幸福天地因为有你而精彩，欢迎再次使用
// 30160	普通短信	2017-07-24 10:48:39	提醒招标方去进行评价	 成功支付尾款{1}元，赶快去对服务商进行评价吧，真实准确的评价将帮助我们建立公平竞争的大环境，幸福天地因为有你而精彩，欢迎再次使用	
// 30151	营销短信	2017-07-24 10:35:20	注册欢迎短信	        感谢注册幸福天地，幸福天地是目前国内唯一一家广告制作服务平台，广告制作大佬们都在幸福天地上找制作、找安装、找设备、找材料，更有在线招投标系统，让门店少花钱，厂家多赚钱。回T退订
// 29126	普通短信	2017-07-14 17:40:45	提醒管理员	          收到新的{1}，请尽快处理
// 28576	普通短信	2017-07-12 15:05:50	收到企业评价提醒	  收到新的企业评价，请登陆系统查看
// 28417	普通短信	2017-07-11 17:07:24	通知被投诉方	        {1}对招标编号为{2}的招标发起了投诉，投诉内容：{3}
// 27697	普通短信	2017-07-06 18:26:18	提醒投标方招标关闭	 招标方因为{1}导致招标自动关闭，平台将以事实为依据判定违约方，您可以对此次招标进行投诉，如有疑问请联系在线客服
// 27638	普通短信	2017-07-06 15:03:54	提醒投标方招标关闭	 招标方因为{1}导致招标自动关闭，平台判定招标方违约，您可以对此次招标进行投诉，如有疑问请联系在线客服
// 27635	普通短信	2017-07-06 14:58:28	违约提醒	          您的招标因为{1}而关闭，平台判定您违约，每个自然月违约{2}次后当月将不能再次发起招标，如有疑问请联系在线客服
// 27629	普通短信	2017-07-06 14:46:53	没选标违约提醒	       您的招标因为没有及时选标而关闭，收到的投标数量达到了预期数量，平台判定您违约，每个自然月违约{1}次后当月将不能再次发起招标
// 27036	普通短信	2017-07-03 18:40:34	定金支付成功提醒	    成功支付定金{1}元，服务商已经开始工作，最晚将于{2}完成制作交付，请及时关注进度
// 26965	普通短信	2017-07-03 14:54:28	验收通过提醒	        您的交付已通过招标方验收，等待招标方支付尾款{1}元
// 26932	普通短信	2017-07-03 12:05:07	投标时间截至通知	    您的招标已截至投标，共收到{1}个投标，请在{2}前选择中标方，中标方将在您支付定金后开始生产制作
// 26925	普通短信	2017-07-03 11:38:30	招标关闭提醒	        您的招标因为{1}而自动关闭，平台将以事实为依据进行判定违约方	
// 26964	普通短信	2017-07-03 11:19:16	通知投标方尾款已支付	 招标方已缴纳尾款{1}元，现在您可以去企业中心-我的投标中提取定金和尾款共{2}元
// 26918	普通短信	2017-07-03 11:14:36	交货时间提醒	        您的投标交货时间还剩{1}天，请按时交货	
// 26914	普通短信	2017-07-03 11:07:33	保证金原路退回提醒	    您的{1}{2}元已原路退回，请注意查收，具体到账时间以微信或支付宝官方通知为准	
// 26902	普通短信	2017-07-03 10:29:51	没有服务商投标通知	    很遗憾您的招标没有服务商投标，招标已自动关闭，您可以放宽地区限制或缴纳招标保证金，吸引服务商主动投标	
// 26899	普通短信	2017-07-03 10:23:58	通知中标方已收到定金	 招标方已缴纳定金{1}元，请及时安排生产，最迟交货时间为{2}，提前交货将会给客户留下更好的印象	
// 26886	普通短信	2017-07-03 10:16:41	中标通知	            您已中标，等待招标方缴纳定金{1}元，招标方如未按时缴纳定金将会被视为违约，将会受到平台相应的处罚	
// 26882	普通短信	2017-07-03 10:09:28	收到投标通知	        收到新的投标，当前招标已收到{1}个投标，投标截至时间为{2}	
// 26876	普通短信	2017-07-03 10:01:59	投标通知	            您收到新的{1}邀请，描述如下{2}，95%的投标方会在1个小时内完成投标，请及时投标赢得订单	
// 23445	普通短信	2017-06-09 14:25:37	实名及营业执照认证提醒	您的{1}审核状态变更为{2}，请登录网页端查看详情	
// 22497	普通短信	2017-06-02 17:25:04	发送验证码	            您的验证码为{1}，请于{2}分钟内正确输入，如非本人操作，请忽略此短信	
// 22453	普通短信	2017-06-02 14:50:40	订单生成提醒	        您的{1}订单已生成，请及时支付，如有疑问请联系在线客服	
// 22451	普通短信	2017-06-02 14:49:18	发送注册邀请码	        您的注册邀请码为{1}，您可在个人中心-我的活动中查看完成情况，如有疑问请联系在线客服	
var exports = module.exports = {
    sendVerifyCodeSMS: sendVerifyCodeSMS,
    sendVerifyCodeSMS_qcloud: sendVerifyCodeSMS_qcloud,
    sendNotifySMS_qcloud: sendNotifySMS_qcloud,
    sendNotifyMultiSMS_qcloud: sendNotifyMultiSMS_qcloud,
    code1: 26932,
    code2: 26925,
    code3: 30160,
    code4: 30176,
    code5: 26964,
    code6: 26918,
    code7: 26914,
    code8: 26902,
    code9: 26899,
    code10: 26886,
    code11: 26882,
    code12: 26876,
    code13: 23445,
    code14: 22497,
    code15: 22453,
    code16: 22451,
    code17: 26965,
    code18: 27036,
    code19: 30151,
    code20: 27629,
    code21: 27635,
    code22: 27638,
    code23: 27697,
    code24: 28417,
    code25: 28576,
    code26: 29126
}