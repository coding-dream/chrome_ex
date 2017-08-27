// web请求监听，最后一个参数表示阻塞式，需单独声明权限：webRequestBlocking
chrome.webRequest.onBeforeRequest.addListener(details => {

	// cancel 表示取消本次请求
	// if(details.type == 'image') return {cancel: true};
	
	// return {cancel: details.url.indexOf("http://www.evil.com/") != -1};

	if(details.url.indexOf("ptp=mv&rd=yinyuetai.com") > -1){ // 音悦台的真实地址
		console.log(details.url);
	}

	if(details.url.indexOf("http://www.java1234.com") != -1){
		// url = url.replace("http://","https://");
		reUrl = "http://www.jianshu.com";
		console.log("修改后的地址是：" + reUrl);
		return {redirectUrl: reUrl};
	}
	


}, {urls: ["<all_urls>"]}, ["blocking"]);

// 修改请求头
/*
chrome.webRequest.onBeforeSendHeaders.addListener(details => {
	console.log("current url ===> " + details.url);
	if(details.url.indexOf("jianshu.com") != -1){
		for (var i = 0; i < details.requestHeaders.length; i++) {
			switch(details.requestHeaders[i].name){
				case "User-Agent":
					details.requestHeaders[i].value = "A Spidder";
					break;
				case "Cookie":
					details.requestHeaders[i].value = "I dont give cookie";
					break;
			}
		}
	}

	for (var i = 0; i < details.requestHeaders.length; i++) {
		if(details.requestHeaders[i].name === "User-Agent"){
			// console.log(details.requestHeaders[i].name + " === " + details.requestHeaders[i].value);
			// splice() 方法用于插入、删除或替换数组的元素。
			// http://www.runoob.com/jsref/jsref-splice.html
			details.requestHeaders.splice(i,1); // 刪除User-Agent 
			break;
		}
	}
	return {requestHeaders: details.requestHeaders};
}, {urls: ["<all_urls>"]},["blocking","requestHeaders"]);

*/

// 修改响应头(说明:此监听器可以像上面一样获取每一个键值对，但是以下2种方式的修改都不生效，Google很多也没有解决方案，也许新版Google禁用了吧，待定！)
// 也罢,只要能够获取Headers就够了，可以自定义Http请求模拟实现我们的需求。
chrome.webRequest.onHeadersReceived.addListener(details => {
	// 方式一
	if(details.url.indexOf("www.jianshu.com") != -1){
		rule1 = {
			name:"redirUrl",
			value:"http://java1234.com"
		};
	
		 rule2 = {
		 	name:"Server",
		 	value:"Tomcat"
		};

		var rule3 = {
	        "name": "Access-Control-Allow-Origin",
    	    "value": "*"
	    };
		details.responseHeaders.push(rule1);
		details.responseHeaders.push(rule2);
		details.responseHeaders.push(rule3);

		return {responseHeaders: details.responseHeaders};
	}
	// 方式二
	/**
	if(details.url.indexOf("www.jianshu.com") != -1){
		for (var i = 0; i < details.responseHeaders.length; i++) {
			if(details.responseHeaders[i].name === "Set-Cookie"){
				console.log("=== Set-Cookie ===");
				details.responseHeaders[i].value = "Tomcat Cookie";
				break;
			}
		}
	}
	*/
	return {responseHeaders: details.responseHeaders};

}, {urls: ["*://*/*"]},["blocking","responseHeaders"]);