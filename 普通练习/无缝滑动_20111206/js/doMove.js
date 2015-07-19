function doMove(obj, paramObj, fn, configs){
	configs || (configs = {});
	configs.speed = configs.speed || 10;	
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		var isFinished = true;
		for(var attr in paramObj){
			//////
			var iTarget = paramObj[attr];
			var iCurrent = getStyleInt(obj, attr);
			var iSign = iTarget > iCurrent?1: -1;
			var iSpeed = configs.speed;
			var iNew = iCurrent + iSpeed*iSign;
			
			if(Math.abs(iNew - iTarget) < iSpeed){
				iNew = iTarget;
			///
			}else{
				isFinished = false;	//循环的任意一个属性没有到达目标值，isFinished都会被修改成false
			}
			setStyleInt(obj, attr, iNew);//iNew/100;
		}
		if(isFinished){
			clearInterval(obj.timer);
			if(typeof fn == 'function'){
				fn();
			}
		}
	}, 30);	
}

function setStyleInt(obj, attr, value){	//对透明度做了额外的处理
	if(attr == 'opacity'){
		obj.style.opacity = value/100;
		obj.style.filter = 'alpha(opacity:' + Math.round(value) + ')';
	}else{
		obj.style[attr] = value + 'px';	
	}
}

function getStyleInt(obj, attr){	
	return parseInt(getStyle(obj, attr));
}

function getStyle(obj, attr){	//对透明度做了额外的处理
	var result = '';
	if(obj.currentStyle) {
		result = obj.currentStyle[attr];	
	}else{
		result = getComputedStyle(obj, false)[attr];
	}
	if(attr == 'opacity'){
		result *= 100;
		result = Math.round(result);
	}
	return result;
}