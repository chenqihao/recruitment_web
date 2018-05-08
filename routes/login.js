var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var personModel = require('../models/db.js');


router.get('/', function(req, res, next) {
	if (req.session.user){
		res.redirect('/index');
	}else{
		res.render('login', {title: '登录界面'});
	}
});

// router.post('/',function(req, res){
// 	// if(req.body.username == 'hello' && req.body.password == 'world'){
// 	// 	res.cookie('authorized', req.body.username);
// 	// 	res.redirect('/index');
// 	// }else{
// 	// 	res.render('login', {flag: 1, title: '登录界面'});
// 	// }
// 	res.json('ok');
// });
router.post('/',function(req,res){
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('hex')
	var loginData = {
		username: req.body.username,
		password: password
	};
	var loginType = req.body.loginType;
	// swtich(loginType)
	// {case 'person':

	// }
	personModel.personLogin(loginData, function(status){
		if (status == 'ok'){
			req.session.user = loginData.username;
			res.json({status:status, flag:1});
		}else{
			res.json({status:status, flag:0});
		}
	});
	// res.json('ok');
	// res.render('login', {flag: 1, title: '登录界面'});
});

router.get('/asd', function(req, res){
	// console.log(req.session.user);
	var md5 = crypto.createHash('md5');
	var registerData = {
		username: 'fsc',
		password: md5.update('789').digest('hex')
	}
	personModel.register(registerData, function(status){
		res.json(status);
	});
});


module.exports = router;