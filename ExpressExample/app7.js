//CH05-3 미들웨어 사용하기

var express=require('express');
var http=require('http');
var path=require('path');
var url = require('url');

//express의 미들웨어 bodyparser
var bodyparser=require('body-parser');
var static=require('serve-static');

var app=express();
app.set('port', process.env.PORT||3000); 

//bodyparser를 사용해 application/x-www-form-urlencoded 파싱
app.use(bodyparser.urlencoded({extended:false}));
//bodyparser를 사용해 application/json 파싱
app.use(bodyparser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
    console.log('first middleware');
    //미들웨어에서 파라미터 확인
    
    console.log(url.parse(req.url, true).pathname);

    var paramId=req.body.id||req.query.id; //post || get
    var paramPassword=req.body.password||req.query.password;
    
    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express server response</h1>');
    res.write('<div><p>param id: '+paramId+'</p></div>');
    res.write('<div><p>param password: '+paramPassword+'</p></div>');
    res.end();

})


http.createServer(app).listen(app.get('port'),function(){
    console.log('express server start! '+app.get('port'));
});


