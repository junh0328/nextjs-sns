import { createWrapper } from 'next-redux-wrapper';
import { applyMiddleware, compose, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

import reducer from '../reducers';
import rootSaga from '../sagas';

/*
redux-thunk 사용법

const loggerMiddleware = ({ dispatch, getState }) => (next) => (action) => {
  if(typeof action === 'function'){
    return action(dispatch, getState);
  }
  return next(action);
}
*/
const loggerMiddleware = ({ dispatch, getState }) => (next) => (action) => {
  console.log(action);
  return next(action);
}; // 해당 loggerMiddleware를 통해 redux-devTools처럼 액션 행동을 콘솔창에서 감지할 수 있게 되었다.

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  // 비워저였던 middlewares 변수에 thunk 미들웨어를 장착하였다.
  const middlewares = [sagaMiddleware, loggerMiddleware];
  // redux의 기능을 확장한다는 의미로 enhancer라는 변수를 만들어주었다.
  const enhancer =
    process.env.NODE_ENV === 'production'
      ? compose(applyMiddleware(...middlewares)) // 배포용
      : composeWithDevTools(applyMiddleware(...middlewares)); //개발용, devTools를 사용하여 히스토리 추적 및 분석 가능
  const store = createStore(reducer, enhancer);
  store.sagaTask = sagaMiddleware.run(rootSaga);
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
/*
 state와 reducer를 포함하는 개념이 스토어이다.
*/
