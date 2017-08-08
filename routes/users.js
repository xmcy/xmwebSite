var express = require('express')
var router = express.Router()
var url = require('url')
var request=require('request')

var _ = require('lodash')
var mongoose = require('mongoose')
var https=require('https')
// 验证
var validator = require('validator')
    // 文章类别对象
var ContentCategory = require('../models/ContentCategory')
    // 用户实体类
var User = require('../models/User')
var WxCheck = require('../models/WxCheck')
var AdminUser = require('../models/AdminUser')
    // 留言实体类
var Message = require('../models/Message')
    // 文档对象
var Content = require('../models/Content')
    // 数据库操作对象
var DbOpt = require('../models/Dbopt')

var IdCardIdentify = require('../models/IdCardIdentify')
var CompanyIdentify = require('../models/CompanyIdentify')
var PubHistory = require('../models/publish/PubHistory')
var Demands = require('../models/publish/Demands')
var Favorites = require('../models/Favorites')
var Company = require('../models/Company')
var PrecisePromotion = require('../models/admincenter/PrecisePromotion')
var InviteCode = require('../models/activity/InviteCode')
var settings = require('../models/db/settings')

var qr = require('qr-image')

// 加密类
var crypto = require('crypto')
    // 系统相关操作
var system = require('../util/system')
    // 时间格式化
var moment = require('moment')
    // 站点配置
var siteFunc = require('../models/db/siteFunc')
var shortid = require('shortid')
    // 数据校验
var filter = require('../util/filter')
    // 系统消息
var UserNotify = require('../models/UserNotify')
var Notify = require('../models/Notify')

var SMS = require('../models/SMS')
var smsUtils = require('../util/smsUtils')
var signUtils = require('../util/signUtils')

var config = require('../config')

var returnUsersRouter = function(io) {

    // 校验是否登录
    function isLogined(req) {
        return req.session.logined
    }


    // 用户登录
    router.get('/login', function(req, res, next) {
        if (isLogined(req)) {
            res.redirect('home')
                // siteFunc.renderToTargetPageByType(req, res, 'userHome', {title: '主页',page: 'userHome'})
        } else {
            siteFunc.renderToTargetPageByType(req, res, 'userLogin', { title: '用户登录', page: 'userLogin' })
        }
    })

    // y用户访问首页
    router.get('/home', function(req, res, next) {
        siteFunc.renderToTargetPageByType(req, res, 'userHome', { title: '主页', page: 'userHome' })
    })

    router.get('/home2', function(req, res, next) {
        siteFunc.renderToTargetPageByType(req, res, 'userHome2', { title: '主页', page: 'userHome2' })
    })

    // 用户注册
    router.get('/reg', function(req, res, next) {
        siteFunc.renderToTargetPageByType(req, res, 'userReg', { title: '用户注册', page: 'userReg' })
    })

    router.get('/helperCenter', function(req, res, next) {
        siteFunc.renderToTargetPageByType(req, res, 'helperCenter', { title: '帮助中心', page: 'helperCenter' })
    })

    // 用户登录提交请求
    router.post('/doLogin', function(req, res, next) {
        var userName = req.body.userName
        var password = req.body.password
        var autologin = req.body.autologin
        var errors
        var newPsd = DbOpt.encrypt(password, settings.encrypt_key)

        if (!validator.isPsd(password) || !validator.isLength(password, 6, 12)) {
            errors = '密码6-12个字符'
        }
        if (errors) {
            res.end(errors)
        } else {
            User.findOne({ $or: [{ phoneNum: userName, password: newPsd }, { email: userName, password: newPsd }] }, function(err, user) {
                if (user) {
                    // 将cookie存入缓存
                    if (autologin == 'false') {
                        filter.gen_sessionForOneDay(user, res)
                    } else {
                        filter.gen_session(user, res)
                    }
                    res.end('success')
                } else {
                    res.end('用户名或密码错误！')
                }
            })
        }
    })

    // 电话号码登录
    router.post('/doLoginWithVC', function(req, res, next) {
        var errors
        var phoneNum = req.body.phoneNum
        var code = req.body.code
        var autologin = req.body.autologin

        if (!validator.isNumeric(phoneNum) || phoneNum.length != 11 || !validator.isNumeric(code)) {
            errors = '电话号码或验证码无效'
        }
        if (errors) {
            res.end(errors)
        } else {
            // 校验短信验证码
            SMS.findOne({ phoneNum: phoneNum }, function(err, sms) {
                if (err) {
                    res.end(err)
                } else {
                    if (!_.isEmpty(sms)) {
                        var createdAt = moment(sms.createdAt, 'YYYYMMDDHHmmss')
                        var exp = createdAt.add(sms.duration, 'minutes')
                        if (sms.code == code) {
                            if (moment().isBefore(exp)) {
                                User.findOne({ phoneNum: phoneNum }, function(err, user) {
                                    if (user) {
                                        // 将cookie存入缓存
                                        if (autologin == 'false') {
                                            filter.gen_sessionForOneDay(user, res)
                                        } else {
                                            filter.gen_session(user, res)
                                        }
                                        sms.remove(function(err) {})
                                        res.end('success')
                                    } else {
                                        res.end('登陆失败')
                                    }
                                })
                            } else {
                                sms.remove(function(err) {})
                                res.end('验证码已过期')
                            }
                        } else {
                            res.end('验证码错误')
                        }
                    } else {
                        res.end('电话号码或验证码无效')
                    }
                }
            }).sort({ createdAt: -1 }).limit(1)
        }
    })

    // 电话号码注册
    router.post('/doRegWithPhoneNum', function(req, res, next) {
        var errors
        var phoneNum = req.body.phoneNum
        var code = req.body.code
        var password = req.body.password
        var inviteCode = req.body.inviteCode

        // 数据校验
        if (!validator.isNumeric(phoneNum) || phoneNum.length != 11 || !validator.isNumeric(code)) {
            errors = '电话号码或验证码无效'
        }
        if (!validator.isPsd(password) || !validator.isLength(password, 6, 12)) {
            errors = '密码6-12位，只能包含字母、数字和下划线'
        }
        if (errors) {
            res.end(errors)
        } else {
            // 校验短信验证码
            SMS.findOne({ phoneNum: phoneNum }, function(err, sms) {
                if (err) {
                    res.end(err)
                } else {
                    if (!_.isEmpty(sms)) {
                        var createdAt = moment(sms.createdAt, 'YYYYMMDDHHmmss')
                        var exp = createdAt.add(sms.duration, 'minutes')
                        if (sms.code == code) {
                            if (moment().isBefore(exp)) {
                                var userName = shortid.generate()
                                password = DbOpt.encrypt(password, settings.encrypt_key)
                                var doc = { userName: userName, password: password, phoneNum: phoneNum, phoneNumVerified: true }
                                if (!_.isUndefined(inviteCode) && validator.isNumeric(inviteCode)) {
                                    doc.inviteCode = inviteCode
                                    InviteCode.findOneAndUpdate({ code: inviteCode }, { $inc: { invitedNum: 1 } }, function(err, res) {
                                        if(!_.isEmpty(res)){
                                            if (res.invitedNum >= 20) {
                                                res.finished = true
                                                res.save(function(err) {})
                                            }
                                        }
                                    })
                                }
                                var newUser = new User(doc)
                                newUser.save(function(err) {
                                    if (err) {
                                        res.end(err)
                                    } else {
                                        sms.remove(function(err) {})
                                        var comany = new Company({ user: newUser._id, companyName: shortid.generate() })
                                        comany.save(function(err) {
                                            if (err) {
                                                res.end(err)
                                            } else {
                                                newUser.company = comany._id
                                                newUser.save(function(err) {
                                                    filter.gen_session(newUser, res)

                                                    // 发送欢迎短信
                                                    smsUtils.sendNotifySMS_qcloud(phoneNum, smsUtils.code19, [], function(err) {})
                                                    res.json({ result: 'success', user: newUser._id })
                                                })
                                            }
                                        })
                                    }
                                })
                            } else {
                                sms.remove(function(err) {})
                                res.end('验证码已过期')
                            }
                        } else {
                            res.end('验证码错误')
                        }
                    } else {
                        res.end('电话号码或验证码无效')
                    }
                }
            }).sort({ createdAt: -1 }).limit(1)
        }
    })

    // /发送验证码
    router.post('/sendVerifyCode', function(req, res, next) {
        var errors
        var phoneNum = req.body.phoneNum
        var postType = req.body.postType
        if (!validator.isNumeric(phoneNum) || phoneNum.length != 11) {
            errors = '电话号码或验证码无效'
        }
        if (errors) {
            res.end(errors)
        } else {
            User.findOne({ phoneNum: phoneNum }, function(err, user) {
                if (err) {
                    res.end(err)
                } else {
                    if (postType == 'reg' || postType == 'bind') {
                        if (_.isEmpty(user)) {
                            smsUtils.sendVerifyCodeSMS_qcloud(phoneNum, 22497, 30, function(err) {
                                if (err) {
                                    res.end(err)
                                } else {
                                    res.end('success')
                                }
                            })
                        } else {
                            res.end('手机号码已被注册')
                        }
                    } else {
                        if (!_.isEmpty(user)) {
                            smsUtils.sendVerifyCodeSMS_qcloud(phoneNum, 22497, 30, function(err) {
                                if (err) {
                                    res.end(err)
                                } else {
                                    res.end('success')
                                }
                            })
                        } else {
                            res.end('手机号码未注册')
                        }
                    }
                }
            })
        }
    })

    // /发送验证码(手机)
    router.post('/sendVerifyCodeByPhone', function(req, res, next) {
        var errors
        var phoneNum = req.body.phoneNum
        var postType = req.body.postType
        if (!validator.isNumeric(phoneNum) || phoneNum.length != 11) {
            errors = '电话号码或验证码无效'
        }
        if (errors) {
            res.end(errors)
        } else {
            User.findOne({ phoneNum: phoneNum }, function(err, user) {
                if (err) {
                    res.end(err)
                } else {
                    if (postType == 'reg' || postType == 'bind') {
                        if (_.isEmpty(user)) {
                            smsUtils.sendVerifyCodeSMS_qcloud(phoneNum, 22497, 30, function(err) {
                                if (err) {
                                    res.json({ msg: err })
                                } else {
                                    res.json({ id: user.id, result: 'success' })
                                }
                            })
                        } else {
                            res.json({ msg: '手机号码已被注册' })
                        }
                    } else {
                        if (!_.isEmpty(user)) {
                            smsUtils.sendVerifyCodeSMS_qcloud(phoneNum, 22497, 30, function(err) {
                                if (err) {
                                    res.end(err)
                                } else {
                                    res.json({ user: user.id, result: 'success' })
                                }
                            })
                        } else {
                            res.json({ msg: '手机号码未注册' })
                        }
                    }
                }
            })
        }
    })

    // 手机注册发验证码
    router.post('/sendVerifyCodeByPhoneRegister', function(req, res, next) {
        var errors
        var phoneNum = req.body.phoneNum
        var postType = req.body.postType
        if (!validator.isNumeric(phoneNum) || phoneNum.length != 11) {
            errors = '电话号码或验证码无效'
        }
        if (errors) {
            res.end(errors)
        } else {
            User.findOne({ phoneNum: phoneNum }, function(err, user) {
                if (err) {
                    res.end(err)
                } else {
                    if (postType == 'reg' || postType == 'bind') {
                        if (_.isEmpty(user)) {
                            smsUtils.sendVerifyCodeSMS_qcloud(phoneNum, 22497, 30, function(err) {
                                if (err) {
                                    res.json({ msg: err })
                                } else {
                                    res.json({ result: 'success' })
                                }
                            })
                        } else {
                            res.json({ msg: '手机号码已被注册' })
                        }
                    } else {
                        if (!_.isEmpty(user)) {
                            smsUtils.sendVerifyCodeSMS_qcloud(phoneNum, 22497, 30, function(err) {
                                if (err) {
                                    res.end(err)
                                } else {
                                    res.json({ user: user.id, result: 'success' })
                                }
                            })
                        } else {
                            res.json({ msg: '手机号码未注册' })
                        }
                    }
                }
            })
        }
    })

    // 根据手机号码直接发送验证码
    router.post('/sendVerifyCodeDirect', function(req, res, next) {
        var errors
        var phoneNum = req.body.phoneNum
        if (!validator.isNumeric(phoneNum) || phoneNum.length != 11) {
            errors = '电话号码或验证码无效'
        }
        if (errors) {
            res.end(errors)
        } else {
            smsUtils.sendVerifyCodeSMS_qcloud(phoneNum, 22497, 30, function(err) {
                if (err) {
                    res.end(err)
                } else {
                    res.end('success')
                }
            })
        }
    })

    // 单独验证验证码接口
    router.post('/checkVerifyCode', function(req, res, next) {
        var errors
        var phoneNum = req.body.phoneNum
        var code = req.body.code
        var postType = req.body.postType

        req.session.isVcChecked = false
            // 数据校验
        if (!validator.isNumeric(phoneNum) || phoneNum.length != 11 || !validator.isNumeric(code)) {
            errors = '电话号码或验证码无效'
        }
        if (errors) {
            res.end(errors)
        } else {
            // 校验短信验证码
            SMS.findOne({ phoneNum: phoneNum }, function(err, sms) {
                if (err) {
                    res.end(err)
                } else {
                    if (!_.isEmpty(sms)) {
                        var createdAt = moment(sms.createdAt, 'YYYYMMDDHHmmss')
                        var exp = createdAt.add(sms.duration, 'minutes')
                        if (sms.code == code) {
                            sms.remove(function(err) {})
                            if (moment().isBefore(exp)) {
                                if (postType == 'bind') {
                                    req.session.isVcBindChecked = true
                                    req.session.newPhoneNum = phoneNum
                                } else {
                                    req.session.isVcChecked = true
                                }
                                res.end('success')
                            } else {
                                res.end('验证码已过期')
                            }
                        } else {
                            res.end('验证码错误')
                        }
                    } else {
                        res.end('电话号码或验证码无效')
                    }
                }
            }).sort({ createdAt: -1 }).limit(1)
        }
    })

    // 完成手机号码解绑并绑定新号码
    router.post('/bindNewPhoneNum', function(req, res, next) {
        var newPhoneNum = req.session.newPhoneNum
        var su = req.session.user
        if (_.isEmpty(su)) {
            res.end(settings.system_illegal_param)
        } else {
            if (req.session.isVcChecked && req.session.isVcBindChecked &&
                (validator.isNumeric(newPhoneNum) && newPhoneNum.length == 11)) {
                User.findOne({ _id: req.session.user._id }, function(err, user) {
                    if (err) {
                        res.end(err)
                    } else {
                        if (_.isEmpty(user)) {
                            res.end(settings.system_illegal_param)
                        } else {
                            user.phoneNum = newPhoneNum
                            user.save(function(err) {
                                if (err) {
                                    res.end(err)
                                } else {
                                    res.end('success')
                                }
                            })
                        }
                    }
                })
            } else {
                res.end(settings.system_illegal_param)
            }
        }
    })

    router.get('/getPrivateImg', function(req, res, next) {
            var su = req.session.user
            if (_.isEmpty(su)) {
                res.end(settings.system_illegal_param)
            } else {
                res.end(req.session.user.avatar)
            }
        })
        // 更新头像
    router.post('/setAvatar', function(req, res, next) {
        var errors
        var avatar = req.body.avatar
        if (!validator.isURL(avatar)) {
            errors = '更新头像失败'
        }
        var su = req.session.user
        if (_.isEmpty(su)) {
            res.end(settings.system_illegal_param)
        } else {
            if (errors) {
                res.end(errors)
            } else {
                User.findOne({ _id: req.session.user._id }, function(err, user) {
                    if (err) {
                        res.end(err)
                    } else {
                        if (_.isEmpty(user)) {
                            res.end('更新头像失败')
                        } else {
                            avatar = avatar.replace(config.cosgzHost, config.cdnHost)
                            user.avatar = avatar
                            req.session.user.avatar = avatar
                            user.save(function(err) {
                                if (err) {
                                    res.end(err)
                                } else {
                                    res.end('success')
                                }
                            })
                        }
                    }
                })
            }
        }
    })

    // 获取COS签名接口，大多数情况下我们都可以用多次有效签名，此时参数只用传递once=false
    router.post('/getCosSignature', function(req, res, next) {
        var errors
        var once = req.body.once
        var fileId = req.body.fileId
        var sign = ''

        if (once == 'true' && !_.isEmpty(fileId)) {
            sign = signUtils.getAppSignOnce(fileId)
        } else {
            sign = signUtils.getAppSign()
        }
        res.end(sign)
    })

    // 根据用户输入的电话号码、邮箱检查用户是否存在，存在则返回用户数据
    router.post('/checkUserExistence', function(req, res, next) {
        var userName = req.body.userName
        var vnum = req.body.vnum

        if (vnum != req.session.vnum) {
            res.end('验证码有误')
        } else {
            User.findOne({ $or: [{ phoneNum: userName }, { email: userName }] }, { userName: 1, nickName: 1, email: 1, phoneNum: 1 }, function(err, user) {
                if (err) {
                    res.end(err)
                } else {
                    if (_.isEmpty(user)) {
                        req.session.isAccountChecked = false
                        res.end('该用户名没有注册')
                    } else {
                        req.session.isAccountChecked = true
                        res.json(user)
                    }
                }
            })
        }
    })

    // 忘记密码后的重置密码接口wechat
    router.post('/resetPsdFromForgetByWchat', function(req, res) {
            var errors
            var id = req.body.id
            var password = req.body.password

            if (errors) {
                res.end(errors)
            } else {
                User.findOne({ _id: id }, function(err, user) {
                    if (err) {
                        res.end(err)
                    } else {
                        if (!_.isEmpty(user)) {
                            user.password = DbOpt.encrypt(password, settings.encrypt_key)
                            user.save(function(err) {
                                if (err) {
                                    res.end(err)
                                } else {
                                    res.end('success')
                                }
                            })
                        } else {
                            res.end(settings.system_illegal_param)
                        }
                    }
                })
            }
        })
        // 忘记密码后的重置密码接口
    router.post('/resetPsdFromForget', function(req, res) {
            var errors
            var id = req.body.id
            var password = req.body.password

            if (req.session.isAccountChecked && req.session.isVcChecked) {
                if (!validator.isPsd(password) || !validator.isLength(password, 6, 12)) {
                    errors = '密码6-12位，只能包含字母、数字和下划线'
                }
                if (errors) {
                    res.end(errors)
                } else {
                    User.findOne({ _id: id }, function(err, user) {
                        if (err) {
                            res.end(err)
                        } else {
                            if (!_.isEmpty(user)) {
                                user.password = DbOpt.encrypt(password, settings.encrypt_key)
                                user.save(function(err) {
                                    if (err) {
                                        res.end(err)
                                    } else {
                                        res.end('success')
                                    }
                                })
                            } else {
                                res.end(settings.system_illegal_param)
                            }
                        }
                    })
                }
            } else {
                res.end(settings.system_illegal_param)
            }
        })
        // 发送绑定邮箱邮件
    router.post('/sentBindEmail', function(req, res, next) {
        var su = req.session.user
        var targetEmail = req.body.email
        var retrieveTime = new Date().getTime()

        if (!validator.isEmail(targetEmail) || _.isEmpty(su)) {
            res.end(settings.system_illegal_param)
        } else {
            User.findOne({ _id: su._id }, function(err, user) {
                if (err) {
                    res.end(err)
                } else {
                    if (!_.isEmpty(user)) {
                        user.retrieve_time = retrieveTime
                        user.save(function(err) {
                            if (err) {
                                return next(err)
                            } else {
                                user.email = targetEmail
                                system.sendEmail(settings.email_bind, user, function(err) {
                                    if (err) {
                                        res.end(err)
                                    } else {
                                        req.session.sendEmailCheckd = true
                                        req.session.user.targetEmail = targetEmail
                                        res.end('success')
                                    }
                                })
                            }
                        })
                    } else {
                        res.end('用户不存在')
                    }
                }
            })
        }
    })

    // 绑定邮箱验证路由
    router.get('/verifyBindEmail', function(req, res) {
        var su = req.session.user
        var params = url.parse(req.url, true)
        var tokenId = params.query.key
        var keyArr = DbOpt.getKeyArrByTokenId(tokenId)

        req.session.user.isBindEmailChecked = false

        if (keyArr && validator.isEmail(keyArr[1]) && !_.isEmpty(su)) {
            User.findOne({ _id: su._id }, function(err, user) {
                if (err) {
                    res.end(err)
                } else {
                    if (!_.isEmpty(user)) {
                        if (user.password == keyArr[0] && keyArr[2] == settings.session_secret) {
                            // 校验链接是否过期
                            var now = new Date().getTime()
                            var oneDay = 1000 * 60 * 60 * 24
                            if (!user.retrieve_time || now - user.retrieve_time > oneDay) {
                                res.redirect('emailBinding')
                            } else {
                                user.email = keyArr[1]
                                user.emailVerified = true
                                user.save(function(err) {
                                    if (err) {
                                        res.end(err)
                                    } else {
                                        req.session.user.isBindEmailChecked = true
                                        res.redirect('emailBinding')
                                    }
                                })
                            }
                        } else {
                            res.redirect('emailBinding')
                        }
                    }
                }
            })
        } else {
            res.end(settings.system_illegal_param)
        }
    })

    // 修改个人基本信息
    router.post('/modifyPersonalInfo', function(req, res, next) {
        var su = req.session.user
        var nickName = req.body.nickName
        var gender = req.body.gender
        var brithday = req.body.brithday
        var region = req.body.region
        var comments = req.body.comments

        var retrieveTime = new Date().getTime()

        if (_.isEmpty(su)) {
            res.end(settings.system_illegal_param)
        } else {
            User.findOne({ _id: su._id }, function(err, user) {
                if (err) {
                    res.end(err)
                } else {
                    if (!_.isEmpty(user)) {
                        if (user.nickName != nickName) {
                            user.nickName = nickName
                        }
                        if (user.gender != gender) {
                            user.gender = gender
                        }
                        if (user.comments != comments) {
                            user.comments = comments
                        }
                        if (_.isEmpty(user.brithday) || !_.isEqual(user.brithday, brithday)) {
                            user.brithday = brithday
                        }
                        if (_.isEmpty(user.region) || !_.isEqual(user.region, region)) {
                            user.region = region
                        }
                        user.save(function(err) {
                            if (err) {
                                res.end(err)
                            } else {
                                req.session.user.nickName = nickName
                                req.session.user.gender = gender
                                req.session.user.comments = comments
                                req.session.user.brithday = brithday
                                req.session.user.region = region
                                res.json({ result: 'success' })
                            }
                        })
                    } else {
                        res.end(settings.system_illegal_param)
                    }
                }
            })
        }
    })

    // 上传身份认证数据接口
    router.post('/uploadIdCardIdentify', function(req, res, next) {
        var su = req.session.user
        var realName = req.body.realName
        var idCardNum = req.body.idCardNum
        var frontImg = req.body.frontImg
        var backImg = req.body.backImg

        req.session.user.uploadIdCardSuccess = false

        if (_.isEmpty(su)) {
            res.end(settings.system_illegal_param)
        } else {
            User.findOne({ _id: su._id }, function(err, user) {
                if (err) {
                    res.end(err)
                } else {
                    var doc = {}
                    doc.realName = realName
                    doc.idCardNum = idCardNum
                    doc.frontImg = frontImg.replace(config.cosgzHost, config.cdnHost)
                    doc.backImg = backImg.replace(config.cosgzHost, config.cdnHost)
                    doc.status = '审核中'
                    doc.user = su._id
                    var idCardIdentify = new IdCardIdentify(doc)
                    idCardIdentify.save(function(err) {
                        if (err) {
                            res.end(err)
                        } else {
                            user.idCardIdentify = idCardIdentify._id
                            user.save(function(e) {
                                if (e) {
                                    res.end(e)
                                } else {
                                    req.session.user.uploadIdCardSuccess = true
                                    smsUtils.sendNotifySMS_qcloud("18627765097", smsUtils.code26, ["个人认证申请"], function(err) {})
                                    res.end('success')
                                }
                            })
                        }
                    })
                }
            })
        }
    })

    // 上传营业执照数据接口
    router.post('/uploadCompanyIdentify', function(req, res, next) {
            var su = req.session.user
            var img = req.body.img

            req.session.user.uploadCompanyInfoSuccess = false

            if (_.isEmpty(su)) {
                res.end(settings.system_illegal_param)
            } else {
                User.findOne({ _id: su._id }, function(err, user) {
                    if (err) {
                        res.end(err)
                    } else {
                        var doc = {}
                        doc.img = img.replace(config.cosgzHost, config.cdnHost)
                        doc.status = '审核中'
                        doc.user = su._id
                        var companyIdentify = new CompanyIdentify(doc)
                        companyIdentify.save(function(err) {
                            if (err) {
                                res.end(err)
                            } else {
                                user.companyIdentify = companyIdentify._id
                                user.save(function(e) {
                                    if (e) {
                                        res.end(e)
                                    } else {
                                        req.session.user.uploadCompanyInfoSuccess = true
                                        smsUtils.sendNotifySMS_qcloud("18627765097", smsUtils.code26, ["企业认证申请"], function(err) {})
                                        res.end('success')
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
        // 审核驳回重新提交
    router.post('/clearIdentity', function(req, res, next) {
        var typeIdentity = req.body.typeIdentity
        var su = req.session.user
        if (_.isEmpty(su)) {
            res.end(settings.system_illegal_param)
        } else {
            if (typeIdentity || isLogined) {
                if (typeIdentity == 'person') {
                    User.findOneAndUpdate({ _id: req.session.user._id }, { $unset: { idCardIdentify: 1 } }, function(err, doc) {
                        if (err) {
                            res.end(err)
                        } else if (!_.isEmpty(doc)) {
                            IdCardIdentify.findOneAndRemove({ user: req.session.user._id }, function(err, doc1) {
                                if (err) {
                                    res.end(err)
                                } else if (!_.isEmpty(doc1)) {
                                    req.session.user.uploadIdCardSuccess = false
                                    res.end('success')
                                }
                            })
                        } else {
                            res.end('删除失败')
                        }
                    })
                } else {
                    User.findOneAndUpdate({ _id: req.session.user._id }, { $unset: { companyIdentify: 1 } }, function(err, doc) {
                        if (err) {
                            res.end(err)
                        } else if (!_.isEmpty(doc)) {
                            CompanyIdentify.findOneAndRemove({ user: req.session.user._id }, function(err, doc1) {
                                if (err) {
                                    res.end(err)
                                } else if (!_.isEmpty(doc1)) {
                                    req.session.user.uploadCompanyInfoSuccess = false
                                    res.end('success')
                                }
                            })
                        } else {
                            res.end('删除失败')
                        }
                    })
                }
            } else {
                res.end('error')
            }
        }
    })





    // 根据类型查询资源数据接口
    // 参数：
    // resType(String): 资源类别
    // page(Number)：当前页面
    // limit(Number)：每页记录条数 默认每页10条
    // order(Object)：排序字段 默认{createdAt: -1}
    router.post('/queryResByType', function(req, res, next) {
        var su = req.session.user
        var resType = req.body.resType
        var order = { createdAt: -1 }
        var page = parseInt(req.body.page)
        var limit = parseInt(req.body.limit)

        if (!page) page = 1
        if (!limit) limit = 10

        var startNum = (page - 1) * limit

        if (_.isEmpty(su)) {
            res.end(settings.system_illegal_param)
        } else {
            var resultNum = PubHistory.find({ resType: resType, user: su._id }).count()
            PubHistory.find({ user: su._id, resType: resType, isDeleted: false }).sort(order).skip(startNum).limit(limit).populate('categoryL2 categoryL3', 'name').exec(function(err, docs) {
                if (err) {
                    res.end(err)
                } else if (!_.isEmpty(docs)) {
                    // 分页参数
                    var pageInfo = {
                        'totalItems': resultNum,
                        'currentPage': page,
                        'limit': limit,
                        'startNum': startNum + 1
                    }
                    var datasInfo = {
                        docs: docs,
                        pageInfo: pageInfo
                    }

                    res.json(datasInfo)
                } else {
                    res.end('查询为空')
                }
            })
        }
    })

    router.post('/queryResByTypeByOne', function(req, res, next) {
        var su = req.session.user
        var pubHistoryId = req.body.pubHistoryId

        if (_.isEmpty(su)) {
            res.end(settings.system_illegal_param)
        } else {
            PrecisePromotion.findOne({ user: su._id, pubHistory: pubHistoryId }).populate('pubHistory').populate('bill').exec(function(err, docs) {
                if (err) {
                    res.end(err)
                } else if (!_.isEmpty(docs)) {
                    res.json(docs)
                } else {
                    docs = { result: 'no' }
                    res.json(docs)
                }
            })
        }
    })

    // 获取最新发布的5条资源数据
    router.post('/queryLatestResPub', function(req, res, next) {
        var su = req.session.user
        if (_.isEmpty(su)) {
            res.end(settings.system_illegal_param)
        } else {
            PubHistory.find({ user: su._id, isDeleted: false }).sort({ createdAt: -1 }).limit(5).populate('categoryL2 categoryL3', 'name').exec(function(err, docs) {
                if (err) {
                    res.end(err)
                } else {
                    res.json(docs)
                }
            })
        }
    })

    router.post('/deleteResource', function(req, res, next) {
        var su = req.session.user
        PubHistory.findOneAndRemove({ resNum: req.body.resId, user: su._id }, function(err, doc) {
            if (err) {
                res.end(err)
            } else if (!_.isEmpty(doc)) {
                PrecisePromotion.findOneAndRemove({ pubHistory: req.body.resId, promotionEnd: { $gt: new Date() }, user: su._id }, function(err, precisePromotion) {
                    if (err) {
                        res.end(err)
                    } else {
                        res.end('success')
                    }
                })
            } else {
                res.end('删除失败')
            }
        })
    })

    // 资源刷新接口
    router.post('/refreshRes', function(req, res, next) {
        var su = req.session.user
        var resId = req.body.resId
        if (_.isEmpty(su)) {
            res.end(settings.system_illegal_param)
        } else {
            PubHistory.findOneAndUpdate({ _id: resId, user: su._id, isDeleted: false, isShowing: true }, { $set: { refreshedAt: Date.now() } }, function(err, doc) {
                if (err) {
                    res.end(err)
                } else if (!_.isEmpty(doc)) {
                    res.end('success')
                } else {
                    res.end('更新失败')
                }
            })
        }
    })

    // 资源置顶开关接口
    router.post('/triggerResTop', function(req, res, next) {
            var su = req.session.user
            var resId = req.body.resId

            if (_.isEmpty(su)) {
                res.end(settings.system_illegal_param)
            } else {
                PubHistory.findOne({ _id: resId, user: su._id, isDeleted: false, isShowing: true }, function(err, doc) {
                    if (err) {
                        res.end(err)
                    } else if (!_.isEmpty(doc)) {
                        doc.isTop = !doc.isTop
                        doc.save(function(err) {
                            if (err) {
                                res.end(err)
                            } else {
                                res.end('success')
                            }
                        })
                    } else {
                        res.end('操作失败')
                    }
                })
            }
        })
        // 资源显示开关接口
    router.post('/triggerResShow', function(req, res, next) {
            var su = req.session.user
            var resId = req.body.resId

            if (_.isEmpty(su)) {
                res.end(settings.system_illegal_param)
            } else {
                PubHistory.findOne({ _id: resId, user: su._id, isDeleted: false }, function(err, doc) {
                    if (err) {
                        res.end(err)
                    } else if (!_.isEmpty(doc)) {
                        doc.isShowing = !doc.isShowing
                        doc.save(function(err) {
                            if (err) {
                                res.end(err)
                            } else {
                                PrecisePromotion.findOneAndUpdate({ pubHistory: resId, user: su._id, isShowing: true }, { isShowing: false }, function(err, doc) {
                                    if (err) {
                                        res.end(err)
                                    } else {
                                        res.end('success')
                                    }
                                })
                            }
                        })
                    } else {
                        res.end('操作失败')
                    }
                })
            }
        })
        // 精准推广显示开关接口
    router.post('/triggerPrecisePromotionShow', function(req, res, next) {
        var su = req.session.user
        var resId = req.body.resId

        if (_.isEmpty(su)) {
            res.end(settings.system_illegal_param)
        } else {
            PrecisePromotion.findOne({ pubHistory: resId, user: su._id }, function(err, doc) {
                if (err) {
                    res.end(err)
                } else if (!_.isEmpty(doc)) {
                    doc.isShowing = !doc.isShowing
                    doc.save(function(err) {
                        if (err) {
                            res.end(err)
                        } else {
                            res.end('success')
                        }
                    })
                } else {
                    res.end('操作失败')
                }
            })
        }
    })

    // 推广删除接口
    router.post('/deletePro', function(req, res, next) {
        var su = req.session.user
        var resId = req.body.resId

        if (_.isEmpty(su)) {
            res.end(settings.system_illegal_param)
        } else {
            // TODO 资源对应的图片信息也应该同时删除
            PrecisePromotion.findOneAndRemove({ _id: resId, user: su._id, promotionEnd: { $gt: new Date() } }, function(err, doc) {
                if (err) {
                    res.end(err)
                } else if (!_.isEmpty(doc)) {
                    res.end('success')
                } else {
                    res.end('正在推广中不允许删除')
                }
            })
        }
    })

    // 根据订单id去查资源信息
    router.post('/searchResByOrderId', function(req, res, next) {
        var su = req.session.user
        var id = req.body.id

        if (_.isEmpty(su)) {
            res.end(settings.system_illegal_param)
        } else {
            PrecisePromotion.findOne({ bill: id, user: su._id }).populate('pubHistory')
                .exec(function(err, doc) {
                    if (err) {
                        res.end(err)
                    } else if (!_.isEmpty(doc)) {
                        res.json(doc)
                    } else {
                        res.end('查询失败')
                    }
                })
        }
    })

    // 资源删除接口
    router.post('/deleteRes', function(req, res, next) {
        var su = req.session.user
        var resId = req.body.resId

        if (_.isEmpty(su)) {
            res.end(settings.system_illegal_param)
        } else {
            // TODO 资源对应的图片信息也应该同时删除
            PubHistory.findOneAndRemove({ _id: resId, user: su._id }, function(err, doc) {
                if (err) {
                    res.end(err)
                } else if (!_.isEmpty(doc)) {
                    PrecisePromotion.findOneAndRemove({ pubHistory: resId, user: su._id, promotionEnd: { $lt: new Date() } }, function(err, precisePromotion) {
                        if (err) {
                            res.end(err)
                        } else {
                            res.end('success')
                        }
                    })
                } else {
                    res.end('删除失败')
                }
            })
        }
    })

    // 根据收藏类型和关键字查询接口
    // 参数：
    // type（必选）：收藏类型  zy:资源、qk:期刊、sp:商铺
    // text（可选）：搜索文本内容2到20个字符
    router.post('/queryFavorites', function(req, res, next) {
        var su = req.session.user
        var type = req.body.type
        var text = req.body.text

        var order = { createdAt: -1 }
        var page = parseInt(req.body.page)
        var limit = parseInt(req.body.limit)
        if (!page) {
            page = 1
        }
        if (!limit) {
            limit = 15
        }
        var startNum = (page - 1) * limit

        var query = { type: type, user: su._id }
        if (text && text.length > 1 && text.length <= 20) {
            query.title = { $regex: new RegExp(text, 'i') }
        }

        if (_.isEmpty(su)) {
            res.end(settings.system_illegal_param)
        } else {
            var resultNum = Favorites.find(query).count()
            Favorites.find(query, function(err, docs) {
                if (err) {
                    res.end(err)
                } else if (!_.isEmpty(docs)) {
                    var pageInfo = {
                        'totalItems': resultNum,
                        'currentPage': page,
                        'limit': limit,
                        'startNum': startNum + 1
                    }
                    var datasInfo = {
                        docs: docs,
                        pageInfo: pageInfo
                    }
                    res.json(datasInfo)
                } else {
                    res.end('查询为空')
                }
            }).sort(order).skip(startNum).limit(limit)
        }
    })

    // 删除收藏接口
    // 参数：
    // ids：待删除的收藏ID数组
    router.post('/deleteFavorites', function(req, res, next) {
        var su = req.session.user
        var ids = req.body.ids

        if (_.isEmpty(su)) {
            res.end(settings.system_illegal_param)
        } else {
            Favorites.remove({ _id: { $in: ids }, user: su._id }, function(err) {
                if (err) {
                    res.end(err)
                } else {
                    res.end('success')
                }
            })
        }
    })

    // 添加收藏接口
    router.post('/addFavorites', function(req, res, next) {
        var su = req.session.user
        var type = req.body.type
        var title = req.body.title
        var targetId = req.body.targetId

        if (_.isEmpty(su)) {
            res.end(settings.system_illegal_param)
        } else {
            var doc = new Favorites({ type: type, title: title, targetId: targetId, user: su._id })
            doc.save(function(err) {
                if (err) {
                    res.end(err)
                } else {
                    res.end('success')
                }
            })
        }
    })

    // 查询最近发布的5条需求接口
    router.post('/queryRecentPubDemands', function(req, res, next) {
        var su = req.session.user
        var order = { createdAt: -1 }

        if (_.isEmpty(su)) {
            res.end(settings.system_illegal_param)
        } else {
            Demands.find({ user: su._id }).sort(order).limit(5).populate('categoryL1 categoryL2', 'name').exec(function(err, docs) {
                if (err) {
                    res.end(err)
                } else if (!_.isEmpty(docs)) {
                    res.json({ docs: docs })
                } else {
                    res.end('查询为空')
                }
            })
        }
    })

    // 查询我的需求接口
    router.post('/queryPubDemands', function(req, res, next) {
        var su = req.session.user
        var order = { createdAt: -1 }
        var page = parseInt(req.body.page)
        var limit = parseInt(req.body.limit)
        if (!page) {
            page = 1
        }
        if (!limit) {
            limit = 15
        }
        var startNum = (page - 1) * limit

        if (_.isEmpty(su)) {
            res.end(settings.system_illegal_param)
        } else {
            var resultNum = Demands.find({ user: su._id }).count()
            Demands.find({ user: su._id }).sort(order).skip(startNum).limit(limit).populate('categoryL1 categoryL2', 'name').exec(function(err, docs) {
                if (err) {
                    res.end(err)
                } else if (!_.isEmpty(docs)) {
                    var pageInfo = {
                        'totalItems': resultNum,
                        'currentPage': page,
                        'limit': limit,
                        'startNum': startNum + 1
                    }
                    var datasInfo = {
                        docs: docs,
                        pageInfo: pageInfo
                    }
                    res.json(datasInfo)
                } else {
                    res.end('查询为空')
                }
            })
        }
    })

    // 需求刷新接口
    router.post('/refreshDemands', function(req, res, next) {
        var su = req.session.user
        var id = req.body.id

        if (_.isEmpty(su)) {
            res.end(settings.system_illegal_param)
        } else {
            Demands.findOneAndUpdate({ _id: id, user: su._id }, { $set: { refreshedAt: Date.now() } }, function(err, doc) {
                if (err) {
                    res.end(err)
                } else if (!_.isEmpty(doc)) {
                    res.end('success')
                } else {
                    res.end('更新失败')
                }
            })
        }
    })

    // 需求显示开关接口
    router.post('/triggerDemandsShow', function(req, res, next) {
        var su = req.session.user
        var id = req.body.id

        if (_.isEmpty(su)) {
            res.end(settings.system_illegal_param)
        } else {
            Demands.findOne({ _id: id, user: su._id }, function(err, doc) {
                if (err) {
                    res.end(err)
                } else if (!_.isEmpty(doc)) {
                    doc.isShowing = !doc.isShowing
                    doc.save(function(err) {
                        if (err) {
                            res.end(err)
                        } else {
                            res.end('success')
                        }
                    })
                } else {
                    res.end('操作失败')
                }
            })
        }
    })

    // 需求删除接口
    router.post('/deleteDemands', function(req, res, next) {
        var su = req.session.user
        var id = req.body.id

        if (_.isEmpty(su)) {
            res.end(settings.system_illegal_param)
        } else {
            Demands.findOneAndRemove({ _id: id, user: su._id }, function(err, doc) {
                if (err) {
                    res.end(err)
                } else if (!_.isEmpty(doc)) {
                    res.end('success')
                } else {
                    res.end('删除失败')
                }
            })
        }
    })

    // 忘记密码 第一步
    router.get('/passwordReset', function(req, res, next) {
            siteFunc.renderToTargetPageByType(req, res, 'passwordReset', { title: '忘记密码', page: 'passwordReset' })
        })
        // 忘记密码 第二步
    router.get('/confirmUser', function(req, res, next) {
            if (req.session.isAccountChecked) {
                siteFunc.renderToTargetPageByType(req, res, 'confirmUser', { title: '忘记密码', page: 'confirmUser' })
            } else {
                res.redirect('passwordReset')
            }
        })
        // 忘记密码 第三步
    router.get('/setPassword', function(req, res, next) {
        if (req.session.isAccountChecked && req.session.isVcChecked) {
            siteFunc.renderToTargetPageByType(req, res, 'setPassword', { title: '忘记密码', page: 'setPassword' })
        } else if (req.session.isAccountChecked) {
            res.redirect('confirmUser')
        } else {
            res.redirect('passwordReset')
        }
    })

    // 信息管理页面
    router.get('/messageManagement', function(req, res, next) {
        if (!isLogined(req)) {
            res.redirect('/users/transition')
        } else {
            siteFunc.renderToTargetPageByType(req, res, 'messageManagement', { title: '信息管理', page: 'messageManagement' })
        }
    })

    router.get('/confirmIdForEmail', function(req, res, next) {
        if (!isLogined(req)) {
            res.redirect('/users/transition')
        } else {
            User.findOne({ _id: req.session.user._id }, function(err, user) {
                if (user && user.emailVerified) {
                    siteFunc.renderToTargetPageByType(req, res, 'confirmIdForEmail', { title: '邮箱绑定修改', page: 'confirmIdForEmail' })
                } else {
                    res.redirect('safetySet')
                }
            })

        }
    })

    router.get('/certificationManagement', function(req, res, next) {
        if (!isLogined(req)) {
            res.redirect('/users/transition')
        } else {
            siteFunc.renderToTargetPageByType(req, res, 'certificationManagement', {
                title: '认证管理',
                page: 'certificationManagement'
            })
        }
    })

    router.get('/identifying', function(req, res, next) {
        if (!isLogined(req)) {
            res.redirect('/users/transition')
        } else {
            IdCardIdentify.findOne({ user: req.session.user._id }, function(err, doc) {
                if (!_.isEmpty(doc)) {
                    if (doc.status == '审核通过' || doc.status == '审核驳回') {
                        siteFunc.renderToTargetPageByType(req, res, 'identifying3', { title: '身份认证结果', page: 'identifying3' })
                    } else if (doc.status == '审核中') {
                        siteFunc.renderToTargetPageByType(req, res, 'identifying2', { title: '身份认证审核中', page: 'identifying2' })
                    }
                } else {
                    siteFunc.renderToTargetPageByType(req, res, 'identifying1', { title: '身份认证填写信息', page: 'identifying1' })
                }
            })
        }
    })

    router.get('/privateInfo', function(req, res, next) {
        if (!isLogined(req)) {
            res.redirect('/users/transition')
        } else {
            siteFunc.renderToTargetPageByType(req, res, 'privateInfo', { title: '个人信息', page: 'privateInfo' })
        }
    })

    router.get('/emailBinding', function(req, res, next) {
        if (!isLogined(req)) {
            res.redirect('/users/transition')
        } else {
            if (req.session.sendEmailCheckd && req.session.user.isBindEmailChecked) {
                siteFunc.renderToTargetPageByType(req, res, 'emailBinding3', { title: '邮箱绑定3', page: 'emailBinding3' })
            } else if (req.session.sendEmailCheckd) {
                siteFunc.renderToTargetPageByType(req, res, 'emailBinding2', { title: '邮箱绑定2', page: 'emailBinding2' })
            } else {
                siteFunc.renderToTargetPageByType(req, res, 'emailBinding1', { title: '邮箱绑定1', page: 'emailBinding1' })
            }
        }
    })

    router.get('/mobileBinding', function(req, res, next) {
        if (req.session.isVcBindChecked && req.session.isVcChecked) {
            siteFunc.renderToTargetPageByType(req, res, 'mobileBinding3', { title: '手机绑定3', page: 'mobileBinding3' })
        } else if (req.session.isVcBindChecked) {
            siteFunc.renderToTargetPageByType(req, res, 'mobileBinding2', { title: '手机绑定2', page: 'mobileBinding2' })
        } else {
            siteFunc.renderToTargetPageByType(req, res, 'mobileBinding1', { title: '手机绑定1', page: 'mobileBinding1' })
        }
    })



    router.get('/myOrders', function(req, res, next) {
        if (!isLogined(req)) {
            res.redirect('/users/transition')
        } else {
            siteFunc.renderToTargetPageByType(req, res, 'myOrders', { title: '我的订单', page: 'myOrders' })
        }
    })

    router.get('/myActivity', function(req, res, next) {
        if (!isLogined(req)) {
            res.redirect('/users/transition')
        } else {
            siteFunc.renderToTargetPageByType(req, res, 'myActivity', { title: '我的活动', page: 'myActivity' })
        }
    })

    router.get('/specificActivity', function(req, res, next) {
        siteFunc.renderToTargetPageByType(req, res, 'specificActivity', { title: '活动详情页', page: 'specificActivity' })
    })

    router.get('/cityPartner', function(req, res, next) {
        siteFunc.renderToTargetPageByType(req, res, 'cityPartner', { title: '城市合伙人', page: 'cityPartner' })
    })

    router.get('/myCollect', function(req, res, next) {
        if (!isLogined(req)) {
            res.redirect('/users/transition')
        } else {
            siteFunc.renderToTargetPageByType(req, res, 'myCollect', { title: '我的收藏', page: 'myCollect' })
        }
    })
    router.get('/myDemand', function(req, res, next) {
        if (!isLogined(req)) {
            res.redirect('/users/transition')
        } else {
            siteFunc.renderToTargetPageByType(req, res, 'myDemand', { title: '我的需求', page: 'myDemand' })
        }
    })
    router.get('/myFixCenter', function(req, res, next) {
        if (!isLogined(req)) {
            res.redirect('/users/transition')
        } else {
            siteFunc.renderToTargetPageByType(req, res, 'myFixCenter', { title: '我的需求', page: 'myFixCenter' })
        }
    })
    router.get('/myPromote', function(req, res, next) {
        if (!isLogined(req)) {
            res.redirect('/users/transition')
        } else {
            siteFunc.renderToTargetPageByType(req, res, 'myPromote', { title: '我的推广', page: 'myPromote' })
        }
    })
    router.get('/myResource', function(req, res, next) {
        if (!isLogined(req)) {
            res.redirect('/users/transition')
        } else {
            siteFunc.renderToTargetPageByType(req, res, 'myResource', { title: '我的资源', page: 'myResource' })
        }
    })
    router.get('/recentDemandAndResource', function(req, res, next) {
        if (!isLogined(req)) {
            res.redirect('/users/transition')
        } else {
            siteFunc.renderToTargetPageByType(req, res, 'recentDemandAndResource', {
                title: '最近发布的资源和需求',
                page: 'recentDemandAndResource'
            })
        }
    })
    router.get('/safetySet', function(req, res, next) {
        if (!isLogined(req)) {
            res.redirect('/users/transition')
        } else {
            siteFunc.renderToTargetPageByType(req, res, 'safetySet', { title: '安全设置', page: 'safetySet' })
        }
    })
    router.get('/modifyPassword', function(req, res, next) {
        if (!isLogined(req)) {
            res.redirect('/users/transition')
        } else {
            siteFunc.renderToTargetPageByType(req, res, 'modifyPassword', { title: '修改密码', page: 'modifyPassword' })
        }
    })

    router.get('/transition', function(req, res, next) {
        siteFunc.renderToTargetPageByType(req, res, 'transition', { title: '过渡页', page: 'transition' })
    })

    // 提交验证邮箱
    router.post('/sentConfirmEmail', function(req, res, next) {
        var targetEmail = req.body.email
            //    获取当前发送邮件的时间
        var retrieveTime = new Date().getTime()
        var su = req.session.user
        if (_.isEmpty(su)) {
            res.end(settings.system_illegal_param)
        } else {
            if (!validator.isEmail(targetEmail)) {
                res.end(settings.system_illegal_param)
            } else {
                User.findOne({ 'email': targetEmail }, function(err, user) {
                    if (err) {
                        res.end(err)
                    } else {
                        if (user && user._id) {
                            user.retrieve_time = retrieveTime
                            user.save(function(err) {
                                if (err) {
                                    return next(err)
                                } else {
                                    system.sendEmail(settings.email_findPsd, user, function(err) {
                                        if (err) {
                                            res.end(err)
                                        } else {
                                            res.end('success')
                                        }
                                    })
                                }
                            })
                        } else {
                            res.end('未能通过邮件地址找到用户')
                        }
                    }
                })
            }
        }
    })

    // 点击找回密码链接跳转页面
    router.get('/reset_pass', function(req, res) {
        var params = url.parse(req.url, true)
        var tokenId = params.query.key
        var keyArr = DbOpt.getKeyArrByTokenId(tokenId)
        if (keyArr && validator.isEmail(keyArr[1])) {
            User.findOne({ 'email': keyArr[1] }, function(err, user) {
                if (err) {
                    res.end(err)
                } else {
                    if (user && user._id) {
                        if (user.password == keyArr[0] && keyArr[2] == settings.session_secret) {
                            // 校验链接是否过期
                            var now = new Date().getTime()
                            var oneDay = 1000 * 60 * 60 * 24
                            if (!user.retrieve_time || now - user.retrieve_time > oneDay) {
                                siteFunc.renderToTargetPageByType(req, res, 'userInfo', { key: 'warning', value: '链接超时，密码无法重置。', page: 'userNotice' })
                            }
                            siteFunc.renderToTargetPageByType(req, res, 'user', { title: '重设密码', page: 'userResetPsd', tokenId: tokenId })
                        } else {
                            siteFunc.renderToTargetPageByType(req, res, 'userInfo', { key: 'warning', value: '信息有误，密码无法重置。', page: 'userNotice' })
                        }
                    }
                }
            })
        } else {
            res.end(settings.system_illegal_param)
        }
    })

    router.post('/updateNewPsd', function(req, res) {
        var keyArr = DbOpt.getKeyArrByTokenId(req.body.tokenId)
        if (keyArr && validator.isEmail(keyArr[1])) {
            User.findOne({ 'email': keyArr[1] }, function(err, user) {
                if (err) {
                    res.end(err)
                } else {
                    if (user.password == keyArr[0] && keyArr[2] == settings.session_secret &&
                        validator.isPsd(req.body.password) && validator.isLength(req.body.password, 6, 12)) {
                        user.password = DbOpt.encrypt(req.body.password, settings.encrypt_key)
                        user.save(function(err) {
                            if (err) {
                                res.end(err)
                            } else {
                                user.retrieve_time = null
                                res.end('success')
                            }
                        })
                    } else {
                        res.end(settings.system_illegal_param)
                    }
                }
            })
        } else {
            res.end(settings.system_illegal_param)
        }
    })
    router.get('/weiChartBindQrForTwo',function (req, res, next) {
        if(req.query.code){
            var url='https://api.weixin.qq.com/sns/oauth2/access_token?appid='+settings.appid+'&secret='+settings.secret+'&code='+req.query.code+'&grant_type=authorization_code'
            request.get({
                url:url
            },function (error, response, body) {
                if(response.statusCode == 200) {
                    var callBackObj = JSON.parse(body)
                    console.log(callBackObj)
                    if (callBackObj.openid) {
                        User.findOne({wechatId: callBackObj.openid}, function (err, u) {
                            if (_.isEmpty(u)) {
                                WxCheck.findOne({wechatId: callBackObj.unionid}, function (err, wxcheck) {
                                    if (_.isEmpty(wxcheck)) {
                                        User.findOneAndUpdate({_id: req.session.user._id}, {
                                            $set: {
                                                wechatBind: true, aOpenId: callBackObj.openid,
                                                wechatId: callBackObj.unionid
                                            }
                                        }, function (err, user) {
                                            res.redirect('/users/qqweichartBinding?weiChatBind')
                                        })
                                    } else {
                                        User.findOneAndUpdate({_id: req.session.user._id}, {
                                            $set: {
                                                wechatBind: true, aOpenId: callBackObj.openid,
                                                wechatId: callBackObj.unionid, bOpenId: wxcheck.openId
                                            }
                                        }, function (err, user) {
                                            res.redirect('/users/qqweichartBinding?weiChatBind')
                                        })
                                    }
                                })

                            } else {
                                res.redirect('/users/qqweichartBinding?weiChatBindSame')
                            }
                        })

                    }
                } else{
                console.log(response.statusCode);
                }
            })
        }else {
            res.redirect('/users/home')
        }
    })

    router.get('/weiChartBindQr',function (req, res) {
        var su=req.session.user
        var notify_url = 'http://www.91zhizuo.com' + '/users/weiChartBindQrForTwo'
        var imgStr="https://open.weixin.qq.com/connect/qrconnect?" +
            "appid="+settings.appid+"&redirect_uri="+encodeURIComponent(notify_url)+"&response_type=code&scope=snsapi_login&state="+Math.random()+"#wechat_redirect"
        res.redirect(imgStr)
    })
    // 用户中心
    router.get('/userCenter', function(req, res, next) {
        if (isLogined(req)) {
            siteFunc.renderToTargetPageByType(req, res, 'user', { title: '用户中心', page: 'userCenter' })
        } else {
            siteFunc.renderToTargetPageByType(req, res, 'user', { title: '用户登录', page: 'userLogin' })
        }
    })

    //
    router.get('/qqweichartBinding', function(req, res, next) {
            if (isLogined(req)) {
                siteFunc.renderToTargetPageByType(req, res, 'qqweichartBinding', { title: 'qq微信绑定', page: 'qqweichartBinding' })
            } else {
                siteFunc.renderToTargetPageByType(req, res, 'user', { title: '用户登录', page: 'userLogin' })
            }
        })
        // 用户消息
    router.get('/userMessage', function(req, res, next) {
        if (isLogined(req)) {
            siteFunc.renderToTargetPageByType(req, res, 'userNotice', { title: '我的消息', page: 'userMessage' })
        } else {
            siteFunc.renderToTargetPageByType(req, res, 'user', { title: '用户登录', page: 'userLogin' })
        }
    })

    // 修改用户密码页面
    router.get('/setUserPsd', function(req, res, next) {
        if (isLogined(req)) {
            siteFunc.renderToTargetPageByType(req, res, 'user', { title: '密码重置', page: 'userSetPsd' })
        } else {
            siteFunc.renderToTargetPageByType(req, res, 'user', { title: '用户登录', page: 'userLogin' })
        }
    })

    // 用户参与话题
    router.get('/userReplies', function(req, res, next) {
        if (isLogined(req)) {
            siteFunc.renderToTargetPageByType(req, res, 'userReply', { title: '参与话题', page: 'userReplies' })
        } else {
            siteFunc.renderToTargetPageByType(req, res, 'user', { title: '用户登录', page: 'userLogin' })
        }
    })

    // 参与话题分页
    router.get('/userReplies/:defaultUrl', function(req, res) {
        if (isLogined(req)) {
            var defaultUrl = req.params.defaultUrl
            var replyUrl = defaultUrl.split('—')[0]
            var replyPage = defaultUrl.split('—')[1]
            if (replyUrl == 'p') {
                replyPage = defaultUrl.split('—')[1].split('.')[0]
                if (replyPage && validator.isNumeric(replyPage)) {
                    req.query.page = replyPage
                }

                siteFunc.renderToTargetPageByType(req, res, 'userReply', { title: '参与话题', page: 'userReplies' })
            } else {
                siteFunc.renderToTargetPageByType(req, res, 'error', { info: '非法操作!', message: settings.system_illegal_param, page: 'do500' })
            }
        } else {
            siteFunc.renderToTargetPageByType(req, res, 'user', { title: '用户登录', page: 'userLogin' })
        }
    })

    // 用户退出
    router.get('/logout', function(req, res, next) {
        req.session.destroy()
            // TODO 正式上线后需要放开
        if (settings.debug) {
            res.clearCookie(settings.auth_cookie_name, { path: '/', domain: '.100ns.cn' })
        } else {
            res.clearCookie(settings.auth_cookie_name, { path: '/', domain: '.91zhizuo.com' })
        }
        // res.clearCookie(settings.auth_cookie_name, { path: '/' })
        res.redirect('home')
    })

    // weChat用户退出
    router.get('/welogout', function(req, res, next) {
        req.session.destroy()
            // TODO 正式上线后需要放开
            //res.clearCookie(settings.auth_cookie_name, { path: '/', domain: '.100ns.cn'})
        if (settings.debug) {
            res.clearCookie(settings.auth_cookie_name, { path: '/', domain: '.100ns.cn' })
        } else {
            res.clearCookie(settings.auth_cookie_name, { path: '/', domain: '.91zhizuo.com' })
        }
        // res.clearCookie(settings.auth_cookie_name, { path: '/' })
        res.redirect('/wechat/getHomeInfo')
    })

    router.post('/clearCookie', function(req, res, next) {
        req.session.destroy()
            // TODO 正式上线后需要放开
        if (settings.debug) {
            res.clearCookie(settings.auth_cookie_name, { path: '/', domain: '.100ns.cn' })
        } else {
            res.clearCookie(settings.auth_cookie_name, { path: '/', domain: '.91zhizuo.com' })
        }
        //res.clearCookie(settings.auth_cookie_name, { path: '/', domain: '.100ns.cn'})
        // res.clearCookie(settings.auth_cookie_name, { path: '/' })
        res.end("success")
    })

    // 查找指定注册用户
    router.get('/userInfo', function(req, res, next) {
        var params = url.parse(req.url, true)
        var currentId = params.query.uid
        if (shortid.isValid(currentId)) {
            User.findOne({ _id: currentId }, function(err, result) {
                if (err) {} else {
                    //                针对有密码的记录，需要解密后再返回
                    if (result && result.password) {
                        var decipher = crypto.createDecipher('bf', settings.encrypt_key)
                        var oldPsd = ''
                        oldPsd += decipher.update(result.password, 'hex', 'utf8')
                        oldPsd += decipher.final('utf8')
                        result.password = oldPsd
                    }
                    return res.json(result)
                }
            })
        } else {
            return res.json({})
        }
    })

    // 修改用户信息
    router.post('/userInfo/modify', function(req, res, next) {
        var errors
        var email = req.body.email;
        var password = req.body.password;
        var userName = req.body.userName
        var name = req.body.name
        var city = req.body.city
        var company = req.body.company
        var qq = req.body.qq
        var phoneNum = req.body.phoneNum

        //    数据校验
        if (!validator.isUserName(userName)) {
            errors = '用户名5-12个英文字符'
        }

        if (name && (!validator.isGBKName(name) || !validator.isLength(name, 1, 5))) {
            errors = '姓名格式不正确'
        }

        if (!validator.isEmail(email)) {
            errors = '请填写正确的邮箱地址'
        }

        if (city && (!validator.isGBKName(city) || !validator.isLength(city, 0, 12))) {
            errors = '请填写正确的城市名称'
        }

        if (company && (!validator.isGBKName(company) || !validator.isLength(company, 0, 12))) {
            errors = '请填写正确的学校中文名称'
        }

        if (qq && !validator.isQQ(qq)) {
            errors = '请填写正确的QQ号码'
        }

        if (phoneNum && !validator.isMobilePhone(phoneNum, 'zh-CN')) {
            errors = '请填写正确的手机号码'
        }

        if (errors) {
            res.end(errors)
        } else {
            var newPsd = DbOpt.encrypt(password, settings.encrypt_key)
            req.body.password = newPsd
            DbOpt.updateOneByID(User, req, res, 'modify regUser')
        }
    })

    // 密码修改
    router.post('/resetMyPsd', function(req, res, next) {
        var errors
        var su = req.session.user
        var oldPassword = req.body.oldPassword
        var userPsd = req.body.password

        if (!validator.isPsd(oldPassword) || !validator.isLength(oldPassword, 6, 12)) {
            errors = '6-12位，只能包含字母、数字和下划线'
        }
        if (!validator.isPsd(userPsd) || !validator.isLength(userPsd, 6, 12)) {
            errors = '6-12位，只能包含字母、数字和下划线'
        }
        if (userPsd === oldPassword) {
            errors = '新密码和原密码不能相同'
        }

        if (errors) {
            res.end(errors)
        } else {
            if (!_.isEmpty(su)) {
                var oldPsd = DbOpt.encrypt(oldPassword, settings.encrypt_key)
                var newPsd = DbOpt.encrypt(userPsd, settings.encrypt_key)
                if (shortid.isValid(su._id)) {
                    User.findOne({ _id: su._id }, function(err, user) {
                        if (!_.isEmpty(user)) {
                            // 验证是否是本人操作，提高安全性
                            if (oldPsd === user.password) {
                                User.update({ _id: su._id }, { password: newPsd }, function(err, result) {
                                    if (err) {
                                        res.end(err)
                                    } else {
                                        res.end('success')
                                    }
                                })
                            } else {
                                res.end('原始密码错误')
                            }
                        } else {
                            res.end(settings.system_illegal_param)
                        }
                    })
                } else {
                    res.end(settings.system_illegal_param)
                }
            } else {
                res.end(settings.system_illegal_param)
            }
        }
    })

    // -------------------------------------留言模块开始
    // 用户留言
    router.post('/message/sent', function(req, res, next) {
        var errors
        var contentId = req.body.contentId
        var contentTitle = req.body.contentTitle
        var authorId = req.session.user._id
        var replyId = req.body.replyId
        var replyEmail = req.body.replyEmail
        var relationMsgId = req.body.relationMsgId

        if (!shortid.isValid(contentId) || !contentTitle) {
            errors = settings.system_illegal_param
        }
        if (!authorId) {
            errors = settings.system_illegal_param
        }
        if (replyEmail && !validator.isEmail(replyEmail)) {
            errors = settings.system_illegal_param
        }

        if (errors) {
            res.end(errors)
        } else {
            if (replyId) {
                req.body.replyAuthor = new User({ _id: replyId, email: replyEmail })
                req.body.relationMsgId = relationMsgId
            }

            req.body.author = new User({ _id: authorId, userName: req.session.user.userName })
            var newMsg = new Message(req.body)
            newMsg.save(function() {
                //              更新评论数
                Content.updateCommentNum(contentId, 'add', function() {
                    //              如果被评论用户存在邮箱，则发送提醒邮件
                    if (newMsg.replyAuthor && newMsg.replyAuthor.email) {
                        system.sendEmail(settings.email_notice_user_contentMsg, newMsg, function(err) {
                            if (err) {
                                res.end(err)
                            }
                        })
                    } else {
                        //                    给管理员发送消息,这里异步就可以，不用等到邮件发送成功再返回结果
                        //                        system.sendEmail(settings.email_notice_contentMsg,newMsg,function(err){
                        //                            if(err){
                        //                                res.end(err)
                        //                            }
                        //                        })
                        siteFunc.sendSystemNoticeByType(req, res, 'msg', newMsg)
                    }

                    res.end('success')
                })
            })
        }
    })

    // -------------------------------------留言模块结束

    // -------------------------------------消息通知模块开始

    // 设置消息已读接口
    // 参数：
    // msgIds：带操作消息ID数组
    router.post('/setHasReadUserNotify', function(req, res) {
        var msgIds = JSON.parse(req.body.msgIds)
        if (msgIds) {
            UserNotify.setHasRead(msgIds, function(err) {
                if (err) {
                    res.end(err)
                } else {
                    UserNotify.getNoReadNotifyCountByUserId(req.session.user._id, 'user', function(err, count) {
                        req.session.user.msg_count = count
                        io.sockets.emit('notifyNum', { msg_count: count })
                        res.end('success')
                    })
                }
            })
        } else {
            res.end(settings.system_illegal_param)
        }
    })

    // 批量删除消息
    // 参数：
    // ids：待删除消息ID数组
    router.post('/batchDelUserNotifies', function(req, res) {
        var ids = JSON.parse(req.body.ids)
        if (_.isArray(ids) && ids.length > 0) {
            UserNotify.remove({ '_id': { $in: ids } }, function(err) {
                if (err) {
                    res.end(err)
                } else {
                    res.end('success')
                }
            })
        } else {
            res.end('请选择至少一项后再执行删除操作！')
        }
    })

    //  消息通知分页
    // 参数：
    // isRead（选填）：是否根据阅读状态过滤
    // page（必选）：当前页面
    // limit（必选）：每页记录条数 默认每页10条
    router.post('/queryUserNotifies', function(req, res) {
        res.json(UserNotify.getNotifyPaginationResult(req, res, req.session.user._id))
    })

    // -------------------------------------消息通知模块结束

    // 获取邀请码
    router.post('/getInviteCode', function(req, res) {
        var errors
        var su = req.session.user
        var phoneNum = req.body.phoneNum

        if (!validator.isNumeric(phoneNum) || phoneNum.length != 11) {
            errors = '电话号码无效'
        }
        if (_.isEmpty(su)) {
            errors = '请登录后完成操作'
        }

        if (errors) {
            res.json({ errors: errors })
        } else {
            InviteCode.findOne({ user: su._id }, function(err, doc) {
                if (err) {
                    res.end(err)
                } else if (!_.isEmpty(doc)) {
                    res.json({ errors: '您已经获取过邀请码请到个人中心-我的活动页面查看' })
                } else {
                    InviteCode.find({}).count(function(err, count) {
                        if (err) {
                            res.end(err)
                        } else {
                            var code = 1001 + count
                            var inviteCode = new InviteCode({ code: code, user: su._id })
                            inviteCode.save(function(err) {
                                if (err) {
                                    res.end(err)
                                } else {
                                    smsUtils.sendNotifySMS_qcloud(phoneNum, smsUtils.code16, [code], function(err) {
                                        if (err) {
                                            res.json(err)
                                        } else {
                                            res.json({ code: code })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })

    // 获取邀请码推广二维码
    router.get('/getInviteQrCode', function(req, res) {
        var errors
        var su = req.session.user

        if (_.isEmpty(su)) {
            errors = '请登录后完成操作'
        } else {
            InviteCode.findOne({ user: su._id }, function(err, doc) {
                if (err) {
                    res.end(err)
                } else if (_.isEmpty(doc)) {
                    res.end('您还未获取过邀请码')
                } else {
                    var url = (settings.debug ? 'http://www.100ns.cn:81' : 'http://www.91zhizuo.com') + '/wechat/weActivityNext'
                    try {
                        var img = qr.image(url, { size: 10 })
                        res.writeHead(200, { 'Content-Type': 'image/png' })
                        img.pipe(res)
                    } catch (e) {
                        res.writeHead(414, { 'Content-Type': 'text/html' })
                        res.end('<h1>414 Request-URI Too Large</h1>')
                    }
                }
            })
        }
    })

    // 修改昵称
    router.post('/changeNickName', function(req, res, next) {
        var error
        var su = req.session.user
        var nickName = req.body.nickName

        if (_.isEmpty(su)) {
            res.end(settings.system_illegal_param)
        } else {
            User.findOneAndUpdate({ _id: su._id }, { $set: { nickName: nickName } }, function(err, doc) {
                if (err) {
                    res.end(err)
                } else if (!_.isEmpty(doc)) {
                    req.session.user.nickName = nickName
                    res.json({
                        'result': 'success'
                    })
                } else {
                    res.json({
                        'result': '更新失败'
                    })
                }
            })
        }
    })

    return router
}

module.exports = returnUsersRouter