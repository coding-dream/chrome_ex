function uniqueArray(array){
	var tempArray = [];
	var results = [];
	for(var i = 0;i < array.length; i++){
		tempArray[array[i]] = null;
	}
	for(var key in tempArray){
		results.push(key);
	}
	return results;
}

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
