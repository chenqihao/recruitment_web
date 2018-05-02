var express = require('express');
// var getRouter = express.Router();
// var postRouter = express.Router();
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('login', {flag: 0, title: '登录界面'});
});

router.post('/',function(req, res){
	if(req.body.username == 'hello' && req.body.password == 'world'){
		res.cookie('authorized', req.body.username);
		res.redirect('/index');
	}else{
		res.render('login', {flag: 1, title: '登录界面'});
	}
});

router.get("/register", function(req, res) {
	res.redirect('/index');
});

// module.exports.get = getRouter;
// module.exports.post = postRouter;
module.exports = router;