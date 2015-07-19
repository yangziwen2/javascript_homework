/***BernsteinVector依赖于Vector***/
(function(){
	window.BernsteinVector = function(nth){
		!nth && (nth = 3);
		this.vectorMatrix = [[new Vector([1])]];
		for(var i=1; i<=nth; i++){
			this.createNthVectors(i);	
		}
	}
	BernsteinVector.prototype = {
		createNthVectors: function(nth){
			var lastBnstVects = this.vectorMatrix[nth-1];
			var newBnstVects = [];
			var zeroVector = new Vector();
			for(var i=0; i<=nth; i++){
				var a = i<nth? lastBnstVects[i]: zeroVector;
				var b = i>0? lastBnstVects[i-1]: zeroVector;
				var c = b.minus(a);
				c.unshift(0);
				newBnstVects[i] = c.plus(a);
			}
			this.vectorMatrix[nth] = newBnstVects;
		},
		getVector: function(i, nth){
			this.appendVectors(nth);
			return this.vectorMatrix[nth][i];
		},
		getNthVectors: function(nth){
			this.appendVectors(nth);
			return this.vectorMatrix[nth];
		},
		appendVectors: function(nth){
			var currentNth = this.vectorMatrix.length - 1;
			if(nth > currentNth){
				for(var i=currentNth+1; i<=nth; i++){
					this.createNthVectors(i)	
				}
			}	
		},
		//按照一维坐标点构造相应的矢量，返回Vector
		buildCurveVectorByPoints: function(pArr){
			var nth = pArr.length - 1;
			var result = new Vector();
			if(!(pArr instanceof Array) || pArr.length <=0){
				return result;
			}
			var bnstVectors = this.getNthVectors(nth);
			for(var i=0; i<pArr.length; i++){
				result = result.plus(bnstVectors[i].magnify(pArr[i]));
			}
			return result;
		},
		//注意，这个方法返回的是数组
		buildCurveByPoints: function(pArr, pointNum){
			pointNum || (pointNum = 100);
			var pVector = this.buildCurveVectorByPoints(pArr);
			var tArr = [];
			var span = 1/pointNum
			for(var i=0; i<pointNum; i++){
				tArr[i] = span*i;
			}
			var resultPosVector = new Vector();
			for (var i=0; i<tArr.length; i++){
				resultPosVector.push(0);
				for(var j=0; j<pVector.length; j++){
					resultPosVector[i] += pVector[j]*Math.pow(tArr[i], j);
				}
			}
			return resultPosVector;
		},
		buildCurveByXyPoints: function(xyArr, pointNum){
			var xArr = [], yArr = [];
			for(var i=0; i<xyArr.length; i++){
				xArr.push(xyArr[i][0]);
				yArr.push(xyArr[i][1]);
			}
			return{
				xPosVector: this.buildCurveByPoints(xArr, pointNum),
				yPosVector: this.buildCurveByPoints(yArr, pointNum)
			}
		}
	}
})();