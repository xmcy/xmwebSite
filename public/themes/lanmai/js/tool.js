!function(e){"function"!=typeof String.prototype.startsWith&&(String.prototype.startsWith=function(e){return this.slice(0,e.length)===e}),e.getCos=function(t,n,o,i,r,u){if(""==n)a="/"+t+"/";else var a="/"+t+"/"+n+"/";var s=new CosCloud({appid:"1253780958",bucket:"adquan",region:"gz",getAppSign:function(t){e.post("/users/getCosSignature",{once:!1},function(e){t(e)})}}),p=moment().format("YYYYMMDDHHmmss")+Math.ceil(1e5*Math.random())+"."+o;window.fileArr&&window.fileArr.push(p),s.uploadFile(r,u,function(t){e("#result").val("uploading... curr progress is "+t)},"adquan",a+p,i,1)},e.getCosByFile=function(t,n,o,i,r){if(""==n)u="/"+t+"/";else var u="/"+t+"/"+n+"/";var a=new CosCloud({appid:"1253780958",bucket:"adquan",region:"gz",getAppSign:function(t){e.post("/users/getCosSignature",{once:!1},function(e){t(e)})}});if(""!==o.type&&o.type.startsWith("image"))s=moment().format("YYYYMMDDHHmmss")+Math.ceil(1e5*Math.random())+"."+o.type.split("/")[1];else var s=o.name;a.uploadFile(i,r,function(t){e("#result").val("uploading... curr progress is "+t)},"adquan",u+s,o,1)},e.createFolder=function(t,n,o){new CosCloud({appid:"1253780958",bucket:"adquan",region:"gz",getAppSign:function(t){e.post("/users/getCosSignature",{once:!1},function(e){t(e)})}}).createFolder(n,o,"adquan",t)},e.deleteFile=function(t,n,o){new CosCloud({appid:"1253780958",bucket:"adquan",region:"gz",getAppSign:function(t){e.post("/users/getCosSignature",{once:!1},function(e){t(e)})}}).deleteFile(n,function(t){t=t||{},e("#result").val(t.responseText||"error")},"adquan",t)}}(jQuery);