var express = require('express');
var crypto = require('crypto');
var url = require('url');
var router = express.Router();
var resumeModel = require('../models/resume_db.js');
var personModel = require('../models/person_mgmt_db.js');
var offerModel = require('../models/offer_db.js');
var companyModel = require('../models/company_mgmt_db.js');


router.get('/offer_search', function(req, res){
	 if(req.session.user){
		var urlData = url.parse(req.url, true).query;
		var page = urlData.page;
		if (page == null){
			page = 1;
		}
		offerModel.search({
			sortKey: "editdate",
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
				res.render('offer_search', {
					title: '职位搜索',
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

router.get('/search', function(req, res){
	var page = 1;
	res.render('offer_search', {
		title: '职位搜索',
		userdata: req.session.user,
		offerList: data.slice((page-1)*10, page*10),
		page: page,
		maxpage: parseInt((data.length-1)/10)+1,
	});
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