var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var accMgmtModel = require('../models/account_db.js');

router.get('/', function(req, res, next) {
	res.render('register', {title: '注册界面'});
});

router.post('/',function(req, res){
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('hex');
	if(req.body.usertype == 'person'){
		var registerData = {
			username: req.body.username,
			password: password,
			email: req.body.email,
			realname: req.body.realname,
			IDnumber: req.body.IDnumber,
			usertype: req.body.usertype
		};
	}else{
		var registerData = {
			username: req.body.username,
			password: password,
			email: req.body.email,
			companyname: req.body.companyname,
			companytype: req.body.companytype,
			address: req.body.address,
			representative: req.body.representative,
			usertype: req.body.usertype
		};
	}
	accMgmtModel.register(registerData, function(status){
		if (status == 'ok'){
			if (registerData.usertype == 'person'){
				req.session.user = {
					username: registerData.username,
					usertype: registerData.usertype
				};
				res.json({status:status, flag:1});
			}else{
				res.json({status:status, flag:3});
			}
		}else if (status.code == 11000){
			if (registerData.usertype == 'person'){
				if (status.errmsg.indexOf('username') > 0){
					res.json({status:'用户名已存在', flag:0, errKey: 'username'});
				}else if (status.errmsg.indexOf('email') > 0){
					res.json({status:'邮箱已存在', flag:0, errKey: 'email'});
				}else if (status.errmsg.indexOf('IDnumber') > 0){
					res.json({status:'身份证号已存在', flag:0, errKey: 'IDnumber'});
				}
			}else {
				if (status.errmsg.indexOf('username') > 0){
					res.json({status:'用户名已存在', flag:0, errKey: 'username'});
				}else if (status.errmsg.indexOf('email') > 0){
					res.json({status:'邮箱已存在', flag:0, errKey: 'email'});
				}else if (status.errmsg.indexOf('companyname') > 0){
					res.json({status:'公司名已存在', flag:0, errKey: 'companyname'});
				}
			}
		}else {
			res.json({status:status, flag:2});
		}
	});
});



module.exports = router;