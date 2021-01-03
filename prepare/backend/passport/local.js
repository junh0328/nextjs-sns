// 로그인 전략을 세우는 페이지

const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypr = require('bcrypt');
const { User } = require('../models');
module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        // 우리가 /routes/user 에서 사용자에게 넘겨 받은 데이터이다
        // req.body.email / req.body.password 이다.
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({
            where: { email: email },
          });
          if (!user) {
            return done(null, false, { reason: '존재하지 않는 사용자입니다.' }); //passport에서는 응답을 보내주지 않기 때문에 done을 통해서 처리된 결과를 판단한다.
          }
          const result = await bcrypr.compare(password, user.password);
          if (result) {
            return done(null, user);
          }
          return done(null, false, { reason: '비밀번호가 틀렸습니다.' });
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );
};

// 전략을 새워 exports함 >> index.js에서 사용할 것
