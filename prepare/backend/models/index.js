const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
// 개발시 기본 환경 변수(env)를 development를 사용하겠다 >> config.config.json 에서 development 부분을 사용하겠다
const config = require('../config/config.js')[env]; //config에는 config.json에 담긴 해당 환경변수 데이터 (development)가 저장된다.
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config); //시퀄라이즈를 통해 해당 데이터를 연동한다.

db.Comment = require('./comment')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);
db.Image = require('./image')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.User = require('./user')(sequelize, Sequelize);

// 반복문을 돌면서 테이블의 associate를 실행시켜주는 함수
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

/*
시퀄라이즈는 모델과 MySQL의 테이블을 연결해주는 역할을 합니다. 
User와 Comment 모델을 만들어 users 테이블과 comments 테이블에 연결해봅시다. 
시퀄라이즈는 기본적으로 모델 이름은 단수형으로, 테이블 이름은 복수형으로 사용합니다.

*/

/*
🌟최신화 된 시퀄라이즈 문법 변경 방법 >> comment 예시🌟
1. 각 모델 추가
const comment = require('./comment')
...

2. 모델 연결
db.Comment = comment ;
...

3. forEach문으로 시퀄라이즈 init 시키기
Object.keys(db).forEach(modelName => {
  db[modelName].init(sequelize);
})


*/
