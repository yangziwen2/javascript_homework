(function(){
	window.BezierCurve = function(basicPointArr, dotNum){
		this.basicPointArr = basicPointArr;	
		this.dotNum = dotNum;
		this.init();
	}
	BezierCurve.prototype = {
		bnstVector: new BernsteinVector(),
		init: function(){
			this.initBasicPoints();
			this.initCurve();
			this.shapeCurve();
		},
		initBasicPoints: function(){
			var _this = this;
			this.basicPointDivArr = [];
			for(var i=0; i<this.basicPointArr.length; i++){
				var oDiv = document.createElement('div');
				oDiv.index = i;
				this.basicPointDivArr[i] = oDiv;
				with(oDiv.style){
					width = '12px',
					height = '12px',
					left = this.basicPointArr[i][0] - 6 + 'px';
					top = this.basicPointArr[i][1] - 6 + 'px';
					position = 'absolute';
					border = '1px solid #333';
					backgroundColor = 'red';
					cursor = 'pointer';
					zIndex = 100;
					color = 'white';
					fontSize = '12px';
					textAlign = 'center';
					lineHeight = '12px';
				}
				oDiv.innerHTML = i+1;
				oDiv.onmousedown = function(event){
					var currentDiv = this;
					event || (event = window.event);
					var disX = event.clientX - getStyleInt(this, 'left');
					var disY = event.clientY - getStyleInt(this, 'top');
					document.onmousemove = function(event){
						event = event || window.event;
						currentDiv.style.left = event.clientX - disX + 'px';
						currentDiv.style.top = event.clientY - disY + 'px';
						var currentIndex = currentDiv.index;
						_this.basicPointArr[currentIndex][0] = event.clientX - disX + 6;
						_this.basicPointArr[currentIndex][1] = event.clientY - disY + 6;
						_this.shapeCurve();
						return false;
					}
					document.onmouseup = function(){
						document.onmousemove = null;
						document.onmouseup = null;
						return false;
					}
					return false;
					function getStyleInt(obj, attr){
						return parseInt(getStyle(obj, attr));	
					}
					function getStyle(obj, attr){
						if(obj.currentStyle){
							return obj.currentStyle[attr];	
						}else if(window.getComputedStyle){
							return 	getComputedStyle(obj, false)[attr];
						}
					}
				}
				document.body.appendChild(oDiv);
			}
		},
		initCurve: function(){
			this.curveDotArr = [];
			var fragment = document.createDocumentFragment();
			for(var i=0; i<this.dotNum; i++){
				var oDiv = document.createElement('div');
				with(oDiv.style){
					width = '0px';
					height = '0px';
					position = 'absolute';
					border = '2px solid #333';
				}
				this.curveDotArr.push(oDiv);
				fragment.appendChild(oDiv);
			}
			document.body.appendChild(fragment);
		},
		shapeCurve: function(){
			var resultPosVectors = this.bnstVector.buildCurveByXyPoints(this.basicPointArr, this.dotNum);
			var xPosVector = resultPosVectors.xPosVector;
			var yPosVector = resultPosVectors.yPosVector;
			for(var i=0; i<this.curveDotArr.length; i++){
				with(this.curveDotArr[i].style){
					left = xPosVector[i] + 'px';
					top = yPosVector[i] + 'px';
				}
			}
		}
	}
})();