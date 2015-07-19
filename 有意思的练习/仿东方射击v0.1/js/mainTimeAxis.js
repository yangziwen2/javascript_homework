var mainTimeAxis = {
	timeAxisTimer: null,
	start: function(playArea){
		var player = new Player(playArea);
		Enemy.startHitCheck(player);
		var timeCount = 0;
		mainTimeAxis.timeAxisTimer = setInterval(function(){
			for(var i=0; i<scenarioArr.length; i++){
				if(scenarioArr[i].debutTime >= timeCount){	//scenarioArr里面enemy的顺序必须按时间顺序设置，不然负担太重了
					break;
				}
				new Enemy(playArea, scenarioArr[i]);
				scenarioArr.splice(i, 1);
				i--;
			}
			timeCount += 100;
		}, 100);	
	}
}