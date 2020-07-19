//미들웨어로 클라이언트에 응답 보내기

var express=require('express');
var http=require('http');

var app=express();
app.set('port', process.env.PORT||3000); 

//middleware
app.use(function(req,res,next){
    console.log('first middleware');
    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.end('<h1>express server response</h1>');
})

//서버 시작
http.createServer(app).listen(app.get('port'),function(){
    console.log('express server start! '+app.get('port'));
});


