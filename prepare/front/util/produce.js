/*
immer를 제공하지 않는 IE 구 버전을 위해 만들어 주는 페이지입니다.
*/

import produce, { enableES5 } from 'immer';

export default (...args) => {
  enableES5();
  return produce(...args);
};

// es5를 지원하기 위해 기존 프로듀스 함수를 확장하는 방법이다.
