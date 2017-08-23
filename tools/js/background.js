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
	contexts: ['selection'],
	onclick: function(info, tab){
		alert("选择的是 " + info.selectionText)
		// showPage(tab);
		// localStorage.setItem('developtoolbox_msg', info.selectionText);
		// chrome.tabs.sendMessage( develop_tools_id, { 'type': 'text'});
	}
})
