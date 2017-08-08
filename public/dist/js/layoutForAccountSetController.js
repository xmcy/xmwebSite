;(function(angular,$){
	var layoutForAccountSet=angular.module('layoutForAccountSet');

	layoutForAccountSet.controller('layoutForAccountSetController',["$scope","$window",function ($scope,$window) {
		var arrs=$window.location.href.split('/');
		$scope.activeSlidebar=arrs[arrs.length-1];
	}])

	layoutForAccountSet.controller('identifying1Controller',["$scope","$window","$http",function ($scope,$window,$http) {
			$scope.submitForm=function () {

			}
	}])

	layoutForAccountSet.controller('confirmIdForEmail',["$scope","$http","$window",function ($scope,$http,$window) {
		$scope.messageInterval="点击发送";
		$scope.clickChange=false;
		$scope.mobileBindingFirst=function () {
			$scope.errorMessage="";
			$http.post("/users/checkVerifyCode",{
				phoneNum:$scope.phoneNum,
				code:$scope.code
			}).success(function (req) {
				if(req=="success"){
					$window.location.href="/users/emailBinding";
				}else{
					$scope.errorMessage=req;
				}

			})

		}
	}])

	layoutForAccountSet.controller('mobileBinding1',["$scope","$http","$window",function ($scope,$http,$window) {
		$scope.messageInterval="点击发送";
		$scope.clickChange=false;
		$scope.mobileBindingFirst=function () {
			$scope.errorMessage="";
			$http.post("/users/checkVerifyCode",{
				phoneNum:$scope.phoneNum,
				code:$scope.code,
				postType:"bind"
			}).success(function (req) {
				if(req=="success"){
					$window.location.href="/users/mobileBinding";
				}else{
					$scope.errorMessage=req;
				}

			})

		}
	}])

	layoutForAccountSet.controller('mobileBinding2',["$scope","$http","$window",function ($scope,$http,$window) {
		$scope.messageInterval="点击发送";
		$scope.clickChange=false;
		$scope.mobileBindingFirst=function () {
			$scope.errorMessage="";
			$http.post("/users/checkVerifyCode",{
				phoneNum:$scope.phoneNum,
				code:$scope.code
			}).success(function (req) {
				if(req=="success"){
					$window.localStorage.setItem('phoneNum',"");
					$window.localStorage.setItem('phoneNum',$scope.phoneNum);
					$window.location.href="/users/mobileBinding";
				}else{
					$scope.errorMessage=req;
				}

			})

		}
	}])

	layoutForAccountSet.controller('mobileBinding3',["$scope","$window",function ($scope,$window) {
		$scope.phoneNum=$window.localStorage.getItem('phoneNum');
	}])

	layoutForAccountSet.controller('emailBinding1',["$scope","$http","$window",function ($scope,$http,$window) {
		$scope.clickChange=false;
		$scope.emailBindingFirst=function () {
			$scope.errorMessage="";
			$http.post("/users/sentBindEmail",{
				email:$scope.email
			}).success(function (req) {
				if(req=="success"){
					$window.location.href="/users/emailBinding";
				}else{
					$scope.errorMessage=req;
				}
			})
		}
	}])

	layoutForAccountSet.controller('modifyPassword',["$scope","$http","$window",function ($scope,$http,$window) {
		$scope.clickChange=false;
		$scope.flag=true;
		$scope.modifyPassword=function () {
			$scope.errorMessage="";
			$http.post("/users/resetMyPsd",{
				oldPassword:$scope.oldpwd,
				password:$scope.newpwd
			}).success(function (req) {
				if(req=="success"){
					$window.location.href="/users/safetySet";
				}else{
					$scope.errorMessage=req;
				}
			})

		}
	}])

	layoutForAccountSet.controller('certificationManagementController',["$scope","$http","$window",function ($scope,$http,$window) {
	
		$scope.flag=true;
		$scope.changeForm=function(id){
			$scope.errorMessage="";
			$scope.flag=id===1?true:false;
		};

	}])


	layoutForAccountSet.controller('messageManagementController',["$scope","$http","$window",function ($scope,$http,$window) {
		$scope.flag=true;
		$scope.appe=false;
		$scope.changeForm=function(id){
			$scope.errorMessage="";
			$scope.flag=id===1?true:false;
		};
		$scope.all=function () {
			$scope.selectAll=!$scope.selectAll;
		};
		$scope.maxSize = 5;
		$scope.itemsPerPage=5;
		$scope.bigCurrentPage = 1;
		$scope.dataList=[]
		$scope.isRead=""
		$scope.sites = [
			{site : "", url : "全部"},
			{site : false, url : "未读"},
			{site : true, url : "已读"}
		];
		$scope.isReadChange=function () {
			postData();
		}
		function postData() {
			$http.post("/users/queryUserNotifies",{isRead:$scope.isRead.site!==undefined?$scope.isRead.site:""}).success(function (res) {
				$scope.dataList=res.docs;
				$scope.bigTotalItems=res.pageInfo.totalItems;
			})
		}
		$scope.pageChanged = function() {
			postData();
		};
		$scope.deleteone=function (item) {
			$scope.delArrone=[]
			if(!item.state){
				swal("您还未选中任何消息", "error");
				return;
			}
			$scope.delArrone.push(item._id)
			swal({
					title: "确定删除此条消息?",
					text: "此条消息将不再出现在列表中",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "确定",
					cancelButtonText:"取消",
					closeOnConfirm: false
				},
				function () {
					swal.close();
					var data={
						ids:angular.toJson($scope.delArrone)
					}
					$http.post("/users/batchDelUserNotifies",data).success(function (res) {
						if(res=="success"){
							swal("删除成功", "success");
							postData()
						}
					})
				});

		}
		$scope.deleteMany=function () {
			$scope.delArrone=[]
			for(var i=0;i<$scope.dataList.length;i++){
				if($scope.dataList[i].state){
					$scope.delArrone.push($scope.dataList[i]._id)
				}
			}
			if($scope.delArrone.length<=0){
				swal("您还未选中任何消息", "error");
				return;
			}
			swal({
					title: "确定删除这些消息?",
					text: "删除此这些消息将不再出现在列表中",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "确定",
				    cancelButtonText:"取消",
					closeOnConfirm: false
				},
				function () {
					swal.close();
					var data = {
						ids: angular.toJson($scope.delArrone)
					}
					$http.post("/users/batchDelUserNotifies",data).success(function (res) {
						if(res=="success"){
							swal("删除成功", "success");
							postData()
						}
					})
				});
		}
		
		$scope.handleMany=function () {
			$scope.delArr=[]
			for(var i=0;i<$scope.dataList.length;i++){
				if($scope.dataList[i].state&&!$scope.dataList[i].isRead){
					$scope.delArr.push($scope.dataList[i]._id)
				}
			}
			if($scope.delArr.length<=0){
				swal("您选中的信息全部已读", "error");
				return;
			}
			swal({
					title: "确定设置已读?",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "确定",
					closeOnConfirm: false
				},
				function () {
					swal.close();
					var data = {
						msgIds: angular.toJson($scope.delArr)
					}
					$http.post("/users/setHasReadUserNotify",data).success(function (res) {
						if(res=="success"){
							swal("设置已读成功", "success");
							postData()
						}
					})
				});
		}


		$scope.messageShow=function (id,index) {
			if($scope.index==index){
				$scope.index=-1
			}else {
				$scope.index=index
				var ids=[id]
				$http.post("/users/setHasReadUserNotify",{msgIds:angular.toJson(ids)}).success(function (res) {
					postData();
				})
			}
		}
		postData();

	}])
	layoutForAccountSet.filter('timeFilter', function() {
		return function (input) {
			return input.split('T')[0]
		};
	})
	layoutForAccountSet.filter('noReadCount', function() {
		return function (input) {
			var count=0;
			for(var i=0,long=input.length;i<long;i++){
				if(!input[i].isRead){
					count++;
				}
			}
			return count
		};
	})
	layoutForAccountSet.filter('contentFilter', function() {
		return function (input) {
			return input.substring(3).split('<')[0]
		};
	})
	layoutForAccountSet.filter('isresdfilter', function() {
		return function (input) {
			return input?"已读":"未读";
		};
	})

})(angular,jQuery)

