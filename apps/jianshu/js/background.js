var currentUrl = null;

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	currentUrl = tab.url;
});

chrome.tabs.onRemoved.addListener(function(tabId, moveInfo) {
	currentUrl = null;
});

// 向content-script注入JS片段
function executeCode(tabId,codeStr){
	chrome.tabs.executeScript(tabId, {code: codeStr});
}

chrome.webRequest.onBeforeRequest.addListener(details => {
	if(currentUrl === "http://www.jianshu.com/"){
		if(details.url.indexOf("http://www.jianshu.com/?seen_snote_ids") != -1){
			return {cancel:true};
		}
		if(details.url.indexOf("http://www.jianshu.com/?page=2") != -1){
			return {cancel:true};
		}
	}

}, {urls: ["http://www.jianshu.com/*"]}, ["blocking"]);