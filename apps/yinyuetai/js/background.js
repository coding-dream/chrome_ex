/**
chrome.webRequest.onBeforeRequest.addListener(details => {
	// Location: http://220.194.199.181/3/p/h/g/t/phgtegauolefucemgfuligrbhvdhqi/sh.yinyuetai.com/F9D3015E1BA3B8378ECBFE47880B922C.mp4?sc=262e5f4f46b1b6d3&br=4340&vid=3026306&aid=154&area=HT&vst=3Y%0Fy
	if(details.url.indexOf("ptp=mv&rd=yinyuetai.com") > -1){ // 音悦台的真实地址
		console.log(details.url);
	}

}, {urls: ["<all_urls>"]}, ["blocking"]);
*/

chrome.webRequest.onHeadersReceived.addListener(details => {
	for (var i = 0; i < details.responseHeaders.length; i++) {
		if(details.responseHeaders[i].name === "Content-Type" && details.responseHeaders[i].value === "video/mp4"){
			console.log("the video is : " + details.url);
			// 注入js
			executeCode('document.body.style.backgroundColor="yellow";')
			break;
		}
	}

}, {urls: ["<all_urls>"]}, ["responseHeaders"]);

// 获取当前选项卡ID
function getCurrentTabId(callback)
{
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
		if(callback) callback(tabs.length ? tabs[0].id: null);
	});
}

// 向content-script注入JS片段
function executeCode(codeStr){
	getCurrentTabId(function(tabId){
		chrome.tabs.executeScript(tabId, {code: codeStr});
	});
}
