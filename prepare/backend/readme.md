# 백엔드 노드 서버 구축하기

# 1. 노드로 서버 구동하기

- node는 v8 엔진을 사용한 자바스크립트 런타임이다. (node.js 자체가 서버라는 뜻이 아니다.)
- 런타임이란 자바스크립트 코드를 실행할 수 있도록 도와주는 것을 말한다.
- node 환경에서 app.js를 실행하는 순간 노드 런타임이 코드를 실행해서 app.js에 입력한 http가 서버 역할을 한다.
- backend 서버에서는 우리가 front에서 만들었던 axios.post('/')를 통해 보내지는 주소들이 backend 서버이다.
- 쉽게 말해 프론트서버에서 넘어오는 요청들(req, request)를 백엔드 서버에서 받아주고 요청에 따라 처리된 결과를 (res,response) 다시 프론트에 보내주는 것이 일반적인 흐름이다.
- 한 번 요청에 따른 한 번 응답이 기본적인 프로세스이며, 요청이 왔을 때 응답을 하지 않을 경우 브라우저에서 일정시간(30초) 후에 자동으로 실패 응답을 보내게 된다.

```js
axios.post('/post', postData, {
  withCredentials: true,
});

- 위 코드에서 `/post`로 불려지는 부분(주소)이 백엔드 서버이다.
```

- 프론트 서버와 백엔드 서버를 나누는 가장 큰 이유는 대규모 앱이 되었을 때를 대비하기 위해서이다.
- 서버 한 곳에 프론트와 백을 모두 담을 경우 프론트가 하는 SSR(서버사이드렌더링), 백이 하는 API 를 모두 다뤄야 한다.
- 따라서 사용자가 증가하거나, 요청 사항이 증가하면 더이상 한 서버에서 이 둘을 모두 감당하기 힘든 트레픽이 발생할 수 있다.
- 그렇기 때문에 요청 사항이 증가할 때 이러한 트래픽을 나눠주기 위해 스케일링을 사용한다. (스케일링은 서버를 통째로 복사하는 기능)
- 하지만, 프론트와 백엔드 서버거 한 서버에 저장되어 있을 때, 프론트 서버의 트래픽 때문에 스케일링을 하더라도 백엔드 서버까지 불필요하게 생기게 된다.
  (반대의 경우도 동일)
- 따라서 프론트 서버와 백엔드 서버를 따로 관리하고 상황에 따라 해당 서버에 맞춰 스케일링을 해주는 유동적인 자세가 필요하다.

```
  ex)
  - 배달의 민족의 경우 피크타임 때 주문에 관련된 요청이 많이 오기 때문에 주문 관련된 서버를 업스케일링하려 할 때,
  - 백엔드 기준 한 서버에서 모든 api를 관리할 경우 주문에 불필요한 `상품 등록` 과 같은 기능들이 스케일링될 필요는 없기 때문이다.
  - 따라서, 스케일링이 필요한 부분에 따라 서버를 따로 구성하는 자세가 필요하다.
```

# 2. 익스프레스 사용하기

- 앞서 말한 것처럼 서버를 돌리기 위해서는 node에서 제공하는 http를 사용해야한다.

```js
app.get('/', (req, res) => {
  res.send('hello express');
});

app.get('/api', (req, res) => {
  res.send('hello api');
});

app.get('/api/posts', (req, res) => {
  res.json([
    { id: 1, content: 'hello' },
    { id: 2, content: 'hello2' },
    { id: 3, content: 'hello3' },
  ]);
});

app.post('/api/post', (req, res) => {
  res.json({
    id: 1,
    content: 'hello',
  });
});

app.delete('/api/post', (req, res) => {
  res.json({
    id: 1,
  });
});
```

- 위 코드를 보면 '/' 넘겨 받는 주소와 넘겨 주는 데이터는 모두 프론트<->백 개발자의 협의로 만들어진 것을 알 수 있다.
- app.get / post / delete / put / patch / options / head 와 같은 restful한 api를 많이 쓴다.
- 주로 ㅆ는 restAPI는 postman에서도 확인이 가능하다.
- 🌟restfulAPI 주요 용어🌟

|   값    |               의미               |
| :-----: | :------------------------------: |
|   get   |             가져오다             |
|  post   |             생성하다             |
| delete  |               제거               |
|   put   |            전체 수정             |
|  patch  |            부분 수정             |
| options | 찔러 보기(나 요청 보낼 수 있어?) |
|  head   |    헤더만 가져오기(헤더/바디)    |

- 본인의 회사뿐만 아니라 다양한 자료를 참고할 때 보여지는 큰 약속이지 반드시 지켜야하는 것은 아니다.
- 적정 선을 가지고 팀원끼리 타협을 봐서 정하면 된다.

# 2.1 node에서는 왜 export, import를 쓰지 않을까?

- react와 다르게 node에서는 import 대신 require를 , export default 대신에 module.exports를 사용한다.
- react또한 node로 구동되기 때문에 실제로는 require와 module.exports로 사용된다.
- 넥스트에 장착된 웹팩이 이것을 바꿔주기 때문이다.
- 하지만 노드는 웹팩을 쓰지 않기 때문에 require와 module.exports를 사용한다.
  (몇년 후에는 노드쪽도 import와 export default로 통일될 것을 예상한다.)

# 3.시퀄라이즈 구현하가

- 이미 깔려있다는 전제하에 까는 과정은 생략( 둘다 구글링으로 가능 windows/ mac)
- 시퀄라이즈는 node와 mySQL을 연동하여 사용할 수 있도록 만든 npm에서 제공하는 모듈입니다.
- 자바스크립트로 mySQL 언어를 배우지 않더라도 조작할 수 있게 도와주는 라이브러리입니다.
- yarn add sequelize sequelize-cli mysql2 / npm i sequelize sequelize-cli mysql2 를 통해 다운받습니다.
- mySQL과 node를 연결해주는 드라이버의 개념이 mysql2라고 보면 됩니다.

```
npx sequelize init 을 통해 sequelize를 실행해줍니다.

📁 config
📁 migrations
📁 models
📁 seeders

폴더가 생성됩니다.
```

# 시퀄라이즈 모델링 및 관계 설정

- npx sequelize init을 통해 sequelize를 사용하게 되면, models 폴더에 시퀄라이즈를 통해 연동할 데이터 테이블들을 만들어줘야 합니다.
- 기본적으로 속성의 이름과 데이터타입이 필요합니다.

```js
module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define(
    'Image',
    {
      src: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci', // 한글 저장(utf8)
    }
  );
  Image.associate = (db) => {};
  return Image;
};
```

- 'Image'는 images 테이블을 의미합니다.
- 객체 형식으로 저장된 src가 images 테이블의 속성입니다. 여러개일 수 있습니다.
- 속성에는 반드시 데이터 타입을 적어줘야 하며 주로 사용하는 데이터 타입은 다음과 같습니다.

|     MySQL     |         시퀄라이즈          |        의미        |
| :-----------: | :-------------------------: | :----------------: |
|    VARCHAR    |           STRING            |       문자열       |
|     TEXT      |            TEXT             | 텍스트(길이제한 x) |
|    TINYINT    |           BOOLEAN           |    true/ false     |
|      INT      |           INTEGER           |        정수        |
|     FLOAT     |            FLOAT            |        실수        |
|   DATETIME    |          DATETIME           |      현재시간      |
|   NOT NULL    |          allowNull          |     빈 칸 여부     |
|    UNIQUE     |           UNIQUE            |       중복 x       |
| DEFAULT now() | defaultValue: Sequelize.Now |   현재 시간 표시   |

- 또한 이렇게 관계형 데이터베이스 (RDBMS)를 사용하는 이유는 각 테이블(시퀄라이즈)의 관계 설정을 통해 테이블간의 관계를 나타낼 수 있기 때문입니다.
- 사용자(user)가 여러 개의 게시글(post), 댓글(comment) 등등을 남길 수 있으므로 이러한 관계를 나타내어 시퀄라이즈를 사용합니다.
- noSQL은 이러한 관계를 나타낼 수 없기 때문에 또 다른 테이블을 생성해야 합니다. (상황에 따라 맞춰 쓰자)

## 🌟 RDBMS 관계 설립 🌟

- node.js 교과서에서 발췌한 내용입니다.
- https://thebook.io/080229/ch07/06/03/01/

  | 값  |         서로 간의 관계          |
  | :-: | :-----------------------------: |
  | 1:1 |      hasOne <-> belongsTo       |
  | 1:N |      hasMany <-> belongsTo      |
  | N:M | belongsToMany <-> belongsToMany |

<hr>

|      값       |                             관계                              |
| :-----------: | :-----------------------------------------------------------: |
|    hasOne     | 서로 하나씩만 가진다. (유저 테이블과 유저 정보 테이블의 관계) |
|    hasMany    |                  a가 b를 많이 가질 수 있다.                   |
|   belongsTo   |                        b는 a에 속한다.                        |
| belongsToMany |    a가 b를 많이 가질 수 있고, b또한 a를 많이 가질 수 있다.    |

- 🌟 N:M 대대다 관계일 경우(post <-> hashtag) 🌟
- sequelize가 posthashtag라는 🌟중간 관리 테이블🌟을 생성하여 이를 추적할 수 있도록 관리해줍니다.

|    hashtag    |    posthashtag     |         post          |
| :-----------: | :----------------: | :-------------------: |
|       -       | hashtagid : postid |           -           |
|    1. 노드    |       1 : 1        | 1. 안녕 #노드 #리액트 |
|   2. 리액트   |       2 : 1        | 2. #노드 #익스프레스  |
| 3. 익스프레스 |       1 : 2        |  3.#뷰 #노드 #리액트  |
|     4. 뷰     |       3 : 2        |                       |
|               |        ....        |                       |

- hashtag를 검색하면 해당 hashtagid가 들어있는 post를 검색할 수 있게 된다.
- 🌟through🌟

```js
db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' });
db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });

// 사용자와 게시글의 좋아요 관계
// 위와 같이 through를 양쪽 테이블에 정해준다면 시퀄라이즈로 생성되는 테이블 명을 정해줄 수 있다.
// belongsTo를 사용하면 기본적으로 이를 추적할 수 있는 id가 생기는데 이를 명확히 구분하기 위해 as: 'Likers'등 과 같이 표현하였다.
```

## 작성 후에 node로 실행하기

- 관계설정이 완료되었다면 시퀄라이즈를 통해 db를 만들어줘야 한다. 명령어는 다음과 같다

```
npx sequelize db:create
```

- 성공하면 node app을 통해 서버와 연결해준다.
- 🌟ERD를 통해 데이터베이스의 관계를 표식화하여 눈에 보이게 만들 수 있는다.
- 강의에서는 간단한 관계들로 구성되어있기 때문에 따로 작성하지 않았지만, DataGrip이라는 웹사이트를 통해 도식화할 수 있다.

# http response.status

| 값  |      의미       |
| :-: | :-------------: |
| 2XX |      성공       |
| 3XX |   리다이렉트    |
| 4XX | 클라이언트 에러 |
| 5XX |    서버 에러    |

# CORS 문제 해결하기

- 프론트엔드에서는 3000번 서버를 사용하고, 백엔드에서는 3065번 서버를 사용하고 있다.
- 브라우저에서 보내는 요청 사항은 서버에서 바로 받아 처리할 수 있다.
- 사용자의 브라우저에서 백엔드(3065) 서버로 axios.post 데이터를 전송하더라도 브라우저의 CORS 정책에 의해 막혀버린다.
- 따라서 브라우저에서 프론트 서버에 요청을 보내고 프론트 서버에서 백엔드 서버로 요청을 보낸다면 이 문제를 해결할 수 있다.
- 브라우저와 프론트 서버는 같은 도메인(3000버)에 있기 때문이다.
- 이를 프록시(proxy) 방식이라고 한다. (CORS를 피해가는 방법 중 하나)

```js
const cors = require('cors');
...
app.use(cors());

- app.js에서 cors 미들웨어를 사용하여 사용자의 요청을 받아올 수 있다.
```

- 또하나의 방법은 넘겨받는 라우터에서 헤더부분에 처리를 하는 것이다.

```js
await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.status(201).send('ok');
  }
```

- 위와 같이 201이라는 성공 메세지를 보내기 전에 setHeader()를 통해 Access-Control-Allow-Origin, '원래 프론트 주소'를 보내면 CORS 문제로 인해 브라우저에 의해 서버로의 요청이 막히는 일을 예방할 수 있다.

# 패스포트로 로그인하기

- 로그인을 하기 위해서는 내 홈페이지에 회원가입을 통해 정보를 입력할 수도 있지만, 다른 계정의 정보를 이 웹사이트에 넘겨 저장할 수 있다.
- 이를 관리하는 모듈이 패스포트 모듈이다.
- 우리는 이메일을 통한 회원가입을 목표로 삼았기 때문에 npm i passport passport-local/ yarn add passport passport-local 로 관리할 것이다.
- 추가적으로 네이버, 깃허브, 페이스북 등의 로그인 패스포트를 사용하고 싶으면 해당 사이트의 api를 참고하여 새로운 전략 (strategy)을 만들 수 있다.

# 🌟쿠키/세션과 전체 로그인 흐름🌟

- 패스포트 로그인을 할 때, 패스포트가 사용자의 정보를 저장하기 위해서 세션을 활용한다.
- 쿠키와 세션이 필요한 이유?
- 로그인을 후 데이터를 송수신하기 위해서는 두 서버가 같은 정보를 들고 있어야 하는데, 브라우저 서버와 백엔드 서버는 다른 도메인(3000 <-> 3065)를 가지고 있기 때문에 같은 정보를 가질 수 없다.
- 따라서 브라우저에 요청에 따라 서버에서 처리된 사용자의 대이터가 랜덤한 토큰값(ex) cxlby!Scsa)을 가지는 쿠키형식으로 저장된다.
- 또한 쿠키형식으로 데이터를 넘겨주기 때문에 헤커들의 데이터 해킹 보안 측면에서 유리하다. (쿠키 데이터를 가지고 사용자의 데이터를 추측하기 어렵기 때문)
- 사용자(브라우저)에게는 쿠키를 넘겨주고 서버에서는 쿠키에 따른 세션(실제 사용자의 데이터 [email, password])값을 갖고있다.
- 하지만, 사용자가 해당 웹 사이트에서 많은 활동을 함에 따라 세션에 더 많은 정보가 저장되게 되는데 이를 통해 서버에 과부하가 올 수 있다.
- 따라서 백엔드 서버에서는 해당 쿠키의 id값 (ex) cxlby!Scsa) 만 가지고 있고 나머지 정보는 DB에 저장하게 된다.
- 필요한 정보를 DB에서 불러와 사용자에게 다시 돌려준다.

## .env로 주요 보안 파일 관리하기

# 🌟serialize ? deserialize?🌟

- serialize는 직렬화라는 뜻이다.
- 직렬화라는 것은 어떤 데이터를 다른 곳에서 사용할 수 있게 다른 포맷의 데이터로 바꾸는 것을 의미합니다.
- 현재 패스포터에서는 시퀄라이즈 객체를 세션에 저장할 수 있는 데이터로 바꾸고 있습니다.

- deserialize는 반대로 역직렬화입니다.
- 역직렬화는 다른 포맷의 데이터로 바뀐 데이터를 원래 포맷으로 복구하는 것입니다.
- 세션에 저장된 데이터를 다시 시퀄라이즈 객체로 바꾸는 작업을 의미합니다.
- deserialize에서 복구된 값은 req.user에 들어갑니다.
- 세션 쿠키를 통해서 메모리(db)에 저장된 id를 찾아 해당 user값을 가져오게 됩니다.
- req.login 시에 serializeUser가 호출되면서 done이 호출될 때 res.setHeader 되는 것이고, 세션쿠키도 그 때 만들어집니다.

# 🌟login dataflow🌟

- F sagas/user 에서 loginAPI(data) 를 통해 서버에 해당 유저의 data를 보낸다.
- B routes/user에서 router.post('/login')을 통해 해당 데이터를 넘겨받은 서버는 passport를 통해 로그인 전략을 실행한다.
- B passport/index.js에 맞춰 세워진 local() 전략을 실행하고 성공시 passport/local 에서 return done(null, user); 로 저장된다.
- B done 되는 순간 callback이 실행되므로 다시 routes/user로 돌아가 router.post('/login')를 이어서 실행한다.
- B 끝에 패스포트 로그인을 실행하는데 이를 통과할시 passport/index에서 serializeUser((user, done))을 통해 user.id와 쿠키를 백엔드 서버에서 저장하게 된다. (나머지는 db에 저장해 두었다가 필요할 때 역직렬화를 통해 db에서 불러옴)
- console > network > login > Set-Cookies : connect.sid='' 를 통해 실제 쿠키와 id를 찾아볼 수 있다.
- B 로그인을 성공하고 나면 백엔드 서버에는 user.id와 connect.sid 를 가지게 되는데 그 다음 요청부터는 이 쿠키와 id를 통해 db에서 데이터를 가져오게 된다.

# 🌟미들웨어로 라우터 검사하기

- 현재까지 router를 통해 주소로 넘어오는 데이터를 처리해주는 작업을 진행하였다.
- 하지만 현재 상황에서는 로그인이 된 상태에서도 '/login' 주소에 접근하면 에러가 발생하고
- 로그인되지 않은 상태에서 '/logout'을 통해 에러를 발생시킬 수 있다.
- 이를 해결하기 위해서 미들웨어를 통해 라우터를 검사하는 방법을 사용한다.

```js
exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send('로그인하지 않은 사용자만 접근 가능합니다.');
  }
};
```

- passport 모듈의 isAuthenticated()라는 함수를 사용하여, 로그인 여부를 확인한다.
- front 단의 'me' 와 같은 역할을 한다.

```js
import {isLoggedIn} from './middlewars';

...

router.post('/logout', isLoggedIn, (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.send('ok');
});
```

- middlewares.js에서 export 시킨 함수(isLoggedIn) 을 불러오고 필요한 라우팅 처리 함수에 넣어준다.

## 🌟next() 바로알기

- 노드는 코드를 위에서부터 아래로 왼쪽에서 오른쪽으로 진행한다.
- 띠리사 '/logout' 함수를 요구받았을 때, isLoggedIn으로 먼저 넘어간다.

```js
router.post('/logout', isLoggedIn, (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.send('ok');
});
```

- next의 사용방법
- 1 next() 함수안에 어떠한 변수라도 넣으면 에러를 처리하러 간다.
- 1.1 직접 적어주지 않아도, 내부적으로 존재하기 때문에 알아서 처리해준다.
- 2 next() 괄호안에 아무것도 넣지 않을 경우 다음 미들웨어를 처리하러 간다.
- next의 사용방법과 같이 next()괄호 안에 아무것도 없으므로 다음 미들웨어로 넘어가 req.logout()을 실행하게 된다.

```js
exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send('로그인하지 않은 사용자만 접근 가능합니다.');
  }
};
```

- next 함수의 파라미터가 아무 것도 없으므로 다시 '/logout'함수로 되돌아 가 나머지 코드를 진행한다.

# credentials로 쿠키 공휴가ㅣ

- 현재까지 프로그래밍을 완료했다면, 로그인을 하고 댓글을 달거나, 트윗을 남기고 싶을 것이다.
- 하지만, 브라우저의 서버와 백엔드 서버의 도메인이 다른 관계로 쿠키를 서로 공유하지 못한다.(전달되지 않는다.)
- 도메인이 다르면 쿠키가 전달이 안되고, 쿠기가 전달이 되지 않으면 백엔드에서 그 요청을 누가 보냈는 지 알 방법이 없다.
- 이를 해결하기 위해 cors 모듈을 활용할 것이다.

```js
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
```

- cors 에서 credentials 속성을 true로 바꾸면 해당 문제를 해결할 수 있다.
- 기본 값은 credentials: false 이먀, 다른 도메인에서 쿠키를 같이 공유하기 위해서는 true 값이 요구된다.
- 또한 프론트 사가에서 보내는 요청 사항에도 작업이 필요한데 이는 다음과 같다.

```js
function addPostAPI(data) {
  return axios.post('/post', { content: data });
}

>>>

function addPostAPI(data) {
  return axios.post('/post', { content: data }, { withCredentials: true });
}
```

- { withCredentials: true }라는 속성을 넣어주어 axios를 통해 데이터를 서버에 넘겨줄 때 쿠키 또한 공유하겠다는 선언이 필요하다.
- 하지만 모든 요청에서 공통적으로 보내는 요청이 되기 때문에 sagas/index에서 이 요청사항을 한 번에 컨트롤하면 좋다.

```js
axios.defaults.baseURL = 'http://localhost:3065';
axios.defaults.withCredentials = true;
```

- 위처럼 공통되는 sagas/index 폴더에서 axios의 공통 사항에 대해 미리 선언해주면 다른 파일에서 해당 속성을 추가하지 않아도 된다.
