import Head from 'next/head';
import React from 'react';
import AppLayout from '../components/AppLayout';

const Signup = () => {
  return (
    <>
      <Head>
        <title>회원가입 | NodeBird</title>
      </Head>
      <AppLayout>회원가입 페이지</AppLayout>
    </>
  );
};

export default Signup;
