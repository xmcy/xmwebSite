$(document).ready(function(){
    $('#fullPage').fullpage({
        verticalCentered: false,
        //sectionsColor: ['aqua','crimson','green','darkviolet'],
        anchors: ['page1','page2','page3','page4','page5','page6','page7','page8','page9','page10'],
        navigation: true,
        navigationTooltips: ['肖萌','个人信息','掌握技能','工作经历一','工作经历二','项目经验一','项目经验二','项目经验三','技术社群','其他活动','谢谢观看'],
        //滚动到某一屏后产生的动画效果
        afterLoad: function(link, index){
            switch (index){
                case 1:
                    move('.section1 h1').scale(1.5).end();
                    move('.section1 p').set('margin-top','20px').end();
                    break;
                case 2:
                    move('.section2 img').set('margin-left','200px').end();
                    move('.section2 h1').set('margin-left','30px').end();
                    move('.section2 .personalInfo').set('margin-top','300px').end();
                    break;
                case 3:
                    move('.section3 .list1').set('top','70%').end()
                    move('.section3 .list2').set('top','50%').end()
                    move('.section3 .list3').set('top','30%').end()
                    break;
                case 4:

                    break;
                case 5:

                    break;
                case 6:

                    break;
                case 7:

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
                    move('.section2 img').set('margin-left','-200px').end();
                    move('.section2 h1').set('margin-left','-200px').end();
                    move('.section2 .personalInfo').set('margin-top','1200px').end();
                    break;
                case 3:
                    move('.section3 .list1').set('top','130%').end()
                    move('.section3 .list2').set('top','150%').end()
                    move('.section3 .list3').set('top','170%').end()
                    break;
                case 4:

                    break;
                case 5:
                    break;
                case 6:

                    break;
                case 7:

                    break;
                default :
                    break;
            }
        },
    })


});