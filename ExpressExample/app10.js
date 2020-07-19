//토큰과 함께 요청한 정보 처리하기(get)

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

//router-get요청
var router=express.Router();
router.route('/process/users/:id').get(function(req,res){
    //입력된 url../:id

    console.log('/process/users/:id 처리');

    var paramId=req.params.id;

    console.log('/process/users와 토큰 %s를 이용해 처리', paramId);
    
    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express server response</h1>');
    res.write('<div><p>param id: '+paramId+'</p></div>');

    res.end();

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


