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
      tableName: 'comments',
    }
  );
  Comment.associate = (db) => {
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Post);
  };
  return Comment;
};

/*
🌟최신화 된 class형 시퀄라이즈 문법🌟
const DataTypes = requires('sequelize');
const { Model } = DataTypes; // 

module.exports = class Comment extends Model {
  static init(sequelize){
    return super.init({
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      }
    },{
        modelName : 'Comment',
        tableName : 'comments',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        sequelize,
    });
  }

  static associate(db){
    db.Hashtag.belongsToMany(db.Post, { through : 'PostHashtag'});
  }
}
*/
