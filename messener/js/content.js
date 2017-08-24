/**
 content_scripts可以共享页面的DOM,但是js相互隔离，互不影响。
 由于content_scripts和inject_scripts 都算是注入到某个url页面中（好像是页面的一部分），所以不支持跨域，而popup和background算是插件的一部分，所以都支持跨域。
*/
$(function(){
	var url = window.location.href;// 获取当前请求的url,可以根据url处理不同的逻辑。
	var content = $("body").html();
	// $("a").addClass("plugin_a");
	// $("h1,h2,p").removeClass("blue");// 能操作DOM自然可以删除or添加页面<a class='blue'/>等class属性（操作的不是css，所以都是可以的。）

	

});

window.onmouseup = function(){ // 用户鼠标松开时候触发事件
    var selection = window.getSelection(); // 当前鼠标选择的文本
    if(selection.anchorOffset != selection.extentOffset){
        chrome.runtime.sendMessage(selection.toString());
    }
}