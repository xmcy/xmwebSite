var doraApp = angular.module('adminApp');
//期刊新增/编辑
doraApp.controller("addEbookManage",['$scope','$http',"$window",function($scope,$http,$window){
    $scope.formData = {};
    // 添加或修改期刊
    $scope.processForm = function(isValid){
        var regionObj={};
        if(isValid){
            if($scope.region!==""&&$scope.coverImg!==""){
                $scope.formData.state = true;
                var region=$scope.region.split('/')
                regionObj.province=region[0];
                regionObj.city=region[1];
                if(region.length==3){
                    regionObj.district=region[2];
                }else{
                    regionObj.district="";
                }
                var url="/admin/manage/updateEbook"
                if($scope.isEdit){
                    url+="?"+  $window.location.href.split('?')[1];
                }
                $scope.formData.region=JSON.stringify(regionObj)
                $scope.formData.coverImg=$scope.coverImg;
                angularHttpPost($http,isValid,url,$scope.formData,function(data){
                    if(data=="success"){
                        swal({
                            title: "提交成功",
                            type: "success",
                            confirmButtonText: "确定"
                        });
                    }else{
                        swal({
                            title: data,
                            type: "error",
                            confirmButtonText: "确定"
                        });
                    }
                });
            }else if($scope.coverImg==""){
                swal({
                    title: "请上传封面图片!",
                    type: "error",
                    confirmButtonText: "确定"
                });
            }else if($scope.region!==""){
                swal({
                    title: "请选择地址!",
                    type: "error",
                    confirmButtonText: "确定"
                });
            }

        }
    };

    $scope.getContentState = function(){
        if(!$scope.formData.state && $scope.targetID){
            return true;
        }else if($scope.targetID == undefined){
            return true;
        }else{
            return false;
        }
    };

}]);

//期刊列表
doraApp.controller('ebookManage',['$scope','$http',function($scope,$http){
    var postData=function () {
        var data={
            adType:'1',
            resType:$scope.status1,
            page:$scope.bigCurrentPage,
            limit:$scope.itemsPerPage,
            order:$scope.order
        }
        $http.post("/admin/manage/searchManageFilter",JSON.stringify(data)).success(function (res) {
            if(res!=="查询为空"){
                $scope.dataList=res.docs;
                $scope.bigTotalItems=res.pageInfo.totalItems;
            }else {
                $scope.dataList=[]
                $scope.bigTotalItems=0
                $scope.warningInfoData='暂无数据'
            }
            console.log(res)
        })
    }
    $scope.pageChanged = function(currentPage) {
        postData();
    };
    $scope.changeScope=function (item) {
        $scope.content=item
    }
    $scope.delOneItem=function (id) {
        swal({
                title: "删除",
                text: "确定删除这一条期刊资源",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "继续删除",
                closeOnConfirm: false
            },
            function(){
                $http.post("/admin/manage/deleteEbook",{
                    uid:id
                }).success(function (res) {
                    if(res=="success"){
                        swal({
                            title: "删除成功",
                            type: "success",
                            confirmButtonText: "确定"
                        });
                        postData()
                    }else {
                        swal({
                            title: "删除失败",
                            type: "error",
                            confirmButtonText: "确定"
                        });
                    }
                    console.log(res)
                })
            });

    }
    $scope.searchForEbookManage=function (text) {
        postData();
    }
    $scope.maxSize = 5;
    $scope.itemsPerPage=10;
    $scope.bigCurrentPage = 1;
    $scope.bigTotalItems=1;
    $scope.status1='';
    $scope.order={createdAt: -1};
    $scope.region={};
    $scope.content={}
    postData();
    
}]);
doraApp.controller('baoxiuManage',['$scope','$http',function($scope,$http){
    var postData=function () {
        var data={
            adType:'2',
            resType:$scope.status1,
            page:$scope.bigCurrentPage,
            limit:$scope.itemsPerPage,
            order:$scope.order
        }
        $http.post("/admin/manage/searchManageFilter",JSON.stringify(data)).success(function (res) {
            if(res!=="查询为空"){
                $scope.dataList=res.docs;
                $scope.bigTotalItems=res.pageInfo.totalItems;
            }else {
                $scope.dataList=[]
                $scope.bigTotalItems=0
                $scope.warningInfoData='暂无数据'
            }
            console.log(res)
        })
    }
    $scope.pageChanged = function(currentPage) {
        postData();
    };
    $scope.changeScope=function (item) {
        $scope.content=item
    }
    $scope.delOneItem=function (id) {
        swal({
                title: "删除",
                text: "确定删除这一条期刊资源",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "继续删除",
                closeOnConfirm: false
            },
            function(){
                $http.post("/admin/manage/deleteEbook",{
                    uid:id
                }).success(function (res) {
                    if(res=="success"){
                        swal({
                            title: "删除成功",
                            type: "success",
                            confirmButtonText: "确定"
                        });
                        postData()
                    }else {
                        swal({
                            title: "删除失败",
                            type: "error",
                            confirmButtonText: "确定"
                        });
                    }
                    console.log(res)
                })
            });

    }
    $scope.searchForEbookManage=function (text) {
        postData();
    }
    $scope.maxSize = 5;
    $scope.itemsPerPage=10;
    $scope.bigCurrentPage = 1;
    $scope.bigTotalItems=1;
    $scope.status1='';
    $scope.order={createdAt: -1};
    $scope.region={};
    $scope.content={}
    postData();

}]);
doraApp.controller('jianyiManage',['$scope','$http',function($scope,$http){
    var postData=function () {
        var data={
            adType:'3',
            resType:$scope.status1,
            page:$scope.bigCurrentPage,
            limit:$scope.itemsPerPage,
            order:$scope.order
        }
        $http.post("/admin/manage/searchManageFilter",JSON.stringify(data)).success(function (res) {
            if(res!=="查询为空"){
                $scope.dataList=res.docs;
                $scope.bigTotalItems=res.pageInfo.totalItems;
            }else {
                $scope.dataList=[]
                $scope.bigTotalItems=0
                $scope.warningInfoData='暂无数据'
            }
            console.log(res)
        })
    }
    $scope.pageChanged = function(currentPage) {
        postData();
    };
    $scope.changeScope=function (item) {
        $scope.content=item
    }
    $scope.delOneItem=function (id) {
        swal({
                title: "删除",
                text: "确定删除这一条期刊资源",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "继续删除",
                closeOnConfirm: false
            },
            function(){
                $http.post("/admin/manage/deleteEbook",{
                    uid:id
                }).success(function (res) {
                    if(res=="success"){
                        swal({
                            title: "删除成功",
                            type: "success",
                            confirmButtonText: "确定"
                        });
                        postData()
                    }else {
                        swal({
                            title: "删除失败",
                            type: "error",
                            confirmButtonText: "确定"
                        });
                    }
                    console.log(res)
                })
            });

    }
    $scope.searchForEbookManage=function (text) {
        postData();
    }
    $scope.maxSize = 5;
    $scope.itemsPerPage=10;
    $scope.bigCurrentPage = 1;
    $scope.bigTotalItems=1;
    $scope.status1='';
    $scope.order={createdAt: -1};
    $scope.region={};
    $scope.content={}
    postData();

}]);

//VR列表
doraApp.controller('vrManage',['$scope','$http',function($scope,$http){
    var postData=function () {
        var data={
            resType:"VR",
            page:$scope.bigCurrentPage,
            limit:$scope.itemsPerPage,
            type:$scope.type,
            title:$scope.title,
            recommend:$scope.recommend,
            order:$scope.order,
            region:$scope.region
        }
        $http.post("/admin/manage/searchManageFilter",JSON.stringify(data)).success(function (res) {
            if(res!=="查询为空"){
                $scope.dataList=res.docs;
                $scope.bigTotalItems=res.pageInfo.totalItems;
            }else {
                $scope.dataList=[]
                $scope.bigTotalItems=0
                $scope.warningInfoData='暂无数据'
            }
            console.log(res)
        })
    }
    $scope.pageChanged = function(currentPage) {
        postData();
    };
    $scope.delOneItem=function (id) {
        swal({
                title: "删除",
                text: "确定删除这一条期刊资源",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "继续删除",
                closeOnConfirm: false
            },
            function(){
                $http.post("/admin/manage/deleteVR",{
                    uid:id
                }).success(function (res) {
                    if(res=="success"){
                        swal({
                            title: "删除成功",
                            type: "success",
                            confirmButtonText: "确定"
                        });
                        postData()
                    }else {
                        swal({
                            title: "删除失败",
                            type: "error",
                            confirmButtonText: "确定"
                        });
                    }
                    console.log(res)
                })
            });

    }
    $scope.searchForEbookManage=function (text) {
        if($scope.regionStr!==""){
            var regionObj={};
            var region=$scope.regionStr.split('/')
            regionObj.province=region[0];
            regionObj.city=region[1];
            if(region.length==3){
                regionObj.district=region[2];
            }else{
                regionObj.district="";
            }
            // $scope.region=JSON.stringify(regionObj)
            $scope.region=regionObj
        }
        postData();
    }
    $scope.maxSize = 5;
    $scope.itemsPerPage=10;
    $scope.bigCurrentPage = 1;
    $scope.bigTotalItems=1;
    $scope.text='';
    $scope.order={createdAt: -1};
    $scope.region={};
    $scope.type='';
    $scope.title='';
    $scope.recommend='';

    postData();

}]);
//轮播图新增/编辑
doraApp.controller("addSlideManage",['$scope','$http',"$window",function($scope,$http,$window){
    $scope.formData = {};
    // 添加或修改期刊
    $scope.processForm = function(isValid){
        var regionObj={};
        if(isValid){
            if($scope.region!==""&&$scope.img!==""){
                var region=$scope.region.split('/')
                regionObj.province=region[0];
                regionObj.city=region[1];
                if(region.length==3){
                    regionObj.district=region[2];
                }else{
                    regionObj.district="";
                }
                var url="/admin/manage/updateSlide"
                if($scope.isEdit){
                    url+="?"+  $window.location.href.split('?')[1];
                }
                $scope.formData.region=JSON.stringify(regionObj)
                $scope.formData.img=$scope.img;
                angularHttpPost($http,isValid,url,$scope.formData,function(data){
                    if(data=="success"){
                        swal({
                            title: "提交成功",
                            type: "success",
                            confirmButtonText: "确定"
                        });
                    }else{
                        swal({
                            title: data,
                            type: "error",
                            confirmButtonText: "确定"
                        });
                    }
                });
            }else if($scope.img==""){
                swal({
                    title: "请上传图片!",
                    type: "error",
                    confirmButtonText: "确定"
                });
            }else if($scope.region!==""){
                swal({
                    title: "请选择地址!",
                    type: "error",
                    confirmButtonText: "确定"
                });
            }

        }
    };


}]);

//轮播图列表
doraApp.controller('slideManage',['$scope','$http',function($scope,$http){
    var postData=function () {
        $http.post("/admin/manage/searchManageSlideFilter",{
            resType:"Slide",
            where:$scope.where,
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
            console.log(res)
        })
    }
    $scope.pageChanged = function(currentPage) {
        postData();
    };
    $scope.delOneItem=function (id) {
        swal({
                title: "删除",
                text: "确定删除这一条轮播图资源",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "继续删除",
                closeOnConfirm: false
            },
            function(){
                $http.post("/admin/manage/deleteSlide",{
                    uid:id
                }).success(function (res) {
                    if(res=="success"){
                        swal({
                            title: "删除成功",
                            type: "success",
                            confirmButtonText: "确定"
                        });
                        postData()
                    }else {
                        swal({
                            title: "删除失败",
                            type: "error",
                            confirmButtonText: "确定"
                        });
                    }
                    console.log(res)
                })
            });

    }

    $scope.searchForSlideManage=function () {
        if($scope.regionStr!==""){
            var regionObj={};
            var region=$scope.regionStr.split('/')
            regionObj.province=region[0];
            regionObj.city=region[1];
            if(region.length==3){
                regionObj.district=region[2];
            }else{
                regionObj.district="";
            }
            // $scope.region=JSON.stringify(regionObj)
            $scope.region=regionObj
        }
        postData();
    }

    $scope.maxSize = 5;
    $scope.itemsPerPage=10;
    $scope.bigCurrentPage = 1;
    $scope.bigTotalItems=1;
    $scope.where='';
    $scope.order={createdAt: -1};
    $scope.region={};

    postData();

}]);

//搜索列表
doraApp.controller('searchRcdManage',['$scope','$http',function($scope,$http){
    $scope.formData = {};
    var postData=function () {
        $http.post("/admin/manage/searchManageSlideFilter",{
            resType:"SearchRecommend",
            where:$scope.where1,
            type:$scope.type1,
            text:$scope.textForSearch,
            page:$scope.bigCurrentPage,
            limit:$scope.itemsPerPage,
            order:$scope.order,
            region:$scope.regionForSearch
        }).success(function (res) {
            if(res!=="查询为空"){
                $scope.dataList=res.docs;
                $scope.region=""
                $scope.bigTotalItems=res.pageInfo.totalItems;
            }else {
                $scope.dataList=[]
                $scope.bigTotalItems=0
                $scope.warningInfoData='暂无数据'
            }
            console.log(res)
        })
    }
    $scope.searchForSlideManage=function () {
        if($scope.regionStr!==""){
            var regionObj={};
            var region=$scope.regionStr.split('/')
            regionObj.province=region[0];
            regionObj.city=region[1];
            if(region.length==3){
                regionObj.district=region[2];
            }else{
                regionObj.district="";
            }
            // $scope.region=JSON.stringify(regionObj)
            $scope.regionForSearch=regionObj
        }
        postData();
    }
    $scope.pageChanged = function(currentPage) {
        postData();
    };
    $scope.edit=function (item) {
        // 修改搜索列表
        $('#addContentTags').on('show.bs.modal', function (event) {
            var obj = $(event.relatedTarget);
            var editId = obj.data('whatever');
            var modalTitle = $(this).find('.modal-title');
            // 如果不为空则为编辑状态
            if(editId){
                modalTitle.text("编辑搜索");
                $scope.formData = item;
                $scope.formData.isEdit=true
                $('#region').citypicker("destroy")
                $('#region').citypicker({
                    placeholder:$scope.formData.region.province+'/'+$scope.formData.region.city+'/'+$scope.formData.region.district
                });
                $('#type').selectpicker('val', $scope.formData.type)
                $('#where').selectpicker('val', $scope.formData.where)
            }else{
                modalTitle.text("添加新搜索");
                $scope.formData = {};
            }
        }).on('hidden.bs.modal', function (e) {
            // 清空数据
            $('#type').selectpicker('val','请选择搜索类型');
            $('#where').selectpicker('val','请选择搜索位置');
            $('#region').citypicker("destroy")
            $('#region').citypicker({
                placeholder:"请选择地区"
            });
        });
    }

    $scope.delOneItem=function (id) {
        swal({
                title: "删除",
                text: "确定删除这一条搜索资源",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "继续删除",
                closeOnConfirm: false
            },
            function(){
                $http.post("/admin/manage/searchRcdManageDel",{
                    uid:id
                }).success(function (res) {
                    if(res=="success"){
                        swal({
                            title: "删除成功",
                            type: "success",
                            confirmButtonText: "确定"
                        });
                        postData()
                    }else {
                        swal({
                            title: "删除失败",
                            type: "error",
                            confirmButtonText: "确定"
                        });
                    }
                    console.log(res)
                })
            });

    }
    $scope.maxSize = 5;
    $scope.itemsPerPage=10;
    $scope.bigCurrentPage = 1;
    $scope.bigTotalItems=1;
    $scope.where='';
    $scope.order={createdAt: -1};
    $scope.region={};
    $scope.regionForSearch={}

    $scope.processForm = function(isValid){
        var regionObj={};
        var url="/admin/manage/addSearchRcdManage"

        if(isValid){
            if($scope.formData.isEdit){
                url+="?uid="+  $scope.formData._id;
                $scope.formData.region=JSON.stringify($scope.formData.region)
            }
            if($scope.region!=="") {
                    var region = $scope.region.split('/')
                    regionObj.province = region[0];
                    regionObj.city = region[1];
                    if (region.length == 3) {
                        regionObj.district = region[2];
                    } else {
                        regionObj.district = "";
                    }
                    $scope.formData.region=JSON.stringify(regionObj)
            }
                angularHttpPost($http,isValid,url,$scope.formData,function(data){
                    if(data=="success"){
                        swal({
                            title: "提交成功",
                            type: "success",
                            confirmButtonText: "确定"
                        });
                        $scope.formData={}
                        regionObj={}
                        $scope.region=""
                        postData()
                    }else{
                        swal({
                            title: data,
                            type: "error",
                            confirmButtonText: "确定"
                        });
                    }
                });
            }else if($scope.region!==""){
                swal({
                    title: "请选择地址!",
                    type: "error",
                    confirmButtonText: "确定"
                });
            }


    };

    postData();

}]);





//二级栏目设置列表
doraApp.controller('categorySettingMng',['$scope','$http',function($scope,$http){
    var postData=function () {
        $http.post("/admin/manage/searchManageCategorySettingFilter",{
            resType:"CategorySetting",
            page:$scope.bigCurrentPage,
            limit:$scope.itemsPerPage,
            order:$scope.order,
            type:$scope.type1
        }).success(function (res) {
            if(res!=="查询为空"){
                $scope.dataList=res.docs;
                $scope.bigTotalItems=res.pageInfo.totalItems;
            }else {
                $scope.dataList=[]
                $scope.bigTotalItems=0
                $scope.warningInfoData='暂无数据'
            }
            console.log(res)
        })
    }
    $scope.searchForSlideManage=function () {
       
        postData();
    }
    $scope.$watch("flag",function () {
        postData();
    })
    $scope.pageChanged = function(currentPage) {
        postData();
    };
    $scope.delOneItem=function (id) {
        swal({
                title: "删除",
                text: "确定删除这一条二级栏目设置",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "继续删除",
                closeOnConfirm: false
            },
            function(){
                $http.post("/admin/manage/categorySettingMngDel",{
                    resType:"CategorySetting",
                    uid:id
                }).success(function (res) {
                    if(res=="success"){
                        swal({
                            title: "删除成功",
                            type: "success",
                            confirmButtonText: "确定"
                        });
                        postData()
                    }else {
                        swal({
                            title: "删除失败",
                            type: "error",
                            confirmButtonText: "确定"
                        });
                    }
                    console.log(res)
                })
            });

    }
    $scope.maxSize = 5;
    $scope.itemsPerPage=10;
    $scope.bigCurrentPage = 1;
    $scope.bigTotalItems=1;
    $scope.order={createdAt: -1};

    postData();

}]);

//二级栏目推荐列表
doraApp.controller('CategoryRecommend',['$scope','$http',function($scope,$http){
    var postData=function () {
        $http.post("/admin/manage/searchManageCategorySettingFilter",{
            resType:"CategoryRecommend",
            page:$scope.bigCurrentPage,
            limit:$scope.itemsPerPage,
            order:$scope.order,
            type:$scope.type1
        }).success(function (res) {
            if(res!=="查询为空"){
                $scope.dataList=res.docs;
                $scope.bigTotalItems=res.pageInfo.totalItems;
            }else {
                $scope.dataList=[]
                $scope.bigTotalItems=0
                $scope.warningInfoData='暂无数据'
            }
            console.log(res)
        })
    }
    $scope.searchForSlideManage=function () {
        postData();
    }
    $scope.$watch("flag",function () {
        postData();
    })
    $scope.pageChanged = function(currentPage) {
        postData();
    };
    $scope.delOneItem=function (id) {
        swal({
                title: "删除",
                text: "确定删除这一条二级栏目推荐",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "继续删除",
                closeOnConfirm: false
            },
            function(){
                $http.post("/admin/manage/categorySettingMngDel",{
                    uid:id,
                    resType:"CategoryRecommend"
                }).success(function (res) {
                    if(res=="success"){
                        swal({
                            title: "删除成功",
                            type: "success",
                            confirmButtonText: "确定"
                        });
                        postData()
                    }else {
                        swal({
                            title: "删除失败",
                            type: "error",
                            confirmButtonText: "确定"
                        });
                    }
                    console.log(res)
                })
            });

    }
    $scope.maxSize = 5;
    $scope.itemsPerPage=5;
    $scope.bigCurrentPage = 1;
    $scope.bigTotalItems=1;
    $scope.order={createdAt: -1};

    postData();

}]);

//个人信息审核列表
doraApp.controller('IdCardIdentifyVerify',['$scope','$http',function($scope,$http){
    var postData=function () {
        $http.post("/admin/manage/userManageVerifyFilter",{
            resType:"IdCardIdentify",
            page:$scope.bigCurrentPage,
            limit:$scope.itemsPerPage,
            order:$scope.order,
            status:$scope.status1
        }).success(function (res) {
            if(res!=="查询为空"){
                $scope.dataList=res.docs;
                $scope.bigTotalItems=res.pageInfo.totalItems;
            }else {
                $scope.dataList=[]
                $scope.bigTotalItems=0
                $scope.warningInfoData='暂无数据'
            }
            console.log(res)
        })
    }
    $scope.searchForSlideManage=function () {
        postData();
    }
    $scope.$watch("flag",function () {
        postData();
    })
    $scope.pageChanged = function(currentPage) {
        postData();
    };
    $scope.delOneItem=function (id) {
        swal({
                title: "删除",
                text: "确定删除这一条二级栏目设置",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "继续删除",
                closeOnConfirm: false
            },
            function(){
                $http.post("/admin/manage/categorySettingMngDel",{
                    resType:"CategorySetting",
                    uid:id
                }).success(function (res) {
                    if(res=="success"){
                        swal({
                            title: "删除成功",
                            type: "success",
                            confirmButtonText: "确定"
                        });
                        postData()
                    }else {
                        swal({
                            title: "删除失败",
                            type: "error",
                            confirmButtonText: "确定"
                        });
                    }
                    console.log(res)
                })
            });

    }
    $scope.maxSize = 5;
    $scope.itemsPerPage=10;
    $scope.bigCurrentPage = 1;
    $scope.bigTotalItems=1;
    $scope.order={createdAt: -1};

    postData();

}]);

//企业信息审核列表
doraApp.controller('CompanyIdentifyVerify',['$scope','$http',function($scope,$http){
    var postData=function () {
        $http.post("/admin/manage/userManageVerifyFilter",{
            resType:"CompanyIdentify",
            page:$scope.bigCurrentPage,
            limit:$scope.itemsPerPage,
            order:$scope.order,
            name:$scope.name1,
            owner:$scope.owner1,
            status:$scope.status1,
            num:$scope.num1
        }).success(function (res) {
            if(res!=="查询为空"){
                $scope.dataList=res.docs;
                $scope.bigTotalItems=res.pageInfo.totalItems;
            }else {
                $scope.dataList=[]
                $scope.bigTotalItems=0
                $scope.warningInfoData='暂无数据'
            }
            console.log(res)
        })
    }
    $scope.searchForSlideManage=function () {
        postData();
    }
    $scope.$watch("flag",function () {
        postData();
    })
    $scope.pageChanged = function(currentPage) {
        postData();
    };
    $scope.delOneItem=function (id) {
        swal({
                title: "删除",
                text: "确定删除这一条二级栏目设置",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "继续删除",
                closeOnConfirm: false
            },
            function(){
                $http.post("/admin/manage/categorySettingMngDel",{
                    resType:"CategorySetting",
                    uid:id
                }).success(function (res) {
                    if(res=="success"){
                        swal({
                            title: "删除成功",
                            type: "success",
                            confirmButtonText: "确定"
                        });
                        postData()
                    }else {
                        swal({
                            title: "删除失败",
                            type: "error",
                            confirmButtonText: "确定"
                        });
                    }
                    console.log(res)
                })
            });

    }
    $scope.maxSize = 5;
    $scope.itemsPerPage=10;
    $scope.bigCurrentPage = 1;
    $scope.bigTotalItems=1;
    $scope.order={createdAt: -1};
    postData();

}]);

//品牌推广列表
doraApp.controller('BrandPromotion',['$scope','$http',function($scope,$http){
    var postData=function () {
        $http.post("/admin/manage/searchPromotionFilter",{
            page:$scope.bigCurrentPage,
            limit:$scope.itemsPerPage,
            order:$scope.order,
            region:$scope.regionForSearch,
            companyName:$scope.companyName,
            period:$scope.period,
            billState:$scope.billState,
            expire:$scope.expire,
            priorShow:true,
            eBook:$scope.ckEbook,
            VR:$scope.ckVR,
            weMedia:$scope.ckWeMedia
        }).success(function (res) {
            if(res!=="查询为空"){
                $scope.dataList=res.docs;
                $scope.bigTotalItems=res.pageInfo.totalItems;
            }else {
                $scope.dataList=[]
                $scope.bigTotalItems=0
                $scope.warningInfoData='暂无数据'
            }
            console.log(res)
        })
    }
    $scope.searchForEbookManage=function () {
        if($scope.regionStr&&$scope.regionStr!==""){
            var regionObj={};
            var region=$scope.regionStr.split('/')
            regionObj.province=region[0];
            regionObj.city=region[1];
            if(region.length==3){
                regionObj.district=region[2];
            }else{
                regionObj.district="";
            }
            // $scope.region=JSON.stringify(regionObj)
            $scope.regionForSearch=regionObj
        }
        postData();
    }
    $scope.$watch("flag",function () {
        postData();
    })
    $scope.pageChanged = function(currentPage) {
        postData();
    };
    $scope.maxSize = 5;
    $scope.itemsPerPage=10;
    $scope.bigCurrentPage = 1;
    $scope.bigTotalItems=1;
    $scope.order={createdAt: -1};
    $scope.region={}
    $scope.regionForSearch={}

    postData();

}]);

//精准推广列表
doraApp.controller('PrecisePromotion',['$scope','$http',function($scope,$http){
    var postData=function () {
        $http.post("/admin/manage/searchPrecisePromotionFilter",{
            page:$scope.bigCurrentPage,
            limit:$scope.itemsPerPage,
            order:$scope.order,
            region:$scope.regionForSearch,
            period:$scope.period,
            billState:$scope.billState,
        }).success(function (res) {
            if(res!=="查询为空"){
                $scope.dataList=res.docs;
                $scope.bigTotalItems=res.pageInfo.totalItems;
            }else {
                $scope.dataList=[]
                $scope.bigTotalItems=0
                $scope.warningInfoData='暂无数据'
            }
            console.log(res)
        })
    }
    $scope.searchForSlideManage=function () {
        if($scope.regionStr&&$scope.regionStr!==""){
            var regionObj={};
            var region=$scope.regionStr.split('/')
            regionObj.province=region[0];
            regionObj.city=region[1];
            if(region.length==3){
                regionObj.district=region[2];
            }else{
                regionObj.district="";
            }
            // $scope.region=JSON.stringify(regionObj)
            $scope.regionForSearch=regionObj
        }
        postData();
    }
    
    $scope.changeShowing=function (id,isShowing) {
        $http.post("/admin/manage/precisePromotionChange",{
            id:id,
            isShowing:isShowing
        }).success(function (res) {
            if(res=="success"){
                swal({
                    title: "修改成功",
                    type: "success",
                    confirmButtonText: "确定"
                });
                postData();
            }else {
                swal({
                    title: res,
                    type: "error",
                    confirmButtonText: "确定"
                });
            }

        })
    }
    $scope.pageChanged = function(currentPage) {
        postData();
    };
    $scope.maxSize = 5;
    $scope.itemsPerPage=10;
    $scope.bigCurrentPage = 1;
    $scope.bigTotalItems=1;
    $scope.order={createdAt: -1};
    $scope.region={}
    $scope.regionForSearch={}
    $scope.billState=""
    postData();

}]);


doraApp.controller('pubHistoryController',['$scope','$http',function($scope,$http){
    var postData=function () {
        $http.post("/searchResFilter",{
            resType:$scope.resType,
            page:$scope.bigCurrentPage,
            limit:$scope.itemsPerPage,
            order:$scope.order,
            text:$scope.title,
            region:$scope.regionForSearch,
        }).success(function (res) {
            if(res!=="查询为空"){
                $scope.dataList=res.docs;
                $scope.bigTotalItems=res.pageInfo.totalItems;
            }else {
                $scope.dataList=[]
                $scope.bigTotalItems=0
                $scope.warningInfoData='暂无数据'
            }
            console.log(res)
        })
    }
    $scope.searchForEbookManage=function () {
        if($scope.regionStr&&$scope.regionStr!==""){
            var regionObj={};
            var region=$scope.regionStr.split('/')
            regionObj.province=region[0];
            regionObj.city=region[1];
            if(region.length==3){
                regionObj.district=region[2];
            }else{
                regionObj.district="";
            }
            // $scope.region=JSON.stringify(regionObj)
            $scope.regionForSearch=regionObj
        }
        postData();
    }

    $scope.changeShowing=function (id,isShowing) {
        $http.post("/admin/manage/triggerResShow",{
            resId:id,
            isShowing:isShowing
        }).success(function (res) {
            if(res=="success"){
                swal({
                    title: "修改成功",
                    type: "success",
                    confirmButtonText: "确定"
                });
                postData();
            }else {
                swal({
                    title: res,
                    type: "error",
                    confirmButtonText: "确定"
                });
            }

        })
    }
    $scope.pageChanged = function(currentPage) {
        postData();
    };
    $scope.delOneItem=function (id) {
        swal({
                title: "删除",
                text: "确定删除这一条资源",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "继续删除",
                closeOnConfirm: false
            },
            function(){
                $http.post("/admin/manage/deleteResource",{
                    id:id
                }).success(function (res) {
                    if(res=="success"){
                        swal({
                            title: "删除成功",
                            type: "success",
                            confirmButtonText: "确定"
                        });
                        postData()
                    }else {
                        swal({
                            title: "删除失败",
                            type: "error",
                            confirmButtonText: "确定"
                        });
                    }
                    console.log(res)
                })
            });

    }

    $scope.maxSize = 5;
    $scope.itemsPerPage=10;
    $scope.bigCurrentPage = 1;
    $scope.bigTotalItems=1;
    $scope.order={createdAt: -1};
    $scope.region={}
    $scope.regionForSearch={}
    $scope.resType="Manufacture"
    $scope.title=""
    postData();

}]);

//招标信息列表
doraApp.controller('tenderManageController',['$scope','$http',function($scope,$http){
    var postData=function () {
        $http.post("/admin/manage/searchTenderFilterByAdmin",{
            page:$scope.bigCurrentPage,
            tenderType:$scope.tenderType,
            text:$scope.textForSearch,
            status:$scope.status,
            region:$scope.regionForSearch,
            limit:$scope.itemsPerPage,
            order:$scope.order
        }).success(function (res) {
            if(res!=="查询为空"){
                $scope.dataList=res.docs;
                $scope.bigTotalItems=res.pageInfo.totalItems;
            }else {
                $scope.dataList=[]
                $scope.bigTotalItems=0
                $scope.warningInfoData='暂无数据'
            }
            console.log(res)
        })
    }
    $scope.searchForSlideManage=function () {
        if($scope.regionStr!==""){
            var regionObj={};
            var region=$scope.regionStr.split('/')
            regionObj.province=region[0];
            regionObj.city=region[1];
            if(region.length==3){
                regionObj.district=region[2];
            }else{
                regionObj.district="";
            }
            // $scope.region=JSON.stringify(regionObj)
            $scope.regionForSearch=regionObj
        }
        postData();
    }
    $scope.$watch("flag",function () {
        postData();
    })
    $scope.pageChanged = function(currentPage) {
        postData();
    };
    $scope.delOneItem=function (id) {
        swal({
                title: "删除",
                text: "确定删除这一条招标",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "继续删除",
                closeOnConfirm: false
            },
            function(){
                $http.post("/admin/manage/tenderDelById",{
                    id:id
                }).success(function (res) {
                    if(res=="success"){
                        swal({
                            title: "删除成功",
                            type: "success",
                            confirmButtonText: "确定"
                        });
                        postData()
                    }else {
                        swal({
                            title: "删除失败",
                            type: "error",
                            confirmButtonText: "确定"
                        });
                        postData()
                    }
                    console.log(res)
                })
            });

    }
    $scope.maxSize = 5;
    $scope.itemsPerPage=10;
    $scope.bigCurrentPage = 1;
    $scope.bigTotalItems=1;
    $scope.tenderType="";
    $scope.textForSearch="";
    $scope.regionForSearch={}
    $scope.status="";
    $scope.order={createdAt: -1};

    postData();

}]);

//提现信息列表
doraApp.controller('withdrawCashManageController',['$scope','$http',function($scope,$http){
    var postData=function () {
        $http.post("/admin/manage/searchCashFilterByAdmin",{
            page:$scope.bigCurrentPage,
            status:$scope.status,
            limit:$scope.itemsPerPage,
            order:$scope.order
        }).success(function (res) {
            if(res!=="查询为空"){
                $scope.dataList=res.docs;
                $scope.bigTotalItems=res.pageInfo.totalItems;
            }else {
                $scope.dataList=[]
                $scope.bigTotalItems=0
                $scope.warningInfoData='暂无数据'
            }
            console.log(res)
        })
    }
    $scope.searchForSlideManage=function () {
        postData();
    }
    $scope.pageChanged = function(currentPage) {
        postData();
    };
    $scope.agreeWithdraw=function (item) {
        swal({
                title: "审核通过",
                text: "确定审核通过这一条提现",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "审核通过",
                closeOnConfirm: false
            },
            function(){
                $http.post("/admin/manage/transferCash",{
                    tenderId:item.targetId._id,
                    price:item.price,
                    companyId:item.company,
                    userId:item.user._id,
                }).success(function (res) {
                    if(res.result=="success"){
                        swal({
                            title: "提交成功",
                            type: "success",
                            confirmButtonText: "确定"
                        });
                        postData()
                    }else {
                        swal({
                            title: "提交失败",
                            type: "error",
                            confirmButtonText: "确定"
                        });
                        postData()
                    }
                    console.log(res)
                })
            });

    }
    // $scope.delOneItem=function (id) {
    //     swal({
    //             title: "删除",
    //             text: "确定删除这一条招标",
    //             type: "warning",
    //             showCancelButton: true,
    //             confirmButtonColor: "#DD6B55",
    //             confirmButtonText: "继续删除",
    //             closeOnConfirm: false
    //         },
    //         function(){
    //             $http.post("/admin/manage/tenderDelById",{
    //                 id:id
    //             }).success(function (res) {
    //                 if(res=="success"){
    //                     swal({
    //                         title: "删除成功",
    //                         type: "success",
    //                         confirmButtonText: "确定"
    //                     });
    //                     postData()
    //                 }else {
    //                     swal({
    //                         title: "删除失败",
    //                         type: "error",
    //                         confirmButtonText: "确定"
    //                     });
    //                     postData()
    //                 }
    //                 console.log(res)
    //             })
    //         });
    //
    // }
    $scope.maxSize = 5;
    $scope.itemsPerPage=10;
    $scope.bigCurrentPage = 1;
    $scope.bigTotalItems=1;
    $scope.status="";
    $scope.order={createdAt: -1};

    postData();

}]);


doraApp.controller('complainManageController',['$scope','$http',function($scope,$http){
    var postData=function () {
        $http.post("/admin/manage/searchComplainFilterByAdmin",{
            page:$scope.bigCurrentPage,
            limit:$scope.itemsPerPage,
            isSoluted:$scope.isSoluted,
            order:$scope.order
        }).success(function (res) {
            if(res!=="查询为空"){
                $scope.dataList=res.docs;
                $scope.bigTotalItems=res.pageInfo.totalItems;
            }else {
                $scope.dataList=[]
                $scope.bigTotalItems=0
                $scope.warningInfoData='暂无数据'
            }
            console.log(res)
        })
    }
    $scope.agreeToSolute=function (item) {
        swal({
                title: "解决投诉",
                text: "解决投诉将有可能扣除招标保证金和企业保证金",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "解决投诉",
                closeOnConfirm: false
            },
            function(){
                $http.post("/admin/manage/agreeToSolute",{
                    tenderId:item.tender._id
                }).success(function (res) {
                    if(res.result=="success"){
                        swal({
                            title: "提交成功",
                            type: "success",
                            confirmButtonText: "确定"
                        });
                        postData()
                    }else {
                        swal({
                            title: "提交失败",
                            type: "error",
                            confirmButtonText: "确定"
                        });
                        postData()
                    }
                    console.log(res)
                })
            });
    }
    
    $scope.deagreeToSolute=function (item) {
        swal({
                title: "关闭投诉",
                text: "关闭投诉",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "关闭投诉",
                closeOnConfirm: false
            },
            function(){
                $http.post("/admin/manage/deagreeToSolute",{
                    complainId:item._id
                }).success(function (res) {
                    if(res.result){
                        swal({
                            title: "提交成功",
                            type: "success",
                            confirmButtonText: "确定"
                        });
                        postData()
                    }else {
                        swal({
                            title: "提交失败",
                            type: "error",
                            confirmButtonText: "确定"
                        });
                        console.log(res)
                    }

                })
            });

    }
    $scope.searchForSlideManage=function () {
        postData();
    }
    $scope.pageChanged = function(currentPage) {
        postData();
    };

    $scope.maxSize = 5;
    $scope.itemsPerPage=10;
    $scope.bigCurrentPage = 1;
    $scope.bigTotalItems=1;
    $scope.status="";
    $scope.order={createdAt: -1};
    $scope.isSoluted=""
    postData();

}]);

//文章管理
doraApp.controller('articleManage',['$scope','$http','$timeout',function($scope,$http,$timeout){
    $scope.formData = {};
    var postData=function () {
        $http.post("/admin/manage/searchArticleFilter",{
            from:$scope.fromFor,
            title:$scope.titleFor,
            page:$scope.bigCurrentPage,
            limit:$scope.itemsPerPage,
            isDeleted:$scope.isDeleted,
            isTop:$scope.isTop
        }).success(function (res) {
            if(res!=="查询为空"){
                $scope.dataList=res.docs;
                $scope.region=""
                $scope.bigTotalItems=res.pageInfo.totalItems;
            }else {
                $scope.dataList=[]
                $scope.bigTotalItems=0
                $scope.warningInfoData='暂无数据'
            }
            console.log(res)
        })
    }

    $scope.searchForSlideManage=function () {
        postData()
    }
    $scope.pageChanged = function(currentPage) {
        postData();
    };
    $scope.edit=function (item) {
        // 修改搜索列表
        $('#addContentTags').on('show.bs.modal', function (event) {
            var obj = $(event.relatedTarget);
            var editId = obj.data('whatever');
            var modalTitle = $(this).find('.modal-title');
            // 如果不为空则为编辑状态
            if(editId){
                modalTitle.text("编辑搜索");
                $scope.formData = item;
                $scope.formData.isEdit=true
                $(".modal-footer").before("<input id='itemId' type='hidden' value='"+item.contentNum+"'>")
                $timeout(function () {
                    editor.$txt.append($scope.formData.discription);
                },0)
                $("#title").val($scope.formData.title)
                $("#tags").val($scope.formData.tags)
                $("#keywords").val($scope.formData.keywords)
                $("#oldAuthor").val($scope.formData.oldAuthor)
                $("#sImg").attr("src",$scope.formData.sImg)
                $('#from').selectpicker('val', $scope.formData.from)
                $('#category').selectpicker('val', $scope.formData.category)
                $scope.$apply()
            }else{
                modalTitle.text("添加新搜索");
                $scope.formData = {};
            }
        }).on('hidden.bs.modal', function (e) {
            // 清空数据
            $("#title").val("")
            $("#tags").val("")
            $("#keywords").val("")
            $("#oldAuthor").val("")
            $("#sImg").attr("src","")
            $('#from').selectpicker('val',"")
            $('#category').selectpicker('val', "")
            $("#itemId").remove()
        });
    }

    $scope.toTop=function (id) {
        $.post("/admin/manage/topArticle",{
            itemId:id
        },function (res) {
            if(res=="success"){
                swal({
                    title: "置顶成功",
                    type: "success",
                    confirmButtonText: "确定"
                });
                postData()
            }else {
                swal({
                    title: "提交失败",
                    type: "error",
                    confirmButtonText: "确定"
                });
                console.log(res)
            }
        })
    }

    $scope.cancletoTop=function (id) {
        $.post("/admin/manage/cancletopArticle",{
            itemId:id
        },function (res) {
            if(res=="success"){
                swal({
                    title: "取消置顶成功",
                    type: "success",
                    confirmButtonText: "确定"
                });
                postData()
            }else {
                swal({
                    title: "提交失败",
                    type: "error",
                    confirmButtonText: "确定"
                });
                console.log(res)
            }
        })
    }
    $scope.delOneItem=function (id) {
        swal({
                title: "删除",
                text: "确定删除这一篇文章",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "继续删除",
                closeOnConfirm: false
            },
            function(){
                $http.post("/admin/manage/delArticle",{
                    itemId:id
                }).success(function (res) {
                    if(res=="success"){
                        swal({
                            title: "删除成功",
                            type: "success",
                            confirmButtonText: "确定"
                        });
                        postData()
                    }else {
                        swal({
                            title: "删除失败",
                            type: "error",
                            confirmButtonText: "确定"
                        });
                        console.log(res)
                    }
                })
            });

    }
    $scope.maxSize = 5;
    $scope.itemsPerPage=10;
    $scope.bigCurrentPage = 1;
    $scope.bigTotalItems=1;
    $scope.fromFor='';
    $scope.titleFor='';
    $scope.isDeleted=''
    $scope.isTop=''
    $scope.order={createdAt: -1};
    postData();

}]);

//新闻管理
doraApp.controller('newsManage',['$scope','$http','$timeout',function($scope,$http,$timeout){
    $scope.formData = {};
    var postData=function () {
        $http.post("/admin/manage/searchNewsFilter",{
            title:$scope.titleFor,
            page:$scope.bigCurrentPage,
            limit:$scope.itemsPerPage,
            isDeleted:$scope.isDeleted,
            isTop:$scope.isTop
        }).success(function (res) {
            if(res!=="查询为空"){
                $scope.dataList=res.docs;
                $scope.region=""
                $scope.bigTotalItems=res.pageInfo.totalItems;
            }else {
                $scope.dataList=[]
                $scope.bigTotalItems=0
                $scope.warningInfoData='暂无数据'
            }
            console.log(res)
        })
    }

    $scope.searchForSlideManage=function () {
        postData()
    }
    $scope.pageChanged = function(currentPage) {
        postData();
    };
    $scope.edit=function (item) {
        // 修改搜索列表
        $('#addContentTags').on('show.bs.modal', function (event) {
            var obj = $(event.relatedTarget);
            var editId = obj.data('whatever');
            var modalTitle = $(this).find('.modal-title');
            // 如果不为空则为编辑状态
            if(editId){
                modalTitle.text("编辑搜索");
                $scope.formData = item;
                $scope.formData.isEdit=true
                $(".modal-footer").before("<input id='itemId' type='hidden' value='"+item._id+"'>")
                $("#title").val($scope.formData.title)
                $("#website").val($scope.formData.website)
                $("#onlineView").val($scope.formData.onlineView)
                $("#newsDate").val(moment($scope.formData.newsDate).format("YYYY-MM-DD"))
                $("#coverImg").attr("src",$scope.formData.coverImg)
                $scope.$apply()
            }else{
                modalTitle.text("添加新搜索");
                $scope.formData = {};
            }
        }).on('hidden.bs.modal', function (e) {
            // 清空数据
            $("#title").val("")
            $("#website").val("")
            $("#onlineView").val("")
            $("#newsDate").val("")
            $("#coverImg").attr("src","")
            $("#itemId").remove()
        });
    }

    $scope.toTop=function (id) {
        $.post("/admin/manage/topNews",{
            itemId:id
        },function (res) {
            if(res=="success"){
                swal({
                    title: "置顶成功",
                    type: "success",
                    confirmButtonText: "确定"
                });
                postData()
            }else {
                swal({
                    title: "提交失败",
                    type: "error",
                    confirmButtonText: "确定"
                });
                console.log(res)
            }
        })
    }

    $scope.cancletoTop=function (id) {
        $.post("/admin/manage/cancletopNews",{
            itemId:id
        },function (res) {
            if(res=="success"){
                swal({
                    title: "取消置顶成功",
                    type: "success",
                    confirmButtonText: "确定"
                });
                postData()
            }else {
                swal({
                    title: "提交失败",
                    type: "error",
                    confirmButtonText: "确定"
                });
                console.log(res)
            }
        })
    }

    $scope.delOneItem=function (id) {
        swal({
                title: "删除",
                text: "确定删除这一篇新闻",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "继续删除",
                closeOnConfirm: false
            },
            function(){
                $http.post("/admin/manage/delNews",{
                    itemId:id
                }).success(function (res) {
                    if(res=="success"){
                        swal({
                            title: "删除成功",
                            type: "success",
                            confirmButtonText: "确定"
                        });
                        postData()
                    }else {
                        swal({
                            title: "删除失败",
                            type: "error",
                            confirmButtonText: "确定"
                        });
                        console.log(res)
                    }
                })
            });

    }
    $scope.maxSize = 5;
    $scope.itemsPerPage=10;
    $scope.bigCurrentPage = 1;
    $scope.bigTotalItems=1;
    $scope.fromFor='';
    $scope.titleFor='';
    $scope.isDeleted=''
    $scope.isTop=''
    $scope.order={createdAt: -1};
    postData();

}]);

doraApp.filter('toNull', [function(){
    return function(text){
        return (!text)?"无":text
    };
}]);
doraApp.filter('complainType', [function(){
    return function(item){
        if(item.user._id==item.tender.user){
            return "招标方投诉"
        }else {
            return "投标方投诉"
        }

    };
}]);

doraApp.filter('valToText', [function(){
    return function(text){
        if(text=="H124B2BCx"){
            return "广告制作"
        }else if(text=="HyD8BhH0x"){
            return "广告材料"
        }else if(text=="BJJ_r2BRg"){
            return "广告设备"
        }
    };
}]);
doraApp.filter('valToType', [function(){
    return function(text){
        if(text=="Manufacture"){
            return "广告制作"
        }else if(text=="Material"){
            return "广告材料"
        }else if(text=="Equipment"){
            return "广告设备"
        }
    };
}]);
doraApp.filter('valToWhere', [function(){
    return function(text){
        if(text=="homepage"){
            return "首页"
        }
    };
}]);
doraApp.filter('valToTenderType', [function(){
    return function(text){
        if(text=="1"){
            return "公开招标"
        }else if(text=="2"){
            return "邀请招标"
        }else {
            return text
        }
    };
}]);
doraApp.filter('fromFilter',function () {
    return function (text) {
        if(text=="1"){
            return "原创"
        }else if(text=="2"){
            return "转载"
        }
    }
})
doraApp.filter('valToStatus', [function(){
    return function(text){
        if(text=="1"){
            return "发布招标"
        }else if(text=="2"){
            return "选择服务商"
        }else if(text=="3"){
            return "缴纳定金"
        }else if(text=="4"){
            return "制作验收"
        }else if(text=="5"){
            return "缴纳尾款"
        }else if(text=="6"){
            return "评价"
        }else {
            return text
        }
    };
}]);
doraApp.filter('valToDistrict', [function(){
    return function(text){
        if(text=="1"){
            return "蒲潭南区"
        }else if(text=="2"){
            return "蒲潭北区"
        }else if(text=="3"){
            return "幸福小区"
        }else if(text=="4"){
            return "凤凰苑小区"
        }else if(text=="5"){
            return "龙湖小区一期"
        }else if(text=="6"){
            return "龙湖小区二期"
        }else if(text=="7"){
            return "小军山小区"
        }else if(text=="0"){
            return "其它"
        }else {
            return text
        }
    };
}]);