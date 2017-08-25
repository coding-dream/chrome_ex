// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', function()  // DOMContentLoaded, DOMNodeRemoved
{
	// 注入自定义JS
	injectCustomJs();
	// 给谷歌搜索结果的超链接增加 _target="blank"
	// if(location.host == 'www.google.com.tw')
	if(location.host == '127.0.0.1'){
		var objs = document.querySelectorAll('div.content a');
		for(var i=0; i<objs.length; i++){
			objs[i].setAttribute('_target', 'blank');
		}
		console.log('已处理超链接！');
	}
	else if(location.host == 'www.baidu.com'){
	
		fuckBaiduAD();
		initCustomPanel();
	}
});

function fuckBaiduAD(){
		if(document.getElementById('my_create_css')){ // 如果这里可以get到，表示自定义css创建并插入成功，不必重复创建(这里的注入是以操作DOM方式和content-script自身注入不同。)
			return;
		}
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
		/* 移除百度右侧广告 */
		#content_right{display:none;}
		/* 覆盖整个屏幕的相关推荐 */
		.rrecom-btn-parent{display:none;}'
		/* 难看的按钮 */
		.result-op.xpath-log{display:none !important;}`;
		temp.innerHTML = css;
		console.log('已注入自定义CSS！');

		$("data-tuiguang").remove(); // 屏蔽百度推广信息

}
		
function initCustomPanel(){
	var panel = document.createElement('div');
	panel.className = 'chrome-plugin-demo-panel';
	panel.innerHTML = `
		<h2>injected-script操作content-script演示区：</h2>
		<div class="btn-area">
			<a href="javascript:sendMessageToContentScriptByPostMessage('你好，我是普通页面！')">通过postMessage发送消息给content-script</a><br>
			<a href="javascript:sendMessageToContentScriptByEvent('你好啊！我是通过DOM事件发送的消息！')">通过DOM事件发送消息给content-script</a><br>
			<a href="javascript:invokeContentScript('sendMessageToBackground()')">发送消息到后台或者popup</a><br>
		</div>
		<div id="my_custom_log">
		</div>
	`;
	document.body.appendChild(panel);
}

// 向页面注入JS
function injectCustomJs(jsPath)
{
	jsPath = jsPath || 'js/inject.js';
	var temp = document.createElement('script');
	temp.setAttribute('type', 'text/javascript');
	// 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
	temp.src = chrome.extension.getURL(jsPath);
	temp.onload = function()
	{
		// 放在页面不好看，执行完后移除掉
		this.parentNode.removeChild(this);
	};
	document.body.appendChild(temp);
}


window.addEventListener("message", function(e)
{
	console.log('收到消息：', e.data);
	if(e.data && e.data.cmd == 'invoke') {
		eval('('+e.data.code+')');
	}
	else if(e.data && e.data.cmd == 'message') {
		tip(e.data.data);
	}
}, false);
