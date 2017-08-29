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
		chrome.tabs.executeScript(tabId, {code: codeStr,runAt: "document_start"});
	});
}

// 向content-script注入JS文件
function executeFile(fileStr){
	getCurrentTabId(function(tabId){
		chrome.tabs.executeScript(tabId, {file: fileStr,runAt: "document_start"});
	});
}

setTimeout(function(){
	executeCode('document.body.style.backgroundColor="yellow";');
	executeFile("js/execute.js");
},3000);
