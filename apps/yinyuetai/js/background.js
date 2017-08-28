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
		chrome.tabs.executeScript(tabId, {code: codeStr});
	});
}

/**
chrome.webRequest.onBeforeRequest.addListener(details => {
	// Location: http://220.194.199.181/3/p/h/g/t/phgtegauolefucemgfuligrbhvdhqi/sh.yinyuetai.com/F9D3015E1BA3B8378ECBFE47880B922C.mp4?sc=262e5f4f46b1b6d3&br=4340&vid=3026306&aid=154&area=HT&vst=3Y%0Fy
	if(details.url.indexOf("ptp=mv&rd=yinyuetai.com") > -1){ // 音悦台的真实地址
		console.log(details.url);
	}

}, {urls: ["<all_urls>"]}, ["blocking"]);
*/

chrome.webRequest.onHeadersReceived.addListener(details => {
	for (var i = 0; i < details.responseHeaders.length; i++) {
		if(details.responseHeaders[i].name === "Content-Type" && details.responseHeaders[i].value === "video/mp4"){
			console.log("the video is : " + details.url);
			// 注入js
			// executeCode('document.body.style.backgroundColor="yellow";');

			var letShow = "$('.tip').show();";
			executeCode(letShow);

			// var tempStr = "document.getElementById('down_url').href='"+details.url+"'";
			// executeCode(tempStr);
			var tempStr = "$('#down_url').attr('href','"+details.url+"');";
			executeCode(tempStr);

			var tempClick = `
				$(".btn_down").click(function(){
					// alert("{0} say, I am {1} years old");
					var hidden = document.createElement('input');
					hidden.setAttribute('id', 'copy_text');
					hidden.setAttribute('value', '{2}');
					document.body.appendChild(hidden);

					var input = document.getElementById("copy_text");
					input.select(); // 选择对象
					document.execCommand("Copy"); // 执行浏览器复制命令
					alert("已复制好，可贴粘。");

					input.remove(); // 执行完移除

				});
			`;
			try{
				var temp = tempClick.replace("{0}","xiaoming").replace("{1}","20").replace("{2}",details.url);
				executeCode(temp);

			}catch(e){
				alert(e);
			}
			
			break;
		}
	}

}, {urls: ["<all_urls>"]}, ["responseHeaders"]);

