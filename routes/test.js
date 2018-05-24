var express = require('express');
var router = express.Router();
var url = require('url');
var testModel = require('../models/test_db.js');

/* GET users listing. */
router.get('/create', function(req, res) {
	var urlData = url.parse(req.url, true).query;
	testModel.create(urlData, function(err, data){
		res.json({err:err, data:data});
	});
});
router.get('/remove', function(req, res) {
	var urlData = url.parse(req.url, true).query;
	testModel.remove(urlData, function(err, data){
		res.json({err:err, data:data});
	});
});
router.get('/find', function(req, res) {
	var urlData = url.parse(req.url, true).query;
	testModel.find(urlData, function(err, data){
		res.json({err:err, data:data});
	});
});
router.get('/update', function(req, res) {
	var urlData = url.parse(req.url, true).query;
	testModel.update(urlData, function(err, data){
		res.json({err:err, data:data});
	});
});

module.exports = router;
