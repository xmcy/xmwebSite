//banner 的轮播事件
$(function () {
   
    $('.index_banner').flexslider({
        directionNav: true,
        animation: "slide",
        pauseOnAction: false,
        slideshowSpeed:5000
    });
    $(".index_banner_con ").on("mouseenter ",function () {
        $('.index_banner').flexslider("stop")
    })
    $(".index_banner_con ").on("mouseleave ",function () {
        $('.index_banner').flexslider("play")
    })
    //选项卡的操作
    $('.index_sale_button ul li').click(function () {
        var index = $(this).index();
        $(this).addClass('on').siblings().removeClass('on');
        $('.index_sale_on>ul').hide().eq(index).show();
    })
    //搜索框的pull
    var Oheight = $(window).height();
    $(window).scroll(function () {
        var Oscroll = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        if (Oscroll > Oheight) {
            $('.index_pull_search').slideDown(500);
        } else {
            $('.index_pull_search').slideUp(500);
        }
        // if (Oscroll > (Oheight + Oheight / 2)) {
        //     $('.index_left_float').fadeIn(500);
        // } else {
        //     $('.index_left_float').fadeOut();
        // }
    })
    //左侧浮动条定位
    var Owidth = $(window).width();
    var Oleft_float = $('.index_left_float').width();
    var Oleft_floath = $('.index_left_float').height();
    var Onew_height = (Oheight - Oleft_floath) / 2;
    var Onew_width = (Owidth - 1200) / 2;
    $('.index_left_float').css({top: Onew_height, left: (Onew_width - Oleft_float - 20)});
    //右侧返回顶部的弹出
    $('.index_right_top02').hover(function () {
        $('.index_right_top1').animate({"margin-right": "82px"});
    }, function () {
        $('.index_right_top1').animate({"margin-right": "-82px"})
    })
    $('.indexToHave').hover(function () {
        $('.index_right_have').animate({"margin-right": "82px"});
    }, function () {
        $('.index_right_have').animate({"margin-right": "-82px"})
    })
    $('.indexToCenter').hover(function () {
        $('.index_right_personal').animate({"margin-right": "82px"});
    }, function () {
        $('.index_right_personal').animate({"margin-right": "-82px"})
    })
    $('.indexToweibo').hover(function () {
        $('.index_weibo').animate({"margin-right": "102px"});
    }, function () {
        $('.index_weibo').animate({"margin-right": "-102px"})
    })
    $('.constrict .regionHead .city-select a').click(function () {
        var con = $(this).html();
        $('.constrict .index_local_area').html(con).hide();
        $('.constrict .index_for_area').val(con);
        //setCookie("area",con);                                                                
        window.localStorage.setItem("area", con);
        //document.cookie="area="+con;
    })
    var areaCoo = window.localStorage.getItem("area");
    if(areaCoo!=null&&areaCoo!==""&&areaCoo.trim()!==""){
        $('.constrict .index_local_area').html(areaCoo);
        $('.constrict .index_for_area').val(areaCoo);
        $('.constrict .city-picker-span> span').html(areaCoo).eq(0).hide()
    }
    $('.title').text('')
    $(".chooseArea>.city-picker-span>.placeholder").text("请选择地区")

    //搜索点击下拉菜单的选项
    $('.searchKinds').mouseover(function(event){
        if($('.index_search_box dl').is(":visible")){
            $(this).css({"background-position":"-156px -91px"})
            $('.index_search_box dl').hide(100);
            $('.index_pull_con dl').hide(100);
        }else{
            $(this).css({"background-position":"-156px -116px"})
            $('.index_search_box dl').show(100);
            $('.index_pull_con dl').show(100);
        }

        //event.stopPropagation();
        if (window.event) {
            event.stopPropagation();
        }else{
            event.stopPropagation();
        }
        /*if($.browser.mozilla)
        {
            var $E = function(){var c=$E.caller; while(c.caller)c=c.caller; return c.arguments[0]};
            __defineGetter__("event", $E);
        }*/
    });
    $('#searchRecommendForManufacture').show()
    $('.index_search_box dl dt,.index_pull_con dl dt').click(function(){
        var oDt=$(this).html();
        var oName = $(this).attr("id");
        $('.index_search_box>ul').hide()
        if(oName=="all"){
            oName="all"
        }else if(oName=="cailiao"){
            oName="Material"
            $('#searchRecommendForMaterial').show()
        }else if(oName=="shebei"){
            oName="Equipment"
            $('#searchRecommendForEquipment').show()
        }else if(oName=="zhizuo"){
            oName="Manufacture"
            $('#searchRecommendForManufacture').show()
        }else if(oName=="xuqiu"){
            $('#searchRecommendForDemands').show()
        }else if(oName=="zhaobiao"){

        }else if(oName=="anzhuang"){
            $('#searchRecommendForFix').show()
        }
        $('.searchKinds').html(oDt).css({"background-position":"-156px -91px"});
        $('.serchKindName').val(oName);
        $('.index_search_box dl').hide(100)
        $('.index_pull_con dl').hide(100)

    })
    $('.index_search_box>ul>a').on('click',function () {
        $('input.searchText').val($(this).data('id'));
    })
    $(".kindSelect").mouseleave(function(event){
        $('.searchKinds').css({"background-position":"-156px -91px"});
        $('.index_search_box dl').hide(100);
        $('.index_pull_con dl').hide(100);
        if (window.event) {
            event.stopPropagation();
        }else{
            event.stopPropagation();
        }
       /* if($.browser.mozilla)
        {
            var $E = function(){var c=$E.caller; while(c.caller)c=c.caller; return c.arguments[0]};
            __defineGetter__("event", $E);
        }*/
    });
    //搜索框的下拉菜单的截取
    var OlenDt=$('.index_search_box dl dt').length;
    for(var i=0;i<OlenDt;i++){
        var OgetHtml=   $('.index_search_box dl dt').eq(i).html().substr(2,4);
        $('.index_search_box dl dt').eq(i).html(OgetHtml)
        $('.index_pull_con dl dt').eq(i).html(OgetHtml)
    }
    $(".index_buttom").click(function(){
        if('placeholder'in document.createElement('input')){
            var text = $(".index_search_box input.searchText").val();
        }else {
            if($(".index_search_box input.searchText").val()==$(".index_search_box input.searchText").attr("placeholder")){
                var text = ""
            }else {
                var text = $(".index_search_box input.searchText").val();
            }
        }
        var searchValue=$(".serchKindName").val();
        if(searchValue=="all"){
            window.location.href=text!=""&&text?'/resource/resourceListAll?text='+escape(text):'/resource/resourceListAll'
        }else if(searchValue=="Material"){
            window.location.href=text!=""&&text?'/resource/resourceListMaterial?text='+escape(text):'/resource/resourceListMaterial'
        }else if(searchValue=="Manufacture"){
            window.location.href=text!=""&&text?'/resource/resourceListMake?text='+escape(text):'/resource/resourceListMake'
        }else if(searchValue=="Equipment"){
            window.location.href=text!=""&&text?'/resource/resourceListMachine?text='+escape(text):'/resource/resourceListMachine'
        } else if(searchValue=="xuqiu"){
            window.location.href=text!=""&&text?'/resource/secondDemand?text='+escape(text):'/resource/secondDemand'
        }else if(searchValue=="anzhuang"){
            window.location.href=text!=""&&text?'/resource/resourceFixList?text='+escape(text):'/resource/resourceFixList'
        }else if(searchValue=="zhaobiao"){
            window.location.href=text!=""&&text?'/tender/tenderlist?text='+escape(text):'/tender/tenderlist'
        }

    })
    $(".resourceListMake").on("click",function () {
        window.location.href='/resource/resourceListMake?text='+escape($(this).data("i"))
    })
    $(".resourceListMaterial").on("click",function () {
        window.location.href='/resource/resourceListMaterial?text='+escape($(this).data("i"))
    })
    $(".resourceListMachine").on("click",function () {
        window.location.href='/resource/resourceListMachine?text='+escape($(this).data("i"))
    })
    $(".index_buttom1").click(function(){
        if('placeholder'in document.createElement('input')){
            var text = $(".searchText1").val();
        }else {
            if($(".searchText1").val()==$(".searchText1").attr("placeholder")){
                var text = ""
            }else {
                var text = $(".searchText1").val();
            }
        }
        var searchValue=$(".serchKindName").val();
        if(searchValue=="all"){
            window.location.href=text!=""&&text?'/resource/resourceListAll?text='+escape(text):'/resource/resourceListAll'
        }else if(searchValue=="Material"){
            window.location.href=text!=""&&text?'/resource/resourceListMaterial?text='+escape(text):'/resource/resourceListMaterial'
        }else if(searchValue=="Manufacture"){
            window.location.href=text!=""&&text?'/resource/resourceListMake?text='+escape(text):'/resource/resourceListMake'
        }else if(searchValue=="Equipment"){
            window.location.href=text!=""&&text?'/resource/resourceListMachine?text='+escape(text):'/resource/resourceListMachine'
        }else if(searchValue=="xuqiu"){
            window.location.href=text!=""&&text?'/resource/secondDemand?text='+escape(text):'/resource/secondDemand'
        }else if(searchValue=="zhaobiao"){
            window.location.href=text!=""&&text?'/tender/tenderlist?text='+escape(text):'/tender/tenderlist'
        }else if(searchValue=="anzhuang"){
            window.location.href=text!=""&&text?'/resource/resourceFixList?text='+escape(text):'/resource/resourceFixList'
        }


    })
    /*网站导航*/
    $(".forwebnav").hover(function(){
        $(".webnav").show();
        $(".forwebnav").addClass("forwenavstyle")
    },function(){
        $(".webnav").hide();
        $(".forwebnav").removeClass("forwenavstyle")
    })
    $(".webnav").on("mouseleave",function () {
        $(".webnav").hide();
        $(".forwebnav").removeClass("forwenavstyle")
    })
    $(".webnav").on("mouseenter",function () {
        $(".webnav").show();
        $(".forwebnav").addClass("forwenavstyle")
    })
    //关注我们的内容的弹出开始
    $('.aboutUsForMa').hover(function(){
        $('.charonAdIndexAboutUs').show();
        $('.charonAdIndexWhite').show();
    },function(){
        $('.charonAdIndexAboutUs').hide()
        $('.charonAdIndexWhite').hide();
    })
    //关注我们的内容的弹出结束
    //enter点击发生的点击搜索事件
    $(".index_search_box input.searchText").keyup(function (event) {
        if(event.keyCode ==13) {
            $(".index_buttom").trigger("click");
        }
    })
    $(".searchText1").keyup(function (event) {
        if(event.keyCode ==13) {
            $(".index_buttom1").trigger("click");
        }
    })


    $(".footqq").on("mouseenter",function () {
        $(".footweichartqr").css("display","none");
        $(".footqqqr").css("display","block");
    })
    $(".footweichart").on("mouseenter",function () {
        $(".footqqqr").css("display","none");
        $(".footweichartqr").css("display","block");
    })

    /*广告制作的推荐的跳转的修改*/

    // 网站数据
    $(".choose ul li").on("click",function () {
        var that=$(this)
        var liindex=$(".choose ul li").index($(that));
        $(that).parent().children().removeClass("activechoose");
        $(that).addClass("activechoose");
        $(".webinfo").removeClass("dis");
        $($(".webinfo")[liindex]).addClass("dis");
    })
    
})


