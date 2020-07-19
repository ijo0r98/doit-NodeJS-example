//CH05-4 요청 라우팅하기

var express=require('express');
var http=require('http');
var path=require('path');
var url = require('url');

var bodyparser=require('body-parser');
var static=require('serve-static');

var app=express();
app.set('port', process.env.PORT||3000); 

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.use(express.static(path.join(__dirname, 'public')));

//router-post+form action param
var router=express.Router();
router.route('/process/login/:name').post(function(req,res){
    
    //login3.html <form action '../:name=mike>
    console.log('/process/login/:name 처리');

    //url params
    var paramName=req.params.name;

    var paramId=req.body.id||req.query.id; //post || get
    var paramPassword=req.body.password||req.query.password;
    
    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express server response</h1>');
    res.write('<div><p>param name: '+paramName+'</p></div>');
    res.write('<div><p>param id: '+paramId+'</p></div>');
    res.write('<div><p>param password: '+paramPassword+'</p></div>');
    res.write("<br><br><a href='/html/login3.html'>로그인 페이지로 돌아가기</a>");

    res.end();

})

//router객체 app객체에 등록
app.use('/',router);

http.createServer(app).listen(app.get('port'),function(){
    console.log('express server start! '+app.get('port'));
});


