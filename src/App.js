import React from 'react'
import { Layout, Menu, message } from 'antd'
import { User, Topic, Achievement, FAQ, Splash } from './components'

// Styles.
import './App.css'

// Web3.
import web3 from './ethereum/web3'
import web3config from './ethereum/web3-config.json'

// Contracts.
import { contracts, initContracts } from 'meta-web3'

class App extends React.Component {
  state = {
    nav: 'splash',
    contractReady: false
  };

  data = { faqTitle: '' }

  async initContracts () {
    initContracts({
      web3: web3,
      netid: web3config.netid,
      identity: web3config.identity
    }).then(async () => this.setState({ contractReady: true }))
  }

  constructor (props) {
    super(props)

    message.config({
      top: 30,
      duration: 2,
      maxCount: 6
    })

    this.initContracts()
  }

  onMenuClick = ({ key }) => {
    this.setState({ nav: key })
  }

  moveToFAQ = (faqTitle) => {
    this.data.faqTitle = faqTitle
    this.setState({ nav: 'faq' })
  };

  getContent () {
    if (!this.state.contractReady) return
    switch (this.state.nav) {
      case '1': return <User contracts={contracts} />
      case '2': return <Topic contracts={contracts} moveToFAQ={this.moveToFAQ} />
      case '3': return <Achievement contracts={contracts} moveToFAQ={this.moveToFAQ} />
      case 'splash': return <Splash moveToFAQ={this.moveToFAQ} />
      case 'faq': return <FAQ faqTitle={this.data.faqTitle} />
      default:
    }
  }

  render () {
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
        <Layout.Content style={{ padding: '5vh 5vw 0vh 5vw', backgroundColor: '#fff', minHeight: '70vh' }}>
          {this.getContent()}
        </Layout.Content>
        <Layout.Footer>
          <div style={{ textAlign: 'right' }}>
            <b onClick={() => { this.data.faqTitle = ''; this.setState({ nav: 'faq' }) }}>FAQ</b>
            &nbsp;| Customer service :&nbsp;
            <a href='mailto:contact@metadium.com' target='_blank' rel='noopener noreferrer'>contact@metadium.com</a>
          </div>
          <br />
          <center>metagate ©2018 Created by hexoul</center>
        </Layout.Footer>
      </Layout>
    )
  }
}

export default App
