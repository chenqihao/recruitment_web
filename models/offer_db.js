var express = require('express');
var mongoose = require('mongoose');

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
		unique:true,
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
	job:{
		type:String,
		required:[true, '请选择岗位'],
		match:[/^(0[1-9]|[1-9]\d){3}$/, '请确认岗位无误'],
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
	offerModel.find({owner: reqData.owner}, ['_id', 'offername', 'editdate', 'rejected_reason'], {sort:{_id: 1}}, function(err, data){
		if (err){
			callback(err, null);
		}else {
			callback(null, data);
		}
	});
};

exports.createOffer = function(reqData, callback){
	offerModel.create(reqData, function(err, data){
		if (err){
			callback(err);
		}else {
			callback('ok');
		}
	});
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
	offerModel.update({_id: reqData._id}, {$set: reqData},  {runValidators: true}, function(err, data){
		if (err){
			callback(err);
		}else {
			callback('ok');
		}
	});
};

exports.removeOffer = function(reqData, callback){
	offerModel.remove({_id: reqData._id}, function(err, data){
		if (err){
			callback(err);
		}else {
			callback('ok');
		}
	});
};