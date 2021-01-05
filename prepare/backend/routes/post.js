const express = require('express');

const { Post, Comment, User, Image } = require('../models');

const { isLoggedIn } = require('./middlewars');

const router = express.Router();

// app.js에서 postRouter라는 이름으로 사용할 때, /post를 미리 뽑아줬으므로 보기에는 '/' 로 비워져있지만 실제로는 '/post'와 같은 주소이다.

router.post('/', isLoggedIn, async (req, res, next) => {
  //POST /post
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id, // 누가 글을 썼는지에 대한 정보 UserId
    });
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Image,
        },
        {
          model: Comment,
        },
        {
          model: User,
        },
      ],
    });
    res.status(201).json(fullPost); // json(post)를 통해 front로 돌려줌 >> result.data
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
  //POST /post/1/comment
  try {
    const post = await Post.findOne({
      //존재 하지 않는 게시글에 댓글을 달려고 하는 것을 방지하기 위해
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }
    const comment = await Comment.create({
      content: req.body.content,
      PostId: req.params.postId,
      // /:postId라는 파라미터를 동적으로 받아와 실행하기 때문에 req.params를 사용한다.
      UserId: req.user.id,
    });
    res.status(201).json(comment); // json(post)를 통해 front로 돌려줌 >> result.data
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/', isLoggedIn, (req, res) => {
  //DELETE /post
  res.json({
    id: 1,
  });
});
module.exports = router;
