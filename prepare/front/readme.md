# 1. Hello, Next.js

- Next.js에서는 pages 폴더에 페이징 처리를 해줘야 하는데, Next.js의 라이브러리가 pages 폴더를 인식하여 코드 스플리팅을 해주기 때문이다.
- Next가 react처럼 page안에 있는 페이지들을 라우팅 처리를 해주지 않아도 url창에 파라미터를 입력할 시 자동으로 페이징 처리를 해준다.
- ex) localhost:3000/profile >> 다이나믹 라우팅 기능
- Next.js에서는 react-router로 라우팅처리를 돕는 것이 아닌 자체적인 라우터를 활용한다. (page 안에 있는 파일들을 파라미터를 통해 자동으로 라우팅처리 해준다)
- 코드 스플리팅을 하기 위해서 Link href="/경로" 후에 a태그로 감싸준다.

# 2. antd 사용해 SNS 화면 만들기

- next.js에는 기본적으로 웹팩이 제공되는데, 이 웹팩이 css파일을 스타일 태그로 바꿔서 적용해준다.
- 따라서 이번 프로젝트는 웹팩을 기반으로 antd와 styled-components를 사용하여 UI 구성한다.
- 다음 프로젝트 진행 시, npm trends에서 검색하여 더 나은 CSS FRAMEWORK 사용하기!
- antd에서는 class 컴포넌트로 작성이 되있기 때문에 함수형으로 바꾸는 공부 꼭 할 것!
- pages 폴더 안의 \_app.js는 pages 폴더내의 모든 파일들에 공통으로 들어가는 레이아웃을 담아두었다.
- components 폴더 안의 AppLayout.js는 특정 컴포넌트에만 쓰이는 부분을 추려 쓰기 위해 만들었다.

# 3. Redux 사용하기

- next에서 리덕스 라이브러리를 손쉽게 사용하기 위해 next-redux-wrapper를 사용한다.
- yarn add next-redux-wrapper / npm install next-redux-wrapper 로 모듈 다운로드
- yarn add redux / npm install redux로 모듈 다운로드
- react-redux 사용이세 리액트-리덕스를 사용하기위해 provider 로 컴포넌트 전체를 감싸주었지만, next.js에서는 자동으로 감싸 주기 때문에 감싸 주지 않는다.
- 우리가 Provider를 또 사용하면 Provider를 2번 사용하게 되는 중복이 발생한다.
- next-redux-wrapper의 createWrapper 함수를 사용하여 스토어를 감싸준다.
- 리덕스 기능을 사용하기 위해 createStore통해 스토어를 만들고 리듀서를 연결한다.

- 리액트에서는 모든 파일들을 컴포넌트로 분리하여 관리를 하기 때문에 중앙 데이터 저장소가 필요하다.
- why? 데이터의 일치성을 주기 위해
- 이 중앙 데이터 저장소의 역할을 하는 것이 Context API, Redux, MobX 등이 있다.
- 리덕스를 사용하는 이유는 에러 추적이 용이하다. 앱이 안정적 but, 코드량이 많아진다.
- MobX는 코드량은 줄지만, 추적이 어렵다.
- 따라서, 비동기를 지원하기 쉽냐의 유무에 따라 선택한다.(실패에 대비하기 위해)

```
   데이터 보내줘(요청) >  데이터 받기(성공) or 데이터 받기 실패(실패)

   ★Context API 사용시

  useEffect(()=> {
    axios.get('/data)
      .then(()=>{
        setState(data);
      })
      .catch(()=>{
        setError(error);
      })
  })
```

- Copntext API를 사용하면 비동기 요청을 처리할 때, 컴포넌트에서 위와 같이 데이터 요청을 하게 되면 의도치 않게 수많은 컴포넌트에서 데이터 요청의 중복이 발생한다.
- 따라서 redux 또는 MobX를 통해 하나의 중앙 데이터 저장소를 사용하여 관리하는 것이 좋다.

## ※ 개발 꿀팁(ui)

- 그리드를 만들 때는 가로(Row) 먼저 나누고 세로(Col)로 나눌 것
- Col 속성 : xs: 모바일 / sm: 태블릿 / md: 작은 데스크탑
- https://ant.design/components/grid 를 통해 확인 (breakpoints)
- 반응형 웹을 만들기 위해서는 모바일 > 테블릿 > 데스크탑 순으로 진행한다.
- a 태그로 target="\_blank"를 줄 때는 rel 로 noreferrer noopener를 통해 보안을 신경 써 준다.

## ※ 개발 꿀팁(react/ next)

- next.js에서 head 부분을 수정하기 위해서는 Head라는 컴포넌트를 임포트 시켜서 사용해야 한다.
- 컴포넌트에 props로 넘겨주는 함수는 useCallback으로 꼭 넘겨주어 최적화 시킬 것!
- 인라인태그로 styled를 주게 되면, 리액트에서는 virtual DOM이 해당 컴포넌트를 계속 인식해서 렌더링해주기 때문에 최적화가 이루어지지 않는다.
- 따라서 styled-component를 사용하여 인라인 태그 대신해서 감싸준다. (AppLayout의 SearchInput은 antd에서 받은 스타일을 다시 한 번 바꿔주었다.)
  ```
  const SearchInput = stled(Input.Search)`
  vertical-align: middle;
  `;
  ```
- 스타일드 컴포넌트를 사용하지 않기 위해서는 useMemo를 사용해서 해당 스타일 값을 감싸준다.(클린업 함수[ ] 포함)
  ```
  const style = useMemo(()=> ({ marginTop: 10}). []);
  ```
- why? 리렌더링 방지
- useCallback() 함수를 캐싱 <-> useMemo() 값을 캐싱

## ※ 개념 정리(javascript /react /next)

1. 리렌더링

- 리액트에서 리렌더링은 return (...) 에서 렌더링이 되면 리턴(...)된 문법 전부 리렌더링 시키는 것이 아닌, virtual DOM 에 의해 감지된 부분(이전과 달라진 부분)만을 리렌더링 한다.

2. 참조(복사의 deps)

```
  2.1
  {} === {} // false

  const a = {};
  const b = a;

  a === b // true
```

```
  2.2
  const next = {b: 'c'};
  const prev = {a: next};

  const next = {...prev}

  prev.a === next.a
  >> true

  prev === next
  >> false
```

- 같은 참조 값을 가지고 있는 상태인 prev.a와 next.a는 같지만, 객체 자체는 서로 다른 객체이므로 prev === next는 false 이다.
- 자바스크립트에서 객체와 객체를 비교하게 되면 빈 객체여도 false가 나온다.
- 객체를 새로 만든 것은 항상 false이지만, 객체를 참조하게 되면 true가 나온다.
- 따라서 react에서는 (...) spread 연산자를 통해 객체를 새로 만들어 참조해 오게 된다.
- why? 객체를 새로 만들어야 변경 내역이 추적이 되기 때문 && 메모리를 아끼기 위해!
- 리덕스를 쓰는 이유는 데이터의 history를 추적하기 쉬함이 가장 큰데 그렇기 때문에 history를 추적하기 위해서는 spread 연산자를 통해 새로운 객체를 계속 만들어 줘야 한다.

3. useMemo <-> useCallback?

```
  https://www.youtube.com/watch?v=6H6KncvVc8s
  https://www.youtube.com/watch?v=uBmnf_k7_r0
```

- 두 번째 인자로 받는 값의 변화에 따라 재 실행되는 것은 같은 속성이다.
- 하지만, useMemo( )는 실행한 함수의 ★결괏값(=리턴되는 값)★을 기억한다.
- useCallback( )는 실행하는 ★함수 자체★를 기억한다.
- 뭐가 다른데?
- 함수형 컴포넌트는 항상 함수 전체를 재 실행한다.
- 그렇기 때문에 useCallback으로 감싸게 되면, 그 함수를 기억하고, 함수가 변화시에만 렌더링 시킬 수 있다.
- 계속 재실행되면 그만큼 서버에서 다운 받아야 하는 데이터가 많아지므로, 한 번 렌더링된 값을 저장하고 그 함수가 작동할 때만 바꿀 수 있도록 useCallback()처리를 해준다.
- 자식 컴포넌트에게 props로 함수를 넘겨줄 때는 반드시 useCallback()으로 감싸줘야 한다.
- props를 받을 때마다 자식 컴포넌트는 부모에게 새로운 함수를 받는 것으로 생각하기 때문에

### DevTools

-
