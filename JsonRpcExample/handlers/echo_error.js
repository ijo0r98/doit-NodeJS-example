//echo 오류 테스트 함수

var echo_error=function(params, callback){
    console.log('JSON-RPC echo_error call');
    console.dir(params);

    //파라미터 체크
    if(params.length < 2){ //error, 파라미터 개수 부족
        callgack({
            code:400,
            message:'Insufficient parameters'
        }, null);
        return;
    }

    //성공 시
    var output='Success';
    callback(null, output); //(error code, message)
};

module.exports=echo_error;