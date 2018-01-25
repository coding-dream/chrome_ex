document.addEventListener('DOMContentLoaded', function(){
	initData();
	initView();
	setTimeout(function(){
		tellbgLoad();
	}, 7000);
});	


function initData(){
	if (typeof jQuery == 'undefined') { 
		console.log("jQuery 未加载");
		var jsPath = "js/jquery.min.js";
		injectJs(jsPath);
	} else { 
		console.log("jQuery 已加载");
	}
		
	injectJs("js/inject.js");
}

function initView(){
	var inject_layout = document.createElement('div');
	inject_layout.innerHTML = `
		<center>
			<div style="margin:36px;">
				<p><a style="color:green;font-size:28px;" href="https://www.jianshu.com/u/79a88a044955" target="_blank">简书: 编程之乐</a></p>
			</div>
		</center>
	`;
	$("body").prepend(inject_layout);
}

chrome.runtime.onMessage.addListener(function(param, sender, sendResponse) {
	var data = param.data;
	$("#rx_api").remove();

	console.log(data);
	$("body").prepend(data);
	sendResponse("success");
});


function tellbgLoad(){
	// 发送消息给background.js
	chrome.runtime.sendMessage({cmd: "invokeCache"}, function(response) {
		console.log('收到来自后台的回复：' + response);
	});
}