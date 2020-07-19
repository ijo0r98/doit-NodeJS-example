//local-login 
/*로컬 인증 방식 사용, 객체 생성*/

var LocalStrategy=require('passport-local').Strategy;

module.exports=new LocalStrategy({
    usernameField: 'email', 
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
  })