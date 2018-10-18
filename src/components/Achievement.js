import React from 'react';
import { Table, Input, Modal, List, Button, Radio, Form } from 'antd';

var storedData = [];
var newTopicData = [];
var creatorArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
var titleArr = ['title1', 'title2', 'title3', 'title4','title5', 'title6'];
var explanationArr = ['explanation1', 'explanation2','explanation3','explanation4', 'explanation5','explanation6'];
var registerdate;

const Search = Input.Search;

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

  class Achievement extends React.Component {
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
    console.log(this.state);
  }

  handleClose = (e) => {
    this.setState({
      infoModalVisible: false,
      addModalVisible: false,
      qrModalVisible: false,    
    });
  }

  componentWillMount() {
    this.initialize();
  }

  initialize() {
    var i;
    for (i=0; i<20; i++) {
      //Get data (hardcoding)
      storedData.push({
        creator: creatorArr[Math.floor(Math.random() * 6)],
        title: titleArr[Math.floor((Math.random() * 6))],
        explanation: explanationArr[Math.floor(Math.random() * 6)],
        reward: Math.floor((Math.random() * 500)) + 'Meta',
        registerDate: Date.now() - Math.floor((Math.random()*10)),
      });
    }
    this.setState({data: storedData});
  }

  handleSorting = (e) => {
    var sortData=[];
    console.log('hanle sorting value: ',e.target);

    switch(e.target.value) {
      case '1' :
        //All topic
        this.setState({data: storedData});
      break;
      case '2' :
        //Pre-fixed topic (1 ~ 1024)
        storedData.forEach(function(element) {
          if(Object.values(element)[0]<1025) {
            sortData.push(element);
          }
        });
        this.setState({data: sortData});
      break;
      case '3' :
        //Added topic (1025 ~)
        storedData.forEach(function(element) {
          if(Object.values(element)[0]>1024) {
            sortData.push(element);
          }
        });
        this.setState({data: sortData});
      break;
    }
  }

  handleChange = (e) => {
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