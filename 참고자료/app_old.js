var createError = require('http-errors');//
var express = require('express');//
var path = require('path');//
const history = require('connect-history-api-fallback');//X
var cookieParser = require('cookie-parser');//
var logger = require('morgan');//
var session = require('express-session');//필요하면?
const fileStore = require('session-file-store')(session);//필요하면?

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var logRouter = require('./routes/log');
var uploadRouter = require('./routes/upload');
var manageRouter = require('./routes/manage');
var chatRouter = require('./routes/chat');

var app = express(); //express패키를 호출하여 app 변수 객체를 만듦

//mariaDB 설정
//const maria = require('./database/connect/maria');
//maria.connect();

//익스프레스 앱 설정
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

//미들웨어 연결
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
//app.use(express.static(path.join(__dirname, 'uploadedFiles')));

//세션 미들웨어
app.use(session({
  secret :"hospetter",
  resave:false,
  secure:true,
  saveUninitialized:true,
  store: new fileStore()
}));

//라우터 설정
app.use('/', indexRouter, logRouter, manageRouter, uploadRouter, chatRouter);
app.use('/users', usersRouter);
app.use('/upload', uploadRouter);
// app.use('/chat', chatRouter);
//app.use('/manage', manageRouter);

app.use(history());


// 404에러
app.use(function(req, res, next) {
  next(createError(404));
});

// 에러 핸들러
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app; //모듈로 만들기