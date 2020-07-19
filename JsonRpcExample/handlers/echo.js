//클라이언트에서 보낸 데이터 그대로 클라이언트로 전송

var echo=function(params, callback){
    //(클라이언트로부터 전달받은 배열 객체, 응답을 보낼 때 사용할 콜백함수)
    console.log('JSON-RPC echo call');
    console.dir(params);
    callback(null, params); //(오류전달, 정상적인 데이터 전달)
};

module.exports=echo;