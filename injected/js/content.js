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
	document.body.appendChild(temp);

	temp.onload = function(){ // 该元素已经载入完成。
		console.log("temp.onload" + this); // 这里的this指的是temp元素即 HTMLScriptElement
		// 放在页面不好看，执行完后移除掉,发现一个结论：删除掉<script src>后,script仍然有效，因为脚本已经加载内存中，而且【源码】 和 【控制台源码】几乎是天壤之别，【源码】几乎看不出任何信息，连js都没有，真正的源码是【控制台源码】 
		this.parentNode.removeChild(this); // 删掉 <script type="text/javascript" src="chrome-extension://mpkohggclgpaapjibodgpjaccnofbcnf/js/inject.js"></script>
	};
	console.log("body.appendChild(temp)"); // 这个不管放在哪里都比temp.onload执行要早。temp.onload要等到页面载入完成后回调。
}

function fuckBaiduAD(){
		/**
			<style id = "my_create_css">
				.ad_right{ display:none; }
				.ad_recomment{ display:none; }
			</style>
		*/
		var temp = document.createElement('style');
		temp.id = 'my_create_css';
		(document.head || document.body).appendChild(temp);
		var css = `
			.ad_right{ display:none;} 			/* 移除广告 */
			.ad_recomment{display:none;}			/* 覆盖推荐 */
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
