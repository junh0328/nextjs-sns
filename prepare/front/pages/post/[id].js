// post/[id].js

import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { END } from 'redux-saga';

import wrapper from '../../store/configureStore';
import { LOAD_POST_REQUEST } from '../../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import AppLayout from '../../components/AppLayout';
import PostCard from '../../components/PostCard';
import Head from 'next/head';

const Post = () => {
  const { singlePost } = useSelector((state) => state.post);

  console.log('singlePost는? ', singlePost);
  return (
    <AppLayout>
      <Head>
        <title>{singlePost.User.nickname}님의 글</title>
        <meta name="description" content={singlePost.content} />
        <meta property="og:description" content={singlePost.content} />
        <meta property="og:image" content={singlePost.Images[0] ? singlePost.Images[0].src : 'https://nodebird.com/favicon.ico'} />
      </Head>
      <PostCard post={singlePost} />
    </AppLayout>
  );
};
/* 
- getServerSideProps와 같이 쓰는 getStaticPaths는 정적으로 params.id를 미리 지정해 줘야 사용 가능한 SSR 다이나믹 라우팅 기법이다.
- id > 즉 post 갯수를 사전에 모두 만들 수 없기 때문에, 규모가 커질수록 getStaticPaths()는 사용하지 않는다.

  export async function getStaticPaths() {
    return {
      paths: [
        { params: { id: '1' } },
        { params: { id: '2' } },
        { params: { id: '3' } },
        { params: { id: '4' } },
      ],
      fallback: true,
    };
  }

 */

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  console.log('getServerSideProps start!');
  console.log(context.req.headers);
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_POST_REQUEST,
    data: context.params.id,
  });
  context.store.dispatch(END);
  console.log('getServerSideProps end!');
  await context.store.sagaTask.toPromise();
});

export default Post;

/*
getServerSideProps와 같은 SSR 상황에서 dispatch 액션을 통해 데이터를 보내줄 때는
data: context.params.id 와 같은 형식으로 context를 사용하여 보내줍니다.
*/
