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

// 修改背景色1
$('#update_bg_color1').click(() => {
	executeCode('document.body.style.backgroundColor="red";');
});

// 修改背景色2
$('#update_bg_color2').click(() => {
	executeFile("js/execute.js");
});