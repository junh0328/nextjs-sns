const passport = require('passport');
const local = require('./local');

module.exports = () => {
  passport.serializeUser(() => {});

  passport.deserializeUser(() => {});

  local(); // passport/local.js 의 파일이 실행됨
};

// app.js에서 사용할 passport를 exports함
