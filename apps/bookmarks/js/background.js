// 获取当前选项卡ID
function getCurrentTabId(callback){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		if(callback) callback(tabs.length ? tabs[0].id: null);
	});
}


// background (popup)主动发送消息to content.js
function sendMessageToContentScript(tabId, message){
	chrome.tabs.sendMessage(tabId, message, function(response){
		openNewTab(response);
	});
}

chrome.commands.onCommand.addListener(function(command) {
 	 if (command == "rx_add_bookmark") {
 	 	getCurrentTabId(function(tabId) {
	 	 	sendMessageToContentScript(tabId,{"cmd":"query"});
 	 	});
	}
});

function openNewTab(json){
	var result = Base64.encode(json);
	var location = "op_save.html?opt=" + result;
	window.open(chrome.extension.getURL(location));
}