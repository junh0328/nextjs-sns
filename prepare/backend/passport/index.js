const passport = require('passport');
const local = require('./local');
const { User } = require('../models');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id); // 여기서 user는 routes/user에서 로그인에 성공했을 때 생기는 값의 user이다. 이 user의 id값을 서버에서 가지고 있고 나머지는 DB에 저장하고 관리한다. 필요할 때 마다 불러와서 사용한다.
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ where: { id } });
      done(null, user); //req.user
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  local(); // passport/local.js 의 파일이 실행됨
};

// app.js에서 사용할 passport를 exports함
