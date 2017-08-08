;(function(angular,$){

	var layoutNewslist=angular.module('layoutNewslist');

	layoutNewslist.controller('layoutforNewslist',["$scope","$window","$http",function ($scope,$window,$http) {
		var postData = function() {
			$http.post("/searchArticleFilter", {
				page: $scope.bigCurrentPage,
				limit: $scope.itemsPerPage
			}).success(function(res) {
				if (res !== "查询为空") {
					$scope.dataList = res.docs;
					$scope.bigTotalItems = res.pageInfo.totalItems;
					$scope.isChange = new Date();
				} else {
					$scope.dataList = []
					$scope.bigTotalItems = 0
					$scope.warningInfoData = '暂无数据'
				}
			})
		}
		$scope.maxSize = 5;
		$scope.itemsPerPage = 5;
		$scope.bigCurrentPage = 1;
		$scope.pageChanged = function(currentPage) {
			postData();
		};
		postData()
	}])


	layoutNewslist.controller('layoutforreportslist',["$scope","$window","$http",function ($scope,$window,$http) {
		var postData = function() {
			$http.post("/searchNewsFilter", {
				page: $scope.bigCurrentPage,
				limit: $scope.itemsPerPage
			}).success(function(res) {
				if (res !== "查询为空") {
					$scope.dataList = res.docs;
					$scope.bigTotalItems = res.pageInfo.totalItems;
					$scope.isChange = new Date();
				} else {
					$scope.dataList = []
					$scope.bigTotalItems = 0
					$scope.warningInfoData = '暂无数据'
				}
			})
		}
		$scope.maxSize = 5;
		$scope.itemsPerPage = 5;
		$scope.bigCurrentPage = 1;
		$scope.pageChanged = function(currentPage) {
			postData();
		};
		postData()
	}])




})(angular,jQuery)

