/**
 * Created by xiao on 2017/4/12.
 */
var layoutForloginAndReg=angular.module('layoutForloginAndReg',['tool']);

var layoutForAccountSet=angular.module('layoutForAccountSet',['tool','ui.bootstrap']);
layoutForAccountSet.run(["$rootScope",function($rootScope) {
    $rootScope.accessors = {
        getId: function(row) {
            return row._id
        }
    }
}]);
layoutForAccountSet.config(["$httpProvider",function ($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
}]);

var layoutPrivateCenter=angular.module('layoutPrivateCenter',['tool','ui.bootstrap']).config(["$sceProvider","$httpProvider",function($sceProvider,$httpProvider){
    $sceProvider.enabled(true/false);
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
}]);



var layoutForsecondDemand=angular.module('layoutForsecondDemand',['ui.bootstrap']).config(["$sceProvider",function($sceProvider){
    $sceProvider.enabled(true/false);
}]);

var layoutForFixList=angular.module('layoutForFixList',['ui.bootstrap']).config(["$sceProvider",function($sceProvider){
    $sceProvider.enabled(true/false);
}]);
var layoutForIndex=angular.module('layoutForIndex',[]);

var layoutForshop=angular.module('layoutForshop',['tool','ui.bootstrap']).config(["$sceProvider",function($sceProvider){
    $sceProvider.enabled(true/false);
}]);

var layoutForshopSpecific=angular.module('layoutForshopSpecific',['tool','ui.bootstrap']);

var layoutCitypartner=angular.module('layoutCitypartner',['ui.bootstrap']);

var layoutNewslist=angular.module('layoutNewslist',['ui.bootstrap']);

