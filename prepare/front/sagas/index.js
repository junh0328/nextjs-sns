import all, { call, fork, put, take } from "redux-saga/effects";
import axios from "axios";

function loginAPI(data) {
  return axios.post("/api/login", data);
}

const l = logIn({ type: "LOG_IN_REQUEST", data: { id: "junh0328@naver.com" } });
l.next();
// const result = yield call(loginAPI, action.data); 까지 실행
l.next();
/*
  성공 여부에 따라 성공시 실행
  
    yield put({
      // put() : redux의 dispatch() 함수와 같은 행동을 한다, 액션 객체를 실행 시킨다.
      type: "LOG_IN_SUCCESS",
      data: result.data,
    });
*/

function* logIn(action) {
  try {
    const result = yield call(loginAPI, action.data);
    yield put({
      // put() : redux의 dispatch() 함수와 같은 행동을 한다, 액션 객체를 실행 시킨다.
      type: "LOG_IN_SUCCESS",
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: "LOG_IN_FAIULURE",
      data: err.response.data,
    });
  }
}

function logOutAPI() {
  return axios.post("/api/logout");
}

function* logOut() {
  try {
    const result = yield call(logOutAPI);
    yield put({
      // put() : redux의 dispatch() 함수와 같은 행동을 한다, 액션 객체를 실행 시킨다.
      type: "LOG_OUT_SUCCESS",
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: "LOG_OUT_FAIULURE",
      data: err.response.data,
    });
  }
}

function addPostAPI() {
  return axios.post("/api/post");
}

function* addPost() {
  try {
    const result = yield call(addPostAPI);
    yield put({
      // put() : redux의 dispatch() 함수와 같은 행동을 한다, 액션 객체를 실행 시킨다.
      type: "ADD_POST_SUCCESS",
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: "ADD_POST_FAIULURE",
      data: err.response.data,
    });
  }
}

function* watchLogin() {
  yield take("LOG_IN_REQUEST", logIn);
  // take(액션) : LOG_IN 이라는 액션이 실행될 때까지 기다리겠다.
}

function* watchLogOut() {
  yield take("LOG_OUT_REQUEST", logOut);
}

function* watchAddPost() {
  yield take("ADD_POST_REQUEST", addPost);
}
export default function* rootSaga() {
  yield all([
    // all : 리덕스 사가의 이팩트로, yield에서 배열을 받는다. 그 배열안에 들어있는 함수를 한번에 실행해준다.
    // fork: 비동기 함수를 실행한다. 결과 값을 받아올 때까지 기다리지 않고 바로 다음 행동을 실행한다.
    // call: 동기 함수를 실행시킨다. 로그인이라고 가정할 때 로그인 api가 리턴할 떄까지 기다려서 그 결과를 .then() 를 통해 표현해줘야 한다.
    fork(watchLogin), // <-> call  call(watchLogin),
    fork(watchLogOut),
    fork(watchAddPost),
  ]);
}

/*
saga 사용법
rootSaga를 만들어 놓고 사용하고자 하는 비동기 함수들을 적어준다. (fork, call, put, ...)

1. 이벤트 리스너를 만든다. ex function* watchLogin(){ ... }.
2. rootSaga에서 all 함수를 통해 만든 함수들을 등록한다.
3. watchLogin() 함수가 실행되면 logIn() 함수로 넘어간다.
4. 요청 성공 여부에 따라 try, catch 나누어 결과값을 보여준다.
5. 
*/
