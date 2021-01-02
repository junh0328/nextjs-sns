module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    // id가 기본적으로 들어있다.
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      // 데이터 관계에서 belongsTo를 사용하면 아래와 같은 속성들을 만들어 준다.
      // UserId() : {}
      // PostId() : {}
    },
    {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci', // 한글 저장(utf8) + 이모티콘 저장(mb4)
    }
  );
  Comment.associate = (db) => {
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Post);
  };
  return Comment;
};
