import { createWrapper } from "next-redux-wrapper";
import { createStore } from "redux";

import reducer from "../reducers";

const configureStore = () => {
  const store = createStore(reducer);
  // store를 컴포넌트에서 가져다 쓰기 위해서는 디스패치를 시켜줘서(액션을 발생시켜서) 리듀서로 보내준다. 전달받은 리듀서에서 액션 타입에 따라 다음 상태로 만들어 준다.
  return store;
};

const wrapper = createWrapper(configureStore, {
  debug: process.env.NODE_ENV === "development",
});

export default wrapper;

/*
 createWrapper의 두 번째 옵션 객체인 debug는 리덕스에 관하여 자세한 설명을 보여주는 옵션이다.
 debug를 true로 두면, 코딩 시 도움이 된다.
*/

/*
_app.js로 넘겨주고 redux를 사용할 수 있게 만듬
*/
/*
 state와 reducer를 포함하는 개념이 스토어이다.
*/
