function addEvent(obj, eventName, fn){
	if(obj.attachEvent){
		obj.attachEvent('on' + eventName, fn);
	}else{
		obj.addEventListener(eventName, fn);
	}
}

function removeEvent(obj, eventName, fn){
	if(obj.detachEvent){
		obj.detachEvent('on' + eventName, fn);
	}else{
		obj.removeEventListener(eventName, fn);
	}
}