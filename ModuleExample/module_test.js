var user=require('./user');

//1
//require() 메소드로 exports객체 반환
function showUser1(){
    return user.getUser()+', '+user1.group.name; //함수+객체
}
console.log('사용자 정보: %s', showUser1());

//2
function showUser2(){
    return user.getUser+', '+user.group+name;
}
console.log(showUser2()); //*

//3
function showUser3(){
    return user1.getUser()+', '+user.group.name;
}
console.log('사용자 정보: %s', showUser3());

//4
function showUser4(){
    return user().name+', '+'No Group';
}
console.log('사용자 정보: %s', showUser4());

//5
function showUser5(){
    return user.getUser()+', '+user.group.name; //module.exports 반영
}
console.log('사용자 정보: %s', showUser5());

//6
//require()동작 이해
var require=function(path){
    var exports={
        getUser: function(){
            return {id:'test', name:'오마이걸'};
        },
        group: {id:'group', name:'친구'}
    }
    return exports;
}
var user=require('...');
const { required } = require('nconf');
function showUser6(){
    return user.getUser()+', '+user.group.name;
}
console.log('사용자 정보: %s', showUser6());

//7-11
// 1) 함수할당
var printUser=require('./user').printUser1(); //함수 객체 그대로 참조 후 호출
printUser1();

// 2) 인스턴스 객체 할당
var user=require('./user'); //-1 new연산자로 만든 객체 module.exports 할당한 후
user.printUser2(); //인스턴스 객체의 함수 호출

var user=require('./user').user; //-2 exports객체의 속성으로 인스턴스 객체 추가
user.printUser2();

// 3) 프로토타입 객체 할당: User객체 새로 정의 후 직접 할당
var User=require('./user'); //-1 moudle.exports에 프로토타입 객체 정의 후 할당
var user=new User('test', '오마이걸');
user.printUser();

var User=require('./user').User; //-2
var user=new User('test', '오마이걸'); //exports 속성 이름을 주면서 추가하되 프로토타입 객체를 정의 후 할당
user.printUser();
