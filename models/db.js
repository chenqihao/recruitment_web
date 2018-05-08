var express = require('express');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var personSchema = new Schema({
	username:{type:String},
	password:{type:String},
});
var companySchema = new Schema({
	username:{type:String},
	password:{type:String},
});
var adminSchema = new Schema({
	username:{type:String},
	password:{type:String},
});

personSchema.index({username:1},{unique:true});
companySchema.index({username:1},{unique:true});
adminSchema.index({username:1},{unique:true});

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
exports.personLogin = function(personData, callback){
	personModel.findOne({username:personData.username}, function(err, data){
		// console.log(err);
		// console.log(data);
		if (err){
			callback(err);
		}else if (data != null){
			if (data.password == personData.password){
				callback('ok');
			}else{
				callback('密码错误');
			}
		}else{
			callback('用户不存在');
		}
	});
};

exports.register = function(personData, callback){
	personModel.create(personData, function(err, data){
		if(err){
			callback(err);
		}else{
			callback('ok');
		}
	});
};