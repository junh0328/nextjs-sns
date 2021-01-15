# 1. Hello, Next.js

- Next.js에서는 pages 폴더에 페이징 처리를 해줘야 하는데, Next.js의 라이브러리가 pages 폴더를 인식하여 코드 스플리팅을 해주기 때문이다.
- Next가 react처럼 page안에 있는 페이지들을 라우팅 처리를 해주지 않아도 url창에 파라미터를 입력할 시 자동으로 페이징 처리를 해준다.

```js
1. React 사용시
<Link to ="/">index<Link>
...
<Route path="/" exact component={index}>

2. Next 사용시
<Link href="/">
  <a>index</a>
</Link>

```

- Route 기능 없이 사용 가능하다.
- localhost:3000/profile >> 다이나믹 라우팅 기능
- 코드 스플리팅을 하기 위해서 Link href="/경로" 후에 a태그로 감싸준다.

# 2. antd 사용해 SNS 화면 만들기

- next.js에는 기본적으로 웹팩이 제공되는데, 이 웹팩이 css파일을 스타일 태그로 바꿔서 적용해준다.
- 따라서 이번 프로젝트는 웹팩을 기반으로 antd와 styled-components를 사용하여 UI 구성한다.

```
import { Button, Input, Menu } from 'antd';
와 같이 antd를 사용한 것이 ant-design에서 제공되는 컴포넌트를 사용하여 만든 컴포넌트들이다.
```

- 다음 프로젝트 진행 시, npm trends에서 검색하여 더 나은 CSS FRAMEWORK 사용하기!
- 🌟 antd에서는 class 컴포넌트로 작성이 되있기 때문에 함수형으로 바꾸는 공부 꼭 할 것! 🌟
- pages 폴더 안의 \_app.js는 pages 폴더내의 모든 파일들에 공통으로 들어가는 레이아웃을 담아두었다.
- components 폴더 안의 AppLayout.js는 특정 컴포넌트에만 쓰이는 부분을 추려 쓰기 위해 만들었다.

# 3. Redux 사용하기

- 🌟 next에서 리덕스 라이브러리를 손쉽게 사용하기 위해 next-redux-wrapper를 사용한다. 🌟
  <https://github.com/kirill-konshin/next-redux-wrapper> 🌟
- 공식 next-redux-wrapper 페이지 참조
- yarn add next-redux-wrapper / npm install next-redux-wrapper 로 모듈 다운로드
- yarn add redux / npm install redux로 모듈 다운로드
- react-redux 사용이세 리액트-리덕스를 사용하기위해 provider 로 컴포넌트 전체를 감싸주었지만, next.js에서는 자동으로 감싸 주기 때문에 감싸 주지 않는다.
- 우리가 Provider를 또 사용하면 Provider를 2번 사용하게 되는 중복이 발생한다.
- next-redux-wrapper의 createWrapper 함수를 사용하여 스토어를 감싸준다.
- 리덕스 기능을 사용하기 위해 createStore를 통해 스토어를 만들고 리듀서를 연결한다.

- 🌟 리액트에서는 모든 파일들을 컴포넌트로 분리하여 관리를 하기 때문에 중앙 데이터 저장소가 필요하다. 🌟
- why? 데이터의 일치성을 주기 위해 + 데이터 추적(히스토리) 관리 용의 때문
- 중앙 데이터 저장소의 역할을 하는 것이 Context API, Redux, MobX 등이 있다.
- 리덕스를 사용하는 이유는 에러 추적이 용이하다. 앱이 안정적 but, 코드량이 많아진다.
- MobX는 코드량은 줄지만, 추적이 어렵다.
- 🌟 따라서, 비동기를 지원하기 쉽냐의 유무에 따라 선택한다.(실패에 대비하기 위해) 🌟 후에 더 알아볼 것!

```js
// 데이터 보내줘(요청) >  데이터 받기(성공) or 데이터 받기 실패(실패)
// Context API 사용시

useEffect(() => {
  axios
    .get('/data')
    .then(() => {
      setState(data);
    })
    .catch(() => {
      setError(error);
    });
}, []);
```

- Copntext API를 사용하면 비동기 요청을 처리할 때, 컴포넌트에서 위와 같이 데이터 요청을 하게 되면 의도치 않게 수많은 컴포넌트에서 데이터 요청의 중복이 발생한다.
- 따라서 redux 또는 MobX를 통해 하나의 중앙 데이터 저장소를 사용하여 관리하는 것이 좋다.

- 리액트의 히스토리를 추적하기 위해 크롬 확장 프로그램으로 react-devtools를 다운받는다.
- 개발자 도구의 Redux 창에서 react-devtools를 통해 사용한다.

- 리덕스를 사용하다보면 다양한 상황에서 리듀서를 통해 컴포넌트에 적용하게 되는데, 리듀서의 종류가 많아질 때 리듀서를 나눠줄 수 있다. (스토어는 오직 하나뿐)
- 이번 강의에서는 리듀서를 initialState의 객체를 기준으로 users: {...} ->user.js, post: {...} ->post.js로 나누었다. 🌟 리듀서 쪼개기 🌟

# 4. Redux-thunk 이해하기

- redux thunk는 리덕스의 미들웨어이다.
- 미들웨어란 리덕스의 기능을 향상시켜주는 역할을 한다. (원래 리덕스에 없던 기능을 추가해준다.)
- 또한 액션을 디스패치했을 때 리듀서에서 이를 처리하기에 앞서 사전에 지정된 작업들을 실행한다.
- 그 중 redux-thunk는 리덕스가 비동기 액션을 디스패치할 수 있게 만들어주는 미들웨어이다.
- https://github.com/reduxjs/redux-thunk redux-thunk 공식 문서

```js
4.1 일반 액션생성함수
const INCREMENT_COUNTER = 'INCREMENT_COUNTER';

function increment() {
  return {
    type: INCREMENT_COUNTER,
  };
}

4.2 비동기 처리된 액션생성함수 (redux-thunk를 사용하여 나타냄)
function incrementAsync() {
  return (dispatch) => {
    setTimeout(() => {
      // Yay! Can invoke sync or async actions with `dispatch`
      dispatch(increment());
    }, 1000);
  };
}
```

- why? > 하나의 비동기 액션 안에서 여러 개의 동기 액션을 실행할 수 있다.
- 예를 들어 axios()를 통해 특정 api를 받아오는 요청을 보낼 때, 동기적으로 해당 데이터를 구성하는 스타일드 컴포넌트와 같은 UI를 불러올 수 도 있다는 뜻이다.
- 또 이번 프로젝트에서 리듀서를 통해 login과 logout을 관리하는데, 실제 데이터가 오고 가는 과정에서는 지금처럼 버튼 클릭만으로 바로 로그인되지 않는다.
  (사용자가 입력한 데이터의 확인 과정이 필요하기 때문)
-
- npm i redux-thunk/ yarn add redux-thunk를 통해 다운!

```js
🌟공식 문서의 소스코드는 다음과 같다.🌟
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => (next) => (action) => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }
    // 액션을 실행하기 전에 실행하고자 하는 함수들을 위에 적는다.

    return next(action);

  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;

```

- next() 파라미터는 함수 형태이며, store.dispatch와 비슷한 역할을 합니다.
- 하지만 큰 차이점이 있는데, next(action)을 호출하면 그다음 처리해야 할 미들웨어에게 액션을 넘겨주고, 만약 그다음 미들웨어가 없다면 리듀서에게 액션을 넘겨준다는 것입니다.
- 액션은 원래 객체이지만, thunk에서는 액션을 함수로 둘 수 있다.
- 액션이 함수인 경우, 액션이 지연 함수이기 때문에 해당 리턴되는 액션 나중에 실행할 수 있다.

# 5. Redux-saga 사용하기

## 5.1 saga란?

- redux-thunk에서는 액션들을 직접 만들어 실행했지만, saga에서는 eventListener처럼 주어지는 상황을 만들어 그 상황에 반응하여 다음 행동을 하도록 한다는 것이 가장 큰 차이점이다.
- redux-thunk에서는 지원하는 함수들이 한정적이기 때문에 직접 구현해야 하는 내용들이 생긴다. Ex) setTimeout과 같은 처리
- 또한 thunk에서는 로그인 이벤트를 처리할 때 로그인 버튼을 실수로 두 번 누를 경우, 두번 데이터를 모두 서버에 요청하고 처리한다.
- 하지만 saga는 모듈 설치 시에 제공하는 generator와 effecs들을 통해 이를 사용할 수 있다.
- thunk는 순수 자바스크립트로 구현해야 하고, saga는 기본적으로 제공되는 함수들을 사용해서 구현한다.
- 1. saga에서는 가장 latest(=최근)한 데이터를 처리하기 때문에 셀프 DDOS 공격을 방지한다. ex) 1초에 3번 이상 같은 액션이 발생하면 해당 액션의 마지막만 실행하거나, 액션을 해당 액션을 차단한다. >> takelatest
- 2. saga에서는 throttle 함수를 통해 인피니트 스크롤링 이벤트를 제어하여 들어오는 데이터의 양을 제어할 수 있는 것이 장점이다.
- https://github.com/bmealhouse/next-redux-saga 공식문서 확인!
- npm i redux-saga / yarn add redux-saga
- generator에 대한 이해가 필요하다.

## 5.2 saga의 generator

```js
const gen = function*(){
  console.log(1);
  yield
  console.log(2);
  yield
  console.log(3);
  yield
  console.log(4);
  yield 4;
}
  ...
  const g = gen();

    g.next();
  > 1,  {value: undefined, done: false}
    g.next();
  > 2,  {value: undefined, done: false}
    g.next();
  > 3,  {value: undefined, done: false}
    g.next();
  > 4,  {value: 4, done: false}
    g.next();
  >  {value: undefined, done: true}

  generator는 함수 안에 yield를 넣어주면 그 부분까지 실행되고 멈추게 된다. (중단점을 가진다.)
  또한 .next()함수를 사용하여 generator로 만든 함수를 사용한다.
```

- next()를 실행하면 value 값과 done의 boolean 값을 알 수 있는데, done의 불린 값을 통해 만든 함수가 끝까지 실행됬는지의 여부를 알 수 있다.
- 따라서 yield를 사용하여 찍히는 로그 값을 통해, 비동기 함수의 작동 여부를 순차적으로 체크할 수 있다는 것이 가장 큰 장점이다.
- 이 yield의 성질을 활용하는 것이 redux-saga라고 볼 수 있다.

```js
🌟절대 멈추지 않는 generator🌟
const gen = function*(){
  while(true){
    yield i++;
  }
}
>>> undefined
why? 원래 whilte true는 무한 반복을 의미하지만, yield의 비동기적 특징때문에 무한 반복되지 않는다.
...
const g = gen();
g.next();
> {value: 0, done: false}
g.next();
> {value: 1, done: false}

- next() 함수를 통해, 다음 값부터는 value가 찍히지만 done은 계속 false가 나올 것이다. (while true 이기 때문)
- 이런 generator의 성질을 이용하여 자바스크립트에서는 무한 값을 표현하게 된다.
```

## 5.3 saga 사용법

- 설치한 next-redux-saga를 사용하기 위해서는 pages/\_app.js에서 withReduxSaga를 import 시켜야 한다.

```js
export default wrapper.withRedux(withReduxSaga(NodeBird));
```

- hoc(high-order-component)를 통해 해당 프로젝트에서 redux-saga를 사용할 수 있게 묶어주었다.
- Redux의 추가된 기능이 redux-saga이므로 withRedux 다음으로 한 번 더 감싸게 되는 것이다.

## 5.4 saga의 이펙트 (effects)

- 처음 배울 때 yield 뒤에 변수값을 받아 오거나, 조건 문을 통해 문장을 제어하였는데, saga를 활용하기 위해서는 이펙트들을 잘 활용해야 한다.

  |           값           |                                                         의미                                                         |
  | :--------------------: | :------------------------------------------------------------------------------------------------------------------: |
  |        all([ ])        |                 yield에서 배열을 받는다. 그 배열안에 들어있는 함수(fork, call)를 한번에 실행해준다.                  |
  |        fork( )         | 함수를 실행한다. (비동기 함수 호출), 요청을 보내고 결과와 상관없이 바로 다음 함수로 넘어간다. (블로킹을 하지않는다.) |
  |        call( )         |       함수를 실행한다. (동기 함수 호출), 리턴 받을 때까지 기다렸다가 리턴 받은 값을 넣어준다. (블로킹을 한다.)       |
  | take("ACTION", action) |    'ACTION' 이라는 액션이 실행될 때까지 기다리겠다. 'ACTION'이 실행되면, action이라는 generator 함수를 실행한다.     |
  |        put({ })        |                            액션 객체를 실행시킨다. (redux의 dispatch와 같은 행동을 한다)                             |
  |        delay()         |   백엔드 구현 전에, 더미데이터를 통해 데이터를 주고 받지 않고 일정 지연시간만 주고 처리하고 싶을 때 사용하는 함수    |

- yield 는 async/ await의 await과 비슷하다고 생각하면 쉽다.

### 5.4.1 saga의 이펙트 재 반복성 (take)

- yield를 통해 take() 함수들을 감싸다보니 생기는 가장 큰 문제는 해당 함수를 한 번 밖에 실행하지 못한다는 것이다.
- 🌟 띠리사 generator의 특성을 활용하여 yield로 만든 해당 함수들을 while true 문으로 감싸줘야 한다! 🌟
- while true와 같이 모든 함수를 감싸주게 되면 코드의 양이 늘어나므로 takeEvery()라는 함수를 기존 take() 대신 사용한다.

  |               값               |                                                                      의미                                                                      |
  | :----------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------: |
  |          takeEvery()           |                      yield take()를 대신해서 모든 상황에서 take를 계속 받을 수 있는 함수, while true의 역할을 대신 한다.                       |
  |          takeLatest()          |                            이벤트의 실행이 두 번 혹은 연속적으로 실행됐을 때, 최종적으로 클릭한 액션을 넘겨받는다.                             |
  | throttle("ACTION", action, 초) | takeLatest()의 한계(요청을 시간 차로 보냈을 때는 두 요청 모두를 처리)를 보완하기 위해서 일정 시간동안 보낼 수 있는 요청의 갯수를 제한하는 함수 |

- 보통은 takeLatest()를 많이 사용한다.
- 🌟 하지만, takeLatest()를 통해 프론트에서는 최종적으로 마지막 액션을 보여준다고 하더라도, 백에서는 해당 요청에 따라 응답을 두 번 할수 있다. 🌟
- 🌟 응답은 취소할 수 있지만, 요청을 취소할 수는 없다. 🌟
- 따라서 throttle() 을 사용하여 요청을 제한하기도 한다.(대부분의 경우는 takeLatest()를 쓴다.)

## 🌟🌟🌟 5.5 saga 쪼개기, 리듀서에 action.type 적용하기🌟🌟🌟

- data흐름 AppLayOut > LoginForm > UserProfile 생각해보고 숙지하기
- reducer, redux-saga

## 5.6 더미데이터 만들고, 댓글 saga 작성하기

- 백엔드와의 연동 전에 우리는 우리가 만든 더미데이터를 통해서 입력하는 기능들이 구현되는지 확인한다.
- 이때, 우리가 만든 로직에서 반복문을 통해 기능들이 구현되는데, id 값을 그때마다 넣어줄 수 없으므로 shortid와 faker 모듈을 사용한다.
- shortid / faker 모듈을 사용하면 겹치기 힘든 id를 자동으로 생성해준다.

- 불변성의 핵심은 바뀌는 것만 새로운 객체로 만들고, 나머지 객체는 참조를 유지하는 것이다.
- 그래야만 바뀌는 것만 바뀌고 안바뀌는 것은 참조가 유지되어 메모리를 절약할 수 있기 때문이다.
- 이 불변성을 유지하면서 편하게 쓸 수 있는 라이브러리가 immer 이다.

## 5.7 immer 라이브러리를 사용하여 불변성 관리하기

- yarn add immer / npm i immer
- import produce from 'immer';

```js
    case ADD_COMMENT_SUCCESS: {
      // action.data.content, postId, userId 가 들어옴 > ADD_POST_SUCCESS로 전달됨

      const postIndex = state.mainPosts.findIndex((v) => v.id === action.data.postId);
      const post = { ...state.mainPosts[postIndex] };
      post.Comments = [dummyComment(action.data.content), ...post.Comments];
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = post;

      return {
        ...state,
        mainPosts,
        addCommentLoading: false,
        addCommentDone: true,
      };
    }
```

- 불변성을 지키기 위해서 reducer에서 사용한 코드이다.
- 이 불변성 때문에 spread 연산자를 통해 객체의 값을 복사해 오는데 더 깊은 복사를 하게 될 수록 오류가 날 확률이 높아진다.
- 따라서 immer를 통해 오류를 줄이고 더 보기 쉬운 코드로 만들어줄 수 있다.

```js
// 리듀서 안에서 사용할 때, 사용법은 다음과 같다.
// 리듀서 : 이전 상태를 액션을 통해 다음 상태로 만들어내는 함수(단, 불변성은 지키면서)
const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    draft;
  });
};
==
 const reducer = (state = initialState, action) => produce(state, (draft) => {});

```

- 위와 같이 화살표 함수 뒤에 바로 붙는 함수는 return이 생략된 것이다! 🌟
- immer에서는 state 대신 draft라는 값을 사용하는데, 기존의 불변성의 법칙을 깨고 사용하더라도 immer가 이 draft를 감지하여 자동으로 다음 상태(state, 여기서는 draft)로 만들어준다.

```js
  case ADD_COMMENT_SUCCESS: {
      const post = draft.mainPosts.find((v) => v.id === action.data.postId);
      post.Comments.unshift(dummyComment(action.data.content));
      draft.addCommentLoading = false;
      draft.addCommentDone = true;
      break;
    }

    - 기존의 ADD_COMMENT_SUCCESS문을 불변성을 지키기위해 사용했던 것에 비해, immer를 통해 불변성을 지키지 않고 코드를 처리하면 훨씬 더 간결하고 가독성이 좋게 만들어 줄 수 있다.
    - 따라서 immer를 처음부터 도입한 후에 그에 맞춰 작업하는 것이 더 효율적일 수 있다.
```

## 5.8 faker로 실감나는 더미데이터 만들기

- 백엔드와 연동 전, 프론트 엔드만을 사용하여 포트폴리오를 만들 때 댓글 1, 댓글 2와 같은 데이터보다 실감나는 더미데이터를 받아올 수 있는 라이브러리입니다.
- yarn add faker / npm i faker 를 통해 다운 받습니다.
- import faker from 'faker'를 통해 임포트시켜 사용합니다.
- 자세한 사용방법은 https://www.npmjs.com/package/faker 를 참고하면 됩니다.

```js
initialState.mainPosts = initialState.mainPosts.concat(
  Array(20)
    .fill()
    .map(() => ({
      id: shortId.generate(),
      User: {
        id: shortId.generate(),
        nickname: faker.name.findName(),
      },
      content: faker.lorem.paragraph(),
      Images: [
        {
          src: faker.image.image(),
        },
      ],
      Comments: [
        {
          User: {
            id: shortId.generate(),
            nickname: faker.name.findName(),
          },
          content: faker.lorem.sentence(),
        },
      ],
    }))
);
```

- initialState의 mainPosts는 기존과 같은 키 값을 유지하여 만들어줍니다.
- npm 에서 faker의 공식문서를 바탕으로 nickname(이름)과 image(트윗 이미지) sentence(댓글)를 구현해 주었습니다.
- 🌟concat을 통해 데이터를 삽입시에는 항상 <b>initialState.mainPosts = initialState.mainPosts.concat()</b>와 같은 형태로 앞에 선언을 해줘야 concat이 적용됩니다.

## 5.9 인피니티 스크롤 구현하기!

- useEffect()를 통해 탐지되는 상황을 감지하고 리렌더링 시킵니다.

```js
useEffect(() => {
  function onScroll() {
    console.log(window.scrollY, document.documentElement.clientHeight, document.documentElement.scrollHeight);

    if (window.scrollY + document.documentElement.clientHeight === document.documentElement.scrollHeight) {
      if (hasMorePost) {
        dispatch({
          type: LOAD_POSTS_REQUEST,
        });
      }
    }
  }
  window.addEventListener('scroll', onScroll);
  return () => {
    window.removeEventListener('scroll', onScroll);
  };
}, [hasMorePost]);

// scrollY: 얼마나 내렸는지
// clientHeight : 화면 보이는 길이
// scrollHeight: 총 길이

// scrollY 와 clientHeight의 합이 scrollHeight의 값이 되므로 이 들을 비교하여 인피니티 스크롤을 구현할 수 있다.
```

- 하지만, 실무에서는 스크롤이 아예 맨밑까지 닿았을 때가 아닌 300px정도의 여유가 있을 때 데이터를 불러온다.
- 또한 scroll 이벤트는 스크롤을 감지하여 발생하기 때문에 LOAD_POSTS_REQUEST에 대한 요청이 한번에 엄청 많이 일어날 수 있다.
- 따라서 loadPostsLoading의 state를 통해 이미 불러오는 중이거나, 다 불러왔다면 request를 보내지 않도록 조건문에 넣어줘야 한다.

```js
useEffect(() => {
  function onScroll() {
    if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
      if (hasMorePost && !loadPostsLoading) {
        dispatch({
          type: LOAD_POSTS_REQUEST,
        });
      }
    }
  }
  window.addEventListener('scroll', onScroll);
  return () => {
    window.removeEventListener('scroll', onScroll);
  };
}, [hasMorePost, loadPostsLoading]);

...

sagas/post.js
...
function* watchLoadPosts() {
  yield throttle(2000, LOAD_POSTS_REQUEST, loadPosts);
}
```

# 6. SSR(SERVER-SIDE-RENDERING) 바로 알기

- next.js를 쓰는 이유는 서버 사이드 렌더링을 편하게 해주기 때문이다.
- wrapper 의 getServerSideProps/ getStaticProps / getStaticPaths를 통해 SSR을 구현해준다.
- wrapper는 📁store/configureStore에서 next-redux-wrapper의 기능을 export 시킨 것이다.

|        단어        |                             의미                              |
| :----------------: | :-----------------------------------------------------------: |
|   getStaticProps   |         언제 접속해도 데이터가 바뀔 일이 없을 때 사용         |
|         -          |   빌드할 때 미리 SSR을 통해 html로 만들어서 가지고 있는다.    |
| getServerSideProps | 접속할 때마다 접속하는 상황에 따라 화면이 바뀌어야 할 때 사용 |
|         -          |       웬만한 경우 getServerSideProps가 default로 사용됨       |
|   getStaticPaths   |                                                               |
|         -          |                                                               |

# 6.1 credentials 해결하기

- CSR에서 SSR 전환할 때 브라우저가 백엔드에서 바로 데이터를 넘겨받아야 되는 상황이다.
- 기존에는 브라우저가 프론트 서버에 요청하여 (GET_POSTS_REQUEST) 요청을 받은 프론트 서버는 백엔드 서버에서 POST 불러와 사용자에게 보여줬다.
- 그렇기 때문에 프론트 서버와 백엔드 서버의 credentials 문제는 해결되어 있었다.
- 하지만, SSR의 경우 브라우저가 백엔드 서버에게 데이터를 바로 요청하기 때문에 이 credentials문제를 다시 해결해 줘야 한다.
- why? 다른 도메인(포트)끼리는 데이터 및 쿠키를 전달할 수 없기 때문에!

```js
📁pages/index.js

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  // 서버 사이드 렌더링시 프론트에서 서버에 쿠키를 보내주기 위한 작업
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = cookie;
  console.log(context);
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_POSTS_REQUEST,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Home;
```

- context.req 를 통해서 req.headers안에 담긴 sid(쿠키)를 보내준다.
- 이를 통해 SSR 환경에서 서버가 껏다 켜져도 로그인이 풀리지 않는 환경을 만들어줄 수 있다.
- 하지만 이 상황에서 쿠키를 서버에 보낼 때 문제가 생길 수 있는데, 다른 사람이 같은 페이지에 접속했을 때 쿠키를 공유할 수 있다는 것이다.
- why? 쿠키를 axios를 통해 모두 한 서버로 보내기 때문에
- 따라서 다음과 같은 조건문을 넣어줘서 자신의 요청이 아닐 경우, 쿠키를 지워주도록 한다.

```js
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  // 그렇지 않을 때는 쿠키를 지워준다.
  if (context.req && cookie) {
    // + 서버일 때, 쿠키가 있을 때만 쿠키를 넘겨주도록 한다.
    axios.defaults.headers.Cookie = cookie;
  }
  console.log(context);
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_POSTS_REQUEST,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});
```

## 🌟 개발 꿀팁(ui)

- 그리드를 만들 때는 가로(Row) 먼저 나누고 세로(Col)로 나눌 것
- Col 속성 : xs: 모바일 / sm: 태블릿 / md: 작은 데스크탑
- https://ant.design/components/grid 를 통해 확인 (breakpoints)
- 반응형 웹을 만들기 위해서는 모바일 > 테블릿 > 데스크탑 순으로 진행한다.
- a 태그로 target="\_blank"를 줄 때는 rel 로 noreferrer noopener를 통해 보안을 신경 써 준다.

## 🌟 개발 꿀팁(react/ next)

- next.js에서 <head> 부분을 수정하기 위해서는 Head라는 컴포넌트를 임포트 시켜서 사용해야 한다.
- 컴포넌트에 props로 넘겨주는 함수는 useCallback으로 꼭 넘겨주어 최적화 시킬 것!
- 인라인태그로 styled를 주게 되면, 리액트에서는 virtual DOM이 해당 컴포넌트를 계속 인식해서 렌더링해주기 때문에 최적화가 이루어지지 않는다.
- 따라서 styled-component를 사용하여 인라인 태그 대신해서 감싸준다. (AppLayout의 SearchInput은 antd에서 받은 스타일을 다시 한 번 바꿔주었다.)
- 하지만 이는 deploy시에 최적화 문제가 발생했을 경우 진행해도 늦지 않으므로 프로젝트의 규모에 따라 처리속도가 느려질 경우에 실행하는 것이 좋다.

  ```js
  const SearchInput = stled(Input.Search)`
  vertical-align: middle;
  `;
  ```

- 스타일드 컴포넌트를 사용하지 않기 위해서는 useMemo를 사용해서 해당 스타일 값을 감싸준다.(클린업 함수[ ] 포함)

  ```js
  const style = useMemo(()=> ({ marginTop: 10}). []);
  ```

- why? 리렌더링 방지
- 최상위 노드에서 개발을 시작할 때 의미가 있는 단위로 컴포넌트를 먼저 짠다음 코드를 만들어 나가는 것이 좋다.
- 배열안에 JSX를 넣을 때는 항상 key값을 넣어 주어야 한다.

- 🌟 PropTypes가 obejct일 경우 shape() 메소드를 통해 안에 들어있는 객체를 구체적으로 관리할 수 있다. 🌟

```js
PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    ...
  }).isRequired,
}
```

- post의 본래 프로토타입은 object였으나, shape() 메소드를 이용하여 세부적으로 관리하였다.

- react-slick을 이용하여 이미지 캐루셀을 표현할 것이다.
- 클릭 시, 토글되며 모달 형식으로 다수의 이미지를 넘겨볼 수 있는 방식

```url
  🌟url 참조🌟
  - https://www.npmjs.com/package/react-slick
  - https://codesandbox.io/s/ppwkk5l6xx
```

- styled 컴포넌트의 오타를 잡고 싶을 때
- 🌟vscode-styled-components🌟 확장 프로그램으로 관리할 수 있다.

## ※ 개념 정리(javascript /react /next)

1. 리렌더링

- 리액트에서 리렌더링은 return (...) 에서 렌더링이 되면 리턴(...)된 문법 전부 리렌더링 시키는 것이 아닌, virtual DOM 에 의해 감지된 부분(이전과 달라진 부분)만을 리렌더링 한다.

2. 참조(복사의 deps)

```js
  2.1
  {} === {} // false

  const a = {};
  const b = a;

  a === b // true
```

```js
2.2;
const next = { b: 'c' };
const prev = { a: next };

const next = { ...prev };

prev.a === next.a >> true;

prev === next >> false;
```

- 같은 참조 🌟값🌟을 가지고 있는 상태인 prev.a와 next.a는 같지만, 🌟객체 자체는 서로 다른 객체이므로🌟 prev === next는 false 이다.
- 자바스크립트에서 객체와 객체를 비교하게 되면 빈 객체여도 false가 나온다.
- 객체를 새로 만든 것은 항상 false이지만, 객체를 참조하게 되면 true가 나온다.
- 따라서 react에서는 (...) spread 연산자를 통해 객체를 새로 만들어 참조해 오게 된다.
- why? 객체를 새로 만들어야 변경 내역이 추적이 되기 때문 && 메모리를 아끼기 위해!
- 리덕스를 쓰는 이유는 데이터의 history를 추적하기 쉬함이 가장 큰데 그렇기 때문에 history를 추적하기 위해서는 spread 연산자를 통해 새로운 객체를 계속 만들어 줘야 한다.

3. useMemo <-> useCallback?

```url
  https://www.youtube.com/watch?v=6H6KncvVc8s
  https://www.youtube.com/watch?v=uBmnf_k7_r0
```

- 두 번째 인자로 받는 값의 변화에 따라 재 실행되는 것은 같은 속성이다.
- 하지만, useMemo( )는 실행한 함수의 🌟결괏값(=리턴되는 값)🌟을 기억한다.
- useCallback( )는 실행하는 🌟함수 자체🌟를 기억한다.
- 뭐가 다른데?
- 함수형 컴포넌트는 항상 함수 전체를 재 실행한다.
- 그렇기 때문에 useCallback으로 감싸게 되면, 그 함수를 기억하고, 함수가 변화시에만 렌더링 시킬 수 있다.
- 계속 재실행되면 그만큼 서버에서 다운 받아야 하는 데이터가 많아지므로, 한 번 렌더링된 값을 저장하고 그 함수가 작동할 때만 바꿀 수 있도록 useCallback()처리를 해준다.
- 자식 컴포넌트에게 props로 함수를 넘겨줄 때는 반드시 useCallback()으로 감싸줘야 한다.
- props를 받을 때마다 자식 컴포넌트는 부모에게 새로운 함수를 받는 것으로 생각하기 때문에

4. useEffect ?

- useEffect를 사용시 다음과 같은 useEffect문을 자주 볼 것입니다.

```js
useEffect(() => {
  dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  dispatch({
    type: LOAD_POSTS_REQUEST,
  });
}, []);
```

## 🌟useEffect가 하는 일은 무엇일까요?🌟

- useEffect Hook을 이용하여 우리는 리액트에게 컴포넌트가 렌더링 이후에 어떤 일을 수행해야하는 지를 말합니다. 리액트는 우리가 넘긴 함수를 기억했다가(이 함수를 ‘effect’라고 부릅니다) DOM 업데이트를 수행한 이후에 불러낼 것입니다. 위의 경우에는 effect를 통해 문서 타이틀을 지정하지만, 이 외에도 데이터를 가져오거나 다른 명령형(imperative) API를 불러내는 일도 할 수 있습니다.

## 🌟useEffect를 컴포넌트 안에서 불러내는 이유는 무엇일까요?🌟

- useEffect를 컴포넌트 내부에 둠으로써 effect를 통해 count state 변수(또는 그 어떤 prop에도)에 접근할 수 있게 됩니다. 함수 범위 안에 존재하기 때문에 특별한 API 없이도 값을 얻을 수 있는 것입니다. Hook은 자바스크립트의 클로저를 이용하여 리액트에 한정된 API를 고안하는 것보다 자바스크립트가 이미 가지고 있는 방법을 이용하여 문제를 해결합니다.

## 🌟useEffect는 렌더링 이후에 매번 수행되는 걸까요?🌟

- 네, 기본적으로 첫번째 렌더링과 이후의 모든 업데이트에서 수행됩니다.(나중에 effect를 필요에 맞게 수정하는 방법에 대해 다룰 것입니다.) 마운팅과 업데이트라는 방식으로 생각하는 대신 effect를 렌더링 이후에 발생하는 것으로 생각하는 것이 더 쉬울 것입니다. 리액트는 effect가 수행되는 시점에 이미 DOM이 업데이트되었음을 보장합니다.

4. optional chaning 연산자

5. Toggle 기능 구현

```js
const [liked, setLiked] = useState(false);
const onToggleLike = useCallback(() => {
  setLiked((prev) => !prev);
}, []);
```

- prev라는 이전 상태를 나타내는 키워드를 통해 Toggle 버튼 기능을 만들었다.

```js
liked ? <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onToggleLike} /> : <HeartOutlined key="heart" onClick={onToggleLike} />;
```

- 삼항 연산자를 통해 useState의 liked를 기반으로 onToggle 함수를 실행할 수 있다.

6. 정규식 사용하여 해시태그 분리하기

```js
{
  postData.split(/(#[^\s#]+)/g).map((v, i) => {
    if (v.match(/(#[^\s#]+)/g)) {
      return (
        <Link href={`/hashtag/${v.slice(1)}`} key={i}>
          <a>{v}</a>
        </Link>
      );
    }
    return v;
  });
}
```

- 처음 시작할 때 사용하는 변수인 postData는 post(=게시물)에 작성한 content를 props로 받아온 것이다.
- 이때 예시로 🌟"첫 번째 게시글 #해시태그 #익스프레스"🌟 라는 문자열이 content로 들어왔을 때 우리는 해시태그가 포함된 문자열만 분리하고 싶은 상황이므로, split(정규식) 함수를 사용하여 문자열을 각각으로 구분하여 매핑한다.
- 만약 매핑한 문자열(v)이 우리가 원하는 해시태그가 포함된 값과 같을 경우에는 Link 태그를 붙여 해당 해시태그가 url 파라미터로 포함된 href로 검색할 수 있게 된다.
- 아닐 경우 그냥 문자열(v)를 리턴한다.
- 매핑(map)을 할 때는 원래 key 값이 필요한데, 문자열을 분리하는 상황에서는 key값이 다양한 게시글에 의해 중복될 수 있으므로 index (i)를 사용했다.
- index를 사용하여 key값을 나타내면 무거워질 경우 렌더링 문제가 생길 수 있지만, 최대한 자제하는 방향에서 사용할 수 있을 것이다.

## 🌟 에러를 잡자 🌟

- ReferenceError: is not defined

```url
https://wickedmagic.tistory.com/444
```
