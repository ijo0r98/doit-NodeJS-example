//익스프레스의 요청 객체와 응답 객체 알아보기2

var express=require('express');
var http=require('http');

var app=express();
app.set('port', process.env.PORT||3000); 

//middleware
app.use(function(req, res, next){
    console.log('first middleware');

    res.redirect('http://google.co.kr'); //google페이지로 바로 이동
})

/*app.use('/', function(req, res, next){
    console.log('second middleware');
    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.end('<h1>express server response '+req.user+'</h1>');
})*/

//서버 시작
http.createServer(app).listen(app.get('port'),function(){
    console.log('express server start! '+app.get('port'));
});


