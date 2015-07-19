$(function() {
	$(".tab").each(function() {
		$(this).find("tr:not(:first):odd").addClass("odd").find("td:first").addClass("bg2");
		$(this).find("tr:not(:first):even").addClass("even").find("td:first").addClass("bg1");
	});
	$(".hasCheck").find("tr:not(:first):odd").addClass("odd").find("td:lt(2)").addClass("bg2");
	$(".hasCheck").find("tr:not(:first):even").addClass("even").find("td:lt(2)").addClass("bg1");	
	$(".hasCheck").find("tr").find("td:first").removeClass();
	
	/*
	$(".tab1").each(function() {
        $(this).find("tr:not(:first):odd").addClass("odd").find("td:first").addClass("bg2");
        $(this).find("tr:not(:first):even").addClass("even").find("td:first").addClass("bg1");
    });
    */
});