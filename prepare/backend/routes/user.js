const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { Op } = require('sequelize');
const { User, Post, Image, Comment } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewars');

const router = express.Router();

router.get('/', async (req, res, next) => {
  // console.log(req.headers);
  //GET /user
  try {
    if (req.user) {
      //로그인을 하지 않은 상태에서는 req.user가 없으므로, 에러가 날 경우를 대비해서 if문으로 감싸준다.
      const fullUserWidthoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ['password'], // db에서 비밀번호 속성을 제외한 나머지 속성들만 받아오고 싶다.
        },
        include: [
          {
            model: Post, //시퀄라이즈 관계 형성시, hasMany의 관계로 post를 받기 때문에 me.Posts로 넘겨받는다.
            attributes: ['id'], // 필요한 데이터인 id만 가져온다. why? id를 통해 나중에 필요해질 때 참고하여 가져올 수 있기 때문에, 서버로부터 프론트에게 필요한 데이터만 보내주는 과정이다.₩
          },
          {
            model: User,
            as: 'Followings',
            attributes: ['id'],
          },
          {
            model: User,
            as: 'Followers',
            attributes: ['id'],
          },
        ],
      });
      res.status(200).json(fullUserWidthoutPassword);
    } else {
      res.status(200).json(null); // req.user가 없을 경우, null 즉 사용자의 데이터가 없는 로그인 form을 보여준다.
    }
  } catch (error) {
    console.error(error);
    return next(error);
  }
});
// 팔로우 목록 불러오기
router.get('/followers', isLoggedIn, async (req, res, next) => {
  // GET /user/followers
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      res.status(403).send('존재하지 않는 사람을 찾으려고 하시네요?');
    }
    const followers = await user.getFollowers({
      limit: parseInt(req.query.limit, 10), // 최대 3명을 불러옴
    });
    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

// 팔로잉 목록 불러오기
router.get('/followings', isLoggedIn, async (req, res, next) => {
  // GET /user/followings
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      res.status(403).send('존재하지 않는 사람을 찾으려고 하시네요?');
    }
    const followings = await user.getFollowings({
      limit: parseInt(req.query.limit, 10),
    });
    console.log('팔로윙 목록 전달! ');
    console.log(followings);
    res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

// 로그인하기
// 미들웨어를 확장하는 방법
router.post('/login', isNotLoggedIn, async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    // /passport/local 에서 쩐 전략을 실행하는 함수이다.
    if (err) {
      //서버에러
      console.error(err);
      return next(err);
    }
    if (info) {
      //클라이언트 에러
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      // res.setHeader('Cookie', 'cxlhy')
      const fullUserWidthoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: {
          exclude: ['password'], // db에서 비밀번호 속성을 제외한 나머지 속성들만 받아오고 싶다.
        },
        include: [
          {
            model: Post, //시퀄라이즈 관계 형성시, hasMany의 관계로 post를 받기 때문에 me.Posts로 넘겨받는다.
            attributes: ['id'],
          },
          {
            model: User,
            as: 'Followings',
            attributes: ['id'],
          },
          {
            model: User,
            as: 'Followers',
            attributes: ['id'],
          },
        ],
      });
      return res.status(200).json(fullUserWidthoutPassword); //사용자 정보를 프론트로 넘겨준다. 쿠키로 why? 실제 데이터를 전부 넘겨주면 해킹에 노출되기 쉽기 때문에
    });
  })(req, res, next);
});

router.post('/', isNotLoggedIn, async (req, res, next) => {
  try {
    const exUser = await User.findOne({
      // email 중복 조건
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      return res.status(403).send('이미 사용중인 아이디입니다.'); // SIGN_UP_FAILURE 발생
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
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.status(201).send('ok');
  } catch (error) {
    console.error(error);
    next(error); // status 500, 서버쪽에서 처리하다가 에러가 나면 next()로 보내준다.
  }
});

// 로그아웃하기
router.post('/logout', isLoggedIn, (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.send('ok');
});

// 닉네임 바꾸기
router.patch('/nickname', isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      {
        nickname: req.body.nickname, // 프론트에서 제공받은 닉네임
      },
      {
        where: { id: req.user.id },
      }
    );
    res.status(200).json({ nickname: req.body.nickname });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

// 특정 사용자 정보 가져오기
router.get('/:userId', async (req, res, next) => {
  //GET /user/1
  try {
    const fullUserWidthoutPassword = await User.findOne({
      where: { id: req.params.userId },
      attributes: {
        exclude: ['password'],
      },
      include: [
        {
          model: Post,
          attributes: ['id'],
        },
        {
          model: User,
          as: 'Followings',
          attributes: ['id'],
        },
        {
          model: User,
          as: 'Followers',
          attributes: ['id'],
        },
      ],
    });
    if (fullUserWidthoutPassword) {
      const data = fullUserWidthoutPassword.toJSON();
      data.Posts = data.Posts.length; // 개인정보 침해 예방
      data.Followers = data.Followers.length;
      data.Followings = data.Followings.length;
      res.status(200).json(data);
    } else {
      res.status(404).json('존재하지 않는 사용자입니다.');
    }
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

// (userId)를 통해 특정 사용자의 게시글만 가져오기
router.get('/:userId/posts', async (req, res, next) => {
  // GET /user/1/posts
  try {
    const where = { UserId: req.params.userId };
    if (parseInt(req.query.lastId, 10)) {
      // 초기 로딩이 아닐 때 > 스크롤을 내려서 더 posts들을 불러올 때
      where.id = {
        [Op.lt]: parseInt(req.query.lastId, 10), // id가 lastId 보다 작은 게시물 10개를 불러와라
      };
    } // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [
        ['createdAt', 'DESC'], // 처음에 게시글의 생성일을 기준으로 내림차순 정렬
        [Comment, 'createdAt', 'DESC'], // 그 안에 들어있는 댓글들을 생성일 기준으로 내림차순 정렬
      ],
      include: [
        {
          model: User,
          attributes: ['id', 'nickname'],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User, //댓글의 작성자
              attributes: ['id', 'nickname'],
            },
          ],
        },
        {
          model: User, // 좋아요 누른 사람
          as: 'Likers',
          attributes: ['id'],
        },
        {
          model: Post,
          as: 'Retweet',
          include: [
            {
              model: User,
              attributes: ['id', 'nickname'],
            },
            {
              model: Image,
            },
          ],
        },
      ],
    }); // 지금까지 작성한 모든 게시글을 보여줄 것.
    // console.log(posts);
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

// 팔로우하기
router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => {
  //PATCH /user/1/follow  1번 유저를 팔로우 하겠다.
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send('존재하지 않는 사람을 팔로우하고 계시네요?');
    }
    await user.addFollowers(req.user.id);
    // 내가 그사람의 팔로워가 되는 것이므로 넘겨받은 유저(팔로우할 아이디)에 팔로워로 추가되는 것이다.
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

// 팔로잉 끊기
router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => {
  // DELETE /user/1/follow
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send('존재하지 않는 사람을 언팔로우하고 계시네요?');
    }
    await user.removeFollowers(req.user.id); // 팔로우 취소
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

// 팔로워 끊기
router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => {
  // DELETE /user/follower/2
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send('존재하지 않는 사람을 차단하려 하고 계시네요?');
    }
    await user.removeFollowings(req.user.id); // 팔로우 취소
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
