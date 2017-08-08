;(function(angular,$){

	var layoutPrivateCenter=angular.module('layoutPrivateCenter');
	
	layoutPrivateCenter.filter("toD",function () {
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
	layoutPrivateCenter.controller('layoutPrivateCenterController',["$scope","$window",function ($scope,$window) {
		var arrs=$window.location.href.split('/');
		$scope.activeSlidebar=arrs[arrs.length-1];
	}])

	layoutPrivateCenter.controller('recentDemandAndResourceController',["$scope","$window","$http",function ($scope,$window,$http) {
		$scope.flag=true;
		$scope.changeForm=function(id){
			$scope.errorMessage="";
			$scope.flag=id===1?true:false;
			$http.post("/users/queryRecentPubDemands").success(function (res) {
				$scope.latestDe=res.docs
			})

		};
		$http.post("/users/queryLatestResPub",{}).success(function (res) {
			$scope.latestRes=res
		})
		$scope.refresh=function (item) {
			$http.post("/users/refreshRes",{
				resType:item.resType,
				resId:item._id
			}).success(function (res) {
				if(res=="success"){
					$http.post("/users/queryLatestResPub",{}).success(function (res) {
						$scope.latestRes=res
						swal("刷新成功","您的资源将在搜索结果中排在前面!");
					})
				}
			})
		}

		$scope.triggerResTop=function (item) {
			$http.post("/users/triggerResTop",{
				resType:item.resType,
				resId:item._id
			}).success(function (res) {
				if(res=="success"){
					$http.post("/users/queryLatestResPub",{}).success(function (res) {
						$scope.latestRes=res
						swal("置顶成功","此条资源将在您的企业详情页面置顶显示!");
					})
				}else {
					swal("置顶失败");
				}
			})
		}
		$scope.triggerResTopForNo=function (item) {
			$http.post("/users/triggerResTop",{
				resType:item.resType,
				resId:item._id
			}).success(function (res) {
				if(res=="success"){
					$http.post("/users/queryLatestResPub",{}).success(function (res) {
						$scope.latestRes=res
						swal("取消置顶成功");
					})
				}else {
					swal("取消置顶失败");
				}
			})
		}
		$scope.delete=function (item) {
			swal({
					title: "确定删除此条资源?",
					text: "删除将不可再恢复此条资源",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "确定",
					closeOnConfirm: false
				},
				function(){
					$http.post("/users/deleteRes",{
						resType:item.resType,
						resId:item._id
					}).success(function (res) {
						if(res=="success"){
							$http.post("/users/queryLatestResPub").success(function (res) {
								$scope.latestRes=res
								swal("删除成功");
							})
						}else {
							swal("删除失败");
						}
					})
				});

		}

		$scope.triggerResShow=function (item) {
			if(item.isShowing){
				swal({
						title: "确定关闭吗?",
						text: "关闭后其他人将看不到此条信息",
						type: "warning",
						showCancelButton: true,
						confirmButtonColor: "#DD6B55",
						confirmButtonText: "确定",
						closeOnConfirm: false
					}, function(){
						$http.post("/users/triggerResShow",{
							resType:item.resType,
							resId:item._id
						}).success(function (res) {
							if(res=="success"){
								item.isShowing=!item.isShowing;
								swal("操作成功")
							}else {
								swal("关闭资源失败")
							}
						})
					});
			}else{
				swal({
						title: "确定显示吗?",
						text: "显示后此条信息将对其他人可见",
						type: "warning",
						showCancelButton: true,
						confirmButtonColor: "#DD6B55",
						confirmButtonText: "确定",
						closeOnConfirm: false
					},
					function(){
						$http.post("/users/triggerResShow",{
							resType:item.resType,
							resId:item._id
						}).success(function (res) {
							if(res=="success"){
								item.isShowing=!item.isShowing;
								swal("操作成功")
							}else {
								swal("关闭资源失败")
							}
						})
					});
			}
		}

		$scope.refreshde=function (item) {
			$http.post("/users/refreshDemands",{
				id:item._id
			}).success(function (res) {
				if(res=="success"){
					$http.post("/users/queryRecentPubDemands",{}).success(function (res) {
						$scope.latestDe=res.docs
					})
					swal("刷新资源成功","您的资源将在搜索结果中排在前面!")
				}else{
					swal("刷新资源失败")
				}
			})
		}

		$scope.deletede=function (item) {
			swal({
					title: "确定删除此条需求?",
					text: "删除将不可再恢复此条需求",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "确定",
					closeOnConfirm: false
				},
				function(){
					$http.post("/users/deleteDemands",{
						id:item._id
					}).success(function (res) {
						if(res=="success"){
							$http.post("/users/queryRecentPubDemands").success(function (res) {
								$scope.latestDe=res.docs
								swal("删除成功");
							})
						}else {
							swal("删除失败");
						}
					})
				});

		}

		$scope.triggerDeShow=function (item) {
			if(item.isShowing){
				swal({
						title: "确定关闭吗?",
						text: "关闭后其他人将看不到此条信息",
						type: "warning",
						showCancelButton: true,
						confirmButtonColor: "#DD6B55",
						confirmButtonText: "确定",
						closeOnConfirm: false
					},
					function(){
						$http.post("/users/triggerDemandsShow",{
							id:item._id
						}).success(function (res) {
							if(res=="success"){
								item.isShowing=!item.isShowing;
								swal("操作成功")
							}else {
								swal("关闭资源失败");
							}
						})
					});
			}else{
				swal({
						title: "确定显示吗?",
						text: "显示后此条信息将对其他人可见",
						type: "warning",
						showCancelButton: true,
						confirmButtonColor: "#DD6B55",
						confirmButtonText: "确定",
						closeOnConfirm: false
					},
					function(){
						$http.post("/users/triggerDemandsShow",{
							id:item._id
						}).success(function (res) {
							if(res=="success"){
								item.isShowing=!item.isShowing;
								swal("操作成功")
							}else {
								swal("关闭资源失败")
							}
						})
					});
			}
		}
	}])

	layoutPrivateCenter.controller('myDemandController',["$scope","$window","$http",function ($scope,$window,$http) {
		$scope.maxSize = 5;
		$scope.itemsPerPage=8;
		$scope.bigCurrentPage = 1;

		var postData=function(){
			$scope.messageFor=''
			$http.post("/users/queryPubDemands",{
				page:$scope.bigCurrentPage,
				limit:$scope.itemsPerPage
			}).success(function (res) {
				if(res!=="查询为空"){
					$scope.dataList=res.docs;
					$scope.bigTotalItems=res.pageInfo.totalItems;
				}else {
					$scope.dataList=[];
					$scope.bigTotalItems=0;
					$scope.messageFor='您暂未发布此类型资源';
				}
			})
		}
		postData();


		$scope.pageChanged = function(currentPage) {
			postData();
		};

		$scope.refreshde=function (item) {
			$http.post("/users/refreshDemands",{
				id:item._id
			}).success(function (res) {
				if(res=="success"){
					$http.post("/users/queryPubDemands",{}).success(function (res) {
						$scope.latestDe=res.docs
					})
					swal("刷新资源成功","您的资源将在搜索结果中排在前面!")
				}
			})
		}

		$scope.deletede=function (item) {
			swal({
					title: "确定删除此条需求?",
					text: "删除将不可再恢复此条需求",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "确定",
					closeOnConfirm: false
				},
				function(){
					$http.post("/users/deleteDemands",{
						id:item._id
					}).success(function (res) {
						if(res=="success"){
							$http.post("/users/queryPubDemands").success(function (res) {
								$scope.latestDe=res.docs
								swal("删除成功");
							})
						}else {
							swal("删除失败")
						}
					})
				});

		}

		$scope.triggerDeShow=function (item) {
			if(item.isShowing){
				swal({
						title: "确定关闭吗?",
						text: "关闭后其他人将看不到此条信息",
						type: "warning",
						showCancelButton: true,
						confirmButtonColor: "#DD6B55",
						confirmButtonText: "确定",
						closeOnConfirm: false
					},
					function(){
						$http.post("/users/triggerDemandsShow",{
							id:item._id
						}).success(function (res) {
							if(res=="success"){
								item.isShowing=!item.isShowing;
								swal("操作成功")
							}else {
								swal("关闭资源失败")
							}
						})
					});
			}else{
				swal({
						title: "确定显示吗?",
						text: "显示后此条信息将对其他人可见",
						type: "warning",
						showCancelButton: true,
						confirmButtonColor: "#DD6B55",
						confirmButtonText: "确定",
						closeOnConfirm: false
					},
					function(){
						$http.post("/users/triggerDemandsShow",{
							id:item._id
						}).success(function (res) {
							if(res=="success"){
								item.isShowing=!item.isShowing;
								swal("操作成功")
							}else {
								swal("关闭资源失败")
							}
						})
					});
			}
		}
		
	}])

	layoutPrivateCenter.controller('myCollectController',["$scope","$window","$http",function ($scope,$window,$http) {
		$scope.selectAll=false;
		$scope.all=function () {
			$scope.selectAll=!$scope.selectAll;
		}

		$scope.flag=0;
		$scope.$watch('flagggggg',function () {
			postData()
		})
		var postData=function (type) {
			var resType=type||"zy";

			$http.post("/users/queryFavorites",{
				type:resType,
				page:$scope.bigCurrentPage,
				limit:$scope.itemsPerPage,
				text:$scope.text
			}).success(function (res) {
				if(res!=="查询为空"){
					$scope.dataList=res.docs;
					$scope.bigTotalItems=res.pageInfo.totalItems;
				}else {
					$scope.dataList=[]
					$scope.bigTotalItems=0
					$scope.messageFor='您暂未收藏资源'
				}

			})
		}
		$scope.searchIcon=function () {
			postData($scope.border)
		}
		$scope.border="zy";
		$scope.collect=function (i) {
			$scope.border=i;
			postData($scope.border)
		}
		$scope.pageChanged = function(currentPage) {
			postData($scope.border);
		};
		$scope.maxSize = 5;
		$scope.itemsPerPage=5;
		$scope.bigCurrentPage = 1;
		$scope.delArr=[]
		$scope.text=""
		postData();

		$scope.delete=function (item) {
			$scope.delArr=[]
			swal({
					title: "确定删除此条收藏?",
					text: "删除将不可在恢复此条收藏",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "确定",
					closeOnConfirm: false
				},
				function(){
					$scope.delArr.push(item._id)
					$http.post("/users/deleteFavorites",{
						ids:$scope.delArr
					}).success(function (res) {
						if(res=="success"){
							swal("删除成功");
							postData($scope.border)
						}else {
							swal("删除失败")
						}
					})
				});

		}

		$scope.delArr=[]
		$scope.deleteMany=function () {
			swal({
					title: "确定删除这些收藏?",
					text: "删除将不可再恢复这些收藏",
					type: "warning",
					showCancelButton: true,
					cancelButtonText: "取消",
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "确定",
					closeOnConfirm: false
				},
				function () {
					swal.close();
					$scope.delArr=[]
					for(var i=0;i<$scope.dataList.length;i++){
						if($scope.dataList[i].state){
							$scope.delArr.push($scope.dataList[i]._id)
						}
					}
					var data = {
						ids: $scope.delArr
					}
					$http.post("/users/deleteFavorites",data).success(function (res) {
						if(res=="success"){
							swal("删除成功");
							postData($scope.border)
						}else{
							swal("删除失败");
						}
					})
				});
		}
	}])

	layoutPrivateCenter.controller('myResourceController',["$scope","$window","$http","$interval",
		function ($scope,$window,$http,$interval) {
			var postData=function () {
				$scope.messageFor=''
				var resType=$scope.border||"Manufacture";
				 $http.post("/users/queryResByType",{
					resType:resType,
					 page:$scope.bigCurrentPage,
					limit:$scope.itemsPerPage
				}).success(function (res) {
					 if(res!=="查询为空"){
						 $scope.dataList=res.docs;
						 $scope.bigTotalItems=res.pageInfo.totalItems;
					 }else {
						 $scope.dataList=[]
						 $scope.bigTotalItems=0
						 $scope.messageFor='您暂未发布资源'
					 }

				})
			}
		$scope.border='Manufacture';
		$scope.choosedate=function (j) {
			$scope.dateborder=j;
            if(j==1){
                $scope.period="1季度"
            }else if(j==2){
                $scope.period="半年"
            }else if(j==3){
                $scope.period="1年"
            }
            $scope.searchPrice()
        }
		$scope.chooseBorder=function (j) {
			$scope.payBorder=j;
            if(j==1){
                $scope.payType="支付宝"
            }else if(j==2){
                $scope.payType="微信"
            }
        };

		$scope.ChineseDistricts = [
			{code: '340000', address: '安徽'},
			{code: '110000', address: '北京'},
			{code: '500000', address: '重庆'},
			{code: '350000', address: '福建'},
			{code: '620000', address: '甘肃'},
			{code: '440000', address: '广东'},
			{code: '450000', address: '广西'},
			{code: '520000', address: '贵州'},
			{code: '460000', address: '海南'},
			{code: '130000', address: '河北'},
			{code: '230000', address: '黑龙江'},
			{code: '410000', address: '河南'},
			{code: '420000', address: '湖北'},
			{code: '430000', address: '湖南'},
			{code: '320000', address: '江苏'},
			{code: '360000', address: '江西'},
			{code: '220000', address: '吉林'},
			{code: '210000', address: '辽宁'},
			{code: '150000', address: '内蒙古'},
			{code: '640000', address: '宁夏'},
			{code: '630000', address: '青海'},
			{code: '370000', address: '山东'},
			{code: '310000', address: '上海'},
			{code: '140000', address: '山西'},
			{code: '610000', address: '陕西'},
			{code: '510000', address: '四川'},
			{code: '120000', address: '天津'},
			{code: '650000', address: '新疆'},
			{code: '540000', address: '西藏'},
			{code: '530000', address: '云南'},
			{code: '330000', address: '浙江'}]
		$scope.collect=function (i) {
			$scope.border=i;
			$scope.index=-1
			postData()
		}
		$scope.pageChanged = function(currentPage) {
			$scope.index=-1
			postData();
		};
		$scope.maxSize = 5;
		$scope.itemsPerPage=5;
		$scope.bigCurrentPage = 1;
        $scope.index=-1
        $scope.dateborder=0;
        $scope.payBorder=0
        $scope.price=0
        $scope.period=""
        $scope.payType=""
        $scope.regions=[]
		postData();
		$scope.refresh=function (item) {
			$http.post("/users/refreshRes",{
				resType:item.resType,
				resId:item._id
			}).success(function (res) {
				if(res=="success"){
					postData($scope.border)
					swal("刷新成功","您的资源将在搜索结果中排在前面!");
				}else {
					swal("刷新失败");
				}
			})
		}
		$scope.triggerResTop=function (item) {
			$http.post("/users/triggerResTop",{
				resType:item.resType,
				resId:item._id
			}).success(function (res) {
				if(res=="success"){
					postData($scope.border)
					swal("置顶成功","此条资源将在您的企业详情页面置顶显示!");
				}else {
					swal("置顶失败");
				}
			})
		}
			$scope.triggerResTopForNo=function (item) {
				$http.post("/users/triggerResTop",{
					resType:item.resType,
					resId:item._id
				}).success(function (res) {
					if(res=="success"){
						postData($scope.border)
						swal("取消置顶成功");
					}else {
						swal("取消置顶失败");
					}
				})
			}
		$scope.delete=function (item) {
			if(!item.promotionRegions||item.promotionRegions.length==0||!item.promotionEnd||item.promotionEnd<=new Date()){
				swal({
						title: "确定删除此条资源?",
						text: "删除将不可恢复此条资源",
						type: "warning",
						showCancelButton: true,
						confirmButtonColor: "#DD6B55",
						confirmButtonText: "确定",
						closeOnConfirm: false
					},
					function(){
						$http.post("/users/deleteRes",{
							resType:item.resType,
							resId:item._id
						}).success(function (res) {
							if(res=="success"){
								postData($scope.border)
								swal("删除成功");
							}else {
								swal(res);
							}
						})
					});
			}else {
				swal({
						title: "当前资源正在推广中，请谨慎操作！",
						text: "删除不可恢复且不退还推广未到期费用！",
						type: "warning",
						showCancelButton: true,
						confirmButtonColor: "#DD6B55",
						confirmButtonText: "确定",
						closeOnConfirm: false
					},
					function(){
						$http.post("/users/deleteRes",{
							resType:item.resType,
							resId:item._id
						}).success(function (res) {
							if(res=="success"){
								postData($scope.border)
								swal("删除成功");
							}else {
								swal(res);
							}
						})
					});
			}



		}
		$scope.triggerResShow=function (item) {
			if(item.isShowing){
				swal({
						title: "确定关闭吗?",
						text: "关闭后其他人将看不到此条信息",
						type: "warning",
						showCancelButton: true,
						confirmButtonColor: "#DD6B55",
						confirmButtonText: "确定",
						closeOnConfirm: false
					},
					function(){
						$http.post("/users/triggerResShow",{
							resId:item._id
						}).success(function (res) {
							if(res=="success"){
								swal.close()
								item.isShowing=!item.isShowing;
							}else{
								swal("删除失败");
							}
						})
					});
			}else{
				swal({
						title: "确定显示吗?",
						text: "显示后此条信息将对其他人可见",
						type: "warning",
						showCancelButton: true,
						confirmButtonColor: "#DD6B55",
						confirmButtonText: "确定",
						closeOnConfirm: false
					},
					function(){
						$http.post("/users/triggerResShow",{
							resType:item.resType,
							resId:item._id
						}).success(function (res) {
							if(res=="success"){
								swal.close()
								item.isShowing=!item.isShowing;
							}else {
								swal("关闭失败");
							}
						})
					});
			}
		}

        $scope.precisePromote=function () {
            if(interval){
                $interval.cancel(interval)
            }
            $scope.index=-1
		}
		$scope.searchPrice=function () {
            if($scope.period==""||$scope.regions==[]||$scope.regions==null){
                return
            }else{
                $.post("/queryPrecisePromotionPrice",{
                    period:$scope.period,
                    provinceNum:$scope.regions.length
                },function (res) {
                    $scope.price=Math.ceil(res.price);
                })
            }

		}

		var interval
		$scope.precisePromoteshow=function ($index,item) {
			$scope.preciseList={}
			if($scope.index==$index){
                if(interval){
                    $interval.cancel(interval)
                }
				$scope.index=-1
			}else {
				$('.selectpicker').selectpicker('refresh');
				interval=$interval(function () {
                    if($scope.regions!==$window.finalVal){
                        $scope.regions=$window.finalVal
                        $scope.searchPrice()
                    }
				},100)
				$scope.index=$index
				$.post("/users/queryResByTypeByOne",{pubHistoryId:item._id}).success(function (res) {
					if(typeof res=="object"){
						if(!res.result){
							$scope.hasBill=true
							$scope.preciseList=res
							$scope.$apply()
						}else {
							$scope.hasBill=false
							$scope.preciseList=item
							$scope.$apply()
						}
					}else {
					}

				})

			}
			}
            
        $scope.submitOrder=function (item) {
            if(!item.pubHistory){
                if($scope.period!==""&&$scope.regions!==[]&&$scope.payType!==""){
                    var data={
                        period:$scope.period,
                        regions:$scope.regions,
                        payType:$scope.payType,
                        categoryL1:item.categoryL1,
                        pubHistoryId:item._id
                    }
                    $http.post("/insertPro",data).success(function (res) {
                        res.payType=$scope.payType;
                        getQr(res)
                        $scope.price=Math.ceil(res.price);
                    })
                }else {
				swal("请选择完整", "错误!", "error")
			}
            }else{
                getQr(item.bill)
            }

        }
            function getQr(result) {
                swal({
                        title: '<img src="/users/payPromotionBill?billNum='+result.billNum+'&payType='+result.payType+'支付'+'&promotionType='+'精准推广服务'+'">',
						text: "请打开"+result.payType+"扫码支付",
						showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "支付完成",
                        cancelButtonText: "支付遇到问题",
                        closeOnConfirm: false,
                        closeOnCancel: false,
                        html: true
                    },
                    function(isConfirm){
                        if (isConfirm) {
                            window.location.href="/users/myOrders"
                        } else {
                            swal({
                                    title: "<h1>即将为您联系在线客服</h1>",
                                    showCancelButton: true,
                                    confirmButtonColor: "#DD6B55",
                                    cancelButtonText: "取消",
                                    confirmButtonText: "联系客服",
                                    closeOnConfirm: false,
                                    html: true
                                },
                                function(){
                                    $window.location.href="/users/helperCenter#5"
                                });
                        }
                    });
            }

        }])
	// myFixCenterController 个人中心的安装列表
	layoutPrivateCenter.controller('myFixCenterController',["$scope","$window","$http","$document",function ($scope,$window,$http,$document) {
		$scope.maxSize = 5;
		$scope.itemsPerPage=4;
		$scope.bigCurrentPage = 1;

		var postData=function(){
			$scope.messageFor=''
			$http.post("/resource/queryUserCenterInstalls",{
				page:$scope.bigCurrentPage,
				limit:$scope.itemsPerPage
			}).success(function (res) {
				if(res!=="查询为空"){
					$scope.dataList=res.docs;
					$scope.bigTotalItems=res.pageInfo.totalItems;
				}else {
					$scope.dataList=[];
					$scope.bigTotalItems=0;
					$scope.messageFor='您暂未发布此类型资源';
				}
			})
		}
		postData();


		$scope.pageChanged = function(currentPage) {
			postData();
		};

		$scope.refreshNowFix=function (item) {
			$http.post("/resource/refreshFixRes",{
				resId:item._id
			}).success(function (res) {
				if(res=="success"){
					swal("刷新资源成功","您的资源将在搜索结果中排在前面!")
					postData();

				}
			})
		}

		$scope.deleteNowFix=function (item) {
			swal({
					title: "确定删除此条安装?",
					text: "删除将不可再恢复此条需求",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "确定",
					closeOnConfirm: false
				},
				function(){
					$http.post("/resource/deleteMyInstall",{
						id:item._id
					}).success(function (res) {
						if(res.result=="success"){
							swal("删除成功");
							postData()
						}else {
							swal("删除失败")
						}
					})
				});

		}
		$scope.showid=999;
		
		$scope.thisDetailShow=function (key,item) {
			$scope.showid=key;
		}
		$scope.thisDetailHide=function(key,item){
			$scope.showid=999;
		}
		$scope.triggerDeShow=function (item) {
			if(item.isShowing){
				swal({
						title: "确定关闭吗?",
						text: "关闭后其他人将看不到此条信息",
						type: "warning",
						showCancelButton: true,
						confirmButtonColor: "#DD6B55",
						confirmButtonText: "确定",
						closeOnConfirm: false
					},
					function(){
						$http.post("/resource/triggerMyInstallShowing",{
							id:item._id
						}).success(function (res) {
							if(res=="success"){
								item.isShowing=!item.isShowing;
								swal("操作成功")
							}else {
								swal("关闭资源失败")
							}
						})
					});
			}else{
				swal({
						title: "确定显示吗?",
						text: "显示后此条信息将对其他人可见",
						type: "warning",
						showCancelButton: true,
						confirmButtonColor: "#DD6B55",
						confirmButtonText: "确定",
						closeOnConfirm: false
					},
					function(){
						$http.post("/resource/triggerMyInstallShowing",{
							id:item._id
						}).success(function (res) {
							if(res=="success"){
								item.isShowing=!item.isShowing;
								swal("操作成功")
							}else {
								swal("关闭资源失败")
							}
						})
					});
			}
		}

	}])


	layoutPrivateCenter.filter('valToType', [function(){
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
	layoutPrivateCenter.filter("centerTitleFilter",function(){
		return function(input){
			if(input.length>8){
				return input.substring(0,8)+"……"
			}else{
				return input
			}
		}
	})
	layoutPrivateCenter.controller('myActivityController',["$scope","$window","$http",
		function ($scope,$window,$http) {
		}])

	layoutPrivateCenter.controller('myOrdersController',["$scope","$window","$http",
		function ($scope,$window,$http) {
			$scope.all=function () {
				$scope.selectAll=!$scope.selectAll;
			}

		}])

	layoutPrivateCenter.filter('myfilter', function() {
		return function (input) {
			return input?"显示中":"已关闭";
		};
	})
	
	layoutPrivateCenter.filter('topfilter', function() {
		return function (input) {
			return input?"已置顶":"置顶";
		};
	})
	layoutPrivateCenter.filter('defilter', function() {
		return function (input) {
			return input?"开":"关";
		};
	})
	layoutPrivateCenter.filter('timeFilter', function() {
		return function (input) {
			return input.split('T')[0]
		};
	})
	layoutPrivateCenter.filter('noNull', function() {
		return function (input) {
			if(!input){
				return 0
			}else {
				return parseInt(input)
			}
		};
	})

	layoutPrivateCenter.filter("numPageViewFilter",function(){
		return function(num){
			if(!num){
				return 0
			}else{
				return parseInt(num)
			}
		}
	})
	layoutPrivateCenter.filter('itemToPro', function() {
		return function (input) {
			if(!input.promotionRegions||input.promotionRegions.length==0||!input.promotionEnd||input.promotionEnd<=new Date()){
				return false
			}
			return true
		};
	})
	layoutPrivateCenter.filter('itemToId', function() {
		return function (input) {
		return input._id
		};
	})
	layoutPrivateCenter.filter('joinStr', function(){
		return function(text){
			if(text==[]){
				return ""
			}else {
				return text.join(" ")
			}
		};
	});
})(angular,jQuery)

