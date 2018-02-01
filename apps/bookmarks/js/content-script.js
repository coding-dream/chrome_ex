chrome.runtime.onMessage.addListener(function(param, sender, sendResponse) {
	var cmd = param.cmd;
	if(cmd === "query"){
		// query
		var title = document.title;
		var url = window.location.href;
		var obj = {"title" : title, "url" : url};
		sendResponse(JSON.stringify(obj));
	}
});
