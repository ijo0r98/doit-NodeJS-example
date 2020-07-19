//1
//exports 객체 속성으로 함수 추가
exports.getUser=function(){
    return {id:'test', name:'오마이걸'};
}
//exports 객체 속성으로 객체 추가
exports.group={id:'group', name:'친구'};

//2
//함수와 객체를 속성으로 가진 객체를 만들어 exports에 할당
exports={
    getUser: function(){
        return {id:'test', name:'오마이걸'};
    },
    group: {id:'group', name:'친구'}
}

//3
//module.exports사용하여 객체 할당
var user={
    getUser: function(){
        return {id:'test', name:'오마이걸'};
    },
    group: {id:'group', name:'친구'}
}
module.exports=user;

//4
//익명함수 할당
module.exports=function(){
    return {id:'test', name:'오마이걸'};
}

//5
//exports와 module.exports함께 사용 -> module.exports 우선 적용
module.exports={
    getUser: function(){
        return {id:'test', name:'오마이걸'};
    },
    group: {id:'group', name:'친구'}
}
exports.group={id:'group2', name:'가족'};

//6

//7-11
// 1) 함수할당
exports.printUser1=function(){
    console.log('user 이름은 오마이걸 입니다.');
}

// 2)인스턴스 객체 할당
function User(id, name){ //*생성자 함수
    this.id=id;
    this.name=name;
}

User.prototype.getUser=function(){
    return {id:this.id, name:this.name};
}
User.prototype.group={id:'group', name:'친구'};
User.prototype.printUser2=function(){
    console.log('user name: %s, group name: %s', this.name, this.group.name);
}
module.exports=new User('test', '오마이걸'); //-1

exports.user=new User('test2', '소녀시대'); //-2

// 3) 프로토타입 객체 할당
module.exports=User; //-1
exports.User=User; //-2