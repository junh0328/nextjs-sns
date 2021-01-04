import produce from 'immer';

export const initialState = {
  followLoading: false, // 팔로우 시도 중
  followDone: false, // 팔로우 완료
  followError: null, // 팔로우 에러

  unfollowLoading: false, //언팔로우 시도 중
  unfollowDone: false, // 언팔로우 완료
  unfollowError: null, // 언팔로우 에러

  logInLoading: false, // 로그인 시도 중
  logInDone: false, // 로그인 완료
  logInError: null, // 로그인 에러

  logOutLoading: false, // 로그아웃 시도 중
  logOutDone: false, // 로그아웃 완료
  logOutError: null, // 로그아웃 에러

  SignUpLoading: false, // 회원가입 시도 중
  SignUpDone: false, // 회원가입 완료 중
  SignUpError: null, // 회원가입 에러

  changeNicknameLoading: false, // 닉네임 변경 시도 중
  changeNicknameDone: false,
  changeNicknameError: null,

  me: null,
  signUpData: {},
  loginData: {},
};

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const CHANGE_NICKNAME_REQUEST = 'CHANGE_NICKNAME_REQUEST';
export const CHANGE_NICKNAME_SUCCESS = 'CHANGE_NICKNAME_SUCCESS';
export const CHANGE_NICKNAME_FAILURE = 'CHANGE_NICKNAME_FAILURE';

export const FOLLOW_REQUEST = 'FOLLOW_REQUEST';
export const FOLLOW_SUCCESS = 'FOLLOW_SUCCESS';
export const FOLLOW_FAILURE = 'FOLLOW_FAILURE';

export const UNFOLLOW_REQUEST = 'UNFOLLOW_REQUEST';
export const UNFOLLOW_SUCCESS = 'UNFOLLOW_SUCCESS';
export const UNFOLLOW_FAILURE = 'UNFOLLOW_FAILURE';

// 게시글을 썼다 지웠다를 할 때 생기는 상태(고유 id)를 관리하기 위해서 액션을 만들어 준다.
export const ADD_POST_TO_ME = 'ADD_POST_TO_ME;';
export const REMOVE_POST_OF_ME = 'REMOVE_POST_OF_ME';

const dummyUser = (data) => ({
  ...data,
  nickname: '준희',
  id: 1,
  Posts: [{ id: 1 }],
  Followings: [{ nickname: '곽병현' }, { nickname: '김연후' }, { nickname: '최광훈' }],
  Followers: [{ nickname: '곽병현' }, { nickname: '김연후' }, { nickname: '김승훈' }, { nickname: '최광록' }],
});

export const loginRequestAction = (data) => {
  return {
    type: LOG_IN_REQUEST,
    data,
  };
};

export const logoutRequestAction = () => {
  return {
    type: LOG_OUT_REQUEST,
  };
};

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    // const reducer = (state = initialState, action) => produce(state, (draft) => {}); 위와 같이 화살표 함수 뒤에 바로 붙는 함수는 return이 생략된 것이다! 🌟
    switch (action.type) {
      case FOLLOW_REQUEST:
        draft.followLoading = true;
        draft.followDone = false;
        draft.followError = action.error;
        break;
      case FOLLOW_SUCCESS:
        draft.followLoading = false;
        draft.me.Followings.push({ id: action.data });
        draft.followDone = true;
        break;
      case FOLLOW_FAILURE:
        draft.followLoading = false;
        draft.followError = action.error;
        break;
      case UNFOLLOW_REQUEST:
        draft.unfollowLoading = true;
        draft.unfollowDone = false;
        draft.unfollowError = action.error;
        break;
      case UNFOLLOW_SUCCESS:
        draft.unfollowLoading = false;
        draft.me.Followings = draft.me.Followings.filter((v) => v.id !== action.data);
        draft.unfollowDone = true;
        break;
      case UNFOLLOW_FAILURE:
        draft.unfollowLoading = false;
        draft.unfollowError = action.error;
        break;
      case LOG_IN_REQUEST:
        draft.logInLoading = true;
        draft.logInDone = false;
        draft.logInError = action.error;
        break;
      case LOG_IN_SUCCESS:
        draft.logInLoading = false;
        draft.me = action.data; //dummyUser(action.data)에서 실제 데이터로 변경
        draft.logInDone = true;
        break;
      /*
        return {
          ...state,
          logInLoading: false,
          logInDone: true,
          me: dummyUser(action.data),
        };
        */
      case LOG_IN_FAILURE:
        draft.logInLoading = false;
        draft.logInError = action.error;
        break;
      case LOG_OUT_REQUEST:
        draft.logOutLoading = true;
        draft.logOutDone = false;
        draft.logOutError = action.error;
        break;
      case LOG_OUT_SUCCESS:
        draft.logOutLoading = false;
        draft.me = null;
        draft.logOutDone = true;
        break;
      case LOG_OUT_FAILURE:
        draft.logOutLoading = false;
        draft.logOutError = action.error;
        break;
      case SIGN_UP_REQUEST:
        draft.signUpLoading = true;
        draft.signUpDone = false;
        draft.signUpError = action.error;
        break;
      case SIGN_UP_SUCCESS:
        draft.signUpLoading = false;
        draft.signUpDone = true;
        break;
      case SIGN_UP_FAILURE:
        draft.signUpLoading = false;
        draft.signUpError = action.error;
        break;
      case CHANGE_NICKNAME_REQUEST:
        draft.changeNicknameLoading = true;
        draft.changeNicknameDone = false;
        draft.changeNicknameError = action.error;
        break;
      case CHANGE_NICKNAME_SUCCESS:
        draft.changeNicknameLoading = false;
        draft.changeNicknameDone = true;
        break;
      case CHANGE_NICKNAME_FAILURE:
        draft.changeNicknameLoading = false;
        draft.changeNicknameError = action.error;
        break;
      case ADD_POST_TO_ME:
        /*
        return {
          ...state,
          me: {
            ...state.me,
            Posts: [{ id: action.data }, ...state.me.Posts],
          },
        };
         */
        draft.me.Posts.unshift({ id: action.data });
        break;
      case REMOVE_POST_OF_ME:
        /*
        return {
          ...state,
          me: {
            ...state.me,
            Posts: state.me.Posts.filter((v) => v.id !== action.data),
          },
        };
         */
        drafte.me.Posts = draft.me.Posts.filter((v) => v.id !== action.data);
        break;
      default:
        break;
    }
  });

export default reducer;

/*
  기존 index 리듀서에 들어있던 user 객체안의 객체들을 분리해주었다. 따라서 깊이가 기존보다 한 단계 높아졌으므로 참조하는 것도 유의해야 한다!
*/
