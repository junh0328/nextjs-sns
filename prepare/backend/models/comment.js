module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment', //MySQL에는 posts 테이블 생성 모델은 대문자(POST), workbench는 소문자+복수(posts)
    {
      content: {},
    },
    {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci', // 한글 저장(utf8) + 이모티콘 저장(mb4)
    }
  );
  Comment.associate = (db) => {};
  return Comment;
};
