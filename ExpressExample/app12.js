//세션 처리하기

var express=require('express');
var http=require('http');
var path=require('path');
var url = require('url');
var expressErrorHandler=require('express-error-handler');
var bodyparser=require('body-parser');
var static=require('serve-static');
var cookieParser=require('cookie-parser');
var expressSession=require('express-session');

var router=express.Router();
var app=express();

app.set('port', process.env.PORT || 3000); 

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser);

//session미들웨어 추가
/*app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));*/

//상품정보 라우팅 함수
router.route('/process/product').get(function(req,res){
    console.log('/process/product 호출');

    if(req.session.user){
        //user세션이 있을 경우-로그인 성공
        res.redirect('/public/html/product.html');
    }else{
        //없을 경우-로그인 페이지로 이동
        res.redirect('/public/html/login2.html')
    }
})

//로그인 라우팅 함수-로그인 후 세션 저장
router.route('/process/login').post(function(req,res){
    console.log('/process/login 호출');

    var paramID=req.body.id || req.query.id;
    var paramPassword=req.body.password || req.query.password;

    if(req.session.user){
        //이미 로그인 된 상태
        console.log('이미 로그인 되어 상품 페이지로 이동합니다.');
        res.redirect('/public/html/product.html');
    }else{
        //세션 저장
        req.session.use={
            id:paramID,
            name:'오마이걸',
            authorized:true
        };
        res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
        res.write('<h1>로그인 성공</h1>');
        res.write('<div><p>param id: '+paramId+'</p></div>');
        res.write('<div><p>param ps: '+paramPassword+'</p></div>');
        res.write("<br><br><a href='/process/product/'>상품페이지로 이동하기</a>");
        res.end();
    }
})

//로그아웃 라우팅 함수-로그아웃 후 세션 삭제
router.route('/process/logout').post(function(req,res){
    console.log('/process/logout 호출');

    if(req.session.user){
        //이미 로그인 된 상태
        console.log('로그아웃 합니다.');

        res.session.destroy(function(err){
            if(err) {throw err;}

            console.log('세션을 삭제하고 로그아웃 되었습니다.');
            res.redirect('/public/html/login2.html'); //새로 로그인 페이지로 이동
        })
    }else{
        //로그인 안된 상태
        console.log('아직 로그인되어 있지 않습니다.');
        res.redirect('/public/html/login2.html')
    }
})

app.use('/', router);

app.all('*',function(req, res){
    res.status(404).send('<h1>ERROR-페이지를 찾을 수 없습니다.</h1>');
})


var errorHandler=expressErrorHandler({
    static:{
        '404':'./pulbic/html/404.html'
    }
})

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

http.createServer(app).listen(app.get('port'),function(){
    console.log('express server start! '+app.get('port'));
});