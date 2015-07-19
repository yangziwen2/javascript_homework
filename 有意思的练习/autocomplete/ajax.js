function ajax(requestParam){
	if(!requestParam){
		return;
	}
	var url = requestParam.url;
	if(!url){
		return;
	}
	var method = requestParam.method || 'get',
		data = requestParam.data || {},
		charset = requestParam.charset || 'utf-8',
		successCallback = requestParam.success || null,
		failureCallback = requestParam.failure || null;
	if((method = method.toLowerCase()) == 'get'){
		var paramArr = [];
		for(var key in data){
			//记得这里要转两次
			var value = encodeURIComponent(data[key]);
			value = encodeURIComponent(value);
			paramArr.push(key + '=' + value);
		}
		if(paramArr.length>0){
			url += (url.indexOf('?')<0?'?':'&') + paramArr.join('&');
 		}
 		data = null;
	}
	var xhr = window.XMLHttpRequest? 
		new XMLHttpRequest() : 
		new ActiveXObject('Microsoft.XMLHttp');
	xhr.onreadystatechange = function(){
		if(xhr.readyState != 4){
			return;
		}
		if(xhr.status == 200 || xhr.status == 304){
			if(typeof successCallback == 'function'){
				successCallback(xhr.responseText);
			}
		}else{
			if(typeof failureCallback == 'function'){
				failureCallback(xhr.status);
			}
		}
	}
	xhr.open(method, url, true);
	xhr.setRequestHeader('Content-Type', 'text/html;charset=' + charset);
	xhr.send(data);
}
function ajaxGet(url, data, success, failure){
	if(typeof data == 'function'){
		failure = success;
		success = data;
	}
	ajax({
		url: url,
		data: data,
		success: success,
		failure: failure,
		method: 'get'
	});
}

function ajaxPost(url, data, success, failure){
	ajax({
		url: url,
		data: data,
		success: success,
		failure: failure,
		method: 'post'
	});
}