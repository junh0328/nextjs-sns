import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/Link';
import { Menu } from 'antd';
import 'antd/dist/antd.css';

const AppLayout = ({ children }) => {
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
          <Link href="/signup">
            <a>회원가입</a>
          </Link>
        </Menu.Item>
      </Menu>
      {children}
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
