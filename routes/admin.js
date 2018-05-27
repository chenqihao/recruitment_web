var express = require('express');
var url = require('url');
var router = express.Router();
var resumeModel = require('../models/resume_db.js');
var personModel = require('../models/person_mgmt_db.js');
var offerModel = require('../models/offer_db.js');
var companyModel = require('../models/company_mgmt_db.js');


router.get('/offer_verify', function(req, res){
	if(req.session.user && req.session.user.usertype == 'admin'){
		offerModel.listByStatus({isNeedVerify: true}, function(err, data){
			if (err){
				res.json(err);
			}else {
				var urlData = url.parse(req.url, true).query;
				var page = urlData.page;
				if (page == null){
					page = 1;
				}
				res.render('offerlist', {
					title: '职位审核',
					userdata: req.session.user,
					offerList: data.slice((page-1)*10, page*10),
					page: page,
					maxpage: parseInt((data.length-1)/10)+1,
				});
			}
		});
	}else {
		res.redirect('/login');
	}
});

router.get('/registerlist', function(req, res){
	if(req.session.user && req.session.user.usertype == 'admin'){
		companyModel.getRegList({isApproved: false}, function(err, data){
			if (err){
				res.json(err);
			}else {
				var urlData = url.parse(req.url, true).query;
				var page = urlData.page;
				if (page == null){
					page = 1;
				}
				res.render('registerlist', {
					title: '注册审核',
					userdata: req.session.user,
					registerList: data.slice((page-1)*10, page*10),
					page: page,
					maxpage: parseInt((data.length-1)/10)+1,
				});
			}
		});
	}else {
		res.redirect('/login');
	}
});


router.get('/offer_browse', function(req, res){
	if(req.session.user && req.session.user.usertype == 'admin'){
		var urlData = url.parse(req.url, true).query;
		if (JSON.stringify(urlData) == '{}'){
			res.redirect('../offer_verify');
		}else {
			offerModel.findById({_id: urlData._id}, function(err, data){
				if (err){
					res.json(err);
				}else {
					if (data != null){
						res.render('offer_browse', {
							title:'职位浏览',
							userdata: req.session.user,
							offerData: data,
						});
					}else {
						res.json('no data');
					}
				}
			});
		}
	}else {
		res.redirect('/login');
	}
});

router.get('/resume_browse', function(req, res){
	if(req.session.user && req.session.user.usertype == 'admin'){
		var urlData = url.parse(req.url, true).query;
		if (JSON.stringify(urlData) == '{}'){
			res.redirect('../common/resume_search');
		}else {
			resumeModel.findById({_id: urlData._id}, function(err, data){
				if (err){
					res.json(err);
				}else {
					if (data != null){
						res.render('resume_browse', {
							title:'简历浏览',
							userdata: req.session.user,
							resumeData: data,
						});
					}else {
						res.json('no data');
					}
				}
			});
		}
	}else {
		res.redirect('/login');
	}
});

router.post('/approve', function(req, res){
	if(req.session.user && req.session.user.usertype == 'admin'){
		offerModel.adminApprove({
			Data: req.body,
		}, function(status){
			if(status == 'ok'){
				res.json({status:status, flag:1});
			}else {
				res.json({status:status, flag:0});
			}
		});
	}else{
		res.json({status:'user error', flag:0});
	}
});

router.post('/reject', function(req, res){
	if(req.session.user && req.session.user.usertype == 'admin'){
		offerModel.adminReject({
			Data: req.body,
		}, function(status){
			if(status == 'ok'){
				res.json({status:status, flag:1});
			}else {
				res.json({status:status, flag:0});
			}
		});
	}else{
		res.json({status:'user error', flag:0});
	}
});

router.post('/privatize', function(req, res){
	if(req.session.user && req.session.user.usertype == 'admin'){
		resumeModel.adminPrivatize({
			Data:{
				_id:req.body._id,
			}
		}, function(status){
			if (status == 'ok'){
				res.json({status:status, flag:1});
			}else {
				res.json({status:status, flag:0});
			}
		});
	}else{
		res.json({status:'user error', flag:0});
	}
});

router.post('/delete_resume', function(req, res){
	if(req.session.user && req.session.user.usertype == 'admin'){
		resumeModel.adminDelete({
			Data:{
				_id:req.body._id,
			}
		}, function(status){
			if (status == 'ok'){
				res.json({status:status, flag:1});
			}else {
				res.json({status:status, flag:0});
			}
		});
	}else{
		res.json({status:'user error', flag:0});
	}
});

router.post('/approve_register', function(req, res){
	if(req.session.user && req.session.user.usertype == 'admin'){
		companyModel.adminApprove({
			username:req.body.username,
		}, function(status){
			if (status == 'ok'){
				res.json({status:status, flag:1});
			}else {
				res.json({status:status, flag:0});
			}
		});
	}else {
		res.json({status:'user error', flag:0});
	}
});


router.post('/delete_register', function(req, res){
	if(req.session.user && req.session.user.usertype == 'admin'){
		companyModel.adminReject({
			username:req.body.username,
		}, function(status){
			if (status == 'ok'){
				res.json({status:status, flag:1});
			}else {
				res.json({status:status, flag:0});
			}
		});
	}else {
		res.json({status:'user error', flag:0});
	}
});


module.exports = router;