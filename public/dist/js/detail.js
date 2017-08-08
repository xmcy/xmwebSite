$(function(){
    $('.dOut_content_thumbnail ul li:first').addClass("currentborders")
    $(".dOut_content_thumbnail ul li").click(function(){
        var myIndex = $(this).index();
        $(this).removeClass("loseborders").addClass("currentborders").siblings('li').removeClass("currentborders").addClass("loseborders");
        $('.dOut_content_banner li').hide();
        $('.dOut_content_banner li').eq(myIndex).fadeIn(500);
    })
   $('.dOut_next').click(function(){
       $(".dOut_content_thumbnail ul li:last").prependTo(".dOut_content_thumbnail ul");
       $(".dOut_content_banner li:last").prependTo(".dOut_content_banner");
       $(".dOut_content_thumbnail ul").css("margin-left" , "-129px");
       $(".dOut_content_thumbnail ul").stop().animate({'margin-left' : '0'});
       var currentimg=$(".currentborders")
       var myIndex = $(currentimg).index();
       if(myIndex>4){
           $(".dOut_content_thumbnail ul li").eq(3).removeClass("currentborders");
           $(".dOut_content_thumbnail ul li").eq(0).removeClass("loseborders").addClass("currentborders").siblings('li').removeClass("currentborders").addClass("loseborders");
           $('.dOut_content_banner li').hide();
           $('.dOut_content_banner li').eq(0).fadeIn(500);
       }else {
           $(".dOut_content_thumbnail ul li").eq(myIndex).removeClass("currentborders");
           $(".dOut_content_thumbnail ul li").eq(myIndex-1).removeClass("loseborders").addClass("currentborders").siblings('li').removeClass("currentborders").addClass("loseborders");
           $('.dOut_content_banner li').hide();
           $('.dOut_content_banner li').eq(myIndex-1).fadeIn(500);
       }

    })
    $('.dOut_prev').click(function(){
        // next("dOut_content_thumbnail","-129px");
        var currentimg=$(".currentborders")
        var myIndex = $(currentimg).index();
        if(myIndex<1){
            $(".dOut_content_thumbnail ul li").eq(0).removeClass("currentborders");
            $(".dOut_content_thumbnail ul li").eq(1).removeClass("loseborders").addClass("currentborders").siblings('li').removeClass("currentborders").addClass("loseborders");
            $('.dOut_content_banner li').hide();
            $('.dOut_content_banner li').eq(1).fadeIn(500);
        }else {
            $(".dOut_content_thumbnail ul li").eq(myIndex).removeClass("currentborders");
            $(".dOut_content_thumbnail ul li").eq(myIndex+1).removeClass("loseborders").addClass("currentborders").siblings('li').removeClass("currentborders").addClass("loseborders");
            $('.dOut_content_banner li').hide();
            $('.dOut_content_banner li').eq(myIndex+1).fadeIn(500);
        }
        $(".dOut_content_thumbnail ul li:first").appendTo(".dOut_content_thumbnail ul");
        $(".dOut_content_banner li:first").appendTo(".dOut_content_banner");
        $(".dOut_content_thumbnail ul").css("margin-left" , "129px");
        $(".dOut_content_thumbnail ul").stop().animate({'margin-left' : '0'});
    })

    // function next(cl,mo){
    //     var a;
    //     var b;
    //     $('.' + cl).find('ul').stop().animate({'margin-left' : mo},function(){
    //         b = $(this).find('li').attr('class');
    //         $('.swf p a.' + b).css({'background' : '#71bc65'});
    //         $(this).find('li:first').appendTo(this);
    //         a = $(this).find('li:first').attr('class');
    //         $(this).css({'margin-left' : '0'});
    //         $('.swf p a.' + a).css({'background' : '#060'});
    //     });
    // }
    //
    // function prev(cl,mo){
    //     $('.' + cl + ' ul li:last').prependTo('.' + cl + ' ul');
    //     $('.' + cl + ' ul').css({'margin-left' : mo});
    //     $('.' + cl + ' ul').stop().animate({'margin-left' : '0'});
    // }

   /* 点击交谈*/
    $(".talk").on("click",function () {
        var qq=$("#qq").val()
        if(qq&&qq!==""){

        }else{
            swal("该企业未录入qq")
        }
    })

    //下面内容的选项卡的切换
    $('.dOut_info02_title ul li').eq(0).css({"background":"#C4C2C2","color":"#fff"});
    $('.dOut_info02_title ul li').click(function(){
        $(this).css({"background":"#C4C2C2","color":"#fff"}).siblings().css({"background":"#fff","color":"#908E8E"});
        var myIndex = $(this).index();
        $('.dOut_tab').hide();
        $('.dOut_tab').eq(myIndex).show();
    })

    $('.dOutMapConf').flexslider({
        directionNav: true,
        animation: "slide",
        pauseOnAction: false,
        slideshowSpeed:3000
    });
    $('.dOutMapCons').flexslider({
        directionNav: true,
        animation: "slide",
        pauseOnAction: false,
        slideshowSpeed:3500
    });
    $('.best_brandRecommend').flexslider({
        directionNav: true,
        animation: "slide",
        pauseOnAction: false,
        slideshowSpeed:4000
    });
    var imgcount=$(".dOut_content_thumbnail ul li").length;
    $(".dOut_info01").height(imgcount*568+852);
    setTimeout(function () {
        var dOutheight=$(".dOut_info02").height();
        var imgcount=Math.ceil(dOutheight/272)-1;
        $(".dOut_info01").height(imgcount*272+54);
    },3000)

    $(".tel").on("click",function () {
        if($("#userId").val()==undefined){
            swal("登陆后查看手机号")
        }
    })
});