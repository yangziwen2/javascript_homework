;(function(window){
	$(function(){
		window.slideY = {
			thisUl: $('#catalog ul.small'),
			btnUp: $('#catalog a.aUp'),
			btnDown: $('#catalog a.aDown'),
			thisLi: $('#catalog ul.small li'),
			init: function () {
				slideY.thisUl.width(slideY.thisLi.length * 110);
				slideY.slideAuto();
				slideY.btnUp.click(slideY.slideTop).hover(slideY.slideStop, slideY.slideAuto);
				slideY.btnDown.click(slideY.slideDown).hover(slideY.slideStop, slideY.slideAuto);
				slideY.thisUl.hover(slideY.slideStop, slideY.slideAuto);
				slideY.thisLi.click(tab);
			},
			slideTop: function () {
				slideY.btnUp.unbind('click', slideY.slideTop);
				var lastLi = slideY.thisUl.children('li:last');
				var newFirstLi = lastLi.clone();
				newFirstLi.click(tab);
				slideY.thisUl.prepend(newFirstLi);
				slideY.thisUl.css('marginTop', -95);
				slideY.thisUl.animate({ 'marginTop': 0 }, 500, function () {
					slideY.thisUl.children('li:last').remove();
					slideY.btnUp.bind('click', slideY.slideTop);
				});
				return false;
			},
			slideDown: function () {
				slideY.btnDown.unbind('click', slideY.slideDown);
				var firstLi = slideY.thisUl.children('li:first');
				var newLastLi = firstLi.clone();
				newLastLi.click(tab);
				slideY.thisUl.append(newLastLi);
				slideY.thisUl.animate({ 'marginTop': -95 }, 500, function () {
					slideY.thisUl.css('marginTop', '0');
					slideY.thisUl.children('li:first').remove();
					slideY.btnDown.bind('click', slideY.slideDown);
				});
				return false;
			},
			slideAuto: function () {
				slideY.intervalId = window.setInterval(slideY.slideDown, 3000);
			},
			slideStop: function () {
				window.clearInterval(slideY.intervalId);
			}
		};
		window.tab = function() { 
			$(this).addClass("active").siblings().removeClass("active"); 
			var tab = $(this).attr("title"); 
			$("#" + tab).fadeIn("slow").siblings().hide(); 
		}; 
	});
})(window);