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

//router-post방식
var router=express.Router();
router.route('/process/login').post(function(req,res){
    
    //login2.html <form action>
    console.log('/process/login 처리');

    var paramId=req.body.id||req.query.id; //post || get
    var paramPassword=req.body.password||req.query.password;
    
    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express server response</h1>');
    res.write('<div><p>param id: '+paramId+'</p></div>');
    res.write('<div><p>param password: '+paramPassword+'</p></div>');
    res.write("<br><br><a href='/html/login2.html'>로그인 페이지로 돌아가기</a>");

    res.end();

})

//router객체 app객체에 등록
app.use('/',router);

//등록되지 않은 패스에 대해 페이지 오류 응답
app.all('*',function(req, res){
    res.status(404).send('<h1>ERROR-페이지를 찾을 수 없습니다.</h1>');
})

http.createServer(app).listen(app.get('port'),function(){
    console.log('express server start! '+app.get('port'));
});


