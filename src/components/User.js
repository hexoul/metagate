import React from 'react';
import { Table, Input, Modal, List } from 'antd';
import * as util from '../util';
import {columns} from './columns'

const tableColumns = columns.userColumns;
const detailColumns = columns.userDetailColumns;

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
    storedData.push({
      type: typeArr[Math.floor((Math.random() * 10)/9)],
      title: titleArr[Math.floor(Math.random() * 6)],
      roll: rollArr[Math.floor((Math.random() * 10)/9)],
      metaID: metaidArr[Math.floor(Math.random() * 6)],
      registerDate: util.timeConverter(Date.now()),
    });
  }
}

class User extends React.Component {
  state = {
    items: [],
    originItems: [],
  };

  constructor() {
    super();
    setTestData();
    this.state.originItems = storedData;
  }

  componentWillMount() {
    this.setState({items: this.state.originItems});
  }

  onSearch(value) {
    value = value.toString().toLowerCase();

    if (! value) {
      this.setState({items: this.state.originItems});
      return;
    }
    let searchedData = [];

    this.state.originItems.forEach(function(element) {
      let columns = Object.values(element);
      for (var i=0; i < columns.length; i++) {
        if (columns[i].toString().toLowerCase().includes(value)) {
          searchedData.push(element);
          return;
        }
      }
    });
    this.setState({ items: searchedData });
  }

  onSearchInputChange = (e) => {
    this.onSearch(e.target.value);
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
          <Table
            rowKey="uid"
            // columns 맞게 변경하기
            columns={ detailColumns }
            dataSource={ this.state.items }
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
          enterButton
          placeholder='Search by Type, Meta ID, Title'
          onSearch={value => this.onSearch(value)}
          onChange={this.onSearchInputChange}
          style={{ width: '50%', float: 'right', marginBottom: '20px' }}
        />
        <br />
        <Table
          rowKey="uid"
          onRow={(record, index) => ({ onClick: () => this.getModalUserDetail(record) })}
          columns={tableColumns}
          dataSource={this.state.items}
        />
      </div>
    );
  }
}

export {User};