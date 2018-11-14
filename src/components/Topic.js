import React from 'react';
import { Table, Input, Modal, Button, Radio, Form, Row, Col, Progress, message } from 'antd';
import { SendTransaction } from 'metasdk-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { columns } from './columns';
import * as util from '../util';

const tableColumns = columns.topicColumns;

class Topic extends React.Component {

  data = {
    items: [],
    originItems: [],
    users: [],
    newTopicItem: { title: '', explanation: '' },
    inputValidData: [],
    loadedTopicCnt: 0,
    totalTopicCnt: 1,
  };

  state = {
    addModalVisible: false,
    qrVisible: false,
    getTopicInfo: false,
    didSort: false,
    didSearch: false,
    loading: false,
  };

  componentWillMount() {
    if (this.data.users.length > 0) return;

    let users = util.getUsersFromLocal();

    if (users) { this.data.users = users; this.topicDynamicLoading(); }
    else this.props.contracts.aaRegistry.getAllAttestationAgencies({
      handler: ret => { if (ret) this.data.users = [...this.data.users, util.refine(ret)] },
      cb: () => { util.setUsersToLocal(this.data.users); this.topicDynamicLoading(); }
    });
  }

  async topicDynamicLoading() {
    this.data.totalTopicCnt = await this.props.contracts.topicRegistry.getTotal();
    this.props.contracts.topicRegistry.getAllTopic({
      handler: ret => this.addTopic(ret),
      cb: () => {
        this.data.loadedTopicCnt = this.data.totalTopicCnt;
        this.data.originItems.sort((a, b) => {
          if (a.id > b.id) return 1;
          else if (a.id < b.id) return -1;
          return 0;
        });
        util.setTopicsToLocal(this.data.originItems);
        this.setState({ loading: true });
      }
    });
  }

  addTopic = async (ret) => {
    ++this.data.loadedTopicCnt;
    if (! ret) return;
    let user = this.data.users.filter(m => m.addr === ret.issuer);
    if (user) ret.issuerTitle = user[0].title;
    else ret.issuerTitle = ret.issuer;
    this.data.items = [...this.data.items, util.refine(ret)];
    this.data.originItems = this.data.items;
    this.setState({ getTopicInfo: true });
  }

  handleSorting = (e) => {
    switch (e.target.value) {
      case 'All': this.data.items = this.data.originItems; break;
      case 'Pre-fixed': this.data.items = this.data.originItems.filter(m => m.id < 1025); break;
      case 'Added': this.data.items = this.data.originItems.filter(m => m.id >= 1024); break;
      default: break;
    }
    this.setState({ didSort: true });
  }

  updateNewTopicInfo = (e) => {
    let valid = util.validate(e.target.id, e.target.value);
    if (valid.b) e.target.style.borderColor = '#3db389';
    else e.target.style.borderColor = 'red';

    switch (e.target.id) {
      case 'title':
      case 'explanation':
        if (! valid.b && e.target.value) e.target.value = this.data.inputValidData[e.target.id];
        this.data.inputValidData[e.target.id] = e.target.value;
        this.data.newTopicItem[e.target.id] = e.target.value;
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
    Object.keys(this.data.newTopicItem).map(async (key) => {
      let valid = util.validate(key, this.data.newTopicItem[key]);
      if (! valid.b) { message.error(valid.err); formCheck = false; }
    });
    if (! formCheck) return;
    this.setState({ qrVisible: true });
  }

  onCancelClick = () => {
    this.data.newTopicItem = { title: '', explanation: '' };
    this.setState({ addModalVisible: false, qrVisible: false });
  }

  getModalTopicDetail(record) {
    Modal.info({
      width: '40%',
      maskClosable: true,
      title: 'No.' + record.id + ' - ' + record.title,
      content: (
        <div style={{ marginTop: '5%', width: '90%' }}>
          <h5 style={{ margin: '10px 0', float: 'right' }}>Registered on: {record.createdAt}</h5><br />
          <h4 style={{ margin: '10px 0 0 0' }}>Explanation: {record.explanation}</h4><hr />
          <h4 style={{ margin: '10px 0' }}>Creator : {record.issuerTitle} / {record.issuer}&nbsp;&nbsp;
            <CopyToClipboard text={record.issuer}>
              <Button onClick={() => message.info('Copied !!')}>copy</Button>
            </CopyToClipboard>
          </h4><hr />
        </div>
      ),
      onOk() {}
    });
  }

  moveToFAQ(faqTitle) {
    this.setState({ addModalVisible: false });
    this.props.moveToFAQ(faqTitle);
  }

  getModalAddTopic() {
    return <Modal
      width='40%'
      title='Add New Topic'
      visible={this.state.addModalVisible}
      okText='Add'
      onOk={this.onAddClick}
      onCancel={this.onCancelClick}
      closable={false}
      >
        {this.state.qrVisible ?
          <div><center>
            <h1>Scan QR Code to Add New Topic</h1>
            <SendTransaction
              id='sendTransaction'
              request={this.props.contracts.topicRegistry.registerTopic(Buffer.from(this.data.newTopicItem.title), Buffer.from(this.data.newTopicItem.explanation))}
              usage='registerTopic'
              service='metagate'
              callbackUrl='none'
              qrsize={256}
            />
            <h2 style={{ marginTop: '6%' }} >Title: {this.data.newTopicItem.title}</h2>
          </center></div>
          :
          <div>
            <Row>
              <Col span={12}>
                Title<br />
                <Input id='title' onChange={this.updateNewTopicInfo} placeholder='Input Title' />
              </Col>
              <Col span={11} offset={1}>
                No.<br />
                <Input id='topic' onChange={this.updateNewTopicInfo} placeholder='Input Topic ID' disabled={true} />
              </Col>
            </Row>
            <p style={{ float: 'right', color: 'red' }}>* No. in user / choose different No</p>
            <Form layout='vertical' style={{ margin: '30px 0' }}>
              Explanation<br />
              <Input id='explanation' onChange={this.updateNewTopicInfo} placeholder='Enter Explanation(max. 32 bytes) / (ex. SNS Service - Account ID)' />
            </Form>
            {/* eslint-disable-next-line */}
            <a onClick={() => this.moveToFAQ('How do I add Topic?')}>How do I add Topic?</a>
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
            onClick={() => this.setState({ addModalVisible: true })}>
            Add New Topic
          </Button>
          <Input.Search
            placeholder='Search by Creator, No., Keyword'
            onChange={e => this.onSearch(e.target.value)}
            onSearch={value => this.onSearch(value)}
            enterButton
            style={{ width: '50%', float: 'right', marginBottom: '20px' }}
          />
        </div>
        <Radio.Group style={{ margin: '10px 0' }} defaultValue='All' onChange={this.handleSorting}>
          <Radio.Button value='All'>All</Radio.Button>
          <Radio.Button value='Pre-fixed'>Pre-fixed</Radio.Button>
          <Radio.Button value='Added'>Added</Radio.Button>
        </Radio.Group>
        <br />
        <Progress type='line' percent={ +Number(this.data.loadedTopicCnt / this.data.totalTopicCnt * 100).toFixed(2) } /><br /><br />
        <Table
          rowKey='id'
          onRow={(record, index) => ({ onClick: () => this.getModalTopicDetail(record) })}
          columns={tableColumns}
          dataSource={this.data.items}
        />
        {this.getModalAddTopic()}
      </div>
    );
  }
}

export {Topic}