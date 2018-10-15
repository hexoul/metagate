import React from 'react';
import { Layout, Menu } from 'antd';
import './App.css';

import { User, Topic, Achievement } from './components';

const { Header, Footer, Content } = Layout;

class App extends React.Component {
  state = {
    nav: '1'
  };

  onMenuClick = ({key}) => {
    this.setState({nav: key});
  }

  render() {
    return (
      <Layout className="layout">
        <Header>
          <div className="logo">
            <img className="logoimg" alt="logo" src="https://github.com/METADIUM/metadium-token-contract/blob/master/misc/Metadium_Logo_Vertical_PNG.png?raw=true" />
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
            onClick={this.onMenuClick}
          >
            <Menu.Item key="1">AA/SP Registry</Menu.Item>
            <Menu.Item key="2">Topic Registry</Menu.Item>
            <Menu.Item key="3">Achievement Registry</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          {this.state.nav === '1' && <User />}
          {this.state.nav === '2' && <Topic />}
          {this.state.nav === '3' && <Achievement />}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          metagate ©2018 Created by hexoul
        </Footer>
      </Layout>
    );
  }
}

export default App;
