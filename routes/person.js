var express = require('express');
var crypto = require('crypto');
var url = require('url');
var router = express.Router();
var resumeModel = require('../models/resume_db.js');

router.get('/', function(req, res){
	var urlData = url.parse(req.url, true).query;
	resumeModel.createResume(urlData, function(err){
		res.json(err);
	});
});

router.get('/resumelist', function(req, res){
	if(req.session.user){
		resumeModel.listByOwner({owner: req.session.user.username}, function(err, data){
			if (err){
				res.redirect('/404');
			}else {
				var urlData = url.parse(req.url, true).query;
				var page = urlData.page;
				if (page == null){
					page = 1;
				}
				res.render('resumelist', {
					title: '简历管理',
					userdata: req.session.user,
					resumeList: data.slice((page-1)*10, page*10),
					page: page,
					maxpage: parseInt((data.length-1)/10)+1,
				});
			}
		});
	}else {
		res.redirect('/login');
	}
});

router.get('/test', function(req, res){
	res.json(url.parse(req.url, true).query);
});


router.get('/myresume', function(req, res){
	if(req.session.user){
		var urlData = url.parse(req.url, true).query;
		if (JSON.stringify(urlData) == '{}'){
			res.redirect('../resumelist')
		}else {
			resumeModel.findById({_id: urlData._id}, function(err, data){
				if (err){
					res.json(err);
				}else {
					if (data != null){
						res.json(data);
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

router.post('/remove_resume', function(req, res){
	// console.log(req.body);
	resumeModel.removeResume(req.body, function(status){
		// console.log(status);
		if (status == 'ok'){
			res.json({status:status, flag:1});
		}else {
			res.json({status:status, flag:0});
		}
	});
});

router.get('/create_resume', function(req, res){
	if(req.session.user){
		res.render('resume', {
			title:'新建简历',
			userdata: req.session.user,
		});
	}else {
		res.redirect('/login');
	}
});

module.exports = router;
