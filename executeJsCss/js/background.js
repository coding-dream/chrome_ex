// 获取当前选项卡ID
function getCurrentTabId(callback)
{
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
		if(callback) callback(tabs.length ? tabs[0].id: null);
	});
}

// 动态执行JS代码
// chrome.tabs.executeScript(tabId, {code: 'document.body.style.backgroundColor="red"'});
// 动态执行JS文件
// chrome.tabs.executeScript(tabId, {file: 'some-script.js'});


// 向content-script注入JS片段
function executeCode(codeStr){
	getCurrentTabId(function(tabId){
		chrome.tabs.executeScript(tabId, {code: codeStr});
	});
}

// file 方式一直执行失败，暂时不在测试
function executeFile(fileStr){
	alert(fileStr);
	getCurrentTabId(function(tabId){
		chrome.tabs.executeScript(tabId, {file: fileStr});
	});
}

setTimeout(function(){
	executeCode('document.body.style.backgroundColor="yellow";')
	// executeFile("execute.js");
},3000);
