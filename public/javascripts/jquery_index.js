$(document).ready(function(){
	$(".logout_area").click(function(){
		// alert('1');
		$.get('/index/cleanSession', function(data, status){
			if (status == 'success'){
				if(data.ret_code != 0){
					alert(data.ret_msg);
				}else{
					alert(data.ret_msg + "，即将返回登录界面");
					window.location.href = "/index";
				}
			}else{
				alert('clean failed');
			}
		});
	});
	$(".modinfo_area").click(function(){
		window.location.href = "/modinfo";
	});
	$(".username_area").click(function(){
		$(".toggle_box").slideToggle(400);
	});
	$(".chgpwd_area").click(function(){
		var postUrl = '/chgpwd';
		var postData = {
			username: $(".hidden_username").val(),
			usertype: $(".hidden_usertype").val(),
			isResetPwd: false
		};
		$.StandardPost(postUrl,postData);
	});
	$(".redirect_resume_button").click(function(){
		window.location.href = '/person/resumelist';
	});
	$(".redirect_jobmgmt_button").click(function(){
		window.location.href = '/company/offerlist';
	});
	$(".redirect_jobsearch_button").click(function(){
		window.location.href = '/common/offer_search';
	});
	$(".redirect_peoplesearch_button").click(function(){
		window.location.href = '/common/resume_search';
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

function industryChange(number){
	$.post('/index/get_function', {number:number}, function(data, status){
		if (status == 'success'){
			if (data.flag == '1'){
				var str = '<option value selected="selected"></option>';
				for (var i in data.status){
					str += '<option value="' + data.status[i].number + '">' + data.status[i].name + '</option>';
				}
				$(".select_function").empty().append(str);
				$(".select_job").empty();
			}else {
				alert(data.status);
			}
		}else {
			alert('post failed');
		}
	});
};

function functionChange(number){
	$.post('/index/get_job', {number:number}, function(data, status){
		if (status == 'success'){
			if (data.flag == '1'){
				var str = '<option value selected="selected"></option>';
				for (var i in data.status){
					str += '<option value="' + data.status[i].number + '">' + data.status[i].name + '</option>';
				}
				$(".select_job").empty().append(str);
			}else {
				alert(data.status);
			}
		}else {
			alert('post failed');
		}
	});
};

function provinceChange(number){
	$.post('/index/get_city', {number:number}, function(data, status){
		if (status == 'success'){
			if (data.flag == '1'){
				var str = '<option value selected="selected"></option>';
				for (var i in data.status){
					str += '<option value="' + data.status[i].number + '">' + data.status[i].name + '</option>';
				}
				$(".select_city").empty().append(str);
			}else {
				alert(data.status);
			}
		}else {
			alert('post failed');
		}
	});
};

function toResumeMod(_id){
	window.location.href = "/person/modify_resume?_id="+_id;
};

function toOfferMod(_id){
	window.location.href = "/company/modify_offer?_id="+_id;
};


