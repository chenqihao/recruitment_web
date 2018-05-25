var express = require('express');
var crypto = require('crypto');
var url = require('url');
var router = express.Router();
var offerModel = require('../models/offer_db.js');
var companyModel = require('../models/company_mgmt_db.js');

// router.get('/', function(req, res){
// 	var urlData = url.parse(req.url, true).query;
// 	urlData['editdate'] = new Date();
// 	offerModel.createOffer(urlData, function(err){
// 		res.json(err);
// 	});
// });

router.get('/offerlist', function(req, res){
	if(req.session.user && req.session.user.usertype == 'company'){
		offerModel.listByOwner({owner: req.session.user.username}, function(err, data){
			if (err){
				res.json(err);
			}else {
				var urlData = url.parse(req.url, true).query;
				var page = urlData.page;
				if (page == null){
					page = 1;
				}
				res.render('offerlist', {
					title: '职位管理',
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

router.post('/remove_offer', function(req, res){
	if(req.session.user && req.session.user.usertype == 'company'){
		offerModel.removeOffer({Data:req.body, username:req.session.user.username}, function(status){
			// console.log(status);
			if (status == 'ok'){
				res.json({status:status, flag:1});
			}else {
				res.json({status:status, flag:0});
			}
		});
	}else {
		res.json({status:"未登录", flag:0});
	}
});

router.get('/modify_offer', function(req, res){
	if(req.session.user && req.session.user.usertype == 'company'){
		var urlData = url.parse(req.url, true).query;
		if (JSON.stringify(urlData) == '{}'){
			res.redirect('../offerlist');
		}else {
			offerModel.findById({_id: urlData._id}, function(err, data){
				if (err){
					res.json(err);
				}else {
					if (data != null){
						if (req.session.user.username == data.owner){
							res.render('offer', {
								title:'修改职位信息',
								userdata: req.session.user,
								offerData: data,
							});
						}else {
							res.json('user error');
						}
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

router.get('/offer_browse', function(req, res){
	if(req.session.user && req.session.user.usertype == 'company'){
		var urlData = url.parse(req.url, true).query;
		if (JSON.stringify(urlData) == '{}'){
			res.redirect('../offerlist');
		}else {
			offerModel.findById({_id: urlData._id}, function(err, data){
				if (err){
					res.json(err);
				}else {
					if (data != null){
						if (req.session.user.username == data.owner){
							res.render('offer_browse', {
								title:'职位浏览',
								userdata: req.session.user,
								offerData: data,
							});
						}else {
							res.json('user error');
						}
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

router.get('/create_offer', function(req, res){
	if(req.session.user && req.session.user.usertype == 'company'){
		companyModel.companyAccInfo({username:req.session.user.username}, function(err, data){
			if (err == 'ok'){
				var offerData = {
					email: data.email,
					companyname: data.companyname,
					companytype: data.companytype,
					address: data.address,
				}
				res.render('offer', {
					title:'新建职位',
					userdata: req.session.user,
					offerData: offerData,
				});
			}else {
				res.json(err);
			}
		});
	}else {
		res.redirect('/login');
	}
});

router.post('/create_offer', function(req, res){
	if(req.session.user && req.session.user.usertype == 'company'){
		var offerData = req.body;
		offerData['editdate'] = new Date();
		offerData['salary'] = JSON.parse(offerData.salary);
		offerModel.createOffer(offerData, function(status){
			if (status == 'ok'){
				res.json({status:status, flag:1});
			}else {
				res.json({status:status, flag:0});
			}
		});
	}else {
		res.json({status:"未登录", flag:0});
	}
});

router.post('/modify_offer', function(req, res){
	if(req.session.user && req.session.user.usertype == 'company'){
		var offerData = req.body;
		offerData['editdate'] = new Date();
		offerData['isApproved'] = false;
		offerData['salary'] = JSON.parse(offerData.salary);
		offerData['rejected_reason'] = '未审核';
		offerModel.modById({Data:offerData, username:req.session.user.username}, function(status){
			if (status == 'ok'){
				res.json({status:status, flag:1});
			}else {
				res.json({status:status, flag:0});
			}
		});
	}else {
		res.json({status:"未登录", flag:0});
	}
});

router.post('/refresh_offer', function(req, res){
	if(req.session.user && req.session.user.usertype == 'company'){
		var offerData = req.body;
		offerData['editdate'] = new Date();
		offerModel.modById({Data:offerData, username:req.session.user.username}, function(status){
			if (status == 'ok'){
				res.json({status:status, flag:1});
			}else {
				res.json({status:status, flag:0});
			}
		});
	}else {
		res.json({status:"未登录", flag:0});
	}
});

Date.prototype.Format = function(fmt) {
     var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
     for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
         }
     }
    return fmt;
};


module.exports = router;
