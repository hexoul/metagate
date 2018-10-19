import React from 'react';
import { Table, Input, Modal, List, Button, Select, Form, Tabs } from 'antd';

var storedData = [];
var newTopicData = [];
var creatorArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
var titleArr = ['title1', 'title2', 'title3', 'title4','title5', 'title6'];
var explanationArr = ['explanation1', 'explanation2','explanation3','explanation4', 'explanation5','explanation6'];
var topicListArr = ['Legal Name', 'Phone Number', 'E-mail Address', 'Date of Birth', 'Nationality'];
var registerdate;

const Search = Input.Search;
const Option = Select.Option;
const children = [];
const TabPane = Tabs.TabPane;

function setTestData() {
  var i;
  for (i=0; i<20; i++) {
    //Get data (hardcoding)
    storedData.push({
      creator: creatorArr[Math.floor(Math.random() * 6)],
      title: titleArr[Math.floor((Math.random() * 6))],
      explanation: explanationArr[Math.floor(Math.random() * 6)],
      reward: Math.floor((Math.random() * 500)) + 'Meta',
      registerDate: timeConverter(Date.now()),
    });
  }
}

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var time = year + ' / ' + month + ' / ' + date;
  return time;
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
    width: '15%',
  },
  {
    title: 'Explanation',
    dataIndex: 'explanation',
    key: 'explanation',
    width: '40%',
  },
  {
    title: 'Reward',
    dataIndex: 'reward',
    key: 'reward',
    width: '15%',
  },
  {
    title: 'Registered on',
    dataIndex: 'registerDate',
    key: 'registerDate',
  }];

  const listData = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
  ];

  //Initialize panes
  const panes = [
    { title: 'Add Topic', content: '', key: '1', closable: false },
  ];
  
  class Achievement extends React.Component {
    constructor(props) {
      super(props);
      this.newTabIndex = 0;
    }
    state = {
      data: [],
      issuers: [],
      claimTopics: [],
      metaId:'0x7304f14b0909640acc4f6a192381091eb1f37701',
      achievementAddr: '0x7304f14b0909640acc4f6a192381091eb1f37702',
      creator: '',
      title: '',
      reward: '',
      explanation: '',
      registerDate: '',
      infoModalVisible: false,
      addModalVisible: false,
      activeKey: panes[0].key,
      panes,
    }
    showModal = (record, type) => {
      console.log('showModal: ',record,type);
      switch(type) {
        case 'info':
          this.setState({
            topicID: record.topicID,
            creator: record.creator,
            title: record.title,
            explanation: record.explanation,
            registerDate: record.registerDate,
            infoModalVisible: true,
            addModalVisible: false,
            qrModalVisible: false,
          });
          break;
        case 'add':
          this.setState({
            infoModalVisible: false,
            addModalVisible: true,
            qrModalVisible: false,
          });
          break;
        case 'qr':
          this.setState({
            newTopicId: newTopicData['topic'],
            newTitle: newTopicData['title'],
            newExplanation: newTopicData['explanation'],
            infoModalVisible: false,
            addModalVisible: false,
            qrModalVisible: true,
          });
          break;
        default: break;
      }
    }

    componentWillMount() {
      this.initialize();
    }

    initialize() {
      var i=0;
      setTestData();
      this.setState({data: storedData});

      for (i=0; i<topicListArr.length; i++) {
        children.push(<Option key={i}>{topicListArr[i]}</Option>);
      }
      this.setState({claimTopics: children});
    }

    handleClose = (e) => {
      this.setState({
        infoModalVisible: false,
        addModalVisible: false,
        qrModalVisible: false,    
      });
    }

    handleSelectChange(value) {
      console.log(`selected ${value}`);
    }

    handleInputChange = (e) => {
      newTopicData[e.target.id] = e.target.value;
      console.log('handle change: ',newTopicData);
    }

    onSearch(value) {
      console.log('onSearch value: ',value);
      if (value == '' || value == undefined) {
        this.setState({data: storedData});
      }
      else {
        var searchData = [];
        storedData.forEach(function(element) {
          //Exist value
          if(Object.values(element).indexOf(value) > -1) {
            console.log('onSearch1: ',Object.values(element).indexOf(value));
            searchData.push(element);
          }
        });
        this.setState({data: searchData});
      }
    }
    onTabsChange = (activeKey) => {
      this.setState({ activeKey });
    }

    onTabsEdit = (targetKey, action) => {
      this[action](targetKey);
    }

    add = () => {
      const panes = this.state.panes;
      const activeKey = `newTab${this.newTabIndex++}`;
      panes.push({ title: 'Add Topic', content: 'Content of new Tab', key: activeKey });
      this.setState({ panes, activeKey });
    }

    remove = (targetKey) => {
      let activeKey = this.state.activeKey;
      let lastIndex;
      this.state.panes.forEach((pane, i) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1;
        }
      });
      const panes = this.state.panes.filter(pane => pane.key !== targetKey);
      if (lastIndex >= 0 && activeKey === targetKey) {
        activeKey = panes[lastIndex].key;
      }
      this.setState({ panes, activeKey });
    }

    getTabComponent() {
      return <Button 
      type="primary"
      size='large'
      onClick={()=>this.showModal('none','add')}> Add New Achievement </Button>;
    }

    render() {
      return (
        <div>
          <div>
            <Button 
              type="primary"
              size='large'
              onClick={()=>this.showModal('none','add')}> Add New Achievement </Button>
            <Search
              placeholder="Search by Creator, No., Keyword"
              onSearch={value => this.onSearch(value)}
              enterButton
              style={{ width: 500, float: 'right', marginBottom: '20px' }}
            />
          </div>
          <Modal
            width={900}
            title={this.state.title}
            visible={this.state.infoModalVisible}
            onOk={this.handleClose}
            onCancel={this.handleClose}>
            <div>
              <h5 style={{ float: 'right' }}>Registered on: {this.state.registerDate}</h5>
              <h3 style={{ margin: '10px 0 0 0' }}>Address: {this.state.achievementAddr}</h3>
              <h3 style={{ margin: '10px 0 0 0' }}>{this.state.explanation}</h3>
              <h3 style={{ margin: '10px 0 0 0' }}>Reward: {this.state.explanation}</h3>
              <h3 style={{ margin: '10px 0' }}>Creator(Title / MetaID): {this.state.creator} / {this.state.metaId}</h3>
              <List
                style={{ textAlign:'center' }}
                size='small'
                header={<div><h2>Required Topic</h2></div>}
                bordered
                dataSource={listData}
                renderItem={item => (<List.Item>{item}</List.Item>)}
              />
              <br />
            </div>
          </Modal>
          <Modal
            width={600}
            title={'Add New Topic'}
            visible={this.state.addModalVisible}
            onOk={this.handleClose}
            onCancel={this.handleClose}
            footer={null}>
              <Form layout='inline'>
                <Form.Item
                  label="Title">
                  <Input
                    onChange={this.handleInputChange} 
                    id='title'
                    placeholder="Input Title"/>
                </Form.Item>
                <Form.Item
                  style={{ float: 'right'}}
                  label="Reward">
                  <Input 
                    onChange={this.handleInputChange} 
                    id='reward'
                    placeholder="Input Reward"
                    addonAfter="META"/>
                </Form.Item>
                <p style={{ float: 'right', color: 'red'}}>* Reward needs to be higher than 5</p>
              </Form>
              <Form 
                layout='vertical'
                style={{ margin: '30px 0'}}>
                <Form.Item
                  label="Explanation">
                  <Input.TextArea 
                    onChange={this.handleInputChange} 
                    placeholder="Enter Explanation (max. 32 bytes)" 
                    autosize={{ minRows: 2, maxRows: 6 }}
                    id='explanation'/>
                </Form.Item>
                <Form.Item>
                <Tabs
                  onChange={this.onTabsChange}
                  activeKey={this.state.activeKey}
                  type="editable-card"
                  onEdit={this.onTabsEdit}>
                    {this.state.panes.map(pane => 
                      <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
                        <Select
                          showSearch
                          style={{ width: '100%' }}
                          placeholder="Select a Topic"
                          optionFilterProp="children"
                          onChange={this.handleSelectChange}
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                          {this.state.claimTopics}
                        </Select>
                        <Input
                          onChange={this.handleInputChange} 
                          placeholder="Enter Meta ID of Issuer (Optional)"
                          id='explanation'/>
                      </TabPane>
                      )}
                </Tabs>
                </Form.Item>
                <Form.Item>
                  <center>
                    <Button 
                      type='primary'
                      size='large'
                      onClick={()=>this.showModal('none','qr')}> 
                        Add
                    </Button>
                  </center>
                </Form.Item>
              </Form>
          </Modal>
          <br />
          <Table
            rowKey={record => record.uid}
            onRow={(record, index) => ({
              onClick: () => { console.log('onRow', record); this.showModal(record,'info'); }
            })}
            columns={columns}
            dataSource={this.state.data}
          />
        </div>
      );
    }
}
export {Achievement};