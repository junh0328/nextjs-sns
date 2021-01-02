const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models'); // index 안에 있는 models 테이블로 연결됨

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const exUser = await User.findOne({
      // email 중복 조건
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      return res.status(403).send('이미 사용중인 아이디입니다.');
      // 리턴을 붙이지 않으면 밑 문장까지 넘어간다.
      // 응답은 요청에 따라 한 번만 보내야 하는데 return 시키지 않으면 자동적으로 밑으로 내려가기 때문이다.
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    //async awiat 함수를 써서 User 테이블에 들어온 데이터가 만들어질 떄까지 기다렸다가 res.json()을 실행한다.
    await User.create({
      // 유저 테이블의 실제 속성값과 일치해야 한다.
      // 서버에서는 axios.post('/localhost:3065/user', data)를 통해 넘어온 데이터를 아래와 같은 형식으로 받는다.
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    res.status(201).send('ok');
  } catch (error) {
    console.error(error);
    next(error); // status 500, 서버쪽에서 처리하다가 에러가 나면 next()로 보내준다.
  }
});

module.exports = router;
