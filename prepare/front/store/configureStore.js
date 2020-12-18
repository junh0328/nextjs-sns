import { createWrapper } from 'next-redux-wrapper';
import { createStore } from 'redux';

import reducer from '../reducers';

const configureStore = () => {
  const store = createStore(reducer);
  store.dispatch({
    type: 'CHANGE_NICKNAME',
    data: 'boogiejun',
  });
  return store;
};

const wrapper = createWrapper(configureStore, {
  debug: process.env.NODE_ENV === 'development',
});

export default wrapper;

/*
 createWrapper의 두 번째 옵션 객체인 debug는 리덕스에 관하여 자세한 설명을 보여주는 옵션이다.
 debug를 true로 두면, 코딩 시 도움이 된다.
*/

/*
_app.js로 넘겨주고 redux를 사용할 수 있게 만듬
*/
