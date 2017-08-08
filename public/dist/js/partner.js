$(document).ready(function(){
    $(".forwebnav").on("mouseenter",function () {
        $(this).addClass("forwenavstyle");
        $(".webnav").show();
    })
    $(".webnav").on("mouseenter",function () {
        $(".webnav").show();
        $(".forwebnav").addClass("forwenavstyle");
    })
    $(".webnav").on("mouseleave",function () {
        $(".webnav").hide();
        $(".forwebnav").removeClass("forwenavstyle");
    })
    $(".submmint").on("click",function () {
        var    address=$(".address").val();
        var    companyName=$(".companyName").val();
        var    contactorName=$(".contactorName").val();
        var    contactorNum=$(".contactorNum").val();
        var    contactorWay=$(".contactorWay").val();
        var    restmobible = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        var    testmobile=/^([0-9]{3,4}-)?[0-9]{7,8}$/;
        if(address.trim()==""){
				swal({
					title: "所在城市不能为空",
					type: "error",
					confirmButtonText: "确定"
				});
				return false;
			}
        if(companyName.trim()==""){
            swal({
                title: "企业名称不能为空",
                type: "error",
                confirmButtonText: "确定"
            });
            return false;
        }
        if(companyName.trim()!==""&&companyName.length>=30){
            swal({
                title: "企业名称不能超过30个字",
                type: "error",
                confirmButtonText: "确定"
            });
            return false;
        }
        if(contactorName.trim()==""){
            swal({
                title: "联系人不能为空",
                type: "error",
                confirmButtonText: "确定"
            });
            return false;
        }
        if(contactorName.trim()!==""&&companyName.length>=30){
            swal({
                title: "联系人名字不能超过30个字",
                type: "error",
                confirmButtonText: "确定"
            });
            return false;
        }
        if(contactorNum.trim()==""){
            swal({
                title: "联系电话不能为空",
                type: "error",
                confirmButtonText: "确定"
            });
            return false;
        }
        if (restmobible.test(contactorWay)||testmobile.test(contactorWay)){
		}else {
            swal({
                title: "联系电话填写有误！",
                type: "error",
                confirmButtonText: "确定"
            });
            return false;
        }
        if(contactorWay.trim()==""){
            swal({
                title: "公司地址不能为空",
                type: "error",
                confirmButtonText: "确定"
            });
            return false;
        }
        var data={
            address:address,
            companyName:companyName,
            contactorName:contactorName,
            contactorNum:contactorNum,
            contactorWay:contactorWay,
        }
        swal({
                title: "确认提交",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                closeOnConfirm: false
            },
            function(){
                $.ajax({
                    url:"/users/",
                    data:JSON.stringify(data),
                    type:"POST",
                    dataType:"json",
                    contentType:"application/json",
                    success:function(res){
                        console.log(res)
                        if(res.result=="success"){
                            swal({
                                title: "提交成功!",
                                type: "success",
                                confirmButtonText: "确定"
                            });
                            window.location.reload();
                        }else {
                            swal({
                                title: "提交失败!",
                                type: "error",
                                confirmButtonText: "确定"
                            });
                        }
                    },
                    error:function (res) {
                        swal({
                            title: "提交失败!",
                            type: "error",
                            confirmButtonText: "确定"
                        });
                        console.log("error"+res);
                    }
                })

            });
    })
    $('#fullPage').fullpage({
        verticalCentered: false,
        //sectionsColor: ['aqua','crimson','green','darkviolet'],
        anchors: ['page1','page2','page3','page4','page5','page6','page7'],
        navigation: true,
        navigationTooltips: ['制作宝，它终于来了','真正与你贴近的广告制作服务平台','制作宝平台优势','城市运营商合作模式','城市运营商激励模式','我们需要这样的你','加入我们'],
        //滚动到某一屏后产生的动画效果
        afterLoad: function(link, index){
            switch (index){
                case 1:
                    move('.section1 h1').scale(1.5).end();
                    move('.section1 p').set('margin-top','10px').end();
                    var i=0
                    setInterval(function () {
                        i++
                        if(i<301){
                            $(".yellow").text(i+"+")
                        }else {
                            return
                        }
                    },1)
                    break;
                case 2:
                    move('.section2 h1').scale(1.2).end(function () {
                        move('.section2 a').scale(1.2).end()
                        }
                    );
                    break;
                case 3:
                    move('.section3 .imgone').set('margin-top','0px').end(function(){
                        move('.section3 .imgtwo').set('margin-top','0px').end(function(){
                            move('.section3 .imgthree').set('margin-top','0px').end();
                        })
                    });
                    break;
                case 4:
                    move('.section4 .imglist').set('margin-top','30px').end(function(){
                        move('.section4 .ultwo').set('margin-top','120px').end(function(){
                            move('.section4 .ultwo').scale(1.2).end()
                        })
                    })
                    break;
                case 5:
                    move('.section5 .encourageone').set('left','43%').end(function(){
                        move('.section5 .encouragetwo').set('left','31%').end(function(){
                            move('.section5  .encouragethree').set('left','56%').end()
                            });
                        });
                    break;
                case 6:
                    move('.section6 h1').set('margin-top','60px').end(function () {
                        move('.section6 .imgone').set('margin-top','0px').end(function () {
                                    move('.section6 .imgtwo').set('margin-top','0px').end(function () {
                                            move('.section6 .imgthree').set('margin-top','0px').end(function () {
                                    });
                                })
                        })
                    });
                    break;
                case 7:
                    move('.section7 h1').set('margin-top','90px').end(function () {
                       move('.section7 .joinus').set('margin-top','40px').end(function () {
                          move('.section7 .submmint').set('margin-top','60px').end()
                    });
                    })
                    break;
                default :
                    break;
            }
        },
        //离开某一屏后恢复到初始效果
        onLeave: function(link, index){
            switch (index){
                case 1:
                    move('.section1 h1').scale(1).end();
                    move('.section1 p').set('margin-top','800px').end();
                    break;
                case 2:
                    move('.section2 h1').scale(1).end();
                    move('.section2 a').scale(1).end()
                    break;
                case 3:
                    move('.section3 .imglist .imgone').set('margin-top','1500px').end();
                    move('.section3 .imglist .imgtwo').set('margin-top','1500px').end();
                    move('.section3 .imglist .imgthree').set('margin-top','1500px').end();
                    break;
                case 4:
                    move('.section4 .imglist').set('margin-top','3000px').end()
                    move('.section4 .ultwo').set('margin-top','1200px').end()
                    move('.section4 .ultwo').scale(1).end()
                      0
                    break;
                case 5:
                    move('.section5 .encourageone').set('left','-43%').end()
                    move('.section5 .encouragetwo').set('left','-56%').end()
                    move('.section5  .encouragethree').set('left','101%').end()
                    break;
                case 6:
                    move('.section6 h1').set('margin-top','-20px').end()
                    move('.section6 .imgone').set('margin-top','1500px').end()
                    move('.section6 .imgtwo').set('margin-top','1500px').end()
                    move('.section6 .imgthree').set('margin-top','1500px').end()
                    break;
                case 7:
                    move('.section7 h1').set('margin-top','-200px').end()
                    move('.section7 .joinus').set('margin-top','1800px').end()
                    move('.section7 .submmint').set('margin-top','800px').end()
                    break;
                default :
                    break;
            }
        },
    })


});