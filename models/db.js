var express = require('express');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var personSchema = new Schema({
	username:{type:String, unique:true, select:true},
	password:{type:String},
	email:{type:String, unique:true},
	realname:{type:String},
	IDnumber:{type:String, unique:true},
});
var companySchema = new Schema({
	username:{type:String, unique:true, select:true},
	password:{type:String},
	email:{type:String, unique:true},
	companyname:{type:String, unique:true},
	address:{type:String},
});
var adminSchema = new Schema({
	username:{type:String, unique:true, select:true},
	password:{type:String},
});

personSchema.index({username:1});
companySchema.index({username:1});
// personSchema.index({username:1, email:1, IDnumber:1},{unique:true});
// companySchema.index({username:1, email:1, companyname:1},{unique:true});
adminSchema.index({username:1});

var personModel = mongoose.model('persons', personSchema);
var companyModel = mongoose.model('companys', companySchema);
var adminModel = mongoose.model('admins', adminSchema);

// var personArray = [{username:'cqh',password:'123'},{username:'sbcy',password:'456'}];
// personModel.create(personArray,function(err, persons){
// 	if(err){
// 		console.log(err);
// 	}
// 	console.log(persons);
// });
exports.login = function(reqData, callback){
	if (reqData.loginType == 'person'){
		personModel.findOne({username:reqData.username}, function(err, data){
			// console.log(err);
			// console.log(data);
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
	}else if (reqData.loginType == 'company'){
		companyModel.findOne({username:reqData.username}, function(err, data){
			// console.log(err);
			// console.log(data);
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
	}else if (reqData.loginType == 'admin'){
		adminModel.findOne({username:reqData.username}, function(err, data){
			// console.log(err);
			// console.log(data);
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
	}
};


exports.register = function(reqData, callback){
	if(reqData.registerType == 'person'){
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
	}else if (reqData.registerType == 'company'){
		companyModel.create({
			username:reqData.username,
			password:reqData.password,
			email: reqData.email,
			companyname: reqData.companyname,
			address: reqData.address,
		}, function(err, data){
			if(err){
				callback(err);
			}else{
				callback('ok');
			}
		});
	}else if (reqData.registerType == 'admin'){
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
	}
};
