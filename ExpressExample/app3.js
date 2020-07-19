//여러 개의 미들웨어를 등록하여 사용하는 방법 알아보기

var express=require('express');
var http=require('http');

var app=express();
app.set('port', process.env.PORT||3000); 

//middleware
app.use(function(req, res, next){
    console.log('first middleware');
    req.user='mike'; //req객체에 속성 추가

    next(); //다음 미들웨어로 처리 결과 넘겨줌
})

app.use('/', function(req, res, next){
    console.log('second middleware');
    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.end('<h1>express server response '+req.user+'</h1>');
})

//서버 시작
http.createServer(app).listen(app.get('port'),function(){
    console.log('express server start! '+app.get('port'));
});


