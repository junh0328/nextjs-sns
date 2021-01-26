# 1.🌟스택(stack)🌟

## front-end

1. react.js
2. next.js
3. redux
4. next-redux-saga

## back-end

1. node.js
2. express
3. mysql
4. sequelize
5. axios

## AWS

# 2.🌟사용법🌟

1. 터미널을 통해 prepare > backend/ prepare > front에 각각 접근하여 실행시킵니다.

## backend

1.  npm i 또는 yarn을 통해 gitignore로 지웠던 node_modules를 다운받아야 합니다.
2.  .env 파일을 만들고 MYSQL_PASSWORD / COOKIE_SECRET 번수의 값을 설정합니다.
3.  MYSQL_PASSWORD는 workbench의 'root' 계정의 비밀번호를 적어줍니다.
4.  COOKIE_SECRE은 임의의 값을 설정하면 됩니다.
5.  npm run dev/ yarn run dev를 통해 서버를 열어줍니다.
6.  npx sequelize db:create를 통해 table을 생성합니다.

## front-end

1. npm i 또는 yarn을 통해 node_modules를 다운받습니다.
2. npm run dev / yarn run dev를 통해 서버를 열어줍니다.

# 3.🌟기술🌟

## 메인

1. 로그인 기능
2. 팔로우 <-> 언팔로우 기능
3. content 업로드 기능
4. 이미지 업로드 기능
5. 리트윗 기능
6. 좋아요 기능
7. 댓글 달기 기능
8. 게시글 삭제 기능
9. 게시글 수정 기능
10. 해쉬태그 남기기 기능
11. 해쉬태그를 통한 검색
12. 한 사용자의 게시글만 보기

## 프로필

1. 프로필 닉네임 수정 기능
2. 팔로우 <-> 언팔로우 기능

## 회원가입

1. 회원가입 기능

## 공부가 필요한 부분

1. Promise를 통한 비동기 처리
2. Sequelize를 통한 관계 생성 및 함수 사용 ✔
3. reducer의 initialState 활용 > me의 State ✔
4. immer를 통해 데이터 불변성 && 데이터 불변성이란?
   > https://immerjs.github.io/immer/docs/introduction immer
   > https://evan-moon.github.io/2020/01/05/what-is-immutable/ 데이터불변성(immutable)
5. 고차 함수를 통한 처리 () => () => { ... }
   > https://velog.io/@jakeseo_me/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EA%B0%9C%EB%B0%9C%EC%9E%90%EB%9D%BC%EB%A9%B4-%EC%95%8C%EC%95%84%EC%95%BC-%ED%95%A0-33%EA%B0%80%EC%A7%80-%EA%B0%9C%EB%85%90-22-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EA%B3%A0%EC%B0%A8-%ED%95%A8%EC%88%98Higher-Order-Function-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0
6. redux-devtools에서 오류를 찾는 방법
   > https://medium.com/signal9/redux-%EA%B0%9C%EB%B0%9C%EC%9D%84-%EB%8D%94-%ED%8E%B8%ED%95%98%EA%B2%8C-redux-devtools-4e228655ac7d
7. PropTypes는 왜 하는가? ✔
   > https://www.daleseo.com/react-prop-types/
   > 리액트는 props로 하여금 상위 노드에서 데이터를 넘겨받을 때 자바스크립트의 타입을 검사하지 않는 속성 때문에 생길 수 있는 오류들이 있다.
   > 이를 미리 잡아주기 위해서! (warning 처리를 통해서 해당 props의 타입을 잘 받아왔는지 확인할 수 있다.)
8. import 시 { }를 치는 의미? (Syntactic sugar)
   > https://devlog.jwgo.kr/2018/08/21/component-with-curly-braces-in-react/

# 4.🌟API🌟

- api는 RESTful한 형태를 유지하기 위해 노력했습니다.
- 기본적으로 user, post, posts 로 나누어져 있습니다.

## 4.1 '/user'

- router.get('/')
  > 유저 정보 가져오기
- router.post('/')
  > 회원가입
- router.post('/login')
  > 로그인
- router.post('/logout')
  > 로그아웃
- router.patch('/nickname')
  > 닉네임 수정
- router.patch('/;userId/follow')
  > 팔로우 (내가 팔로잉한 유저)
- router.delete('/:userId/follow')
  > 언팔로우 (내가 팔로잉한 유저)
- router.delete('/follower/:userId')
  > 팔로워 끊기(나를 팔로우한 유저)
- router.get('/followers')
  > 팔로워 목록 가져오기
- router.get('/followings')
  > 팔로잉 목록 가져오기
- router.get('/:userId)
  > 특정 사용자 정보 가져오기 (트윗, 팔로잉, 팔로워)
- router.get('/:userId/posts)
  > 특정 사용자의 게시글 가져오기

## 4.2 '/post'

- router.post('/')
  > 게시글 작성
- router.post('/images')
  > 게시글 이미지 업로드
- router.post('/:postId/comment')
  > 게시글에 댓글 달기
- router.patch('/:postId/like')
  > 게시글에 좋아요 누르기
- router.delete('/:postId/like')
  > 게시글에 좋아요 취소하기
- router.patch('/:postId)
  > 게시글 수정하기
- router.delete('/:postId')
  > 게시글 삭제
- router.post('/:postId/retweet')
  > 게시글 리트윗하기
- router.get('/:postId)
  > 특정 게시글 가져오기

## 4.3 '/posts'

- router.get('/')
  > 게시글 불러오기
