const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const db = require('./models');
const passportConfig = require('./passport');
const port = 3065;

dotenv.config(); //.env를 사용할 수 있게 해주는 명령어
const app = express();

db.sequelize
  .sync()
  .then(() => {
    console.log('db 연결 성공!!!');
  })
  .catch(console.error);

// 서버에서는 axios.post('/localhost:3065/user', data)를 통해 넘어온 데이터를 받는다.
// 하지만 라우팅 처리로 req.body로 요청한 데이터를 받기 위해서는 body를 받겠다는 명령어가 필요하다.
// json(), urlencoded()라는 함수가 프론트에서 보낸 데이터를 req.body에 넣어주는 역할을 한다.
// 미들웨어라는 것은 위에서부터 아래로 실행되기 때문에 반드시 get/post와 같은 요청보다 위에 있어야 한다.

passportConfig(); // /passport/index 에서 exports한 전략을 실행시킴

app.use(
  cors({
    origin: true,
    credentials: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // form 으로 넘어오는 데이터 관리
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET, // secret?
  })
);
app.use(passport.initialize());
app.use(passport.session());

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
app.use('/user', userRouter); // Post방식 /user/ >> front redux-saga의 axios.post('http:localhost:3065/user'); 와 일치

app.listen(port, () => {
  console.log(`server is listening on port : ${port}`);
});
