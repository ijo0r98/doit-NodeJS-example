//모듈화 전

var express = require('express');
var path = require('path');
var logger = require('morgan'); //log
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var expressErrorHandler = require('express-error-handler');
var mongodb = require('mongodb'); //mongodb
var mongoose = require('mongoose');
var crypto = require('crypto'); //비밀번호 암호화
var route_loader=require('./routes/route_loader');

var app = express();

//-----passport 사용-----
var passport=require('passport');
var flash=require('connect-flash');

//-----passport 미들웨어 사용 설정-----
app.use(passport.initialize()); //초기화
app.use(passport.session()); //로그인 세션 유지
app.use(flash()); //플래시 메시지


//-----로컬 스트래티지 설정-----
var LocalStrategy=require('passport-local').Strategy;

//패스포트 로그인 설정 - local-login 스트래티지 설정 이름
passport.use('local-login', new LocalStrategy({
  usernameField: 'email', //이름이 다른 경우 localstrategy 사용할 이름 설정
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done){ //callback 함수
  console.log('passport의 local-login 함수 호출됨: '+email+', '+password);

  var database=app.get('database');

  database.UserModel.findOne({'emial':email}, function(err, user){
    if(err) return done(err);

    //등록된 사용자가 없는 경우
    if(!user){
      console.log('사용자 계정이 일치하지 않음');
      return done(null, false, req.flash('loginMessage', '등록된 계정이 없습니다.'));
    }

    //비밀번호가 맞지 않는 경우
    var authenticated=user.authenticated(password, user._doc.salt, user._doc.hased_password);
    if(!authenticated){
      console.log('비밀번호 일치하지 않음!');
      return done(null, false, req.flash('loginMessage', '비밀번호가 일치하지 않습니다'));
    }

    //정상인 경우
    console.log('계정과 비밀번호가 일치함');
    return done(null, user);
  })
}))


//패스포트 회원가입 설정
passport.use('local-signup', new LocalStrategy({
  usernameField: 'email', 
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done){
  //요청 피라미터 중 name피라미터 확인
  var paramName=req.body.name || req.query.name;
  console.log('passport의 local-signup 호출됨: '+email+', '+password+', '+paramName);

  //User.findOne이 blocking되므로 async(비동기)방식으로 변경할 수도 있음
  process.nextTick(function(){
    var database=app.get('database');
    database.UserModel.findOne({'email':email}, function(err, user){

      //오류 발생시
      if(err) return done(err);

      //기존 이메일 있다면
      if(user){
        console.log('기존 계정이 있음');
        return done(null, false, req.flash('SignupMessage', '계정이 이미 있습니다.'));
      }else{
        //모델 인스턴스 객체 만들어 저장
        var user=new database.UserModel({'email': email, 'password':password, 'name':paramName});

        user.save(function(err){
          if(err) throw err;
          console.log('사용자 데이터 추가');
          return done(null, user);
        })
      }
    })
  })
}))

//세션 저장, 복원
//사용자 인증이 성공했을 때
passport.serializeUser(function(user, done){
  console.log('serializeUser() call');
  console.dir();

  done(null, user);  //user객체 다음 처리할 함수에 전달
})

//사용자 인증 이후 사용자 요청이 있을 때마다 호출
passport.deserializeUser(function(user, done){
  console.log('deserializeUser() call');
  console.dir(user);

  done(null, user); //req의 user속성으로 추가, 다른 곳에서 확인 가능
})

//-----passport설정 완료-----


var index = require('./routes/index'); //router
var users = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev')); //morgan -log

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public'))); //static

//session setup
app.use(expressSession({ 
  secret: 'my key',
  resave: true,
  saveUninitialized: true
}));


//-----라우팅 함수 등록-----
//라우팅 정보를 읽어 들여 라우팅 설정
var router=express.Router();
route_loader.init(app, router);

//홈화면 -index.ejs 템플릿으로 홈 화면이 보이도록 함
router.route('/').get(function(req, res){
  console.log('/패스 요청');
  res.render('index.ejs'); //view폴더 안의 index.ejs 뷰 템플릿으로 웹 문서 만드 후 응답 전송
})

//로그인 폼 링크
app.get('/login', function(req, res){
  console.log('/login path call');
  res.render('login.ejs', {message:req.flash('loginMessage')}) //passport에서 설정한 플래시 메시지
})

app.post('/login', passport.authenticate('local-login', {
  //post방식으로 라우팅 함수 등록
  successRedirect:'/profile', //성공
  failureRedirect: '/login', //실패
  failureFlash: true //플래시 메시지 옵션
}))

//회원가입 폼 링크
app.get('/signup', function(req, res){
  console.log('/signup path call');
  res.render('signup.ejs', {message:req.flash('signupMessage')})
})

app.post('/signup', passport.authenticate('local-signup', {
  //post방식으로 라우팅 함수 등록
  successRedirect:'/profile', //성공
  failureRedirect: '/signup', //실패
  failureFlash: true //플래시 메시지 옵션
}))

//사용자 프로필을 보여주기 위한 라우팅 함수 추가
//프로필 화면 - 로그인 여부를 확인할 수 있도록 먼저 isLoggedIn 미들웨어 설정
router.route('/profile').get(function(req, res){
  console.log('/profile path call');

  console.log('req.user: ');
  console.dir(req.user);
  //인증이 안된 경우 req.user객체 false
  if(!req.user){
    console.log('사용자 인증이 안 된 상태');
    res.redirect('/'); //home으로 연결
    return;
  }
  //인증된 경우 req.user객체에 사용자 정보가 있음
  console.log('사용자 인증된 상태');
  if(Array.isArray(req, res)) res.render('profile.ejs',{user:req.user[0]._doc})
  else res.render('profile.ejs', {user:req.user})
})

//로그아웃
app.get('/logout', function(req, res){
  console.log('/logout path call');
  req.logout();
  res.redirect('/');
})
//-----경로 연결 설정 완료-----



//router
app.use('/', index);
app.use('/users', users);
app.set('name', 'capkum');

// mongodb connection
var database;
var UserSchema;
var UserModel;

// mongodb setting
function connectDB() {
  var databaseUrl = 'mongodb://localhost:27017/shopping';

  mongoose.connect(databaseUrl);
  database = mongoose.connection;
  database.on('error', console.error.bind(console, 'mongoose connection  error'));
  database.on('open', function() {
    console.log('데이터베이스에 연결되었습니다. :' + databaseUrl);
    createUserSchema();
  });

  database.on('disconnected', connectDB);
}

// mongodb connect
connectDB();

// set schema
function createUserSchema() {
  UserSchema = require('./database/user_schema').createSchema(mongoose);
  UserModel = mongoose.model('user2', UserSchema);
  require('./commonModule/user_dao').init(database, UserSchema, UserModel);
  console.log('users model 정의함');
}

var errorHandler = expressErrorHandler({
  static: {
    '404': './public/404.html'
  }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

module.exports = app;
