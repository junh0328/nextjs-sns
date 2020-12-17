# 1. Hello, Next.js

- Next.js에서는 pages 폴더에 페이지를 처리해줘야 하는데 next 라이브러리에서 pages 폴더를 인식하여 코드 스플리팅을 해주기 때문이다.
- Next가 page안에 있는 페이지들을 라우팅 처리를 해주지 않아도 url창에 파라미터를 입력할 시 자동으로 페이징 처리를 해준다. ex) localhost:3000/profile >> 다이나믹 라우팅 기능
- Next.js에서는 react-router로 라우팅처리를 돕는 것이 아닌 자체적인 라우터를 활용한다.
- Link href="/경로" 후에 a태그로 감싸준다.

# 2. antd 사용해 SNS 화면 만들기

- next.js에는 기본적으로 웹팩이 제공되기 때문에 css파일을 스타일 태그로 바꿔서 적용해준다.
- 따라서 antd와 styled-components를 사용하여 UI 구성한다.
- npm trends에서 검색하여 더 나은 CSS FRAMEWORK 사용하기!
- antd에서는 class 컴포넌트로 작성이 되있기 때문에 함수형으로 바꾸는 공부 꼭 할 것!
- pages 폴더 안의 \_app.js는 pages 폴더내의 모든 파일들에 공통으로 들어가는 레이아웃을 담아두었다.
- components 폴더 안의 AppLayout.js는 특정 컴포넌트에만 쓰이는 부분을 추려 쓰기 위해 만들었다.

## 개발 꿀팁(ui)

- 그리드를 만들 때는 가로(Row) 먼저 나누고 세로(Col)로 나눌 것
- Col 속성 : xs: 모바일 / sm: 태블릿 / md: 작은 데스크탑
- https://ant.design/components/grid 를 통해 확인 (breakpoints)
- 반응형 웹을 만들기 위해서는 모바일 > 테블릿 > 데스크탑 순으로 진행한다.
- a 태그로 target="\_blank"를 줄 때는 rel 로 noreferrer noopener를 통해 보안을 신경 써 준다.

## 개발 꿀팁(react/ next)

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

### 개념 정리(react /next)

- 리액트에서 리렌더링은 return (...) 에서 렌더링이 되면 리턴(...)된 문법 전부 리렌더링 시키는 것이 아닌, virtual DOM 에 의해 감지된 부분(이전과 달라진 부분)만을 리렌더링 한다.
