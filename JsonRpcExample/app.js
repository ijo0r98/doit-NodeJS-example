var express = require('express');
var path = require('path');
var logger = require('morgan'); //debug log
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var expressErrorHandler = require('express-error-handler');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var app = express();
var crypto = require('crypto');
var route_loader = require('./routes/route_loader');

/*-----jayson set-----*/
//jayson 모듈
var handler_loader=require('./handlers/handler_loader');
//JSON-RPC 사용
var jayson=require('jayson');
//JSON-RPC 핸들러 정보를 읽어 들여 핸들러 경로 설정
var jsonrpc_api_path=config.jsonrpc_api_path || '/api'; //localhost:3000/api로 접근 가능
handler_loader.init(jayson, app, json_api_path); //핸들러 파일 등록

console.log('JSON_RPC를 [',+jsonpc_api+path+']패스에서 사용하도록 설정');


// Passport
var passport = require('passport');
var flash = require('connect-flash');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
  secret: 'my key',
  resave: true,
  saveUninitialized: true
}));

// Passport 사용자 설정
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// 라우터와 디비연결 및 호출 모듈화
route_loader.init(app);

var configPassport = require('./config/passport');
configPassport(app, passport);

var userPassport = require('./routes/user_passport');
userPassport(app, passport);

// ..
var errorHandler = expressErrorHandler({
  static: {
    '404': './public/html/404.html'
  }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

module.exports = app;
