function Enemy(playArea, param){
	this.playArea = playArea;	//必须是dom obj
	this.param = param;
	this.init();
	this.act();
	this.hurt = 0;
	Enemy.surviveList.push(this);
}
Enemy.surviveList = [];			//屏幕中存在的敌人
Enemy.prototype = {
	init: function(){
		this.createEnemy();
	},
	createEnemy: function(){
		var enemyDiv = document.createElement('div');
		this.enemyDiv = enemyDiv;
		enemyDiv.style.position = 'absolute';
		var template = enemyTemplateMap[this.param.template] || {};
		setAttr(enemyDiv, template);
		setStyleInt(enemyDiv, 'left', -200);
		setStyleInt(enemyDiv, 'top', 0);
		this.playArea.appendChild(enemyDiv);
	},
	act: function(){
		var _this = this;
		var motion = this.param.motionChain.shift();
		if(motion.type == 'plane'){
			motion.beginPos && setAttr(this.enemyDiv, motion.beginPos);
		}else if(motion.type == 'polar'){
			motion.beginPos && relocatePolar(this.enemyDiv, motion.beginPos);
		}
		animate(this.enemyDiv, motion.targetPos, motion.timeSpend, motion.easing, function(){
			if(!_this.enemyDiv){
				return;	
			}
			var x = getAttr(_this.enemyDiv, 'left'),
				y = getAttr(_this.enemyDiv, 'top');
			if(checkBoundary(_this.enemyDiv, x, y)){
				this.distory();
				return;	
			}
			if(_this.param.motionChain.length == 0){
				return;
			}
			if(motion.bullet){
				var bullet = new Bullet(_this.playArea, _this.enemyDiv, motion.bullet);
				_this.bulletWaveList = bullet.bulletWaveList;
				bullet.scatterBullet();
			}
			setTimeout(function(){_this.act();}, motion.delay);
		}, 10);
	},
	destroy: function(){
		for(var i=0; i<this.bulletWaveList.length; i++){
			var bulletList = this.bulletWaveList[i];
			for(var j=0; j<bulletList.length; j++){
				this.playArea.removeChild(bulletList[j]);			
			}
		}
		this.bulletWaveList = null;
		var index = Enemy.surviveList.indexOf(this);
		index>=0 && Enemy.surviveList.splice(index, 1);
		this.playArea.removeChild(this.enemyDiv);
	}
}
Enemy.checkHit = function(player){
	if(!player.bulletArr || !player.bulletArr.length){
		return;	
	}
	for(var i=0; i<player.bulletArr.length; i++){
		var bullet = player.bulletArr[i];
		for(var j=0; j<Enemy.surviveList.length; j++){
			var enemy = Enemy.surviveList[j];
			if(!isOverlap(bullet, enemy.enemyDiv)){
				continue;	
			}
			player.playArea.removeChild(bullet);
			var index = player.bulletArr.indexOf(bullet);
			index>=0 && player.bulletArr.splice(index, 1);
			enemy.hurt += 1;
			enemy.hurt >= enemy.param.endure && enemy.destroy();
		}
	}
	function isOverlap(obj1, obj2){
		var l1 = obj1.offsetLeft;
		var t1 = obj1.offsetTop;
		var l2 = obj2.offsetLeft;
		var t2 = obj2.offsetTop;
		var dl = l1-l2;
		var dt = t1-t2;
		if(dl*dl + dt*dt < 600){
			return true;	
		}
		return false;
	}
}
Enemy.startHitCheck = function(player){
	Enemy.hitCheckTimer = setInterval(function(){
		Enemy.checkHit(player);
		Player.checkHit(player);
	}, 20);
}