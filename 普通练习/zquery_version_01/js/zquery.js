function ZQuery(zArg){
	this.aElementArr = [];
	switch(typeof zArg){
		case 'string':
			switch(zArg.charAt(0)){
				case '#':
					this.aElementArr.push(document.getElementById(zArg.substring(1)));
					break;
				case '.':
					this.aElementArr = getByClass(document, zArg.substring(1));
					break;
				default:
					this.aElementArr = document.getElementsByTagName(zArg);
					break;
			}
			break;
		case 'object':
			this.aElementArr.push(zArg);
			break;
		case 'function':
			addEvent(window, 'load', zArg);
			break;
	}
	for(var i=0; i<this.aElementArr.length; i++){
		this.aElementArr[i].index = i;
	}
}

ZQuery.prototype.size = function(){
	return this.aElementArr.length;
}

ZQuery.prototype.get = function(index){
	return this.aElementArr.length>index && index >=0? this.aElementArr[index]: null;
}

ZQuery.prototype.click = function(fn){
	for(var i=0; i<this.aElementArr.length; i++){
		addEvent(this.aElementArr[i], 'click', fn);
	}
	return this;
}

ZQuery.prototype.show = function(){
	for(var i=0; i<this.aElementArr.length; i++){
		aElementArr[i].style.display = 'block';
	}
	return this;
}

ZQuery.prototype.hide = function(){
	for(var i=0; i<this.aElementArr.length; i++){
		aElementArr[i].style.display = 'hidden';
	}
	return this;
}

ZQuery.prototype.toggle = function(){
	var fns = arguments;
	for(var i=0; i<this.aElementArr.length; i++){
		addToggle(this.aElementArr[i]);
	}
	function addToggle(obj){
		var count = 0;
		addEvent(obj, 'click', function(){
			fns[count++%fns.length].call(this);
		});
	}
	return this;
}

ZQuery.prototype.hover = function(fnIn, fnOut){
	for(var i=0; i<this.aElementArr.length; i++){
		addEvent(this.aElementArr[i], 'mouseover', fnIn);
		addEvent(this.aElementArr[i], 'mouseout', fnOut);
	}
	return this;
}

function addEvent(obj, sEvent, fn){
	if(obj.attachEvent){
		obj.attachEvent('on'+sEvent, function(){
			fn.call(obj);
		});
	}else{
		obj.addEventListener(sEvent, fn, false);
	}
	return this;
}

ZQuery.prototype.each = function(fn){
	for(var i=0; i<this.aElementArr.length; i++){
		if(false == fn.call(this.aElementArr[i])){
			break;
		}
	}
	return this;
}

ZQuery.prototype.css = function(attr, value){
	if(arguments.length == 2){
		for(var i=0; i<this.aElementArr.length; i++){
			if(attr == 'opacity'){
				this.aElementArr[i].style.opacity = value/100;
				this.aElementArr[i].style.filter = 'alpha(opacity:'+ value +')';
			}else{
				this.aElementArr[i].style[attr] = value;
			}
		}
		return this;
	}else if(arguments.length == 1){
		if(typeof attr == 'string'){
			return getStyle(this.aElementArr[0], attr);
		}else if (typeof attr == 'object'){
			var attrs = attr;
			for(var key in attrs){
				this.css(key, attrs[key]);
			}
			return this;
		}
	}
}

ZQuery.prototype.startMove = function(json, timeSpan, fn){
	var $this = this;
	if(!this.timers){
		this.timers = [];
	}
	if(!this.fns){
		this.fns = [];
	}
	if(!this.jsons){
		this.jsons = [];
	}
	if(!this.timeSpans){
		this.timeSpans = [];
	}
	this.jsons.push(json);
	this.fns.push(fn);
	this.timeSpans.push(timeSpan? timeSpan: 30);
	if(this.timeSpans.length>1){
		return this;
	}
	this.timer = setInterval(function(){
		for(var i=0; i<$this.aElementArr.length; i++){
			$this.doMove($this.aElementArr[i]);	
		}
	}, $this.timeSpans[0]);
	return this;
}

ZQuery.prototype.doMove = function(obj){
	var iCur = 0;
	var unfinishedCount = 0;
	for(var attr in this.jsons[0]){
		if(attr == 'opacity'){
			iCur = parseInt(parseFloat(getStyle(obj, attr))*100);
		}else{
			iCur = parseInt(getStyle(obj, attr));
		}
		var iSpeed = (this.jsons[0][attr]-iCur)/20;
		iSpeed = iSpeed>0? Math.ceil(iSpeed): Math.floor(iSpeed);
		if(iCur != this.jsons[0][attr]){
			unfinishedCount++;
			iCur += iSpeed;
			if(attr == 'opacity'){
				obj.style.filter = 'alpha(opacity:'+ iCur +')';
				obj.style.opacity = iCur/100;
			}else{
				obj.style[attr] = iCur + 'px';
			}
		}
	}
	if(unfinishedCount == 0){
		if(this.fns[0]){
			this.fns[0]();
		}
		if(obj.index == this.aElementArr.length-1){
			this.jsons.shift();
			this.fns.shift();
			this.timeSpans.shift();
		}
		clearInterval(this.timer);
		if(this.timeSpans.length>0){
			var $this = this;
			this.timer = setInterval(function(){
				for(var i=0; i<$this.aElementArr.length; i++){
					$this.doMove($this.aElementArr[i]);	
				}
			}, $this.timeSpans[0]);
		}
	}
}

function getByClass(obj, className){
	var aEle = obj.getElementsByTagName('*');
	var result = [];
	for(var i=0; i<aEle.length; i++){
		if(aEle[i].className == className){
			result.push(aEle[i]);
		}
	}
	return result;
}

function getStyle(obj, attr){
	return obj.currentStyle? obj.currentStyle[attr]: getComputedStyle(obj, false)[attr];
}

function $(zArg){
	return new ZQuery(zArg)
}