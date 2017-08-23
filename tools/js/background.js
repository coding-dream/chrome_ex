var develop_tools_id = null;

function showPage(tab) {
	if (develop_tools_id) {
		chrome.tabs.update(develop_tools_id, {
			active: true
		});
	} else {
		chrome.tabs.create({
			url: chrome.extension.getURL("../index.html"),
			selected : true
		},
		function(tab) {
			develop_tools_id = tab.id;
		})
	}
};

chrome.browserAction.onClicked.addListener(function(tab) {
		showPage(tab);
	}
);

chrome.tabs.onRemoved.addListener(function(tabId, moveInfo) {
	if(tabId == develop_tools_id){
		develop_tools_id = null;
	}
});

chrome.contextMenus.create({
	type: 'normal',
	title: "复制到Tools \"%s\"",
	contexts: ['selection'], // 文本选择时候才创建此右键
	onclick: function(info, tab){
		alert("选择的是 " + info.selectionText)
		// showPage(tab);
		// localStorage.setItem('developtoolbox_msg', info.selectionText);
		// chrome.tabs.sendMessage( develop_tools_id, { 'type': 'text'});
	}
})

// 检测网络是否可用
function httpRequest(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            callback(true);
        }
    }
    xhr.onerror = function(){
        callback(false);
    }
    xhr.send();
}

function checkStatus(){
    httpRequest('https://www.baidu.com/', function(status){
        chrome.browserAction.setIcon({path: 'images/'+(status?'online.png':'offline.png')});
        setTimeout(checkStatus, 5000);
    });
}

checkStatus();