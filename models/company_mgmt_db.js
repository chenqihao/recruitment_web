var express = require('express');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var companySchema = new Schema({
	username:{
		type:String,
		unique:true,
		select:true,
		required:[true, '用户名不能为空'],
		match:[/^[a-zA-Z](\w)*$/, '用户名须以字母开始，且只能包含字母数字下划线']
	},
	password:{
		type:String,
		required:[true, '密码不能为空'],
		match:[/^(\S)*$/, '密码不能包含空格'],
	},
	email:{
		type:String,
		unique:true,
		required:[true, '邮箱不能为空'],
		match:[/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/, '请输入正确的邮箱']
	},
	companyname:{
		type:String,
		unique:true,
		required:[true,'公司名不能为空'],
		trim:true,
	},
	representative:{
		type:String,
		required:[true,'法人不能为空'],
		trim:true,
	},
	address:{
		type:String,
		required:[true,'公司地址不能为空'],
		trim:true,
	},
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
	companyModel.update({username:reqData.username}, {$set: {password: reqData.password}}, {runValidators: true}, function(err, data){
		if (err){
			callback(err);
		}else {
			callback('ok');
		}
	});
};

exports.companyModInfo = function(reqData, callback){
	companyModel.update({username:reqData.username}, {$set: reqData}, {runValidators: true}, function(err, data){
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