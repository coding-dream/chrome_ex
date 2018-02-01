var alearyLoad = false;
$(function(){
	// var href = window.location.href;
	var param = getParam("opt");
	var opt = JSON.parse(Base64.decode(param));

	var title = opt.title;
	var url = opt.url;
	$("#input_name").attr("value",title);
	$("#input_url").attr("value",url);
});

function getParam(paramName) { 
    paramValue = "", isFound = !1; 
    if (this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=") > 1) { 
        arrSource = unescape(this.location.search).substring(1, this.location.search.length).split("&"), i = 0; 
        while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++ 
    } 
    return paramValue == "" && (paramValue = null), paramValue 
} 

$("input[id='btn_add']").click(function(){
	var name = document.getElementById("input_name").value;
	var url = document.getElementById("input_url").value;
	var cate = document.getElementById("input_cate").value;
	var cmd = "add";
	var json = {"name" : name, "url" : url, "cate" : cate, "cmd" : cmd};

	var json = JSON.stringify(json);

	var url = "http://localhost:8080?opt=" + json;
	$.get(url,function(data,status){
		var o = JSON.parse(data);
		if(o.code == 200){
			alert("保存成功！");
		} else {
			alert("保存失败！");
		}
	});
});

$("input[id='btn_list']").click(function(){
	if(alearyLoad){
		alert("aleary load!");
		return;
	}
	var cmd = "list";
	var json = {"cmd" : cmd};

	var json = JSON.stringify(json);

	var url = "http://localhost:8080?opt=" + json;
	$.get(url,function(data,status){
		var o = JSON.parse(data);
		if(o.code == 200){
			if(o.msg.length < 1){
				alert("暂无库存！");
				return;
			}
			for(var i = 0;i < o.msg.length; i++){
				var bookmark = o.msg[i];
				// alert(bookmark.name + " " + bookmark.url + " " + bookmark.cate);
				$("#list_u").append(`<li><span style="margin-right:16px;color:#CCCC99;">${bookmark.cate}</span> <a href='${bookmark.url}' class='' target='_blank'>${bookmark.name}</a>&nbsp;<a id="a_delete" class="list_a" href="#">删除</a></li>`);
			}
		}
		alearyLoad = true;
	});
});

$("div.list ul").on("click","li a#a_delete",function(){
	// 注意ajax中this的变化,所以这里用变量引用
	var preDom = $(this).prev();

	var cmd = "delete";
	var url = preDom.attr("href");	
	var json = {"cmd" : cmd, "url" : url};
	var json = JSON.stringify(json);

	var url = "http://localhost:8080?opt=" + json;
	$.get(url,function(data,status){
		var o = JSON.parse(data);
		if(o.code == 200){
			alert("删除成功！");
			preDom.parent().remove();
		} else {
			alert("删除失败！");
		}
	});	
});