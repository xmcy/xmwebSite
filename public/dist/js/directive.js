/**
 * Created by xiao on 2017/4/5.
 */
var tool=angular.module('tool',[]);
    tool.config(["$httpProvider",function($httpProvider){
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

}]);

tool.directive('downTick',["$http","$interval","$timeout",function($http,$interval,$timeout){
    return {
        restrict: 'A',
        replace:true,
        // scope: {
        //     messageInterval: '=messageInterval'
        // },
        template:'<div class="intervalBtn" ng-click="interval()"  ng-class="{clickChange:clickChange}" >{{messageInterval}}</div>',
        link:function(scope,elem,attrs){
            var timing=false, time=60,timer=undefined;
            scope.clickChange=false;
            scope.interval=function(){
                scope.errorMessage="";
                    if(!angular.isUndefined(scope.tele.phoneNum.$viewValue)){
                        if(time==60&&scope.tele.phoneNum.$modelValue.toString().length==11){
                            $http.post("/users/sendVerifyCode", {
                                phoneNum: scope.phoneNum,
                                postType:scope.postType
                            }).success(function (req) {
                                if(req=="success"){
                                    timer=$interval(function (){
                                        scope.clickChange=true;
                                        scope.messageInterval=time+"s重发";
                                        time--;
                                    },1000);

                                    $timeout(function(){
                                        scope.messageInterval = "重新发送";
                                        scope.clickChange = false;
                                        $interval.cancel(timer);
                                        time=60;

                                    }, 61000);
                                }else {
                                    scope.errorMessage=req;
                                }
                            }).error(function (err) {
                            });


                        }
                    }

            }
        }
    }
}])

tool.directive('pwCheck', function () {
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

tool.directive('myCode',function () {
    return{
        restrict: 'EA',
        replace:true,
        template:'<img ng-src="{{src}}" ng-click="changeCode()" alt="图形验证码">',
        link:function (scope,elem,attrs) {
            scope.src="/admin/vnum?"+Math.random();
        }
    }
})

tool.directive('blockHide',["$document",function ($document) {
    return{
        restrict:'EA',
        link:function (scope,elem,attrs) {
            var documentHeight=$($document).height();
            $(elem).css({height:documentHeight});
        }
    }
}])
tool.directive('maxheight',function () {
    return{
        restrict:'EA',
        link:function (scope,elem,attrs) {
            elem.on("mouseenter",function () {
                $(this).removeClass("maxheight")
            })
            elem.on("mouseleave",function () {
                $(this).addClass("maxheight")
            })
        }
    }
})
tool.directive('compileHtml', ['$compile','$parse',function ($compile,$parse) {
    return {
        restrict: 'EA',
        replace: true,
        link: function (scope, ele, attrs) {
            scope.$watch(attrs.ngBindHtml, function() {
                $compile(ele.contents())(scope);
            }, true);
            // ele.html($parse(attrs.ngBindHtml)(scope));

            // // scope.$watch(function () {
            // // 	return scope.$eval(attrs.ngBindHtml);
            // // },
            // scope.$watch(attrs.ngBindHtml,
            // 	function(html) {
            // 		ele.html(html);
            // 		$compile(ele.contents())(scope);
            // 	});
        }
    };
}]);

tool.directive('stars1', function () {
    return {
        restrict: 'EA',
        replace: false,
        scope:false,
        template:'<span>产品质量</span><img ng-repeat="item in datalist1" ng-src="{{item.url}}" '+
        'ng-click="click1($index+1)" ng-mouseenter="over1($index+1)" ng-mouseleave="leave1()"/><span class="redFont">{{point1}}分</span>',
        link: function (scope, ele, attrs) {
            scope.datalist1=[{url:"/themes/lanmai/images/star1.png"},{url:"/themes/lanmai/images/star1.png"},{url:"/themes/lanmai/images/star1.png"},
                {url:"/themes/lanmai/images/star1.png"},{url:"/themes/lanmai/images/star1.png"}]

            scope.click1 = function(val) {
                scope.ratingValue1 = val;
                scope.point1=val
                updateStars1();
            };
            scope.over1 = function(val) {
                scope.hoverValue1 = val;
                scope.point1=val
                updateStarsHover1();
            };
            scope.leave1 = function() {
                scope.hoverValue1 = scope.ratingValue1;
                scope.point1=scope.ratingValue1
                updateStars1();

            }
            var updateStars1 = function() {
                for (var i = 0; i < 5; i++) {
                    if(i<scope.ratingValue1){
                        scope.datalist1[i].url="/themes/lanmai/images/star2.png"
                    }else {
                        scope.datalist1[i].url="/themes/lanmai/images/star1.png"
                    }
                }
            };
            var updateStarsHover1 = function() {
                for (var i = 0; i < 5; i++) {
                    if(i<scope.hoverValue1){
                        scope.datalist1[i].url="/themes/lanmai/images/star2.png"
                    }else {
                        scope.datalist1[i].url="/themes/lanmai/images/star1.png"
                    }
                }
            };
            scope.ratingValue1 = scope.point1;
            updateStars1();
        }
    };
});
tool.directive('stars2', function () {
    return {
        restrict: 'EA',
        replace: false,
        scope:false,
        template:'<span>描述相符</span><img ng-repeat="item in datalist2" ng-src="{{item.url}}" '+
        'ng-click="click2($index+1)" ng-mouseenter="over2($index+1)" ng-mouseleave="leave2()"/><span class="redFont">{{point2}}分</span>',
        link: function (scope, ele, attrs) {
            scope.datalist2=[{url:"/themes/lanmai/images/star1.png"},{url:"/themes/lanmai/images/star1.png"},{url:"/themes/lanmai/images/star1.png"},
                {url:"/themes/lanmai/images/star1.png"},{url:"/themes/lanmai/images/star1.png"}]
            scope.click2 = function(val) {
                scope.ratingValue2 = val;
                scope.point2=val
                updateStars2();
            };
            scope.over2 = function(val) {
                scope.hoverValue2 = val;
                scope.point2=val
                updateStarsHover2();
            };
            scope.leave2 = function() {
                scope.hoverValue2 = scope.ratingValue2;
                scope.point2=scope.ratingValue2
                updateStars2();
            }
            var updateStars2 = function() {
                for (var i = 0; i < 5; i++) {
                    if(i<scope.ratingValue2){
                        scope.datalist2[i].url="/themes/lanmai/images/star2.png"
                    }else {
                        scope.datalist2[i].url="/themes/lanmai/images/star1.png"
                    }
                }
            };
            var updateStarsHover2 = function() {
                for (var i = 0; i < 5; i++) {
                    if(i<scope.hoverValue2){
                        scope.datalist2[i].url="/themes/lanmai/images/star2.png"
                    }else {
                        scope.datalist2[i].url="/themes/lanmai/images/star1.png"
                    }
                }
            };
            scope.ratingValue2 = scope.point2;
            updateStars2();
        }
    };
});
tool.directive('stars3', function () {
    return {
        restrict: 'EA',
        replace: false,
        scope:false,
        template:'<span>服务态度</span><img ng-repeat="item in datalist3" ng-src="{{item.url}}" '+
        'ng-click="click3($index+1)" ng-mouseenter="over3($index+1)" ng-mouseleave="leave3()"/><span class="redFont">{{point3}}分</span>',
        link: function (scope, ele, attrs) {
            scope.datalist3=[{url:"/themes/lanmai/images/star1.png"},{url:"/themes/lanmai/images/star1.png"},{url:"/themes/lanmai/images/star1.png"},
                {url:"/themes/lanmai/images/star1.png"},{url:"/themes/lanmai/images/star1.png"}]
            scope.click3 = function(val) {
                scope.ratingValue3 = val;
                scope.point3=val
                updateStars3();
            };
            scope.over3 = function(val) {
                scope.hoverValue3 = val;
                scope.point3=val
                updateStarsHover3();
            };
            scope.leave3 = function() {
                scope.hoverValue3 = scope.ratingValue3;
                scope.point3=scope.ratingValue3
                updateStars3();
            }
            var updateStars3 = function() {
                for (var i = 0; i < 5; i++) {
                    if(i<scope.ratingValue3){
                        scope.datalist3[i].url="/themes/lanmai/images/star2.png"
                    }else {
                        scope.datalist3[i].url="/themes/lanmai/images/star1.png"
                    }
                }
            };
            var updateStarsHover3 = function() {
                for (var i = 0; i < 5; i++) {
                    if(i<scope.hoverValue3){
                        scope.datalist3[i].url="/themes/lanmai/images/star2.png"
                    }else {
                        scope.datalist3[i].url="/themes/lanmai/images/star1.png"
                    }
                }
            };
            scope.ratingValue3 = scope.point3;
            updateStars3();
        }
    };
});
tool.directive('stars4', function () {
    return {
        restrict: 'EA',
        replace: false,
        scope:false,
        template:'<span>交付速度</span><img ng-repeat="item in datalist4" ng-src="{{item.url}}" '+
        'ng-click="click4($index+1)" ng-mouseenter="over4($index+1)" ng-mouseleave="leave4()"/><span class="redFont">{{point4}}分</span>',
        link: function (scope, ele, attrs) {
            scope.datalist4=[{url:"/themes/lanmai/images/star1.png"},{url:"/themes/lanmai/images/star1.png"},{url:"/themes/lanmai/images/star1.png"},
                {url:"/themes/lanmai/images/star1.png"},{url:"/themes/lanmai/images/star1.png"}]
            scope.click4 = function(val) {
                scope.ratingValue4 = val;
                scope.point4=val
                updateStars4();
            };
            scope.over4 = function(val) {
                scope.hoverValue4 = val;
                scope.point4=val
                updateStarsHover4();
            };
            scope.leave4 = function() {
                scope.hoverValue4 = scope.ratingValue4;
                scope.point4=scope.ratingValue4
                updateStars4();
            }
            var updateStars4 = function() {
                for (var i = 0; i < 5; i++) {
                    if(i<scope.ratingValue4){
                        scope.datalist4[i].url="/themes/lanmai/images/star2.png"
                    }else {
                        scope.datalist4[i].url="/themes/lanmai/images/star1.png"
                    }
                }
            };
            var updateStarsHover4 = function() {
                for (var i = 0; i < 5; i++) {
                    if(i<scope.hoverValue4){
                        scope.datalist4[i].url="/themes/lanmai/images/star2.png"
                    }else {
                        scope.datalist4[i].url="/themes/lanmai/images/star1.png"
                    }
                }
            };
            scope.ratingValue4 = scope.point4;
            updateStars4();
        }
    };
});

tool.directive("alignSet",["$window",function($window){
        return {
            restrict:'EA',
            scope : {},
            link:function (scope,elem,attrs) {
                var fixDHeight=$(elem).height();
                var wHeight =$($window).height();
                var wWidth = $($window).width();
                $(elem).css({left:(wWidth-700)/2,top:(wHeight-fixDHeight)/2});
            }
        }
}])
// tool.directive('draggable', function($document) {
//     var startX=0, startY=0, x = 0, y = 0;
//     return function(scope, element, attr) {
//         element.css({
//             position: 'relative',
//             border: '1px solid red',
//             backgroundColor: 'lightgrey',
//             cursor: 'pointer'
//         });
//         element.bind('mousedown', function(event) {
//             startX = event.screenX - x;
//             startY = event.screenY - y;
//             $document.bind('mousemove', mousemove);
//             $document.bind('mouseup', mouseup);
//         });
//
//         function mousemove(event) {
//             y = event.screenY - startY;
//             x = event.screenX - startX;
//             element.css({
//                 top: y + 'px',
//                 left:  x + 'px'
//             });
//         }
//
//         function mouseup() {
//             $document.unbind('mousemove', mousemove);
//             $document.unbind('mouseup', mouseup);
//         }
//     }
// });