const express = require('express');

const { Post, Comment, User, Image } = require('../models');

const { isLoggedIn } = require('./middlewars');

const router = express.Router();

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

router.post(`/:postId/comment`, isLoggedIn, async (req, res, next) => {
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

router.delete('/', isLoggedIn, (req, res) => {
  //DELETE /post
  res.json({
    id: 1,
  });
});
module.exports = router;
