import axios from 'axios';
import { all, delay, fork, put, takeLatest, throttle } from 'redux-saga/effects';
import shortid from 'shortid';

import {
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  ADD_POST_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_FAILURE,
  REMOVE_POST_REQUEST,
  REMOVE_POST_SUCCESS,
  REMOVE_POST_FAILURE,
  LOAD_POSTS_REQUEST,
  LOAD_POSTS_SUCCESS,
  LOAD_POSTS_FAILURE,
  generateDummyPost,
} from '../reducers/post';
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user';

function loadPostSAPI(data) {
  return axios.get('/api/posts', data);
}

function* loadPosts(action) {
  try {
    // const result = yield call(loadPostAPI, action.data);
    delay(1000);
    yield put({
      type: LOAD_POSTS_SUCCESS,
      data: generateDummyPost(10),
    });
  } catch (err) {
    yield put({
      type: LOAD_POSTS_FAILURE,
      data: err.response.data,
    });
  }
}

function addPostAPI(data) {
  return axios.post('/api/post', data);
}

function* addPost(action) {
  try {
    delay(1000);
    // const result = yield call(addPostAPI, action.data);
    const id = shortid.generate(); // 기존 포스트 성공 시에 넘겨받는 데이터에 id가 포함되어있지 않았으므로 add_post_success를 성공하면 생기는 데이터의 형식을 변경하여 id를 받아올 것이다.
    yield put({
      type: ADD_POST_SUCCESS,
      data: {
        id,
        content: action.data,
      },
    });
    // 위에 만든 아이디를 통해 비동기적으로 post를 성공했다는 액션을 보내며 아이디를 받는 액션또한 실행한다.
    yield put({
      type: ADD_POST_TO_ME,
      data: id,
    });
  } catch (err) {
    yield put({
      type: ADD_POST_FAILURE,
      data: err.response.data,
    });
  }
}

function removePostAPI(data) {
  return axios.delete('/api/remove', data);
}

function* removePost(action) {
  try {
    delay(1000);
    yield put({
      type: REMOVE_POST_SUCCESS,
      data: action.data,
    });
    // 위에 만든 아이디를 통해 비동기적으로 post를 성공했다는 액션을 보내며 아이디를 받는 액션또한 실행한다.
    yield put({
      type: REMOVE_POST_OF_ME,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: REMOVE_POST_FAILURE,
      data: err.response.data,
    });
  }
}

function addCommentAPI(data) {
  return axios.post('/api/post/${data.postId}/comment', data);
}

function* addComment(action) {
  try {
    // const result = yield call(addCommentAPI, action.data);
    delay(1000);
    yield put({
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

function* watchLoadPosts() {
  yield throttle(2000, LOAD_POSTS_REQUEST, loadPosts);
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

export default function* postSaga() {
  yield all([fork(watchAddPost), fork(watchLoadPosts), fork(watchAddComment), fork(watchRemovePost)]);
}
