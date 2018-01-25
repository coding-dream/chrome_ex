$(function(){
	// support alert, not suport console.
	var defaultConfig = {enable: false, ua: false}; // 默认配置
	
	// 读取数据，第一个参数是指定要读取的key以及设置默认值
	chrome.storage.local.get(defaultConfig, function(jsonObj) {
		document.getElementById('config_enable').checked = jsonObj.enable;
		document.getElementById('config_ua').checked = jsonObj.ua;
		
		chrome.extension.getBackgroundPage().isEnable = jsonObj.enable;
		chrome.extension.getBackgroundPage().ua_type = jsonObj.ua;		
	});
});

$('#rx_con').click(e => {
	var isChecked = document.getElementById('config_enable').checked;
	var ua_type = document.getElementById('config_ua').checked;

	// 让background即使生效
	chrome.extension.getBackgroundPage().isEnable = isChecked;
	chrome.extension.getBackgroundPage().ua_type = ua_type;

	chrome.storage.local.set({enable: isChecked, ua: ua_type}, function() {
		// 注意新版的options页面alert不生效！
		alert("设置成功!");
	});
});

