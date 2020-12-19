import React from "react";
import PropTypes from "prop-types";
import Link from "next/Link";
import { Menu, Input, Row, Col } from "antd";
import "antd/dist/antd.css";
import styled from "styled-components";

import UserProfile from "../components/UserProfile";
import LoginForm from "../components/LoginForm";

import { useSelector } from "react-redux";

const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;

const AppLayout = ({ children }) => {
  const isLoggedin = useSelector((state) => state.user.isLoggedin);

  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item>
          <Link href="/">
            <a>노드버드</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/profile">
            <a>프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <SearchInput enterButton />
        </Menu.Item>
        <Menu.Item>
          <Link href="/signup">
            <a>회원가입</a>
          </Link>
        </Menu.Item>
      </Menu>
      <Row gutter={8}>
        {/* gutter: 컬럼 사이의 간격 */}
        {/* n/24라고 생각하기 24가 100% 이므로 md 6 은 25% */}
        <Col xs={24} md={6}>
          {isLoggedin ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <a
            href="https://github.com/junh0328"
            target="_blank"
            rel="noreferrer noopener"
          >
            Made by JunHee
          </a>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
  /* 
    여기서 노드는 return 안에 들아가는 리액트의 노드이다.
    children으로 들어가게 되는 props들과 jsx를 관리하기 위해서 PropTypes 모듈을 다운받아 사용한다.
*/
};

export default AppLayout;
