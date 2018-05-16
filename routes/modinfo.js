var express = require('express');
var router = express.Router();
var accMgmtModel = require('../models/account_db.js');

router.get('/',function(req, res){
	if (req.session.user){
		if (req.session.user.usertype == 'admin'){
			res.redirect('/404');
		}
		// console.log(req.session.user.usertype);
		accMgmtModel.accInfo({
			username: req.session.user.username,
			usertype: req.session.user.usertype
		},function(err, data){
			if (err == 'ok'){
				var accinfoData = data;
				accinfoData.usertype = req.session.user.usertype;
				res.render('modinfo', {
					title:'修改信息',
					infoData: accinfoData
				});
			}else {
				res.json(err);
			}
		});
	}else{
		res.redirect('/login')
	}
});

router.post('/', function(req, res){
	var modinfoData = req.body;
	// console.log(modinfoData);
	accMgmtModel.modInfo(modinfoData, function(status){
		if (status == 'ok'){
			res.json({status:status, flag:1});
		}else{
			res.json({status:status, flag:0});
		}
	});
});

module.exports = router;