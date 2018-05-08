$(document).ready(function(){
	register_type_str = 'person';
	isPswConfirm = false;
	$("#register_type_person").css({"font-size":"18px","color":"#0099FF","border-bottom":"1px solid #0099FF"});
	$(".person_need_hide").hide();
	$(".company_need_hide").show();
	$(".register_type").click(function(){
		$(this).css({"font-size":"18px","color":"#0099FF","border-bottom":"1px solid #0099FF"});
		$(".register_type").not(this).css({"font-size":"16px","color":"white","border-bottom":"1px solid white"});
		switch($(this).attr("id"))
		{
		case "register_type_person":
			$(".person_need_hide").hide();
			$(".company_need_hide").show();
			register_type_str = 'person';
			break;
		case "register_type_company":
			$(".person_need_hide").show();
			$(".company_need_hide").hide();
			register_type_str = 'company';
			break;
		}
	});
	$(".redirect_login_button").click(function(){
		window.location.href = "login";
	});
	$("#register_username").blur(function(){
		var username = this.value;

	});
	$("#register_password_confirm").blur(function(){
		var password = document.getElementById('register_password').value;
		var confirmPassword = this.value;
		if (password != confirmPassword){
			$(".error_password_confirm").text('两次输入的密码不相同');
			$(".help_block_error").not(".error_password_confirm").text('');
			isPswConfirm = false;
		}else{
			isPswConfirm = true;
		}
	});
	$("#register_password_confirm").focus(function(){
		$(".error_password_confirm").text('');
	});
	$("#register_password").focus(function(){
		$(".error_password").text('');
	});
	$("#register_username").focus(function(){
		$(".error_username").text('');
	});
	$("#register_email").focus(function(){
		$(".error_email").text('');
	});
	$("#register_realname").focus(function(){
		$(".error_realname").text('');
	});
	$("#register_IDnumber").focus(function(){
		$(".error_IDnumber").text('');
	});
	$("#register_address").focus(function(){
		$(".error_address").text('');
	});
	$("#register_companyname").focus(function(){
		$(".error_companyname").text('');
	});
	$(".register_button").click(function(){
		var username = document.getElementById('register_username').value;
		if (username.replace(/(^s*)|(s*$)/g, "").length == 0){
			$(".error_username").text('用户名不能为空');
			$(".help_block_error").not(".error_username").text('');
			return;
		}
		var password = document.getElementById('register_password').value;
		if (password.replace(/(^s*)|(s*$)/g, "").length == 0){
			$(".error_password").text('密码不能为空');
			$(".help_block_error").not(".error_password").text('');
			return;
		}
		if (!isPswConfirm){
			$(".error_password_confirm").text('未确认密码');
			$(".help_block_error").not(".error_password_confirm").text('');
			return;
		}
		var email = document.getElementById('register_email').value;
		if (email.replace(/(^s*)|(s*$)/g, "").length == 0){
			$(".error_email").text('邮箱不能为空');
			$(".help_block_error").not(".error_email").text('');
			return;
		}
		if (register_type_str == 'person'){
			var realname = document.getElementById('register_realname').value;
			if (realname.replace(/(^s*)|(s*$)/g, "").length == 0){
				$(".error_realname").text('姓名不能为空');
				$(".help_block_error").not(".error_realname").text('');
				return;
			}
			var IDnumber = document.getElementById('register_IDnumber').value;
			if (IDnumber.replace(/(^s*)|(s*$)/g, "").length == 0){
				$(".error_IDnumber").text('身份证号不能为空');
				$(".help_block_error").not(".error_IDnumber").text('');
				return;
			}
			var postData = {
				username: username,
				password: password,
				email: email,
				realname: realname,
				IDnumber: IDnumber,
				registerType: register_type_str
			}
		}else {
			var companyname = document.getElementById('register_companyname').value;
			if (companyname.replace(/(^s*)|(s*$)/g, "").length == 0){
				$(".error_companyname").text('公司名不能为空');
				$(".help_block_error").not(".error_companyname").text('');
				return;
			}
			var address = document.getElementById('register_address').value;
			if (address.replace(/(^s*)|(s*$)/g, "").length == 0){
				$(".error_address").text('公司地址不能为空');
				$(".help_block_error").not(".error_address").text('');
				return;
			}
			var postData = {
				username: username,
				password: password,
				email: email,
				companyname: companyname,
				address: address,
				registerType: register_type_str
			}
		}
		var postUrl = '/register';
		// alert(JSON.stringify(postData));
		$.post(postUrl, postData, function(data, status){
			if (status == 'success'){
				// alert(JSON.stringify(data));
				if (data.flag == 0){
					if (postData.registerType == 'person'){
						if (data.errKey == 'username'){
							$(".error_username").text(data.status);
						}else if (data.errKey == 'email'){
							$(".error_email").text(data.status);
						}else if (data.errKey == 'IDnumber'){
							$(".error_IDnumber").text(data.status);
						}
					}else{
						if (data.errKey == 'username'){
							$(".error_username").text(data.status);
						}else if (data.errKey == 'email'){
							$(".error_email").text(data.status);
						}else if (data.errKey == 'companyname'){
							$(".error_companyname").text(data.status);
						}
					}
				}else if (data.flag == 1){
					alert('注册成功，即将跳转到主页');
					window.location.href = "index";
				}else{
					alert(data.status);
				}
			}else{
				alert('post failed');
			}
		});
	});
});
