module.exports = (sequelize, DataTypes) => {
  const Hashtag = sequelize.define(
    'Hashtag',
    {
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci', // 한글 저장(utf8) + 이모티콘 저장(mb4)
    }
  );
  Hashtag.associate = (db) => {};
  return Hashtag;
};
