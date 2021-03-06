var express = require('express');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var personSchema = new Schema({
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
		trim:true,
		match:[/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/, '请输入正确的邮箱']
	},
	realname:{
		type:String,
		unique:true,
		required:[true,'姓名不能为空'],
		trim:true,
	},
	IDnumber:{
		type:String,
		unique:true,
		required:[true,'身份证号不能为空'],
		trim:true,
		match:[/(^\d{15}$)|(^\d{17}(\d|X|x)$)/, '请输入正确的身份证号'],
	},
	sex:{
		type:String,
		default: 'secret',
		enum:['male', 'female', 'secret'],
	},
	age:{
		type:Number,
		min:[18, '输入年龄过小'],
		max:[60, '输入年龄过大'],
	},
	address:{
		type:String,
	},
});

personSchema.index({username:1});
var personModel = mongoose.model('persons', personSchema);

exports.personLogin = function(reqData, callback){
	personModel.findOne({username:reqData.username}, function(err, data){
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

exports.personRegister = function(reqData, callback){
	personModel.create({
		username:reqData.username,
		password:reqData.password,
		email: reqData.email,
		realname: reqData.realname,
		IDnumber: reqData.IDnumber,
	}, function(err, data){
		if(err){
			callback(err);
		}else{
			callback('ok');
		}
	});
}

exports.personCfmEmail = function(reqData, callback){
	personModel.findOne({username:reqData.username}, function(err, data){
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

exports.personChgPwd = function(reqData, callback){
	personModel.update({username:reqData.username}, {$set: {password: reqData.password}}, {runValidators: true}, function(err, data){
		if (err){
			callback(err);
		}else {
			callback('ok');
		}
	});
};

exports.personModInfo = function(reqData, callback){
	personModel.update({username:reqData.username}, {$set: reqData}, {runValidators: true}, function(err, data){
		if (err){
			callback(err);
		}else {
			callback('ok');
		}
	});
};

exports.personAccInfo = function(reqData, callback){
	personModel.findOne({username:reqData.username}, function(err, data){
		if (err){
			// err.err = 'err';
			callback(err, null);
		}else {
			// data.err = 'ok';
			callback('ok', data);
		}
	});
};