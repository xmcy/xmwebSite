$(function(){
    var CODE_GET_ERROR="验证码错误"
    var CODE_DATA_ERROR="验证码已过期";
    var CODE_NUM_LOST="电话号码或验证码无效";
    $("#xmhaha").text(window.location.host.indexOf("xmcy")>-1?"鄂ICP备17020747号-2":"鄂ICP备17020747号-1")
    $(".myTelNum").on("input",function(){
        var tel = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;
        var tvalue=$(".myTelNum").val();
        var Matchok = tvalue.match(tel);
        if (Matchok) {
            $('#username_wright-error').html("手机号码格式正确！").css({color:"#57B879"})
            $('.sendCodeRegister').css({"background":'#57B879'}).removeAttr("disabled");;
        }else if (!Matchok) {
            $('#username_wright-error').html("手机号码不正确！").css({color:"#DA2F2F"})
            $('.sendCodeRegister').css({"background":'#9E9E9E'}).attr({"disabled":"disabled"});
            return
        }
    })
    
    $(".forRegister>a").click(function(){
        var tel = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;
        var tvalue=$(".myTelNum").val();
        var Matchok = tvalue.match(tel);
        var codeValue=$(".codeValue").val();
        var keepPassword=$(".keepPassword").val();
        var inVite = $(".inviteCode").val();
        if (tvalue == "") {
            $('#username_wright-error').html("请输入手机号码").css({color:"#DA2F2F"});
            return
        } else if (!Matchok) {
            $('#username_wright-error').html("手机号码不正确！").css({color:"#DA2F2F"})
            return
        } else if (Matchok) {
            $('#username_wright-error').html("手机号码格式正确！").css({color:"#57B879"})
        }

        if (codeValue=="") {
            $('#code_wright-error').html("验证码不能为空！").css({color:"#DA2F2F"})
            return
        }
        var fuHao=/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
        var pasHao=/^[a-zA-Z0-9_]+$/;
        var honeyUName=$('.honeyUName').val();
        var pook=pasHao.test(keepPassword);
        var hook=fuHao.test(honeyUName);
        if(honeyUName==""){
            $('#honey_wright-error').html("")
        }else if(!hook){
            $('#honey_wright-error').html("昵称不能包含特殊字符！").css({color:"#DA2F2F"})
            return
        }else if(honeyUName.length>6){
            $('#honey_wright-error').html("昵称不能超过6个字符！").css({color:"#DA2F2F"})
            return
        }else if(hook){
            $('#honey_wright-error').html("昵称格式正确！").css({color:"#57B879"})
        }

        if(keepPassword==""){
            $('#pas_wright-error').html("密码不能为空！").css({color:"#DA2F2F"})
            return
        }else if(!pook){
            $('#pas_wright-error').html("密码只能包含数字、字母、下划线！").css({color:"#DA2F2F"});
            return
        }else if(keepPassword.length<6||keepPassword.length>12){
            $('#pas_wright-error').html("请输入6-12位密码！").css({color:"#DA2F2F"});
            return
        }else if(keepPassword.length>=6&&keepPassword.length<=12){
            $('#pas_wright-error').html("密码格式正确！").css({color:"#57B879"});
        }
        //注册
        $.post(
            "/users/doRegWithPhoneNum",
            {
                phoneNum:tvalue,
                code:codeValue,
                password:keepPassword,
                inviteCode:inVite
            },function(res){
                if(res.result=="success"){
                    $('#pas_wright-error').html("注册成功！").css({color:"#57B879"});
                    swal("注册成功！", "", "success")
                    setTimeout(function(){
                        window.location.href="weRegister"
                    },3*1000)
                }else{
                    swal(res+"！", "", "error")
                }
            })


    })
    // 注册验证码获取
    $('.sendCodeRegister').click(function(){
        var phoneNum =$(".myTelNum").val();
        $.ajax({
            type:"POST",
            url:"/users/sendVerifyCodeByPhoneRegister",
            data:{
                phoneNum:phoneNum,
                postType:"reg"
            },
            dataType: "json",
            success:function(res){
                if(res.result=="success"){
                    $('#code_wright-error').html("验证码已发送，请填入！").css({color:"#57B879"});
                    //$(".storeMyNmeD").val(res.user)
                    settime();
                }else if(res.msg.msg=="发送验证码失败"){
                    $('#code_wright-error').html("发送验证码频繁，请稍后再试！").css({color:"#DA2F2F"})
                }else if(res.msg="手机号码已被注册"){
                    $('#username_wright-error').html("手机号码已注册！请前往登录！").css({color:"#DA2F2F"})
                    return
                }
            }

        })
    })
    // 登录
    $('.forLoginSubmit').on("click",function(){
        var tel = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;
        var loginVal=$(".loginNum").val();
        var MatchLogin = loginVal.match(tel);
        if (loginVal == "") {
            $('#loginName_wright-error').html("请输入手机号码").css({color:"#DA2F2F"});
            return
        } else if (!MatchLogin) {
            $('#loginName_wright-error').html("手机号码不正确！").css({color:"#DA2F2F"})
            return
        } else if (MatchLogin) {
            $('#loginName_wright-error').html("手机号码格式正确！").css({color:"#57B879"})
        }
        var loPasVal=$(".loginPasswordVal").val();
        if(loPasVal==""){
            $('#loginPas_wright-error').html("密码不能为空！").css({color:"#DA2F2F"});
            return
        }

        $.post("/users/doLogin",{
                userName:loginVal,
                password:loPasVal
        },
            function(data){
                if(data=="success"){
                    $('#loginPas_wright-error').html("登录成功！").css({color:"#57B879"});
                    swal("登录成功！", "", "success")
                    setTimeout(function(){
                        window.location.href="getHomeInfo"
                    },3000)

                }else{
                    $('#loginPas_wright-error').html(data).css({color:"#DA2F2F"});
                    swal(data, "", "error")
                    return
                }
            }

        )
    })

    // 密码找回
    $(".forgetUsername").on("input",function(){
        var forgetUsername=$('.forgetUsername').val();
        var tel = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;
        var MatchForget = forgetUsername.match(tel);
        if (MatchForget) {
            $('#forgetUserName_wright-error').html("手机号码格式正确！").css({color:"#57B879"});
            $('.sendCode').css({"background":'#57B879'}).removeAttr("disabled");
        }else if (!MatchForget) {
            $('#forgetUserName_wright-error').html("手机号码格式不正确！").css({color:"#DA2F2F"})
            $('.sendCode').css({"background":'#9E9E9E'}).attr({"disabled":"disabled"});
            return
        }
    })
    $('.forgetCode01').blur(function(){
        var forgetCode01=$('.forgetCode01').val();
        var forgetUsername=$('.forgetUsername').val();
        if(forgetUsername==""){
            $('#forgetUserName_wright-error').html("请输入手机号码").css({color:"#DA2F2F"});
            return
        }else if(forgetCode01==""){
            $('#forgetCode_wright-error').html("验证码不能为空！").css({color:"#DA2F2F"});
            return
        }
        $.post("/users/checkVerifyCode",{
            code:forgetCode01,
            phoneNum:forgetUsername
        },function(res){
            if(res=="success"){
                $('#forgetCode_wright-error').html("验证码正确！").css({color:"#57B879"});
                $('.forgetCode01').attr({"disabled":"disabled"})

            }else if(res==CODE_GET_ERROR){
                $('#forgetCode_wright-error').html(CODE_GET_ERROR+"!").css({color:"#DA2F2F"});
                return
            }else if(res==CODE_DATA_ERROR){
                $('#forgetCode_wright-error').html(CODE_DATA_ERROR+"!").css({color:"#DA2F2F"});
                return
            }else if(res==CODE_NUM_LOST){
                $('#forgetCode_wright-error').html(CODE_NUM_LOST+"!").css({color:"#DA2F2F"});
                return
            }
        })


    })
    $('.forGetBack>a').click(function(){
        var forgetUsername=$('.forgetUsername').val();
        var forgetPassword=$('.forgetPassword').val();
        var tel = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;
        var MatchForget = forgetUsername.match(tel);
        if (forgetUsername == "") {
            $('#forgetUserName_wright-error').html("请输入手机号码").css({color:"#DA2F2F"});
            return
        } else if (!MatchForget) {
            $('#forgetUserName_wright-error').html("手机号码格式不正确！").css({color:"#DA2F2F"})
            return
        } else if (MatchForget) {
            $('#forgetUserName_wright-error').html("手机号码格式正确！").css({color:"#57B879"});
            $('.sendCode').css({"background":'#57B879'});
        }

        if(forgetPassword==""){
            $('#forgetPas_wright-error').html("密码不能为空！").css({color:"#DA2F2F"});
            return
        }
        
        //设定密码
        codeId = $(".storeMyNmeD").val();
        $.post(
            "/users/resetPsdFromForgetByWchat",
            {
                id:codeId,
                password:forgetPassword
            }, function(res){
                if(res=="success"){
                    $('#forgetPas_wright-error').html("密码重置成功！").css({color:"#57B879"});
                    swal("重置成功！", "", "success")
                    setTimeout(function(){
                        window.location.href="weRegister";
                    },3000)
                }else{
                    $('#forgetPas_wright-error').html("密码格式不正确！").css({color:"#DA2F2F"});
                    swal(res+"！", "", "error")
                    return
                }
        })


    })
    $('.forgetPasSendCode').click(function(){
        var phoneNum = $(".forgetUsername").val();
        $.ajax({
            type:"POST",
            url:"/users/sendVerifyCodeByPhone",
            data:{
                phoneNum:phoneNum
            },
            dataType: "json",
            success:function(res){
                if(res.result=="success"){
                    $('#forgetCode_wright-error').html("验证码已发送，请填入！").css({color:"#57B879"});
                    $(".storeMyNmeD").val(res.user)
                    settime();
                }else if(res.msg.msg=="发送验证码失败"){
                    $('#forgetUserName_wright-error').html("发送验证码频繁，请稍后再试！").css({color:"#DA2F2F"})
                }else if(res.msg="手机号码未注册"){
                    $('#forgetUserName_wright-error').html("手机号码未注册！请前往注册！").css({color:"#DA2F2F"})
                    setTimeout( function(){
                     window.location.href="weRegister"
                     }, 3 * 1000 )
                    return
                }
            }

        })
    })

    //注册的请求

})

var countdown = 60;
function settime() {
    var sendVerBtn = $('.sendCode');
    if (countdown == 0) {
        sendVerBtn.css('background', "#57B879");
        sendVerBtn.removeAttr("disabled");
        sendVerBtn.val("发送验证码");
        countdown = 60;
        return;
    } else {
        sendVerBtn.css('background', "#9e9e9e");
        sendVerBtn.attr("disabled","disabled");
        countdown--;
        sendVerBtn.val(countdown + "s" + "后");
    }
    setTimeout(function () {
        settime()
    }, 1000)
    //验证码的ajax
}