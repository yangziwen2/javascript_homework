function startMove(obj, timeInterval, fn){
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		doMove(obj, obj.timer, fn);							 
	}, timeInterval);
}

function doMove(obj, timer, fn){
	var aObjArr = null;
	if(isArray(obj)){
		aObjArr = obj;	
	}else{
		aObjArr = [];
		aObjArr.push(obj);
	}
	var isFinished = true;
	for(var i=0; i<aObjArr.length; i++){
		var currentObj = aObjArr[i];
		var attrs = currentObj.attrs;
		for(var attr in attrs){
			if(typeof attrs[attr].dependentMoveFunc == 'function'){
				attrs[attr].dependentMoveFunc(aObjArr, attr, i);
			}else{
				attrs[attr].iTimeSpan = currentObj.params.iTimeSpan;
				attrs[attr].iCurrentValue = getCurrentStyleIntValue(currentObj, attr);
				var iSpeed = getSpeedByType(attrs[attr].speedType, attrs[attr]);
				var currentStepValue = getCurrentStepValue(attrs[attr], iSpeed);
				setStyle(currentObj, attr, currentStepValue);
				attrs[attr].iSpeed = iSpeed;
				isFinished = isFinished && (Math.abs(attrs[attr].iCurrentValue - attrs[attr].iTargetValue) < 3 && Math.abs(iSpeed) < 1);
			}
		}
	}
	if(isFinished){
		clearInterval(timer);
		for(var i=0; i<aObjArr.length; i++){
			var currentObj = aObjArr[i];
			var attrs = currentObj.attrs;
			for(var attr in attrs){
				if(typeof attrs[attr].dependentMoveFunc == 'function'){
					attrs[attr].dependentMoveFunc(aObjArr, attr, i);
				}else{
					setStyle(currentObj, attr, attrs[attr].iTargetValue);
				}
			}
		}
		if(typeof fn == 'function'){
			fn();
		}
	}
}

function getCurrentStepValue(attr, iSpeed){
	return attr.isFallback? attr.iTargetValue: attr.iCurrentValue + iSpeed;
}

function setStyle(obj, attr, value){
	if('opacity' == attr){
		obj.style.filter = 'alpha(opacity:' + value + ')';
		obj.style.opacity = value / 100;
	}else{
		obj.style[attr] = value + 'px';	
	}
}

function getSpeedByType(speedType, attr){
	var iSpeed = NaN;
	if('buffered' == speedType){
		iSpeed = getBufferedSpeed(attr);
	}else if('elastic' == speedType){
		iSpeed = getElasticSpeed(attr);	
	}else if('acceleratedRebound' == speedType){
		iSpeed = getAcceleratedReboundSpeed(attr);	
	}else if('uniform' == speedType){
		iSpeed = getUniformSpeed(attr);
	}
	return iSpeed;
}

function getUniformSpeed(attr){
	var iPosFlag = (attr.iTargetValue > attr.iCurrentValue? 1:-1)
	iPosFlag = attr.iTargetValue == attr.iCurrentValue? 0: iPosFlag;
	var iSpeed =  iPosFlag * Math.abs(attr.iSpeed);
	if((attr.iTargetValue - iSpeed - attr.iCurrentValue) * iPosFlag <= 0){
		iSpeed = Math.abs(attr.iTargetValue - attr.iCurrentValue) * iPosFlag;	
	}
	return iSpeed;	
}

function getBufferedSpeed(attr){
	var iSpeed = (attr.iTargetValue - attr.iCurrentValue) / attr.iTimeSpan;
	return iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
}

function getElasticSpeed(attr){
	var iSpeed = attr.iSpeed;
	iSpeed += (attr.iTargetValue - attr.iCurrentValue) / attr.iTimeSpan;
	return iSpeed * attr.fFrictionFactor;
}

function getAcceleratedReboundSpeed(attr){
	if(typeof attr.bOriginPosFlag == 'undefined'){
		attr.bOriginPosFlag = attr.iTargetValue > attr.iCurrentValue ? 1: -1;
		attr.bOriginPosFlag = attr.iTargetValue == attr.iCurrentValue? 0: attr.bOriginPosFlag;
	}
	attr.isFallback = false;
	var iSpeed = attr.iSpeed;
	//·ÀÖ¹ËÀÑ­»·
	var calibration = iSpeed+(iSpeed + attr.iAcceleration)*attr.fReboundFactor;
	if(parseInt(parseFloat(calibration.toFixed(4))*10000) == 0){
		iSpeed *= 0.8;	
	}
	//end
	iSpeed += attr.iAcceleration;
	if(attr.bOriginPosFlag > 0){
		attr.isFallback = attr.iCurrentValue + iSpeed > attr.iTargetValue;
		iSpeed = attr.isFallback? -iSpeed*attr.fReboundFactor: iSpeed;
	}else if(attr.bOriginPosFlag < 0){
		attr.isFallback = attr.iCurrentValue + iSpeed < attr.iTargetValue;
		iSpeed = attr.isFallback? -iSpeed*attr.fReboundFactor: iSpeed;
	}else{
		iSpeed = 0;	
	}
	return iSpeed;
}

function getCurrentStyleIntValue(obj, attr){
	if('opacity' == attr){
		return parseInt(getStyleFloatValue(obj, attr)*100);
	}else{
		return getStyleIntValue(obj, attr);
	}
}

function getStyle(obj, attr){
	if(obj.currentStyle){
		if('opacity' == attr){
			var opacityDegree = obj.currentStyle.filter;
			var index = opacityDegree.indexOf('opacity:') + 'opacity'.length + 1;
			var opacityValue = parseInt(opacityDegree.substring(index));
			return isNaN(opacityValue)? 1: (opacityValue/100).toFixed(2);
		}
		return obj.currentStyle[attr];
	}else{
		return getComputedStyle(obj, false)[attr];	
	}
}

function getStyleFloatValue(obj, attr){
	var result =  parseFloat(getStyle(obj, attr));
	if(isNaN(result)){
		var offsetResult = getOffsetStyleValue(obj, attr);
		return offsetResult;
	}
	return result;
}

function getStyleIntValue(obj, attr){
	return parseInt(getStyleFloatValue(obj, attr));	
}

function getOffsetStyleValue(obj, attr){
	var offsetAttr = 'offset'+attr.substring(0,1).toUpperCase() + attr.substring(1);
	return obj[offsetAttr];
}

function isArray(obj) { 
	return Object.prototype.toString.call(obj) === '[object Array]'; 
}