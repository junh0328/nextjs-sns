const initialState = {
  name: 'junhee',
  age: 27,
  pw: 'babo',
};

// 액션 생성 함수, action creator
const changeNickname = (data) => {
  return {
    type: 'CHANGE_NICKNAME',
    data,
  };
};

changeNickname('boogiejun');
/*
{
    type: 'CHANGE_NICKNAME',
    data: 'boogiejun',
}
*/
//   store.dispatch(changeNickname('mighty tak'));

// 리듀서 : (이전 상태(초기값), 액션) => 다음 상태를 만들어 내는 함수
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_NICKNAME':
      return {
        ...state,
        name: action.data,
      };
  }
};

export default rootReducer;
