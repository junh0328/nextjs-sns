import { HYDRATE } from "next-redux-wrapper";
import { combineReducers } from "redux";
import user from "./user";
import post from "./post";

// 리듀서 : (이전 상태(초기값), 액션) => 다음 상태를 만들어 내는 함수
// 스스로 행동하지 못하며, 디스패치에 의해 발생된 액션을 처리하는 함수가 리듀서이다.
const rootReducer = combineReducers({
  index: (state = {}, action) => {
    switch (action.type) {
      case HYDRATE:
        console.log("HYDRATE", action);
        return { ...state, ...action.payload };
      default:
        return state;
    }
  },
  user,
  post,
});

export default rootReducer;
