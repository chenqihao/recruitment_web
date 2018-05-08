var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.session.user){
		res.render('index', { title: 'welcome '+ req.session.user.username});
	}else{
		res.redirect('/login');
	}
});

router.get('/cleanSession', function(req, res, next) {
	req.session.destroy(function(err) {
		if(err){
			res.json({ret_code: 2, ret_msg: '退出登录失败'});
		}else{
			res.clearCookie('mycookie');
			res.json({ret_code: 0, ret_msg: '成功退出登录'});
		}
	});
});
module.exports = router;
