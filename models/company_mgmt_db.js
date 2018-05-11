var express = require('express');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var companySchema = new Schema({
	username:{type:String, unique:true, select:true},
	password:{type:String},
	email:{type:String, unique:true},
	companyname:{type:String, unique:true},
	representative:{type:String},
	address:{type:String},
});

companySchema.index({username:1});
var companyModel = mongoose.model('companys', companySchema);

exports.companyLogin = function(reqData, callback){
	companyModel.findOne({username:reqData.username}, function(err, data){
		if (err){
			callback(err);
		}else if (data != null){
			if (data.password == reqData.password){
				callback('ok');
			}else{
				callback('密码错误');
			}
		}else{
			callback('用户不存在');
		}
	});
};

exports.companyRegister = function(reqData, callback){
	companyModel.create({
		username:reqData.username,
		password:reqData.password,
		email: reqData.email,
		companyname: reqData.companyname,
		representative: reqData.representative,
		address: reqData.address,
	}, function(err, data){
		if(err){
			callback(err);
		}else{
			callback('ok');
		}
	});
};

exports.companyCfmEmail = function(reqData, callback){
	companyModel.findOne({username:reqData.username}, function(err, data){
		if (err){
			callback(err);
		}else if (data != null){
			if (data.email == reqData.email_confirm){
				callback('ok');
			}else{
				callback('邮箱错误');
			}
		}else{
			callback('用户不存在');
		}
	});
};

exports.companyChgPwd = function(reqData, callback){
	companyModel.update({username:reqData.username}, {password: reqData.password}, function(err, data){
		if (err){
			callback(err);
		}else {
			callback('ok');
		}
	});
};

exports.companyModInfo = function(reqData, callback){
	companyModel.update({username:reqData.username}, {"$set":reqData}, function(err, data){
		if (err){
			callback(err);
		}else {
			callback('ok');
		}
	});
};

exports.companyAccInfo = function(reqData, callback){
	companyModel.findOne({username:reqData.username}, function(err, data){
		if (err){
			// err.err = 'err';
			callback(err, null);
		}else {
			// data.err = 'ok';
			callback('ok', data);
		}
	});
};