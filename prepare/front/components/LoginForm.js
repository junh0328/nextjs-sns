import React, { useCallback } from 'react';
import { Form, Button, Input } from 'antd';
import Link from 'next/Link';
import styled from 'styled-components';
import useinput from '../hooks/useinput';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequestAction } from '../reducers/user';

const ButtonWrapper = styled.div`
  margin-top: 10px;
`;
const FormWrapper = styled(Form)`
  padding: 10px;
`;

const LoginForm = () => {
  const dispatch = useDispatch();
  // 더미(가짜) 데이터로 그냥 아이디와 비밀번호가 넘어오는 상태를 관리한다.
  const { logInLoading } = useSelector((state) => state.user);
  const [email, onChangeEmail] = useinput('');
  const [password, onChangePassword] = useinput('');

  const onSubmitForm = useCallback(() => {
    console.log(email, password);
    dispatch(loginRequestAction({ email, password }));
  }, [email, password]);

  return (
    //   onFinish에는 자동으로 e.preventDefault()가 적용이 되있다.
    <FormWrapper onFinish={onSubmitForm}>
      <div>
        <label htmlFor="user-email">이메일</label>
        <br />
        <Input name="user-email" type="text" value={email} onChange={onChangeEmail} required />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input name="user-password" type="password" value={password} onChange={onChangePassword} required />
      </div>
      <ButtonWrapper>
        <Button type="primary" htmlType="submit" loading={logInLoading}>
          로그인
        </Button>
        <Link href="/signup">
          <a>
            <Button>회원가입</Button>
          </a>
        </Link>
      </ButtonWrapper>
    </FormWrapper>
  );
};

export default LoginForm;
