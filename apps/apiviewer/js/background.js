// var str = JSON.stringify(obj)
// var obj = JSON.parse(str);

var urls = new Array();
var tabId = null;
chrome.webRequest.onBeforeRequest.addListener(details => {
	if(details.url.indexOf("xx.com") > -1){ 
		var content = "<h1>hello world</h1>"
		return {"redirectUrl": "data:text/html;charset=UTF-8;base64," + btoa(content)};
	}
}, {urls: ["<all_urls>"]}, ["blocking"]);

var uaStrings = {
  "Firefox 41": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:41.0) Gecko/20100101 Firefox/41.0",
  "Chrome 41": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36",
  "IE 11": "Mozilla/5.0 (compatible, MSIE 11, Windows NT 6.3; Trident/7.0;  rv:11.0) like Gecko",
  "iphone": "iphone"
}

/**
 * 修改请求头
 * @param  {[type]} details [description]
 * @return {[type]}         [description]
 */
chrome.webRequest.onBeforeSendHeaders.addListener(details => {
	var url = details.url;
	tabId = details.tabId;
	// 过滤js,css,jpg,png,ico
	if(url.indexOf(".js") == -1 && url.indexOf(".css") == -1 && url.indexOf(".jpg") == -1
		&& url.indexOf(".png") == -1 && url.indexOf(".ico") == -1
		&& url.indexOf(".gif") == -1 && url.indexOf(".JPG") == -1 
		&& url.indexOf(".swf") == -1 && url.indexOf("api") != -1){
		pushArray(url);
	}

	for (var header of details.requestHeaders) {
	    console.log("请求==> " + header.name + " : " + header.value);
	    if (header.name.toLowerCase() === "user-agent") {
		    header.value = "Spider";
	    } else if (header.name.toLowerCase() === "cookie"){
	    	// header.value = "no cookie give you!";
	    }
	}

	return {requestHeaders: details.requestHeaders};
}, {urls: ["<all_urls>"]},["blocking","requestHeaders"]);

/**
 * 修改响应头(仍然无法修改,查阅很多相关资料)
 * @param  {[type]} details [description]
 * @return {[type]}         [description]
 */
chrome.webRequest.onHeadersReceived.addListener(details => {
	if(details.url.indexOf("localhost") != -1){
		for (var header of details.responseHeaders) {
			console.log("响应==> " + header.name + " : " + header.value);
		    if (header.name.toLowerCase() === "set-cookie") {
		    	header.value = "no cookie";
		    } else if (header.name.toLowerCase() === "server"){
		    	header.value = "Spider Server";
		    } else if (header.name.toLowerCase() === "content-type"){
		    	header.value = "application/json; charset=utf-8";
		    } else if (header.name.toLowerCase() === "x-powered-by"){
		    	header.value = "Python 3.6";
		    }
		}
		return {responseHeaders: responseHeaders};
	}
}, {urls: ["<all_urls>"]},["responseHeaders","blocking"]);

/* 监听快捷键 */
chrome.commands.onCommand.addListener(function(command) {
 	 if (command == "rx_get_cache") {
		chrome.storage.local.get(null,function(result) {
			sendMessageToContentScript(tabId,{"data" : result.data});
		});
	} else if(command == "rx_clear_cache"){
		clearCache();
	} else if(command == "rx_save_cache"){
		var buffer = `<div id = "rx_api">`;
		for(var i = 0; i < urls.length; i++){
			buffer += `<p> ${urls[i].uurl} </p><br/>`;
		}
		buffer += `</div>`;
		chrome.storage.local.set({"data" : buffer, function(){
			alert("save_cache success!");
		}});		
	}
});


function sendMessageToContentScript(tabId,message) {
	chrome.tabs.sendMessage(tabId, message, function(response) {
		console.log("background-> 收到: " + response);
	});
}

function pushArray(url){
	var md5Url = md5(url);
	console.log("============= push " + md5Url + "============");

	urls.push({"md5" : md5Url, "uurl" : url});

	/*
	 * 在Chrome中存储形式为: Map对象 { data : "xiaoming", age : "xx" }
	 * set()的语法就是{name : "value"} 键值对对象,类似Java的put("","");
	 *
	 * chrome.storage.local.set({"data" : "xiaoming" }, function(){
	 * 		console.log("save success!");
	 * });
	 */
		 
}

function clearCache(){
	chrome.storage.local.clear(function(){
		alert("clear_cache success!");
	});

}