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

chrome.webRequest.onBeforeRequest.addListener(details => {
	if(details.url.indexOf("https://www.baidu.com") > -1){
		var remove1 = "$('#s_wrap').remove();";
		executeCode(remove1);
	}

}, {urls: ["<all_urls>"]}, ["blocking"]);