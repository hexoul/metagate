import React from 'react';
import { Table, Input, Modal, List, Button, Select, Form, Tabs } from 'antd';
import * as util from '../util';

// Test data
var storedData = [];
var newTopicData = [];
var creatorArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
var titleArr = ['title1', 'title2', 'title3', 'title4','title5', 'title6'];
var explanationArr = ['explanation1', 'explanation2','explanation3','explanation4', 'explanation5','explanation6'];
var topicListArr = ['Legal Name', 'Phone Number', 'E-mail Address', 'Date of Birth', 'Nationality'];

var children = [];

function setTestData() {
  for (var i=0; i < 20; i++) {
    //Get data (hardcoding)
    storedData.push({
      creator: creatorArr[Math.floor(Math.random() * 6)],
      title: titleArr[Math.floor((Math.random() * 6))],
      explanation: explanationArr[Math.floor(Math.random() * 6)],
      reward: Math.floor((Math.random() * 500)) + 'Meta',
      registerDate: util.timeConverter(Date.now()),
    });
  }

  for (var i=0; i<topicListArr.length; i++) {
      children.push(<Select.Option key={i}>{topicListArr[i]}</Select.Option>);
  }
}

const columns = [
  {
    title: 'creator',
    dataIndex: 'creator',
    key: 'creator',
    width: '15%',
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    width: '20%',
  },
  {
    title: 'Explanation',
    dataIndex: 'explanation',
    key: 'explanation',
    width: '45%',
  },
  {
    title: 'Reward',
    dataIndex: 'reward',
    key: 'reward',
    width: '10%',
  },
  {
    title: 'Registered on',
    dataIndex: 'registerDate',
    key: 'registerDate',
    width: '10%',
  }
];

const listData = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

class Achievement extends React.Component {
  data = {
    infoData: [],
    issuers: [],
    claimTopics: [],
    metaId:'0x7304f14b0909640acc4f6a192381091eb1f37701',
    achievementAddr: '0x7304f14b0909640acc4f6a192381091eb1f37702',
    creator: '',
    title: '',
    reward: '',
    explanation: '',
    registerDate: '',
    panes: [],
    activeKey: '0',
    newTabIndex: 1,

    newTopicId: '',
    newTitle: '',
    newExplanation: '',
  };

  state = {
    addModalVisible: false,
    qrVisible: false,
    isTabChange: false,
    isSearch: false,
  }

  constructor(props) {
    super(props);
    setTestData();
  }

  componentWillMount() {
    this.data['infoData'] = storedData;
    this.data['claimTopics'] = children;
    this.data['panes'].push({ title: 'New Tab', content: 'Content of new Tab', key: this.data.activeKey , closable: false});
    this.setState({ isTabChange: true });
  }

  showModal = (record, type) => {
    switch(type) {
      case 'add':
        this.setState({
          addModalVisible: true,
          qrModalVisible: false,
        });
        break;
      case 'qr':
        this.data['newTopicId'] = newTopicData['topic'];
        this.data['newTitle'] = newTopicData['title'];
        this.data['newExplanation'] = newTopicData['explanation'];
        this.setState({
          addModalVisible: false,
          qrModalVisible: true,
        });
        break;
      default: break;
    }
  }

  handleClose = (e) => {
    this.setState({
      addModalVisible: false,
      qrModalVisible: false,    
    });
  }

  handleSelectChange = (value) => {
    this.data.panes[this.data.activeKey]['title'] = topicListArr[value];
    this.setState({ isTabChange: true });
  }

  handleInputChange = (e) => {
    newTopicData[e.target.id] = e.target.value;
    console.log('handle change: ',newTopicData);
  }

  onSearch(value) {
    console.log('onSearch value: ',value);
    if (value == '' || value == undefined) {
      this.data['infoData'] = storedData;
    } else {
      var searchData = [];
      storedData.forEach(function(element) {
        //Exist value
        if(Object.values(element).indexOf(value) > -1) {
          console.log('onSearch1: ',Object.values(element).indexOf(value));
          searchData.push(element);
        }
      });
      this.data['infoData']=searchData;
    }
    this.setState({isSearch: true});
  }

  onTabsChange = (activeKey) => {
    this.data.activeKey = activeKey;
    this.setState({ isTabChange: true });
  }

  onTabsEdit = (targetKey, action) => {
    this[action](targetKey);
  }

  add = () => {
    this.data.activeKey = (++this.data.newTabIndex).toString();
    this.data.panes.push({ title: 'New Tab', content: 'Content of new Tab', key: this.data.activeKey });
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
    this.data['panes'] = panes;
    this.data.activeKey = activeKey;
    this.setState({ isTabChange: true });
  }

  getModalTopicDetail(record) {
    Modal.info({
      width: '70%',
      maskClosable: true,
      title: record.title,
      content: (
        <div>
          <h5 style={{ float: 'right' }}>Registered on: {record.registerDate}</h5>
          <h3 style={{ margin: '10px 0 0 0' }}>Address: {record.achievementAddr}</h3>
          <h3 style={{ margin: '10px 0 0 0' }}>{record.explanation}</h3>
          <h3 style={{ margin: '10px 0 0 0' }}>Reward: {record.reward}</h3>
          <h3 style={{ margin: '10px 0' }}>Creator(Title / MetaID): {record.creator} / {this.data.metaId}</h3>
          <List
            style={{ textAlign:'center' }}
            size='small'
            header={<div><h2>Required Topic</h2></div>}
            bordered
            dataSource={listData}
            renderItem={item => (<List.Item>{item}</List.Item>)}
          />
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
                {this.data.claimTopics}
              </Select>
              <Input
                onChange={this.handleInputChange} 
                placeholder='Enter Meta ID of Issuer (Optional)'
                id='explanation'
              />
            </Tabs.TabPane>)
          }
      </Tabs>
    </Form.Item>
  }

  getModalAddTopic() {
    return <Modal
      width='50%'
      title={'Add New Achievement'}
      visible={this.state.addModalVisible}
      onOk={() => this.setState({ qrVisible: true })}
      okText='Add'
      onCancel={() => this.setState({ addModalVisible: false, qrVisible: false })}
      closable={false}
      >
        <Form layout='inline'>
          <Form.Item label='Title'>
            <Input
              onChange={this.handleInputChange} 
              id='title'
              placeholder='Input Title'/>
          </Form.Item>
          <Form.Item label='Reward' style={{ float: 'right'}}>
            <Input 
              onChange={this.handleInputChange} 
              id='reward'
              placeholder='Input Reward'
              addonAfter='META'/>
          </Form.Item>
        </Form>
        <p style={{ float: 'right', color: 'red'}}>* Reward needs to be higher than 5</p>
        <Form layout='vertical' style={{ margin: '30px 0'}}>
          <Form.Item label='Explanation'>
            <Input.TextArea 
              onChange={this.handleInputChange} 
              placeholder='Enter Explanation (max. 32 bytes)'
              autosize={{ minRows: 2, maxRows: 6 }}
              id='explanation'/>
          </Form.Item>
          {this.getTopicTabs()}
        </Form>
    </Modal>
  }

  render() {
    return (
      <div>
        <div>
          <Button 
            type='primary'
            size='large'
            onClick={() => this.showModal('none','add')}>Add New Achievement</Button>
          <Input.Search
            placeholder='Search by Creator, No., Keyword'
            onSearch={value => this.onSearch(value)}
            enterButton
            style={{ width: '50%', float: 'right', marginBottom: '20px' }}
          />
        </div>
        <Table
          rowKey={record => record.uid}
          onRow={(record, index) => ({ onClick: () => this.getModalTopicDetail(record) })}
          columns={columns}
          dataSource={this.data.infoData}
        />
        {this.getModalAddTopic()}
      </div>
    );
  }
}

export {Achievement};