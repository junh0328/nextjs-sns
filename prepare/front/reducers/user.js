export const initialState = {
  isLoggedin: false,
  user: null,
  signUpData: {},
  loginData: {},
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

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOG_IN":
      return {
        user: {
          ...state,
          isLoggedin: true,
          user: action.data,
        },
      };
    case "LOG_OUT":
      return {
        user: {
          ...state,
          isLoggedin: false,
          user: null,
        },
      };
    default:
      return state;
  }
};
export default reducer;

/*
  기존 index 리듀서에 들어있던 user 객체안의 객체들을 분리해주었다. 따라서 깊이가 한단계 더 낮아졌으므로 참조하는 것도 유의해야 한다!
*/
