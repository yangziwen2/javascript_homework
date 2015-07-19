/*	
 * 	简单的自动补全
 * 	
 * 	params
 * 		url
 * 		queryName: 查询时提交给后台的字段名称
 * 		delay: 自动补全延迟，默认500ms
 * 		pageSize: 默认为10
 * 		sorted: 是否排序，默认为false
 * 		suggestProcessor: 对返回的content做些处理，比如加高亮之类的
 * 		
 * 	返回的json的格式为[{id: 'idStr', content: 'contentStr'}]
 * 	最终hiddenField的value会是选中的选项的id
 * 
 * 	后台数据可以是静态数据，也可以是动态接口
 */

function autoComplete(paramObj){
	var highlightedColor = '#6eafd5',
		interlacedColor = ['', '#eee'];
	paramObj = paramObj || {};
	var url = paramObj.url;
	if(!url){
		return;
	}
	var field = paramObj.field;
	if(!field || (field.tagName+'').toLowerCase() != 'input'){
		return;
	}
	if(field.isAutoCompleting && typeof field.getAutoCompleteHandler == 'function'){
		var autoCompleteHandler = field.getAutoCompleteHandler();
		autoCompleteHandler.destroy();
	}
	var delay = parseInt(paramObj.delay);
	isNaN(delay) && (delay = 500);
	var pageSize = parseInt(paramObj.pageSize);
	isNaN(pageSize) && (pageSize = 10);
	var sorted = paramObj.sorted != 'false' && !!paramObj.sorted;
	//当前高亮的选项
	var curSelected = -1;
	var queryName = paramObj.queryName || 'queryField';
	var suggestProcessor = typeof paramObj.suggestProcessor == 'function' 
		? paramObj.suggestProcessor
		: function(content){return content;};
	var contentProcessor = typeof paramObj.contentProcessor == 'function'
		? paramObj.contentProcessor
		: function(content){return content;};
	var oFieldDiv = document.createElement('div');
	with(oFieldDiv.style){
		width = field.offsetWidth + 'px';
		height = field.offsetHeight + 'px';
		position = 'relative';
		margin = '0px';
		padding = '0px';
		display = 'inline-block';
	}
	field.parentNode.replaceChild(oFieldDiv, field);
	oFieldDiv.appendChild(field);
	var hiddenField = paramObj.hiddenField || document.createElement('input');
	//hiddenField.setAttribute(type, 'hidden');//ie下type只读
	hiddenField.style.display = 'none';
	hiddenField.parentNode || oFieldDiv.appendChild(hiddenField);
	var suggDiv = document.createElement('div');
	with(suggDiv.style){
		width = field.offsetWidth + 'px';
		border = '1px solid #333';
		display = 'none';
		position = 'absolute';
		top = field.offsetHeight + 1 + 'px';
		backgroundColor = '#fff';
	}
	var suggUl = document.createElement('ul');
	with(suggUl.style){
		width = '100%';
		listStyle = 'none';
		fontSize = '20px';
		padding = '0px';
		margin = '0px';
		cursor = 'pointer';
	}
	suggUl.onmousedown = function(event){
		event = event || window.event;
		event.cancelBubble = true;
	};
	suggUl.onclick = function(event){
		event = event || window.event;
		event.cancelBubble = true;
		var targetLi = (event.target || event.srcElement);
		field.value = contentProcessor.call(paramObj, targetLi.ajaxContent);
		hiddenField.value = targetLi.ajaxId;
		lastValue = field.value;
		curSelected = -1;
		suggDiv.style.display = 'none';
	};
	suggUl.onmouseover = function(event){
		event = event || window.event;
		var targetLi = event.srcElement || event.target;
		while(targetLi.parentNode != suggUl){
			targetLi = targetLi.parentNode;
			if(targetLi == document.body){
				return;
			}
		}
		curSelected >= 0 && curSelected < this.children.length 
			&& (suggUl.children[curSelected].style.backgroundColor = curSelected%2? interlacedColor[0]: interlacedColor[1]);
		if(Array.prototype.indexOf){
			curSelected = Array.prototype.indexOf.call(this.children, targetLi);
		}else{
			for(var i=0; i<this.children.length; i++){
				if(this.children[i] == targetLi){
					curSelected = i;
					break;
				}
			}
		}
		targetLi.style.backgroundColor = highlightedColor;
	}
	field.onkeydown = function(event){
		event = event || window.event;
		if(suggUl.children.length < 1){
			return;
		}
		if(event.keyCode == 13){
			if(curSelected >= 0 && curSelected < suggUl.children.length){
				var targetLi = suggUl.children[curSelected];
				lastValue = field.value = contentProcessor.call(paramObj, targetLi.ajaxContent);
				hiddenField.value = targetLi.ajaxId;
				curSelected = -1;
				suggDiv.style.display = 'none';
			}
			return;
		}
		var direct = 0;
		if(Math.abs(direct = event.keyCode - 39) == 1){
			var lisLen = suggUl.children.length;
			if((curSelected %= lisLen) >=0){
				suggUl.children[curSelected].style.backgroundColor = curSelected%2? interlacedColor[0]: interlacedColor[1];
			};
			//这里写的已经有点ugly了，保证第一次按上的时候能使最后一个高亮
			curSelected == -1 && direct < 0 && (curSelected = 0); 
			curSelected = (curSelected + direct + lisLen)%lisLen
			suggUl.children[curSelected].style.backgroundColor = highlightedColor;
			return;
		}
		//curSelected = -1;
	}
	suggDiv.appendChild(suggUl);
	oFieldDiv.appendChild(suggDiv);
	field.onkeyup = (function(){
		var lastValue = field.value;
		var flag = false;
		return function(){
			if(flag){
				return;
			}
			if(!this.value){
				suggDiv.style.display = 'none';
				curSelected = -1;
				lastValue = '';
				return;
			}
			hiddenField.value = '';
			flag = true;
			var _this = this;
			setTimeout(function(){
				flag = false;
				if(_this.value != lastValue){
					var params = {};
					params.pageSize = pageSize;
					params[queryName] = _this.value
					ajaxGet(url, params, function(data){
						var resultArr = window.eval('(' + data + ')');
						if(resultArr.length == 0){
							return;
						}
						for(var li = suggUl.children[0]; li; li = suggUl.children[0]){
							suggUl.removeChild(li);
						}
						sorted && resultArr.sort(function(obj1, obj2){
							return obj1.content.localeCompare(obj2.content);
						});
						for(var i=0, count=0; i<resultArr.length && count<pageSize; i++, count++){
							if(resultArr[i].content.toLowerCase().indexOf(_this.value.toLowerCase()) != 0){
								count--;
								continue;
							}
							var oLi = document.createElement('li');
							oLi.innerHTML = suggestProcessor.call(paramObj, resultArr[i].content);
							oLi.ajaxId = resultArr[i].id
							oLi.ajaxContent = resultArr[i].content;
							oLi.style.backgroundColor = count%2? interlacedColor[0]: interlacedColor[1];
							suggUl.appendChild(oLi);
						}
						suggDiv.style.display = count>0? 'block': 'none';
					});
				}
				lastValue = _this.value;
			},delay);
		};
	})();
	
	bindEvent(document, 'mousedown', function(){
		suggDiv.style.display = 'none';
		curSelected = -1;
	});
	field.isAutoCompleting = true;
	field.getAutoCompleteHandler = function(){
		return {
			getParamObj: function(){
				return paramObj
			},
			destroy: function(){
				oFieldDiv.parentNode.replaceChild(field, oFieldDiv);
				oFieldDiv = null;
				delete field.getAutoCompleteHandler;
				field.isAutoCompleting = false;
				return field;
			}
		};
	}
	return field.getAutoCompleteHandler();
	function bindEvent(obj, eventName, fn){
		if(obj.addEventListener){
			obj.addEventListener(eventName, fn, false);
		}else{
			obj.attachEvent('on'+eventName, fn);
		}
	}
}