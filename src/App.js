import React from 'react';
import { Layout, Menu, message } from 'antd';
import { User, Topic, Achievement, FAQ, Splash } from './components';

// Styles.
import './App.css';

// Web3.
import web3config from './ethereum/web3-config.json';

// Contracts.
import { getContractsAddresses, Identity, IdentityManager, TopicRegistry, AchievementManager, AttestationAgencyRegistry } from './ethereum/contracts';

class App extends React.Component {

  state = {
    nav: 'splash',
    contractReady: false,
  };

  contracts = {
    identity: new Identity(),
    identityManager: new IdentityManager(),
    topicRegistry: new TopicRegistry(),
    achievementManager: new AchievementManager(),
    aaRegistry: new AttestationAgencyRegistry(),
  };

  async initContracts() {
    await getContractsAddresses(web3config.netid);
    Promise.all(Object.values(this.contracts).map(async (contract) => { await contract.init() }))
      .then(() => this.setState({ contractReady: true }));
  }

  constructor(props) {
    super(props);

    message.config({
      top: 30,
      duration: 2,
      maxCount: 6,
    });

    this.initContracts();
  }

  onMenuClick = ({ key }) => {
    this.setState({ nav: key });
  }

  moveToFAQ = () => this.setState({ nav: 'faq' });

  getContent() {
    if (! this.state.contractReady) return;
    switch (this.state.nav) {
      case '1': return <User contracts={this.contracts} />;
      case '2': return <Topic contracts={this.contracts} moveToFAQ={this.moveToFAQ} />;
      case '3': return <Achievement contracts={this.contracts} moveToFAQ={this.moveToFAQ} />;
      case 'splash': return <Splash onClick={() => this.setState({ nav: 'faq' })}/>;
      case 'faq': return <FAQ />;
      default: return;
    }
  }

  render() {
    return (
      <Layout className='layout'>
        <Layout.Header>
          <div className='logo'>
            <img
              className='logoimg'
              alt='logo'
              src='https://github.com/METADIUM/metadium-token-contract/blob/master/misc/Metadium_Logo_Vertical_PNG.png?raw=true'
              onClick={() => this.setState({ nav: 'splash' })}
            />
          </div>
          <Menu
            theme='dark'
            mode='horizontal'
            // defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
            onClick={this.onMenuClick}
          >
            <Menu.Item key='1'>AA Registry</Menu.Item>
            <Menu.Item key='2'>Topic Registry</Menu.Item>
            <Menu.Item key='3'>Achievement Registry</Menu.Item>
          </Menu>
        </Layout.Header>
        <Layout.Content style={{ padding: '5vh 5vw 0vh 5vw', backgroundColor: '#fff' }}>
          {this.getContent()}
        </Layout.Content>
        <Layout.Footer>
          <div style={{ textAlign: 'right' }}>
            <b onClick={() => this.setState({ nav: 'faq' })}>FAQ</b>
            &nbsp;| Customer service :&nbsp;
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