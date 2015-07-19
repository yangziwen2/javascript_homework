animationElements = [];
function CubicBezierAtTime(t, p1x, p1y, p2x, p2y, duration) {
	var cx = 3 * p1x,
		bx = 3 * (p2x - p1x) - cx,
		ax = 1 - cx - bx,
		cy = 3 * p1y,
		by = 3 * (p2y - p1y) - cy,
		ay = 1 - cy - by;
	function sampleCurveX(t) {
		return ((ax * t + bx) * t + cx) * t;
	}
	function solve(x, epsilon) {
		var t = solveCurveX(x, epsilon);
		return ((ay * t + by) * t + cy) * t;
	}
	function solveCurveX(x, epsilon) {
		var t0, t1, t2, x2, d2, i;
		for(t2 = x, i = 0; i < 8; i++) {
			x2 = sampleCurveX(t2) - x;
			if (Math.abs(x2) < epsilon) {
				return t2;
			}
			d2 = (3 * ax * t2 + 2 * bx) * t2 + cx;
			if (Math.abs(d2) < 1e-6) {
				break;
			}
			t2 = t2 - x2 / d2;
		}
		t0 = 0;
		t1 = 1;
		t2 = x;
		if (t2 < t0) {
			return t0;
		}
		if (t2 > t1) {
			return t1;
		}
		while (t0 < t1) {
			x2 = sampleCurveX(t2);
			if (Math.abs(x2 - x) < epsilon) {
				return t2;
			}
			if (x > x2) {
				t0 = t2;
			} else {
				t1 = t2;
			}
			t2 = (t1 - t0) / 2 + t0;
		}
		return t2;
	}
	return solve(t, 1 / (200 * duration));
}
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
function animate(element, params, ms, easing, callback){
	if(!element){
		return;	
	}
	if(typeof easing == 'function' || !easing){
		callback = easing || null;
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
	var easingFormula = EasingFormulas[easing];
	//还可以使用贝塞尔曲线
	if(!easingFormula){
		var curve = String(easing).match(/^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/);
		if(curve && curve.length == 5){
			easingFormula = function(t){
				return CubicBezierAtTime(t, +curve[1], +curve[2], +curve[3], +curve[4], ms);
			};
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
	typeof callback == 'function' && setTimeout(function(){
		callback.call(element);
	}, ms);
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
			setOpacity(element, params[attr]);
		}else{
			setStyle(element, attr, parseInt(params[attr]));
		}
	}
	function setStyle(element, attr, intValue){
		if(isNaN(intValue)){
			return;	
		}
		element.style[attr] = intValue + 'px';
	}
	function setOpacity(element, opacity){
		if(isNaN(opacity)){
			return;
		}
		element.style.opacity = (opacity/100).toFixed(2);
		element.style.filter = 'alpha(opacity:' + parseInt(opacity) + ')';
	}
}