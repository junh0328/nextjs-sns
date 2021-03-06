import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';
import AppLayout from '../components/AppLayout';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user); //user 리듀서에서 me 상태를 가져옴
  const { mainPosts, hasMorePost, loadPostsLoading, retweetError } = useSelector((state) => state.post);

  // 리트윗 오류를 잡아주기 위한 useEffect()처리, 오류가 발생했을 때 그것을 alert()로 알려주기 위함
  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
      return null;
    }
  }, [retweetError]);

  useEffect(() => {}, []);
  // componentDidMount와 같이 처음 실행될 때 LOAD_POSTS_REQUEST를 디스패치시키기 위해 useEffect로 감싸주었다.
  // 따라서 처음에는 게시글이 비워져있다가 [] 빈 배열에 의해 virtual DOM이 아무 것도 없다는 것을 감지하고 LOAD_POSTS_REQUEST를 디스패치한다.

  useEffect(() => {
    function onScroll() {
      // console.log(window.scrollY, document.documentElement.clientHeight, document.documentElement.scrollHeight);
      if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
        if (hasMorePost && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePost, loadPostsLoading, mainPosts]);

  return (
    <AppLayout>
      {/* &&연산자, 로그인 상태일 때 PostForm(개인이 포스팅 올리는 컴포넌트)를 보여줘라 */}
      {me && <PostForm />}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  // 서버 사이드 렌더링시 프론트에서 서버에 쿠키를 보내주기 위한 작업

  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  // 그렇지 않을 때는 쿠키를 지워준다.
  if (context.req && cookie) {
    // + 서버일 때, 쿠키가 있을 때만 쿠키를 넘겨주도록 한다.
    axios.defaults.headers.Cookie = cookie;
  }
  console.log(context);
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_POSTS_REQUEST,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
  //sagaTask는 store/configureStore.js에 등록한 sagaTask를 그대로 가져온다
});

// const Home보다 먼저 실행하여 서버에서 데이터를 불러올 수 있도록 사용하는 wrapper의 SSR 기능
// store.dispatch로 실행된 내용들이 리듀서의 HYDRATE로 보내진다.

export default Home;

/*
    AppLayout 컴포넌트 안에 들어 있는 <div>...</div>를 children으로 받는다.
*/
