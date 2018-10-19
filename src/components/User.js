import React from 'react';
import { Table, Input, Modal, List } from 'antd';
import * as util from '../util';


// Test data
var storedData = [];
var typeArr = ['Personal', 'Institution'];
var titleArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
var rollArr = ['Attestation Agency', 'Service Provider'];
var metaidArr = ['0x7304f14b0909640acc4f6a192381091eb1f37701', '0x7304f14b0909640acc4f6a192381091eb1f37702',  
                 '0x7304f14b0909640acc4f6a192381091eb1f37703', '0x7304f14b0909640acc4f6a192381091eb1f37704',
                 '0x7304f14b0909640acc4f6a192381091eb1f37705', '0x7304f14b0909640acc4f6a192381091eb1f37706'];
const listData = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

function setTestData() {
  for (var i=0; i < 20; i++) {
    // Get data (hardcoding)
    storedData.push({
      type: typeArr[Math.floor((Math.random() * 10)/9)],
      title: titleArr[Math.floor(Math.random() * 6)],
      roll: rollArr[Math.floor((Math.random() * 10)/9)],
      metaID: metaidArr[Math.floor(Math.random() * 6)],
      registerDate: util.timeConverter(Date.now()),
    });
  }
}

const columns = [
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    sorter: (a, b) => a.type.length - b.type.length,
    width: '10%',
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    width: '10%',
  },
  {
    title: 'Roll',
    dataIndex: 'roll',
    key: 'roll',
    filters: [
      { text: 'AA', value: 'Attestation Agency' },
      { text: 'SP', value: 'Service Provider' },
    ],
    width: '15%',
    filterMultiple: false,
    onFilter: (value, record) => record.roll.indexOf(value) === 0,
  },
  {
    title: 'Meta ID',
    dataIndex: 'metaID',
    key: 'metaID',
    width: '30%',
  },
  {
    title: 'Registered on',
    dataIndex: 'registerDate',
    key: 'registerDate',
  }
];

class User extends React.Component {
  state = {
    data: []
  };

  constructor() {
    super();
    setTestData();
  }

  componentWillMount() {
    this.setState({data: storedData});
  }

  onSearch(value) {
    // Reset search
    if (value === '') {
      this.setState({data: storedData});
      return;
    }

    // Search with given value
    var searchData = [];
    storedData.forEach(function(element) {
      // Exact match
      if(Object.values(element).indexOf(value) > -1) searchData.push(element);
    });
    this.setState({data: searchData});
  }

  getModalUserDetail(record) {
    Modal.info({
      width: '70%',
      maskClosable: true,
      title: record.title,
      content: (
        <div>
          <h5 style={{ margin: '10px 0', float: 'right' }}>Registered on: {record.registerDate}</h5>
          <h3 style={{ margin: '10px 0' }}>Roll: {record.roll}</h3>
          <h3 style={{ margin: '10px 0' }}>Getting Explanation</h3>
          <h3 style={{ margin: '10px 0' }}>Meta ID: {record.metaID}</h3>
          <List
            size='small'
            header={<div><h2>Topic Created</h2></div>}
            bordered
            dataSource={listData}
            renderItem={item => (<List.Item>{item}</List.Item>)}
          />
          <br />
          <List
            size='small'
            header={<div><h2>Achievement Created</h2></div>}
            bordered
            dataSource={listData}
            renderItem={item => (<List.Item>{item}</List.Item>)}
          />
        </div>
      ),
      onOk() {}
    });
  }

  render() {
    return (
      <div>
        <Input.Search
          placeholder='Search by Type, Meta ID, Title'
          onSearch={value => this.onSearch(value)}
          enterButton
          style={{ width: '50%', float: 'right', marginBottom: '20px' }}
        />
        <br />
        <Table
          rowKey={record => record.uid}
          onRow={(record, index) => ({ onClick: () => this.getModalUserDetail(record) })}
          columns={columns}
          dataSource={this.state.data}
        />
      </div>
    );
  }
}

export {User};