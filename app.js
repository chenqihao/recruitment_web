var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
// var FileStore = require('session-file-store')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var resetpwdRouter = require('./routes/resetpwd');
var chgpwdRouter = require('./routes/chgpwd');
var modinfoRouter = require('./routes/modinfo');
var personRouter = require('./routes/person');
var companyRouter = require('./routes/company');
var commonRouter = require('./routes/common');
var adminRouter = require('./routes/admin');
var testRouter = require('./routes/test');

var app = express();

var url = 'mongodb://127.0.0.1:27017/RecruitmentDB';
mongoose.connect(url);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('mycookie'));
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
app.use(session({
	secret: 'mycookie',
	resave: false,
	saveUninitialized: false
}));

app.use('/index', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/resetpwd', resetpwdRouter);
app.use('/chgpwd', chgpwdRouter);
app.use('/modinfo', modinfoRouter);
app.use('/person', personRouter);
app.use('/company', companyRouter);
app.use('/common', commonRouter);
app.use('/admin', adminRouter);
app.use('/test', testRouter);
app.get('/',function(req,res){
  res.redirect('/index');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
