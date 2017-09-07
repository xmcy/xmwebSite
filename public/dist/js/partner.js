$(document).ready(function(){
    $('#fullPage').fullpage({
        verticalCentered: false,
        //sectionsColor: ['aqua','crimson','green','darkviolet'],
        anchors: ['page1','page2','page3','page4','page5','page6','page7'],
        navigation: true,
        navigationTooltips: ['制作宝，它终于来了','真正与你贴近的广告制作服务平台','制作宝平台优势','城市合伙人合作模式','城市合伙人激励模式','我们需要这样的你','加入我们'],
        //滚动到某一屏后产生的动画效果
        afterLoad: function(link, index){
            switch (index){
                case 1:
                    move('.section1 h1').scale(1.5).end();
                    move('.section1 p').set('margin-top','20px').end();
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
                    move('.section2 h1').set('margin-left','200px').end();
                    move('.section2 .personalInfo').set('margin-top','300px').end();
                    break;
                case 3:
                    move('.section3 .imgone').set('display','block').end()
                        move('.section3 .imgtwo').set('display','block').end()
                            move('.section3 .imgthree').set('display','block').end();
                    
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
                    move('.section2 h1').set('margin-left','-200px').end();
                    move('.section2 .personalInfo').set('margin-top','1200px').end();
                    break;
                case 3:
                    move('.section3 .imglist .imgone').set('display','none').end();
                    move('.section3 .imglist .imgtwo').set('display','none').end();
                    move('.section3 .imglist .imgthree').set('display','none').end();
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