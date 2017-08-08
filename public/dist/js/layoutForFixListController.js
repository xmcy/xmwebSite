;(function(angular,$){
	var layoutForFixList=angular.module('layoutForFixList');
	layoutForFixList.controller('layoutForFixListController',["$scope","$http","$window",function ($scope,$http,$window,$location) {
		/***********************************获取内容部分*/
		var postFixData=function () {
			$scope.warningInfoData=''
			$scope.resType="anzhuang";

			$http.post("/resource/queryInstalls",{
				text:$scope.text,
				page:$scope.bigCurrentPage,
				limit:$scope.itemsPerPage,
				order:$scope.order,
				region:$scope.region
			}).success(function (res) {
				if(res!=="查询为空"){
					$scope.dataList=res.docs;
					$scope.bigTotalItems=res.pageInfo.totalItems;
				}else {
					$scope.dataList=[]
					$scope.bigTotalItems=0
					$scope.warningInfoData='暂无数据'
				}
			})
		}
		/*****************************************获取内容部分*/
		var historyOder='';
		$scope.changeFixOrder=function (order) {
			var orderObj={};
			if(historyOder==order){
				orderObj[order]=-1
				historyOder='';
			}else {
				orderObj[order]=1
				historyOder=order;
			}
			$scope.order=orderObj
			postFixData();
		}
		$scope.$watch("regionData",function () {
			$scope.refreshFixList();
		})
		$scope.count=0;
		$scope.refreshFixList=function () {
			$scope.region={};
			if($scope.count>=1) {
			if(!!$scope.regionData&&$scope.regionData!=""){
				var region=$scope.regionData.split('/');
				$scope.region.province=region[0];
				$scope.region.city=region[1];
				$scope.region.district=region[2];
			}
			postFixData();
		}
			$scope.count++;
		}
		$scope.pageFixChanged = function(currentPage) {
			postFixData();
		};
		$scope.maxSize = 5;
		$scope.itemsPerPage=15;
		$scope.bigCurrentPage = 1;
		$scope.text='';
		$scope.order={refreshedAt: -1};
		$scope.region={};
		var searchParamsData=$window.location.search
		if(searchParamsData&&searchParamsData!=""&&searchParamsData.length>0){
			$scope.text=unescape($window.location.search.split('=')[1])
		}
		postFixData();
	}])

	layoutForFixList.filter('trusted', ['$sce', function($sce){
		return function(text){
			return $sce.trustAsHtml(text);
		};
	}]);
	

	layoutForshop.filter('details', function() {
		return function (input) {
			if(input.length>50){
				input.j=true
				return input.substring(0,50)+"……"
			}else {
				input.j=false
				return input
			}
		};
	})
	
	layoutForFixList.filter('contentFilter', function(){
		return function(text){
			text = text.replace(/<\/?[^>]*>/g,''); //去除HTML tag
			text = text.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
			//str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
			text=text.replace(/&nbsp;/ig,'');//去掉&nbsp;
			return text;
		};
	});

})(angular,jQuery)

