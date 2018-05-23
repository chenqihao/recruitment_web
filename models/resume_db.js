var express = require('express');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var resumeSchema = new Schema({
	owner:{
		type:String,
		index:true,
		required:[true, '用户名不能为空'],
		trim:true,
	},
	isDefault:{
		type:Boolean,
		required:true,
	},
	isPublic:{
		type:Boolean,
		required:true,
	},
	resumename:{
		type:String,
		required:[true, '简历名不能为空'],
		trim:true,
		maxlength:[8, '简历名不能超过八个字'],
		match:[/^[^.]*$/, '简历名不能包含点'],
	},
	fullname:{
		type:String,
		unique:true,
	},
	realname:{
		type:String,
		required:[true,'姓名不能为空'],
		trim:true,
	},
	email:{
		type:String,
		required:[true, '邮箱不能为空'],
		trim:true,
		match:[/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/, '请输入正确的邮箱']
	},
	sex:{
		type:String,
		enum:['male', 'female'],
	},
	age:{
		type:Number,
		min:[18, '输入年龄过小'],
		max:[60, '输入年龄过大'],
		required:[true, '年龄不能为空'],
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
	salary:{
		type:[Number],
		required:[true, '请输入期望薪资'],
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
			message:'未输入期望薪资或期望薪资不合法',
		},
	},
	job_type:{
		type:String,
		required:[true, '请选择工作类型'],
		enum:['fulltime', 'parttime', 'intern', 'fullOrPart'],
	},
	experience:{
		type:Number,
		required:[true, '工作经验年数不能为空'],
		min:[0, '工作经验年数不能小于0'],
	},
	first_forlang:{
		type:String,
		required:[true, '请选择外语水平'],
		match:[/^[0123456][1234]$/, '请确认外语水平无误'],
	},
	second_forlang:{
		type:String,
		required:[true, '请选择外语水平'],
		match:[/^[0123456][1234]$/, '请确认外语水平无误'],
	},
	third_forlang:{
		type:String,
		required:[true, '请选择外语水平'],
		match:[/^[0123456][1234]$/, '请确认外语水平无误'],
	},
	education:{
		type:Number,
		required:[true, '请选择学历'],
		min:[11, '请确认学历无误'],
		max:[32, '请确认学历无误'],
	},
	school:{
		type:String,
		required:[true, '请输入学校'],
		trim:true,
	},
	major:{
		type:String,
		required:[true, '请输入专业'],
		trim:true,
	},
	pro_courses:{
		type:String
	},
	pro_ability:{
		type:String
	},
	self_evaluation:{
		type:String
	},
	rewards_punishments:{
		type:String
	}
});

// resumeSchema.pre('save', function (next) {
// 	this.fullname = this.owner + '.' + this.resumename;
// 	next();
// });

var resumeModel = mongoose.model('resumes', resumeSchema);


exports.listByOwner = function(reqData, callback){
	resumeModel.find({owner: reqData.owner}, ['_id', 'isDefault', 'isPublic', 'resumename'], {sort:{_id: 1}}, function(err, data){
		if (err){
			callback(err, null);
		}else {
			callback(null, data);
		}
	});
};

exports.createResume = function(reqData, callback){
	var Data = reqData;
	Data['fullname'] = Data.owner+'.'+Data.resumename;
	resumeModel.create(Data, function(err, data){
		if (err){
			callback(err);
		}else {
			callback('ok');
		}
	});
};

exports.findById = function(reqData, callback){
	resumeModel.findById(reqData._id, function(err, data){
		if(err){
			callback(err, null);
		}else {
			callback(null, data);
		}
	});
};

exports.modById = function(reqData, callback){
	var Data = reqData;
	if(Data.owner&&Data.resumename){
		Data['fullname'] = Data.owner+'.'+Data.resumename;
	}
	resumeModel.update({_id: Data._id}, {$set: Data},  {runValidators: true}, function(err, data){
		if (err){
			callback(err);
		}else {
			callback('ok');
		}
	});
};

exports.removeResume = function(reqData, callback){
	resumeModel.remove({_id: reqData._id}, function(err, data){
		if (err){
			callback(err);
		}else {
			callback('ok');
		}
	});
};