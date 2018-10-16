import React from 'react';
import { Layout, Menu } from 'antd';
import { User, Topic, Achievement } from './components';

// Styles.
import './App.css';

// Web3.
import web3config from './ethereum/web3-config.json';

// Contracts.
import { getContractsAddresses, Identity, TopicRegistry, AchievementManager } from './ethereum/contracts';

class App extends React.Component {
  state = {
    nav: '1'
  };

  async initContracts() {
    await getContractsAddresses(web3config.netid);
    this.identity = new Identity();
    await this.identity.init();
  }

  constructor(props) {
    super(props);
    this.initContracts();
  }

  onMenuClick = ({key}) => {
    this.setState({nav: key});
  }

  render() {
    return (
      <Layout className="layout">
        <Layout.Header>
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
        </Layout.Header>
        <Layout.Content style={{ padding: '0 50px' }}>
          {this.state.nav === '1' && <User />}
          {this.state.nav === '2' && <Topic />}
          {this.state.nav === '3' && <Achievement />}
        </Layout.Content>
        <Layout.Footer style={{ textAlign: 'center' }}>
          metagate ©2018 Created by hexoul
        </Layout.Footer>
      </Layout>
    );
  }
}

export default App;
