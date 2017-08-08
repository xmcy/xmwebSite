;(function(angular,$){
	var layoutForshopSpecific=angular.module('layoutForshopSpecific');

    layoutForshopSpecific.controller('layoutForshopSpecificController', ["$scope", "$http", "$window", function($scope, $http, $window) {
        $scope.changeType = function(typeId, typeName) {
            $scope.$broadcast("to-child", typeId, typeName)
        }
        $scope.isCollect = 0
        $scope.changeCollect = function() {
            $http.post('/collectRes', {
                type: "sp",
                title: $scope.companyName,
                url: "/users/shopSpecific1?id=" + $scope.url
            }).success(function(res) {
                if (res == "success1") {
                    swal({
                        title: "取消收藏成功",
                        type: "success",
                        confirmButtonText: "确定"
                    });
                    $scope.isCollect = "collect"
                } else if (res == "success2") {
                    swal({
                        title: "收藏成功",
                        type: "success",
                        confirmButtonText: "确定"
                    });
                    $scope.isCollect = "collected"
                } else if (res == "非法参数") {
                    swal({
                        title: "请登陆",
                        type: "error",
                        confirmButtonText: "确定"
                    });
                } else {
                    swal({
                        title: res,
                        type: "error",
                        confirmButtonText: "确定"
                    });
                }
            })
        }
    }])

    layoutForshopSpecific.controller('shopspecific1', ["$scope", "$http", "$window", function($scope, $http, $window) {

    }])

    layoutForshopSpecific.controller('shopspecific2', ["$scope", "$http", "$window", function($scope, $http, $window) {
        var postData = function() {
            $scope.warningInfoData = ''
            $http.post("/searchResFilterByBusiness", {
                page: $scope.bigCurrentPage,
                limit: $scope.itemsPerPage,
                categoryL2: $scope.categoryL2,
                userId: $scope.userId
            }).success(function(res) {
                if (res !== "查询为空") {
                    $scope.dataList = res.docs;
                    $scope.bigTotalItems = res.pageInfo.totalItems;

                } else {
                    $scope.dataList = []
                    $scope.bigTotalItems = 0
                    $scope.warningInfoData = '暂无此类资源'
                }

			})
		}
		$scope.$on('to-child', function(event,dataId,dataName) {
			$scope.categoryL2=dataId
			$scope.nowType=dataName
			$scope.bigCurrentPage = 1;
			postData()
		});
		$scope.maxSize = 5;
		$scope.itemsPerPage=10;
		$scope.bigCurrentPage = 1;
		$scope.categoryL2="";
		$scope.nowType="全部资源"
		$scope.userId=$window.location.search.split('=')[1]
		postData()
	}])
	
	layoutForshopSpecific.controller('shopComment',["$scope","$http","$window",function ($scope,$http,$window) {
		var postData=function () {
			$http.post("/tender/searchCommentsFilter",{
				page:$scope.bigCurrentPage,
				limit:$scope.itemsPerPage,
				type:$scope.type,
				userId:$scope.userId
			}).success(function (res) {
				if(res.docs){
					$scope.dataList=res.docs;
					$scope.bigTotalItems=res.pageInfo.totalItems;
					$scope.isUser=res.isUser
				}else {
					$scope.dataList=[]
					$scope.bigTotalItems=0
				}
			})
		}
		$scope.replay=function (id) {
			$scope.showArr[id]=!$scope.showArr[id]
			$scope.replaydetail.value=""
		}
		$scope.replayword=function (item) {
			$http.post("/tender/tenderJudgementBack",{
				tenderId:item.tender._id,
				returnDetail:$scope.replaydetail.value
			}).success(function (res) {
				if(!res.error&&res.result){
					postData()
				}else {
					console.log(res.error)
				}
			})
		}
		$scope.changeType=function (type) {
			$scope.type=type
			$scope.itemsPerPage=10;
			$scope.bigCurrentPage = 1;
			postData()
		}
		$scope.maxSize = 5;
		$scope.itemsPerPage=10;
		$scope.bigCurrentPage = 1;
		$scope.type="1";
		$scope.replaydetail={value:""}
		$scope.showArr=[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]
		$scope.userId=$window.location.search.split('=')[1]
		postData()
	}])
	
	layoutForshopSpecific.filter("toD",function () {
		return function (input) {
			var text;
			if(input=="Manufacture"){
				text="dMake"
			}else if(input=="Material"){
				text="dmaterial"
			}else if(input=="Equipment"){
				text="dMachine"
			}
			return text
		}
	})
})(angular,jQuery)

