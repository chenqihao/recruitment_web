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
var companySchema = new Schema({
	username:{type:String, unique:true, select:true},
	password:{type:String},
	email:{type:String, unique:true},
	companyname:{type:String, unique:true},
	representative:{type:String},
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

exports.login = function(reqData, callback){
	if (reqData.usertype == 'person'){
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
	}else if (reqData.usertype == 'company'){
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
	}else if (reqData.usertype == 'admin'){
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
	if(reqData.usertype == 'person'){
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
	}else if (reqData.usertype == 'company'){
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
	}else if (reqData.usertype == 'admin'){
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

exports.cfmEmail = function(reqData, callback){
	if (reqData.usertype == 'person'){
		personModel.findOne({username:reqData.username}, function(err, data){
			// console.log(err);
			// console.log(data);
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
	}else{
		companyModel.findOne({username:reqData.username}, function(err, data){
			// console.log(err);
			// console.log(data);
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
	}
};

exports.chgpwd = function(reqData, callback){
	if (reqData.usertype == 'person'){
		personModel.update({username:reqData.username}, {password: reqData.password}, function(err, data){
			if (err){
				callback(err);
			}else {
				callback('ok');
			}
		});
	}else {
		companyModel.update({username:reqData.username}, {password: reqData.password}, function(err, data){
			if (err){
				callback(err);
			}else {
				callback('ok');
			}
		});
	}
};

exports.modInfo = function(reqData, callback){
	var usertype = reqData.usertype;
	delete reqData.usertype;
	// console.log(reqData);
	if (usertype == 'person'){
		// console.log(reqData);
		personModel.update({username:reqData.username}, {"$set":reqData}, function(err, data){
			if (err){
				callback(err);
			}else {
				callback('ok');
			}
		});
	}else {
		companyModel.update({username:reqData.username}, {"$set":reqData}, function(err, data){
			if (err){
				callback(err);
			}else {
				callback('ok');
			}
		});
	}
}

exports.accInfo = function(reqData, callback){
	if (reqData.usertype == 'person'){
		personModel.findOne({username:reqData.username}, function(err, data){
			if (err){
				err.err = 'err';
				callback(err);
			}else {
				callback(data);
			}
		});
	}else {
		companyModel.findOne({username:reqData.username}, function(err, data){
			if (err){
				err.err = 'err';
				callback(err);
			}else {
				callback(data);
			}
		});
	}
}
