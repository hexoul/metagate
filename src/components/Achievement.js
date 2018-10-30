import React from 'react';
import { Table, Input, Modal, Row, Col, Button, Select, Form, Tabs, message } from 'antd';
import { SendTransaction } from 'metasdk-react';

import web3 from '../ethereum/web3';
import { columns } from './columns';
import * as util from '../util';

const tableColumns = columns.achievementColumns;
const detailColumns = columns.achievementDetailColumns;

// Test data
var topicListArr = ['Legal Name', 'Phone Number', 'E-mail Address', 'Date of Birth', 'Nationality'];
var children = [];

function setTestData() {
  for (var i=0; i < topicListArr.length; i++) {
    children.push(<Select.Option key={i}>{topicListArr[i]}</Select.Option>);
  }
}

class Achievement extends React.Component {

  data = {
    items: [],
    originItems: [],
    originClaimTopics: [],
    newAchievementItem: { title: '', topic: [], explanation: '', reward: '' },
    inputValidData: [],
    panes: [],
    activeKey: '0',
    tabIndex: 1,
  };

  state = {
    addModalVisible: false,
    qrVisible: false,
    isTabChange: false,
    isSearch: false,
    getTopicInfo: false,
  };

  constructor(props) {
    super(props);
    // TODO: init topic tabs of AddAchivModal
    setTestData();
  }

  async achievementDynamicLoading() {
    this.props.contracts.achievementManager.getAllAchievements({
      handler: (ret) => this.handleItemAdd(ret),
      cb: () => {}
    });
  }

  componentDidMount() {
    this.achievementDynamicLoading();

    // Init tab value
    this.data.originClaimTopics = children;
    this.data.panes.push({ title: 'New Topic', content: '', key: this.data.activeKey , closable: false });
    this.setState({ isTabChange: true });

    // test
    this.test = {
      topics: [1025,1026,1027],
      issuers: ['0x7304f14b0909640acc4f6a192381091eb1f37701','0x7304f14b0909640acc4f6a192381091eb1f37701','0x7304f14b0909640acc4f6a192381091eb1f37701'],
    };
  }

  handleItemAdd = async (result) => {
    let newItem = await this.getAchievementFromMap(result);
    this.data.items = [...this.data.items, newItem];
    this.data.originItems = this.data.items;
    this.setState({ getTopicInfo: true });
  }

  handleSelectChange = (value) => {
    for (var i=0; i < this.data.panes.length; i++) {
      if (this.data.panes[i].title === topicListArr[value]) {
        message.error('Selected duplicate topic.');
        return;
      }
    }
    this.data.panes[this.data.activeKey].title = this.data.originClaimTopics[value].props.children;
    this.data.newAchievementItem.topic.push({value: topicListArr[value]});
    
    this.setState({ isTabChange: true });
  }

  handleInputChange = (e) => {
    switch (e.target.id) {
      case 'title':
      case 'explanation':
        if (util.isValidLength(e.target.value) > 32) {
          message.error('Input exceeds maximum range!');
          e.target.style.borderColor = 'red';
          e.target.value = this.data.inputValidData[e.target.id];
        } else e.target.style.borderColor = '#3db389';

        this.data.inputValidData[e.target.id] = e.target.value;
        this.data.newAchievementItem[e.target.id] = e.target.value;
        break;
      case 'reward':
        if (e.target.value < 5) e.target.style.borderColor = 'red'; // 아예 5미만이면 저장을 안해서 에러발생 하도록
        else { 
          e.target.style.borderColor = '#3db389'; 
          this.data.newAchievementItem[e.target.id] = e.target.value;
        }
        break;
      default: break;
    }
  }

  onSearch(value) {
    var regex = new RegExp(value, 'i');
    if (! value) this.data.items = this.data.originItems;
    else this.data.items = this.data.originItems.filter(element => Object.values(element).filter(val => val.toString().match(regex)).length > 0);
    this.setState({ isSearch: true });
  }

  onSearchInputChange = (e) => {
    this.onSearch(e.target.value);
  }

  onTabsChange = (activeKey) => {
    this.data.activeKey = activeKey;
    this.setState({ isTabChange: true });
  }

  onTabsEdit = (targetKey, action) => {
    this[action](targetKey);
  }

  onAddClick = () => {
    var formCheck = true;
    Object.keys(this.data.newAchievementItem).map(async (key) => {
      if (key === 'topic' && this.data.newAchievementItem[key].length === 0) formCheck = false;
      else if (! this.data.newAchievementItem[key]) formCheck = false;
    });
    console.log(this.data.newAchievementItem);
    if (formCheck) this.setState({ qrVisible: true });
    else message.error('Failed cause red box or Select at least one topic!');
  }

  onCancelClick = () => {
    this.data.newAchievementItem = { title: '', topic: [], explanation: '', reward: '' };
    this.setState({ addModalVisible: false, qrVisible: false });
  }

  async getClaimTopic(claimTopics) {
    var rtn = [];
    await util.asyncForEach(claimTopics, async (element) => {
      var topic = await this.props.contracts.topicRegistry.getTopic(element);
      topic['id'] = element;
      rtn.push(util.refine(topic));
    });
    return rtn;
  }

  async getAchievementFromMap(m) {
    util.refine(m);
    if (m.claimTopics) m.claimTopics = await this.getClaimTopic(m.claimTopics);
    return m;
  }

  getModalAchievementDetail(record, index) {
    Modal.info({
      width: '50%',
      maskClosable: true,
      title: record.title,
      content: (
        <div>
          <h5 style={{ float: 'right', marginBottom: '10px'}}>Registered on: {record.createdAt}</h5> 
          <h3 style={{ margin: '10px 0 0 0' }}>Address: {record.id}</h3><hr />
          <h3 style={{ margin: '10px 0 0 0' }}>Explanation: {record.explanation}</h3><hr />
          <h3 style={{ margin: '10px 0 0 0' }}>Reward: {record.reward}</h3> <hr />
          <h3 style={{ margin: '10px 0' }}>Creator: Metadium / {record.creator}</h3> <hr />
          <center><h3 style={{ marginTop: '30px' }}>Required Topic</h3></center>
          <Table size="small" rowKey="uid" columns={ detailColumns } dataSource={ record.claimTopics } />
        </div>
      ),
      onOk() {}
    });
  }

  getTopicTabs() {
    return <Form.Item>
      <Tabs
        onChange={this.onTabsChange}
        activeKey={this.data.activeKey}
        type='editable-card'
        onEdit={this.onTabsEdit}>
          {this.state.isTabChange && this.data.panes.map(pane =>
            <Tabs.TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder='Select a Topic'
                optionFilterProp='children'
                onChange={this.handleSelectChange}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                {this.data.originClaimTopics}
              </Select>
              <Input
                onChange={this.handleInputChange} 
                placeholder='Enter Meta ID of Issuer (Optional)'
                id='issuer'
              />
            </Tabs.TabPane>)
          }
      </Tabs>
    </Form.Item>
  }

  getModalAddAchievement() {
    return <Modal
      width='40%'
      title='Add New Achievement'
      visible={this.state.addModalVisible}
      onOk={this.onAddClick}
      okText='Add'
      onCancel={this.onCancelClick}
      closable={false}
      >
      {this.state.qrVisible ?
        <div>
          {Object.keys(this.data.newAchievementItem).map(key => { return key + ':' + this.data.newAchievementItem[key] + ` // `; })}
          <SendTransaction
              id='sendTransaction'
              request={this.props.contracts.achievementManager.createAchievement(this.test.topics, this.test.issuers, Buffer.from('title'), Buffer.from('explan'), web3.utils.toWei('5', 'ether'), 'uri')}
              usage='createAchievement'
              service='metagate'
              callbackUrl='none'
            />
        </div>
        :
        <div>
          <Row>
            <Col span={12}>
              <Form.Item label='Title' style={{ marginBottom: '0px'}}>
                <Input
                  onChange={this.handleInputChange}
                  id='title'
                  placeholder='Input Title'/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='Reward' style={{ float: 'right', marginTop: '0.7%', marginBottom: '0px'}}>
                <Input
                  type='number'
                  onChange={this.handleInputChange}
                  id='reward'
                  placeholder='Input Reward'
                  addonAfter='META'/>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <p style={{ float: 'right', color: 'red'}}>* Reward needs to be higher than 5</p>
          </Row>
          <Form layout='vertical' style={{ margin: '30px 0'}}>
            <Form.Item label='Explanation'>
              <Input.TextArea
                onChange={this.handleInputChange}
                placeholder='Enter Explanation (max. 32 bytes)'
                autosize={{ minRows: 1, maxRows: 3 }}
                id='explanation'/>
            </Form.Item>
            {this.getTopicTabs()}
          </Form>
        </div>
        }
    </Modal>
  }

  add = () => {
    this.data.activeKey = (this.data.tabIndex++).toString();
    this.data.panes.push({ title: 'New Topic', content: 'Content of new tab', key: this.data.activeKey });
    this.setState({ isTabChange: true });
  }
  
  remove = (targetKey) => {
    let activeKey = this.data.activeKey;
    let lastIndex;
    this.data.panes.forEach((pane, i) => {
      if (pane.key === targetKey) lastIndex = i - 1;
    });
    const panes = this.data.panes.filter(pane => pane.key !== targetKey);
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = panes[lastIndex].key;
    }
    this.data.panes = panes;
    this.data.activeKey = activeKey;
    this.setState({ isTabChange: true });
  }

  render() {
    return (
      <div>
        <div>
          <Button 
            type='primary'
            size='large'
            onClick={() => this.setState({ addModalVisible: true })}>Add New Achievement</Button>
          <Input.Search
            placeholder='Search by Creator, No., Keyword'
            onChange={this.onSearchInputChange}
            onSearch={value => this.onSearch(value)}
            enterButton
            style={{ width: '50%', float: 'right', marginBottom: '20px' }}
          />
        </div>
        <Table
          rowKey={record => record.uid}
          onRow={(record, index) => ({ onClick: () => this.getModalAchievementDetail(record, index) })}
          columns={tableColumns}
          dataSource={ this.data.items }
        />
        {this.getModalAddAchievement()}
      </div>
    );
  }
}

export {Achievement};