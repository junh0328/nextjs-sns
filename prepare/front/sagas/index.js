import { all, fork } from 'redux-saga/effects';
import axios from 'axios';

import postSaga from './post';
import userSaga from './user';
import { backUrl } from '../config/config';

axios.defaults.baseURL = backUrl;
//baseURL을 3065로 줬기 때문에 axios로 서버에 데이터 전달시 포트번호를 붙여주지 않아도 된다
axios.defaults.withCredentials = true;

export default function* rootSaga() {
  yield all([
    fork(postSaga), // <-> call  call(watchLogin),
    fork(userSaga),
  ]);
}
