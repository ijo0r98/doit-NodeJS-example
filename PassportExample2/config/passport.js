//패스포트 설정
/*passport 객체 참조*/ 

var local_login=require('./passport/local_login');
var local_signup=require('./passport/local_signup');


module.exports=function(app, passport){
    console.log('config/passport call');

    
    //사용자 인증이 성공했을 때
    passport.serializeUser(function(user, done){
        console.log('serializeUser() call');
        console.dir();
  
        done(null, user);
    })
  
    //사용자 인증 이후 사용자 요청이 있을 때마다 호출
    passport.deserializeUser(function(user, done){
        console.log('deserializeUser() call');
        console.dir(user);
  
        done(null, user);
    })

    //인증방식 설정
    passport.use('local-login', local_login);
    passport.use('local-signup', local_signup);
}