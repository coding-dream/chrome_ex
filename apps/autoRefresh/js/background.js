/**
某个tab(url)页面即使关闭，再次打开依然能够刷新的原理是:使用一个List存储Task任务。
var refreshTabs = new Array();
refreshUrls.push({"tab": tab,"time":time});
*/
var t;
// Add event for new tabs.
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) { 
	console.log(tab.url + " tab update"); // 新建tab或者tab的url变化都会触发该事件
});


chrome.extension.onRequest.addListener(function(request, sender, sendResponse) { 
	// request对象就是sendRequest({})参数{}; sendRequest({tab:tab, refresh:true});
	var isRefresh = request.refresh;
	var time = request.time;

	var tab = request.tab;
		
	if(isRefresh){
		onRefresh(tab,time);
	}else{
		clearTimeout(t);
		console.log("stop");
	}
	sendResponse("回调函数");		

});

function onRefresh(tab,time){
	t = setTimeout(function() {
		// Update icon.
		// chrome.pageAction.setIcon({path:"images/refresh-on.png", tabId:tab.id});
		
		chrome.tabs.update(tab.id, {url: tab.url});
		// chrome.tabs.executeScript(tab.id, {code: 'location.reload(true);'}, function() {});
		onRefresh(tab,time);
	}, time);

}
