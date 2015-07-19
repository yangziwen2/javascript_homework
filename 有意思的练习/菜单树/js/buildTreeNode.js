function buildTreeNode(treeNodeParam){
	var parentNode = treeNodeParam.parentNode || document.body,
		currentNode = treeNodeParam.currentNode,
		isCollapse = treeNodeParam.isCollapse,
		callbackFn = treeNodeParam.callbackFn;
	if(typeof currentNode != 'object'){
		return;	
	}
	var oA = document.createElement('a');
	oA.innerHTML = currentNode.nodeName;
	oA.style.textDecoration = 'none';
	oA.href = 'javascript:void(0)';
	parentNode.appendChild(oA);
	var oUl = null;
	if(currentNode.subNodes && currentNode.subNodes.length > 0){
		oUl = document.createElement('ul');
		parentNode.appendChild(oUl);
		for(var i=0; i<currentNode.subNodes.length; i++){
			var oLi = document.createElement('li');
			oUl.appendChild(oLi);
			buildTreeNode({
				parentNode: oLi,
				currentNode: currentNode.subNodes[i], 
				isCollapse: isCollapse, 
				callbackFn: callbackFn
			});
		}
		if(isCollapse && currentNode.nodeName != ''){
			oUl.style.display = 'none';	
		}else{
			oUl.style.display = 'block';
		}
	}
	if(typeof currentNode.nodeLink == 'string'){
		//oA.href = 'content.html'+currentNode.nodeLink;
		//oA.target = 'contentFrame';
		oA.onclick = function(){
			if(typeof callbackFn == 'function'){
				callbackFn.call(this, currentNode);
			}
		};	
	}else if(oUl != null){
		if(currentNode.nodeName != ''){
			var oImg = document.createElement('img');
			oImg.className = 'toggleFlag';
			oImg.src = isCollapse? 'images/collaspe.jpg': 'images/expand.jpg';
			oImg.style.marginRight = '5px';
			oA.insertBefore(oImg, oA.childNodes[0]);
		}
		oA.onclick = function(){
			var oUlArr = this.parentNode.getElementsByTagName('ul');
			if(!oUlArr || oUlArr.length <= 0){
				return;
			}
			var oUl = oUlArr[0];
			var oImgs = this.getElementsByTagName('img');
			for(var i=0; i<oImgs.length; i++){
				if(oImgs[i].className.indexOf('toggleFlag')<0){
					continue;
				}
				oImgs[i].src = oUl.style.display == 'block'? 'images/collaspe.jpg': 'images/expand.jpg';
			}
			oUl.style.display = oUl.style.display == 'block'? 'none': 'block';
		}
	}
}