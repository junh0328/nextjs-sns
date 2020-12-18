/*
profile.js에서 사용되는 닉네임 수정 폼을 컴포넌트로 만듬
*/

import React, { useMemo } from 'react';
import { Form, Input } from 'antd';

const NicknameEditForm = () => {
  const style = useMemo(
    () => ({
      marginBottom: '20px',
      border: '1px solid #d9d9d9',
      padding: '30px',
    }),
    []
  );
  return (
    <Form style={style}>
      <Input.Search addonBefore="닉네임" enterButton="수정" />
    </Form>
  );
};

export default NicknameEditForm;
