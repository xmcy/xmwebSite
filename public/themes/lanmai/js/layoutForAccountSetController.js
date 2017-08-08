!function(e,n){var o=e.module("layoutForAccountSet");o.controller("layoutForAccountSetController",["$scope","$window",function(e,n){var o=n.location.href.split("/");e.activeSlidebar=o[o.length-1]}]),o.controller("identifying1Controller",["$scope","$window","$http",function(e,n,o){e.submitForm=function(){}}]),o.controller("confirmIdForEmail",["$scope","$http","$window",function(e,n,o){e.messageInterval="点击发送",e.clickChange=!1,e.mobileBindingFirst=function(){e.errorMessage="",n.post("/users/checkVerifyCode",{phoneNum:e.phoneNum,code:e.code}).success(function(n){"success"==n?o.location.href="/users/emailBinding":e.errorMessage=n})}}]),o.controller("mobileBinding1",["$scope","$http","$window",function(e,n,o){e.messageInterval="点击发送",e.clickChange=!1,e.mobileBindingFirst=function(){e.errorMessage="",n.post("/users/checkVerifyCode",{phoneNum:e.phoneNum,code:e.code,postType:"bind"}).success(function(n){"success"==n?o.location.href="/users/mobileBinding":e.errorMessage=n})}}]),o.controller("mobileBinding2",["$scope","$http","$window",function(e,n,o){e.messageInterval="点击发送",e.clickChange=!1,e.mobileBindingFirst=function(){e.errorMessage="",n.post("/users/checkVerifyCode",{phoneNum:e.phoneNum,code:e.code}).success(function(n){"success"==n?(o.localStorage.setItem("phoneNum",""),o.localStorage.setItem("phoneNum",e.phoneNum),o.location.href="/users/mobileBinding"):e.errorMessage=n})}}]),o.controller("mobileBinding3",["$scope","$window",function(e,n){e.phoneNum=n.localStorage.getItem("phoneNum")}]),o.controller("emailBinding1",["$scope","$http","$window",function(e,n,o){e.clickChange=!1,e.emailBindingFirst=function(){e.errorMessage="",n.post("/users/sentBindEmail",{email:e.email}).success(function(n){"success"==n?o.location.href="/users/emailBinding":e.errorMessage=n})}}]),o.controller("modifyPassword",["$scope","$http","$window",function(e,n,o){e.clickChange=!1,e.flag=!0,e.modifyPassword=function(){e.errorMessage="",n.post("/users/resetMyPsd",{oldPassword:e.oldpwd,password:e.newpwd}).success(function(n){"success"==n?o.location.href="/users/safetySet":e.errorMessage=n})}}]),o.controller("certificationManagementController",["$scope","$http","$window",function(e,n,o){e.flag=!0,e.changeForm=function(n){e.errorMessage="",e.flag=1===n}}]),o.controller("messageManagementController",["$scope","$http","$window",function(n,o,s){function t(){o.post("/users/queryUserNotifies",{isRead:void 0!==n.isRead.site?n.isRead.site:""}).success(function(e){n.dataList=e.docs,n.bigTotalItems=e.pageInfo.totalItems})}n.flag=!0,n.appe=!1,n.changeForm=function(e){n.errorMessage="",n.flag=1===e},n.all=function(){n.selectAll=!n.selectAll},n.maxSize=5,n.itemsPerPage=5,n.bigCurrentPage=1,n.dataList=[],n.isRead="",n.sites=[{site:"",url:"全部"},{site:!1,url:"未读"},{site:!0,url:"已读"}],n.isReadChange=function(){t()},n.pageChanged=function(){t()},n.deleteone=function(s){n.delArrone=[],s.state?(n.delArrone.push(s._id),swal({title:"确定删除此条消息?",text:"此条消息将不再出现在列表中",type:"warning",showCancelButton:!0,confirmButtonColor:"#DD6B55",confirmButtonText:"确定",cancelButtonText:"取消",closeOnConfirm:!1},function(){swal.close();var s={ids:e.toJson(n.delArrone)};o.post("/users/batchDelUserNotifies",s).success(function(e){"success"==e&&(swal("删除成功","success"),t())})})):swal("您还未选中任何消息","error")},n.deleteMany=function(){n.delArrone=[];for(var s=0;s<n.dataList.length;s++)n.dataList[s].state&&n.delArrone.push(n.dataList[s]._id);n.delArrone.length<=0?swal("您还未选中任何消息","error"):swal({title:"确定删除这些消息?",text:"删除此这些消息将不再出现在列表中",type:"warning",showCancelButton:!0,confirmButtonColor:"#DD6B55",confirmButtonText:"确定",cancelButtonText:"取消",closeOnConfirm:!1},function(){swal.close();var s={ids:e.toJson(n.delArrone)};o.post("/users/batchDelUserNotifies",s).success(function(e){"success"==e&&(swal("删除成功","success"),t())})})},n.handleMany=function(){n.delArr=[];for(var s=0;s<n.dataList.length;s++)n.dataList[s].state&&!n.dataList[s].isRead&&n.delArr.push(n.dataList[s]._id);n.delArr.length<=0?swal("您选中的信息全部已读","error"):swal({title:"确定设置已读?",showCancelButton:!0,confirmButtonColor:"#DD6B55",confirmButtonText:"确定",closeOnConfirm:!1},function(){swal.close();var s={msgIds:e.toJson(n.delArr)};o.post("/users/setHasReadUserNotify",s).success(function(e){"success"==e&&(swal("设置已读成功","success"),t())})})},n.messageShow=function(s,r){if(n.index==r)n.index=-1;else{n.index=r;var i=[s];o.post("/users/setHasReadUserNotify",{msgIds:e.toJson(i)}).success(function(e){t()})}},t()}]),o.filter("timeFilter",function(){return function(e){return e.split("T")[0]}}),o.filter("noReadCount",function(){return function(e){for(var n=0,o=0,s=e.length;o<s;o++)e[o].isRead||n++;return n}}),o.filter("contentFilter",function(){return function(e){return e.substring(3).split("<")[0]}}),o.filter("isresdfilter",function(){return function(e){return e?"已读":"未读"}})}(angular,jQuery);