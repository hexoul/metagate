import React from 'react';
import { Table, List, Input, Modal, Row, Col, Progress } from 'antd';

import {columns} from './columns';
import * as util from '../util';

const tableColumns = columns.userColumns;
const detailColumns = columns.userDetailColumns;

// Test data
var storedData = [];
var typeArr = ['Personal', 'Institution'];
var titleArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
var metaidArr = ['0x7304f14b0909640acc4f6a192381091eb1f37701', '0x7304f14b0909640acc4f6a192381091eb1f37702',  
                 '0x7304f14b0909640acc4f6a192381091eb1f37703', '0x7304f14b0909640acc4f6a192381091eb1f37704',
                 '0x7304f14b0909640acc4f6a192381091eb1f37705', '0x7304f14b0909640acc4f6a192381091eb1f37706'];

function setTestData() {
  for (var i=0; i < 20; i++) {
    storedData.push({
      type: typeArr[Math.floor((Math.random() * 10)/9)],
      title: titleArr[Math.floor(Math.random() * 6)],
      metaID: metaidArr[Math.floor(Math.random() * 6)],
      createdAt: util.timeConverter(Date.now()),
    });
  }
}

class User extends React.Component {

  data = {
    items: [],
    originItems: [],
    loadedUserCnt: 0,
    totalUserCnt: 1,
  };

  state = {
    items: [],
    originItems: [],
    getUserInfo: false,
    infoModalvisible: false,
    didSearch: false,
    loading: false,
  };

  constructor(props) {
    super(props);
    setTestData();
    this.data.originItems = storedData;
  }

  componentWillMount() {
    this.data.items = this.data.originItems;
    this.setState({ getUserInfo: true });
  }

  async userDynamicLoading() {
    this.data.totalUserCnt = await this.props.contracts.aaRegistry.getAttestationAgencyNum();
    this.props.contracts.aaRegistry.getAllAttestationAgencies({
      handler: ret => console.log(ret),
      cb: () => { this.data.loadedUserCnt = this.data.totalUserCnt; this.setState({ loading: true }); }
    });
  }

  componentDidMount() {
    this.userDynamicLoading();
  }

  onSearch(value) {
    var regex = new RegExp(value, 'i');
    if (! value) this.data.items = this.data.originItems;
    else this.data.items = this.data.originItems.filter(element => Object.values(element).filter(val => val.toString().match(regex)).length > 0);
    this.setState({ didSearch: true });
  }

  getModalUserDetail(record) {
    Modal.info({
      width: '70%',
      maskClosable: true,
      title: record.title,
      content: (
        <div>
          <h5 style={{ margin: '10px 0', float: 'right' }}>Registered on: {record.createdAt}</h5><br />
          <h4 style={{ margin: '10px 0' }}>Explanation: {record.explanation}</h4>
          <h4 style={{ margin: '10px 0' }}>Meta ID: {record.metaID}</h4>
          <Row>
            <Col span={11}>
              <Table
                size='small'
                rowKey='id'
                title={() => 'Topic created'}
                columns={detailColumns}
                dataSource={record.topics}
              />
            </Col>
            <Col span={11} offset={1}>
              <List
                size='small'
                header={<div>Achievement created</div>}
                bordered
                dataSource={record.achivements}
                renderItem={item => (<List.Item>{item}</List.Item>)}
              />
            </Col>
          </Row>
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
          onChange={e => this.onSearch(e.target.value)}
          style={{ width: '50%', float: 'right', marginBottom: '20px' }}
        />
        <Progress type='line' percent={ +Number(this.data.loadedUserCnt / this.data.totalUserCnt * 100).toFixed(2) } /><br /><br />
        <Table
          // rowKey={record => record.uid}
          onRow={(record, index) => ({ onClick: () => this.getModalUserDetail(record) })}
          columns={tableColumns}
          dataSource={this.data.items}
        />
      </div>
    );
  }
}

export {User}