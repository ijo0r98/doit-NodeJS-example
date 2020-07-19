//CH05-2 익스프레스로 웹 서버 만들기

var express=require('express');
var http=require('http');

//익스프레스 객체 속성 설정
var app=express();
app.set('port', process.env.PORT||3000); //set: 속성 설정

//서버 시작
http.createServer(app).listen(app.get('port'),function(){
    //get: 속성 전달
    console.log('express server start! '+app.get('port'));
});


