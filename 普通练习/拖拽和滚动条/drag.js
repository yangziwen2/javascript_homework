function dragXY(obj, paramObj){
	drag(obj, 'left', paramObj);
	drag(obj, 'top', paramObj)
}

function drag(obj, direct, paramObj){
	direct ||(direct = 'left');	//拖拽方向
	var limited = paramObj.limited;	//是否限制移动范围
	var cling = paramObj.cling || 0;
	addEvent(obj, 'mousedown', function(event){
		if(typeof drag.zIndex == 'number'){
			drag.zIndex ++;
		}else{
			drag.zIndex = 0;
		}
		obj.style.zIndex = drag.zIndex;
		event = event || window.event;
		var clientPos = getClientPos(event);
		var dist = clientPos - getStyleInt(obj, direct);
		addEvent(document, 'mousemove', dealMousemove);
		addEvent(document, 'mouseup', dealMouseup);
		event.preventDefault && event.preventDefault();
		event.returnValue = false;
		function dealMousemove(event){
			event = event || window.event;
			var clientPos = getClientPos(event);
			var newPos = clientPos - dist;
			if(limited){
				newPos > cling || (newPos = 0);
				var max = getSize(obj.offsetParent, direct) - getSize(obj, direct);
				newPos < max - cling || (newPos = max);
			}
			setStyleInt(obj, direct, newPos);
			if(typeof paramObj.fn == 'function'){
				paramObj.fn(newPos);
			}
			event.preventDefault && event.preventDefault();
			event.returnValue = false;
		}
		
		function dealMouseup(event){
			event = event || window.event;
			removeEvent(document, 'mousemove', dealMousemove);
			removeEvent(document, 'mouseup', dealMouseup);
		}
	});
	
	function getClientPos(event){
		if(direct == 'left'){
			return event.clientX;
		}else{
			return event.clientY;
		}
	}
	
	function getSize(obj, direct){
		switch(direct){
			case 'left':
				if(obj == document.body){
					return document.documentElement.clientWidth;
				}
				return getStyleInt(obj, 'width');
			case 'top':
				if(obj == document.body){
					return document.documentElement.clientHeight;
				}
				return getStyleInt(obj, 'height');
		}
	}
}