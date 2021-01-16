// 로그인 전략을 세우는 페이지
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local'); // 구조 분해 할당에 따른 변화 문법
const bcrypt = require('bcrypt');
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
        //done 은 콜백함수이다.
        try {
          const user = await User.findOne({
            where: { email },
          });
          if (!user) {
            return done(null, false, { reason: '존재하지 않는 이메일입니다!' });
            // passport에서는 응답을 보내주지 않기 때문에 done을 통해서 처리된 결과를 판단한다.
            // sagas/user의 SIGN_UP_FAILURE에 error: err.response.data 로 reason을 보내준다.
          }
          const result = await bcrypt.compare(password, user.password);
          //bcrypt.compare(password, user.password) > (우리가 입력한 password, db에 저장된 password)를 비교
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

// 전략을 새워 module.exports함 >> index.js에서 사용할 것
