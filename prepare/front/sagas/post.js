import axios from "axios";
import { all, delay, fork, put, takeLatest } from "redux-saga/effects";

import {
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  ADD_POST_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_FAILURE,
} from "../reducers/post";

function addPostAPI(data) {
  return axios.post("/api/post", data);
}

function* addPost(action) {
  try {
    delay(1000);
    // const result = yield call(addPostAPI, action.data);
    yield put({
      // put() : redux의 dispatch() 함수와 같은 행동을 한다, 액션 객체를 실행 시킨다.
      type: ADD_POST_SUCCESS,
      // data: result.data,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: ADD_POST_FAILURE,
      data: err.response.data,
    });
  }
}

function addCommentAPI(data) {
  return axios.post("/api/post/${data.postId}/comment", data);
}

function* addComment(action) {
  try {
    delay(1000);
    // const result = yield call(addCommentAPI, action.data);
    yield put({
      // put() : redux의 dispatch() 함수와 같은 행동을 한다, 액션 객체를 실행 시킨다.
      type: ADD_COMMENT_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: ADD_COMMENT_FAILURE,
      data: err.response.data,
    });
  }
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

export default function* postSaga() {
  yield all([fork(watchAddPost), fork(watchAddComment)]);
}
