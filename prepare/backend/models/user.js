const { STRING } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User', //MySQL에는 users 테이블 생성 모델은 대문자(USER), workbench는 소문자+복수(users)
    {
      //id가 autoincrement로 자동으로 들어있고 올라간다.
      email: {
        type: DataTypes.STRING(30), // 문자열, 30글자 내외
        allowNull: false, // 필수
        unique: true, // 고유한 값
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false, // 필수
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false, // 필수
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci', // 한글 저장
      tableName: 'users',
    }
  );
  User.associate = (db) => {
    db.User.hasMany(db.Post); //User가 여러개의 Post를 가질 수 있다.
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' }); // 사용자와 게시글의 좋아요 관계
    db.User.belongsToMany(db.User, {
      through: 'Follow',
      as: 'Followers',
      foreignKey: 'followingId',
    });
    db.User.belongsToMany(db.User, {
      through: 'Follow',
      as: 'Followings',
      foreignKey: 'followerId',
    });
  };
  return User;
};

/*
MySQL에서는 테이블 <-> Sequelize에서는 모델이라고 불린다.
시퀄라이즈 모델을 User라고 만들 경우 시퀄라이즈를 통해 DB 테이블에는 소문자+복수 users라고 테이블명이 생성된다.
id는 기본적으로 들어있다.

db.Comment.belongsTo(db.User);

- 🌟belongsTo🌟 라는 함수를 통해 Comment에는 UserId라는 속성이 생긴다.
- 이 Comment에 UserId를 통해 users테이블의 id (users.id)에 접근이 가능해진다.
- 따라서 User 모델, 즉 users 테이블에 서는 UserId를 찾을 수 없지만 User 모델에 포함된 다른 모델 (Comment 모델 = comments 테이블)에서는 UserId를 찾을 수 있다.

- 다대다 관계에서는 항상 중간 테이블이 생긴다 
- user <-> follow <-> user
- 🌟 through 속성을 통해 테이블명을 정해줄 수도 있다.
- as 라는 속성으로 별칭을 붙여주어 구분이 가능하다.
- 후에 이 'as'를 통해 User.Followings 와 같은 접근이 가능해진다.
- '나'를 팔로우하는 사람을 찾으려면 먼저 '나'를 찾고 '나'를 팔로우하는 사람들을 찾아야 하므로 이때 사용하는 것이 foreignKey 속성이다.

- 🌟결과적으로 우리는 DB 테이블에 직접 접근할 수 없기 때문에, 시퀄라이즈 명령어를 통해 접근한다.
- User.findOne() / User.findAll() 등 User는 시퀄라이즈 모델의 User이다 이 명령어를 통해 시퀄라이즈가 DB 테이블(=users)에 들어가 찾게 되는 것이다.
*/
