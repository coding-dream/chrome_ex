// 需要区分网站DOM和扩展DOM，popup.js(background.js)操作的DOM是扩展popup.html(background.html)中的DOM, 不可以直接访问【网站页面】的DOM
// 虽然popup和background都不能获取网站页面DOM，但是它们的chrome API比较丰富，我们常用的是这些东西就够了。

$(function(){
	var content = $("body").html(); 
	alert(content);

});


$("button").click(function(){
	chrome.tabs.create({url: 'http://www.w3school.com.cn/tiy/t.asp?f=html5_video'});
});
