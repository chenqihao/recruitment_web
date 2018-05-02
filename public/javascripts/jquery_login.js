// var script=document.createElement("script");
// script.type="text/javascript";
// script.src="jquery.js"
//document.getElementByTagName('head')[0].appendChild(script);
// alert("My First JavaScript");
$(document).ready(function(){
	$(".login_person").css({"font-size":"18px","color":"#0099FF","border-bottom":"1px solid #0099FF"});
	$(".login_type").click(function(){
		$(this).css({"font-size":"18px","color":"#0099FF","border-bottom":"1px solid #0099FF"});
		$(".login_type").not(this).css({"font-size":"16px","color":"white","border-bottom":"1px solid white"});
		switch($(this).attr("class"))
		{
		case "login_person login_type":
			$("#login_username").attr('placeholder',"用户名 / 邮箱");
			$(".register_button").show();
			break;
		case "login_company login_type":
			$("#login_username").attr('placeholder',"公司名 / 邮箱");
			$(".register_button").show();
			break;
		case "login_admin login_type":
			$("#login_username").attr('placeholder',"用户名");
			$(".register_button").hide();
			break;
		}
	});
});
$(document).ready(function(){
	$(".register_button").click(function(){
		$.get('/register', function(){});
	});
});
