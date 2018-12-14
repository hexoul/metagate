import React from 'react'
import ReactLoading from 'react-loading'
import { Alert, Table, Input, Modal, Row, Col, Button, Select, Form, Tabs, Progress, message } from 'antd'
import { SendTransaction } from 'metasdk-react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import Web3 from 'web3'
import web3 from '../ethereum/web3'

import { columns } from './columns'
import * as util from '../util'

const tableColumns = columns.achievementColumns
const detailColumns = columns.achievementDetailColumns

class Achievement extends React.Component {
  data = {
    items: [],
    localStorageItem: [],
    originItems: [],
    users: [],
    topics: [],
    originClaimTopics: [],
    initNewAchievementItem: { title: '', explanation: '', reward: '', reserve: '', topics: [{ title: '', id: -1, issuer: '', key: '0' }] },
    inputValidData: {},
    topicIssuerMap: [],
    panes: [],
    activeKey: '0',
    tabIndex: 1,
    loadedAchieveCnt: 0,
    totalAchieveCnt: 1
  };

  state = {
    addModalVisible: false,
    qrVisible: false,
    didTabChange: false,
    didSearch: false,
    loading: false,
    getTopicInfo: false,
    getAchievementInfo: false
  };

  constructor (props) {
    super(props)
    this.data.newAchievementItem = JSON.parse(JSON.stringify(this.data.initNewAchievementItem))
  }

  componentWillMount () {
    if (this.data.users.length > 0 || this.data.topics.length > 0) return

    let users = util.getUsersFromLocal()
    let topics = util.getTopicsFromLocal()

    if (users) this.data.users = users
    else {
      this.props.contracts.aaRegistry.getAllAttestationAgencies({
        handler: ret => { if (ret) this.data.users = [...this.data.users, util.refine(ret)] },
        cb: () => util.setUsersToLocal(this.data.users)
      })
    }

    if (topics) {
      this.data.topics = topics
      this.data.originClaimTopics = topics.map(val => <Select.Option key={val.id}>{val.title}:{val.explanation}</Select.Option>)
      this.setState({ getTopicInfo: true }, () => this.achievementDynamicLoading())
    } else {
      this.props.contracts.topicRegistry.getAllTopic({
        handler: ret => { if (ret) this.data.topics = [...this.data.topics, util.refine(ret)] },
        cb: () => {
          this.data.topics.sort((a, b) => {
            if (a.id > b.id) return 1
            else if (a.id < b.id) return -1
            return 0
          })
          util.setTopicsToLocal(this.data.topics)
          this.data.originClaimTopics = this.data.topics.map(val => <Select.Option key={val.id}>{val.title}:{val.explanation}</Select.Option>)
          this.setState({ getTopicInfo: true }, () => this.achievementDynamicLoading())
        }
      })
    }
  }

  async achievementDynamicLoading () {
    this.data.totalAchieveCnt = await this.props.contracts.achievementManager.getLengthOfAchievements()
    this.props.contracts.achievementManager.getAllAchievements({
      handler: ret => this.addAchievement(ret),
      cb: () => {
        this.data.loadedAchieveCnt = this.data.totalAchieveCnt
        util.setAchievementsToLocal(this.data.originItems)
        this.setState({ loading: true })
      }
    })
  }

  componentDidMount () {
    // Init tab value
    this.data.panes.push({ title: 'New Topic', content: '', topics: [], key: this.data.activeKey, closable: false })
    this.setState({ didTabChange: true })
  }

  addAchievement = async (ret) => {
    ++this.data.loadedAchieveCnt
    if (!ret) return
    let newItem = await this.getAchievementFromMap(ret)
    let user = this.data.users.filter(m => m.addr === ret.creator)
    if (user) ret.creatorTitle = user[0].title
    else ret.creatorTitle = ret.creator
    this.data.items = [...this.data.items, newItem]
    this.data.originItems = this.data.items
    this.setState({ getAchievementInfo: true })
  }

  async getAchievementFromMap (m) {
    m.reserved = await this.props.contracts.achievementManager.getReserved(m.id)
    util.refine(m)
    if (m.claimTopics) {
      let wantToBeClaimed = {}
      m.claimTopics.forEach((v, i) => { wantToBeClaimed[v] = m.issuers[i] })
      let supClaimTopics = this.data.topics.filter(val => m.claimTopics.includes(val.id.toString()))
      supClaimTopics.forEach(topic => { topic['want'] = wantToBeClaimed[topic.id] })
      m.claimTopics = supClaimTopics
    }
    return m
  }

  updateNewAchieveInfo = (e) => {
    let valid = util.validate(e.target.id, e.target.value)
    if (valid.b) e.target.style.borderColor = util.borderColor.valid
    else e.target.style.borderColor = util.borderColor.invalid

    switch (e.target.id) {
      case 'title':
      case 'explanation':
        if (!valid.b && e.target.value) e.target.value = this.data.inputValidData[e.target.id]
        this.data.inputValidData[e.target.id] = e.target.value
        this.data.newAchievementItem[e.target.id] = e.target.value
        break
      case 'reward':
      case 'reserve':
        if (valid.b) this.data.newAchievementItem[e.target.id] = e.target.value; break
      case 'issuer':
        if (!valid.b) break
        this.data.panes.forEach((element, i) => {
          if (element.key === this.data.activeKey) this.data.newAchievementItem.topics[i].issuer = e.target.value
        })
        break
      default: break
    }
  }

  onSearch (value) {
    var regex = new RegExp(value, 'i')
    if (!value) this.data.items = this.data.originItems
    else this.data.items = this.data.originItems.filter(element => Object.values(element).filter(val => val.toString().match(regex)).length > 0)
    this.setState({ didSearch: true })
  }

  onTabsChange = (activeKey) => {
    this.data.activeKey = activeKey
    this.setState({ didTabChange: true })
  }

  onTabsEdit = (targetKey, action) => {
    this[action](targetKey)
  }

  add = () => {
    this.data.activeKey = (this.data.tabIndex++).toString()
    this.data.panes.push({ title: 'New Topic', content: 'Content of new tab', key: this.data.activeKey })
    this.data.newAchievementItem.topics.push({ title: '', id: -1, issuer: '', key: this.data.activeKey })
    this.setState({ didTabChange: true })
  }

  remove = (targetKey) => {
    let lastIndex = 0
    this.data.panes.forEach((pane, i) => { if (pane.key === targetKey) lastIndex = i - 1 })

    const newTopicItems = this.data.newAchievementItem.topics.filter(element => element.key !== targetKey)
    const panes = this.data.panes.filter(pane => pane.key !== targetKey)
    this.data.newAchievementItem.topics = newTopicItems
    this.data.activeKey = panes[lastIndex].key
    this.data.panes = panes
    this.setState({ didTabChange: true })
  }

  onTopicClick = (value) => {
    // eslint-disable-next-line
    let selected = this.data.topics.filter(val => val.id == value)[0];
    if (this.data.panes.filter(element => element.title === selected.title).length > 0) {
      return message.error('Duplicated topic.')
    }
    this.data.panes.forEach((element, i) => {
      if (element.key === this.data.activeKey) {
        this.data.panes[i].title = selected.title
        this.data.newAchievementItem.topics[i].title = selected.title
        this.data.newAchievementItem.topics[i].id = selected.id
      }
    })
    this.setState({ didTabChange: true })
  }

  onAddClick = () => {
    var formCheck = true
    Object.keys(this.data.newAchievementItem).map(async (key) => {
      let valid = util.validate(key, this.data.newAchievementItem[key])
      if (!valid.b) { message.error(valid.err); formCheck = false }
    })
    if (!formCheck) return
    this.setState({ qrVisible: true }, () => {
      this.data.newAchievementItem = JSON.parse(JSON.stringify(this.data.initNewAchievementItem))
    })
  }

  onCharge = (id, charge) => {
    if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
      let web3 = new Web3(window.web3.currentProvider)
      let { to, value, data } = this.props.contracts.achievementManager.fundAchievement(id, charge)
      web3.eth.getAccounts((err, accounts) => {
        if (err) return
        web3.eth.sendTransaction({
          from: accounts[0],
          to: to,
          value: value,
          data: data
        })
      })
    } else {
      this.setState({ alert: 'METAMASK REQUIRED. Please install.' })
      window.open('https://metamask.io/', '_blank')
    }
  }

  getModalAchievementDetail (record, index) {
    Modal.info({
      width: '50%',
      maskClosable: true,
      title: record.title,
      content: (
        <div>
          <h5 style={{ marginBottom: '10px', float: 'right' }}>Registered on: {record.createdAt}</h5><br />
          <h4 style={{ margin: '10px 0 0 0' }}>ID: {record.id}</h4><hr />
          <h4 style={{ margin: '10px 0 0 0' }}>Explanation: {record.explanation}</h4><hr />
          <h4 style={{ margin: '10px 0 0 0' }}>
            Reward: {record.rewardMeta} / Reserved: {record.reservedMeta}&nbsp;&nbsp;
            <Button onClick={() => this.onCharge(record.id, web3.utils.toWei('10', 'ether'))}>charge 10 META</Button>
          </h4><hr />
          <h4 style={{ margin: '10px 0' }}>Creator: {record.creatorTitle} / {record.creator}&nbsp;&nbsp;
            <CopyToClipboard text={record.creator}>
              <Button onClick={() => message.info('Copied !!')}>copy</Button>
            </CopyToClipboard>
          </h4><hr />
          <center><h3 style={{ marginTop: '30px' }}>Required Topics</h3></center>
          <Table size='small' rowKey='id' columns={detailColumns} dataSource={record.claimTopics} />
        </div>
      ),
      onOk () {}
    })
  }

  getTopicTabs () {
    return <Form.Item>
      <Tabs
        onChange={this.onTabsChange}
        activeKey={this.data.activeKey}
        type='editable-card'
        onEdit={this.onTabsEdit}>
        {this.state.didTabChange && this.data.panes.map(pane =>
          <Tabs.TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder='Select a Topic'
              optionFilterProp='children'
              onChange={this.onTopicClick}
              filterOption={(input, option) => {
                // eslint-disable-next-line
                  let selected = this.data.topics.filter(m => m.id == option.key);
                if (!selected || !util.cmpIgnoreCase(selected[0].title + selected[0].explanation, input)) return false
                return true
              }}
            >
              {this.data.originClaimTopics}
            </Select>
            <Input id='issuer' style={{ borderColor: 'red' }} onChange={this.updateNewAchieveInfo} placeholder='Enter Meta ID of Issuer' />
          </Tabs.TabPane>)
        }
      </Tabs>
    </Form.Item>
  }

  getModalAddAchievement () {
    var request
    if (this.state.qrVisible) {
      request = this.props.contracts.achievementManager.createAchievement(
        this.data.newAchievementItem.topics.map(val => val.id),
        this.data.newAchievementItem.topics.map(val => val.issuer),
        Buffer.from(this.data.newAchievementItem.title),
        Buffer.from(this.data.newAchievementItem.explanation),
        web3.utils.toWei(this.data.newAchievementItem.reward.toString(), 'ether'),
        'uri').request
      request.params[0].value = web3.utils.toHex(web3.utils.toWei(this.data.newAchievementItem.reserve.toString(), 'ether'))
    }

    return <Modal
      width='40%'
      title='Add New Achievement'
      visible={this.state.addModalVisible}
      onOk={this.onAddClick}
      okText='QRcode'
      cancelText='Close'
      onCancel={() => this.setState({ addModalVisible: false, qrVisible: false })}
      closable={false}
    >
      {this.state.qrVisible
        ? <div><center>
          <h1>Scan QR Code to Add New Achievement</h1>
          <SendTransaction
            id='sendTransaction'
            request={request}
            usage='createAchievement'
            service='metagate'
            callbackUrl='none'
            qrsize={256}
          />
          <h2 style={{ marginTop: '6%' }} >Title: {this.data.newAchievementItem.title}</h2>
          <h2>Reward: {this.data.newAchievementItem.reward} META</h2>
          <h2>Reserve: {this.data.newAchievementItem.reserve} META</h2>
        </center></div>
        : <div>
          <Row>
            <Col span={12}>
              Title<br />
              <Input id='title' style={{ borderColor: 'red' }} onChange={this.updateNewAchieveInfo} placeholder='Input Title' />
            </Col>
            <Col span={11} offset={1}>
              Reward<br />
              <Input
                id='reward'
                type='number'
                onChange={this.updateNewAchieveInfo}
                placeholder='Enter Reward (min. 5)'
                addonAfter='META'
              />
            </Col>
          </Row>
          <Row>
            <Col span={11} offset={13}>
              Reserve<br />
              <Input
                id='reserve'
                type='number'
                onChange={this.updateNewAchieveInfo}
                placeholder='Enter Reserve (min. 5)'
                addonAfter='META'
              />
            </Col>
          </Row>
          <Form layout='vertical' style={{ margin: '30px 0' }}>
            Explanation<br />
            <Input id='explanation' style={{ borderColor: 'red' }} onChange={this.updateNewAchieveInfo} placeholder='Enter Explanation (max. 32 bytes) \ (ex. Score over 10,000 points)' />
            <p /><hr />Required Claim Topics<p />
            {this.getTopicTabs()}
          </Form>
          {/* eslint-disable-next-line */}
          <a onClick={() => this.moveToFAQ('How do I add an Achievement?')}>How do I add an Achievement?</a>
        </div>
      }
    </Modal>
  }

  moveToFAQ (faqTitle) {
    this.setState({ addModalVisible: false })
    this.props.moveToFAQ(faqTitle)
  }

  render () {
    return (
      <div>
        {this.state.alert &&
          <p><Alert type='warning' closable showIcon message={this.state.alert} /></p>
        }
        <div>
          <Button
            type='primary'
            size='large'
            onClick={() => this.setState({ addModalVisible: true })}>
            Add New Achievement
          </Button>
          <Input.Search
            placeholder='Search by Creator, No., Keyword'
            onChange={e => this.onSearch(e.target.value)}
            onSearch={value => this.onSearch(value)}
            enterButton
            style={{ width: '50%', float: 'right', marginBottom: '20px' }}
          />
        </div>
        <Progress type='line' percent={+Number(this.data.loadedAchieveCnt / this.data.totalAchieveCnt * 100).toFixed(2)} /><br /><br />
        {this.state.loading
          ? <Table
            rowKey={record => record.id}
            onRow={(record, index) => ({ onClick: () => this.getModalAchievementDetail(record, index) })}
            columns={tableColumns}
            dataSource={this.data.items}
          />
          : <center><ReactLoading type='spin' color='#1DA57A' height='20vh' width='20vw' /></center>
        }
        {this.state.getTopicInfo && this.getModalAddAchievement()}
      </div>
    )
  }
}

export { Achievement }
