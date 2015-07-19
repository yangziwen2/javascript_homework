if(!Array.prototype.indexOf){	//for IE
	Array.prototype.indexOf = function(val){
		for(var i=0; i<this.length; i++){
			if(val == this[i]){
				return i;	
			}
		}
		return -1;
	}
}
//****Player中数据的结构****//
//Player:
//		playArea
//		playerDiv
//		playerParams
//		bulletArr

(function(){
	window.Player = function(playArea){
		switch(typeof playArea){
			case 'string':
				this.playArea = document.getElementById(playArea);
				break;
			case 'object':
				this.playArea = playArea;
				break;
			default:
				return null;
		}
		Enemy.player = this;	//这个地方写的很糟糕
		Bullet.player = this;
		this.enemyBulletArr = [];
		this.init();
	}
	Player.prototype = {
		init: function(){
			this.initParams();
			this.createPlayer();
			this.addBehavior();
			this.initLife();
		},
		initParams: function(){
			this.playerParams = {
				width: 32,
				height: 48,
				shiftSpan: 4
			}
		},
		//****创建player的div****//
		createPlayer: function(){
			this.playerDiv = document.createElement('div');
			this.playerDiv.id = 'player';
			this.directStatus = 0;		//方向状态
			with(this.playerDiv.style){
				position = 'absolute';
				width = this.playerParams.width + 'px';
				height = this.playerParams.height + 'px';
				left = parseInt((this.playArea.offsetWidth-2-this.playerParams.width)/2) + 'px';
				top = this.playArea.offsetHeight-70 + 'px';
				background = 'url(images/lingmeng.png) 0px 0px';
				zIndex = 100;
			}
			this.playArea.appendChild(this.playerDiv);
		},
		//****添加player的行为****//
		addBehavior: function(){
			var _this = this;
			bindKeyDownAndUpEvent(function(event){
				if(event.keyCode < 37 || event.keyCode > 40){
					return;
				}
				_this.updateDirection(event);
			});
			bindKeyDownAndUpEvent(function(event){
				if(event.keyCode < 37 || event.keyCode > 40){
					return;
				}
				_this.processPlayerMotion();
				if(event.type == 'keydown'){
					unbindEvent(document, 'keydown', arguments.callee);
				}else if(event.type == 'keyup'){
					bindEvent(document, 'keydown', arguments.callee);
				}
			});
			bindKeyDownAndUpEvent(function(event){
				_this.processShiftKey(event);
			});
			bindKeyDownAndUpEvent(function(event){
				if(event.keyCode != 'Z'.charCodeAt(0)){
					return;	
				}
				_this.processShootKey(event);
				if(event.type == 'keydown'){
					unbindEvent(document, 'keydown', arguments.callee);
				}else if(event.type == 'keyup'){
					bindEvent(document, 'keydown', arguments.callee);
				}
			});
		},
		//****处理player的运动****//
		processPlayerMotion: function(){
			var _this = this;
			if(this.directStatus){
				clearInterval(this.playerTimer);
				this.playerTimer = setInterval(function(){
					_this.shiftPlayer();
				}, 10);
			}
		},
		//****每次按键的时候更新方向****//
		updateDirection: function(event){
			var keyStatus = [1, 2, 4, 8]; //left, top, right, down
			var keyIndex = event.keyCode - 37;
			if(keyIndex > 3 || keyIndex < 0){
				return;	
			}
			if(event.type == 'keydown'){
				this.directStatus = this.directStatus | keyStatus[keyIndex];
			}else if(event.type == 'keyup'){
				this.directStatus = this.directStatus & (~keyStatus[keyIndex]);	
			}
		},
		//****在定时器的每次执行中移动player****//
		shiftPlayer: function(){
			var playerDiv = this.playerDiv;
			var shiftSpan = this.playerParams.shiftSpan || 4;
			var xSpan = (((this.directStatus & 4)>>2) - (this.directStatus & 1)) * shiftSpan;
			var ySpan = (((this.directStatus & 8)>>3) - ((this.directStatus & 2)>>1)) * shiftSpan;
			with(playerDiv.style){
				if(xSpan > 0){
					backgroundPosition = '-225px -96px';
				}else if(xSpan < 0){
					backgroundPosition = '-225px -48px';	
				}else{
					backgroundPosition = '';	
				}
			}
			var currentLeft = getStyleInt(playerDiv, 'left');
			var currentTop = getStyleInt(playerDiv, 'top');
			var parentDiv = this.playArea;
			if(currentLeft+xSpan >= parentDiv.offsetWidth-playerDiv.offsetWidth-2){
				xSpan = parentDiv.offsetWidth-playerDiv.offsetWidth-2-currentLeft;
			}else if(currentLeft+xSpan<=0){
				xSpan = -currentLeft;
			}
			if(currentTop+ySpan >= parentDiv.offsetHeight-playerDiv.offsetHeight-2){
				ySpan = parentDiv.offsetHeight-playerDiv.offsetHeight-2-currentTop;
			}else if(currentTop+ySpan<=0){
				ySpan = -currentTop;
			};
			playerDiv.style.left = getStyleInt(playerDiv, 'left') + xSpan + 'px';
			playerDiv.style.top = getStyleInt(playerDiv, 'top') + ySpan + 'px';
		},
		//****shift变速****//
		processShiftKey: function(event){
			this.playerParams.shiftSpan = event.shiftKey? 2: 4;
		},
		//****开火键z****//
		processShootKey: function(event){
			var _this = this;
			var keyCode = event.keyCode;
			if(keyCode != 'Z'.charCodeAt(0)){
				return;
			}
			if(event.type == 'keydown'){
				this.isShooting = true;
			}else if(event.type == 'keyup'){
				this.isShooting = false;
			}
			//注意shootingTimer和bulletTimer的区别
			clearInterval(this.shootingTimer);
			if(this.isShooting){
				this.shootingTimer = setInterval(function(){
					_this.shootBullet();
				}, 100);	
			}
		},
		shootBullet: function(){
			this.createBullet();
			this.processBulletMotion();
		},
		//****初始化子弹****//
		createBullet: function(){
			var playerDiv = this.playerDiv;
			var bullet = document.createElement('div');
			with(bullet.style){
				width = '14px';
				height = '64px';
				position = 'absolute';
				background = 'url(images/bullet.png) -32px 0px';
				left = getStyleInt(playerDiv, 'left') + 9 + 'px';
				top = getStyleInt(playerDiv, 'top') - 10 + 'px';
			}
			this.playArea.appendChild(bullet);
			if(!this.bulletArr){
				this.bulletArr = [];
			}
			this.bulletArr.push(bullet);
		},
		//****发射子弹****//
		processBulletMotion: function(){
			var _this = this;
			clearInterval(this.bulletTimer);
			this.bulletTimer = setInterval(function(){
				for(var i=0; i<_this.bulletArr.length; i++){
					var iTop = getStyleInt(_this.bulletArr[i], 'top');
					if(iTop <= -64){
						_this.playArea.removeChild(_this.bulletArr[i]);
						_this.bulletArr.splice(i, 1);
						continue;
					}
					_this.bulletArr[i].style.top = iTop - 10 + 'px';
				}
			}, 20);
		},
		//****遭受攻击****//
		sufferHurt: function(){		//这里面写的有点糙
			var _this = this;
			this.lifeLeft--;
			this.lifeArr[4-this.lifeLeft].style.background = 'url(images/star.gif) no-repeat 0 0';
			if(this.lifeLeft == 0){
				alert('died!')	
			}
			this.isOverwhelming = true;
			var count = 0;
			setTimeout(function(){
				playerBlur();
				count++;
				if(count<4){
					setTimeout(arguments.callee, 500);
				}else{
					_this.isOverwhelming = false;	
				}
			}, 0);
			function playerBlur(){
				animate(_this.playerDiv, {opacity: 50}, 250, '<>', function(){
					animate(_this.playerDiv, {opacity: 100}, 250, '<>');
				});
			}
		},
		//****初始化生命槽****//
		initLife: function(){
			this.lifeLeft = 5;
			var lifeDiv = document.getElementById('life');
			var liArr = lifeDiv.getElementsByTagName('li');
			this.lifeArr = [];
			for(var i=0; i<liArr.length; i++){
				this.lifeArr.push(liArr[i]);	
			}
		}
	}
	
	// 工具函数 //
	function bindEvent(obj, eventName, fn){
		if(!obj.eventMap){
			obj.eventMap = {};	
		}
		if(!obj.eventMap[eventName]){
			obj.eventMap[eventName] = [];	
		}
		obj.eventMap[eventName].push(fn);
		if(!obj['on' + eventName]){
			obj['on' + eventName] = function(event){
				event = event || window.event;
				for(var i=0; i<obj.eventMap[eventName].length; i++){
					obj.eventMap[eventName][i].call(obj, event);	
				}
			}
		}
	}
	
	function unbindEvent(obj, eventName, fn){
		if(!obj.eventMap){
			return;	
		}
		if(!obj.eventMap[eventName] || obj.eventMap[eventName].length == 0){
			return;	
		}
		var index = obj.eventMap[eventName].indexOf(fn);
		if(index < 0){
			return;	
		}
		obj.eventMap[eventName].splice(index, 1);
		if(!obj.eventMap[eventName] || obj.eventMap[eventName].length == 0){
			obj['on' + eventName] = null;
		}
	}
	
	function bindKeyDownAndUpEvent(fn){
		bindEvent(document, 'keydown', fn);
		bindEvent(document, 'keyup', fn);
	}
	
	function getStyleInt(obj, attr){
		return parseInt(getStyle(obj, attr));
	}
	
	function getStyle(obj, attr){
		if(obj.currentStyle){
			return obj.currentStyle[attr];
		}else{
			return getComputedStyle(obj, false)[attr];
		}
	}
})();
Player.checkHit = function(player){
	if(player.isOverwhelming){
		return;	
	}
	if(!player.enemyBulletArr || !player.enemyBulletArr.length){
		return;	
	}
	for(var i=0; i<player.enemyBulletArr.length; i++){
		var bullet = player.enemyBulletArr[i];
		if(bullet.outOfBoundary){
			player.enemyBulletArr.splice(i, 1);
			i--;
			continue;
		}
		if(isOverlap(player.playerDiv, bullet)){
			player.enemyBulletArr.splice(i, 1);
			i--;
			player.playArea.removeChild(bullet);
			player.sufferHurt();
		}
	}
	function isOverlap(playerDiv, bulletDiv){
		var px = playerDiv.offsetLeft + 16,
			py = playerDiv.offsetTop + 24,
			bx = bulletDiv.offsetLeft + bulletDiv.offsetWidth/2,
			by = bulletDiv.offsetTop + bulletDiv.offsetHeight/2;
		var dl = px - bx,
			dt = py - by;
		if(dl*dl + dt*dt < 225){
			return true;	
		}
		return false;
	}
}