/*1 提示 begin*/
function wb_search()
{	
	document.getElementById("wb_search").className='wb_inp left';
    document.getElementById("wb_search").value='搜索一下';
    document.getElementById("wb_search").onblur=function(){if(this.value==''){this.value='搜索一下';this.className='wb_inp left'} 
    };
    document.getElementById("wb_search").onfocus=function(){if(this.value=='搜索一下'){this.value='';this.className='wb_inp_an left'}}; 
}

function wb_search1()
{	
	document.getElementById("wb_inp1").className='inp';
    document.getElementById("wb_inp1").value='请输入密码';
    document.getElementById("wb_inp1").onblur=function(){if(this.value==''){this.value='请输入密码';this.className='inp'} 
    };
    document.getElementById("wb_inp1").onfocus=function(){if(this.value=='请输入密码'){this.value='';}}; 
}

/*2 tag标签切换 begin*/
function selecttag(showcontent,selfobj){
	var oDiv=document.getElementById('topic_le');
	var oUl=oDiv.getElementsByTagName('ul')[0];
	var tag = oUl.getElementsByTagName("li");
	var taglength = tag.length;
	for(i=0; i<taglength; i++){
		tag[i].className = "";
	}
	selfobj.className = "active";
	for(i=0; j=document.getElementById("tagcontent"+i); i++){
		j.style.display = "none";
	}
	document.getElementById(showcontent).style.display = "block";	
}

function selecttag1(showcontent,selfobj){
	var oDiv=document.getElementById('topic_le1');
	var oUl=oDiv.getElementsByTagName('ul')[0];
	var tag = oUl.getElementsByTagName("li");
	var taglength = tag.length;
	for(i=0; i<taglength; i++){
		tag[i].className = "";
	}
	selfobj.className = "active";
	for(i=0; j=document.getElementById("wtagcontent"+i); i++){
		j.style.display = "none";
	}
	document.getElementById(showcontent).style.display = "block";	
}

/*3 显示登录注册 begin*/
function wb_show(obj1,obj2,obj3){
	document.getElementById(obj1).style.display="none";
	document.getElementById(obj2).style.display="block";
	document.getElementById(obj3).style.display="block";	
}
function wb_show1(obj1,obj2,obj3){
	document.getElementById(obj1).style.display="block";
	document.getElementById(obj2).style.display="none";
	document.getElementById(obj3).style.display="none";	
}
/*4 滚动 begin*/
function scroll(){
	var oDiv=document.getElementById('wb_scroll');
	var aLi=getElementsByClassName(oDiv,'le_list');
	var timer=null;
	var i=0;
	
	timer=setInterval(function(){
		i++;
		oDiv.insertBefore(aLi[i], aLi[0]);
		var iHeight=aLi[i].offsetHeight;
		aLi[i].style.height='0px';
		
		startMove(aLi[i], 'height', iHeight, function (){
			startMove(aLi[i], 'opacity', 100);										
		});
	},1000);
}

function getElementsByClassName(obj, className){
	if(obj.getElementsByClassName){
		return obj.getElementsByClassName(className);
	}
	var resultArr = [];
	var eles = obj.getElementsByTagName('*');
	for(var i=0; i<eles.length; i++){
		var classArr = eles[i].className.split(' ');
		for(var j=0; j<classArr.length; j++){
			if(classArr[j] == className){
				resultArr.push(eles[i]);
				break;
			}
		}
	}
	return resultArr;
}















