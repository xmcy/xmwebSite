!function(e,s){var t=e.module("layoutPrivateCenter");t.filter("toD",function(){return function(e){var s;return"Manufacture"==e?s="dMake":"Material"==e?s="dmaterial":"Equipment"==e&&(s="dMachine"),s}}),t.controller("layoutPrivateCenterController",["$scope","$window",function(e,s){var t=s.location.href.split("/");e.activeSlidebar=t[t.length-1]}]),t.controller("recentDemandAndResourceController",["$scope","$window","$http",function(e,s,t){e.flag=!0,e.changeForm=function(s){e.errorMessage="",e.flag=1===s,t.post("/users/queryRecentPubDemands").success(function(s){e.latestDe=s.docs})},t.post("/users/queryLatestResPub",{}).success(function(s){e.latestRes=s}),e.refresh=function(s){t.post("/users/refreshRes",{resType:s.resType,resId:s._id}).success(function(s){"success"==s&&t.post("/users/queryLatestResPub",{}).success(function(s){e.latestRes=s,swal("刷新成功","您的资源将在搜索结果中排在前面!")})})},e.triggerResTop=function(s){t.post("/users/triggerResTop",{resType:s.resType,resId:s._id}).success(function(s){"success"==s?t.post("/users/queryLatestResPub",{}).success(function(s){e.latestRes=s,swal("置顶成功","此条资源将在您的企业详情页面置顶显示!")}):swal("置顶失败")})},e.triggerResTopForNo=function(s){t.post("/users/triggerResTop",{resType:s.resType,resId:s._id}).success(function(s){"success"==s?t.post("/users/queryLatestResPub",{}).success(function(s){e.latestRes=s,swal("取消置顶成功")}):swal("取消置顶失败")})},e.delete=function(s){swal({title:"确定删除此条资源?",text:"删除将不可再恢复此条资源",type:"warning",showCancelButton:!0,confirmButtonColor:"#DD6B55",confirmButtonText:"确定",closeOnConfirm:!1},function(){t.post("/users/deleteRes",{resType:s.resType,resId:s._id}).success(function(s){"success"==s?t.post("/users/queryLatestResPub").success(function(s){e.latestRes=s,swal("删除成功")}):swal("删除失败")})})},e.triggerResShow=function(e){e.isShowing?swal({title:"确定关闭吗?",text:"关闭后其他人将看不到此条信息",type:"warning",showCancelButton:!0,confirmButtonColor:"#DD6B55",confirmButtonText:"确定",closeOnConfirm:!1},function(){t.post("/users/triggerResShow",{resType:e.resType,resId:e._id}).success(function(s){"success"==s?(e.isShowing=!e.isShowing,swal("操作成功")):swal("关闭资源失败")})}):swal({title:"确定显示吗?",text:"显示后此条信息将对其他人可见",type:"warning",showCancelButton:!0,confirmButtonColor:"#DD6B55",confirmButtonText:"确定",closeOnConfirm:!1},function(){t.post("/users/triggerResShow",{resType:e.resType,resId:e._id}).success(function(s){"success"==s?(e.isShowing=!e.isShowing,swal("操作成功")):swal("关闭资源失败")})})},e.refreshde=function(s){t.post("/users/refreshDemands",{id:s._id}).success(function(s){"success"==s?(t.post("/users/queryRecentPubDemands",{}).success(function(s){e.latestDe=s.docs}),swal("刷新资源成功","您的资源将在搜索结果中排在前面!")):swal("刷新资源失败")})},e.deletede=function(s){swal({title:"确定删除此条需求?",text:"删除将不可再恢复此条需求",type:"warning",showCancelButton:!0,confirmButtonColor:"#DD6B55",confirmButtonText:"确定",closeOnConfirm:!1},function(){t.post("/users/deleteDemands",{id:s._id}).success(function(s){"success"==s?t.post("/users/queryRecentPubDemands").success(function(s){e.latestDe=s.docs,swal("删除成功")}):swal("删除失败")})})},e.triggerDeShow=function(e){e.isShowing?swal({title:"确定关闭吗?",text:"关闭后其他人将看不到此条信息",type:"warning",showCancelButton:!0,confirmButtonColor:"#DD6B55",confirmButtonText:"确定",closeOnConfirm:!1},function(){t.post("/users/triggerDemandsShow",{id:e._id}).success(function(s){"success"==s?(e.isShowing=!e.isShowing,swal("操作成功")):swal("关闭资源失败")})}):swal({title:"确定显示吗?",text:"显示后此条信息将对其他人可见",type:"warning",showCancelButton:!0,confirmButtonColor:"#DD6B55",confirmButtonText:"确定",closeOnConfirm:!1},function(){t.post("/users/triggerDemandsShow",{id:e._id}).success(function(s){"success"==s?(e.isShowing=!e.isShowing,swal("操作成功")):swal("关闭资源失败")})})}}]),t.controller("myDemandController",["$scope","$window","$http",function(e,s,t){e.maxSize=5,e.itemsPerPage=8,e.bigCurrentPage=1;var o=function(){e.messageFor="",t.post("/users/queryPubDemands",{page:e.bigCurrentPage,limit:e.itemsPerPage}).success(function(s){"查询为空"!==s?(e.dataList=s.docs,e.bigTotalItems=s.pageInfo.totalItems):(e.dataList=[],e.bigTotalItems=0,e.messageFor="您暂未发布此类型资源")})};o(),e.pageChanged=function(e){o()},e.refreshde=function(s){t.post("/users/refreshDemands",{id:s._id}).success(function(s){"success"==s&&(t.post("/users/queryPubDemands",{}).success(function(s){e.latestDe=s.docs}),swal("刷新资源成功","您的资源将在搜索结果中排在前面!"))})},e.deletede=function(s){swal({title:"确定删除此条需求?",text:"删除将不可再恢复此条需求",type:"warning",showCancelButton:!0,confirmButtonColor:"#DD6B55",confirmButtonText:"确定",closeOnConfirm:!1},function(){t.post("/users/deleteDemands",{id:s._id}).success(function(s){"success"==s?t.post("/users/queryPubDemands").success(function(s){e.latestDe=s.docs,swal("删除成功")}):swal("删除失败")})})},e.triggerDeShow=function(e){e.isShowing?swal({title:"确定关闭吗?",text:"关闭后其他人将看不到此条信息",type:"warning",showCancelButton:!0,confirmButtonColor:"#DD6B55",confirmButtonText:"确定",closeOnConfirm:!1},function(){t.post("/users/triggerDemandsShow",{id:e._id}).success(function(s){"success"==s?(e.isShowing=!e.isShowing,swal("操作成功")):swal("关闭资源失败")})}):swal({title:"确定显示吗?",text:"显示后此条信息将对其他人可见",type:"warning",showCancelButton:!0,confirmButtonColor:"#DD6B55",confirmButtonText:"确定",closeOnConfirm:!1},function(){t.post("/users/triggerDemandsShow",{id:e._id}).success(function(s){"success"==s?(e.isShowing=!e.isShowing,swal("操作成功")):swal("关闭资源失败")})})}}]),t.controller("myCollectController",["$scope","$window","$http",function(e,s,t){e.selectAll=!1,e.all=function(){e.selectAll=!e.selectAll},e.flag=0,e.$watch("flagggggg",function(){o()});var o=function(s){var o=s||"zy";t.post("/users/queryFavorites",{type:o,page:e.bigCurrentPage,limit:e.itemsPerPage,text:e.text}).success(function(s){"查询为空"!==s?(e.dataList=s.docs,e.bigTotalItems=s.pageInfo.totalItems):(e.dataList=[],e.bigTotalItems=0,e.messageFor="您暂未收藏资源")})};e.searchIcon=function(){o(e.border)},e.border="zy",e.collect=function(s){e.border=s,o(e.border)},e.pageChanged=function(s){o(e.border)},e.maxSize=5,e.itemsPerPage=5,e.bigCurrentPage=1,e.delArr=[],e.text="",o(),e.delete=function(s){e.delArr=[],swal({title:"确定删除此条收藏?",text:"删除将不可在恢复此条收藏",type:"warning",showCancelButton:!0,confirmButtonColor:"#DD6B55",confirmButtonText:"确定",closeOnConfirm:!1},function(){e.delArr.push(s._id),t.post("/users/deleteFavorites",{ids:e.delArr}).success(function(s){"success"==s?(swal("删除成功"),o(e.border)):swal("删除失败")})})},e.delArr=[],e.deleteMany=function(){swal({title:"确定删除这些收藏?",text:"删除将不可再恢复这些收藏",type:"warning",showCancelButton:!0,cancelButtonText:"取消",confirmButtonColor:"#DD6B55",confirmButtonText:"确定",closeOnConfirm:!1},function(){swal.close(),e.delArr=[];for(var s=0;s<e.dataList.length;s++)e.dataList[s].state&&e.delArr.push(e.dataList[s]._id);var n={ids:e.delArr};t.post("/users/deleteFavorites",n).success(function(s){"success"==s?(swal("删除成功"),o(e.border)):swal("删除失败")})})}}]),t.controller("myResourceController",["$scope","$window","$http","$interval",function(e,t,o,n){function r(e){swal({title:'<img src="/users/payPromotionBill?billNum='+e.billNum+"&payType="+e.payType+'支付&promotionType=精准推广服务">',text:"请打开"+e.payType+"扫码支付",showCancelButton:!0,confirmButtonColor:"#DD6B55",confirmButtonText:"支付完成",cancelButtonText:"支付遇到问题",closeOnConfirm:!1,closeOnCancel:!1,html:!0},function(e){e?window.location.href="/users/myOrders":swal({title:"<h1>即将为您联系在线客服</h1>",showCancelButton:!0,confirmButtonColor:"#DD6B55",cancelButtonText:"取消",confirmButtonText:"联系客服",closeOnConfirm:!1,html:!0},function(){t.location.href="/users/helperCenter#5"})})}var i=function(){e.messageFor="";var s=e.border||"Manufacture";o.post("/users/queryResByType",{resType:s,page:e.bigCurrentPage,limit:e.itemsPerPage}).success(function(s){"查询为空"!==s?(e.dataList=s.docs,e.bigTotalItems=s.pageInfo.totalItems):(e.dataList=[],e.bigTotalItems=0,e.messageFor="您暂未发布资源")})};e.border="Manufacture",e.choosedate=function(s){e.dateborder=s,1==s?e.period="1季度":2==s?e.period="半年":3==s&&(e.period="1年"),e.searchPrice()},e.chooseBorder=function(s){e.payBorder=s,1==s?e.payType="支付宝":2==s&&(e.payType="微信")},e.ChineseDistricts=[{code:"340000",address:"安徽"},{code:"110000",address:"北京"},{code:"500000",address:"重庆"},{code:"350000",address:"福建"},{code:"620000",address:"甘肃"},{code:"440000",address:"广东"},{code:"450000",address:"广西"},{code:"520000",address:"贵州"},{code:"460000",address:"海南"},{code:"130000",address:"河北"},{code:"230000",address:"黑龙江"},{code:"410000",address:"河南"},{code:"420000",address:"湖北"},{code:"430000",address:"湖南"},{code:"320000",address:"江苏"},{code:"360000",address:"江西"},{code:"220000",address:"吉林"},{code:"210000",address:"辽宁"},{code:"150000",address:"内蒙古"},{code:"640000",address:"宁夏"},{code:"630000",address:"青海"},{code:"370000",address:"山东"},{code:"310000",address:"上海"},{code:"140000",address:"山西"},{code:"610000",address:"陕西"},{code:"510000",address:"四川"},{code:"120000",address:"天津"},{code:"650000",address:"新疆"},{code:"540000",address:"西藏"},{code:"530000",address:"云南"},{code:"330000",address:"浙江"}],e.collect=function(s){e.border=s,e.index=-1,i()},e.pageChanged=function(s){e.index=-1,i()},e.maxSize=5,e.itemsPerPage=5,e.bigCurrentPage=1,e.index=-1,e.dateborder=0,e.payBorder=0,e.price=0,e.period="",e.payType="",e.regions=[],i(),e.refresh=function(s){o.post("/users/refreshRes",{resType:s.resType,resId:s._id}).success(function(s){"success"==s?(i(e.border),swal("刷新成功","您的资源将在搜索结果中排在前面!")):swal("刷新失败")})},e.triggerResTop=function(s){o.post("/users/triggerResTop",{resType:s.resType,resId:s._id}).success(function(s){"success"==s?(i(e.border),swal("置顶成功","此条资源将在您的企业详情页面置顶显示!")):swal("置顶失败")})},e.triggerResTopForNo=function(s){o.post("/users/triggerResTop",{resType:s.resType,resId:s._id}).success(function(s){"success"==s?(i(e.border),swal("取消置顶成功")):swal("取消置顶失败")})},e.delete=function(s){!s.promotionRegions||0==s.promotionRegions.length||!s.promotionEnd||s.promotionEnd<=new Date?swal({title:"确定删除此条资源?",text:"删除将不可恢复此条资源",type:"warning",showCancelButton:!0,confirmButtonColor:"#DD6B55",confirmButtonText:"确定",closeOnConfirm:!1},function(){o.post("/users/deleteRes",{resType:s.resType,resId:s._id}).success(function(s){"success"==s?(i(e.border),swal("删除成功")):swal(s)})}):swal({title:"当前资源正在推广中，请谨慎操作！",text:"删除不可恢复且不退还推广未到期费用！",type:"warning",showCancelButton:!0,confirmButtonColor:"#DD6B55",confirmButtonText:"确定",closeOnConfirm:!1},function(){o.post("/users/deleteRes",{resType:s.resType,resId:s._id}).success(function(s){"success"==s?(i(e.border),swal("删除成功")):swal(s)})})},e.triggerResShow=function(e){e.isShowing?swal({title:"确定关闭吗?",text:"关闭后其他人将看不到此条信息",type:"warning",showCancelButton:!0,confirmButtonColor:"#DD6B55",confirmButtonText:"确定",closeOnConfirm:!1},function(){o.post("/users/triggerResShow",{resId:e._id}).success(function(s){"success"==s?(swal.close(),e.isShowing=!e.isShowing):swal("删除失败")})}):swal({title:"确定显示吗?",text:"显示后此条信息将对其他人可见",type:"warning",showCancelButton:!0,confirmButtonColor:"#DD6B55",confirmButtonText:"确定",closeOnConfirm:!1},function(){o.post("/users/triggerResShow",{resType:e.resType,resId:e._id}).success(function(s){"success"==s?(swal.close(),e.isShowing=!e.isShowing):swal("关闭失败")})})},e.precisePromote=function(){c&&n.cancel(c),e.index=-1},e.searchPrice=function(){""!=e.period&&e.regions!=[]&&null!=e.regions&&s.post("/queryPrecisePromotionPrice",{period:e.period,provinceNum:e.regions.length},function(s){e.price=Math.ceil(s.price)})};var c;e.precisePromoteshow=function(o,r){e.preciseList={},e.index==o?(c&&n.cancel(c),e.index=-1):(s(".selectpicker").selectpicker("refresh"),c=n(function(){e.regions!==t.finalVal&&(e.regions=t.finalVal,e.searchPrice())},100),e.index=o,s.post("/users/queryResByTypeByOne",{pubHistoryId:r._id}).success(function(s){"object"==typeof s&&(s.result?(e.hasBill=!1,e.preciseList=r,e.$apply()):(e.hasBill=!0,e.preciseList=s,e.$apply()))}))},e.submitOrder=function(s){if(s.pubHistory)r(s.bill);else if(""!==e.period&&e.regions!==[]&&""!==e.payType){var t={period:e.period,regions:e.regions,payType:e.payType,categoryL1:s.categoryL1,pubHistoryId:s._id};o.post("/insertPro",t).success(function(s){s.payType=e.payType,r(s),e.price=Math.ceil(s.price)})}else swal("请选择完整","错误!","error")}}]),t.controller("myFixCenterController",["$scope","$window","$http","$document",function(e,s,t,o){e.maxSize=5,e.itemsPerPage=4,e.bigCurrentPage=1;var n=function(){e.messageFor="",t.post("/resource/queryUserCenterInstalls",{page:e.bigCurrentPage,limit:e.itemsPerPage}).success(function(s){"查询为空"!==s?(e.dataList=s.docs,e.bigTotalItems=s.pageInfo.totalItems):(e.dataList=[],e.bigTotalItems=0,e.messageFor="您暂未发布此类型资源")})};n(),e.pageChanged=function(e){n()},e.refreshNowFix=function(e){t.post("/resource/refreshFixRes",{resId:e._id}).success(function(e){"success"==e&&(swal("刷新资源成功","您的资源将在搜索结果中排在前面!"),n())})},e.deleteNowFix=function(e){swal({title:"确定删除此条安装?",text:"删除将不可再恢复此条需求",type:"warning",showCancelButton:!0,confirmButtonColor:"#DD6B55",confirmButtonText:"确定",closeOnConfirm:!1},function(){t.post("/resource/deleteMyInstall",{id:e._id}).success(function(e){"success"==e.result?(swal("删除成功"),n()):swal("删除失败")})})},e.showid=999,e.thisDetailShow=function(s,t){e.showid=s},e.thisDetailHide=function(s,t){e.showid=999},e.triggerDeShow=function(e){e.isShowing?swal({title:"确定关闭吗?",text:"关闭后其他人将看不到此条信息",type:"warning",showCancelButton:!0,confirmButtonColor:"#DD6B55",confirmButtonText:"确定",closeOnConfirm:!1},function(){t.post("/resource/triggerMyInstallShowing",{id:e._id}).success(function(s){"success"==s?(e.isShowing=!e.isShowing,swal("操作成功")):swal("关闭资源失败")})}):swal({title:"确定显示吗?",text:"显示后此条信息将对其他人可见",type:"warning",showCancelButton:!0,confirmButtonColor:"#DD6B55",confirmButtonText:"确定",closeOnConfirm:!1},function(){t.post("/resource/triggerMyInstallShowing",{id:e._id}).success(function(s){"success"==s?(e.isShowing=!e.isShowing,swal("操作成功")):swal("关闭资源失败")})})}}]),t.filter("valToType",[function(){return function(e){return"Manufacture"==e?"广告制作":"Material"==e?"广告材料":"Equipment"==e?"广告设备":void 0}}]),t.filter("centerTitleFilter",function(){return function(e){return e.length>8?e.substring(0,8)+"……":e}}),t.controller("myActivityController",["$scope","$window","$http",function(e,s,t){}]),t.controller("myOrdersController",["$scope","$window","$http",function(e,s,t){e.all=function(){e.selectAll=!e.selectAll}}]),t.filter("myfilter",function(){return function(e){return e?"显示中":"已关闭"}}),t.filter("topfilter",function(){return function(e){return e?"已置顶":"置顶"}}),t.filter("defilter",function(){return function(e){return e?"开":"关"}}),t.filter("timeFilter",function(){return function(e){return e.split("T")[0]}}),t.filter("noNull",function(){return function(e){return e?parseInt(e):0}}),t.filter("numPageViewFilter",function(){return function(e){return e?parseInt(e):0}}),t.filter("itemToPro",function(){return function(e){return!(!e.promotionRegions||0==e.promotionRegions.length||!e.promotionEnd||e.promotionEnd<=new Date)}}),t.filter("itemToId",function(){return function(e){return e._id}}),t.filter("joinStr",function(){return function(e){return e==[]?"":e.join(" ")}})}(angular,jQuery);