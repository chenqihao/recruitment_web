var express = require('express');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var personSchema = new Schema({
	username:{type:String, unique:true, select:true},
	password:{type:String},
	email:{type:String, unique:true},
	realname:{type:String},
	IDnumber:{type:String, unique:true},
	sex:{type:String, default:'secret'},
	age:{type:String},
	address:{type:String},
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
	personModel.update({username:reqData.username}, {password: reqData.password}, function(err, data){
		if (err){
			callback(err);
		}else {
			callback('ok');
		}
	});
};

exports.personModInfo = function(reqData, callback){
	personModel.update({username:reqData.username}, {"$set":reqData}, function(err, data){
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