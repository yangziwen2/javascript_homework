;(function(currentWindow){
	currentWindow.popupBox = {};
	currentWindow.popupBox.initBox = function(boxParam){
		boxParam = boxParam || {};
		var myfancyboxDiv = initMyfancyboxDiv(boxParam);
	}
	currentWindow.popupBox.initBoxOpener = function(openerId){
		if(openerId && typeof openerId == 'string'){
			initBoxOpener(openerId);
		}
	}

	function initMyfancyboxDiv(boxParam){
		boxParam = boxParam || {};
		//外边框
		var oMyfancyboxDiv = document.createElement('div');
		oMyfancyboxDiv.id = 'myfancybox';
		oMyfancyboxDiv.style.display = 'none';
		oMyfancyboxDiv.style.position = 'absolute';
		oMyfancyboxDiv.currentWidth = (boxParam.width || 400);
		oMyfancyboxDiv.currentHeight = boxParam.height || 300;
		oMyfancyboxDiv.style.width = oMyfancyboxDiv.currentWidth + 'px';
		oMyfancyboxDiv.style.height = oMyfancyboxDiv.currentHeight + 'px';
		oMyfancyboxDiv.style.zIndex = '99999999';
		if(typeof boxParam.backgroundColor == 'string'){
			oMyfancyboxDiv.style.backgroundColor = boxParam.backgroundColor;
		}
		//内容框
		var oMyfancyboxContentDiv = document.createElement('div');
		oMyfancyboxContentDiv.id = 'myfancyboxCcontent';
		oMyfancyboxContentDiv.style.position = 'relative';
		oMyfancyboxDiv.appendChild(oMyfancyboxContentDiv);
		//关闭按钮
		var oCloseDiv = document.createElement('div');
		oCloseDiv.className = 'popCloseDiv';
		oCloseDiv.id = 'popCloseDiv';
		oCloseDiv.style.width = '30px';
		oCloseDiv.style.height = '30px';
		oCloseDiv.style.position = 'absolute';
		oCloseDiv.style.top = '-15px';
		oCloseDiv.style.right = '-15px';
		oCloseDiv.style.cursor = 'pointer';
		oMyfancyboxDiv.appendChild(oCloseDiv);
		var appVersion = parseFloat(navigator.appVersion.split('MSIE')[1]);
		if(isNaN(appVersion) || !Math.abs(appVersion - 6) < 0.01){
			oCloseDiv.innerHTML = '<img src="./images/fancy_close.png"/>';
		}
		if(boxParam.innerContent){
			if(typeof boxParam.innerContent == 'object'){
				oMyfancyboxContentDiv.appendChild(boxParam.innerContent);
			}else if (typeof boxParam.innerContent == 'string'){
				oMyfancyboxContentDiv.innerHTML = boxParam.innerContent;
			}
		}
		document.body.appendChild(oMyfancyboxDiv);
		return oMyfancyboxDiv;
	}

	function initBoxOpener(openerId){
		if(!openerId || typeof openerId != 'string'){
			return;
		}
		var oMyfancyboxDiv = document.getElementById('myfancybox');
		var oCloseDiv = document.getElementById('popCloseDiv');
		var oBoxOpener = document.getElementById(openerId);
		oBoxOpener.onclick = function(ev){
			var oEvent = ev || event;
			oEvent.cancelBubble = true;
			dispMyfancybox(oMyfancyboxDiv);
			oMyfancyboxDiv.onclick = function(ev){
				var oEvent = ev || event;
				oEvent.cancelBubble = true;
			}
			window.onresize = window.onscroll = function(){
				oPageVeil = document.getElementById('pageVeil');
				oPageVeil.style.height =( (document.documentElement.clientHeight>document.body.offsetHeight)?document.documentElement.clientHeight :document.body.offsetHeight ) + 'px';
				oMyfancyboxDiv.params = {
					iTimeSpan: 30
				};
				oMyfancyboxDiv.attrs = {
					top: {
						speedType: 'buffered',
						iTargetValue:getITargetY(oMyfancyboxDiv)
					},
					left: {
						speedType: 'buffered',
						iTargetValue: getITargetX(oMyfancyboxDiv)
					}
				};
				startMove(oMyfancyboxDiv, 10, window.onresize);
			}
			oCloseDiv.onclick = document.onclick = function(){
				document.onclick = window.onresize = window.onscroll = null;
				hideMyfancybox(oMyfancyboxDiv);
			}
		}
		return oBoxOpener;
	}

	function dimPage(){
		var pageVeil = document.getElementById('pageVeil');
		if(!pageVeil){
			pageVeil = initPageVeil();
		}
		pageVeil.style.display = 'block';
	}

	function lightupPage(){
		var pageVeil = document.getElementById('pageVeil');
		if(pageVeil){
			pageVeil.style.display = 'none';
		}
	}

	function initPageVeil(){
		var pageVeil = document.createElement('div');
		pageVeil.id = 'pageVeil';
		pageVeil.style.height =( (document.documentElement.clientHeight>document.body.offsetHeight)?document.documentElement.clientHeight :document.body.offsetHeight ) + 'px';
		pageVeil.style.width = '100%';
		pageVeil.style.zIndex = '999999';
		pageVeil.style.position = 'absolute'
		pageVeil.style.top = '0px';
		pageVeil.style.left = '0px';
		pageVeil.style.backgroundColor = '#666';
		setStyle(pageVeil, 'opacity', 50);
		document.body.appendChild(pageVeil);
		return pageVeil;
	}

	function dispMyfancybox(oMyfancyboxDiv){
		//dimPage();
		oMyfancyboxDiv.style.left = getITargetX(oMyfancyboxDiv) + 'px'
		oMyfancyboxDiv.style.top = getITargetY(oMyfancyboxDiv) + 'px';
		setStyle(oMyfancyboxDiv, 'opacity', 0);
		oMyfancyboxDiv.style.display = 'block';
		oMyfancyboxDiv.params = {
			iTimeSpan: 30
		};
		oMyfancyboxDiv.attrs = {
			opacity: {
				speedType: 'buffered',
				iTargetValue:100
			}
		};
		startMove(oMyfancyboxDiv, 20);
	}
	
	function hideMyfancybox(oMyfancyboxDiv){
		oMyfancyboxDiv.params = {
			iTimeSpan: 30
		};
		oMyfancyboxDiv.attrs = {
			opacity: {
				speedType: 'buffered',
				iTargetValue:0
			}
		};
		startMove(oMyfancyboxDiv, 20, function(){
			oMyfancyboxDiv.style.display = 'none';
			//lightupPage();
		});
	}

	function getITargetX(oMyfancyboxDiv){
		return Math.round((document.documentElement.clientWidth - oMyfancyboxDiv.currentWidth)/2);
	}

	function getITargetY(oMyfancyboxDiv){
		var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
		return scrollTop + Math.ceil((document.documentElement.clientHeight - oMyfancyboxDiv.currentHeight)/2);
	}

	/////////move///////////

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

	function getSpeedByType(speedType, attr){
		return getBufferedSpeed(attr);
	}

	function getBufferedSpeed(attr){
		var iSpeed = (attr.iTargetValue - attr.iCurrentValue) / attr.iTimeSpan;
		return iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
	}

	function setStyle(obj, attr, value){
		if('opacity' == attr){
			obj.style.filter = 'alpha(opacity:' + value + ')';
			obj.style.opacity = value / 100;
		}else{
			obj.style[attr] = value + 'px';	
		}
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
	
})(window);