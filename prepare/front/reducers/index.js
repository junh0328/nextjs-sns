import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  user: {
    isloggedIn: false,
    user: null,
    signUpData: {},
    loginData: {},
  },
  post: {
    mainPosts: [],
  },
};

export const loginAction = (data) => {
  return {
    type: "LOG_IN",
    data,
  };
};

export const logoutAction = () => {
  return {
    type: "LOG_OUT",
  };
};

// 리듀서 : (이전 상태(초기값), 액션) => 다음 상태를 만들어 내는 함수
// 스스로 행동하지 못하며, 디스패치에 의해 발생된 액션을 처리하는 함수가 리듀서이다.
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      console.log("HYDRATE", action);
      return {
        ...state,
        ...action.payload,
      };
    case "LOG_IN":
      return {
        ...state,
        user: {
          ...state.user,
          isloggedIn: true,
          user: action.data,
        },
      };
    case "LOG_OUT":
      return {
        ...state,
        user: {
          ...state.user,
          isloggedIn: false,
          user: null,
        },
      };
    default:
      return {
        ...state,
      };
  }
};

export default rootReducer;
