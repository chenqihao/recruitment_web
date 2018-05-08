var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var loginRegModel = require('../models/db.js');



router.get('/', function(req, res, next) {
	if (req.session.user){
		res.redirect('/index');
	}else{
		res.render('login', {title: '登录界面'});
	}
});

router.post('/',function(req,res){
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('hex');
	var loginData = {
		username: req.body.username,
		password: password,
		loginType: req.body.loginType
	};
	// var loginType = req.body.loginType;
	loginRegModel.login(loginData, function(status){
		if (status == 'ok'){
			req.session.user = {
				username: loginData.username,
				usertype: loginData.loginType
			};
			res.json({status:status, flag:1});
		}else{
			res.json({status:status, flag:0});
		}
	});
	// res.json('ok');
	// res.render('login', {flag: 1, title: '登录界面'});
});



module.exports = router;