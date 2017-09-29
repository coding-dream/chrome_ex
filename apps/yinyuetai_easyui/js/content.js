document.addEventListener('DOMContentLoaded', function(){
	initCustomPanel();
	initDialog();
});	


function initDialog(){
	var cssPath1 = "easyui/themes/material/easyui.css";
	// var cssPath2 = "easyui/themes/color.css";
	var cssPath3 = "easyui/themes/icon.css";

	var jsPath1 = "js/jquery.min.js";
	var jsPath2 = "easyui/jquery.easyui.min.js";
	var jsPath3 = "easyui/locale/easyui-lang-zh_CN.js";

	injectCss(cssPath1);
	// injectCss(cssPath2);// 过于影响个别网站样式 pass
	injectCss(cssPath3);

	injectJs(jsPath1);
	injectJs(jsPath2);
	injectJs(jsPath3);

	var dialogElement = document.createElement('div');
	dialogElement.className = "myCustomDialog";

	// <a href="javascript:void(0)" class="easyui-linkbutton" onclick="$('#wl_dlg').dialog('open')">Open</a>  ok
	// <a href="javascript:void(0)" class="easyui-linkbutton" onclick="$('#wl_dlg').dialog('close')">Close</a> ok
	dialogElement.innerHTML = `
		<div id="lw_dlg" class="easyui-dialog" closed="true" title="视频地址" data-options="iconCls:'icon-edit'" style="width:80%;height:200px;">

		</div>
	`;
	document.body.appendChild(dialogElement);

}

function injectJs(jsPath){
	var scriptElement = document.createElement('script');
	scriptElement.setAttribute('type', 'text/javascript');
	scriptElement.src = chrome.extension.getURL(jsPath);
	document.body.appendChild(scriptElement);	
}

function injectCss(cssPath){
	var cssElement = document.createElement('link');
	cssElement.setAttribute('rel', 'stylesheet');
	cssElement.setAttribute('type', 'text/css');
	cssElement.setAttribute('href', chrome.extension.getURL(cssPath));
	document.head.appendChild(cssElement);		
}

function initCustomPanel(){
	var panel = document.createElement('div');
	panel.className = 'download';
	panel.innerHTML = `
		<style>
			.lw_download {
				z-index: 1000;
			    position: fixed;
			    right: 20px;
			    top: 30px;
			    padding: 16px 10px;
			    border-radius: 3px;
			    text-align: center;
			}
			
			.lw_button{
				width:100px;
				height:30px;
				color:white;
				border:1px solid #1e7db9;
				box-shadow: 0 1px 2px #8fcaee inset,0 -1px 0 #497897 inset,0 -2px 3px #8fcaee inset;
				background: -webkit-linear-gradient(top,#42a4e0,#2e88c0);
				background: -moz-linear-gradient(top,#42a4e0,#2e88c0);
				background: linear-gradient(top,#42a4e0,#2e88c0);
			}

			#dialog_repace_me {
				z-index: 900;
			    position: fixed;
			    left: 20px;
			    top: 100px;
			    padding: 16px 10px;
			}
		</style>
		<div id="lw_tip" class="lw_download" style="display:none;">
			<button id="lw_show_dialog" class="lw_button" href="#">下载地址</button>
		</div>
		<div id="dialog_repace_me"></div>

	`;
	document.body.appendChild(panel);
}

var videoUrls = new Array();
var tempBuffer = null;//如果某些网站弹出dialog失败,供background.js创建contextMenus,executeScript调用该变量。

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if(request.cmd == 'invoke') {
		try{
			console.log("%c 获取到下载地址: %c " + "Content-Type: " +request.contentType + " -> " + request.video,"font-size:15pt;color:blue;","font-size:10pt;color:red;");
		}catch(e){
			console.log("获取到下载地址: " + request.video);
		}
		addUrl(request.video,request.contentType);
		sendResponse("nothing want to say!");
	}
});

function addUrl(video,contentType){
	videoUrls.push(video);

	var urls = uniqueArray(videoUrls);
	var buffer = `<span style="color:red;margin:16px;">视频个数 (${urls.length})</span><br/>`;
	for(var i=0;i<urls.length;i++){
		buffer +=`
			<div style="margin:16px;text-align:left;">
				<a href="${urls[i]}" target="_blank">${urls[i]}</a>&nbsp;&nbsp;(<span style="color:blue;">${contentType}</span>)
				<br/>
			</div>
			<div style="width:100%;height:1px;background:gray;margin-left:16px;margin-right:16px;"></div>
		`;
	}
	tempBuffer = buffer;// 每增加一个url,都重新遍历videoUrls构造buffer,并重新赋值给tempBuffer.

	$("#lw_dlg").html(tempBuffer);
	// ==================================
	$("#lw_tip").show();
	$("#lw_show_dialog").click(function(){
		var jsPath = "js/dialog.js";
		injectJs(jsPath);
	});
	
}


function uniqueArray(array){
	var tempArray = [];
	var results = [];
	for(var i=0;i<array.length;i++){
		tempArray[array[i]] = null;// 把目标数组的值当做key存入tempArray,value不需要利用,所以这里设为null,利用数组的key是唯一的剔除多余。
	}
	for(var key in tempArray){
		results.push(key);
	}
	return results;
}