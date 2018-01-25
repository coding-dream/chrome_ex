$(function(){
	// support alert, not suport console.
	var defaultConfig = {enable: false}; // 默认配置
	
	// 读取数据，第一个参数是指定要读取的key以及设置默认值
	chrome.storage.local.get(defaultConfig, function(jsonObj) {
		document.getElementById('config').checked = jsonObj.enable;
		chrome.extension.getBackgroundPage().isEnable = jsonObj.enable;
	});
});

$('#rx_con').click(e => {
	var isChecked = document.getElementById('config').checked;

	chrome.extension.getBackgroundPage().isEnable = isChecked; // 让background即使生效

	chrome.storage.local.set({enable: isChecked}, function() {
		// 注意新版的options页面alert不生效！
		alert("设置: " + isChecked);
	});
});

