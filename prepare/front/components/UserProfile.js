import React, { useCallback } from "react";
import { Button, Card, Avatar } from "antd";
import { useDispatch, useSelector } from "react-redux";

import { logoutRequestAction } from "../reducers/user";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { me, isLogginOut } = useSelector((state) => state.user);

  const onLogOut = useCallback(() => {
    dispatch(logoutRequestAction());
  }, []);
  return (
    <Card
      actions={[
        <div key="twit">
          {/* 트윗 수 */}
          짹짹
          <br />0
        </div>,
        <div key="followings">
          팔로잉
          <br />0
        </div>,
        <div key="followings">
          팔로워
          <br />0
        </div>,
      ]}
    >
      <Card.Meta
        avatar={<Avatar>{me.nickname[0]}</Avatar>}
        title={me.nickname}
      />
      <Button onClick={onLogOut} loading={isLogginOut}>
        로그아웃
      </Button>
    </Card>
  );
};

export default UserProfile;
