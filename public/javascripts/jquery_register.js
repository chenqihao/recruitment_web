$(document).ready(function(){
	usertype_str = 'person';
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
			usertype_str = 'person';
			break;
		case "register_type_company":
			$(".person_need_hide").show();
			$(".company_need_hide").hide();
			usertype_str = 'company';
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
	$(".register_button").click(function(){
		$(".help_block_error").text('');
		var username = document.getElementById('register_username').value;
		if (username.length == 0){
			$(".error_username").text('用户名不能为空');
			return;
		}else if (username.search(/\s/g) != -1){
			$(".error_username").text('用户名不能有空格');
			return;
		}
		var password = document.getElementById('register_password').value;
		if (password.length == 0){
			$(".error_password").text('密码不能为空');
			return;
		}else if (password.search(/\s/g) != -1){
			$(".error_password").text('密码不能有空格');
			return;
		}
		var confirmPassword = document.getElementById('register_password_confirm').value;
		if (confirmPassword.length == 0){
			$(".error_password_confirm").text('确认密码不能为空');
			return;
		}else if (confirmPassword.search(/\s/g) != -1){
			$(".error_password_confirm").text('确认密码不能有空格');
			return;
		}
		if(password != confirmPassword){
			$(".error_password_confirm").text('两次输入的密码不相同');
			return;
		}
		var email = document.getElementById('register_email').value;
		if (email.length == 0){
			$(".error_email").text('邮箱不能为空');
			return;
		}else if (email.search(/\s/g) != -1){
			$(".error_email").text('邮箱不能有空格');
			return;
		}
		if (usertype_str == 'person'){
			var realname = document.getElementById('register_realname').value;
			if (realname.replace(/(^\s*)|(\s*$)/g, "").length == 0){
				$(".error_realname").text('姓名不能为空');
				return;
			}
			var IDnumber = document.getElementById('register_IDnumber').value;
			if (IDnumber.length == 0){
				$(".error_IDnumber").text('身份证号不能为空');
				return;
			}else if (IDnumber.search(/\s/g) != -1){
				$(".error_IDnumber").text('身份证号不能有空格');
				return;
			}
			var postData = {
				username: username,
				password: password,
				email: email,
				realname: realname,
				IDnumber: IDnumber,
				usertype: usertype_str
			}
		}else {
			var companyname = document.getElementById('register_companyname').value;
			if (companyname.replace(/(^\s*)|(\s*$)/g, "").length == 0){
				$(".error_companyname").text('公司名不能为空');
				return;
			}
			var representative = document.getElementById('register_representative').value;
			if (representative.replace(/(^\s*)|(\s*$)/g, "").length == 0){
				$(".error_representative").text('法人不能为空');
				return;
			}
			var address = document.getElementById('register_address').value;
			if (address.replace(/(^\s*)|(\s*$)/g, "").length == 0){
				$(".error_address").text('公司地址不能为空');
				return;
			}
			var postData = {
				username: username,
				password: password,
				email: email,
				companyname: companyname,
				representative: representative,
				address: address,
				usertype: usertype_str
			}
		}
		var postUrl = '/register';
		// alert(JSON.stringify(postData));
		$.post(postUrl, postData, function(data, status){
			if (status == 'success'){
				// alert(JSON.stringify(data));
				if (data.flag == 0){
					if (postData.usertype == 'person'){
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
