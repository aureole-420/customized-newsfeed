

var auth = require('./routes/auth');
var cors = require('cors');

// var createError = require('http-errors');
var express = require('express');
var passport = require('passport');
var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var index =require('./routes/index');
var news = require('./routes/news');
var app = express();

var bodyParser = require('body-parser');
// 这个中间件放在最前面！因为use bodyParser middleware before any handler of POST request
app.use(bodyParser.json());

var config = require('./config/config.json');
require('./models/main.js').connect(config.mongoDbUri); // 这里把mongosse的调用给封装了起来
var authChecker = require('./auth/auth_checker'); // 要在配置好mongo之后，才能引入model User

app.use(passport.initialize());
// 绑定strategy
passport.use('local-signup', require('./auth/signup_local_strategy'));
passport.use('local-login', require('./auth/login_local_strategy'));

// view engine setup
app.set('views', path.join(__dirname, '../client/build'));// 需要把react app发送给用户
app.set('view engine', 'jade');
app.use('/static', express.static(path.join(__dirname, '../client/build/static')));
// 类似图片的静态文件，不要找我，去找react app

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// TODO: remove this after development is done

app.use(cors()); // 允许跨域

app.use('/', index);

// var login = require('')
app.use('/login', index);

app.use('/auth', auth);
app.use('/news', authChecker); // 看门狗，要访问news得先检查token等。。。
app.use('/news', news); // 给前端传数据的接口

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // next(createError(404));
  res.status(404);
});

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
