(function(){
	//Vector构造函数的输入参数需要是Array
	window.Vector = function(arr){
		if(!arr || !(arr instanceof Array)){
			arr = [];
		}
		Array.call(this);
		this.length = arr.length;
		for(var i=0; i<arr.length; i++){
			this[i] = arr[i];	
		}
	}
	Vector.prototype = Vector.fn = [];
	Vector.fn.toString = function(){
		return this.join();
	}
	Vector.fn.plus = function(v){
		if(! this.isCalculable(v)){
			return null;	
		}
		return this.calculate(v, '+');
	}
	Vector.fn.minus = function(v){
		if(! this.isCalculable(v)){
			return null;	
		}
		return this.calculate(v, '-');
	}
	Vector.fn.magnify = function(c){
		var result = new Vector;
		isNaN(c) && (c = 0);
		for(var i=0;i<this.length; i++){
			result.push(this[i] * c);	
		}
		return result;
	}
	Vector.fn.calculate = function(v, symbol){
		var length = Math.max(this.length, v.length);
		var result = new Vector();
		for(var i=0; i<length; i++){
			result.push(this.cal(this[i] || 0,  v[i] || 0, symbol));
		}
		return result;
	}
	Vector.fn.cal = function(a, b, symbol){
		switch(symbol){
			case '+':
				return a + b;
			case '-':
				return a - b;
			case '*':
				return a * b;
			default:
				return 0;
		}
	}
	Vector.fn.isCalculable = function(v){
		if(!v instanceof Vector){
			return false;	
		}
		return true;
	}
})();