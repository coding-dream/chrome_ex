// var str = JSON.stringify(obj)
// var obj = JSON.parse(str);

var urls = new Array();
var tabId = null;
var isEnable = false;

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
  "XiaoMi5s": "Mozilla/5.0 (Linux; U; Android 7.0; zh-CN; MI 5s Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/40.0.2214.89 UCBrowser/11.7.0.953 Mobile Safari/537.36",
  "vivoX9Plus": "Mozilla/5.0 (Linux; Android 6.0.1; vivo X9Plus Build/MMB29M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.49 Mobile MQQBrowser/6.2 TBS/043409 Safari/537.36 MicroMessenger/6.5.13.1100 NetType/4G Language/zh_CN",
   "iPhone": "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5",
   "BaiduSpider": "Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)",
   "360": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0); 360Spider(compatible; HaosouSpider; http://www.haosou.com/help/help_3_2.html)",
   "Android": "Mozilla/5.0 (Linux; U; Android 2.2.1; zh-cn; HTC_Wildfire_A3333 Build/FRG83D) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1",
   "Nexus7": "Mozilla/5.0 (Linux; Android 4.1.1; Nexus 7 Build/JRO03D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Safari/535.19",
   "vivo": "Dalvik/2.1.0 (Linux; U; Android 5.0.2; vivo X5Pro D Build/LRX21M) okhttp/3.3.0 haruki/3.2.0",
}

/**
 * 修改请求头
 * @param  {[type]} details [description]
 * @return {[type]}         [description]
 */
chrome.webRequest.onBeforeSendHeaders.addListener(details => {
	if(!isEnable){
		return {requestHeaders: details.requestHeaders};
	}

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
	    if (header.name.toLowerCase() === "user-agent") {
		    header.value = uaStrings.vivo;
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

/**
 * 监听快捷键
 * @param  {[type]} command) 
 * @return {[type]}
 */
chrome.commands.onCommand.addListener(function(command) {
 	 if (command == "rx_get_cache") {
 	 	getCache();
	} else if(command == "rx_clear_cache"){
		removeCache();
	} else if(command == "rx_save_cache"){
		saveCache();
	}
});


/**
 * 发送消息给content-script
 * @param  {[type]} tabId   [description]
 * @param  {[type]} message [description]
 * @return {[type]}         [description]
 */
function sendMessageToContentScript(tabId,message) {
	chrome.tabs.sendMessage(tabId, message, function(response) {
		// jQuery已创建DOM
		if(response === "success"){
			console.log("remove dom delay 10s");
			// 清空全局数组
			urls = new Array();
		}
	});
}

/**
 * 监听来自content-script的消息
 * @param  {[type]} request                                                                     [description]
 * @param  {[type]} sender                                                                      [description]
 * @param  {[type]} sendResponse){	console.log('收到来自content-script的消息：');	console.log(request, sender,       sendResponse);	sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request));} [description]
 * @return {[type]}                                                                             [description]
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log("收到: " + JSON.stringify(request));
	if(request.cmd === "invokeCache"){
		removeCache();
		saveCache();
		getCache();
	}
});

function pushArray(url){
	var md5Url = md5(url);
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


function uniqueArray(array){
	var tempArray = [];
	var results = [];
	for(var i = 0;i < array.length; i++){
		tempArray[array[i].uurl] = null;
	}
	for(var key in tempArray){
		results.push(key);
	}
	return results;
}


function removeCache(){
	if(!isEnable){
		console.log("未开启");
		return;
	}
	chrome.storage.local.remove("data",function(){
		console.log("remove cache success!");
	});
}

/**
 * 清除所有缓存
 * @return {[type]} [description]
 */
function clearAllCache(){
	if(!isEnable){
		console.log("未开启");
		return;		
	}
	chrome.storage.local.clear(function(){
		console.log("clear_cache success!");
	});
}

/**
 * 保存缓存
 * @return {[type]} [description]
 */
function saveCache(){
	if(!isEnable){
		console.log("未开启");
		return;
	}
	var newUrls = uniqueArray(urls);
	console.log(newUrls);
	var buffer = `<div id = "rx_api">`;
	for(var i = 0; i < newUrls.length; i++){
		buffer += `<p> <a href="${newUrls[i]}" style="color:red;" target="_blank">${newUrls[i]}</a></p><br/>`;
	}
	buffer += `</div>`;

	chrome.storage.local.set({"data" : buffer},function(){
		console.log("save cache success!");
		
	});
}

/**
 * 获取缓存,第一个参数为null时表示获取全部键值对.
 * @return {[type]} [description]
 */
function getCache(){
	if(!isEnable){
		console.log("未开启");
		return;
	}

	chrome.storage.local.get(null,function(result) {
		sendMessageToContentScript(tabId,{"data" : result.data});
	});
}
