
function node(id,pid,name,url,frameName){
	
	this.id = id;
	this.pid = pid;
	this.name = name;
	this.url = url;
	this.frameName = frameName;
	//this.iconopen = null;
	this.icon = null;
	this.folder = null;
	//child
	this._hc = false;
	//open or close
	this._oc = false;
	//last
	this._ls = false;
}

function lTree(name){

	this.img = {
		home : "images/computer.gif",	
		folder : "images/folder.gif",	
		folderopen : "images/folderopen.gif",	
		empty : "images/empty.gif",
		file : "images/file.gif",
		closels : "images/closels.gif",	
		closeline : "images/closeline.gif",	
		openline : "images/openline.gif",
		openls : "images/openls.gif",
		join : "images/join.gif",
		joinls : "images/joinls.gif",
		line : "images/line.gif",
		close : "images/close.gif",	
		open : "images/open.gif"	
	}
	this.objName = name;
	this.nodes = [];
	this.indents= [];
	this.root = new node(-1);
}

lTree.prototype.add = function(id,pid,name,url,frameName){
	this.nodes[this.nodes.length] = new node(id,pid,name,url,frameName);
}

lTree.prototype.toString = function(){
	var str = '';
	str += "<div>\n";
	if(document.getElementById){
		str += this.addNode(this.root);
	}else{
		str += "浏览器不支持";
	}
	str += "\n</div>";
	return str;
}

lTree.prototype.addNode = function(node){
	var str = '';
	var n = 0;
	for(n; n < this.nodes.length;n++){
		if(this.nodes[n].pid == node.id){
			
			this.findChild(this.nodes[n]);
			
			str += this.generateNode(this.nodes[n],n);
		}
	}
	return str;
}
lTree.prototype.generateNode = function(node,n){
	var str = "<div>\n";
	str += this.indent(node);
	node.icon = node._oc ? this.img.close : this.img.open;
	node.folder = node._hc ? (node._oc ? this.img.folderopen : this.img.folder) : this.img.file;
	if(node.pid == this.root.id){
		node.icon = null;
		node.folder = this.img.home;
	}
	if(!node._hc) node.icon = null;
	//拼的烂就一个字
	
	str += node.icon == null ? (node.pid == this.root.id ? "<img src='"+node.folder+"'/>" : 
		"<img src=\""+this.img.empty+"\">") : 
		"<a href='javascript:"+this.objName+".o("+n+")'><img id='i"+this.objName+n+"' src=\""+node.icon+"\"/></a>";

	if(node.pid != this.root.id){
		if(node.url){
			str += "<a href=\""+node.url+"\"><img id='f"+this.objName+n+"' src="+node.folder+">"+node.name+"</a>";
		}else{
			if(node._hc){
				str += "<a href='javascript:"+this.objName+".o("+n+")'><img id='f"+this.objName+n+"' src="+node.folder+">"+node.name+"</a>";
			}else
				str += "<a><img id='f"+this.objName+n+"' src="+node.folder+">"+node.name+"</a>";
		}
	}else{
		str += "<a>"+node.name+"</a>";
	}
	
	str += "\n</div>";
	if(node._hc){
		var style = node.pid != this.root.id ? "display:none" : "display:block";
		str += "<div id=\"s"+this.objName+n+"\" style=\""+style+"\">\n";
		str += this.addNode(node);
		str +="\n</div>"
	}
	this.indents.pop();
	return str;
}


// find is not child 
lTree.prototype.findChild = function(node){
	var n = 0;
	var lastId;
	for(n; n < this.nodes.length;n++){
		if(this.nodes[n].pid == node.id) node._hc = true;
		if(this.nodes[n].pid == node.pid) lastId = this.nodes[n].id; 
	}
	if(lastId == node.id){
		node._ls = true;
	}
}

lTree.prototype.indent = function(node){

	var str = '';
	if(node.pid != this.root.id){
		for(i = 0;i<this.indents.length;i++)
			str += "<img src=\""+this.img.empty+"\">";
		this.indents.push(0);
	}
	return str;
}
lTree.prototype.openAll = function(){
	this.oAll(true);
}
lTree.prototype.closeAll = function(){
	this.oAll(false);
}
lTree.prototype.o = function(n){
	var node = this.nodes[n];
	this.nodeStatus(!node._oc,node,n);
}
lTree.prototype.oAll = function(s){
	for(i = 0;i<this.nodes.length;i++){
		if(this.nodes[i]._hc && this.nodes[i].pid != this.root.id){
			this.nodeStatus(s,this.nodes[i],i);
		}
	}
}

lTree.prototype.nodeStatus = function(status,node,i){
		var is = document.getElementById("i"+this.objName+i);
		var f = document.getElementById("f"+this.objName+i);
		var s = document.getElementById("s"+this.objName+i);
		is.src = status ? this.img.close : this.img.open;
		f.src = status ? this.img.folderopen : this.img.folder;
		s.style.display = status ? "block" : "none";
		node._oc = status;
}




