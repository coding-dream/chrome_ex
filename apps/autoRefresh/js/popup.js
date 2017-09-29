var options = {};// 每次点击popup,都是新实例，所以这里的全局变量每次都重新加载一次，options.refresh 无需设置就是false。

options.refresh = false;
options.time = 3000;

$(function(){
	$("#btn_start").click(function(){
		// alert(options.refresh);
		// 先停止之前的
		sendMessage(options.refresh,options.time);

		// 再启动刷新
		var text = $("#input_time").attr("value");
		options.time = parseInt(text);

		options.refresh = true;
		sendMessage(options.refresh,options.time);
	});

	$("#btn_stop").click(function(){
		sendMessage(options.refresh,options.time);
	});

});

function sendMessage(refresh,time){
	// 下面sendRequest是的（消息传递）-之前案例使用的是其他方式传递消息。
	// Get the currently selected tab.
	chrome.tabs.getSelected(null, function(tab) { // chrome.tabs.getSelected已过时,建议chrome.tabs.query({active: truecurrentWindow: true}, callback(tabs))代替
		// Send request to parent to begin refresh task for this tab.
		chrome.extension.sendRequest({tab:tab, refresh:refresh,time:time}, function(response) {
			// alert("回调函数内容: " + response);
			window.close();
		});

	});	
}