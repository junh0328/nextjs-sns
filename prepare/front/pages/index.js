import React from 'react';
import { useSelector } from 'react-redux';
import AppLayout from '../components/AppLayout';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';

const Home = () => {
  const { isLoggedin } = useSelector((state) => state.user); //user 리듀서에서 isLoggedIn 상태를 가져옴
  const { mainPosts } = useSelector((state) => state.post);
  return (
    <AppLayout>
      {isLoggedin && <PostForm />}
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
