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
	}
});

resumeSchema.pre('save', function (next) {
	this.fullname = this.owner + '.' + this.resumename;
	next();
});

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
	resumeModel.create(reqData, function(err, data){
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
	resumeModel.update({_id: reqData._id}, {$set: reqData},  {runValidators: true}, function(err, data){
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