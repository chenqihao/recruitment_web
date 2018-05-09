var express = require('express');
var router = express.Router();
var accMgmtModel = require('../models/db.js');

router.get('/',function(req, res){
	if (req.session.user){
		accMgmtModel.accInfo({
			username: req.session.user.username,
			usertype: req.session.user.usertype
		},function(status){
			if (status.err != null){
				var accinfoData = status;
				accinfoData.usertype = req.session.username.usertype;
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






module.exports = router;