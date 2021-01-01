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
    }
  );
  User.associate = (db) => {};
  return User;
};
