/**
 content_scripts可以共享页面的DOM,但是js相互隔离，互不影响。
 由于content_scripts和inject_scripts 都算是注入到某个url页面中（好像是页面的一部分），所以不支持跨域，而popup和background算是插件的一部分，所以都支持跨域。

<!-- 重点：通信-->
<!-- 
	injected-script.js,
	content-script.js,
	popup.js,
	backgournd.js
	以下是它们之间的通信:

	injected-script->content-script: window.postMessage(html5)
	content-script->injected-script: window.postMessage(html5)

	content-script->background(popup):chrome.runtime.sendMessage(chrome.runtime.connect)
	background(popup)->content-script:chrome.tabs.sendMessage(chrome.tabs.connect)

	popup->background:chrome.extension. getBackgroundPage()
	background->popup:chrome.extension.getViews


	权限：
	popup和background都可以访问绝大多数API,除了devtools系列

	injected-script和普通js无任何差别，不能访问任何扩展API
	content-script 只能访问extension,runtime等部分API

	injected-script和content-script都可以访问页面DOM,都被注入到页面中，属于页面
	popup和background都不能访问页面DOM(只能访问自身的DOM),属于扩展

	JS互访: 只有injected-script能够和页面js相互访问，其他均不可以访问。
	跨域: popup和background可以跨域，injected-script和content-script 不能跨域。

-->

*/
$(function(){
	var url = window.location.href;// 获取当前请求的url,可以根据url处理不同的逻辑。
	var content = $("body").html();
	// $("a").addClass("plugin_a");
	// $("h1,h2,p").removeClass("blue");// 能操作DOM自然可以删除or添加页面<a class='blue'/>等class属性（操作的不是css，所以都是可以的。）

	send();
});


<!-- oooooooooooooooooooooooooooooooooooooooooooo-->
window.onmouseup = function(){ // 用户鼠标松开时候触发事件
    var selection = window.getSelection(); // 当前鼠标选择的文本
    if(selection.anchorOffset != selection.extentOffset){
        chrome.runtime.sendMessage(selection.toString());
    }
}


<!-- oooooooooooooooooooo监听oooooooooooooooooooooooo-->
// 接收来自(background或popup)的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	if(request.cmd == 'update_font_size') {
		var ele = document.createElement('style');
		ele.innerHTML = `* {font-size: ${request.size}px !important;}`;
		document.head.appendChild(ele);
	}
	else {
		// tip(JSON.stringify(request));
		console.log("content 收到: " + request);
		sendResponse('我收到你的消息了：'+JSON.stringify(request));
	}
});


// 简单的消息通知
var tipCount = 0;
function tip(info) {
	info = info || '';
	var ele = document.createElement('div');
	ele.className = 'chrome-plugin-simple-tip slideInLeft';
	ele.style.top = tipCount * 70 + 20 + 'px';
	ele.innerHTML = `<div>${info}</div>`;
	document.body.appendChild(ele);
	ele.classList.add('animated');
	tipCount++;
	setTimeout(() => {
		ele.style.top = '-100px';
		setTimeout(() => {
			ele.remove();
			tipCount--;
		}, 400);
	}, 3000);
}


<!-- ooooooooooooooooooooo发送ooooooooooooooooooooooo-->
function send(){
	var message = "Fuck You baby";
	// 主动发送消息给后台
	chrome.runtime.sendMessage({greeting: message}, function(response) {
		console.log("content 收到：" + response);
	});
}

	