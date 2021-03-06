var express = require('express');
var router = express.Router();
var url = require('url');
var staticModel = require('../models/static_db.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.session.user){
		res.render('index', {
		title: '网络招聘系统',
		userdata: req.session.user,
		// username: req.session.user.username,
		// usertype: req.session.user.usertype
	});
	}else{
		res.redirect('/login');
	}
});

router.get('/cleanSession', function(req, res, next) {
	req.session.destroy(function(err) {
		if(err){
			res.json({ret_code: 2, ret_msg: '退出登录失败'});
		}else{
			res.clearCookie('mycookie');
			res.json({ret_code: 0, ret_msg: '成功退出登录'});
		}
	});
});

router.post('/get_function', function(req, res){
	staticModel.getFunction(req.body.number, function(err, data){
		if (err){
			res.json({status:err, flag:0});
		}else {
			res.json({status:data, flag:1})
		}
	});
});

router.post('/get_job', function(req, res){
	staticModel.getJob(req.body.number, function(err, data){
		if (err){
			res.json({status:err, flag:0});
		}else {
			res.json({status:data, flag:1})
		}
	});
});

router.post('/get_city', function(req, res){
	staticModel.getCity(req.body.number, function(err, data){
		if (err){
			res.json({status:err, flag:0});
		}else {
			res.json({status:data, flag:1})
		}
	});
});


module.exports = router;