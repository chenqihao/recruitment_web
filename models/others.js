var express = require('express');
var mongoose = require('mongoose');
var request = require('request');

var Schema = mongoose.Schema;
var dataSchema = new Schema({
	number:{type:String, unique:true},
	name:{type:String},
});
var asdModel = mongoose.model('jobs', dataSchema);
var fghModel = mongoose.model('cities', dataSchema);

exports.asd = function(reqData, callback){
	var session = 'JSESSIONID=2C02BA53E706A72952DB5E0B27F5BBEF';
	for(var j = 1; j <= 12; j++){
		var reqNumber;
		if (j<10){
			reqNumber = '0'+j+'0000';
		}else {
			reqNumber = j+'0000';
		}
		request.post({
	        url: 'http://hzbys.hzrc.com/personnel/pd02/selectZnejfl',  //构建请求
	        // encoding: null,  //不转码
	        headers: {
	            Cookie: session,
	            ContentType: 'application/x-www-form-urlencoded; charset=UTF-8',
	        },
	        form: {  //请求体，参数
	        	aaa103: reqNumber
	        }
	    }, function (err, res, body) {  //获取响应即可
	        if (err) {
	            callback(err);
	        }else{
	        	var resjson = JSON.parse(body).data;
		        var newarray=[];
		        for (var i in resjson){
		        	var newdata={
		        		number:resjson[i].aaa102,
		        		name:resjson[i].aaa103,
		        	};
		        	newarray.push(newdata);


		        	request.post({
				        url: 'http://hzbys.hzrc.com/personnel/pd02/selectZnsjfl',  //构建请求
				        // encoding: null,  //不转码
				        headers: {
				            Cookie: session,
				            ContentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				        },
				        form: {  //请求体，参数
				        	aaa103: resjson[i].aaa102
				        }
				    }, function (err, res, body) {  //获取响应即可
				        if (err) {
				            callback(err);
				        }else{
				        	var resjson = JSON.parse(body).data;
					        var newarray=[];
					        for (var k in resjson){
					        	var newdata={
					        		number:resjson[k].aaa102,
					        		name:resjson[k].aaa103,
					        	};
					        	newarray.push(newdata);

					        }
					        asdModel.create(newarray,function(err,data){});
				        }
				        // setTimeout(function() {
				        // 	callback(null);
				        // }, 500);
				    });
		        }
		        asdModel.create(newarray,function(err,data){});
	        }
	    });
	}
	callback('ok');
};


exports.fgh = function(reqData, callback){
	var session = 'JSESSIONID=2C02BA53E706A72952DB5E0B27F5BBEF';
	for(var j = 11; j <= 82; j++){
		var reqNumber = j+'0000';
		request.post({
	        url: 'http://hzbys.hzrc.com/personnel/qc17/syds_select',  //构建请求
	        // encoding: null,  //不转码
	        headers: {
	            Cookie: session,
	            ContentType: 'application/x-www-form-urlencoded; charset=UTF-8',
	        },
	        form: {  //请求体，参数
	        	aaa103: reqNumber
	        }
	    }, function (err, res, body) {  //获取响应即可
	        if (err) {
	            callback(err);
	        }else{
	        	var resjson = JSON.parse(body).data;
		        var newarray=[];
		        for (var i in resjson){
		        	var newdata={
		        		number:resjson[i].aaa102,
		        		name:resjson[i].aaa103,
		        	};
		        	newarray.push(newdata);
		        }
		        fghModel.create(newarray,function(err,data){});
	        }
	    });
	}
	callback('ok');
};