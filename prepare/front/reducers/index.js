import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';
import user from './user';
import post from './post';

/* 
1.combineReducers를 통해 인덱스 리듀서와, user 리듀서, post 리듀서를 합쳐주었다.
2.리덕스의 SSR을 이용하기 위해 HYDRATE 모듈을 받아왔는데 후에 배움!
3.index라는 리듀서에 HYDRATE라는 case를 추가
*/
const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      console.log('HYDRATE', action);
      return action.payload;
    default: {
      const combinedReducer = combineReducers({
        user,
        post,
      });
      return combinedReducer(state, action);
    }
  }
};

export default rootReducer;

/*
@@ INIT > __NEXT_REDUX_WRAPPER
pages/index.js에서 설정한 서버사이드 렌더링의 결과 여부가 HYDRATE로 넘어온다.
*/
