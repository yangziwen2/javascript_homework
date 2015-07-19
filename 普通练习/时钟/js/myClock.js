;(function(window){
	window.myClock = {};
	myClock.init = function(ulSelector){
		ulSelector = ulSelector || 'clockUl';
		var oUl = document.getElementById(ulSelector);
		var aImg = oUl.getElementsByTagName('img');
		for(var i=0, aHour = []; i<2; i++){
			aHour.push(aImg[i]);
		}
		for(var i=3, aMinute = []; i<5; i++){
			aMinute.push(aImg[i]);
		}
		for(var i=6, aSecond = []; i<8; i++){
			aSecond.push(aImg[i]);	
		}
		var aTime = {
			aHour: aHour,
			aMinute: aMinute,
			aSecond: aSecond
		};
		displayTime(aTime);
		var oDate = new Date();
		var iCurSecond = oDate.getSeconds();
		launchFirstSecond(iCurSecond, aTime);
	}

	//检测页面开启后的第一秒何时结束
	function launchFirstSecond(iSecond, aTime){
		window.timer = setTimeout(function(){
			clearTimeout(window.timer);
			var oDate = new Date();
			var iCurSecond = oDate.getSeconds();
			if(iSecond == iCurSecond){
				launchFirstSecond(iSecond, aTime);	
			}else{
				displayTime(aTime);
				window.timer = setInterval(function(){
					displayTime(aTime);
				}, 1000);
			}
		}, 10);
	}

	function displayTime(aTime){
		var oDate = new Date();
		setClockTime(aTime.aHour, oDate.getHours());
		setClockTime(aTime.aMinute, oDate.getMinutes());
		setClockTime(aTime.aSecond, oDate.getSeconds());
	}

	function setClockTime(timeArr, timeValue){
		timeArr[0].src = 'images/' + parseInt((timeValue/10)) + '.JPG';
		timeArr[1].src = 'images/' + (timeValue%10) + '.JPG';
	}
})(window);