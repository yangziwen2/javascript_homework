function setStyleInt(obj, attr, value){
	obj.style[attr] = value + 'px';
}

function getStyleInt(obj, attr){
	return parseInt(getStyle(obj, attr));
}

function getStyle(obj, attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}else{
		return getComputedStyle(obj, false)[attr];
	}
}

function getElementsByClassName(obj, className){
	if(obj.getElementsByClassName){
		return obj.getElementsByClassName(className);
	}
	var resultArr = [];
	var eles = obj.getElementsByTagName('*');
	for(var i=0; i<eles.length; i++){
		var classArr = eles[i].className.split(' ');
		for(var j=0; j<classArr.length; j++){
			if(classArr[j] == className){
				resultArr.push(eles[i]);
				break;
			}
		}
	}
	return resultArr;
}
