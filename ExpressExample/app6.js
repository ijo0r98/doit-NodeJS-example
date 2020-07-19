//익스프레스에서 요청 객체에 추가한 헤더와 파라미터 알아보기

var express=require('express');
var http=require('http');

var app=express();
app.set('port', process.env.PORT||3000); 

//middleware
app.use(function(req, res, next){
    console.log('first middleware');

    //http://localhost:3000/?name=mike ->? name파라미터=mike
    var userAgent=req.header('User-Agent');
    var paramName=req.query.name;
    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express server response</h1>');
    res.write('<div><p>user-agent: '+userAgent+'</p></div>');
    res.write('<div><p>param name: '+paramName+'</p></div>');
    res.end();

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


