//쿠키와 세션 관리하기

var express=require('express');
var http=require('http');
var path=require('path');
var url = require('url');
var expressErrorHandler=require('express-error-handler');
var bodyparser=require('body-parser');
var static=require('serve-static');

var cookieParser=require('cookie-parser');

var app=express();
app.set('port', process.env.PORT||3000); 

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser);

var router=express.Router();

router.route('/process/showCookie').get(function(req,res){
    //쿠키 객체 응답으로 보내기 위해 전달

    console.log('/process/showCookie 호출');
    
    res.send(req.cookies);
})

router.route('/process/setUserCookie').get(function(req,res){
    //cookie메소드로 user쿠키 추가

    console.log('/process/setUserCooke 호출');

    //쿠키 설정
    res.cookie('users',{
        id:'mike',
        name:'오마이걸',
        authorized:true
    });

    //응답-쿠키 보여줌
    res.redirect('/process/showCookie') 
})

app.use('/',router);

app.all('*',function(req, res){
    res.status(404).send('<h1>ERROR-페이지를 찾을 수 없습니다.</h1>');
})

//404오류에 대한 오류 페이지 지정
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


