//라우팅 관련 함수 -> 모듈 파일로 분리

module.exports=function(router, passport){
    console.log('user_passport call');
    
    //홈화면
    router.route('/').get(function(req, res){
    console.log('/패스 요청');
    res.render('index.ejs'); //view폴더 안의 index.ejs 뷰 템플릿으로 웹 문서 만드 후 응답 전송
    })

    //로그인 화면
    router.route('/login').get(function(req, res){
        console.log('/login path call');   
        res.render('login.ejs', {message:req.flash('loginMessage')}) //passport에서 설정한 플래시 메시지
    })
    
    router.route('/login').post(passport.authenticate('local-login', {
        //post방식으로 라우팅 함수 등록
        successRedirect:'/profile', //성공
        failureRedirect: '/login', //실패
        failureFlash: true //플래시 메시지 옵션
    }))
    
    //회원가입 화면
    router.route('/signup'.get(function(req, res){
        console.log('/signup path call');
        res.render('signup.ejs', {message:req.flash('signupMessage')})
    }))
  
    router.route('/signup'.post(passport.authenticate('local-signup', {
        //post방식으로 라우팅 함수 등록
        successRedirect:'/profile', //성공
        failureRedirect: '/signup', //실패
        failureFlash: true //플래시 메시지 옵션
    })))

    //프로필 화면
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
    router.route('/logout').get(function(req, res){
        console.log('/logout path call');
        req.logout();
        res.redirect('/');
    })
}