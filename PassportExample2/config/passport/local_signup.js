//local-signup 
/*로컬 인증 방식 사용, 객체 생성*/

var LocalStrategy=require('passport-local').Strategy;

module.exports=new LocalStrategy({
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
  }) 