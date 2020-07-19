//더하기 함수

var add=function(params, callback){
    console.log('JSON-RPC add call');
    console.dir(params);

    //파라미터 체크
    if(params.length<2) {//오류-파라미터 개수 부족
        callback({
            code:400,
            message:'Insufficient parameters'
        }, null);

        return;
    }

    var a=params[0];
    var b=params[1];
    var output=a+b;

    callback(null, output);
};

module.exports=add;