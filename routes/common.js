var express = require('express');
var crypto = require('crypto');
var url = require('url');
var router = express.Router();
var resumeModel = require('../models/resume_db.js');
var personModel = require('../models/person_mgmt_db.js');
var offerModel = require('../models/offer_db.js');
var companyModel = require('../models/company_mgmt_db.js');
var AipNlpClient = require("baidu-aip-sdk").nlp;

var APP_ID = "11373160";
var API_KEY = "OBl1VPXMr0t8yBH5B6Mo8Ytx";
var SECRET_KEY = "IkqEGHIp62ib93fLLdzLkhcQXvu82s0v";

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipNlpClient(APP_ID, API_KEY, SECRET_KEY);

router.get('/offer_search', function(req, res){
	 if(req.session.user){
		if (JSON.stringify(urlData) == '{}' && req.session.user.usertype == 'person'){
			offerRecommend(req.session.user.username, function(status){
				if (status.err){
					res.json(status.err);
				}else{
					console.log(JSON.stringify(status.data));
					res.json(status.data);
				}
			});
		}else{
			var urlData = url.parse(req.url, true).query;
			var page = urlData.page;
			if (page == null){
				page = 1;
			}
			offerModel.search({
				sortRul: "editdate",
				Data: {
					companyname: urlData.companyname,
					offername: urlData.offername,
					location: urlData.location,
					job: urlData.job,
					salary_min: urlData.salary_min,
					salary_max: urlData.salary_max,
				}
			}, function(err, data){
				if(err){
					res.json(err);
				}else {
					// console.log(data);
					res.render('offer_search', {
						title: '职位搜索',
						userdata: req.session.user,
						offerList: data.slice((page-1)*10, page*10),
						page: page,
						maxpage: parseInt((data.length-1)/10)+1,
						searchData: urlData,
					});
				}
			});
		}
	}else {
		res.redirect('/login');
	}
});

router.get('/resume_search', function(req, res){
	 if(req.session.user&&req.session.user.usertype != 'person'){
		if (JSON.stringify(urlData) == '{}'){
			res.json(test('JAVA', 'JAVA编程'));
		}else{
			var urlData = url.parse(req.url, true).query;
			var page = urlData.page;
			if (page == null){
				page = 1;
			}
			resumeModel.search({
				sortRul: "editdate",
				Data: {
					education: urlData.education,
					experience: urlData.experience,
					location: urlData.location,
					job: urlData.job,
					salary_min: urlData.salary_min,
					salary_max: urlData.salary_max,
				}
			}, function(err, data){
				if(err){
					res.json(err);
				}else {
					console.log(data);
					res.render('resume_search', {
						title: '简历搜索',
						userdata: req.session.user,
						resumeList: data.slice((page-1)*10, page*10),
						page: page,
						maxpage: parseInt((data.length-1)/10)+1,
						searchData: urlData,
					});
				}
			});
		}
	}else {
		res.redirect('/login');
	}
});


function offerRecommend(owner, callback){
	resumeModel.findDefaultOne({Data:{owner:owner}}, function(err, data){
		if(err){
			callback({err:err, data:null});
		}else{
			if(data != null){
				var resumeData = data;
				var condition = {
					job:resumeData.job,
					job_type:resumeData.job_type,
					education:{$gte:resumeData.education},
					experience:{$lte:resumeData.experience},
					isApproved:true,
				}
				var keyname = data.offername;
				offerModel.findByCondition({Data:condition}, function(err, data){
					if(err){
						callback({err:err, data:null});
					}else {
						Promise.all(data.map(item => client.simnet(keyname, item.offername))).then(result => {
							var resultData = [];
							for(var i in data){
								resultData.push({
									_id: data[i]._id,
									salary: data[i].salary,
									companyname: data[i].companyname,
									location: data[i].location,
									location_str: data[i].location_str,
									job: data[i].job,
									job_str: data[i].job_str,
									scale: data[i].scale,
									job_type: data[i].job_type,
									experience: data[i].experience,
									education: data[i].education,
									company_description: data[i].company_description,
									job_description: data[i].job_description,
									fringe_benefits: data[i].fringe_benefits,
									contact_information: data[i].contact_information,
									editdate: data[i].editdate,
									score: result[i].score,
								});
							}
							// console.log(resultData);
							callback({err:null, data:resultData});
						});
						// for(var i in data){
						// 	var matchDegree = 0;
						// 	var detailDegree = 0;
							
						// }
					}
				});
			}else{
				callback({err:'no data', data:null});
			}
		}
	});
};

function test(word1, word2){
	var testData = [];
		testData.push({word1:'JAVA', word2:'Java开发', _id:'111'});
		testData.push({word1:'JAVA编程', word2:'JAVA', _id:'222'});
		testData.push({word1:'JAVA编程', word2:'java', _id:'333'});
	var scoreList = [];
	Promise.all(testData.map(item => client.simnet(item.word1, item.word2))).then(data => {
		scoreList = data;
		console.log(JSON.stringify(score));
		return score;
	});




	// client.simnet(word1, word2).then(function(result) {
	//     console.log(JSON.stringify(result));
	//     return result;b
	// }).catch(function(err) {
	//     // 如果发生网络错误
	//     console.log(err);
	//     return err;
	// });
};

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