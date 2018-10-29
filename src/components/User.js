import React from 'react';
import { Table, Input, Modal } from 'antd';
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
  data = {
    items: [], 
    originItems: [],
  }
  state = {
    items: [],
    originItems: [],
    getUserInfo: false,
    infoModalvisible: false,
    isSearch: false,
  };

  constructor() {
    super();
    setTestData();
    this.data.originItems = storedData;
  }

  componentWillMount() {
    this.data.items = this.data.originItems;
    this.setState({ getUserInfo: true });
  }

  onSearch(value) {
    let searchedData = [];
    value = value.toString().toLowerCase();

    if (! value) {
      this.data.items = this.data.originItems;
      return;
    }
    
    this.data.originItems.forEach(function(element) {
      let columns = Object.values(element);
      for (var i=0; i < columns.length; i++) {
        if (columns[i].toString().toLowerCase().includes(value)) {
          searchedData.push(element);
          return;
        }
      }
    });
    this.data.items = searchedData;
    this.setState({ isSearch: true });
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
            dataSource={ this.data.items }
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
          dataSource={this.data.items}
        />
      </div>
    );
  }
}

export {User};