const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
// 개발시 기본 환경 변수(env)를 development를 사용하겠다 >> config.config.json 에서 development 부분을 사용하겠다
const config = require('../config/config.js')[env]; //config에는 config.json에 담긴 해당 환경변수 데이터 (development)가 저장된다.
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config); //시퀄라이즈를 통해 해당 데이터를 연동한다.

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
