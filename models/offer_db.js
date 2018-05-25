var express = require('express');
var mongoose = require('mongoose');
var staticModel = require('./static_db.js');

var Schema = mongoose.Schema;
var offerSchema = new Schema({
	owner:{
		type:String,
		index:true,
		required:[true, '用户名不能为空'],
		trim:true,
	},
	offername:{
		type:String,
		required:[true, '职位名不能为空'],
		trim:true,
		maxlength:[8, '职位名不能超过八个字'],
	},
	editdate:{
		type:Date,
		required:true,
	},
	isApproved:{
		type:Boolean,
		default:false,
		required:true,
	},
	companyname:{
		type:String,
		required:[true,'公司名不能为空'],
		trim:true,
	},
	companytype:{
		type:Number,
		required:[true, '请选择公司类型'],
		min:[1, '请确认类型无误'],
		max:[5, '请确认类型无误'],
	},
	address:{
		type:String,
		required:[true,'公司地址不能为空'],
		trim:true,
	},
	business:{
		type:String,
		required:[true, '请选择主营行业'],
		match:[/^(0[1-9]|[1-9]\d)0000$/, '请确认主营行业无误'],
	},
	location:{
		type:String,
		required:[true, '请选择所在地'],
		match:[/^(0[1-9]|[1-9]\d){2}00$/, '请确认所在地无误'],
	},
	location_str:{
		type:String,
		required:true,
	},
	job:{
		type:String,
		required:[true, '请选择岗位'],
		match:[/^(0[1-9]|[1-9]\d){3}$/, '请确认岗位无误'],
	},
	job_str:{
		type:String,
		required:true,
	},
	scale:{
		type:Number,
		required:[true, '请选择公司规模'],
		min:[1, '请确认公司规模无误'],
		max:[7, '请确认公司规模无误'],
	},
	salary:{
		type:[Number],
		required:[true, '请输入提供薪资'],
		// default: undefined,
		validate:{
			validator:function(v){
				// console.log(v);
				if(v.length != 2){
					return false;
				}else {
					if ((v[0]<=v[1])&&(v[0]>0)){
						return true;
					}else {
						return false;
					}
				}
			},
			message:'未输入提供薪资或期望提供不合法',
		},
	},
	job_type:{
		type:String,
		required:[true, '请选择工作类型'],
		enum:['fulltime', 'parttime', 'intern', 'fullOrPart'],
	},
	education:{
		type:Number,
		required:[true, '请选择学历'],
		min:[11, '请确认学历无误'],
		max:[32, '请确认学历无误'],
	},
	experience:{
		type:Number,
		required:[true, '工作经验年数不能为空'],
		min:[0, '工作经验年数不能小于0'],
	},
	need_number:{
		type:Number,
		required:[true, '需求人数不能为空'],
		min:[1, '需求人数不能小于1'],
	},
	company_description:{
		type:String,
		required:[true, '请输入公司简介'],
	},
	job_description:{
		type:String,
		required:[true, '请输入职位简介'],
	},
	fringe_benefits:{
		type:String,
		required:[true, '请输入福利待遇'],
	},
	contact_information:{
		type:String,
		required:[true, '请输入联系方式'],
	},
	got_number:{
		type:Number,
		default:0,
	},
	rejected_reason:{
		type:String,
		trim:true,
		default:'未审核',
	},
});

var offerModel = mongoose.model('offers', offerSchema);

exports.listByOwner = function(reqData, callback){
	offerModel.find({owner: reqData.owner}, ['_id', 'offername', 'editdate', 'rejected_reason', 'salary', 'companyname', 'location_str'], {sort:{_id: 1}}, function(err, data){
		if (err){
			callback(err, null);
		}else {
			callback(null, data);
		}
	});
};

exports.createOffer = function(reqData, callback){
	if(reqData.location){
		staticModel.showCity(reqData.location, function(err, data){
			if (err){
				callback(err);
			}else {
				reqData['location_str'] = staticModel.showProvince(reqData.location)+'-'+data.name;
				if(reqData.job){
					staticModel.showJob(reqData.job, function(err, data){
						if (err){
							callback(err);
						}else {
							reqData['job_str'] = data.name;
							offerModel.create(reqData, function(err, data){
								if (err){
									callback(err);
								}else {
									callback('ok');
								}
							});
						}
					});
				}else{
					offerModel.create(reqData, function(err, data){
						if (err){
							callback(err);
						}else {
							callback('ok');
						}
					});
				}
			}
		});
	}else if(reqData.job){
		staticModel.showJob(reqData.job, function(err, data){
			if (err){
				callback(err);
			}else {
				reqData['job_str'] = data.name;
				offerModel.create(reqData, function(err, data){
					if (err){
						callback(err);
					}else {
						callback('ok');
					}
				});
			}
		});
	}else {
		offerModel.create(reqData, function(err, data){
			if (err){
				callback(err);
			}else {
				callback('ok');
			}
		});
	}
};

exports.findById = function(reqData, callback){
	offerModel.findById(reqData._id, function(err, data){
		if(err){
			callback(err, null);
		}else {
			callback(null, data);
		}
	});
};

exports.modById = function(reqData, callback){
	var Data = reqData.Data;
	if(Data.location){
		staticModel.showCity(Data.location, function(err, data){
			if (err){
				callback(err);
			}else {
				Data['location_str'] = staticModel.showProvince(Data.location)+'-'+data.name;
				if(Data.job){
					staticModel.showJob(Data.job, function(err, data){
						if (err){
							callback(err);
						}else {
							Data['job_str'] = data.name;
							offerModel.update({_id: Data._id, owner: reqData.username}, {$set: Data},  {runValidators: true}, function(err, data){
								if (err){
									callback(err);
								}else {
									if(data.n == 0){
										callback('user error');
									}else {
										callback('ok');
									}
								}
							});
						}
					});
				}else {
					offerModel.update({_id: Data._id, owner: reqData.username}, {$set: Data},  {runValidators: true}, function(err, data){
						if (err){
							callback(err);
						}else {
							if(data.n == 0){
								callback('user error');
							}else {
								callback('ok');
							}
						}
					});
				}
			}
		});
	}else if(Data.job){
		staticModel.showJob(Data.job, function(err, data){
			if (err){
				callback(err);
			}else {
				Data['job_str'] = data.name;
				offerModel.update({_id: Data._id, owner: reqData.username}, {$set: Data},  {runValidators: true}, function(err, data){
					if (err){
						callback(err);
					}else {
						if(data.n == 0){
							callback('user error');
						}else {
							callback('ok');
						}
					}
				});
			}
		});
	}else {
		offerModel.update({_id: Data._id, owner: reqData.username}, {$set: Data},  {runValidators: true}, function(err, data){
			if (err){
				callback(err);
			}else {
				if(data.n == 0){
					callback('user error');
				}else {
					callback('ok');
				}
			}
		});
	}
};

exports.removeOffer = function(reqData, callback){
	var Data = reqData.Data;
	offerModel.remove({_id: Data._id, owner: reqData.username}, function(err, data){
		if (err){
			callback(err);
		}else {
			if(data.n == 0){
				callback('user error');
			}else {
				callback('ok');
			}
		}
	});
};

exports.search = function(reqData, callback){
	var Data = {isApproved: true};
	var sortRul = reqData.sortKey;
	if(reqData.Data.companyname){
		Data["companyname"] = {$regex:reqData.Data.companyname};
	}else if(reqData.Data.offername){
		Data["offername"] = {$regex:reqData.Data.offername};
	}
	if(reqData.Data.location){
		if(reqData.Data.location.slice(2,4) != '00'){
			Data["location"] = reqData.Data.location;
		}else{
			var pattern = new RegExp("^"+reqData.Data.location.slice(0,2)+"\\d{4}$");
			Data["location"] = {$regex:pattern};
		}
	}
	if(reqData.Data.job){
		if(reqData.Data.job.slice(4,6) != '00'){
			Data["job"] = reqData.Data.job;
		}else if(reqData.Data.job.slice(2,4) != '00'){
			var pattern = new RegExp("^"+reqData.Data.job.slice(0,4)+"\\d{2}$");
			Data["job"] = {$regex:pattern};
		}else {
			var pattern = new RegExp("^"+reqData.Data.job.slice(0,2)+"\\d{4}$");
			Data["job"] = {$regex:pattern};
		}
	}
	if(reqData.Data.salary_min){
		Data["salary.0"] = {$gte:reqData.Data.salary_min};
	}
	if(reqData.Data.salary_max){
		Data["salary.1"] = {$lte:reqData.Data.salary_max};
	}
	offerModel.find(Data,
		// {
		// 	companyname:{$regex:Data.companyname},
		// 	offername:{$regex:Data.offername},
		// 	location:Data.location,
		// 	job:Data.job,
		// 	// salary:{$all:[{$gte:Data.salary_min},{$lte:Data.salary_max}]},
		// 	isApproved:true,
		{
			'_id':1,
			'offername':1,
			'companyname':1,
			'location_str':1,
			'salary':1,
			'editdate':1,
		}, {sort:{editdate:-1}},
		function(err, data){
			if(err){
				callback(err, null);
			}else {
				callback(null, data);
			}
		}
	);
};