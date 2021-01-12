import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from '../components/AppLayout';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';

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

  useEffect(() => {
    dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    dispatch({
      type: LOAD_POSTS_REQUEST,
    });
  }, []);
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

export default Home;

/*
    AppLayout 컴포넌트 안에 들어 있는 <div>...</div>를 children으로 받는다.
*/
