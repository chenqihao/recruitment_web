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
	var urlData = url.parse(req.url, true).query;
	if(req.session.user){
		if (JSON.stringify(urlData) == '{}' && req.session.user.usertype == 'person'){
			offerRecommend(req.session.user.username, function(status){
				if (status.err){
					if(status.err == 'no data'){
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
					}else{
						res.json(status.err);
					}
				}else{
					res.render('offer_search', {
						title: '职位搜索',
						userdata: req.session.user,
						offerList: status.data,
						page: 1,
						maxpage: 1,
						searchData: {
							companyname: null,
							offername: null,
							location: null,
							job: null,
							salary_min: null,
							salary_max: null,
						},
					});
					// res.json(status.data);
				}
			});
		}else{
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
	var urlData = url.parse(req.url, true).query;
	if(req.session.user&&req.session.user.usertype != 'person'){
		if (JSON.stringify(urlData) == '{}' && req.session.user.usertype == 'company'){
			resumeRecommend(req.session.user.username, function(status){
				if (status.err){
					if(status.err == 'no data'){
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
					}else{
						res.json(status.err);
					}
				}else{
					res.render('resume_search', {
						title: '简历搜索',
						userdata: req.session.user,
						resumeList: status.data,
						page: 1,
						maxpage: 1,
						searchData: {
							education: null,
							experience: null,
							location: null,
							job: null,
							salary_min: null,
							salary_max: null,
						},
					});
				}
			});
		}else{
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
					isApproved:true,
				}
				var keyname = data.offername;
				offerModel.findByCondition({Data:condition}, function(err, data){
					if(err){
						callback({err:err, data:null});
					}else if(data.length > 0){
						var numArr = [];
						for(var n = 0; n < data.length; n++){
							numArr.push(n);
						}
						var indexArr = [];
						for(var m = 0; m < 10; m++){
							if(numArr.length > 0){
								var randomIndex = Math.floor(Math.random() * numArr.length);
								indexArr.push(numArr[randomIndex]);
								numArr.splice(randomIndex, 1);
							}else{
								break;
							}
						}
						var searchData = [];
						for (var i in indexArr){
							searchData.push({
								_id: data[indexArr[i]]._id,
								offername: data[indexArr[i]].offername,
								salary: data[indexArr[i]].salary,
								companyname: data[indexArr[i]].companyname,
								location: data[indexArr[i]].location,
								location_str: data[indexArr[i]].location_str,
								job: data[indexArr[i]].job,
								job_str: data[indexArr[i]].job_str,
								scale: data[indexArr[i]].scale,
								job_type: data[indexArr[i]].job_type,
								experience: data[indexArr[i]].experience,
								education: data[indexArr[i]].education,
								company_description: data[indexArr[i]].company_description,
								job_description: data[indexArr[i]].job_description,
								fringe_benefits: data[indexArr[i]].fringe_benefits,
								contact_information: data[indexArr[i]].contact_information,
								editdate: data[indexArr[i]].editdate,
								need_number: data[indexArr[i]].need_number,
							});
						}
						var maxExperience = searchData[0].experience;
						var minExperience = 0;
						var maxSalary = resumeData.salary[1];
						var minSalary = resumeData.salary[0];
						var maxNeedNumber = searchData[0].need_number;
						var maxCompany_description = searchData[0].company_description.length;
						var maxJob_description = searchData[0].job_description.length;
						var maxFringe_benefits = searchData[0].fringe_benefits.length;
						var maxContact_information = searchData[0].contact_information.length;
						for(var j in searchData){
							if(maxExperience < searchData[j].experience){
								maxExperience = searchData[j].experience;
							}
							if(minExperience > searchData[j].experience){
								minExperience = searchData[j].experience;
							}
							if(maxSalary < searchData[j].salary[1]){
								maxSalary = searchData[j].salary[1];
							}
							if(minSalary > searchData[j].salary[0]){
								minSalary = searchData[j].salary[0];
							}
							if(maxNeedNumber < searchData[j].need_number){
								maxNeedNumber = searchData[j].need_number;
							}
							if(maxCompany_description < searchData[j].company_description.length){
								maxCompany_description = searchData[j].company_description.length;
							}
							if(maxJob_description < searchData[j].job_description.length){
								maxJob_description = searchData[j].job_description.length;
							}
							if(maxFringe_benefits < searchData[j].fringe_benefits.length){
								maxFringe_benefits = searchData[j].fringe_benefits.length;
							}
							if(maxContact_information < searchData[j].contact_information.length){
								maxContact_information = searchData[j].contact_information.length;
							}
						}
						for(var k in searchData){
							var score = 0;
							if(searchData[k].location == resumeData.location){score += 0.1;}
							if(searchData[k].job_type == resumeData.job_type){score += 0.15;}
							if(maxExperience == minExperience){
								score += 0.1;
							}else{
								score += 0.1*(1-(Math.abs(resumeData.experience-searchData[k].experience))/(maxExperience-minExperience));
							}
							if(maxSalary == minSalary){
								score += 0.125;
							}else if(resumeData.salary[0] == resumeData.salary[1] && searchData[k].salary[0] != searchData[k].salary[1]){
								score += 0.125*(1-(Math.pow(searchData[k].salary[0]-resumeData.salary[0], 2)+
									Math.pow(searchData[k].salary[1]-resumeData.salary[0], 2))/
								(searchData[k].salary[1]-searchData[k].salary[0])/
								(maxSalary-minSalary)/2);
							}else if(searchData[k].salary[0] == searchData[k].salary[1]){
								score += 0.125*(1-(Math.pow(searchData[k].salary[0]-resumeData.salary[0], 2)+
									Math.pow(searchData[k].salary[0]-resumeData.salary[1], 2))/
								(resumeData.salary[1]-resumeData.salary[0])/
								(maxSalary-minSalary)/2);
							}else{
								score += 0.125*(1-(Math.pow(Math.abs(resumeData.salary[0]-searchData[k].salary[1]), 3)+
									Math.pow(Math.abs(resumeData.salary[1]-searchData[k].salary[0]), 3)-
									Math.pow(Math.abs(resumeData.salary[0]-searchData[k].salary[0]), 3)-
									Math.pow(Math.abs(resumeData.salary[1]-searchData[k].salary[1]), 3))/
								(resumeData.salary[1]-resumeData.salary[0])/
								(searchData[k].salary[1]-searchData[k].salary[0])/
								(maxSalary-minSalary)/6);
								// console.log(searchData[k].offername);
								// console.log((1-(Math.pow(Math.abs(resumeData.salary[0]-searchData[k].salary[1]), 3)+
								// 	Math.pow(Math.abs(resumeData.salary[1]-searchData[k].salary[0]), 3)-
								// 	Math.pow(Math.abs(resumeData.salary[0]-searchData[k].salary[0]), 3)-
								// 	Math.pow(Math.abs(resumeData.salary[1]-searchData[k].salary[1]), 3))/
								// (resumeData.salary[1]-resumeData.salary[0])/
								// (searchData[k].salary[1]-searchData[k].salary[0])/
								// (maxSalary-minSalary)/6));
							}
							score += 0.025*searchData[k].need_number/maxNeedNumber;
							score += 0.025*searchData[k].company_description.length/maxCompany_description;
							score += 0.025*searchData[k].job_description.length/maxJob_description;
							score += 0.025*searchData[k].fringe_benefits.length/maxFringe_benefits;
							score += 0.025*searchData[k].contact_information.length/maxContact_information;
							searchData[k].score = score;
						}
						// console.log(searchData);
						Promise.all(searchData.map(item => client.simnet(keyname, item.offername))).then(result => {
							var resultData = [];
							for(var l in searchData){
								resultData.push({
									_id: searchData[l]._id,
									offername: searchData[l].offername,
									salary: searchData[l].salary,
									companyname: searchData[l].companyname,
									location: searchData[l].location,
									location_str: searchData[l].location_str,
									job: searchData[l].job,
									job_str: searchData[l].job_str,
									scale: searchData[l].scale,
									job_type: searchData[l].job_type,
									experience: searchData[l].experience,
									education: searchData[l].education,
									company_description: searchData[l].company_description,
									job_description: searchData[l].job_description,
									fringe_benefits: searchData[l].fringe_benefits,
									contact_information: searchData[l].contact_information,
									editdate: searchData[l].editdate,
									need_number: searchData[l].need_number,
									score: result[l].score*0.4 + searchData[l].score,
								});
							}
							resultData.sort(function(a, b){
								return b.score - a.score;
							});
							// console.log(resultData);
							callback({err:null, data:resultData});
						});
					}else{
						callback({err:'no data', data:null});
					}
				});
			}else{
				callback({err:'no data', data:null});
			}
		}
	});
};

function resumeRecommend(owner, callback){
	offerModel.findRandomOne({Data:{owner:owner}}, function(err, data){
		if(err){
			callback({err:err, data:null});
		}else{
			if(data != null){
				var offerData = data;
				var condition = {
					job:offerData.job,
					job_type:offerData.job_type,
					education:{$lte:offerData.education},
					isPublic:true,
				}
				var keyname = data.offername;
				resumeModel.findByCondition({Data:condition}, function(err, data){
					if(err){
						callback({err:err, data:null});
					}else if(data.length > 0){
						var numArr = [];
						for(var n = 0; n < data.length; n++){
							numArr.push(n);
						}
						var indexArr = [];
						for(var m = 0; m < 10; m++){
							if(numArr.length > 0){
								var randomIndex = Math.floor(Math.random() * numArr.length);
								indexArr.push(numArr[randomIndex]);
								numArr.splice(randomIndex, 1);
							}else{
								break;
							}
						}
						var searchData = [];
						for (var i in indexArr){
							searchData.push({
								_id: data[indexArr[i]]._id,
								offername: data[indexArr[i]].offername,
								salary: data[indexArr[i]].salary,
								realname: data[indexArr[i]].realname,
								location: data[indexArr[i]].location,
								location_str: data[indexArr[i]].location_str,
								job: data[indexArr[i]].job,
								job_str: data[indexArr[i]].job_str,
								school: data[indexArr[i]].school,
								job_type: data[indexArr[i]].job_type,
								experience: data[indexArr[i]].experience,
								education: data[indexArr[i]].education,
								first_forlang: data[indexArr[i]].first_forlang,
								second_forlang: data[indexArr[i]].second_forlang,
								third_forlang: data[indexArr[i]].third_forlang,
								pro_courses: data[indexArr[i]].pro_courses,
								pro_ability: data[indexArr[i]].pro_ability,
								self_evaluation: data[indexArr[i]].self_evaluation,
								rewards_punishments: data[indexArr[i]].rewards_punishments,
							});
						}
						var maxExperience = searchData[0].experience;
						var minExperience = 0;
						var maxSalary = offerData.salary[1];
						var minSalary = offerData.salary[0];
						var maxForlang = (searchData[0].first_forlang[0]==0)?0:searchData[0].first_forlang[1]+(searchData[0].second_forlang[0]==0)?0:searchData[0].second_forlang[1]+(searchData[0].third_forlang[0]==0)?0:searchData[0].third_forlang[1];
						var maxPro_courses = searchData[0].pro_courses.length;
						var maxPro_ability = searchData[0].pro_ability.length;
						var maxSelf_evaluation = searchData[0].self_evaluation.length;
						var maxRewards_punishments = searchData[0].rewards_punishments.length;
						for(var j in searchData){
							if(maxExperience < searchData[j].experience){
								maxExperience = searchData[j].experience;
							}
							if(minExperience > searchData[j].experience){
								minExperience = searchData[j].experience;
							}
							if(maxSalary < searchData[j].salary[1]){
								maxSalary = searchData[j].salary[1];
							}
							if(minSalary > searchData[j].salary[0]){
								minSalary = searchData[j].salary[0];
							}
							if(maxForlang < ((searchData[j].first_forlang[0]==0)?0:searchData[j].first_forlang[1]+(searchData[j].second_forlang[0]==0)?0:searchData[j].second_forlang[1]+(searchData[j].third_forlang[0]==0)?0:searchData[j].third_forlang[1])){
								maxForlang = (searchData[j].first_forlang[0]==0)?0:searchData[j].first_forlang[1]+(searchData[j].second_forlang[0]==0)?0:searchData[j].second_forlang[1]+(searchData[j].third_forlang[0]==0)?0:searchData[j].third_forlang[1];
							}
							if(maxPro_courses < searchData[j].pro_courses.length){
								maxPro_courses = searchData[j].pro_courses.length;
							}
							if(maxPro_ability < searchData[j].pro_ability.length){
								maxPro_ability = searchData[j].pro_ability.length;
							}
							if(maxSelf_evaluation < searchData[j].self_evaluation.length){
								maxSelf_evaluation = searchData[j].self_evaluation.length;
							}
							if(maxRewards_punishments < searchData[j].rewards_punishments.length){
								maxRewards_punishments = searchData[j].rewards_punishments.length;
							}
						}
						for(var k in searchData){
							var score = 0;
							if(searchData[k].location == offerData.location){score += 0.1;}
							if(searchData[k].job_type == offerData.job_type){score += 0.15;}
							if(maxExperience == minExperience){
								score += 0.1;
							}else{
								score += 0.1*(1-(Math.abs(offerData.experience-searchData[k].experience))/(maxExperience-minExperience));
							}
							if(maxSalary == minSalary){
								score += 0.125;
							}else if(offerData.salary[0] == offerData.salary[1] && searchData[k].salary[0] != searchData[k].salary[1]){
								score += 0.125*(1-(Math.pow(searchData[k].salary[0]-offerData.salary[0], 2)+
									Math.pow(searchData[k].salary[1]-offerData.salary[0], 2))/
								(searchData[k].salary[1]-searchData[k].salary[0])/
								(maxSalary-minSalary)/2);
							}else if(searchData[k].salary[0] == searchData[k].salary[1]){
								score += 0.125*(1-(Math.pow(searchData[k].salary[0]-offerData.salary[0], 2)+
									Math.pow(searchData[k].salary[0]-offerData.salary[1], 2))/
								(offerData.salary[1]-offerData.salary[0])/
								(maxSalary-minSalary)/2);
							}else{
								// console.log(0.125*Math.sqrt(Math.pow(searchData[k].salary[0]-offerData.salary[0], 2)+Math.pow(searchData[k].salary[1]-offerData.salary[1], 2))/(maxSalary-minSalary));
								score += 0.125*(1-(Math.pow(Math.abs(offerData.salary[0]-searchData[k].salary[1]), 3)+
									Math.pow(Math.abs(offerData.salary[1]-searchData[k].salary[0]), 3)-
									Math.pow(Math.abs(offerData.salary[0]-searchData[k].salary[0]), 3)-
									Math.pow(Math.abs(offerData.salary[1]-searchData[k].salary[1]), 3))/
								(offerData.salary[1]-offerData.salary[0])/
								(searchData[k].salary[1]-searchData[k].salary[0])/
								(maxSalary-minSalary)/6);
							}
							score += 0.025*((searchData[k].first_forlang[0]==0)?0:searchData[k].first_forlang[1]+(searchData[k].second_forlang[0]==0)?0:searchData[k].second_forlang[1]+(searchData[k].third_forlang[0]==0)?0:searchData[k].third_forlang[1])/maxForlang;
							score += 0.025*searchData[k].pro_courses.length/maxPro_courses;
							score += 0.025*searchData[k].pro_ability.length/maxPro_ability;
							score += 0.025*searchData[k].self_evaluation.length/maxSelf_evaluation;
							score += 0.025*searchData[k].rewards_punishments.length/maxRewards_punishments;
							searchData[k].score = score;
						}
						// console.log(searchData);
						Promise.all(searchData.map(item => client.simnet(keyname, item.offername))).then(result => {
							var resultData = [];
							for(var l in searchData){
								resultData.push({
									_id: searchData[l]._id,
									offername: searchData[l].offername,
									salary: searchData[l].salary,
									realname: searchData[l].realname,
									location: searchData[l].location,
									location_str: searchData[l].location_str,
									job: searchData[l].job,
									job_str: searchData[l].job_str,
									school: searchData[l].school,
									job_type: searchData[l].job_type,
									experience: searchData[l].experience,
									education: searchData[l].education,
									first_forlang: searchData[l].first_forlang,
									second_forlang: searchData[l].second_forlang,
									third_forlang: searchData[l].third_forlang,
									pro_courses: searchData[l].pro_courses,
									pro_ability: searchData[l].pro_ability,
									self_evaluation: searchData[l].self_evaluation,
									rewards_punishments: searchData[l].rewards_punishments,
									score: result[l].score*0.4 + searchData[l].score,
								});
							}
							resultData.sort(function(a, b){
								return b.score - a.score;
							});
							// console.log(resultData);
							callback({err:null, data:resultData});
						});
					}else{
						callback({err:'no data', data:null});
					}
				});
			}else{
				callback({err:'no data', data:null});
			}
		}
	});
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