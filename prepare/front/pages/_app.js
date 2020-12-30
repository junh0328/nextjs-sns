import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import 'antd/dist/antd.css';

import wrapper from '../store/configureStore';
import withReduxSaga from 'next-redux-saga';

const NodeBird = ({ Component }) => (
  <>
    <Head>
      <meta charSet="utf-8" />
      <title>NodeBird</title>
    </Head>
    <Component />
  </>
);

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export function reportWebVitals(metric) {
  console.log(metric);
}

export default wrapper.withRedux(withReduxSaga(NodeBird));

/*
  페이지들의 공통 적용 사항을 적용하는 페이지 (_app.js 가 pages폴더의 페이지들의 부모인 셈이다.)
  >> import 'antd/dist/antd.css' 를 모든 페이지에 적용하기 위함
  각 페이지의 return ( ... ) 안에 담긴 부분이 _app.js의 컴포넌트 props 로 넘어온다.
  props를 주고 받기 때문에 propTypes 모듈을 사용하여 elementType을 관리해준다.
  <> 형식이기 때문에 elementType으로 프로토타입을 설정 및 관리한다.
*/

/*
  import Head from 'next/head';
  html 중 head 태그를 수정하기 위해 불러옴
*/
