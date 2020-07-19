/*id->email*/

var crypto = require('crypto'); //비밀번호 암호화

var Schema = {};

Schema.createSchema = function(mongoose) {
  var UserSchema = mongoose.Schema({
    email: {
      type: String,
      'default': ''
    },
    hashed_password: {
      type: String,
      required: true,
      'default': ''
    },
    salt: {
      type: String,
      required: true
    },
    name: {
      type: String,
      index: 'hashed',
      'default': ''
    },
    created_at: {
      type: Date,
      index: {
        unique: false
      },
      'default': Date.now
    },
    updated_at: {
      type: Date,
      index: {
        unique: false
      },
      'default': Date.now
    },
  });

  UserSchema
    .virtual('password')
    .set(function(password) {
      this._password = password;
      this.salt = this.makeSalt();
      this.hashed_password = this.encryptPassword(password);
      console.log('virtual password 호출됨 : ' + this.hashed_password);
    })
    .get(function() {
      return this._password;
    });

  UserSchema.method('encryptPassword', function(plainText, inSalt) {
    if (inSalt) {
      return crypto.createHmac('sha1', inSalt).update(plainText).digest(
        'hex');
    } else {
      return crypto.createHmac('sha1', this.salt).update(plainText).digest(
        'hex');
    }
  });

  UserSchema.method('makeSalt', function() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  });

  UserSchema.method('authenticate', function(plainText, inSalt,
    hashed_password) {
    if (inSalt) {
      console.log('authenticate 호출됨 %s -> %s : %s', plainText,
        this.encryptPassword(plainText, inSalt), hashed_password);
      return this.encryptPassword(plainText, inSalt) == hashed_password;
    } else {
      console.log('authenticate 호출됨 %s -> %s : %s', plainText,
        this.encryptPassword(plainText, inSalt), hashed_password);
      return this.encryptPassword(plainText) == hashed_password;
    }
  });

  //입력된 칼럼 값이 있는지 확인
  UserSchema.path('email').validate(function(email) {
    return email.length;
  }, 'email 컬럼이 없습니다.');

  UserSchema.path('hashed_password').validate(function(hashed_password) {
    return hashed_password.length;
  }, 'hashed_password 컬럼이 없습니다.');

  //모델 객체에서 사용할 수 있는 메소드 정의
  UserSchema.static('findByEmail', function(email, callback) {
    return this.find({
      'email': email
    }, callback);
  });

  UserSchema.static('findAll', function(callback) {
    return this.find({}, callback);
  });

  console.log('UserSchema 정의함');

  return UserSchema;
};

module.exports = Schema;
