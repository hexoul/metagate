import React from 'react';
import { Layout, Menu } from 'antd';
import { User, Topic, Achievement } from './components';

// Styles.
import './App.css';

// Web3.
import web3config from './ethereum/web3-config.json';

// Contracts.
import { getContractsAddresses, Identity, IdentityManager, TopicRegistry, AchievementManager } from './ethereum/contracts';

class App extends React.Component {
  state = {
    nav: '1',
    contractReady: false,
  };

  contracts = {
    identity: new Identity(),
    identityManager: new IdentityManager(),
    topicRegistry: new TopicRegistry(),
    achievementManager: new AchievementManager()
  };

  async initContracts() {
    await getContractsAddresses(web3config.netid);
    Promise.all(Object.values(this.contracts).map(async (contract) => { await contract.init() }))
      .then(() => { this.setState({contractReady: true}) });
  }

  constructor(props) {
    super(props);
    this.initContracts();
  }

  onMenuClick = ({key}) => {
    this.setState({nav: key});
  }

  getContent() {
    if (! this.state.contractReady) return;
    switch (this.state.nav) {
      case '1': return <User contracts={this.contracts} />;
      case '2': return <Topic contracts={this.contracts} />;
      case '3': return <Achievement contracts={this.contracts} />;
      default: return;
    }
  }

  render() {
    return (
      <Layout className='layout'>
        <Layout.Header>
          <div className='logo'>
            <img className='logoimg' alt='logo' src='https://github.com/METADIUM/metadium-token-contract/blob/master/misc/Metadium_Logo_Vertical_PNG.png?raw=true' />
          </div>
          <Menu
            theme='dark'
            mode='horizontal'
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
            onClick={this.onMenuClick}
          >
            <Menu.Item key='1'>AA/SP Registry</Menu.Item>
            <Menu.Item key='2'>Topic Registry</Menu.Item>
            <Menu.Item key='3'>Achievement Registry</Menu.Item>
          </Menu>
        </Layout.Header>
        <Layout.Content style={{ padding: '5vh 5vw 0vh 5vw', backgroundColor: '#fff' }}>
          {this.getContent()}
        </Layout.Content>
        <Layout.Footer>
          <div style={{ textAlign: 'right' }}>
            FAQ | Customer service :&nbsp;
            <a href='mailto:contact@metadium.com' target='_blank' rel='noopener noreferrer'>contact@metadium.com</a>
          </div>
          <br />
          <center>metagate ©2018 Created by hexoul</center>
        </Layout.Footer>
      </Layout>
    );
  }
}

export default App;
