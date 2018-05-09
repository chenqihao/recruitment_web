var express = require('express');
var router = express.Router();
var accMgmtModel = require('../models/db.js');


router.get('/', function(req, res, next) {
	if (req.session.user){
		res.redirect('/index');
	}else{
		res.render('resetpwd', {title: '找回密码'});
	}
});

router.post('/', function(req, res){
	accMgmtModel.cfmEmail(req.body, function(status){
		if (status == 'ok'){
			res.json({status:status, flag:1});
		}else{
			res.json({status:status, flag:0});
		}
	});
});


module.exports = router;