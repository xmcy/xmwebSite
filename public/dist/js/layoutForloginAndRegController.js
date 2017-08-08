;(function(angular,$){
	var layoutForloginAndReg=angular.module('layoutForloginAndReg');

	layoutForloginAndReg.controller('regController',["$scope","$http","$window",
		function($scope,$http,$window){
			$scope.messageInterval="点击发送";
			$scope.postType="bind";
			$scope.clickChange=false;
			$scope.flag=true;
			$scope.regUser=function () {
				$scope.errorMessage="";
				$http.post("/users/doRegWithPhoneNum",{
					phoneNum:$scope.phoneNum,
					code:$scope.code,
					password:$scope.password,
					inviteCode:$scope.inviteCode
				}).success(function (req) {
					if(typeof req=="object"){
						if(req.result=="success"){
							$window.location.href="/users/home";
						}
					}else{
						$scope.errorMessage=req;
					}
				})
			}
			$scope.changeForm=function(id){
				$scope.flag=id===1?true:false;
			};
		}])

	layoutForloginAndReg.controller('loginController',["$scope","$http","$window",
		function($scope,$http,$window){
			$scope.messageInterval="点击发送";
			$scope.clickChange=false;
			$scope.flag=true;
			$scope.autologin=true
			$scope.changeForm=function(id){
				$scope.errorMessage="";
				$scope.flag=id===1?true:false;
			};
			$scope.loginUsersWithUsername=function () {
				$scope.errorMessage="";
				$http.post("/users/doLogin",{
					userName:$scope.userName,
					password:$scope.password,
					autologin:$scope.autologin
				}).success(function (req) {
					if(req=="success"){
						$window.location.href="/users/home";
					}else{
						$scope.errorMessage=req;
					}

				})
			}

			$scope.loginUsersWithTele=function () {
				$scope.errorMessage="";
				$http.post("/users/doLoginWithVC",{
					phoneNum:$scope.phoneNum,
					code:$scope.code,
					autologin:$scope.autologin1
				}).success(function (req) {
					if(req=="success"){
						$window.location.href="/users/home";
					}else{
						$scope.errorMessage=req;
					}

				})
			}
		}])

	layoutForloginAndReg.controller('passwordResetController',["$scope","$http","$window",function ($scope,$http,$window) {
		$scope.errorMessage="";
		$scope.changeCode=function () {
			$scope.src="/admin/vnum?"+Math.random();
		}
		$scope.resetFirst=function () {
			$scope.errorMessage="";
			$http.post("/users/checkUserExistence",{
				userName:$scope.username,
				vnum:$scope.code
			}).success(function (req) {
				if(angular.isObject(req)){
					$window.localStorage.setItem('user',JSON.stringify(req));
					$window.location.href="/users/confirmUser";
				}else{
					$scope.errorMessage=req;
				}
			})
		}
	}])

	layoutForloginAndReg.controller('confirmController',["$scope","$window","$http",function ($scope,$window,$http) {
		$scope.messageInterval="获取验证码";
		$scope.user=angular.fromJson($window.localStorage.getItem("user"));
		$scope.userName=$scope.user.userName;
		$scope.phoneNum=$scope.user.phoneNum;
		$scope.errorMessage="";
		$scope.resetSecond=function () {
			$scope.errorMessage="";
			$http.post("/users/checkVerifyCode",{
				phoneNum:$scope.user.phoneNum,
				code:$scope.code
			}).success(function (req) {
				if(req=="success"){
					$window.location.href="/users/setPassword";
				}else{
					$scope.errorMessage=req;
				}
			})
		}
	}])

	layoutForloginAndReg.controller('setPasswordController',["$scope","$window","$http",function ($scope,$window,$http) {
		$scope.user=angular.fromJson($window.localStorage.getItem("user"));
		$scope.userName=$scope.user.userName;
		$scope.errorMessage="";
		// $("a.box").fancybox();
		$scope.resetThird=function () {
			$scope.errorMessage="";
			$http.post("/users/resetPsdFromForget",{
				id:$scope.user._id,
				password:$scope.password
			}).success(function (req) {
				if(req=="success"){
					$window.localStorage.clear();
					$window.location.href="/users/login";
				}else{
					$scope.errorMessage=req;
				}
			})
		}
	}])
})(angular,jQuery)

