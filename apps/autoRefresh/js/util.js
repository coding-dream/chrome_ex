function getDomain(url) {
    var a = document.createElement('a');
    a.href = url;
	
	var domain = a.hostname.replace('www.', '');
	
    return domain;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateLastRefresh(options, interval) {
	// Record last-refresh time and save options.
	var now = new Date();
	var next = new Date(now.getTime() + interval * 1000);

	options.lastRefresh = formatDate(now, 'M/d/yyyy h:mm:ss a');
	options.nextRefresh = formatDate(next, 'M/d/yyyy h:mm:ss a');
	
	return options;
}


function isChromeUrl(url) {
	if (url.indexOf("chrome:") > -1) {
		return true;
	}
	else {
		return false;
	}
}
