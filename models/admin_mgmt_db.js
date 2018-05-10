var express = require('express');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var adminSchema = new Schema({
	username:{type:String, unique:true, select:true},
	password:{type:String},
});

adminSchema.index({username:1});
var adminModel = mongoose.model('admins', adminSchema);

exports.adminLogin = function(reqData, callback){
	adminModel.findOne({username:reqData.username}, function(err, data){
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

exports.adminRegister = function(reqData, callback){
	adminModel.create({
		username:reqData.username,
		password:reqData.password
	}, function(err, data){
		if(err){
			callback(err);
		}else{
			callback('ok');
		}
	});
};

