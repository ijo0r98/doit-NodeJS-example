//CH6-06 mysql데이터베이스 사용하기

var express=require('express');
var http=require('http');
var path=require('path');
var url = require('url');
var bodyparser=require('body-parser');
var static=require('serve-static');

//mysql 데이터베이스 연결 설정
var mysql=require('mysql');
var pool=mysql.createPool({
    connectionLimit:10,
    host:'localhost',
    user:'root',
    password:'0000',
    database:'test',
    debug:false  
});

var app=express();
app.set('port', process.env.PORT||3000); 

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.use(express.static(path.join(__dirname, 'public')));

var router=express.Router();

router.route('/process/login').post(function(req,res){
    console.log('/process/login 처리');

    var paramId=req.body.id||req.query.id;
    var paramPassword=req.body.password||req.query.password;
    
    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express server response</h1>');
    res.write('<div><p>param id: '+paramId+'</p></div>');
    res.write('<div><p>param password: '+paramPassword+'</p></div>');
    res.write("<br><br><a href='/login2.html'>로그인 페이지로 돌아가기</a>");

    res.end();

})

//사용자 등록 함수
var addUser=function(id, name, age, password, callback){
    console.log('-----addUser func call-----');

    //커넥션 풀에서 연결 객체 가져옴
    pool.getConnection(function(err,conn){
        if(err){
            if(conn){
                conn.release(); // *반드시 해제
            }
            callback(err, null);
            return;
        }

        console.log('- database connect id: '+conn.threadId);

        //데이터->객체
        var data={id:id, name:name, age:age, password:password};

        //sql
        var exec=conn.query('insert into users set ?', data, function(err,result){
            conn.release(); // *반드시 해제
            console.log('- sql: '+exec.sql);

            if(err){
                console.log('sql exec err');
                console.dir(err);

                callback(err, null);

                return;
            }

            callback(null, result); //결과가 result파라미터로 전달
        })
    })
}

//사용자 인증 함수
var authUser=function(id, password, callback){
    console.log('-----authUser func call-----');

    pool.getConnection(function(err, conn){
        if(err){
            if(conn){
                conn.release(); // *반드시 해제
            }
            callback(err, null);
            return;
        }
       
        console.log('- database connect id: '+conn.threadId);

        var columns=['id','name','age'];
        var tablename='users';

        var exec=conn.query(
            'select ?? from ?? where id=? and password=?',
            [columns, tablename, id, password], function(err, rows){
                conn.release(); //*반드시 해제
                console.log('- sql: '+exec.sql);

                if(rows.length>0){ //결과 있을 때
                    console.log('id [%s] password [%s]가 일치하는 사용자 찾음', id, password);
                    callback(null, rows);
                }else{ //결과 없을 때
                    console.log('일치하는 사람 없음');
                    callback(null, null);
                }
            })
    })
}

//사용자 갱신 함수

//사용자 삭제 함수

//사용자 추가 라우팅 함수
router.route('/process/adduser').post(function(req,res){
    console.log('/process/adduser call');

    //추가할 파라미터 확인
    var paramId=req.body.id || req.query.id;
    var paramPassword=req.body.password || req.query.password;
    var paramName=req.body.name || req.query.name;
    var paramAge=req.body.age || req.query.age;

    console.log('params: '+paramId+', '+paramPassword+', '+paramName+', '+paramAge);

    //pool 초기화된 경우, adduser함수 호출하여 사용자 추가
    if(pool){
        addUser(paramId,paramName,paramAge,paramPassword, function(err, addedUser){
            //동일한 id로 추가할 때 오류 발생 -클라이언트로 오류 전송
            if(err){
                console.error('사용자 추가 중 오류 발생: '+err.stack);

                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 추가 중 오류 발생!</h2>');
                res.write('<p>'+err.stack+'</p>');
                res.end();

                return;
            }

            //결과 객체 있으면 성공 응답 전송 callback(null, result=addeduser)
            if(addedUser){
                console.dir(addUser);

                console.log('inserted '+addedUser.affectedRows+' rows');

                var insertId=addedUser.insertId;
                console.log('추가한 레코드의 아이디: '+insertId);

                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 추가 성공!</h2>');
                res.end();
            }else{ // adduser err
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 추가 실패!</h2>');
                res.end();
            }
        });
    }else{ // pool err 데이터베이스 객체가 초기화 되지 않은 경우 실패 응답 전송
        res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패!</h2>');
        res.end();
    }
})

//로그인 라우팅 함수
router.route('/process/login').post(function(req, res){
    console.log('/process/login call');

    //인증할 파라미터 확인
    var paramId=req.body.id || req.query.id;
    var paramPassword=req.body.password || req.query.password;

    console.log('params: '+paramId+', '+paramPassword);

    //pool 객체가 초기화 된 경우, authUser함수 호출하여 사용자 인증
    if(pool){
        authUser(paramId, paramPassword, function(err, rows){
            if(err){ //인증 중 오류 발생 시
                console.err('사용자 로그인 중 오류 발생: '+err.stack);

                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 로그인 중 오류 발생</h2>');
                res.write('<p>'+err.stack+'</p>');
                res.end();

                return;
            }

            //결과가 존재-인증 성공
            if(rows){ 
                console.dir(rows);

                var username=rows[0].name;

                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 로그인 성공!</h2>');
                res.write('<div><p>user id: '+paramId+'</p></div>');
                res.write('<div><p>user name: '+paramname+'</p></div>');
                res.write("<br><br><a href='/login2.html'>다시 로그인 하기</a>");
                res.end();
            }
        })

    }
})

app.use('/',router);

app.all('*',function(req, res){
    res.status(404).send('<h1>ERROR-페이지를 찾을 수 없습니다.</h1>');
})

http.createServer(app).listen(app.get('port'),function(){
    console.log('express server start! '+app.get('port'));
});
