export const initialState = {
  isLoggingIn: false, // 로그인 시도 중
  isLoggingOut: false, // 로그인 시도 중
  isLoggedIn: false, // 로그인 상태

  me: null,
  signUpData: {},
  loginData: {},
};

export const loginRequestAction = (data) => {
  return {
    type: "LOG_IN_REQUEST",
    data,
  };
};

export const logoutRequestAction = () => {
  return {
    type: "LOG_OUT_REQUEST",
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOG_IN_REQUEST":
      console.log("reducer login");
      return {
        ...state,
        isLoggingIn: true,
      };
    case "LOG_IN_SUCCESS":
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: true,
        me: { ...action.data, nickname: "junhee" },
      };
    case "LOG_IN_FAILURE":
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: false,
      };
    case "LOG_OUT_REQUEST":
      return {
        ...state,
        isLoggingOut: true, // 로그인 시도 중
        me: null,
      };
    case "LOG_OUT_SUCCESS":
      return {
        ...state,
        isLoggingOut: false, // 로그인 시도 중
        isLoggedIn: false,
        me: null,
      };
    case "LOG_OUT_FAILURE":
      return {
        ...state,
        isLoggingOut: false, // 로그인 시도 중
        me: null,
      };
    default:
      return state;
  }
};
export default reducer;

/*
  기존 index 리듀서에 들어있던 user 객체안의 객체들을 분리해주었다. 따라서 깊이가 기존보다 한 단계 높아졌으므로 참조하는 것도 유의해야 한다!
*/
