function Bullet(playArea, scatter, param){
	this.playArea = playArea;
	this.scatter = scatter;
	this.param = param;
	this.bulletWaveList = [];
	this.fragment = document.createDocumentFragment();
	this.init();
}

Bullet.prototype = {
	init: function(){
		this.createBullet()
	},
	createBullet: function(){
		if(this.param.type == 'radiation'){
			this.createRadiationBullet();
		}
		this.playArea.appendChild(this.fragment);
		for(var i=0; i<this.bulletWaveList.length; i++){
			this.initPolar(this.bulletWaveList[i], i);
		}
	},
	createSingleBullet: function(){
		var templateName = this.param.template;
		var template = bulletTemplateMap[templateName];
		if(!template){
			return;	
		}
		var singleBullet = document.createElement('div');
		setAttr(singleBullet, template);
		singleBullet.style.position = 'absolute';
		singleBullet.style.display = 'none';
		this.fragment.appendChild(singleBullet);
		return singleBullet;
	},
	createRadiationBullet: function(){
		var detail = this.param.detail;
		for(var i=0; i<detail.waveTimes; i++){
			var bulletList = [];
			for(var j=0; j<detail.numPerWave; j++){
				bulletList.push(this.createSingleBullet());	
			}
			this.bulletWaveList.push(bulletList);
		}
	},
	initPolar: function(bulletList, waveCount){
		var detail = this.param.detail;
		var polar = detail.beginPolar;
		!detail.offsetFactor && (detail.offsetFactor = 0);
		!detail.offset && (detail.offset = 0);
		if(polar.center == 'scatter'){
			polar.center = 	getCenterOfScatter(this.scatter);
		}
		var angleInterval = detail.availableAngle/detail.numPerWave;
		for(var i=0; i<bulletList.length; i++){
			var offsetAngle = Math.pow(waveCount, detail.offsetFactor)*detail.offset;
			bulletList[i].initAngle = offsetAngle + detail.startAngle + i*angleInterval;
			bulletList[i].relativeAngle = i* angleInterval;
			relocatePolar(bulletList[i], {center: polar.center, r: polar.r, theta: polar.theta + bulletList[i].initAngle})	
		}
		function getCenterOfScatter(scatter){
			return {
				x: (getAttr(scatter, 'left') + scatter.offsetWidth/2),
				y: (getAttr(scatter, 'top') + scatter.offsetHeight/2)
			}
		}
	},
	scatterBullet: function(){
		var _this = this;
		var count = 0;
		var maxCount = this.bulletWaveList.length;
		var waveInterval = this.param.detail.waveInterval || 0;
		var timer = setInterval(function(){
			if(_this.param.type == 'radiation'){
				var bulletList = _this.bulletWaveList.pop();
				Bullet.player.enemyBulletArr = Bullet.player.enemyBulletArr.concat(bulletList);
				_this.scatterRadiationWave(bulletList);
			}
			count++;
			count>=maxCount && (clearInterval(timer));
		}, waveInterval)
	},
	scatterRadiationWave: function(bulletList){
		var detail = this.param.detail;
		var polar = detail.targetPolar;
		bulletList[0].style.display = 'block';
		animate(bulletList[0], {r: polar.r, theta: polar.theta + bulletList[0].initAngle}, detail.timeSpend, detail.easing);
		setTimeout(function(){
			for(var i=1; i<bulletList.length; i++){
				bulletList[i].style.display = 'block';
				relocatePolar(bulletList[i], {r: bulletList[0].r, theta: bulletList[0].theta + bulletList[i].relativeAngle});
			}
			setTimeout(arguments.callee, 20);
		}, 10)
	}
}