import axios from 'axios';
import { all, call, delay, fork, put, takeLatest } from 'redux-saga/effects';

import {
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  LOG_OUT_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
  FOLLOW_REQUEST,
  FOLLOW_SUCCESS,
  FOLLOW_FAILURE,
  UNFOLLOW_REQUEST,
  UNFOLLOW_SUCCESS,
  UNFOLLOW_FAILURE,
} from '../reducers/user';

function loginAPI(data) {
  return axios.post('/api/login', data);
  // 여기서 리턴된 값(action.data)이 logIn()함수에서 만든 result값으로 들어간다.
}

function* logIn(action) {
  try {
    console.log('saga login');
    yield delay(1000);
    // const result = yield call(loginAPI, action.data);
    // result는 loginAPI에서 리턴된 값(action.data)이다.
    // 여기서 데이터를 넘겨받는 것을 실패할 경우 바로 catch문으로 넘어간다.
    // call( )|함수를 실행한다. (동기 함수 호출), loginAPI의 값을 리턴 받을 때까지 기다렸다가 리턴 받은 값을 넣어준다. (블로킹을 한다.)
    yield put({
      // put() : redux의 dispatch() 함수와 같은 행동을 한다, 액션 객체를 실행 시킨다.
      type: LOG_IN_SUCCESS,
      data: action.data,
      // dispatch 에서 액션되었을때 넘겨받는 데이터
    });
  } catch (err) {
    yield put({
      type: LOG_IN_FAILURE,
      error: err.response.data,
    });
  }
}

function logOutAPI() {
  return axios.post('/api/logout');
}

function* logOut() {
  try {
    delay(1000);
    // const result = yield call(logOutAPI);
    yield put({
      // put() : redux의 dispatch() 함수와 같은 행동을 한다, 액션 객체를 실행 시킨다.
      type: LOG_OUT_SUCCESS,
      // data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOG_OUT_FAILURE,
      error: err.response.data,
    });
  }
}

function followAPI(data) {
  return axios.post('/api/login', data);
}

function* follow(action) {
  try {
    yield delay(1000);
    yield put({
      type: FOLLOW_SUCCESS,
      data: action.data,
      /*
        dispatch({
        type: UNFOLLOW_REQUEST,
        data: post.User.id,
      });
      여기서 data: action.data로 받아오는 데이터는 post.User.id 즉 포스트를 쓴 유저의 아이디이다.
      */
    });
  } catch (err) {
    yield put({
      type: FOLLOW_FAILURE,
      error: err.response.data,
    });
  }
}
function unfollowAPI(data) {
  return axios.post('/api/login', data);
}

function* unfollow(action) {
  try {
    yield delay(1000);
    yield put({
      type: UNFOLLOW_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: UNFOLLOW_FAILURE,
      error: err.response.data,
    });
  }
}

function signUpAPI(data) {
  return axios.post('http://localhost:3065/user', data);
}

function* signUp(action) {
  // signup page에서 submit 버튼을 누를시(액션) 넘어오는 데이터(data)를 result에 저장한다. (action.data) 이 데이터를 동시에 signUpAPI로 보내 axio.post로 백엔드 서버에 라우팅된 주소로 데이터(data)를 넘겨준다.
  // 데이터 안에는 { email, nickname, password } 가 들어있다.
  try {
    const result = yield call(signUpAPI, action.data);
    console.log(result);
    yield put({
      // put() : redux의 dispatch() 함수와 같은 행동을 한다, 액션 객체를 실행 시킨다.
      type: SIGN_UP_SUCCESS,
      // data: result.data,
    });
  } catch (err) {
    yield put({
      type: SIGN_UP_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchFollow() {
  yield takeLatest(FOLLOW_REQUEST, follow);
}

function* watchUnfollow() {
  yield takeLatest(UNFOLLOW_REQUEST, unfollow);
}

function* watchLogin() {
  yield takeLatest(LOG_IN_REQUEST, logIn);
  // take(액션) : LOG_IN 이라는 액션이 실행될 때까지 기다리겠다.
}

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}
function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga() {
  yield all([fork(watchFollow), fork(watchUnfollow), fork(watchLogin), fork(watchLogOut), fork(watchSignUp)]);
}

/*
saga 사용법
rootSaga를 만들어 놓고 사용하고자 하는 비동기 함수들을 적어준다. (fork, call, put, ...)
login 기능을 사용한다는 가정
1. 이벤트 리스너를 만든다. ex function* watchLogin(){ ... }.
2. rootSaga에서 all 함수를 통해 만든 함수들을 등록한다.
3. 로그인 요청 발생시, 루트 사가에서 wathchLogin 함수를 실행한다.
4. watchLogin() 함수가 실행되면 logIn() 함수로 넘어간다.
5. logIn() 함수를 실행하면서 call 함수를 통해 loginAPI를 실행하고 리턴값을 result에 담는다.
6. 만일 실패할 경우 바로 catch문으로 넘어가 err를 보여주고, 아닐 경우 try문을 수행한다.
7. LOG_IN_SUCCESS 라는 타입과 더불어 loginAPI에서 받은 성공한 데이터를 저장한다.

|fork( )|함수를 실행한다. (비동기 함수 호출), 요청을 보내고 결과(data)와 상관없이 바로 다음 함수로 넘어간다. (블로킹을 하지않는다.) |
|call( )|함수를 실행한다. (동기 함수 호출), loginAPI의 값을 리턴 받을 때까지 기다렸다가 리턴 받은 값을 넣어준다. (블로킹을 한다.)|
*/
