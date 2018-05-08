// var script=document.createElement("script");
// script.type="text/javascript";
// script.src="jquery.js"
//document.getElementByTagName('head')[0].appendChild(script);
// alert("My First JavaScript");
$(document).ready(function(){
	login_type_str = 'person';
	$(".login_person").css({"font-size":"18px","color":"#0099FF","border-bottom":"1px solid #0099FF"});
	$(".login_type").click(function(){
		$(this).css({"font-size":"18px","color":"#0099FF","border-bottom":"1px solid #0099FF"});
		$(".login_type").not(this).css({"font-size":"16px","color":"white","border-bottom":"1px solid white"});
		switch($(this).attr("class"))
		{
		case "login_person login_type":
			$("#login_username").attr('placeholder',"用户名 / 邮箱");
			$(".register_button").show();
			login_type_str = 'person';
			break;
		case "login_company login_type":
			$("#login_username").attr('placeholder',"公司名 / 邮箱");
			$(".register_button").show();
			login_type_str = 'company';
			break;
		case "login_admin login_type":
			$("#login_username").attr('placeholder',"用户名");
			$(".register_button").hide();
			login_type_str = 'admin';
			break;
		}
	});
	$(".register_button").click(function(){
		window.location.href = "register";
	});
	$(".login_button").click(function(){
		var username = document.getElementById('login_username').value;
		if (username.replace(/(^s*)|(s*$)/g, "").length == 0){
			$(".error_username").text('用户名不能为空');
			$(".error_password").text('');
			return;
		}
		var password = document.getElementById('login_password').value;
		if (password.replace(/(^s*)|(s*$)/g, "").length == 0){
			$(".error_username").text('');
			$(".error_password").text('密码不能为空');
			return;
		}
		var postUrl = '/login';
		var postData = {
			username: username,
			password: password,
			loginType: login_type_str,
		}
		// alert(JSON.stringify(postData));
		$.post(postUrl, postData, function(data, status){
			if (status == 'success'){
				// alert(JSON.stringify(data));
				if (data.flag == 0){
					$(".error_password").text(data.status);
				}else{
					window.location.href = "index";
				}
			}else{
				alert('post failed');
			}
		});
	});

});


