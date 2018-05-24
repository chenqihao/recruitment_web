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

router.get('/show_job', function(req, res){
	var urlData = url.parse(req.url, true).query;
	staticModel.showJob(urlData.number, function(err, data){
		if (err){
			res.json({status:err, flag:0});
		}else {
			res.json({status:data, flag:1});
		}
	});
});

router.get('/show_city', function(req, res){
	var urlData = url.parse(req.url, true).query;
	staticModel.showCity(urlData.number, function(err, data){
		if (err){
			res.json({status:err, flag:0});
		}else {
			var cityData = data;
			var province;
			switch(urlData.number.slice(0,2)){
				case '11' :
				province = '北京市';
				break;
				case '12' :
				province = '天津市';
				break;
				case '13' :
				province = '河北省';
				break;
				case '14' :
				province = '山西省';
				break;
				case '15' :
				province = '内蒙古自治区';
				break;
				case '21' :
				province = '辽宁省';
				break;
				case '22' :
				province = '吉林省';
				break;
				case '23' :
				province = '黑龙江省';
				break;
				case '31' :
				province = '上海市';
				break;
				case '32' :
				province = '江苏省';
				break;
				case '33' :
				province = '浙江省';
				break;
				case '34' :
				province = '安徽省';
				break;
				case '35' :
				province = '福建省';
				break;
				case '36' :
				province = '江西省';
				break;
				case '37' :
				province = '山东省';
				break;
				case '41' :
				province = '河南省';
				break;
				case '42' :
				province = '湖北省';
				break;
				case '43' :
				province = '湖南省';
				break;
				case '44' :
				province = '广东省';
				break;
				case '45' :
				province = '广西壮族自治区';
				break;
				case '46' :
				province = '海南省';
				break;
				case '50' :
				province = '重庆市';
				break;
				case '51' :
				province = '四川省';
				break;
				case '52' :
				province = '贵州省';
				break;
				case '53' :
				province = '云南省';
				break;
				case '54' :
				province = '西藏自治区';
				break;
				case '61' :
				province = '陕西省';
				break;
				case '62' :
				province = '甘肃省';
				break;
				case '63' :
				province = '青海省';
				break;
				case '64' :
				province = '宁夏回族自治区';
				break;
				case '65' :
				province = '新疆维吾尔自治区';
				break;
				case '71' :
				province = '台湾省';
				break;
				case '81' :
				province = '香港特别行政区';
				break;
				case '82' :
				province = '澳门特别行政区';
				break;
			}
			res.json({province:province, status:cityData, flag:1});
		}
	});
});

module.exports = router;