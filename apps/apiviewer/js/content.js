var apis = new Array();

document.addEventListener('DOMContentLoaded', function(){
	initData();
	initView();
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
			<p>have a happy day!</p>
		</center>
	`;
	$("body").prepend(inject_layout);
}

chrome.runtime.onMessage.addListener(function(param, sender, sendResponse) {
	var data = param.data;
	$("#rx_api").remove();
	$("body").prepend(data);
});
