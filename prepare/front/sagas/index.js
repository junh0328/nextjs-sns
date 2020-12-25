import all, { call, fork, put, take } from "redux-saga/effects";
import axios from "axios";

function loginAPI(data) {
  return axios.post("/api/login", data);
  // 여기서 리턴된 값(action.data)이 logIn()함수에서 만든 result값으로 들어간다.
}

// 더미데이터(사용자의 요청으로 넘어오는 데이터일 것)
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
    // result는 loginAPI에서 리턴된 값(action.data)이다.
    // 여기서 데이터를 넘겨받는 것을 실패할 경우 바로 catch문으로 넘어간다.
    // call( )|함수를 실행한다. (동기 함수 호출), loginAPI의 값을 리턴 받을 때까지 기다렸다가 리턴 받은 값을 넣어준다. (블로킹을 한다.)
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

function addPostAPI(data) {
  return axios.post("/api/post", data);
}

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);
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
    // fork( )|함수를 실행한다. (비동기 함수 호출), 요청을 보내고 결과(data)와 상관없이 바로 다음 함수로 넘어간다. (블로킹을 하지않는다.)
  ]);
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
