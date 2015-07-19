;(function(currentWindow){
	var magnifierParams = {
		magnifierSize: {
			smaller: 75,
			small: 100,
			middle: 125,
			large: 150,
			larger:175
		},
		sizeKeyArr: ['smaller', 'small', 'middle', 'large', 'larger'],
		magnifyRatio: {
			smaller: 1.5,
			small: 1.75,
			middle: 2,
			large: 2.5,
			larger: 3
		},
		ratioKeyArr: ['smaller', 'small', 'middle', 'large', 'larger']
	}
	var magnifier = currentWindow.magnifier = {};
	magnifier.init = function(selector){
		var obj = $(selector);
		if(!obj){
			return;
		}
		var objArr = [];
		if(obj.length){
			objArr = obj;
		}else{
			objArr.push(obj);
		}
		for(var i=0; i<objArr.length; i++){
			initImgMagnifier(objArr[i]);
		}
	}
	
	function initImgMagnifier(oImgDiv){
		setStyle(oImgDiv, 'position', 'relative');
		var oImgs = $('img', oImgDiv);
		if(!oImgs.length){
			return;	
		}
		var oImg = oImgs[0];
		oImgDiv.img = oImg;
		setStyle(oImg, 'position', 'absolute');
		setStyleIntValue(oImgDiv, 'width', oImg.offsetWidth);
		setStyleIntValue(oImgDiv, 'height', oImg.offsetHeight);
		initMagnifierDiv(oImgDiv);
		initOperPannelDiv(oImgDiv);
		oImgDiv.onmouseover = function(ev){
			var oEvent = ev || event;
			setStyle(oImgDiv.magnifierDiv, 'display', 'block');
			setStyle(oImgDiv.magnifierDiv, 'cursor', 'crosshair');
			locatePosition(oImgDiv, oEvent);
			locateMagnifiedImgPosition(oImgDiv, oEvent);
			oImgDiv.onmousemove = function(ev){
				var oEvent = ev || event;
				locatePosition(oImgDiv, oEvent);
				locateMagnifiedImgPosition(oImgDiv, oEvent);
			}
			oImgDiv.onmouseout = function(){
				oImgDiv.onmousemove = oImgDiv.onmouseout = null;
				setStyle(oImgDiv.magnifierDiv, 'display', 'none');
			}
		}
	}
	
	function locatePosition(oImgDiv, oEvent){
		var oMagnifierDiv = oImgDiv.magnifierDiv;
		var sizeKeyIndex = oMagnifierDiv.sizeKeyIndex;
		var sizeKeyArr = magnifierParams.sizeKeyArr;
		var imgRelativePos = getDisRelToImg(oImgDiv.img, {x: oEvent.clientX, y: oEvent.clientY});
		var xPos = imgRelativePos.x -getStyleIntValue(oMagnifierDiv, 'width')/2;
		var yPos = imgRelativePos.y - getStyleIntValue(oMagnifierDiv, 'height')/2;
		xPos = constrictPosition(xPos, 0, getStyleIntValue(oImgDiv, 'width') - oMagnifierDiv.offsetWidth);
		yPos = constrictPosition(yPos, 0, getStyleIntValue(oImgDiv, 'height') - oMagnifierDiv.offsetHeight);
		setStyleIntValue(oMagnifierDiv, 'left', xPos);
		setStyleIntValue(oMagnifierDiv, 'top', yPos);
	}
	
	function getDisRelToImg(oImg, point){
		var imgPos = getAbsolutePosition(oImg);
		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
		var xPos = scrollLeft + point.x - imgPos.x;
		var yPos = scrollTop + point.y - imgPos.y;
		return {x: xPos, y: yPos};
	}
	
	function constrictPosition(pos, minLimit, maxLimit){
		pos = Math.max(pos, minLimit);
		return Math.min(pos, maxLimit);
	}
	
	function initMagnifierDiv(oImgDiv){
		var oMagnifierDiv = document.createElement('div');
		setStyle(oMagnifierDiv, 'position', 'absolute');
		setStyle(oMagnifierDiv, 'display', 'none');
		oMagnifierDiv.sizeKeyIndex = 1;
		oMagnifierDiv.ratioKeyIndex = 1;
		resizeMagnifierDiv(oMagnifierDiv);
		setStyleIntValue(oMagnifierDiv, 'borderWidth', 2);
		setStyle(oMagnifierDiv, 'borderStyle', 'solid');
		setStyle(oMagnifierDiv, 'borderColor', '#333');
		setStyle(oMagnifierDiv, 'overflow', 'hidden');
		var oMagnifiedImg = document.createElement('img');
		setStyle(oMagnifiedImg, 'position', 'absolute');
		oMagnifiedImg.src = oImgDiv.img.src;
		oMagnifierDiv.img = oMagnifiedImg;
		oMagnifierDiv.appendChild(oMagnifiedImg);
		oImgDiv.appendChild(oMagnifierDiv);
		oImgDiv.magnifierDiv = oMagnifierDiv;
		processMagnifiedImg(oImgDiv);
	}
	
	function processMagnifiedImg(oImgDiv){
		var oMagnifierDiv = oImgDiv.magnifierDiv;
		oMagnifiedImg = oMagnifierDiv.img;
		var ratioKey = magnifierParams.ratioKeyArr[oMagnifierDiv.ratioKeyIndex];
		var ratioValue = magnifierParams.magnifyRatio[ratioKey];
		var imgWidth = Math.round(getStyleIntValue(oImgDiv, 'width')*ratioValue);
		var imgHeight = Math.round(getStyleIntValue(oImgDiv, 'height')*ratioValue);
		setStyleIntValue(oMagnifiedImg, 'width', imgWidth);
		setStyleIntValue(oMagnifiedImg, 'height', imgHeight);
	}
	
	function initOperPannelDiv(oImgDiv, oMagnifierDiv){
		var oOperPannelDiv = document.createElement('div');
		setStyle(oOperPannelDiv, 'position', 'absolute');
		setStyle(oOperPannelDiv, 'display', 'none');
		oImgDiv.appendChild(oOperPannelDiv);
		oImgDiv.operPannelDiv = oOperPannelDiv;
		setStyleIntValue(oOperPannelDiv, 'height', 36);
		setStyleIntValue(oOperPannelDiv, 'width', 144);
		oImgDiv.zoomInBtn = initZoomInBtn(oImgDiv);
		oImgDiv.zoomOutBtn = initZoomOutBtn(oImgDiv);
		oImgDiv.expandBtn = initExpandBtn(oImgDiv);
		oImgDiv.contractBtn = initContractBtn(oImgDiv);
		setStyleIntValue(oOperPannelDiv, 'left', getStyleIntValue(oImgDiv, 'width') - getStyleIntValue(oOperPannelDiv, 'width'));
		setStyleIntValue(oOperPannelDiv, 'top', -getStyleIntValue(oOperPannelDiv, 'height'));
		setStyle(oOperPannelDiv, 'display', 'block');
	}
	
	function resizeMagnifierDiv(oMagnifierDiv){
		var sizeKeyIndex = Math.max(oMagnifierDiv.sizeKeyIndex, 0);
		sizeKeyIndex = Math.min(magnifierParams.sizeKeyArr.length-1, sizeKeyIndex);
		var sizeKey = magnifierParams.sizeKeyArr[sizeKeyIndex];
		setStyleIntValue(oMagnifierDiv, 'width', magnifierParams.magnifierSize[sizeKey]);
		setStyleIntValue(oMagnifierDiv, 'height', magnifierParams.magnifierSize[sizeKey]);
	}
	
	function initZoomInBtn(oImgDiv){
		var oOperPannelDiv = oImgDiv.operPannelDiv;
		var oMagnifierDiv = oImgDiv.magnifierDiv;
		var oZoomInBtn = document.createElement('div');
		initBtnAppearance(oZoomInBtn, './images/01.jpg');
		oZoomInBtn.img.title = '放大';
		oOperPannelDiv.appendChild(oZoomInBtn);
		oZoomInBtn.onclick = function(ev){
			var oEvent = ev || event;
			if(oMagnifierDiv.ratioKeyIndex < magnifierParams.ratioKeyArr.length-1){
				oMagnifierDiv.ratioKeyIndex ++;
			}
			processMagnifiedImg(oImgDiv);
			locateMagnifiedImgPosition(oImgDiv, oEvent);
		}
		return oZoomInBtn;
	}
	
	function initZoomOutBtn(oImgDiv){
		var oOperPannelDiv = oImgDiv.operPannelDiv;
		var oMagnifierDiv = oImgDiv.magnifierDiv;
		var oZoomOutBtn = document.createElement('div');
		initBtnAppearance(oZoomOutBtn, './images/02.jpg');
		oZoomOutBtn.img.title = '缩小';
		oOperPannelDiv.appendChild(oZoomOutBtn);
		oZoomOutBtn.onclick = function(ev){
			var oEvent = ev || event;
			if(oMagnifierDiv.ratioKeyIndex>0){
				oMagnifierDiv.ratioKeyIndex--;
			}
			processMagnifiedImg(oImgDiv);
			locateMagnifiedImgPosition(oImgDiv, oEvent);
		}
		return oZoomOutBtn;
	}
	
	function initExpandBtn(oImgDiv){
		var oOperPannelDiv = oImgDiv.operPannelDiv;
		var oMagnifierDiv = oImgDiv.magnifierDiv;
		var oExpandBtn = document.createElement('div');
		initBtnAppearance(oExpandBtn, './images/03.jpg');
		oExpandBtn.img.title = '扩展视野';
		oOperPannelDiv.appendChild(oExpandBtn);
		oExpandBtn.onclick = function(ev){
			var oEvent = ev || event;
			if(oMagnifierDiv.sizeKeyIndex<magnifierParams.sizeKeyArr.length-1){
				oMagnifierDiv.sizeKeyIndex++;
			}
			resizeMagnifierDiv(oMagnifierDiv);
			locatePosition(oImgDiv, oEvent);
		}
		return oExpandBtn;
	}
	
	function initContractBtn(oImgDiv){
		var oOperPannelDiv = oImgDiv.operPannelDiv;
		var oMagnifierDiv = oImgDiv.magnifierDiv;
		var oOperPannelDiv = oImgDiv.operPannelDiv;
		var oContractBtn = document.createElement('div');
		initBtnAppearance(oContractBtn, './images/04.jpg');
		oContractBtn.img.title = '收缩视野';
		oOperPannelDiv.appendChild(oContractBtn);
		oContractBtn.onclick = function(ev){
			var oEvent = ev || event;
			if(oMagnifierDiv.sizeKeyIndex>0){
				oMagnifierDiv.sizeKeyIndex--;
			}
			resizeMagnifierDiv(oMagnifierDiv);
			locatePosition(oImgDiv, oEvent);
		}
		return oContractBtn;
	}
	
	function locateMagnifiedImgPosition(oImgDiv, oEvent){
		var oMagnifierDiv = oImgDiv.magnifierDiv;
		var relativeDis = getDisRelToImg(oImgDiv.img, {x:oEvent.clientX, y:oEvent.clientY});
		var ratioKey = magnifierParams.ratioKeyArr[oMagnifierDiv.ratioKeyIndex];
		var ratio = magnifierParams.magnifyRatio[ratioKey];
		var magnifiedImgPos = {
			x: Math.round(relativeDis.x*ratio),
			y: Math.round(relativeDis.y*ratio)
		}
		var newX = -magnifiedImgPos.x + getStyleIntValue(oMagnifierDiv, 'width')/2;
		var newY = -magnifiedImgPos.y + getStyleIntValue(oMagnifierDiv, 'height')/2;
		newX = constrictPosition(newX, -getStyleIntValue(oMagnifierDiv.img, 'width') + getStyleIntValue(oMagnifierDiv, 'width'), 0);
		newY = constrictPosition(newY, -getStyleIntValue(oMagnifierDiv.img, 'height') + getStyleIntValue(oMagnifierDiv, 'height'), 0);
		setStyleIntValue(oMagnifierDiv.img, 'left', newX);
		setStyleIntValue(oMagnifierDiv.img, 'top', newY);
	}
	
	function initBtnAppearance(oBtn, imgSrc){
		setStyle(oBtn, 'cursor','pointer');
		setStyle(oBtn, 'styleFloat', 'left');
		setStyle(oBtn, 'cssFloat', 'left');
		var oImg = document.createElement('img');
		oImg.src = imgSrc;
		oBtn.appendChild(oImg);
		oBtn.img = oImg;
		oBtn.className = 'pannelBtn';
	}
	
	//////////tools////////
	
	function getAbsolutePosition(obj){
		var left = 0;
		var top = 0;
		while(obj.offsetParent){
			left += obj.offsetLeft;
			top += obj.offsetTop;
			obj = obj.offsetParent;
		}
		return {x: left, y: top};
	}
	
	function setStyleIntValue(obj, attr, intVal, suffix){
		suffix = suffix || 'px';
		setStyle(obj, attr, intVal + suffix);
	}
	
	function setStyle(obj, attr, value){
		obj.style[attr] = value;	
	}
	
	function getStyleIntValue(obj, attr){
		return parseInt(getStyle(obj, attr));	
	}
	
	function getStyle(obj, attr){
		if(obj.currentStyle){
			return obj.currentStyle[attr];
		}else{
			return getComputedStyle(obj, false)[attr];
		}
	}
	
	function $(selector, obj){
		if(typeof selector != 'string' || !selector){
			return null;
		}
		obj = obj || document;
		if(selector.indexOf('#') == 0){
			return document.getElementById(selector.substring(1));
		}else if(selector.indexOf('.') == 0){
			var oTagObjs = obj.getElementsByTagName('*');
			var oClassObjs = [];
			for(var i=0; i<oTagObjs.length; i++){
				if(oTagObjs[i].className == selector.substring(1)){
					oClassObjs.push(oTagObjs[i]);
				}
			}
			return oClassObjs;
		}else{
			return obj.getElementsByTagName(selector);
		}
	}
})(window);