import React from 'react';
import { Table, Input, Modal, Button, Radio, Form } from 'antd';
import * as util from '../util';


// Test data
var storedData = [];
var newTopicData = [];
var issuerArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
var titleArr = ['title1', 'title2', 'title3', 'title4','title5', 'title6'];
var explanationArr = ['explanation1', 'explanation2','explanation3','explanation4', 'explanation5','explanation6'];

function setTestData() {
  for (var i=0; i < 20; i++) {
    // Get data (hardcoding)
    storedData.push({
      topicID: Math.floor((Math.random() * 2000)+1),
      issuer: issuerArr[Math.floor(Math.random() * 6)],
      title: titleArr[Math.floor((Math.random() * 6))],
      explanation: explanationArr[Math.floor(Math.random() * 6)],
      registerDate: util.timeConverter(Date.now()),
    });
  }
}

const columns = [
  {
    title: 'Topic ID',
    dataIndex: 'topicID',
    key: 'topicID',
    width: '10%',
  },
  {
    title: 'Issuer',
    dataIndex: 'issuer',
    key: 'issuer',
    width: '15%',
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    width: '25%',
  },
  {
    title: 'Explanation',
    dataIndex: 'explanation',
    key: 'explanation',
    width: '40%',
  },
  {
    title: 'Registered on',
    dataIndex: 'registerDate',
    key: 'registerDate',
    width: '10%',
  }
];

class Topic extends React.Component {
  state = {
    data: [],
    addModalVisible: false,
    qrVisible: false
  };

  constructor(props) {
    super(props);
    setTestData();
  }

  componentWillMount() {
    this.setState({data: storedData});
  }

  async test() {
    // For test
    this.props.contracts.topicRegistry.getAllTopic(
      (ret) => console.log('getTopic result', ret)
      ,() => console.log('getAllTopic done'));
  }

  componentDidMount() {
    this.test();
  }

  handleSorting = (e) => {
    var sortData=[];
    switch(e.target.value) {
      case '1':
        // All topic
        this.setState({data: storedData});
        break;
      case '2':
        // Pre-fixed topic (1 ~ 1024)
        storedData.forEach(function(element) {
          if(Object.values(element)[0]<1025) {
            sortData.push(element);
          }
        });
        this.setState({data: sortData});
        break;
      case '3':
        // Added topic (1025 ~)
        storedData.forEach(function(element) {
          if(Object.values(element)[0]>1024) {
            sortData.push(element);
          }
        });
        this.setState({data: sortData});
        break;
      default: break;
    }
  }

  handleChange = (e) => {
    newTopicData[e.target.id] = e.target.value;
  }

  onSearch(value) {
    // Reset search
    if (value === '' || value == undefined) {
      this.setState({data: storedData});
    } else {
      // Search with given value
      var searchData = [];
      storedData.forEach(function(element) {
        // Exact match
        Object.values(element).forEach(function(val) {
          if(val.toString().toLowerCase().includes(value.toString().toLowerCase()))
            searchData.push(element);
        });
      });
      this.setState({data: searchData});
    }
  }

  onSearchInputChange = (e) => {
    this.onSearch(e.target.value);
  }

  getModalTopicDetail(record) {
    Modal.info({
      width: '70%',
      maskClosable: true,
      title: record.title,
      content: (
        <div>
          <h5 style={{ float: 'right' }}>Registered on: {record.registerDate}</h5>
          <h3 style={{ margin: '10px 0 0 0' }}>{record.explanation}</h3>
          <h3 style={{ margin: '10px 0' }}>Creator(Title / MetaID) : {record.issuer} / 0x7304f14b0909640acc4f6a192381091eb1f37701</h3>
        </div>
      ),
      onOk() {}
    });
  }

  getModalAddTopic() {
    return <Modal
      width='50%'
      title='Add New Topic'
      visible={this.state.addModalVisible}
      okText='Add'
      onOk={() => this.setState({ qrVisible: true })}
      onCancel={() => this.setState({ addModalVisible: false, qrVisible: false })}
      closable={false}
      >
        {this.state.qrVisible ?
          'will be QR'
          :
          <div>
            <Form layout='inline'>
              <Form.Item
                label="Title">
                <Input
                  onChange={this.handleChange} 
                  id='title'
                  placeholder="Input Title"/>
              </Form.Item>
              <Form.Item
                style={{ float: 'right'}}
                label="No">
                <Input 
                  onChange={this.handleChange} 
                  id='topic'
                  placeholder="Input Reward"/>
              </Form.Item>
            </Form>
            <p style={{ float: 'right', color: 'red'}}>* No. in user / choose different No</p>
            <Form 
              layout='vertical'
              style={{ margin: '30px 0'}}>
              <Form.Item
                label="Explanation">
                <Input.TextArea 
                  onChange={this.handleChange} 
                  placeholder="Enter Explanation (max. 32 bytes)" 
                  autosize={{ minRows: 2, maxRows: 6 }}
                  id='explanation'/>
              </Form.Item>
            </Form>
          </div>
        }
    </Modal>;
  }

  render() {
    return (
      <div>
        <div>
          <Button
            type='primary'
            size='large'
            onClick={() => this.setState({ addModalVisible: true })}>Add New Topic</Button>
          <Input.Search
            placeholder='Search by Creator, No., Keyword'
            onChange={this.onSearchInputChange}
            onSearch={value => this.onSearch(value)}
            enterButton
            style={{ width: '50%', float: 'right', marginBottom: '20px' }}
          />
        </div>
        <Radio.Group style={{margin: '10px 10px 0 0'}} onChange={this.handleSorting}>
          <Radio.Button value='1'>All</Radio.Button>
          <Radio.Button value='2'>Pre-fixed</Radio.Button>
          <Radio.Button value='3'>Added</Radio.Button>
        </Radio.Group>
        <br />
        <Table
          rowKey={record => record.uid}
          onRow={(record, index) => ({
            onClick: () => { this.getModalTopicDetail(record); }
          })}
          columns={columns}
          dataSource={this.state.data}
        />
        {this.getModalAddTopic()}
      </div>
    );
  }
}

export {Topic};