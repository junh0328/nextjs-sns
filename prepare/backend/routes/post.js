const express = require('express');

const router = express.Router();

// app.js에서 postRouter라는 이름으로 사용할 때, /post를 미리 뽑아줬으므로 보기에는 '/' 로 비워져있지만 실제로는 '/post'와 같은 주소이다.

router.post('/', (req, res) => {
  //POST /post
  res.json({
    id: 1,
    content: 'hello',
  });
});

router.delete('/', (req, res) => {
  //DELETE /post
  res.json({
    id: 1,
  });
});
module.exports = router;
