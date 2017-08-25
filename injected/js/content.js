window.addEventListener("message", function(e)
{
	console.log('收到消息：', e.data);

	if(e.data && e.data.cmd == 'invoke') {
		eval('('+e.data.code+')');
	}else if(e.data && e.data.cmd == 'message') {
		alert(e.data.data);
	}
}, false);

// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', function()  // DOMContentLoaded, DOMNodeRemoved
{
	// 注入自定义JS
	injectCustomJs("js/inject.js");
	// 给谷歌搜索结果的超链接增加 _target="blank"
	console.log("location.host :" + location.host);
	if(location.host == 'www.jianshu.com'){
		console.log('处理超链接！');
		var objs = document.querySelectorAll('div.content a');
		for(var i=0; i<objs.length; i++){
			objs[i].setAttribute('_target', 'blank');
			console.log(objs[i]);
		}

	}else if(location.host == '127.0.0.1'){
		console.log('处理AD！');		
		fuckBaiduAD();
		initCustomPanel();
	}
});

// 向页面注入JS
function injectCustomJs(jsPath)
{
	var temp = document.createElement('script');
	temp.setAttribute('type', 'text/javascript');
	// 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
	temp.src = chrome.extension.getURL(jsPath); // getURL() 需要 web_accessible_resources": ["js/inject.js"] , 之前的Demo中使用扩展的图片时候提到过这个设置。
	temp.onload = function()
	{
		// 放在页面不好看，onload内说明此js已经载入执行完成(oooooooooooooooooooooooooooooooooooooooooooooo)，执行完后移除掉
		this.parentNode.removeChild(this);
	};
	document.body.appendChild(temp);
}

function fuckBaiduAD(){
		// body head(或body中) append : style 对象, 但是也是有id等属性的。
		/**
			虽然在html中是下面的样式
			style{
				#content_right{ display:none; }
				.btn_info{ display:none; }
			}
		*/
		var temp = document.createElement('style');
		temp.id = 'my_create_css';
		(document.head || document.body).appendChild(temp);
		var css = `
			.ad_right{ display:none;} 			/* 移除广告 */
			.ad_recomment{display:none;}'			/* 覆盖推荐 */
		`;
		temp.innerHTML = css;
		console.log('已注入自定义CSS！');

		$(".ad_tuiguang").remove(); // 屏蔽百度推广信息

}
		
function initCustomPanel(){
	var panel = document.createElement('div');
	panel.className = 'chrome-plugin-demo-panel';
	panel.innerHTML = `
		<h2>injected-script操作content-script演示区：</h2>
		<div class="btn-area">
			<a href="javascript:invokeContentScript1('alert(1)')">invokeContentScript1</a><br>
			<a href="javascript:invokeContentScript2('Hello Java')">invokeContentScript2</a><br>
		</div>
		<div id="my_custom_log">
		</div>
	`;
	document.body.appendChild(panel);
}
