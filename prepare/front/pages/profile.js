import Head from 'next/head';
import React, { useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';
import { useSelector } from 'react-redux';
import { Router } from 'next/router';

const Profile = () => {
  const { me } = useSelector((state) => state.user);

  // 로그인을 하지 않은 채로 프로필 페이지로 넘어온다면 해당 요청을 다시 인덱스 페이지로 넘겨주는 코드
  useEffect(() => {
    if (!(me && me.id)) {
      Router.push('/');
    }
  }, [me && me.id]);

  if (!me) {
    return null;
  }
  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉" data={me.Followings} />
        <FollowList header="팔로워" data={me.Followers} />
      </AppLayout>
    </>
  );
};

export default Profile;
