//express-error-handler 미들웨어로 오류 페이지 보내기

var express=require('express');
var http=require('http');
var path=require('path');
var url = require('url');
var expressErrorHandler=require('express-error-handler');

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

app.use('/',router);

app.all('*',function(req, res){
    res.status(404).send('<h1>ERROR-페이지를 찾을 수 없습니다.</h1>');
})

//404오류에 대한 오류 페이지
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


