import React from 'react';
import { Table, Input, Modal, List, Button, Select, Form, Tabs } from 'antd';
import * as util from '../util';
import { columns } from './columns';
import web3 from '../ethereum/web3';

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
    newAchievementItem: [],
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
  }

  constructor(props) {
    super(props);
    setTestData(); // --> Need using getAllTopic for tabs
  }

  componentDidMount() {
    this.achievementDynamicLoading();

    // Init tab value
    this.data.originClaimTopics = children;
    this.data.panes.push({ title: 'New Topic', content: '', key: this.data.activeKey , closable: false});
    this.setState({ isTabChange: true });
  }

  async achievementDynamicLoading() {
    // For test
    this.props.contracts.achievementManager.getAllAchievements({
      handler: (ret) => { this.handleItemAdd(ret) },
      cb: () => {this.data.originItems = this.data.items; console.log('getAllAchievements done')}
    });
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
        this.setState({
          addModalVisible: false,
          qrModalVisible: true,
        });
        break;
      default: break;
    }
  }

  handleItemAdd = (result) => {
    let newItem = {};
    newItem = this.getKeyValueObject(result);
    this.data.items = [...this.data.items, newItem];
    this.setState({ getTopicInfo: true });
  }

  handleClose = (e) => {
    this.setState({
      addModalVisible: false,
      qrModalVisible: false,    
    });
  }

  handleSelectChange = (value) => {
    this.data.panes[this.data.activeKey]['title'] = this.data.originClaimTopics[value].props['children'];
    this.setState({ isTabChange: true });
  }

  handleInputChange = (e) => {
    // Add new achievement
    this.data.newAchievementItem[e.target.id] = e.target.value;
  }

  onSearch(value) {
    if (! value) {
      this.data.items = this.data.originItems;
    } else {
      var searchedData = [];
      this.data.originItems.forEach(function(element) {
        //Exist value
        Object.values(element).forEach(function(val) {
          if(val.toLowerCase().includes(value.toLowerCase()))
          searchedData.push(element);
        });
      });
      this.data.items = searchedData;
    }
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

  async getClaimTopic(claimTopics) {
    var rtn = [];
    await claimTopics.forEach(element => {
      var claims = {};
      this.props.contracts.topicRegistry.getTopic(element).then(result => { 
        claims = this.getKeyValueObject(result);
        claims['id'] = element; //ret를 log로 찍으면 id가 없음 그래서 임의로 넣어줌
        rtn.push(claims); 
      }); 
    });    
    return rtn;
  }

  getKeyValueObject(result) {
    var rtn = {};
    Object.keys(result).map(key => {
      switch (key) {
        // case 'title':
        case 'explanation': { rtn[key] = util.convertHexToString(result[key]); } break;
        case 'claimTopics': { rtn[key] = this.getClaimTopic(result[key]); } break;
        case 'reward': { rtn[key] = web3.utils.fromWei(result[key], 'ether') + 'META'; } break;
        case 'createdAt': { rtn[key] = util.timeConverter(Date(result[key])); } break;
        default: { if (result[key]) {rtn[key] = result[key]} else {rtn[key] = ''}; } break;
      }});
    return rtn;
  }

  getModalTopicDetail(record, index) {
    this.data.items[index].claimTopics.then(result => {
      Modal.info({
        width: '50%',
        maskClosable: true,
        title: record.title,
        content:
        (<div>
            <h5 style={{ float: 'right', marginBottom: '10px'}}>Registered on: {record.createdAt}</h5> 
            <h3 style={{ margin: '10px 0 0 0' }}>Address: {record.id}</h3> <hr></hr>
            <h3 style={{ margin: '10px 0 0 0' }}>Explanation: {record.explanation}</h3> <hr></hr>
            <h3 style={{ margin: '10px 0 0 0' }}>Reward: {record.reward}</h3> <hr></hr>
            <h3 style={{ margin: '10px 0' }}>Creator(Title / MetaID): {record.title} / {record.creator}</h3> <hr></hr>
            <center><h3 style={{ marginTop: '30px' }}>Required Topic</h3></center>
            <Table size="small" rowKey="uid" columns={ detailColumns } dataSource={ result } />
          </div>),
        onOk() {}
      });      
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

  add = () => {
    this.data.activeKey = (++this.data.tabIndex).toString();
    this.data.panes.push({ title: 'New Topic', content: 'Content of new Tab', key: this.data.activeKey });
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
            onChange={this.onSearchInputChange}
            onSearch={value => this.onSearch(value)}
            enterButton
            style={{ width: '50%', float: 'right', marginBottom: '20px' }}
          />
        </div>
        <Table
          rowKey="uid"
          onRow={(record, index) => ({ onClick: () => this.getModalTopicDetail(record, index) })}
          columns={tableColumns}
          dataSource={ this.data.items }
        />
        {this.getModalAddTopic()}
      </div>
    );
  }
}

export {Achievement};