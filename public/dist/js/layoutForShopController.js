;(function(angular,$){
	var layoutForshop=angular.module('layoutForshop');

	layoutForshop.filter('myfilter', function() {
		return function (input) {
			return input?"显示中":"已关闭";
		};
	})
	layoutForshop.filter('defilter', function() {
		return function (input) {
			return input?"开":"关";
		};
	})
	layoutForshop.filter('timeFilter', function() {
		return function (input) {
			return input.split('T')[0]
		};
	})

	layoutForshop.filter('valToType', [function(){
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
	layoutForshop.controller('layoutForshopController',["$scope","$window",function ($scope,$window) {
		var arrs=$window.location.href.split('/');
		$scope.activeSlidebar=arrs[arrs.length-1];
	}])
	layoutForshop.filter("toD",function () {
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
	layoutForshop.controller('shopcertificationController',["$scope","$http","$window",function ($scope,$http,$window) {

	}])

	layoutForshop.controller('shoptenderController',["$scope","$http","$window",
		function ($scope,$http,$window) {
			$scope.downpayment=function (item) {
				swal({
						title:'请选择支付方式',
						showCancelButton: true,
						confirmButtonColor: "#DD6B55",
						confirmButtonText: "微信",
						cancelButtonText: "支付宝",
						cancelButtonColor:"#AEDEF4",
						closeOnConfirm: false,
						closeOnCancel: false,
						html: true
					},
					function(isConfirm) {
						var payType=""
						if (isConfirm) {
							payType="微信"
						}else {
							payType="支付宝"
						}
						swal({
								title:'<img src="/tender/payTenderBill?tenderId='+item._id+'&payType='+payType+'支付'+'&status=3'+'">',
								text: "请打开"+payType+"扫码支付",
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
                                    swal.close()
                                    postData()
								} else {
									swal({
											title: "<h1>即将为您联系在线客服</h1>",
											showCancelButton: true,
											confirmButtonColor: "#DD6B55",
											cancelButtonText: "取消",
											confirmButtonText: "联系客服",
											closeOnConfirm: false,
											closeOnCancel: false,
											html: true
										},
										function(isConfirm){
											if (isConfirm) {
												$window.location.href="/users/helperCenter#5"
											}else {
												swal.close()
											}
										});
								}
							});

					})

			};
			$scope.finalpayment=function (item) {
				swal({
						title:'请选择支付方式',
						showCancelButton: true,
						confirmButtonColor: "#DD6B55",
						confirmButtonText: "微信",
						cancelButtonText: "支付宝",
						cancelButtonColor:"#AEDEF4",
						closeOnConfirm: false,
						closeOnCancel: false,
						html: true
					},
					function(isConfirm) {
						var payType=""
						if (isConfirm) {
							payType="微信"
						}else {
							payType="支付宝"
						}
						swal({
								title:'<img src="/tender/payTenderBill?tenderId='+item._id+'&payType='+payType+'支付'+'&status=5'+'">',
								text: "请打开"+payType+"扫码支付",
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
                                    swal.close()
                                    postData()
								} else {
									swal({
											title: "<h1>即将为您联系在线客服</h1>",
											showCancelButton: true,
											confirmButtonColor: "#DD6B55",
											cancelButtonText: "取消",
											confirmButtonText: "联系客服",
											closeOnConfirm: false,
											closeOnCancel: false,
											html: true
										},
										function(isConfirm){
											if (isConfirm) {
												$window.location.href="/users/helperCenter#5"
											}else {
												swal.close()
											}
										});
								}
							});

					})

			};
            $scope.tocheck=function (item) {
				$scope.button_clicked=true
				$http.post("/tender/tenderConform",{
                    tenderId:item._id
                }).success(function (res) {
                    if(res.result=="success"){
                        swal({
                            title: "确认验收成功!",
                            type: "success",
                            confirmButtonText: "确定"
                        });
                        postData();
                    }
					$scope.button_clicked=false
				})
            }
			var postData=function () {
				$scope.messageFor='';
				$scope.dataList=[]
				$http.post("/tender/searchTenderByStatus",{
					resType:$scope.border,
					page:$scope.bigCurrentPage,
					limit:$scope.itemsPerPage
				}).success(function (res) {
					if(res.docs){
						$scope.dataList=res.docs;
						$scope.bigTotalItems=res.pageInfo.totalItems;
					}else {
						$scope.dataList=[]
						$scope.bigTotalItems=0
						$scope.messageFor='您暂未发布资源'
					}

				})
			}
			$scope.readcomment=function (item) {
				$window.open("../users/shopcomment?id="+item.chosenBidderUser)
			}
			$scope.cancle=function (item) {
				$scope.button_clicked=true
				$http.post("/tender/canCancelMyTender",{
					tenderId:item._id,
				}).success(function (res) {
					if(res.result=="您可以无责任取消此次招标"){
						swal({
								title: "确定取消此次招标?",
								text: "您可以无责任取消此次招标！",
								type: "warning",
								showCancelButton: true,
								confirmButtonColor: "#DD6B55",
								confirmButtonText: "确定取消",
								cancelButtonText: "放弃取消",
								closeOnConfirm: false
							},
							function(){
								$http.post("/tender/cancelMyTender",{
									tenderId:item._id,
								}).success(function (res) {
									if(res.result=="success"){
										swal("取消成功!")
										$window.location.reload()
									}else{
										swal(res.result)
									}
								})
							});
					}else if(res.result=="取消此次招标您将产生违约记录，每个自然月违规3次后，当月您将不能发布新的招标"){
						swal({
								title: "确定取消此次招标?",
								text: "取消此次招标您将产生违约记录，每个自然月违规3次后，当月您将不能发布新的招标！",
								type: "warning",
								showCancelButton: true,
								confirmButtonColor: "#DD6B55",
								confirmButtonText: "确定取消",
								cancelButtonText: "放弃取消",
								closeOnConfirm: false
							},
							function(){
								$http.post("/tender/cancelMyTender",{
									tenderId:item._id,
								}).success(function (res) {
									if(res.result=="success"){
										swal("取消成功!")
									}else{
										swal(res.result)
									}
								})
							});
					}else{
						swal(res.error)
					}
					$scope.button_clicked=false
				})
			}
			$scope.collect=function (i) {
				$scope.border=i;
				$scope.index=-1
				postData()
			}
			$scope.border='招标中';
			$scope.pageChanged = function(currentPage) {
				$scope.index=-1
				postData();
			};
			$scope.tocomment=function (item) {
				$scope.forcommentShow=true
				$http.post("/tender/queryMyBidsByOne",{
					tenderId:item._id
				}).success(function (res) {
					if(res.tenderNum){
						$scope.tenderNum=res.tenderNum
						$scope.tenderId=res._id
						$scope.timeRcdStep5=res.timeRcdStep5
						$scope.title=res.title
						$scope.data=res
						$scope.categoryL1=res.categoryL1.name
						$scope.categoryL2=res.categoryL2.name
					}
					console.log(res)
				})
			}
			$scope.closeModel=function () {
				$scope.forcommentShow=false
			}
			$scope.subbmitCheck=function () {
				$scope.button_clicked=true
				var data={
					type:"1",
					tenderId:$scope.tenderId,
					quality:$scope.point1,
					describe:$scope.point2,
					attitude:$scope.point3,
					speed:$scope.point4,
					details:$scope.comments,
					anonymous:$scope.anonymous,
					images:$scope.imgArr
				}
				$http.post("/tender/tenderJudgement",data).success(function (res) {
					if(res.result=="success"){
						$scope.forcommentShow=false
						swal({
							title: "评价成功!",
							type: "success",
							confirmButtonText: "确定"
						});
						postData()
					}else if(res.error){
						swal({
							title: res.error,
							type: "error",
							confirmButtonText: "确定"
						});
					}else {
						swal({
							title: "评价失败！",
							type: "error",
							confirmButtonText: "确定"
						});
					}
					$scope.button_clicked=false
				})
			}
			$scope.complain=function (item) {
				$http.post("/tender/searchTenderByBid",{
					id:item._id
				}).success(function (res) {
					if(res.docs){
						$scope.complainCompanyName=res.bidCompany.companyName
						$scope.complainTenderNum=res.docs.tenderNum
						$scope.complainTenderName=res.docs.title
						$scope.complainCatelogory1=res.docs.categoryL1.name
						$scope.complainCatelogory2=res.docs.categoryL2.name
						$scope.forcomplainShow=!$scope.forcomplainShow
						$scope.item=res
					}else {
						console.log(res)
					}

				})

			}
			$scope.confirmComplain=function () {
				$scope.button_clicked=true
				if($scope.complainDetails.trim().length>0&&$scope.complainDetails.trim().length<350){
					swal({
							title: "确定提交投诉?",
							text: "投诉提交后对方将收到提醒，一经平台核实，将对对方采取相应惩戒措施！",
							type: "warning",
							showCancelButton: true,
							confirmButtonColor: "#DD6B55",
							confirmButtonText: "确定投诉",
							cancelButtonText: "放弃投诉",
							closeOnConfirm: false
						},
						function(){
							$http.post("/tender/insertComplain",{
								tenderId:$scope.item.docs._id,
								type:1,
								targetUser:$scope.item.docs.chosenBidderUser,
								targetCompany:$scope.item.docs.chosenBidder.company,
								company:$scope.item.docs.company._id,
								details:$scope.complainDetails
							}).success(function (res) {
								if(res.result=="success"){
									swal("投诉成功!","收到投诉后客服会第一时间联系您,请保持手机通畅.")
									$scope.forcomplainShow=false
									postData()
								} else if(res.error=="投标方已投诉，投诉正在解决当中"){
									swal("投标方已投诉，投诉正在解决中")
									$scope.forcomplainShow=false
								}
								$scope.button_clicked=false
							})
						});
				}else {
					swal({
						title: "评价字数不能超过350字且不能为空！",
						type: "error",
						confirmButtonText: "确定"
					});
				}

			}
			$scope.maxSize = 5;
			$scope.itemsPerPage=5;
			$scope.bigCurrentPage = 1;
			$scope.index=-1;
			$scope.forcommentShow=false
			$scope.forcomplainShow=false
			$scope.tenderNum="",
			$scope.tenderId="",
			$scope.point1="5"
			$scope.point2="5"
			$scope.point3="5"
			$scope.point4="5"
			$scope.comments=""
			$scope.anonymous=false
			$scope.imgArr=[]
			$scope.item={}
			$scope.button_clicked = false;
			postData();

	}])

	layoutForshop.controller('shopbidController',["$scope","$http","$window",
		function ($scope,$http,$window) {
			var postData=function () {
				$scope.messageFor='';
				$scope.dataList=[]
				$http.post("/tender/queryMyBids",{
					type:$scope.border,
					page:$scope.bigCurrentPage,
					limit:$scope.itemsPerPage
				}).success(function (res) {
					if(res.docs){
						$scope.dataList=res.docs;
						$scope.bigTotalItems=res.pageInfo.totalItems;
						$scope.userId=res.id
						console.log(res.docs)
					}else {
						$scope.dataList=[]
						$scope.bigTotalItems=0
						$scope.messageFor='您暂无任何投标记录'
					}
				})
			}
			$scope.collect=function (i) {
				$scope.border=i;
				$scope.index=-1
				postData()
			}

			$scope.readcomment=function (item) {
				$window.location.href="../users/shopcomment?id="+item.chosenBidderUser
			}

			$scope.border='投标中';
			$scope.pageChanged = function(currentPage) {
				$scope.index=-1
				postData();
			};
			$scope.confirmComplain=function () {
				$scope.button_clicked=true
				if($scope.complainDetails.trim().length>0&&$scope.complainDetails.trim().length<350) {
					swal({
							title: "确定提交投诉?",
							text: "投诉提交后对方将收到提醒，一经平台核实，将对对方采取相应惩戒措施！",
							type: "warning",
							showCancelButton: true,
							confirmButtonColor: "#DD6B55",
							confirmButtonText: "确定投诉",
							cancelButtonText: "放弃投诉",
							closeOnConfirm: false
						},
						function () {
							$http.post("/tender/insertComplain", {
								tenderId: $scope.item.docs._id,
								type: 2,
								targetUser: $scope.item.docs.user,
								targetCompany: $scope.item.docs.company._id,
								company: $scope.item.docs.chosenBidder.company,
								details: $scope.complainDetails
							}).success(function (res) {
								if (res.result == "success") {
									swal("投诉成功!", "收到投诉后客服会第一时间联系您,请保持手机通畅.")
									$scope.forcomplainShow = false
									postData()
								} else if(res.error=="招标方已投诉，投诉正在解决当中"){
									swal("招标方已投诉，投诉正在解决当")
									$scope.forcomplainShow=false
								}
								$scope.button_clicked=false
							})
						});
				}else{
					swal({
						title: "评价字数不能超过350字且不能为空！",
						type: "error",
						confirmButtonText: "确定"
					});
				}
			}

			$scope.confirm=function (item) {
				$scope.button_clicked=true
				$http.post("/tender/insertCash",{
					vnum:$scope.code,
					payType:"支付宝",
					targetId:$scope.item._id,
					price:parseInt($scope.item.downpayment)+parseInt($scope.item.finalpayment),
					status:2
				}).success(function (res) {
					if(res.result){
						swal("提交提现成功")
						postData()
					}else {
						swal(res.error)
					}
					$scope.promisetocashShow=false
					$scope.button_clicked=false
				})
			}
			$scope.tocash=function (item) {
				$scope.item={}
				$scope.item=item
				$.post("/users/sendVerifyCodeDirect",{
					phoneNum:$("#phoneNum").val()
				},function (res) {

				})
				$scope.promisetocashShow=true
			}
			$scope.tocomment=function (item) {
				$scope.forcommentShow=true
				$http.post("/tender/queryMyBidsByOne",{
					tenderId:item._id
				}).success(function (res) {
					if(res.tenderNum){
						$scope.tenderNum=res.tenderNum
						$scope.timeRcdStep5=res.timeRcdStep5
						$scope.title=res.title
						$scope.tenderId=res._id
						$scope.data=res
						$scope.categoryL1=res.categoryL1.name
						$scope.categoryL2=res.categoryL2.name

					}
					console.log(res)
				})
			}
			$scope.closeModel=function () {
				$scope.forcommentShow=false
			}
			$scope.close=function () {
				$scope.promisetocashShow=false
			}
			$scope.complain=function (item) {
				$http.post("/tender/searchTenderByBid",{
					id:item._id
				}).success(function (res) {
					if(res.docs){
						$scope.complainCompanyName=res.docs.company.companyName
						$scope.complainTenderNum=res.docs.tenderNum
						$scope.complainTenderName=res.docs.title
						$scope.complainCatelogory1=res.docs.categoryL1.name
						$scope.complainCatelogory2=res.docs.categoryL2.name
						$scope.forcomplainShow=!$scope.forcomplainShow
						$scope.item=res
					}else {
						console.log(res)
					}

				})
			}
			$scope.maxSize = 5;
			$scope.itemsPerPage=5;
			$scope.bigCurrentPage = 1;
			$scope.index=-1;
			$scope.forcommentShow=false
			$scope.forcommentShow=false
			$scope.tenderNum=""
			$scope.tenderId="",
			$scope.promisetocashShow=false
			$scope.item={}
			$scope.button_clicked=false
			// $scope.point1="5"
			// $scope.point2="5"
			// $scope.point3="5"
			// $scope.point4="5"
			// $scope.comments=""
			// $scope.anonymous=false
			// $scope.imgArr=[]
			postData();

		}])

	layoutForshop.controller('shopaccountController',["$scope","$http","$window",
		function ($scope,$http,$window) {
			var postData=function () {
				$scope.messageFor='';
				$http.post("/tender/queryMyTransactions",{
					page:$scope.bigCurrentPage,
					limit:$scope.itemsPerPage
				}).success(function (res) {
					if(res.docs){
						$scope.dataList=res.docs;
						$scope.bigTotalItems=res.pageInfo.totalItems;
						console.log(res)
					}else {
						$scope.dataList=[]
						$scope.bigTotalItems=0
						$scope.messageFor='您暂未发布资源'
					}
				})
			}
			$scope.pageChanged = function(currentPage) {
				postData();
			};
			$scope.maxSize = 5;
			$scope.itemsPerPage=5;
			$scope.bigCurrentPage = 1;
			postData();

		}])

	layoutForshop.filter('noNull', function() {
		return function (input) {
			if(!input){
				return 0
			}else {
				return input
			}
		};
	})

	layoutForshop.filter('bidprice', function() {
		return function (input,userId) {
			if(input.bidders.length>1){
				for(var i=0;i<input.bidders.length;i++){
					if(input.bidders[i].user==userId){
						return input.bidders[i].price
					}
				}
			}else {
				return input.bidders[0].price
			}
		};
	})

	layoutForshop.filter('tenderstep', function() {
		return function (input) {
			if(input.isCanceled){
				return "已取消"
			}else if(input.status==2){
				if(moment(input.tenderEnd).isBefore(new Date())){
					return "选标中"
				}else{
					return "投标中"
				}
			}else if(input.status==3||input.status==4||input.status==5){
				return "已选标"
			}else if(input.status==6){
				return "已交付"
			}
		};
	})

	layoutForshop.filter('tenderstep2', function() {
		return function (input) {
			if(input.isCanceled){
			}else if(input.status==2){
				if(moment(input.tenderEnd).isBefore(new Date())){
					return "距离选标剩余"
				}else{
					return "投标剩余"
				}
			}else if(input.status==3){
				return "距离定金支付剩余"
			}else if(input.status==4){
				return "距离验收剩余"
			}else if(input.status==5){
				return "距离尾款支付"
			}else if(input.status==6){
				if(!input.timeRcdStep6){
					return "距离评价剩余"
				}
			}
		};
	})

	layoutForshop.filter('tenderstep3', function(){
		return function(input){
			if(input.isCanceled){
				return
			}else if(input.status==2){
				if(moment(input.tenderEnd).isBefore(new Date())){
					var timeobj=moment(input.tenderEnd).add("days",3).toDate().getTime()
				}else{
					var timeobj=moment(input.tenderEnd).toDate().getTime()
				}
			}else if(input.status==3){
				var timeobj=moment(input.timeRcdStep2).add("days",3).toDate().getTime()
			}else if(input.status==4){
				var timeobj=moment(input.serviceEnd).toDate().getTime()
			}else if(input.status==5){
				var timeobj=moment(input.timeRcdStep4).add("days",7).toDate().getTime()
			}else if(input.status==6){
				if(!input.timeRcdStep6){
					var timeobj=moment(input.timeRcdStep5).add("days",30).toDate().getTime()
				}
			}
			var nowObj=new Date().getTime()
			var str=""
			var dateDiff=(timeobj-nowObj)/1000
			var day=parseInt(dateDiff/24/3600)
			var hours=parseInt(dateDiff%86400/3600)
			var minute=parseInt(dateDiff%3600/60)
			if(day>0){
				str+=day+"天"
			}
			if(hours>0){
				str+=hours+"小时"
			}
			if(minute>0){
				str+=minute+"分钟"
			}
			return 	str
		}
	});

	layoutForshop.filter('tenderstep4',  ['$sce', function($sce){
		return function (input) {
			if(input.isCanceled){
				var cancelDetail=input.cancelDetail
				return $sce.trustAsHtml("<a class='blueColor' title='"+cancelDetail+"'>"+cancelDetail+"</a>")
			}else if(input.status==2){
				if(moment(input.tenderEnd).isBefore(new Date())){
					return $sce.trustAsHtml("<a class='redFont' href='tenderinfo?id="+input._id+"'>去选标</a><a ng-click='cancle(item)' class='blueColor'>取消招标</a>")
				}else{
					return $sce.trustAsHtml("<a ng-click='cancle(item)' class='blueColor'>取消招标</a>")
				}
			}else if(input.status==3){
				return $sce.trustAsHtml( "<a ng-click='downpayment(item)' class='blueColor'>支付定金</a>")
			}else if(input.status==4){
				return  $sce.trustAsHtml("<a ng-click='tocheck(item)'  class='blueColor'>确认验收</a>")
			}else if(input.status==5){
				return  $sce.trustAsHtml("<a ng-click='finalpayment(item)' class='blueColor'>支付尾款</a>")
			}else if(input.status==6){
				if(input.timeRcdStep6){
					return  $sce.trustAsHtml( "<a class='blueColor' ng-click='readcomment(item)'>查看评价</a>")
				}
				return  $sce.trustAsHtml( "<a class='blueColor ' ng-click='tocomment(item)'  >去评价</a>")
			}
			//
		};
	}])

	layoutForshop.filter('tenderstep5',  ['$sce', function($sce){
		return function (input) {
			if(input.isCanceled){
				var cancelDetail=input.cancelDetail
				return $sce.trustAsHtml("<a title='"+cancelDetail+"'>"+cancelDetail+"</a>")
			}else if(input.status==6){
				if(input.timeRcdStep6){
					return  $sce.trustAsHtml( "<a ng-click='readcomment(item)' >查看评价</a>")
				}
				return  $sce.trustAsHtml( "<a>等待招标方评价</a>")
			}
			//
		};
	}])

	layoutForshop.filter('tocash',  ['$sce', function($sce){
		return function (input) {
			if(input.status==6){
				if(input.withdrawDeposit==1||!input.withdrawDeposit){
					return  $sce.trustAsHtml( "<a class='redFont' ng-click='tocash(item)'>去提现</a>")
				}else if(input.withdrawDeposit==2){
					return  $sce.trustAsHtml( "<a class='redFont' >提现中</a>")
				}else if(input.withdrawDeposit==3){
					return  $sce.trustAsHtml( "<a class='redFont' >已提现</a>")
				}
			}
		};
	}])

	layoutForshop.filter('deposit', function() {
		return function (input) {
			if(!input){
				return "保证金未缴纳"
			}else {
				return "已缴纳"+input+"元招标保证金"
			}
		};
	})

	layoutForshop.filter('endtime', function(){
		return function(input){
			var timeobj=moment(input).toDate().getTime()
			var nowObj=new Date().getTime()
			var str=""
			var dateDiff=(timeobj-nowObj)/1000
			var day=parseInt(dateDiff/24/3600)
			var hours=parseInt(dateDiff%86400/3600)
			var minute=parseInt(dateDiff%3600/60)
			if(day>0){
				str+=day+"天"
			}
			if(hours>0){
				str+=hours+"小时"
			}
			if(minute>0){
				str+=minute+"分钟"
			}
			return 	str
		}
	});

	layoutForshop.filter('itemToId', function(){
		return function(text){
			return text._id
		};
	});

	layoutForshop.filter('filetype', function() {
		return function (input) {
			function filetype() {
				for (i = 0; i < input.files.length; i++) {
					if (input.files[i].name.split(".")[1] == 'png' ||
						input.files[i].name.split(".")[1] == 'jpg' ||
						input.files[i].name.split(".")[1] == 'jpeg') {
						var indexarr=[];
						indexarr.push(i);
						return input.files[indexarr[0]].url
					}
				}
			}
			if(filetype()){
				return filetype();
			}else{
				return "/themes/lanmai/images/fileicon.png";
			}
		};
	})
	
	layoutForshop.filter('topfilter', function() {
		return function (input) {
			return input?"已置顶":"置顶";
		};
	})

	layoutForshop.filter('itemToPro', function() {
		return function (input) {
			if(!input.promotionRegions||input.promotionRegions.length==0||!input.promotionEnd||input.promotionEnd<=new Date()){
				return false
			}
			return true
		};
	})
})(angular,jQuery)

