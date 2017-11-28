var blogUrls = new Array();
blogUrls.push({'name':'我的简书','url':'http://www.jianshu.com/u/79a88a044955'});
blogUrls.push({'name':'GitHub','url':'https://github.com/'});
blogUrls.push({'name':'掘金','url':'https://juejin.im/'});
blogUrls.push({'name':'trinea','url':'http://www.trinea.cn/'});
blogUrls.push({'name':'开发者头条','url':'https://toutiao.io/'});
blogUrls.push({'name':'segmentfault','url':'https://segmentfault.com/t/android'});
blogUrls.push({'name':'codekk','url':'http://p.codekk.com/'});
blogUrls.push({'name':'androiddevtools','url':'http://www.androiddevtools.cn/'});
blogUrls.push({'name':'极客导航','url':'http://jikedaohang.com/'});
blogUrls.push({'name':'csdn','url':'https://www.csdn.net/'});
blogUrls.push({'name':'知乎','url':'https://www.zhihu.com/'});
blogUrls.push({'name':'干货集中营','url':'http://gank.io/'});
blogUrls.push({'name':'泡在网上的日子','url':'http://www.jcodecraeer.com/'});
blogUrls.push({'name':'慕课网','url':'https://www.imooc.com/article'});
blogUrls.push({'name':'36kr-Next','url':'http://next.36kr.com/posts'});
blogUrls.push({'name':'伯乐在线','url':'http://android.jobbole.com/'});
blogUrls.push({'name':'trinea','url':'http://www.trinea.cn/'});
blogUrls.push({'name':'张明云','url':'http://zmywly8866.github.io/'});
blogUrls.push({'name':'张涛-kymjs','url':'https://www.kymjs.com/'});
blogUrls.push({'name':'开发者酷站','url':'https://www.diycode.cc/sites'});
blogUrls.push({'name':'23code','url':'http://www.23code.com/'});
blogUrls.push({'name':'最代码','url':'http://www.zuidaima.com/'});
blogUrls.push({'name':'一起开源网','url':'http://www.17ky.net/'});
blogUrls.push({'name':'ctolib码库','url':'https://www.ctolib.com/'});
blogUrls.push({'name':'完整开源项目mobdevgroup','url':'http://mobdevgroup.com/platform/android/project'});
blogUrls.push({'name':'JavaApk','url':'http://www.javaapk.com/'});
blogUrls.push({'name':'Java1234','url':'http://wwww.java1234.com'});
blogUrls.push({'name':'6maa','url':'http://www.6maa.com/'});
blogUrls.push({'name':'NetGather','url':'https://github.com/wangli0/NetGather'});
blogUrls.push({'name':'玩Android','url':'http://www.wanandroid.com/'});


document.addEventListener('DOMContentLoaded', function(){
	initCustomPanel();
});	

function injectJs(jsPath){
	var scriptElement = document.createElement('script');
	scriptElement.setAttribute('type', 'text/javascript');
	scriptElement.src = chrome.extension.getURL(jsPath);
	document.body.appendChild(scriptElement);	
}

function injectCss(cssPath){
	var cssElement = document.createElement('link');
	cssElement.setAttribute('rel', 'stylesheet');
	cssElement.setAttribute('type', 'text/css');
	cssElement.setAttribute('href', chrome.extension.getURL(cssPath));
	document.head.appendChild(cssElement);		
}

function initCustomPanel(){

	if (typeof jQuery == 'undefined') { 
		console.log("jQuery 未加载");
		var jsPath = "js/jquery.min.js";
		injectJs(jsPath);
	} else { 
		console.log("jQuery 已加载");
	} 

	var cssPath = "css/inject.css";
	injectCss(cssPath);

	changeJUI();
}


function changeJUI(){
	
	var buffer = `
		<div class="lwe_container lwmt30"><!-- 内容主体 -->
        		<div>
	            <h4><span>推荐网址大全</span></h4>
	            <ul class="lwlist_article lwlistArticle">
	`;
	for(var i = 0;i < blogUrls.length;i++){
		buffer +=`
				<li>
                    <div>
                        <div class="lwinfo_art">
                            <p><a style='color:blue;' href="${blogUrls[i].url}" target="_blank">${blogUrls[i].name}</a></p>
                            <span> ${blogUrls[i].url}</span>
                        </div>
                    </div>
		         </li>
		`;
	}
	buffer += `</ul></div></div>`;

	$("[class='container index']").html(buffer);
}
