exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    // passport 모듈에서 제공하는 isAuthenticated라는 모듈을 활용하여 로그인 여부를 검사할 수 있다.
    // front의 me 와 같은 역할을 한다.
    next();
  } else {
    res.status(401).send('로그인이 필요합니다.');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next(); //
  } else {
    res.status(401).send('로그인하지 않은 사용자만 접근 가능합니다.');
  }
};
/**
 * next의 사용방법
 * 1. next() 함수안에 어떠한 변수라도 넣으면 에러를 처리하러 간다.
 * 2. next() 괄호안에 아무것도 넣지 않을 경우 다음 미들웨어를 처리하러 간다.
 * next의 사용방법과 같이 next()괄호 안에 아무것도 없으므로 다음 미들웨어로 넘어가 req.logout()을 실행하게 된다.
 * router.post('/logout', isLoggedIn, (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.send('ok');
});

 */
