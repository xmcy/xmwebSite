!function(e){"function"!=typeof String.prototype.startsWith&&(String.prototype.startsWith=function(e){return this.slice(0,e.length)===e}),e.getCos=function(t,n,o,i,r,s){var u=new CosCloud({appid:"1254086716",bucket:"xmcy",region:"sh",getAppSign:function(t){e.post("/users/getCosSignature",{once:!1},function(e){t(e)})}}),c=moment().format("YYYYMMDDHHmmss")+Math.ceil(1e5*Math.random())+"."+o;window.fileArr&&window.fileArr.push(c),u.uploadFile(r,s,function(t){e("#result").val("uploading... curr progress is "+t)},"xmcy","/"+c,i,1)},e.getCosByFile=function(t,n,o,i,r){if(""==n)s="/"+t+"/";else var s="/"+t+"/"+n+"/";var u=new CosCloud({appid:"1254086716",bucket:"xmcy",region:"sh",getAppSign:function(t){e.post("/users/getCosSignature",{once:!1},function(e){t(e)})}});if(""!==o.type&&o.type.startsWith("image"))c=moment().format("YYYYMMDDHHmmss")+Math.ceil(1e5*Math.random())+"."+o.type.split("/")[1];else var c=o.name;u.uploadFile(i,r,function(t){e("#result").val("uploading... curr progress is "+t)},"xmcy",s+c,o,1)},e.createFolder=function(t,n,o){new CosCloud({appid:"1254086716",bucket:"xmcy",region:"sh",getAppSign:function(t){e.post("/users/getCosSignature",{once:!1},function(e){t(e)})}}).createFolder(n,o,"xmcy",t)},e.deleteFile=function(t,n,o){new CosCloud({appid:"1254086716",bucket:"xmcy",region:"sh",getAppSign:function(t){e.post("/users/getCosSignature",{once:!1},function(e){t(e)})}}).deleteFile(n,function(t){t=t||{},e("#result").val(t.responseText||"error")},"xmcy",t)}}(jQuery);