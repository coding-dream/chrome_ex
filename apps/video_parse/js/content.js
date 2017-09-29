document.addEventListener('DOMContentLoaded', function(){
	initCustomPanel();
});	

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

	if (typeof jQuery == 'undefined') { 
		console.log("jQuery 未加载");
		var jsPath = "js/jquery.min.js";
		injectJs(jsPath);
	} else { 
		console.log("jQuery 已加载");
	} 

	var cssPath = "css/inject.css";
	injectCss(cssPath);

	var panel = document.createElement('div');
	panel.innerHTML = `
		<div id="lw_tip" style="display:none;">
			<button id="lw_button" href="#">下载地址</button>
		</div>
		<div id="lw_dialog"></div>
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
				<a href="${urls[i]}" target="_blank">${urls[i]}</a>&nbsp;&nbsp;(<span style="color:gray;">${contentType}</span>)
				<br/>
			</div>
			<div style="width:100%;height:1px;background:gray;margin-left:16px;margin-right:16px;"></div>
		`;
	}
	tempBuffer = buffer;

	$("#lw_dialog").html(tempBuffer);
	
	// ==================================
	$("#lw_tip").show();
	$("#lw_button").click(function(){

		$("#lw_dialog").css("background","white");
		$("#lw_dialog a").attr("style","color:gray");
		$("#lw_dialog").show().delay(4000).fadeOut();

	});
	
}


function uniqueArray(array){
	var tempArray = [];
	var results = [];
	for(var i=0;i<array.length;i++){
		tempArray[array[i]] = null;
	}
	for(var key in tempArray){
		results.push(key);
	}
	return results;
}