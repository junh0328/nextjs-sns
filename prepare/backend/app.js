const express = require('express');
const postRouter = require('./routes/post');
const db = require('./models');
const app = express();
const port = 3065;

db.sequelize
  .sync()
  .then(() => {
    console.log('db 연결 성공!!!');
  })
  .catch(console.error);

app.get('/', (req, res) => {
  res.send('hello express');
});

app.get('/api', (req, res) => {
  res.send('hello api');
});

app.get('/posts', (req, res) => {
  res.json([
    { id: 1, content: 'hello' },
    { id: 2, content: 'hello2' },
    { id: 3, content: 'hello3' },
  ]);
});

app.use('/post', postRouter); //postRouter에서 /post를 공통으로 받기 때문에 미리 공통된 '/post'를 뽑아줬다.

app.listen(port, () => {
  console.log(`server is listening on port : ${port}`);
});
