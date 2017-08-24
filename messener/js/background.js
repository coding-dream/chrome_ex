// 需要区分网站DOM和扩展DOM，popup.js(background.js)操作的DOM是扩展popup.html(background.html)中的DOM, 不可以直接访问【网站页面】的DOM
// 虽然popup和background都不能获取网站页面DOM，但是它们的chrome API比较丰富，我们常用的是这些东西就够了。

$("button#login").click(function(){
	alert("登录");
});

$("button#logout").click(function(){
	alert("注销");
});

<!-- ooooooooooooooooooooo发送ooooooooooooooooooooooo-->
// 获取当前选项卡ID
function getCurrentTabId(callback)
{
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
		if(callback) callback(tabs.length ? tabs[0].id: null);
	});
}

// background (popup)主动发送消息
function sendMessageToContentScript(message)
{
	getCurrentTabId((tabId) =>{
		chrome.tabs.sendMessage(tabId, message, function(response){
			console.log("background: 收到: " + response);
		});
	});
}

setTimeout(function(){
	// sendMessageToContentScript({cmd:'update_font_size', size: 42});
	sendMessageToContentScript("你好，我是background！");

},8000);


<!-- ooooooooooooooooooooo监听ooooooooooooooooooooooo-->
// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	console.log("backgournd 收到: " + request); // request 是一个可以自定义的对象(任意类型)
	sendResponse("你敢骂我，不想活了");
});
