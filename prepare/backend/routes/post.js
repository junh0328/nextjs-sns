const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Comment, User, Image } = require('../models');

const { isLoggedIn } = require('./middlewars');

const router = express.Router();

try {
  fs.accessSync('uploads');
} catch (error) {
  console.log('uploads 폴더가 없으므로 생성합니다.');
  fs.mkdirSync('uploads');
}

// app.js에서 postRouter라는 이름으로 사용할 때, /post를 미리 뽑아줬으므로 보기에는 '/' 로 비워져있지만 실제로는 '/post'와 같은 주소이다.

router.post('/', isLoggedIn, async (req, res, next) => {
  // POST /post
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });

    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User, // 댓글 작성자
              attributes: ['id', 'nickname'],
            },
          ],
        },
        {
          model: User, // 게시글 작성자
          attributes: ['id', 'nickname'],
        },
        {
          model: User, // 좋아요 누른 사람
          as: 'Likers',
          attributes: ['id'],
        },
      ],
    });
    res.status(201).json(fullPost);
    console.log('fullPost는 다음과 같습니다. : ' + fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

const upload = multer({
  // multer 속성 지정  storage(저장 어디에 할꺼야?)
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads'); // uploads라는 폴더에 할거야 >> 후에 아마존에 올리면 아마존 서버에 저장, S3 서비스로 대체
    },
    filename(req, file, done) {
      // 파일명 : 제로초.png
      const ext = path.extname(file.originalname); // 확장자 추출(.png) > 업로드 시에 날짜를 붙여 중복 파일 명을 바꾼다.
      const basename = path.basename(file.originalname, ext); // 제로초
      done(null, basename + new Date().getTime() + ext); // 제로초17382309217.png
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB로 용량 제한
});

router.post('/images', isLoggedIn, upload.array('image'), async (req, res, next) => {
  //POST /post/images ,
  console.log(req.files);
  res.json(req.files.map((v) => v.filename));
});

router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
  // POST /post/1/comment
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }
    const comment = await Comment.create({
      content: req.body.content,
      PostId: parseInt(req.params.postId, 10),
      UserId: req.user.id,
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          attributes: ['id', 'nickname'],
        },
      ],
    });
    res.status(201).json(fullComment);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.patch('/:postId/like', isLoggedIn, async (req, res, next) => {
  // PATCH /post/1/like
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    // post가 있다면, models/post의 관계에 따라 나타낸다
    await post.addLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id }); // sagas/post 에서 likePost 의 data : result.data로 PostId와 UserId가 넘어간다.
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.delete('/:postId/like', isLoggedIn, async (req, res, next) => {
  // DELETE /post/1/like
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    // post가 있다면, models/post의 관계에 따라 나타낸다
    await post.removeLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id }); // sagas/post 에서 likePost 의 data : result.data로 PostId와 UserId가 넘어간다.
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.delete('/:postId', isLoggedIn, async (req, res, next) => {
  //DELETE /post/10
  try {
    await Post.destroy({
      // 시퀄라이즈에서는 제거할 때 destroy 문법을 사용한다.
      where: {
        id: req.params.postId,
        UserId: req.user.id, // 게시글 아이디와 postId가 같고 내가 쓴 글일 때만 delete를 시킬 수 있도록 조건문을 부여했다.
      },
    });
    res.status(200).json({ PostId: parseInt(req.params.postId, 10) }); // 🌟parseInt를 하지 않으면 PostId가 params에 의해 문자열로 받게 된다. 🌟
  } catch (error) {
    console.error(error);
    return next(error);
  }
});
module.exports = router;

/* 
  PostForm에서 넘어오는 이미지이고 여러장 올 수 있게 설정했으므로 array로 설정하였다.
  - upload.none() 이미지 없음(텍스트)
  - upload.array() 이미지 여러장
  - upload.single() 이미지 한장
*/
