module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post', //MySQL에는 posts 테이블 생성 모델은 대문자(POST), workbench는 소문자+복수(posts)
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      // belongsTo 관계에서 자동적으로 postId가 생긴다 하지만, as: 'Retweet'으로 인하여 Retweet으로 변경됨
    },
    {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci', // 한글 저장(utf8) + 이모티콘 저장(mb4)
    }
  );
  Post.associate = (db) => {
    db.Post.belongsTo(db.User); // Post는 User에 속해있다.
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); //Post들에는 Hashtag들이 많이 있다. <-> hashtag에는 post들이 많이 속한다.
    db.Post.hasMany(db.Comment); // Post에는 여러개의 댓글이 있을 수 있다.
    db.Post.hasMany(db.Image);
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' }); // 사용자와 게시글의 좋아요 관계
    db.Post.belongsTo(db.Post, { as: 'Retweet' }); // 리트윗 한 게시글이 여러개로 리트윗될 수 있기 때문에!
  };
  return Post;
};
