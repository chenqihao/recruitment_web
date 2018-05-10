$(document).ready(function(){
	if (usertype == 'admin'){
		$(".admin_need_hide").hide();
	}
	$(".logout_area").click(function(){
		// alert('1');
		$.get('/index/cleanSession', function(data, status){
			if (status == 'success'){
				if(data.ret_code != 0){
					alert(data.ret_msg);
				}else{
					alert(data.ret_msg + "，即将返回登录界面");
					window.location.href = "index";
				}
			}else{
				alert('clean failed');
			}
		});
	});
	$(".modinfo_area").click(function(){
		window.location.href = "modinfo";
	});
	$(".username_area").click(function(){
		$(".toggle_box").slideToggle(400);
	});
	$(".chgpwd_area").click(function(){
		var postUrl = '/chgpwd';
		var postData = {
			username: username,
			usertype: usertype,
			isResetPwd: false
		};
		$.StandardPost(postUrl,postData);
	});
});

$.extend({
    StandardPost:function(url,args){
        var body = $(document.body),
            form = $("<form method='post'></form>"),
            input;
        form.attr({"action":url, "display":"none"});
        $.each(args,function(key,value){
            input = $("<input type='hidden'>");
            input.attr({"name":key});
            input.val(value);
            form.append(input);
        });

        form.appendTo(document.body);
        form.submit();
        document.body.removeChild(form[0]);
    }
});