const express = require('express');

const { Post } = require('../models');

const router = express.Router();

// app.js에서 postRouter라는 이름으로 사용할 때, /post를 미리 뽑아줬으므로 보기에는 '/' 로 비워져있지만 실제로는 '/post'와 같은 주소이다.

router.post('/', async (req, res, next) => {
  //POST /post
  try {
    const post = await Post.create({
      content: req.body.content,
    });
    res.status(201).json(post); // json(post)를 통해 front로 돌려줌 >> result.data
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/', (req, res) => {
  //DELETE /post
  res.json({
    id: 1,
  });
});
module.exports = router;
