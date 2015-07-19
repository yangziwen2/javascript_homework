window.onload=function(){
	var oPf=document.getElementById('pingfen');
	var aLi=oPf.getElementsByTagName('li');
	
	for(var i=0;i<aLi.length;i++){
		(function(i){
			aLi[i].onmouseover=function(){
				for(var j=0;j<aLi.length;j++){
					var leftFlag = j%2? -14: 0;
					if(j<=i)
					{
						aLi[j].style.background='url(star.gif) no-repeat '+leftFlag+'px -29px';
					}
					else
					{
						aLi[j].style.background='url(star.gif) no-repeat '+leftFlag+'px 0';
					}
				}
			}
			aLi[i].onmousedown=function ()
			{
				alert('提交成功:'+(i+1)/2+'分');
			};
		})(i);
	}
};