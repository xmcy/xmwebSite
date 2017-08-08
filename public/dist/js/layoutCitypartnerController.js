;(function(angular,$){

	var layoutCitypartner=angular.module('layoutCitypartner');

	layoutCitypartner.controller('layoutcitypartnerController',["$scope","$window",function ($scope,$window) {
		var arrs=$window.location.href.split('/');
		$scope.activeSlidebar=arrs[arrs.length-1];
	}])

	layoutCitypartner.controller('userinfoController',["$scope","$window",function ($scope,$window) {
		
	}])

	layoutCitypartner.controller('precisionController',["$scope","$window",function ($scope,$window) {

	}])

})(angular,jQuery)

