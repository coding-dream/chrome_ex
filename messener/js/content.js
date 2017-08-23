/**
 content_scripts可以共享页面的DOM,但是js相互隔离，互不影响。


*/
$(function(){
	var content = $("body").html();
	// alert(content);
	$("a").addClass("plugin_a");
	// $("h1,h2,p").removeClass("blue");// 能操作DOM自然可以删除or添加页面<a class='blue'/>等class属性（操作的不是css，所以都是可以的。）



});
