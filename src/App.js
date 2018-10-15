import React from 'react';
import { Layout, Menu } from 'antd';
import './App.css';

const { Header, Footer, Content } = Layout;

const App = () => (
  <Layout className="layout">
    <Header>
      <div className="logo">
        <img className="logoimg" alt="logo" src="https://etherscan.io/token/images/metadium2_28.png" />
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['1']}
        style={{ lineHeight: '64px' }}
      >
        <Menu.Item key="1">AA/SP Registry</Menu.Item>
        <Menu.Item key="2">Topic Registry</Menu.Item>
        <Menu.Item key="3">Achievement Registry</Menu.Item>
      </Menu>
    </Header>
    <Content style={{ padding: '0 50px' }}>
      <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>Content</div>
    </Content>
    <Footer style={{ textAlign: 'center' }}>
      metagate ©2018 Created by hexoul
    </Footer>
  </Layout>
);

export default App;
