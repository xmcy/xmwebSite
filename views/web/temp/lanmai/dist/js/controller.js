(function(angular,$){
			var reg=angular.module('reg',[]);
			reg.config(function($httpProvider){

				$httpProvider.defaults.transformRequest = function(obj){
					var str = [];
					for(var p in obj){
						str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					}
					return str.join("&");
				}

				$httpProvider.defaults.headers.post = {
					'Content-Type': 'application/x-www-form-urlencoded'
				}

			});
			reg.controller('regController',["$scope","$interval","$timeout","$http",
				function($scope,$interval,$timeout,$http){
					var timing=false, time=60,timer=undefined;
					$scope.clickChange=false;
					$scope.flag=true;
					$scope.changeForm=function(id){
						$scope.flag=id===1?true:false;
					};
					$scope.messageInterval="点击发送";
					$scope.sendVerify=function () {
						// console.log("send");
						// $.post("/users/sendVerifyCode",{phoneNum:$scope.regTele},function (req) {
						// 	console.log(req);
						// })
						console.log("send");
						if (time == 60) {
							$http.post("/users/sendVerifyCode", {
								phoneNum: $scope.regTele
							}).success(function (req) {
								console.log(req);
							}).error(function (err) {
								console.log(err);
							});
							// }
						}
						$scope.interval = function () {
							if (time == 60) {
								timer = $interval(function () {
									$scope.clickChange = true;
									$scope.messageInterval = time + "s重发";
									time--;
								}, 1000);

								$timeout(function () {
									$scope.messageInterval = "重新发送";
									$scope.clickChange = false;
									$interval.cancel(timer);
									time = 60;
								}, 61000);
							}
						}
					}
				}])
	
//				reg.directive('downTick',function(){
//					return {
//						link:function(scope,elem,attrs){
//							var timing=false, time=60,timer=undefined;
//							scope.clickChange=false;
//							scope.messageInterval="点击发送";
//							scope.interval=function(){
//								if(time==60){
//									timer=$interval(function (){
//										$scope.clickChange=true;
//										$scope.messageInterval=time+"s重发";
//										time--;
//									},1000);
//															
//									$timeout(function(){
//					                    $scope.messageInterval = "重新发送";
//					                    $scope.clickChange = false;
//					                    $interval.cancel(timer);
//					                    time=60;
//									}, 61000);
//								}
//							}
//						}
//					}
//				})
			    reg.directive('pwCheck', function () {  
			        return {  
			            require: 'ngModel',  
			            link: function (scope, elem, attrs, ctrl) {  
			                var firstPassword = '#' + attrs.pwCheck;  
			                $(elem).add(firstPassword).on('keyup', function () {  
			                    scope.$apply(function () {  
			                        var v = elem.val()===$(firstPassword).val();  
			                        ctrl.$setValidity('pwmatch',v);  
			                    });  
			                });  
			            }  
			        };  
			    });  
			    var login=angular.module('login',[]);
				login.controller('loginController',["$scope","$interval","$timeout",
				function($scope,$interval,$timeout){
					var timing=false, time=60,timer=undefined;
					$scope.clickChange=false;
					$scope.flag=true;
					$scope.changeForm=function(id){
						$scope.flag=id===1?true:false;
					};
					$scope.messageInterval="点击发送";
					$scope.interval=function(){
					
					if(time==60){
						timer=$interval(function (){
							$scope.clickChange=true;
							$scope.messageInterval=time+"s重发";
							time--;
						},1000);
												
						$timeout(function(){
		                    $scope.messageInterval = "重新发送";
		                    $scope.clickChange = false;
		                    $interval.cancel(timer);
		                    time=60;
						}, 61000);
					}

					}
				}])
			    
			    
			})(angular,jQuery)