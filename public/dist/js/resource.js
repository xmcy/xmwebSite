$(function(){
	/*底部推广的下拉菜单*/
    $('.re_kinds').click(function(){
    	var Obig_kind = $('.re_big_total span').html();
	    var Osmall_kind = $('#re_small_kind').val();
	    $('.re_kid dt').eq(0).html(Obig_kind);
	    $('.re_kid dt').eq(1).html(Osmall_kind);
        $(".re_kid").slideToggle();

    });

    $('.re_kid dt').click(function(){
        var Okid = $(this).html();
        $('.re_kinds span').html(Okid);
        $('.re_kinds').prev('input').val(Okid);
    })
     $('.re_extend_con01_bottom ul li a').click(function(){
    	$(this).css({"border":"1px solid #DA2F2F"}).parent('li').siblings('li').children('a').css({"border":"1px solid #ACACAC"})
    })
    /*设备资源、杂志广告发布的页面*/
    $('.re_machine_kinds i,.re_sale_kinds i,.re_machine_brand i,.re_radio_kinds i,.re_radio_brand i,.re_radio_styles i,.re_tv_kinds i,.re_tv_brand i,.re_tv_styles i,.re_media_kinds i,.re_media_brand i,.re_material_kinds i,.re_material_brand i,.re_magazine_kinds i,.re_magazine_brand i,.re_radio_brand i,.re_tv_brand i,.re_magazine_styles i,.re_magazine_face i,.re_paper_kinds i,.re_paper_brand i,.re_paper_styles i,.re_paper_face i,.re_out_kinds i,.re_out_brand i,.re_out_styles i,.re_out_face i,.re_make_kinds i,.re_make_brand i').click(function(){
    	$(this).parent().children('ul').slideToggle();
    })

    $('.re_machine_kinds ul li a,.re_sale_kinds ul li a,.re_machine_brand ul li a,.re_radio_kinds ul li a,.re_radio_brand ul li a,.re_tv_kinds ul li a,.re_tv_brand ul li a,.re_media_kinds ul li a,.re_media_styles ul li a,.re_media_brand ul li a,.re_material_kinds ul li a,.re_material_brand ul li a,.re_magazine_kinds ul li a,.re_magazine_brand ul li a,.re_radio_styles ul li a,.re_tv_styles ul li a,.re_magazine_styles ul li a,.re_magazine_face ul li a,.re_paper_kinds ul li a,.re_paper_brand ul li a,.re_paper_styles ul li a,.re_paper_face ul li a,.re_out_kinds ul li a,.re_out_brand ul li a,.re_out_styles ul li a,.re_out_face ul li a,.re_make_kinds ul li a,.re_make_brand ul li a').click(function(){
    	var Omachine_kinds = $(this).html();
    	$(this).parents('li').children('i').html(Omachine_kinds);
    	$(this).parents('ul').prev('input').val(Omachine_kinds);
    	$(this).parent().parent().slideUp();

    })

    $('.nav p span').click(function(){
    	$('.date_selector').show();
    })
    //地区的获取
    var reArea = window.localStorage.getItem("area");
    if(reArea!=null){
        $('.re_header_area em').html(reArea)
        $('.re_header_area .index_for_area').val(reArea);
        $('.re_header_area .city-picker-span> span').html(reArea).eq(0).hide()
    }
    $('.re_header_area .title').text('')
    $('.re_header_area .city-select a').click(function(){
        var con =$(this).html();
        $('.re_header_area em').html(con).css({color:"#908E8E"});
        $('.resource_for_area').val(con);
        //setCookie("area",con);
        window.localStorage.setItem("area",con);
        //document.cookie="area="+con;
    })
})
$(function () {
    var editor = new wangEditor('wangEditor');
    editor.config.menus = [
        'fontsize',
        'bold',
        'underline',
        'strikethrough',
        'undo',
        'redo',
        'forecolor'
    ];

    // 字体
    editor.config.familys = [
        '宋体', '黑体', '楷体', '微软雅黑',
        'Arial', 'Verdana', 'Georgia'
    ];
    editor.config.colors = {
        '#880000': '暗红色',
        '#800080': '紫色',
        '#ff0000': '红色'
    };

    // 字号
    editor.config.fontsizes = {
        // 格式：'value': 'title'
        1: '10px',
        2: '13px',
        3: '16px',
        4: '19px',
        5: '22px',
        6: '25px',
        7: '28px'
    };
    editor.create();
    window.editor=editor;

    
});