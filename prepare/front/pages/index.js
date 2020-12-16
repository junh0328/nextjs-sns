import React from 'react';
import AppLayout from '../components/AppLayout';

const Home = () => {
  return (
    <AppLayout>
      <div>Hello, Next!</div>
    </AppLayout>
  );
};

export default Home;

/*
    AppLayout 컴포넌트 안에 들어 있는 <div>...</div>를 children으로 받는다.
*/
