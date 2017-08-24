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

// 动态执行CSS代码，TODO，这里有待验证
// chrome.tabs.insertCSS(tabId, {code: 'xxx'});
// 动态执行CSS文件
// chrome.tabs.insertCSS(tabId, {file: 'some-style.css'});


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

// 修改背景色1
$('#update_bg_color1').click(() => {
	executeCode('document.body.style.backgroundColor="red";');
});

// 修改背景色2
$('#update_bg_color2').click(() => {
	executeFile("execute.js");
});