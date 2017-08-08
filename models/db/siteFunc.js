/**
 * Created by Administrator on 2015/5/30.
 */
// 文档对象
var Content = require('../Content')
// 文章类别对象
var User = require('../User')
var CategoryRecommend = require('../admincenter/CategoryRecommend')
var SearchRecommend = require('../admincenter/SearchRecommend')
var CategorySetting = require('../admincenter/CategorySetting')
var Ebook = require('../admincenter/Ebook')
var News = require('../admincenter/News')
var BrandPromotion = require('../admincenter/BrandPromotion')
var PrecisePromotion = require('../admincenter/PrecisePromotion')
var Slide = require('../admincenter/Slide')
var VR = require('../admincenter/VR')
var Bill = require('../Bill')
var Company = require('../Company')
var IdCardIdentify = require('../IdCardIdentify')
var CompanyIdentify = require('../CompanyIdentify')
var PubHistory = require('../publish/PubHistory')
var Install = require('../publish/Install')
var InviteCode = require('../activity/InviteCode')
var UserNotify= require('../UserNotify')
var FunnyData= require('../FunnyData')
var FunnyData4Res= require('../FunnyData4Res')
var ContentCategory = require('../ContentCategory')
var _ = require('lodash')

// 文章标签对象
var ContentTags = require('../ContentTags')
// 文章模板对象
var ContentTemplate = require('../ContentTemplate')
var TemplateItems = require('../TemplateItems')
// 广告对象
var Ads = require('../Ads')
// 留言对象
var Message = require('../Message')
var settings = require('./settings')

// 数据库操作对象
var DbOpt = require('../Dbopt')
// 消息对象
var UserNotify = require('../UserNotify')
// 时间格式化
var moment = require('moment')
// 缓存
var cache = require('../../util/cache')
// 系统消息
var Notify = require('../Notify')
function isLogined (req) {
  return req.session.logined
}

var siteFunc = {
  siteInfos: function (title, cmsDescription, keyWords) {
    var discrip
    var key

    if (cmsDescription) {
      discrip = cmsDescription
    } else {
      discrip = settings.CMSDISCRIPTION
    }

    if (keyWords) {
      key = keyWords + ',' + settings.SITEBASICKEYWORDS
    } else {
      key = settings.SITEKEYWORDS
    }

    return {
      title: title + ' | ' + settings.SITETITLE,
      cmsDescription: discrip,
      keywords: key,
      siteIcp: settings.SITEICP,
      version: settings.SITEVERSION
    }
  },

  bindEmailTemp: function (name, token) {
    var html = '<p>您好：' + name + '</p>' +
      '<p>请点击如下链接完成您<strong>' + settings.SITETITLE + '</strong>账户的邮箱认证</p>' +
      '<a href="' + (settings.debug ? settings.SITEDOMAINTEST : settings.SITEDOMAIN) + '/users/verifyBindEmail?key=' + token + '">邮箱认证链接</a>' +
      '<p> <strong>' + settings.SITETITLE + ' </strong> 谨上</p>'
    return html
  },

  setConfirmPassWordEmailTemp: function (name, token) {
    var html = '<p>您好：' + name + '</p>' +
      '<p>我们收到您在 <strong>' + settings.SITETITLE + '</strong> 的注册信息，请点击下面的链接来激活帐户：</p>' +
      '<a href="' + (settings.debug ? settings.SITEDOMAINTEST : settings.SITEDOMAIN) + '/users/reset_pass?key=' + token + '">重置密码链接</a>' +
      '<p>若您没有在 <strong>' + settings.SITETITLE + '</strong> 填写过注册信息，说明有人滥用了您的电子邮箱，请忽略或删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
      '<p> <strong>' + settings.SITETITLE + ' </strong> 谨上</p>'
    return html
  },

  setNoticeToAdminEmailTemp: function (obj) {
    var msgDate = moment(obj.date).format('YYYY-MM-DD HH:mm:ss')
    var html = ''
    html += '主人您好，<strong>' + obj.author.userName + '</strong> 于 ' + msgDate + ' 在 <strong>' + settings.SITETITLE + '</strong> 的文章 <a href="' + (settings.debug ? settings.SITEDOMAINTEST : settings.SITEDOMAIN) + '/details/' + obj.contentId + '.html">' + obj.contentTitle + '</a> 中留言了'
    return html
  },

  setNoticeToUserEmailTemp: function (obj) {
    var msgDate = moment(obj.date).format('YYYY-MM-DD HH:mm:ss')
    var html = ''
    var targetEmail
    if (obj.author) {
      targetEmail = obj.author.userName
    }else if (obj.adminAuthor) {
      targetEmail = obj.adminAuthor.userName
    }
    html += '主人您好，<strong>' + targetEmail + '</strong> 于 ' + msgDate + ' 在 <strong>' + settings.SITETITLE + '</strong> 的文章 <a href="' + (settings.debug ? settings.SITEDOMAINTEST : settings.SITEDOMAIN) + '/details/' + obj.contentId + '.html">' + obj.contentTitle + '</a> 中回复了您'
    return html
  },

  setBugToAdminEmailTemp: function (obj) {
    var msgDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    var html = ''
    html += '主人您好，测试管理员（' + obj.email + ')于 ' + msgDate + ' 在 <strong>' + settings.SITETITLE + '</strong> 的后台模块 <strong>' + obj.contentFrom + '</strong> 中说：<br>' + obj.content
    return html
  },

  setNoticeToUserRegSuccess: function (obj) {
    var html = ''
    html += '亲爱的 ' + obj.userName + ' （' + obj.email + ') ，恭喜您成为 <strong>' + settings.SITETITLE + '</strong> 的新用户！ 您现在可以 <a href="' + (settings.debug ? settings.SITEDOMAINTEST : settings.SITEDOMAIN) + '/users/login" target="_blank">点击登录</a>'
    return html
  },

  getCategoryList: function () {
    return ContentCategory.find({'parentID': '0', 'state': '1'}, 'name defaultUrl homePage').sort({'sortId': 1}).find()
  },

  getHotItemListData: function (q) {
    return Content.find(q, 'stitle').sort({'clickNum': -1}).skip(0).limit(10)
  },

  getNewItemListData: function (q) {
    return Content.find(q, 'stitle').sort({'date': -1}).skip(0).limit(10)
  },

  getRecommendListData: function (cateQuery, contentCount) {
    return Content.find(cateQuery).sort({'date': -1}).skip(Math.floor(contentCount * Math.random())).limit(4)
  },

  getFriendLink: function () {
    return Ads.find({'type': '2'}).populate('items').exec()
  },

  getMessageList: function (contentId) {
    return Message.find({'contentId': contentId}).sort({'date': 1}).populate('author').populate('replyAuthor').populate('adminAuthor').exec()
  },

  sendSystemNoticeByType: function (req, res, type, value) {
    var noticeObj
    if (type == 'reg') {
      noticeObj = {
        type: '2',
        systemSender: 'doraCMS',
        title: '用户注册提醒',
        content: '新增注册用户 ' + value,
        action: type
      }
    }else if (type == 'msg') {
      noticeObj = {
        type: '2',
        sender: value.author,
        title: '用户留言提醒',
        content: '用户 ' + value.author.userName + ' 给您留言啦！',
        action: type
      }
    }
    Notify.sendSystemNotice(res, noticeObj, function (users, notify) {
      UserNotify.addNotifyByUsers(res, users, notify)
    })
  },

  setDataForIndex: function (req, res, params , staticforder, defaultTempPath) {
    var requireField = 'title date commentNum discription clickNum isTop sImg tags'
    var documentList = DbOpt.getPaginationResult(Content, req, res, params, requireField)
    var tagsData = DbOpt.getDatasByParam(ContentTags, req, res, {})
    return {
      siteConfig: this.siteInfos('首页'),
      documentList: documentList.docs,
      hotItemListData: this.getHotItemListData({'state': true}),
      friendLinkData: this.getFriendLink(),
      cateTypes: this.getCategoryList(),
      cateInfo: '',
      tagsData: tagsData,
      pageInfo: documentList.pageInfo,
      pageType: 'index',
      logined: isLogined(req),
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },
  // var currentCateList = ContentCategory.find({parentID: req.query.parentID, state: '1'}).sort({'sortId': 1})
  setDataForHtmlHome: function (req, res, params , staticforder, defaultTempPath,targetPath) {
    var searchRecommendForManufacture=SearchRecommend.findOne({type : "Manufacture",where : "hotsearch"})
    var searchRecommendForMaterial=SearchRecommend.findOne({type : "Material",where : "hotsearch"})
    var searchRecommendForEquipment=SearchRecommend.findOne({type : "Equipment",where : "hotsearch"})
    var searchRecommendForDemands=SearchRecommend.findOne({type : "Demands",where : "hotsearch"})
    var searchRecommendForFix = Install.findOne({type: 'Install',where: 'hotsearch'})
    var searchRecommendForSearch=SearchRecommend.findOne({where : "searchbox"})
    var currentCateList = ContentCategory.find({parentID: req.query.parentID, state: '1'}).sort({'sortId': 1})
    var parentIdCateList = ContentCategory.find({parentID: 'H124B2BCx', state: '1'}).sort({'sortId': 1})
    var parentIdCateList01 = ContentCategory.find({parentID: 'HyD8BhH0x', state: '1'}).sort({'sortId': 1})
    var parentIdCateList02 = ContentCategory.find({parentID: 'BJJ_r2BRg', state: '1'}).sort({'sortId': 1})
    var SlideList = Slide.find({where: 'homepage',isShowing: true}).sort({'createdAt': -1}).limit(6)
    var categoryRecommendListForManufacture = CategoryRecommend.findOne({type: 'Manufacture'})
    var categoryRecommendListForMaterial = CategoryRecommend.findOne({type: 'Material'})
    var categoryRecommendListForEquipment = CategoryRecommend.findOne({type: 'Equipment'})
    var categorySettingListForManufacture = CategorySetting.find({type: 'Manufacture'}).populate('category', 'name defaultUrl')
    var categorySettingListForMaterial = CategorySetting.find({type: 'Material'}).populate('category', 'name defaultUrl')
    var categorySettingListForEquipment = CategorySetting.find({type: 'Equipment'}).populate('category', 'name defaultUrl')
    var promotionForAll=PubHistory.aggregate([{ $match: {promotionEnd:{$gt:new Date()}} }, { $sample: { size: 24 } } ])
    var contentList=Content.find({isDeleted:false}).sort({createdAt:-1}).limit(4)
    var newsList=News.find({isDeleted:false}).sort({newsDate:-1}).limit(8)
    var funnyDataForToday=FunnyData.findOne({}).sort({createdAt:-1})
    var funnyData4Res=FunnyData4Res.findOne({}).sort({createdAt:-1})
    FunnyData.find({createdAt: {$gte:moment().startOf('week').add(1,'d')}},function(err,funnyDataForweekData){
      var funnyDataForweek={}
      var newResCount=0
      var newUserCount=0
      var searchCount=0
      var pageViewCount=0
      for(var i=0;i<funnyDataForweekData.length;i++){
        newResCount+=funnyDataForweekData[i].newResCount
        newUserCount+=funnyDataForweekData[i].newUserCount
        searchCount+=funnyDataForweekData[i].searchCount
        pageViewCount+=funnyDataForweekData[i].pageViewCount
      }
      funnyDataForweek.newResCount=newResCount
      funnyDataForweek.newUserCount=newUserCount
      funnyDataForweek.searchCount=searchCount
      funnyDataForweek.pageViewCount=pageViewCount
      FunnyData.find({createdAt: {$gte:moment().startOf('month')}},function(err,funnyDataForMonthData){
        var funnyDataForMonth={}
        var newResCount=0
        var newUserCount=0
        var searchCount=0
        var pageViewCount=0
        for(var i=0;i<funnyDataForMonthData.length;i++){
          newResCount+=funnyDataForMonthData[i].newResCount
          newUserCount+=funnyDataForMonthData[i].newUserCount
          searchCount+=funnyDataForMonthData[i].searchCount
          pageViewCount+=funnyDataForMonthData[i].pageViewCount
        }
        funnyDataForMonth.newResCount=newResCount
        funnyDataForMonth.newUserCount=newUserCount
        funnyDataForMonth.searchCount=searchCount
        funnyDataForMonth.pageViewCount=pageViewCount
        BrandPromotion.aggregate([{ $match: {promotionEnd:{$gt:new Date()}} }, { $sample: { size: 18 } } ])
            .exec(function (err,aggrDocs) {
              if (err) {
                res.end(err)
              } else if (!_.isEmpty(aggrDocs)) {
                var opts = [{
                  path: 'company',
                  model: 'Company'
                }]
                BrandPromotion.populate(aggrDocs, opts, function(err, companyList) {
                  var ebookData = Ebook.find({}).sort({createdAt:-1})
                  res.render(targetPath , {
                    siteConfig: siteFunc.siteInfos('制作宝'),
                    title: '制作宝 - 专业的广告制作服务平台',
                    documentList: params.docs,
                    ebookData: ebookData,
                    companyList: companyList,
                    promotionForAll: promotionForAll,
                    searchRecommendForManufacture: searchRecommendForManufacture,
                    searchRecommendForMaterial: searchRecommendForMaterial,
                    searchRecommendForEquipment: searchRecommendForEquipment,
                    searchRecommendForDemands: searchRecommendForDemands,
                    searchRecommendForSearch: searchRecommendForSearch,
                    searchRecommendForFix: searchRecommendForFix,
                    cateList: siteFunc.getCategoryList(),
                    parentIdCateList: parentIdCateList,
                    parentIdCateList01: parentIdCateList01,
                    parentIdCateList02: parentIdCateList02,
                    cateTypes: siteFunc.getCategoryList(),
                    slideList: SlideList,
                    contentList:contentList,
                    newsList:newsList,
                    funnyDataForToday:funnyDataForToday,
                    funnyDataForweek:funnyDataForweek,
                    funnyDataForMonth:funnyDataForMonth,
                    funnyData4Res:funnyData4Res,
                    categoryRecommendListForManufacture: categoryRecommendListForManufacture,
                    categoryRecommendListForMaterial: categoryRecommendListForMaterial,
                    categoryRecommendListForEquipment: categoryRecommendListForEquipment,
                    categorySettingListForManufacture: categorySettingListForManufacture,
                    categorySettingListForMaterial: categorySettingListForMaterial,
                    categorySettingListForEquipment: categorySettingListForEquipment,
                    logined: req.session.logined,
                    staticforder: staticforder,
                    layout: defaultTempPath
                  })
                })
              }
            })
      })
    })

  },

  setDataForHtmlSiteMap: function (req, res, params , staticforder, defaultTempPath) {
    var ebookData=Ebook.find({}).sort({createdAt:-1})

    return {
      siteConfig: siteFunc.siteInfos('制作宝'),
      documentList: params.docs,
      ebookData:ebookData,
      cateTypes: siteFunc.getCategoryList(),
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },
  setDataForsafetySet: function (req, res, params , staticforder, defaultTempPath) {
    var ebookData=Ebook.find({}).sort({createdAt:-1})

    return {
      siteConfig: siteFunc.siteInfos('制作宝'),
      documentList: params.docs,
      ebookData:ebookData,
      user:User.findOne({_id:req.session.user._id}),
      cateTypes: siteFunc.getCategoryList(),
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },
  setDataForUserLogin: function (req, res, params , staticforder, defaultTempPath) {
    var ebookData=Ebook.find({}).sort({createdAt:-1})

    return {
      siteConfig: siteFunc.siteInfos('制作宝'),
      documentList: params.docs,
      ebookData:ebookData,
      title:'制作宝 - 欢迎您回来',
      cateTypes: siteFunc.getCategoryList(),
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },
  setDataForUserReg: function (req, res, params , staticforder, defaultTempPath) {
    var ebookData=Ebook.find({}).sort({createdAt:-1})

    return {
      siteConfig: siteFunc.siteInfos('制作宝'),
      documentList: params.docs,
      ebookData:ebookData,
      title:'制作宝 - 免费注册',
      cateTypes: siteFunc.getCategoryList(),
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },
  setDataForPasswordReset: function (req, res, params , staticforder, defaultTempPath) {
    var ebookData=Ebook.find({}).sort({createdAt:-1})

    return {
      siteConfig: siteFunc.siteInfos('制作宝'),
      documentList: params.docs,
      ebookData:ebookData,
      title:' 忘记密码-制作宝 ',
      cateTypes: siteFunc.getCategoryList(),
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },
  setDataForMyPromote: function (req, res, params , staticforder, defaultTempPath,targetPath) {
    PrecisePromotion.find({user:req.session.user._id,promotionEnd:{$gt:new Date()}}).sort({createdAt: -1}).populate('category').populate('pubHistory').populate({path: 'bill',match: {billState:"已支付"}}).exec(function (err, docs) {
      if (err) {
        res.end(err)
      } else if (!_.isEmpty(docs)) {
        var newDocs = []
        for (var idx in docs) {
          if (docs[idx].bill) {
            newDocs.push(docs[idx])
          }
        }
        res.render(targetPath, {
          siteConfig: siteFunc.siteInfos('制作宝'),
          documentList: params.docs,
          precisePromotion: newDocs,
          cateTypes: siteFunc.getCategoryList(),
          logined: req.session.logined,
          moment:moment,
          staticforder: staticforder,
          layout: defaultTempPath
        })
      }else{
        res.render(targetPath, {
          siteConfig: siteFunc.siteInfos('制作宝'),
          documentList: params.docs,
          precisePromotion: [],
          cateTypes: siteFunc.getCategoryList(),
          logined: req.session.logined,
          moment:moment,
          staticforder: staticforder,
          layout: defaultTempPath
        })
      }
    })
  },
  setDataForRecentDemandAndResource: function (req, res, params, staticforder, defaultTempPath,targetPath) {
    req.query.limit = 5
    var isBrand=false;
    BrandPromotion.findOne({user:req.session.user._id,promotionEnd:{$gt:new Date()}},function (err,doc) {
      if(!_.isEmpty(doc)){
        isBrand=true
      }
      res.render(targetPath,  {
        siteConfig: siteFunc.siteInfos('制作宝'),
        company: Company.findOne({user: req.session.user._id}),
        isBrand:isBrand,
        resCount: PubHistory.find({user: req.session.user._id, isDeleted: false, isShowing: true}).count(),
        companyIdentify: CompanyIdentify.findOne({user: req.session.user._id}),
        idCardIdentify: IdCardIdentify.findOne({user: req.session.user._id}),
        msgForUserNoReadCount:UserNotify.find({user:req.session.user._id,isRead:false}).count(),
        logined: req.session.logined,
        staticforder: staticforder,
        layout: defaultTempPath
    })
    })

  },

  setDataForMyActivity: function (req, res, params , staticforder, defaultTempPath) {
    return {
      siteConfig: siteFunc.siteInfos('制作宝'),
      inviteCode: InviteCode.findOne({user: req.session.user._id}),
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },

  setDataForMyOrders: function (req, res, params , staticforder, defaultTempPath) {
    return {
      siteConfig: siteFunc.siteInfos('制作宝'),
      bills: Bill.find({user: req.session.user._id}, {billNum: 1, billName: 1, billType: 1, payType: 1, price: 1, billState: 1}).sort({createdAt:-1}),
      logined: req.session.logined,
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },

  setDataForCate: function (req, res, params , staticforder, defaultTempPath) {
    var requireField = 'title date commentNum discription clickNum comments isTop sImg'
    var documentList = DbOpt.getPaginationResult(Content, req, res, params.contentQuery, requireField)
    var currentCateList = ContentCategory.find(params.cateQuery).sort({'sortId': 1})
    var tagsData = DbOpt.getDatasByParam(ContentTags, req, res, {})
    return {
      siteConfig: this.siteInfos(params.result.name, params.result.comments, params.result.keywords),
      documentList: documentList.docs,
      currentCateList: currentCateList,
      hotItemListData: this.getHotItemListData(params.contentQuery),
      friendLinkData: this.getFriendLink(),
      tagsData: tagsData,
      cateInfo: params.result,
      cateTypes: this.getCategoryList(),
      pageInfo: documentList.pageInfo,
      pageType: 'cate',
      logined: isLogined(req),
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },

  setDetailInfo: function (req, res, params , staticforder, defaultTempPath) {
    var currentCateList = ContentCategory.find(params.cateQuery).sort({'sortId': 1})
    // var tagsData = DbOpt.getDatasByParam(ContentTags, req, res, {})
    return {
      siteConfig: this.siteInfos(params.detail.title, params.detail.discription, params.detail.keywords),
      cateTypes: this.getCategoryList(),
      currentCateList: currentCateList,
      hotItemListData: this.getHotItemListData({'state': true}),
      newItemListData: this.getNewItemListData({}),
      friendLinkData: this.getFriendLink(),
      reCommendListData: this.getRecommendListData(params.cateQuery, params.count),
      documentInfo: params.detail,
      messageList: this.getMessageList(params.detail._id),
      pageType: 'detail',
      logined: isLogined(req),
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },

  setDataForSearch: function (req, res, params, staticforder, defaultTempPath) {
    req.query.searchKey = params.searchKey
    var requireField = 'title date commentNum discription clickNum sImg'
    var documentList = DbOpt.getPaginationResult(Content, req, res, params.query, requireField)
    return {
      siteConfig: this.siteInfos('文档搜索'),
      documentList: documentList.docs,
      cateTypes: this.getCategoryList(),
      cateInfo: '',
      pageInfo: documentList.pageInfo,
      pageType: 'search',
      logined: isLogined(req),
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },

  setDataForError: function (req, res, params , staticforder, defaultTempPath) {
    return {
      siteConfig: this.siteInfos(params.info),
      cateTypes: this.getCategoryList(),
      errInfo: params.message,
      pageType: 'error',
      title:'找不到页面-制作宝',
      logined: isLogined(req),
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },

  setDataForUser: function (req, res, params, staticforder, defaultTempPath) {
    return {
      siteConfig: this.siteInfos(params.title),
      cateTypes: this.getCategoryList(),
      userInfo: req.session.user,
      tokenId: params.tokenId,
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },

  setDataForUserReply: function (req, res, params, staticforder, defaultTempPath) {
    req.query.limit = 5
    var documentList = DbOpt.getPaginationResult(Message, req, res, {'author': req.session.user._id})
    return {
      siteConfig: this.siteInfos(params.title),
      cateTypes: this.getCategoryList(),
      userInfo: req.session.user,
      replyList: documentList.docs,
      pageInfo: documentList.pageInfo,
      pageType: 'replies',
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },

  setDataForUserNotice: function (req, res, params, staticforder, defaultTempPath) {
    req.query.limit = 10
    var documentList = UserNotify.getNotifyPaginationResult(req, res, req.session.user._id)
    return {
      siteConfig: this.siteInfos(params.title),
      cateTypes: this.getCategoryList(),
      userInfo: req.session.user,
      userNotifyListData: documentList.docs,
      pageInfo: documentList.pageInfo,
      pageType: 'notifies',
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },

  setDataForMessageManagement: function (req, res, params, staticforder, defaultTempPath) {
    var documentList = UserNotify.getNotifyPaginationResult(req, res, req.session.user._id)
    return {
      siteConfig: this.siteInfos(params.title),
      userInfo: req.session.user,
      userNotifies: documentList,
      notifyCount: UserNotify.find({user: req.session.user._id}).count(),
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },

  setDataForInfo: function (params, staticforder, defaultTempPath) {
    return {
      siteConfig: this.siteInfos('操作提示'),
      cateTypes: this.getCategoryList(),
      infoType: params.key,
      infoContent: params.value,
      staticforder: staticforder,
      layout: defaultTempPath
    }
  },

  setDataForSiteMap: function (req, res) {
    var root_path = (settings.debug ? settings.SITEDOMAINTEST : settings.SITEDOMAIN)
    var priority = 0.8
    var freq = 'weekly'
    var lastMod = moment().format('YYYY-MM-DD')
    var xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    xml += '<url>'
    xml += '<loc>' + root_path + '</loc>'
    xml += '<changefreq>daily</changefreq>'
    xml += '<lastmod>' + lastMod + '</lastmod>'
    xml += '<priority>' + 1 + '</priority>'
    xml += '</url>'
    cache.get(settings.session_secret + '_sitemap', function (siteMapData) {
      if (siteMapData) { // 缓存已建立
        res.end(siteMapData)
      }else {
        PubHistory.find({}, 'resType resNum', function (err, cates) {
          if (err) {
            console.log(err)
          } else {
            cates.forEach(function (cate) {
              if(cate.resType=="Manufacture"){
                xml += '<url>'
                xml += '<loc>' + root_path + '/resource/dMake?id=' + cate.resNum +'</loc>'
                xml += '<changefreq>daily</changefreq>'
                xml += '<lastmod>' + lastMod + '</lastmod>'
                xml += '<priority>0.8</priority>'
                xml += '</url>'
              }else if(cate.resType=="Material"){
                xml += '<url>'
                xml += '<loc>' + root_path + '/resource/dmaterial?id=' + cate.resNum +'</loc>'
                xml += '<changefreq>daily</changefreq>'
                xml += '<lastmod>' + lastMod + '</lastmod>'
                xml += '<priority>0.8</priority>'
                xml += '</url>'
              }else if(cate.resType=="Equipment"){
                xml += '<url>'
                xml += '<loc>' + root_path + '/resource/dMachine?id=' + cate.resNum +'</loc>'
                xml += '<changefreq>daily</changefreq>'
                xml += '<lastmod>' + lastMod + '</lastmod>'
                xml += '<priority>0.8</priority>'
                xml += '</url>'
              }
            })

            Content.find({}, 'contentNum', function (err, contentLists) {
              if (err) {
                console.log(err)
              } else {
                contentLists.forEach(function (post) {
                  xml += '<url>'
                  xml += '<loc>' + root_path + '/resource/newscontent?id=' + post.contentNum + '</loc>'
                  xml += '<changefreq>daily</changefreq>'
                  xml += '<lastmod>' + lastMod + '</lastmod>'
                  xml += '<priority>0.6</priority>'
                  xml += '</url>'
                })
                xml += '</urlset>'
                // 缓存一天
                cache.set(settings.session_secret + '_sitemap', xml, 1000 * 60 * 60 * 24)
                res.end(xml)
              }
            })
          }
        })
      }
    })
  },
  // 缓存文章总数，避免多次查询
  getContentsCount: function (req, res, cateParentId, cateQuery, callBack) {
    cache.get(settings.session_secret + '_' + cateParentId + '_contentCount', function (contentCount) {
      if (contentCount) {
        callBack(contentCount)
      }else {
        Content.count(cateQuery, function (err, count) {
          if (err) {
            res.end(err)
          }else {
            cache.set(settings.session_secret + '_' + cateParentId + '_contentCount', count, 1000 * 60 * 60 * 24); // 缓存一天
            callBack(count)
          }
        })
      }
    })
  },
  // 根据id获取模板单元的forder
  getTempItemById: function (defatulTemp, id) {
    var targetForder = ''
    var targetTemps = defatulTemp.items
    for (var i = 0;i < targetTemps.length;i++) {
      var temp = targetTemps[i]
      if (temp && temp._id == id) {
        targetForder = temp.forder
        break
      }
    }
    return targetForder
  },
  // 认证管理
  setDataForCertificationManagement: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    var su = req.session.user
    var infoCertificationManagement = {}
    if (_.isEmpty(su)) {
      res.end(settings.system_illegal_param)
    } else {
      IdCardIdentify.findOne({user: su._id}, function (err, idCardIdentify) {
        if (err) {
          res.end(err)
        }else {
          if (idCardIdentify == null) {
            infoCertificationManagement.idCardIdentifystatus = null
          }else {
            infoCertificationManagement.idCardIdentifystatus = idCardIdentify.status
          }
          CompanyIdentify.findOne({user: su._id}, function (err, companyIdentify) {
            if (err) {
              res.end(err)
            }else {
              if (companyIdentify == null) {
                infoCertificationManagement.companyIdentifystatus = null
              }else {
                infoCertificationManagement.companyIdentifystatus = companyIdentify.status
              }
              res.render(targetPath, {
                siteConfig: siteFunc.siteInfos('制作宝'),
                documentList: params.docs,
                cateTypes: siteFunc.getCategoryList(),
                infoCertificationManagement: infoCertificationManagement,
                logined: req.session.logined,
                staticforder: staticforder,
                layout: defaultTempPath
              })
            }
          })
        }
      })
    }
  },

  setDataForQqweichartBinding: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    var qqweichartBinding = {}
    var su = req.session.user
    if (_.isEmpty(su)) {
      res.end(settings.system_illegal_param)
    } else {
      User.findOne({_id: su._id}, function (err, user) {
        if (err) {
          res.end(err)
        } else {
          qqweichartBinding.qqBind = user.qqBind
          qqweichartBinding.wechatBind = user.wechatBind
          res.render(targetPath, {
            siteConfig: siteFunc.siteInfos('制作宝'),
            documentList: params.docs,
            cateTypes: siteFunc.getCategoryList(),
            qqweichartBinding: qqweichartBinding,
            logined: req.session.logined,
            staticforder: staticforder,
            layout: defaultTempPath
          })
        }
      })
    }
  },

  setDataForIdentifying2: function (req, res, params , staticforder, defaultTempPath, targetPath) {
    var Identifying2Data = {}
    var su = req.session.user
    if (_.isEmpty(su)) {
      res.end(settings.system_illegal_param)
    } else {
      IdCardIdentify.findOne({user: su._id}, function (err, idCardIdentify) {
        if (err) {
          res.end(err)
        }else {
          res.render(targetPath, {
            siteConfig: siteFunc.siteInfos('制作宝'),
            documentList: params.docs,
            cateTypes: siteFunc.getCategoryList(),
            Identifying2Data: idCardIdentify,
            logined: req.session.logined,
            staticforder: staticforder,
            layout: defaultTempPath
          })
        }
      })
    }
  },


  // 获取默认模板中的默认模板单元
  getDefaultTempItem: function (temp) {
    var defaultTempForder = ''
    if (temp) {
      var targetTemps = temp.items
      for (var i = 0;i < targetTemps.length;i++) {
        var temp = targetTemps[i]
        if (temp && temp.isDefault) {
          defaultTempForder = temp.forder
          break
        }
      }
    }
    return defaultTempForder
  },
  // 缓存前台模板
  getFrontTemplate: function (req, res, callBack) {
    cache.get(settings.session_secret + '_siteTemplate', function (siteTemplate) {
      if (siteTemplate) {
        callBack(siteTemplate)
      }else {
        ContentTemplate.getDefaultTemp(res, function (doc) {
          if (doc) {
            cache.set(settings.session_secret + '_siteTemplate', doc , 1000 * 60 * 60 * 24); // 缓存一天
          }
          callBack(doc)
        })
      }
    })
  },
  // 根据模板获取跳转链接
  renderToTargetPageByType: function (req, res, type, params) {
    this.getFrontTemplate(req, res, function (temp) {
      var targetPath
      if (temp) {
        var defaultTempPathForLoginAndReg = settings.SYSTEMTEMPFORDER + temp.alias + '/public/layoutForloginAndReg'
        var defaultTempPath = settings.SYSTEMTEMPFORDER + temp.alias + '/public/layoutForloginAndReg'
        var layoutForAccountSet = settings.SYSTEMTEMPFORDER + temp.alias + '/public/layoutForAccountSet'
        var layoutPrivateCenter = settings.SYSTEMTEMPFORDER + temp.alias + '/public/layoutPrivateCenter'
        var layoutForIndexSet = settings.SYSTEMTEMPFORDER + temp.alias + '/public/layoutForIndex'
        var layoutForsecondDemand = settings.SYSTEMTEMPFORDER + temp.alias + '/public/layoutForsecondDemand'

        if (type == 'index') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/index'
          res.render(targetPath , siteFunc.setDataForIndex(req, res, {'type': 'content','state': true} , temp.alias, defaultTempPath))
        }else if (type == 'userHome') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/userHome'
          siteFunc.setDataForHtmlHome(req, res, params , temp.alias, layoutForIndexSet,targetPath)
        }else if (type == 'userHome2') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/userHome2'
          siteFunc.setDataForHtmlHome(req, res, params , temp.alias, layoutForIndexSet,targetPath)
        }else if (type == 'userLogin') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/userLogin'
          res.render(targetPath , siteFunc.setDataForUserLogin(req, res, params , temp.alias, defaultTempPathForLoginAndReg))
        }else if (type == 'userReg') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/userReg'
          res.render(targetPath , siteFunc.setDataForUserReg(req, res, params , temp.alias, defaultTempPathForLoginAndReg))
        }else if (type == 'passwordReset') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/passwordReset'
          res.render(targetPath , siteFunc.setDataForPasswordReset(req, res, params , temp.alias, defaultTempPathForLoginAndReg))
        }else if (type == 'confirmUser') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/confirmUser'
          res.render(targetPath , siteFunc.setDataForPasswordReset(req, res, params , temp.alias, defaultTempPathForLoginAndReg))
        }else if (type == 'setPassword') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/setPassword'
          res.render(targetPath , siteFunc.setDataForPasswordReset(req, res, params , temp.alias, defaultTempPathForLoginAndReg))
        }else if (type == 'helperCenter') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/helperCenter'
          res.render(targetPath , siteFunc.setDataForHtmlSiteMap(req, res, params , temp.alias))
        }else if (type == 'transition') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/transition'
          res.render(targetPath , siteFunc.setDataForHtmlSiteMap(req, res, params , temp.alias))
        }else if (type == 'messageManagement') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/messageManagement'
          res.render(targetPath, siteFunc.setDataForMessageManagement(req, res, params, temp.alias, layoutForAccountSet))
        }else if (type == 'certificationManagement') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/certificationManagement'
          siteFunc.setDataForCertificationManagement(req, res, params, temp.alias, layoutForAccountSet, targetPath)
        // res.render(targetPath, data)
        }else if (type == 'identifying1') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/identifying1'
          res.render(targetPath, siteFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, layoutForAccountSet))
        }else if (type == 'identifying2') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/identifying2'
          siteFunc.setDataForIdentifying2(req, res, params, temp.alias, layoutForAccountSet, targetPath)
        }else if (type == 'identifying3') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/identifying3'
          siteFunc.setDataForIdentifying2(req, res, params, temp.alias, layoutForAccountSet, targetPath)
        }else if (type == 'privateInfo') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/privateInfo'
          res.render(targetPath, siteFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, layoutForAccountSet))
        }else if (type == 'qqweichartBinding') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/qqweichartBinding'
          siteFunc.setDataForQqweichartBinding(req, res, params, temp.alias, layoutForAccountSet, targetPath)
        }else if (type == 'confirmIdForEmail') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/confirmIdForEmail'
          res.render(targetPath, siteFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, layoutForAccountSet))
        }else if (type == 'emailBinding1') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/emailBinding1'
          res.render(targetPath, siteFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, layoutForAccountSet))
        }else if (type == 'emailBinding2') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/emailBinding2'
          res.render(targetPath, siteFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, layoutForAccountSet))
        }else if (type == 'emailBinding3') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/emailBinding3'
          res.render(targetPath, siteFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, layoutForAccountSet))
        }else if (type == 'mobileBinding1') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/mobileBinding1'
          res.render(targetPath, siteFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, layoutForAccountSet))
        }else if (type == 'mobileBinding2') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/mobileBinding2'
          res.render(targetPath, siteFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, layoutForAccountSet))
        }else if (type == 'mobileBinding3') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/mobileBinding3'
          res.render(targetPath, siteFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, layoutForAccountSet))
        }else if (type == 'myCollect') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/myCollect'
          res.render(targetPath, siteFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, layoutPrivateCenter))
        }else if (type == 'myDemand') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/myDemand'
          res.render(targetPath, siteFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, layoutPrivateCenter))
        }else if (type == 'myFixCenter') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/myFixCenter'
          res.render(targetPath, siteFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, layoutPrivateCenter))
        }else if (type == 'myPromote') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/myPromote'
          siteFunc.setDataForMyPromote(req, res, params, temp.alias, layoutPrivateCenter,targetPath)
        }else if (type == 'myResource') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/myResource'
          res.render(targetPath, siteFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, layoutPrivateCenter))
        }else if (type == 'recentDemandAndResource') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/recentDemandAndResource'
          siteFunc.setDataForRecentDemandAndResource(req, res, params, temp.alias, layoutPrivateCenter,targetPath)
        }else if (type == 'myOrders') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/myOrders'
          res.render(targetPath, siteFunc.setDataForMyOrders(req, res, params, temp.alias, layoutPrivateCenter))
        }else if (type == 'myActivity') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/myActivity'
          res.render(targetPath, siteFunc.setDataForMyActivity(req, res, params, temp.alias, layoutPrivateCenter))
        }else if (type == 'specificActivity') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/specificActivity'
          res.render(targetPath, siteFunc.setDataForHtmlSiteMap(req, res, params, temp.alias))
        }else if (type == 'cityPartner') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/cityPartner'
          res.render(targetPath, siteFunc.setDataForHtmlSiteMap(req, res, params, temp.alias))
        }else if (type == 'safetySet') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/safetySet'
          res.render(targetPath, siteFunc.setDataForsafetySet(req, res, params, temp.alias, layoutForAccountSet))
        }else if (type == 'modifyPassword') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/modifyPassword'
          res.render(targetPath, siteFunc.setDataForHtmlSiteMap(req, res, params, temp.alias, layoutForAccountSet))
        }else if (type == 'contentList') {
          if (params.result.contentTemp) {
            targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/' + params.result.contentTemp.forder + '/contentList'
          }else {
            targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/' + siteFunc.getDefaultTempItem(temp) + '/contentList'
          }
          res.render(targetPath, siteFunc.setDataForCate(req, res, params, temp.alias, defaultTempPath))
        }else if (type == 'detail') {
          if (params.detail.category.contentTemp) {
            var targetForder = siteFunc.getTempItemById(temp, params.detail.category.contentTemp)
            targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/' + targetForder + '/detail'
          }else {
            targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/' + siteFunc.getDefaultTempItem(temp) + '/detail'
          }
          res.render(targetPath , siteFunc.setDetailInfo(req, res, params , temp.alias, defaultTempPath))
        }else if (type == 'user') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/' + params.page
          res.render(targetPath, siteFunc.setDataForUser(req, res, params , temp.alias, defaultTempPath))
        }else if (type == 'userNotice') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/' + params.page
          res.render(targetPath, siteFunc.setDataForUserNotice(req, res, params, temp.alias, defaultTempPath))
        }else if (type == 'userInfo') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/' + params.page
          res.render(targetPath, siteFunc.setDataForInfo(params, temp.alias, defaultTempPath))
        }else if (type == 'userReply') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/' + params.page
          res.render(targetPath, siteFunc.setDataForUserReply(req, res, params, temp.alias, defaultTempPath))
        }else if (type == 'search') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/public/' + params.page
          res.render(targetPath, siteFunc.setDataForSearch(req, res, params, temp.alias, defaultTempPath))
        }else if (type == 'error') {
          targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/public/' + params.page
          res.render(targetPath, siteFunc.setDataForError(req, res, params, temp.alias, defaultTempPath))
        }
      }else {
        res.writeHeader(200, {'Content-Type': 'text/javascript;charset=UTF-8'})
        res.end('亲爱哒，请先在后台安装并启用模板喔~!')
      }
    })
  }

}
module.exports = siteFunc
