chrome.webRequest.onBeforeRequest.addListener(details => {

	// cancel 表示取消本次请求
	// if(details.type == 'image') return {cancel: true};
	
	// return {cancel: details.url.indexOf("http://www.evil.com/") != -1};

	if(details.url.indexOf("jianshu.com") > -1){ 
		var content = "<h1>hello world</h1>"
		return {"redirectUrl": "data:text/html;charset=UTF-8;base64," + btoa(content)};
	}
}, {urls: ["<all_urls>"]}, ["blocking"]);

var uaStrings = {
  "Firefox 41": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:41.0) Gecko/20100101 Firefox/41.0",
  "Chrome 41": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36",
  "IE 11": "Mozilla/5.0 (compatible, MSIE 11, Windows NT 6.3; Trident/7.0;  rv:11.0) like Gecko",
  "custom": "ASpider"
}

/**
 * 修改请求头
 * @param  {[type]} details [description]
 * @return {[type]}         [description]
 */
chrome.webRequest.onBeforeSendHeaders.addListener(details => {
	for (var header of details.requestHeaders) {
	    console.log("请求==> " + header.name + " : " + header.value);
	    if (header.name.toLowerCase() === "user-agent") {
		    header.value = "Spider";
	    } else if (header.name.toLowerCase() === "cookie"){
	    	header.value = "no cookie give you!";
	    }
	}
	return {requestHeaders: details.requestHeaders};
}, {urls: ["<all_urls>"]},["blocking","requestHeaders"]);

/**
 * 修改响应头(仍然无法修改,查阅很多相关资料,JS真恶心)
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
  if (command == "my_custom") {
	alert("快捷键被点击");  	
  }
});