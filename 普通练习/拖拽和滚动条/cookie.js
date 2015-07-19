function setCookie(name, value, expires){
	var cookieStr = name + '=' + value;
	if(expires instanceof Date){
		cookieStr += ';expires=' + expires;
	}
	document.cookie = cookieStr;
}

function getCookie(name){
	var startIndex = document.cookie.indexOf(name);
	if(startIndex < 0){
		return '';
	}
	var endIndex = document.cookie.indexOf(';', startIndex);
	if(endIndex < 0){
		endIndex = document.cookie.length;
	}
	var cookieStr = document.cookie.substring(startIndex, endIndex);
	var result = cookieStr.split('=');
	return result[1];
}
function removeCookie(name){
	var oDate = new Date();
	setCookie(name, '', oDate);
}