/**
 * Created by xiao on 2017/4/13.
 */
;(function ($) {
    if (typeof String.prototype.startsWith != 'function') {
        String.prototype.startsWith = function (prefix){
            return this.slice(0, prefix.length) === prefix;
        };
    }
    $.getCos=function (secondPath,filePath,fileType,file,successCallBack,errorCallBack) {
        var bucket = 'xmcy';
        var appid = '1254086716';
        var sid = '';
        var skey = '';
        var region = 'sh';
        var myFolder = '/';

        var cos = new CosCloud({
            appid: appid,// APPID 必填参数
            bucket: bucket,//bucketName 必填参数
            region: region,//地域信息 必填参数 华南地区填gz 华东填sh 华北填tj
            getAppSign: function (callback) {//获取签名 必填参数
                $.post('/users/getCosSignature', {once: false}, function (data) {
                    var sig = data;
                    callback(sig);
                });
            }
        })
        var progressCallBack = function (curr) {
            $("#result").val('uploading... curr progress is ' + curr);
        };
        var name=moment().format("YYYYMMDDHHmmss")+Math.ceil(Math.random()*100000)+"."+fileType
        if(window.fileArr){
            window.fileArr.push(name)
        }
        cos.uploadFile(successCallBack, errorCallBack, progressCallBack, bucket, myFolder + name, file, 1);
    }
    //                        $.deleteFile($(this).parent().prev().attr("src").substr(43),function (res) {
//                            console.log(res)
//                        })
    $.getCosByFile=function (secondPath,filePath,file,successCallBack,errorCallBack) {
        var bucket = 'xmcy';
        var appid = '1254086716'
        var sid = '';
        var skey = '';
        var region = 'sh';
        if(filePath==""){
            var myFolder = '/'+secondPath+'/';//需要操作的目录
        }else {
            var myFolder = '/'+secondPath+'/'+filePath+'/';//需要操作的目录
        }
        var cos = new CosCloud({
            appid: appid,// APPID 必填参数
            bucket: bucket,//bucketName 必填参数
            region: region,//地域信息 必填参数 华南地区填gz 华东填sh 华北填tj
            getAppSign: function (callback) {//获取签名 必填参数
                $.post('/users/getCosSignature', {once: false}, function (data) {
                    var sig = data;
                    callback(sig);
                });
            }
        })
        var progressCallBack = function (curr) {
            $("#result").val('uploading... curr progress is ' + curr);
        };
        if(file.type!==""&&file.type.startsWith("image")){
            var name=moment().format("YYYYMMDDHHmmss")+Math.ceil(Math.random()*100000)+"."+file.type.split("/")[1]
        }else {
            var name=file.name
        }
        cos.uploadFile(successCallBack, errorCallBack, progressCallBack, bucket, myFolder + name, file, 1);
    }
    $.createFolder=function (newFolder,successCallBack,errorCallBack) {
        var bucket = 'adquan';
        var appid = '1253780958';
        var sid = '';
        var skey = '';
        var region = 'gz';
        var cos = new CosCloud({
            appid: appid,// APPID 必填参数
            bucket: bucket,//bucketName 必填参数
            region: region,//地域信息 必填参数 华南地区填gz 华东填sh 华北填tj
            getAppSign: function (callback) {//获取签名 必填参数
                $.post('/users/getCosSignature', {once: false}, function (data) {
                    var sig = data;
                    callback(sig);
                });
            }
        })
        cos.createFolder(successCallBack, errorCallBack, bucket, newFolder);
    }
    $.deleteFile=function (myFile,successCallBack,errorCallBack) {
        var bucket = 'adquan';
        var appid = '1253780958';
        var sid = '';
        var skey = '';
        var region = 'gz';
        var cos = new CosCloud({
            appid: appid,// APPID 必填参数
            bucket: bucket,//bucketName 必填参数
            region: region,//地域信息 必填参数 华南地区填gz 华东填sh 华北填tj
            getAppSign: function (callback) {//获取签名 必填参数
                $.post('/users/getCosSignature', {once: false}, function (data) {
                    var sig = data;
                    callback(sig);
                });
            }
        })
        var errorCallBack = function (result) {
            result = result || {};
            $("#result").val(result.responseText || 'error');
        };
        cos.deleteFile(successCallBack, errorCallBack, bucket, myFile);
    }

})(jQuery)















