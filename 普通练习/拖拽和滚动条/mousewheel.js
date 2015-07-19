function addMousescrollEvent(obj, fn){
	function mouseScroll(event){
		event = event || window.event;
		var scrollDirect = 'up';
		if(event.wheelDelta){
			scrollDirect = event.wheelDelta<0? 'down': 'up';
		}else{
			scrollDirect = event.detail>0? 'down': 'up';
		}
		event.scrollDirect = scrollDirect;
		fn(event);
		if(event.preventDefault){
			event.preventDefault();
		}
		event.returnValue = false;
	}
	if(obj.addEventListener){
		obj.addEventListener('DOMMouseScroll', mouseScroll, false);
	}
	obj.onmousewheel = mouseScroll;
}
