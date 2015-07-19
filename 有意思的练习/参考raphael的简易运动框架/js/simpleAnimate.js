animationElements = [];
var EasingFormulas = {
	linear: function (n) {
		return n;
	},
	"<": function (n) {		//s1 + (s2 - s1)*(t/T)^3
		return Math.pow(n, 3);
	},
	">": function (n) {		//s1 + (s2 - s1)*(1 - (t/T)^3)
		return Math.pow(n - 1, 3) + 1;
	},
	"<>": function (n) {	//分段函数的两段关于(0.5, 0.5)对称
		n = n * 2;
		if (n < 1) {
			return Math.pow(n, 3) / 2;
		}
		n -= 2;
		return (Math.pow(n, 3) + 2) / 2;
	},
	backIn: function (n) {
		var s = 1.70158;
		return n * n * ((s + 1) * n - s);
	},
	backOut: function (n) {
		n = n - 1;
		var s = 1.70158;
		return n * n * ((s + 1) * n + s) + 1;
	},
	elastic: function (n) {		//一个衰减曲线乘一个正弦震动
		if (n == 0 || n == 1) {
			return n;
		}
		var p = .3,
			s = p / 4;
		return Math.pow(2, -10 * n) * Math.sin((n - s) * (2 * Math.PI) / p) + 1;
	},
	bounce: function (n) {		//任何情况下都只反弹3次
		var s = 7.5625,
			p = 2.75,
			l;
		if (n < (1 / p)) {
			l = s * n * n;
		} else {
			if (n < (2 / p)) {
				n -= (1.5 / p);
				l = s * n * n + .75;
			} else {
				if (n < (2.5 / p)) {
					n -= (2.25 / p);
					l = s * n * n + .9375;
				} else {
					n -= (2.625 / p);
					l = s * n * n + .984375;
				}
			}
		}
		return l;
	}
};
function animate(element, params, ms, easing, callback, callbackDelay){
	if(!element){
		return;	
	}
	easing = easing || 'linear';
	var from = {},
		to = {},
		diff = {};
	for(var attr in params){
		from[attr] = getAttr(element, attr);
		to[attr] = params[attr];
		diff[attr] = (to[attr] - from[attr]) / ms;
	}
	var easingFormula = typeof easing == 'string'? EasingFormulas[easing]: easing;
	if(!easingFormula){
		var curve = String(easing).match(/^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/);
		if(curve && curve.length == 5){
			easingFormula = function (t) {
				return CubicBezierAtTime(t, +curve[1], +curve[2], +curve[3], +curve[4], ms);
			}	
		}
	}
	if(!easingFormula){
		return;	
	}
	animationElements.push({
		start: params.start || +new Date(),
		ms: ms,
		ef: easingFormula,
		from: from,
		diff: diff,
		to: to,
		el: element,
		t: {x: 0, y: 0}
	});
	isNaN(parseInt(callbackDelay)) && (callbackDelay = 10);		//默认10ms的延迟
	typeof callback == 'function' && setTimeout(function(){
		callback.call(element);
	}, ms + callbackDelay);
	animationElements.length == 1 && setTimeout(animation);
}
function animation(){
	var Now = +new Date();
	for(var i = 0; i < animationElements.length; i++){
		var e = animationElements[i];
		if(e.stop){
			continue;	
		}
		var time = Now - e.start,
			ms = e.ms,
			ef = e.ef,
			from = e.from,
			diff = e.diff,
			to = e.to,
			t = e.t,
			el = e.el,
			set = {},
			now;
		if(time < ms){
			var pos = ef(time/ms);
			for(var attr in from){
				now = +from[attr] + pos * ms * diff[attr];
				set[attr] = now;
			}
			setAttr(el, set);
		}else{
			setAttr(el, to);
			animationElements.splice(i--, 1);
		}
	}
	animationElements.length && setTimeout(animation);
}
function getAttr(element, attr){
	if(!element || !element.style){
		return NaN;	
	}
	if(attr == 'opacity'){
		return getOpacityInt(element);	
	}else if(attr == 'r' || attr == 'theta'){
		var result = parseInt(element[attr]);
		return isNaN(result)? 0: result;
	}else{
		return getStyleInt(element, attr);	
	}
	function getOpacityInt(element){
		var opacityStr = getStyle(element, 'opacity');
		var opacityFloat = parseFloat(opacityStr) * 100;
		if(!isNaN(opacityFloat)){
			return parseInt(opacityFloat);	
		}
		var filterStr = getStyle(element, 'filter');
		filterStr.replace('alpha(opacity:', '');
		var opacityInt = parseInt(filterStr);
		if(!isNaN(opacityInt)){
			return opacityInt;	
		}
		return 100;
	}
	function getStyleInt(element, attr){
		var styleStr = getStyle(element, attr);
		if(styleStr == 'auto'){
			return 0;	
		}
		return parseInt(styleStr);
	}
	function getStyle(element, attr){
		if(element.currentStyle){
			return element.currentStyle[attr];	
		}else{
			return getComputedStyle(element, false)[attr];	
		}
	}
}
function setAttr(element, params){
	if(!element || !element.style){
		return;	
	}
	for(var attr in params){
		if(attr == 'opacity'){
			setOpacityInt(element, params[attr]);
		}else if (attr == 'r' || attr == 'theta'){
			setPolarInt(element, attr, params[attr]);
		}else if (attr == 'center'){
			setCenter(element, params[attr]);
		}else{
			setStyleInt(element, attr, parseInt(params[attr]));
		}
	}
	/*当对polar进行设置时，将会执行relocatePolar
	 *这个的优先级高于对left和top的修改
	 *注意center也会对位置产生影响*/
	(!isNaN(params.r) || !isNaN(params.theta)) && relocatePolar(element);
	function setStyleInt(element, attr, intValue){
		if(isNaN(intValue)){
			return;	
		}
		element.style[attr] = intValue + 'px';
	}
	function setOpacityInt(element, opacity){
		if(isNaN(opacity)){
			return;
		}
		element.style.opacity = (opacity/100).toFixed(2);
		element.style.filter = 'alpha(opacity:' + parseInt(opacity) + ')';
	}
	function setCenter(element, center){
		!element.center && (element.center = {x:0, y:0});
		var x = parseInt(center.x);
		var y = parseInt(center.y);
		!isNaN(x) && (element.center.x = x);
		!isNaN(y) && (element.center.y = y);
	}
	function setPolarInt(element, attr, intValue){
		element[attr] = intValue;
	}
}
function relocatePolar(element, polarParams){
		for(var attr in polarParams || {}){
			element[attr] = polarParams[attr];	
		}
		var halfWidth = (element.offsetWidth || getAttr(element, 'width'))/2;
		var halfHeight = (element.offsetHeight || getAttr(element, 'height'))/2;
		if(!element.center){
			element.center = {};
			element.center.x = (getAttr(element, 'left') + halfWidth);
			element.center.y = (getAttr(element, 'top') + halfHeight);
		}
		var r = element.r || 0,
			theta = element.theta || 0,
			cx = element.center.x,
			cy = element.center.y;
		var x = parseInt(cx + r*Math.cos(theta/180*Math.PI) - halfWidth);
		var y = parseInt(cy + r*Math.sin(theta/180*Math.PI) - halfHeight);
		setStyleInt(element, 'left', x);
		setStyleInt(element, 'top', y);
		function setStyleInt(element, attr, intValue){
			if(isNaN(intValue)){
				return;	
			}
			element.style[attr] = intValue + 'px';
		}
}