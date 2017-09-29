var currentTabId = null;

var tabIdList = new Array(); // tabIds集合

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	tabIdList.push(tabId);// 也可以存对象
});

chrome.tabs.onRemoved.addListener(function(tabId, moveInfo) {
	for (var i=0; i < tabIdList.length; i++) {
		if (tabIdList[i] == tabId) {
			tabIdList.splice(i, 1);
			return;
		}
	}
});

function contains(tabId){
	for (var i=0; i < tabIdList.length; i++) {
		var _tabId = tabIdList[i];
		if (tabId == _tabId) {
			return true;
		}
	}
	return false;
}

// 向content-script注入JS片段
function executeCode(tabId,codeStr){
	if(contains(tabId)){
		chrome.tabs.executeScript(tabId, {code: codeStr});
	}
}

/*
chrome.webRequest.onBeforeRequest.addListener(details => {
	// Location: http://220.194.199.181/3/p/h/g/t/phgtegauolefucemgfuligrbhvdhqi/sh.yinyuetai.com/F9D3015E1BA3B8378ECBFE47880B922C.mp4?sc=262e5f4f46b1b6d3&br=4340&vid=3026306&aid=154&area=HT&vst=3Y%0Fy
	if(details.url.indexOf("ptp=mv&rd=yinyuetai.com") > -1){ // 音悦台的真实地址
		console.log(details.url);
	}

}, {urls: ["<all_urls>"]}, ["blocking"]);
*/

/** 数组是否存在某个元素 */
Array.prototype.contains1 = function (element) {
  for (i in this) {
    if (this[i] == element.toLowerCase()) return true;
  }
  return false;
}

/** 数组是否存在某个元素 */
Array.prototype.contains2 = function (element) {
	if(this.indexOf(element) != -1){// 方式二:元素在array中的索引值(推荐)
		return true;
	}
	return false;
}

/** 数组元素是否包含某个字符串 */
Array.prototype.containsSub = function (element) {
 	for (i in this) {
 		var value = (this[i] + "").toLowerCase();
 		var e = element.toLowerCase();
	    if (value.indexOf(e) != -1) return true;
 	}
 	return false;
}


var content_types = new Array();
content_types.push("video/mp4");// mp4
content_types.push("video/x-flv");// flv
content_types.push("audio/mpeg");// mp3
content_types.push("application/vnd.rn-realmedia");// rm
content_types.push("audio/x-mpegurl"); // m3u8
content_types.push("application/vnd.apple.mpegurl");// m3u8
content_types.push("application/vnd.apple.mpegurl;charset=UTF-8");// m3u8  
content_types.push("application/x-mpegURL");// m3u8
content_types.push("video/x-msvideo");// avi 
content_types.push("audio/x-flac");// flac
content_types.push("video/3gpp");// 3gp 
content_types.push("audio/mp4");// m4a
content_types.push("application/octet-stream");// .*(二进制流，不知道下载文件类型)

chrome.webRequest.onHeadersReceived.addListener(details => {

	for (var i = 0; i < details.responseHeaders.length; i++) {
		if(details.responseHeaders[i].name === "Content-Type"){
			var c_v = details.responseHeaders[i].value;
			if(content_types.containsSub(c_v)){
				// details.tabId 如果请求与标签页无关则为 -1。
				if(details.tabId != -1){
					currentTabId = details.tabId;
				}
				var type = showType(c_v);

				sendMessageToContentScript(currentTabId,{"cmd":"invoke","video":details.url,"tabId":currentTabId,"contentType":type});

				try{
					console.log("");
				}catch(e){
					alert(e);
				}
				
				break;
			}
		}
	}

}, {urls: ["<all_urls>"]}, ["responseHeaders"]);

// background (popup)主动发送消息to content.js
function sendMessageToContentScript(tabId,message){
	chrome.tabs.sendMessage(tabId, message, function(response){
			console.log("background-> 收到: " + response);
	});
}

chrome.runtime.onInstalled.addListener(function(){
  chrome.contextMenus.create({
    'id':'lwvideo',
    'type':'normal',
    'title':'获取当前页视频链接'
  });
});

chrome.contextMenus.onClicked.addListener(function(info,tab){
	if(info.menuItemId == "lwvideo"){
		var codeStr = `
			$("#dialog_repace_me").show().delay(4000).fadeOut();
			$("#dialog_repace_me").html(tempBuffer); // 调用content-script中的变量
			$("#dialog_repace_me").css("background","white");
			$("#dialog_repace_me a").attr("style","color:red"); //或者 css方法
		`;
		executeCode(tab.id,codeStr);
	}
});

function showType(type){
	var temp = null;
	type = type.toLowerCase();
	if(type.indexOf("application/x-mpegurl") != -1 || type.indexOf("application/vnd.apple.mpegurl") != -1 || type.indexOf("audio/x-mpegurl") != -1){
		temp = "m3u8";
	}else if(type.indexOf("audio/mpeg") != -1){
		temp = "mp3";
	}else if(type.indexOf("video/x-flv") != -1){
		temp = "flv";
	}else if(type.indexOf("video/mp4") != -1){
		temp = "mp4";
	}else if(type.indexOf("application/octet-stream") != -1){
		temp = "application/octet-stream";
	}else if(type.indexOf("audio/mp4") != -1){
		temp = "m4a";
	}else if(type.indexOf("video/3gpp") != -1){
		temp = "3gp";
	}else if(type.indexOf("audio/x-flac") != -1){
		temp = "flac";
	}else if(type.indexOf("video/x-msvideo") != -1){
		temp = "avi";
	}else if(type.indexOf("application/vnd.rn-realmedia") != -1){
		temp = "rm";
	}else{
		temp = type;
	}

	return temp;
}