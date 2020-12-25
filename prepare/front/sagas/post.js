import axios from "axios";
import { all, delay, fork, put, takeLatest } from "redux-saga/effects";

function addPostAPI(data) {
  return axios.post("/api/post", data);
}

function* addPost(action) {
  try {
    delay(2000);
    // const result = yield call(addPostAPI, action.data);
    yield put({
      // put() : redux의 dispatch() 함수와 같은 행동을 한다, 액션 객체를 실행 시킨다.
      type: "ADD_POST_SUCCESS",
      // data: result.data,
    });
  } catch (err) {
    yield put({
      type: "ADD_POST_FAIULURE",
      data: err.response.data,
    });
  }
}

function* watchAddPost() {
  yield takeLatest("ADD_POST_REQUEST", addPost);
}

export default function* postSaga() {
  yield all([fork(watchAddPost)]);
}
