// ライブラリの取得
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let bodyParser = require('body-parser');
let session = require('express-session');
let validator = require('express-validator');

// ルーティング用変数を設定
let indexRouter = require('./routes/index');
let loginRouter = require('./routes/login');
let addRouter = require('./routes/add');
let markRouter = require('./routes/mark');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 詳細なアクセスログやエラーログを記録
app.use(logger('dev'));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(validator());

let session_opt = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialize: false,
  cookie: {maxAge: 60 * 60 * 1000}
};

app.use(session(session_opt));

app.use('/login', loginRouter);
app.use('/add', addRouter);
app.use('/mark', markRouter);
app.use('/', indexRouter);


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
