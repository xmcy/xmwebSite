;
(function(angular, $) {

    var layoutForsecondDemand = angular.module('layoutForsecondDemand');
    layoutForsecondDemand.controller('layoutForFixListController', ["$scope", "$http", "$window", function($scope, $http, $window, $location) {
        /***********************************获取内容部分*/
        var postFixData = function() {
                $scope.warningInfoData = ''
                $scope.resType = "anzhuang";
                $http.post("/resource/queryInstalls", {
                    text: $scope.text,
                    page: $scope.bigCurrentPage,
                    limit: $scope.itemsPerPage,
                    order: $scope.order,
                    region: $scope.region
                }).success(function(res) {
                    if(res=="请输入更详细的查询条件"){
                        $scope.bigCurrentPage = 1;
                        swal("请输入更详细的查询条件")
                    }else if (res !== "查询为空") {
                        $scope.dataList = res.docs;
                        $scope.bigTotalItems = res.pageInfo.totalItems;
                    } else {
                        $scope.dataList = []
                        $scope.bigTotalItems = 0
                        $scope.warningInfoData = '暂无数据'
                    }
                })
            }
            /*****************************************获取内容部分*/
        var historyOder = '';
        $scope.changeFixOrder = function(order) {
            var orderObj = {};
            if (historyOder == order) {
                orderObj[order] = -1
                historyOder = '';
            } else {
                orderObj[order] = 1
                historyOder = order;
            }
            $scope.order = orderObj
            postFixData();
        }
        $scope.$watch("regionData", function() {
            $scope.refreshFixList();
        })
        $scope.count = 0;
        $scope.refreshFixList = function() {
            $scope.region = {};
            if ($scope.count >= 1) {
                if (!!$scope.regionData && $scope.regionData != "") {
                    var region = $scope.regionData.split('/');
                    $scope.region.province = region[0];
                    $scope.region.city = region[1];
                    $scope.region.district = region[2];
                }
                postFixData();
            }
            $scope.count++;
        }
        $scope.pageFixChanged = function(currentPage) {
            postFixData();
        };
        $scope.shownum=34
        $scope.viewNum = function(item,key) {
            $http.post("/resource/incInstallPageview", {
                resId: item._id
            }).success(function(res) {})
            item.pageview=item.pageview+1;
            $scope.showid=key;
            $scope.shownum=key;
        }
        $scope.clearAway = function(){
            $scope.showid=999;
            $scope.shownum=34;
        }
        $scope.maxSize = 5;
        $scope.itemsPerPage = 15;
        $scope.bigCurrentPage = 1;
        $scope.text = '';
        $scope.order = { refreshedAt: -1 };
        $scope.region = {};
        var searchParamsData = $window.location.search
        if (searchParamsData && searchParamsData != "" && searchParamsData.length > 0) {
            $scope.text = unescape($window.location.search.split('=')[1])
        }
        postFixData();
    }])
    layoutForsecondDemand.controller('resourceListMakeController', ["$scope", "$http", "$window", function($scope, $http, $window) {
        var postData = function() {
            $scope.warningInfoData = ''
            var resType = "Manufacture";
            $http.post("/searchResFilter", {
                resType: $scope.resType,
                text: $scope.text,
                page: $scope.bigCurrentPage,
                limit: $scope.itemsPerPage,
                freightType: $scope.freightType,
                brand: $scope.brand,
                order: $scope.order,
                region: $scope.region,
                types: $scope.types,
                priceFrom: $scope.priceFrom,
                priceTo: $scope.priceTo,
                installType: $scope.installType
            }).success(function(res) {
                if(res=="请输入更详细的查询条件"){
                    $scope.bigCurrentPage = 1;
                    swal("请输入更详细的查询条件")
                }else if (res !== "查询为空") {
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
        $scope.postData = postData
        var historyOder = '';
        $scope.changeOrder = function(order) {
            var orderObj = {};
            if (historyOder == order) {
                orderObj[order] = -1
                historyOder = '';
            } else {
                orderObj[order] = 1
                historyOder = order;
            }
            $scope.order = orderObj
            postData();
        }

        $scope.$watch("currentCateListData+classifyData+priceData+regionData+freightTypeData+installTypeData+maxnum+minnum", function() {
            $scope.refreshList()
        })
        $scope.count = 0;
        $scope.refreshList = function() {
            $scope.region = {};
            $scope.freightType = ""
            $scope.installType = ""
            $scope.priceFrom = 0;
            $scope.priceTo = 0;
            if ($scope.count >= 1) {
                if (!!$scope.currentCateListData && $scope.currentCateListData != "") {
                    $scope.types = [];
                    $scope.types = $scope.currentCateListData.split("、").slice(0, $scope.currentCateListData.split("、").length - 1);
                }
                if ($scope.priceData == "低于1000元、") {
                    $scope.priceFrom = 1;
                    $scope.priceTo = 1000;
                } else if ($scope.priceData == "1000--5000元、") {
                    $scope.priceFrom = 1000;
                    $scope.priceTo = 5000;
                } else if ($scope.priceData == "5000--1万元、") {
                    $scope.priceFrom = 5000;
                    $scope.priceTo = 10000;
                } else if ($scope.priceData == "1万--5万元、") {
                    $scope.priceFrom = 10000;
                    $scope.priceTo = 50000;
                } else if ($scope.priceData == "5万元以上、") {
                    $scope.priceFrom = 50000;
                    $scope.priceTo = 50000000000;
                } else if ($scope.priceData == "自定义") {
                    $scope.priceFrom = $scope.minnum;
                    $scope.priceTo = $scope.maxnum;
                } else {
                    $scope.priceFrom = 0;
                    $scope.priceTo = 0
                }
                if (!!$scope.regionData && $scope.regionData != "") {
                    var region = $scope.regionData.split('/');
                    $scope.region.province = region[0];
                    $scope.region.city = region[1];
                    $scope.region.district = region[2];
                }
                if (!!$scope.freightTypeData && $scope.freightTypeData != "") {
                    $scope.freightType = $scope.freightTypeData.substring(0, $scope.freightTypeData.length - 1);
                }
                if (!!$scope.installTypeData && $scope.installTypeData != "") {
                    $scope.installType = $scope.installTypeData.substring(0, $scope.installTypeData.length - 1);
                }
                postData();
            }
            $scope.count++;
        }
        $scope.showid = 999;
        $scope.showModal = function(key, item) {
            $scope.showid = key;
        }
        $scope.hiddenModal = function() {
            $scope.showid = 999;
        }
        $scope.pageChanged = function(currentPage) {
            postData();
        };
        $scope.maxSize = 5;
        $scope.itemsPerPage = 15;
        $scope.bigCurrentPage = 1;
        $scope.text = '';
        $scope.freightType = '';
        $scope.order = { refreshedAt: -1 };
        $scope.priceFrom = 0;
        $scope.priceTo = 0;
        $scope.region = {};
        $scope.resType = "Manufacture"
        $scope.installType = '';
        var searchParamsData = $window.location.search
        if (searchParamsData && searchParamsData != "" && searchParamsData.length > 0) {
            $scope.text = unescape($window.location.search.split('=')[1])
        }
    }])
    layoutForsecondDemand.controller('resourceListAllController', ["$scope", "$http", "$window", function($scope, $http, $window) {
        var postData = function() {
            $scope.warningInfoData = ''
            $scope.resType = "all";
            $http.post("/searchResFilter", {
                resType: $scope.resType=="all"?"":$scope.resType,
                text: $scope.text,
                page: $scope.bigCurrentPage,
                limit: $scope.itemsPerPage,
                freightType: $scope.freightType,
                brand: $scope.brand,
                order: $scope.order,
                region: $scope.region,
                types: $scope.types,
                priceFrom: $scope.priceFrom,
                priceTo: $scope.priceTo,
                installType: $scope.installType
            }).success(function(res) {
                if(res=="请输入更详细的查询条件"){
                    $scope.bigCurrentPage = 1;
                    swal("请输入更详细的查询条件")
                }else if (res !== "查询为空") {
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
        $scope.postData = postData
        var historyOder = '';
        $scope.changeOrder = function(order) {
            var orderObj = {};
            if (historyOder == order) {
                orderObj[order] = -1
                historyOder = '';
            } else {
                orderObj[order] = 1
                historyOder = order;
            }
            $scope.order = orderObj
            postData();
        }

        $scope.$watch("currentCateListData+classifyData+priceData+regionData+freightTypeData+installTypeData+maxnum+minnum", function() {
            $scope.refreshList()
        })
        $scope.count = 0;
        $scope.refreshList = function() {
            $scope.region = {};
            $scope.freightType = ""
            $scope.installType = ""
            $scope.priceFrom = 0;
            $scope.priceTo = 0;
            if ($scope.count >= 1) {
                if (!!$scope.currentCateListData && $scope.currentCateListData != "") {
                    $scope.types = [];
                    $scope.types = $scope.currentCateListData.split("、").slice(0, $scope.currentCateListData.split("、").length - 1);
                }
                if ($scope.priceData == "低于1000元、") {
                    $scope.priceFrom = 1;
                    $scope.priceTo = 1000;
                } else if ($scope.priceData == "1000--5000元、") {
                    $scope.priceFrom = 1000;
                    $scope.priceTo = 5000;
                } else if ($scope.priceData == "5000--1万元、") {
                    $scope.priceFrom = 5000;
                    $scope.priceTo = 10000;
                } else if ($scope.priceData == "1万--5万元、") {
                    $scope.priceFrom = 10000;
                    $scope.priceTo = 50000;
                } else if ($scope.priceData == "5万元以上、") {
                    $scope.priceFrom = 50000;
                    $scope.priceTo = 50000000000;
                } else if ($scope.priceData == "自定义") {
                    $scope.priceFrom = $scope.minnum;
                    $scope.priceTo = $scope.maxnum;
                } else {
                    $scope.priceFrom = 0;
                    $scope.priceTo = 0
                }
                if (!!$scope.regionData && $scope.regionData != "") {
                    var region = $scope.regionData.split('/');
                    $scope.region.province = region[0];
                    $scope.region.city = region[1];
                    $scope.region.district = region[2];
                }
                if (!!$scope.freightTypeData && $scope.freightTypeData != "") {
                    $scope.freightType = $scope.freightTypeData.substring(0, $scope.freightTypeData.length - 1);
                }
                if (!!$scope.installTypeData && $scope.installTypeData != "") {
                    $scope.installType = $scope.installTypeData.substring(0, $scope.installTypeData.length - 1);
                }
                postData();
            }
            $scope.count++;
        }
        $scope.showid = 999;
        $scope.showModal = function(key, item) {
            $scope.showid = key;
        }
        $scope.hiddenModal = function() {
            $scope.showid = 999;
        }
        $scope.pageChanged = function(currentPage) {
            postData();
        };
        $scope.maxSize = 5;
        $scope.itemsPerPage = 15;
        $scope.bigCurrentPage = 1;
        $scope.text = '';
        $scope.freightType = '';
        $scope.order = { refreshedAt: -1 };
        $scope.priceFrom = 0;
        $scope.priceTo = 0;
        $scope.region = {};
        $scope.resType = "Manufacture"
        $scope.installType = '';
        var searchParamsData = $window.location.search
        if (searchParamsData && searchParamsData != "" && searchParamsData.length > 0) {
            $scope.text = unescape($window.location.search.split('=')[1])
        }
    }])

    layoutForsecondDemand.controller('resourceListMaterialController', ["$scope", "$http", "$window", function($scope, $http, $window) {
        $scope.resType = "Material"
        var postData = function() {
            $scope.warningInfoData = ''
            $http.post("/searchResFilter", {
                resType: $scope.resType,
                text: $scope.text,
                page: $scope.bigCurrentPage,
                limit: $scope.itemsPerPage,
                freightType: $scope.freightType,
                brand: $scope.brand,
                order: $scope.order,
                region: $scope.region,
                types: $scope.types,
                priceFrom: $scope.priceFrom,
                priceTo: $scope.priceTo
            }).success(function(res) {
                if(res=="请输入更详细的查询条件"){
                    $scope.bigCurrentPage = 1;
                    swal("请输入更详细的查询条件")
                }else if (res !== "查询为空") {
                    $scope.dataList = res.docs;
                    $scope.bigTotalItems = res.pageInfo.totalItems;
                } else {
                    $scope.dataList = []
                    $scope.bigTotalItems = 0
                    $scope.warningInfoData = '暂无数据'
                }
            })
        }
        $scope.postData = postData

        var historyOder = '';
        $scope.changeOrder = function(order) {
            var orderObj = {};
            if (historyOder == order) {
                orderObj[order] = -1
                historyOder = '';
            } else {
                orderObj[order] = 1
                historyOder = order;
            }
            $scope.order = orderObj
            postData();
        }

        $scope.$watch("currentCateListData+classifyData+priceData+regionData+freightTypeData+maxnum+minnum", function() {
            $scope.refreshList()
        })
        $scope.count = 0;
        $scope.refreshList = function() {
            $scope.brand = [];
            $scope.region = {};
            $scope.freightType = ""
            $scope.priceFrom = 0;
            $scope.priceTo = 0;
            if ($scope.count >= 1) {
                if (!!$scope.currentCateListData && $scope.currentCateListData != "") {
                    $scope.types = [];
                    $scope.types = $scope.currentCateListData.split("、").slice(0, $scope.currentCateListData.split("、").length - 1);
                }
                if (!!$scope.classifyData && $scope.classifyData != "") {
                    $scope.brand = $scope.classifyData.split("、").slice(0, $scope.classifyData.split("、").length - 1);
                }
                if ($scope.priceData == "低于1000元、") {
                    $scope.priceFrom = 1;
                    $scope.priceTo = 1000;
                } else if ($scope.priceData == "1000--5000元、") {
                    $scope.priceFrom = 1000;
                    $scope.priceTo = 5000;
                } else if ($scope.priceData == "5000--1万元、") {
                    $scope.priceFrom = 5000;
                    $scope.priceTo = 10000;
                } else if ($scope.priceData == "1万--5万元、") {
                    $scope.priceFrom = 10000;
                    $scope.priceTo = 50000;
                } else if ($scope.priceData == "5万元以上、") {
                    $scope.priceFrom = 50000;
                    $scope.priceTo = 50000000000;
                } else if ($scope.priceData == "自定义") {
                    $scope.priceFrom = $scope.minnum;
                    $scope.priceTo = $scope.maxnum;
                } else {
                    $scope.priceFrom = 0;
                    $scope.priceTo = 0
                }
                if (!!$scope.regionData && $scope.regionData != "") {
                    var region = $scope.regionData.split('/');
                    $scope.region.province = region[0];
                    $scope.region.city = region[1];
                    $scope.region.district = region[2];
                }
                if (!!$scope.freightTypeData && $scope.freightTypeData != "") {
                    $scope.freightType = $scope.freightTypeData.substring(0, $scope.freightTypeData.length - 1);
                }
                postData();
            }
            $scope.count++;
        }
        $scope.showid = 999;
        $scope.showModal = function(key, item) {
            $scope.showid = key;
        }
        $scope.hiddenModal = function() {
            $scope.showid = 999;
        }
        $scope.pageChanged = function(currentPage) {
            postData();
        };
        $scope.maxSize = 5;
        $scope.itemsPerPage = 15;
        $scope.bigCurrentPage = 1;
        $scope.text = '';
        $scope.freightType = '';
        $scope.brand = [];
        $scope.order = { refreshedAt: -1 };
        $scope.priceFrom = 0;
        $scope.priceTo = 0;
        $scope.region = {};
        $scope.types = [];
        var searchParamsData = $window.location.search
        if (searchParamsData && searchParamsData != "" && searchParamsData.length > 0) {
            $scope.text = unescape($window.location.search.split('=')[1])
        }
    }])

    layoutForsecondDemand.controller('resourceListMachineController', ["$scope", "$http", "$window", function($scope, $http, $window) {
        $scope.resType = "Equipment"
        var postData = function() {
            $scope.warningInfoData = ''
            var resType = "Equipment";
            $http.post("/searchResFilter", {
                resType: $scope.resType,
                text: $scope.text,
                page: $scope.bigCurrentPage,
                limit: $scope.itemsPerPage,
                freightType: $scope.freightType,
                brand: $scope.brand,
                order: $scope.order,
                region: $scope.region,
                types: $scope.types,
                priceFrom: $scope.priceFrom,
                priceTo: $scope.priceTo,
                installType: $scope.installType
            }).success(function(res) {
                if(res=="请输入更详细的查询条件"){
                    $scope.bigCurrentPage = 1;
                    swal("请输入更详细的查询条件")
                }else if (res !== "查询为空") {
                    $scope.dataList = res.docs;
                    $scope.bigTotalItems = res.pageInfo.totalItems;
                } else {
                    $scope.dataList = []
                    $scope.bigTotalItems = 0
                    $scope.warningInfoData = '暂无数据'
                }

            })
        }
        $scope.postData = postData

        var historyOder = '';
        $scope.changeOrder = function(order) {
            var orderObj = {};
            if (historyOder == order) {
                orderObj[order] = -1
                historyOder = '';
            } else {
                orderObj[order] = 1
                historyOder = order;
            }
            $scope.order = orderObj
            postData();
        }

        $scope.$watch("currentCateListData+classifyData+priceData+regionData+freightTypeData+installTypeData+maxnum+minnum", function() {
            $scope.refreshList()
        })
        $scope.count = 0;
        $scope.refreshList = function() {
            $scope.brand = [];
            $scope.region = {};
            $scope.freightType = ""
            $scope.installType = ""
            $scope.priceFrom = 0;
            $scope.priceTo = 0;
            if ($scope.count >= 1) {
                if (!!$scope.currentCateListData && $scope.currentCateListData != "") {
                    $scope.types = [];
                    $scope.types = $scope.currentCateListData.split("、").slice(0, $scope.currentCateListData.split("、").length - 1);
                }
                if (!!$scope.classifyData && $scope.classifyData != "") {
                    $scope.brand = $scope.classifyData.split("、").slice(0, $scope.classifyData.split("、").length - 1);
                }
                if ($scope.priceData == "低于1000元、") {
                    $scope.priceFrom = 1;
                    $scope.priceTo = 1000;
                } else if ($scope.priceData == "1000--5000元、") {
                    $scope.priceFrom = 1000;
                    $scope.priceTo = 5000;
                } else if ($scope.priceData == "5000--1万元、") {
                    $scope.priceFrom = 5000;
                    $scope.priceTo = 10000;
                } else if ($scope.priceData == "1万--5万元、") {
                    $scope.priceFrom = 10000;
                    $scope.priceTo = 50000;
                } else if ($scope.priceData == "5万元以上、") {
                    $scope.priceFrom = 50000;
                    $scope.priceTo = 50000000000;
                } else if ($scope.priceData == "自定义") {
                    $scope.priceFrom = $scope.minnum;
                    $scope.priceTo = $scope.maxnum;
                } else {
                    $scope.priceFrom = 0;
                    $scope.priceTo = 0
                }
                if (!!$scope.regionData && $scope.regionData != "") {
                    var region = $scope.regionData.split('/');
                    $scope.region.province = region[0];
                    $scope.region.city = region[1];
                    $scope.region.district = region[2];
                }
                if (!!$scope.freightTypeData && $scope.freightTypeData != "") {
                    $scope.freightType = $scope.freightTypeData.substring(0, $scope.freightTypeData.length - 1);
                }
                if (!!$scope.installTypeData && $scope.installTypeData != "") {
                    $scope.installType = $scope.installTypeData.substring(0, $scope.installTypeData.length - 1);
                }
                postData();
            }
            $scope.count++;
        }
        $scope.showid = 999;
        $scope.showModal = function(key, item) {
            $scope.showid = key;
        }
        $scope.hiddenModal = function() {
            $scope.showid = 999;
        }
        $scope.pageChanged = function(currentPage) {
            postData();
        };
        $scope.maxSize = 5;
        $scope.itemsPerPage = 15;
        $scope.bigCurrentPage = 1;
        $scope.text = '';
        $scope.freightType = '';
        $scope.brand = [];
        $scope.order = { refreshedAt: -1 };
        $scope.priceFrom = 0;
        $scope.priceTo = 0;
        $scope.region = {};
        $scope.types = [];
        $scope.installType = '';
        var searchParamsData = $window.location.search
        if (searchParamsData && searchParamsData != "" && searchParamsData.length > 0) {
            $scope.text = unescape($window.location.search.split('=')[1])
        }
    }])


    layoutForsecondDemand.controller('secondDemandController', ["$scope", "$http", "$window", function($scope, $http, $window) {
        var postData = function() {
            $scope.warningInfoData = ''
            $scope.resType = "xuqiu";
            $http.post("/searchDemandsFilter", {
                text: $scope.text,
                page: $scope.bigCurrentPage,
                limit: $scope.itemsPerPage,
                order: $scope.order,
                region: $scope.region,
                types: $scope.types,
                priceFrom: $scope.priceFrom,
                priceTo: $scope.priceTo,
                classify: $scope.classify
            }).success(function(res) {
                if(res=="请输入更详细的查询条件"){
                    $scope.bigCurrentPage = 1;
                    swal("请输入更详细的查询条件")
                }else if (res !== "查询为空") {
                    $scope.dataList = res.docs;
                    $scope.bigTotalItems = res.pageInfo.totalItems;

                } else {
                    $scope.dataList = []
                    $scope.bigTotalItems = 0
                    $scope.warningInfoData = '暂无数据'
                }

            })
        }
        var historyOder = '';
        $scope.changeOrder = function(order) {
            var orderObj = {};
            if (historyOder == order) {
                orderObj[order] = -1
                historyOder = '';
            } else {
                orderObj[order] = 1
                historyOder = order;
            }
            $scope.order = orderObj
            postData();
        }
        $scope.$watch("typesData+classifyData+priceData+regionData+maxnum+minnum", function() {
            $scope.refreshList()
        })
        $scope.count = 0;
        $scope.refreshList = function() {
            $scope.classify = [];
            $scope.region = {};
            if ($scope.count >= 1) {
                if (!!$scope.currentCateListData && $scope.currentCateListData != "") {
                    $scope.types = [];
                    $scope.types = $scope.currentCateListData.split("、").slice(0, $scope.currentCateListData.split("、").length - 1);
                }
                if($scope.currentCateListData == ""){
                    $scope.types = [];
                }
                if (!!$scope.classifyData && $scope.classifyData != "") {
                    $scope.classify = $scope.classifyData.split("、").slice(0, $scope.classifyData.split("、").length - 1);
                }
                if ($scope.priceData == "低于1000元、") {
                    $scope.priceFrom = 0;
                    $scope.priceTo = 1000;
                } else if ($scope.priceData == "1000--5000元、") {
                    $scope.priceFrom = 1000;
                    $scope.priceTo = 5000;
                } else if ($scope.priceData == "5000--1万元、") {
                    $scope.priceFrom = 5000;
                    $scope.priceTo = 10000;
                } else if ($scope.priceData == "1万--5万元、") {
                    $scope.priceFrom = 10000;
                    $scope.priceTo = 50000;
                } else if ($scope.priceData == "5万元以上、") {
                    $scope.priceFrom = 50000;
                    $scope.priceTo = 50000000000;
                } else if ($scope.priceData == "自定义") {
                    $scope.priceFrom = $scope.minnum;
                    $scope.priceTo = $scope.maxnum;
                } else {
                    $scope.priceFrom = 0;
                    $scope.priceTo = 0
                }
                if (!!$scope.regionData && $scope.regionData != "") {
                    var region = $scope.regionData.split('/');
                    $scope.region.province = region[0];
                    $scope.region.city = region[1];
                    $scope.region.district = region[2];
                }
                postData();
            }
            $scope.count++;
        }
        $scope.showid = 999;
        $scope.showModal = function(key, item) {
            $scope.showid = key;
        }
        $scope.hiddenModal = function() {
            $scope.showid = 999;
        }
        $scope.pageChanged = function(currentPage) {
            postData();
        };
        $scope.maxSize = 5;
        $scope.itemsPerPage = 18;
        $scope.bigCurrentPage = 1;
        $scope.text = '';
        $scope.order = { refreshedAt: -1 };
        $scope.priceFrom = 0;
        $scope.priceTo = 0;
        $scope.region = {};
        $scope.types = [];
        $scope.classify = ""
        var searchParamsData = $window.location.search
        if (searchParamsData && searchParamsData != "" && searchParamsData.length > 0) {
            $scope.text = unescape($window.location.search.split('=')[1])
        }
        postData();
    }])

    layoutForsecondDemand.controller('tenderListController', ["$scope", "$http", "$window", function($scope, $http, $window) {
        var postData = function() {
            $scope.warningInfoData = ''
            $scope.resType = "zhaobiao";
            $http.post("/searchTenderFilter", {
                text: $scope.text,
                region: $scope.region,
                types: $scope.types,
                tenderType: $scope.tenderType,
                status: $scope.status,
                order: $scope.order
            }).success(function(res) {
                if(res=="请输入更详细的查询条件"){
                    $scope.bigCurrentPage = 1;
                    swal("请输入更详细的查询条件")
                }else if (res !== "查询为空") {
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
        $scope.postData = postData
        var historyOder = '';
        $scope.changeOrder = function(order) {
            var orderObj = {};
            if (historyOder == order) {
                orderObj[order] = -1
                historyOder = '';
            } else {
                orderObj[order] = 1
                historyOder = order;
            }
            $scope.order = orderObj
            postData();
        }

        $scope.$watch("currentCateListData+tenderTypeData+statusData+regionData", function() {
            $scope.refreshList()
        })
        $scope.alertForLogin = function() {
            swal({
                    title: '您还未登录，无法查看招标详情',
                    text: "",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "去登陆",
                    closeOnConfirm: false
                },
                function(isConfirm) {
                    if (isConfirm) {
                        $window.open("/users/login")
                    }
                });
        }
        $scope.count = 0;
        $scope.refreshList = function() {
            $scope.region = {};
            $scope.tenderType = ""
            $scope.status = ""
            if ($scope.count >= 1) {
                if (!!$scope.currentCateListData && $scope.currentCateListData != "") {
                    $scope.types = [];
                    $scope.types = $scope.currentCateListData.split("、").slice(0, $scope.currentCateListData.split("、").length - 1);
                }
                if (!!$scope.regionData && $scope.regionData != "") {
                    var region = $scope.regionData.split('/');
                    $scope.region.province = region[0];
                    $scope.region.city = region[1];
                    $scope.region.district = region[2];
                }
                if (!!$scope.tenderTypeData && $scope.tenderTypeData != "") {
                    $scope.tenderType = $scope.tenderTypeData.substring(0, $scope.tenderTypeData.length - 1);
                    if ($scope.tenderType == "公开招标") {
                        $scope.tenderType = 1
                    } else if ($scope.tenderType == "邀请招标") {
                        $scope.tenderType = 2
                    } else {
                        $scope.tenderType = ""
                    }
                }
                if (!!$scope.statusData && $scope.statusData != "") {
                    $scope.status = $scope.statusData.substring(0, $scope.statusData.length - 1);
                    if ($scope.status == "投标中") {
                        $scope.status = 2
                    } else {
                        $scope.status = ""
                    }
                }
                postData();
            }
            $scope.count++;
        }

        $scope.pageChanged = function(currentPage) {
            postData();
        };
        $scope.maxSize = 5;
        $scope.itemsPerPage = 15;
        $scope.bigCurrentPage = 1;
        $scope.text = '';
        $scope.status = '';
        $scope.order = { createdAt: -1 };
        $scope.region = {};
        $scope.tenderType = '';
        $scope.types = []
        var searchParamsData = $window.location.search
        if (searchParamsData && searchParamsData != "" && searchParamsData.length > 0) {
            $scope.text = unescape($window.location.search.split('=')[1])
        }
    }])


    layoutForsecondDemand.filter('trusted', ['$sce', function($sce) {
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);
    layoutForsecondDemand.filter('contentFilter', function() {
        return function(text) {
            text = text.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
            text = text.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
            //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
            text = text.replace(/&nbsp;/ig, ''); //去掉&nbsp;
            return text;
        };
    });
    layoutForsecondDemand.filter('toZero', function() {
        return function(text) {
            if (text == null||text == 0) {
                return "面议"
            } else {
                return text + "元"
            }
        };
    });
    layoutForsecondDemand.filter('itemToId', function() {
        return function(text) {
            return text._id
        };
    });
    layoutForsecondDemand.filter('itemToName', function() {
        return function(item) {
            if (item.user && /^[\u3220-\uFA29]+$/.test(item.user.company.companyName)) {
                return item.user.company.companyName
            } else {
                return item.contacts
            }
        };
    });
    layoutForsecondDemand.filter('endToTime', function() {
        return function(text) {
            if (moment(text).isBefore(new Date())) {
                return "投标已截止"
            } else {
                var timeobj = moment(text).toDate().getTime()
                var nowObj = new Date().getTime()
                var str = ""
                var dateDiff = (timeobj - nowObj) / 1000
                var day = parseInt(dateDiff / 24 / 3600)
                var hours = parseInt(dateDiff % 86400 / 3600)
                var minute = parseInt(dateDiff % 3600 / 60)
                if (day > 0) {
                    str += day + "天"
                }
                if (hours > 0) {
                    str += hours + "小时"
                }
                if (minute > 0) {
                    str += minute + "分钟"
                }

                return str + "后截止"
            }
        };
    });
    layoutForsecondDemand.filter('fixdetails', function() {
        return function (input) {
            if(input.length>50){
                return input.substring(0,50)+"……"
            }else {
                return input
            }
        };
    })
    layoutForsecondDemand.filter('fixtitle', function() {
        return function (input) {
            if(input.length>30){
                return input.substring(0,30)+"……"
            }else {
                return input
            }
        };
    })
    layoutForsecondDemand.filter('fixcontentFilter', function() {
        return function (input) {
            if(input){
                for(var i=0;i<input.length;i++){
                    if(input[i].details.length>50){
                        input[i].j=true
                    }else {
                        input[i].j=false
                    }
                }
            }
            return input
        };
    })


})(angular, jQuery)