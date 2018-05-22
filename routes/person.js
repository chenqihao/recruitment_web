var express = require('express');
var crypto = require('crypto');
var url = require('url');
var router = express.Router();
var resumeModel = require('../models/resume_db.js');
var personModel = require('../models/person_mgmt_db.js');

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
						res.render('resume', {
							title:'修改简历',
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
		personModel.personAccInfo({username:req.session.user.username}, function(err, data){
			if (err == 'ok'){
				var resumeData = {
					realname: data.realname,
					email: data.email,
					sex: data.sex,
					age: data.age,
				}
				res.render('resume', {
					title:'新建简历',
					userdata: req.session.user,
					resumeData: resumeData,
				});
			}else {
				res.json(err);
			}
		});
	}else {
		res.redirect('/login');
	}
});

router.post('/create_resume', function(req, res){
	if(req.session.user){
		resumeModel.listByOwner({owner: req.session.user.username}, function(err, data){
			if (err){
				res.redirect('/404');
			}else {
				var isNoDefault = true;
				for (var i in data){
					if(data[i].isDefault){
						isNoDefault = false;
						break;
					}
				}
				var resumeData = req.body;
				if (isNoDefault){
					resumeData['isDefault'] = true;
					resumeData['isPublic'] = true;
				}else {
					resumeData['isDefault'] = false;
					resumeData['isPublic'] = false;
				}
				resumeData['salary'] = JSON.parse(resumeData.salary);
				// console.log(resumeData);
				resumeModel.createResume(resumeData, function(status){
					if (status == 'ok'){
						res.json({status:status, flag:1});
					}else {
						res.json({status:status, flag:0});
					}
				});
			}
		});
	}else {
		res.redirect('/login');
	}
});

router.post('/modify_resume', function(req, res){
	var resumeData = req.body;
	resumeData['salary'] = JSON.parse(resumeData.salary);
	resumeModel.modById(resumeData, function(status){
		if (status == 'ok'){
			res.json({status:status, flag:1});
		}else {
			res.json({status:status, flag:0});
		}
	});
});

router.post('/modify_default', function(req, res){
	if(req.session.user){
		resumeModel.listByOwner({owner: req.session.user.username}, function(err, data){
			if (err){
				res.json({status:err, flag:0});
			}else {
				var offid;
				for(var i in data){
					if(data[i].isDefault){
						offid = data[i]._id;
						break;
					}
				}
				if (offid) {
					resumeModel.modById({
						_id:offid,
						isDefault:false,
						isPublic:false,
					},function(status){
						if (status == 'ok'){
							resumeModel.modById({
								_id:req.body._id,
								isDefault:true,
								isPublic:true,
							}, function(status){
								if (status == 'ok'){
									res.json({status:status, flag:1});
								}else {
									res.json({status:status, flag:0});
								}
							});
						}else {
							res.json({status:status, flag:0});
						}
					});
				}else {
					resumeModel.modById({
						_id:req.body._id,
						isDefault:true,
						isPublic:true,
					}, function(status){
						if (status == 'ok'){
							res.json({status:status, flag:1});
						}else {
							res.json({status:status, flag:0});
						}
					});
				}
			}
		});
	}else {
		res.redirect('/login');
	}
});

router.post('/modify_public', function(req, res){
	if(req.session.user){
		resumeModel.listByOwner({owner: req.session.user.username}, function(err, data){
			if (err){
				res.json({status:err, flag:0});
			}else {
				for(var i in data){
					if(data[i]._id == req.body._id){
						if (data[i].isDefault){
							resumeModel.modById({
								_id:req.body._id,
								isPublic:!data[i].isPublic,
							}, function(status){
								if (status == 'ok'){
									res.json({status:status, flag:1});
								}else {
									res.json({status:status, flag:0});
								}
							});
						}else {
							res.json({status:status, flag:0});
						}
						break;
					}
				}
			}
		});
	}else {
		res.redirect('/login');
	}
});

module.exports = router;
