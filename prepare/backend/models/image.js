module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define(
    'Image',
    {
      src: {},
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci', // 한글 저장(utf8)
    }
  );
  Image.associate = (db) => {};
  return Image;
};
