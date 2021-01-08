/*
profile.js에서 사용되는 닉네임 수정 폼을 컴포넌트로 만듬
*/

import React, { useCallback, useMemo } from 'react';
import { Form, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { CHANGE_NICKNAME_REQUEST } from '../reducers/user';
import useinput from '../hooks/useinput';

const NicknameEditForm = () => {
  const { me } = useSelector((state) => state.user);
  const [nickname, onChangeNickname] = useinput(me?.nickname || '');
  const dispatch = useDispatch();

  const style = useMemo(
    () => ({
      marginBottom: '20px',
      border: '1px solid #d9d9d9',
      padding: '30px',
    }),
    []
  );

  const onsubmit = useCallback(() => {
    dispatch({
      type: CHANGE_NICKNAME_REQUEST,
      data: nickname,
    });
  }, [nickname]);
  return (
    <Form style={style} onFinish={onsubmit}>
      <Input.Search value={nickname} onChange={onChangeNickname} addonBefore="닉네임" enterButton="수정" />
    </Form>
  );
};

export default NicknameEditForm;
