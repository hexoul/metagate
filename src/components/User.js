import React from 'react';
import ReactLoading from 'react-loading';
import { Table, Form, Input, Modal, Row, Col, Progress, Button, message } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Web3 from 'web3';

import {columns} from './columns';
import * as util from '../util';

var tableColumns = columns.userColumns;
const userTopicDetailColumns = columns.userTopicDetailColumns;
const userAchieveDetailColumns = columns.userAchieveDetailColumns


class User extends React.Component {

  data = {
    items: [],
    originItems: [],
    topics: [],
    achivements: [],
    loadedUserCnt: 0,
    totalUserCnt: 1,
    newUserItem: { issuer: '', title: '', explanation: '' },
    inputValidData: {},
  };

  state = {
    items: [],
    originItems: [],
    getUserInfo: false,
    infoModalvisible: false,
    addModalVisible: false,
    didSearch: false,
    loading: false,
  };

  constructor(props) {
    super(props);
    tableColumns.forEach(({ dataIndex }, i) => {
      if (dataIndex !== 'addr') return;
      tableColumns[i].render = val => (
        <div>
          {val}&nbsp;&nbsp;
          <CopyToClipboard text={val}>
            <Button onClick={(e) => { message.info('Copied !!'); e.stopPropagation(); }}>copy</Button>
          </CopyToClipboard>
        </div>
      );
    });
  }

  componentWillMount() {
    if (this.data.topics.length > 0 || this.data.achivements.length > 0) return;

    let topics = util.getTopicsFromLocal();
    let achivs = util.getAchievementsFromLocal();
    
    if (topics) this.data.topics = topics;
    else this.props.contracts.topicRegistry.getAllTopic({
      handler: ret => { if (ret) this.data.topics = [...this.data.topics, util.refine(ret)] },
      cb: () => {
        this.data.topics.sort((a, b) => {
          if (a.id > b.id) return 1;
          else if (a.id < b.id) return -1;
          return 0;
        });
        util.setTopicsToLocal(this.data.topics);
      }
    });

    if (achivs) this.data.achivements = achivs;
    else this.props.contracts.achievementManager.getAllAchievements({
      handler: ret => { if (ret) this.data.achivements = [...this.data.achivements, util.refine(ret)] },
      cb: () => util.setAchievementsToLocal(this.data.achivements)
    });
  }

  async userDynamicLoading() {
    this.data.totalUserCnt = await this.props.contracts.aaRegistry.getAttestationAgencyNum();
    this.props.contracts.aaRegistry.getAllAttestationAgencies({
      handler: ret => this.addUser(ret),
      cb: () => {
        this.data.loadedUserCnt = this.data.totalUserCnt;
        util.setUsersToLocal(this.data.originItems);
        this.setState({ loading: true });
      }
    });
  }

  componentDidMount() {
    this.userDynamicLoading();
  }

  addUser = async (ret) => {
    ++this.data.loadedUserCnt;
    if (! ret) return;
    this.data.items = [...this.data.items, util.refine(ret)];
    this.data.originItems = this.data.items;
    this.setState({ getUserInfo: true });
  }

  updateNewAAInfo = (e) => {
    let valid = util.validate(e.target.id, e.target.value);
    if (valid.b) e.target.style.borderColor = util.borderColor.valid;
    else e.target.style.borderColor = util.borderColor.invalid;

    switch (e.target.id) {
      case 'issuer':
        this.data.newUserItem[e.target.id] = e.target.value;
        break;
      case 'title':
      case 'explanation':
        if (! valid.b && e.target.value) e.target.value = this.data.inputValidData[e.target.id];
        this.data.inputValidData[e.target.id] = e.target.value;
        this.data.newUserItem[e.target.id] = e.target.value;
        break;
      default: break;
    }
  }

  onSearch(value) {
    var regex = new RegExp(value, 'i');
    if (! value) this.data.items = this.data.originItems;
    else this.data.items = this.data.originItems.filter(element => Object.values(element).filter(val => val.toString().match(regex)).length > 0);
    this.setState({ didSearch: true });
  }

  onAddClick = () => {
    var formCheck = true;
    Object.keys(this.data.newUserItem).map(async (key) => {
      let valid = util.validate(key, this.data.newUserItem[key]);
      if (! valid.b) { message.error(valid.err); formCheck = false; }
    });
    if (! formCheck) return;
    
    if(typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
      let web3 = new Web3(window.web3.currentProvider);
      let { to, data } = this.props.contracts.aaRegistry.registerAttestationAgency(
        this.data.newUserItem.issuer,
        Buffer.from(this.data.newUserItem.title),
        Buffer.from(this.data.newUserItem.explanation)
        );
      web3.eth.getAccounts((err, accounts) => {
        if (err) return;
        web3.eth.sendTransaction({
          from: accounts[0],
          to: to,
          data: data,
        });
      });
    } else {
      alert('METAMASK REQUIRED. Please install.');
      window.open('https://metamask.io/', '_blank');
    }
  }

  onCancelClick = () => {
    this.setState({ addModalVisible: false});
  }

  getModalUserDetail(record) {
    record.topics = this.data.topics.filter(val => val.issuer === record.addr);
    record.achivements = this.data.achivements.filter(val => val.creator === record.addr);

    Modal.info({
      width: '70%',
      maskClosable: true,
      title: record.title,
      content: (
        <div>
          <h5 style={{ margin: '10px 0', float: 'right' }}>Registered on: {record.createdAt}</h5><br />
          <h4 style={{ margin: '10px 0' }}>Explanation: {record.explanation}</h4>
          <h4 style={{ margin: '10px 0' }}>Meta ID: {record.addr}&nbsp;&nbsp;
          <CopyToClipboard text={record.addr}>
              <Button onClick={() => message.info('Copied !!')}>copy</Button>
          </CopyToClipboard>
          </h4><hr />
          <Row>
            <Col span={11}>
              <Table
                size='small'
                rowKey='id'
                title={() => 'Topic created'}
                columns={userTopicDetailColumns}
                dataSource={record.topics}
              />
            </Col>
            <Col span={11} offset={1}>
              <Table
                  size='small'
                  rowKey='id'
                  title={() => 'Achievement created'}
                  columns={userAchieveDetailColumns}
                  dataSource={record.achivements}
                />
            </Col>
          </Row>
        </div>
      ),
      onOk() {}
    });
  }

  getModalAddTopic() {
    return <Modal
      width='40%'
      title='Add New AA'
      visible={this.state.addModalVisible}
      okText='Add'
      onOk={this.onAddClick}
      onCancel={this.onCancelClick}
      closable={false}
      >
        <Form layout='vertical' style={{ margin: '30px 0' }}>
          Address<br />
          <Input id='issuer' style={{ borderColor: 'red' }} onChange={this.updateNewAAInfo} placeholder="Input New Address" />
          Title<br />
          <Input id='title' style={{ borderColor: 'red' }} onChange={this.updateNewAAInfo} placeholder='Input title' />
          Explanation<br />
          <Input id='explanation' style={{ borderColor: 'red' }} onChange={this.updateNewAAInfo} placeholder='Enter Explanation(max. 32 bytes) / (ex. SNS Service - Account ID)' />
        </Form>
    </Modal>;
  }

  render() {
    return (
      <div>
        <div>
          <Button
            type='primary'
            size='large'
            onClick={() => this.setState({ addModalVisible: true })}
          >
            Add New AA
          </Button>
          <Input.Search
            enterButton
            placeholder='Search by Type, Meta ID, Title'
            onSearch={value => this.onSearch(value)}
            onChange={e => this.onSearch(e.target.value)}
            style={{ width: '50%', float: 'right', marginBottom: '20px' }}
          />
        </div>
        <Progress type='line' percent={ +Number(this.data.loadedUserCnt / this.data.totalUserCnt * 100).toFixed(2) } /><br /><br />
        {this.state.loading ? 
          <Table
            rowKey={record => record.addr}
            onRow={(record, index) => ({ onClick: () => this.getModalUserDetail(record) })}
            columns={tableColumns}
            dataSource={this.data.items}
          />
          :
          <center><ReactLoading type='spin' color='#1DA57A' height='20vh' width='20vw' /></center>
        }
        {this.getModalAddTopic()}
      </div>
    );
  }
}

export {User}