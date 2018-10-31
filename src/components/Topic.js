import React from 'react';
import { Table, Input, Modal, Button, Radio, Form, Row, Col, message, Progress } from 'antd';
import { SendTransaction } from 'metasdk-react';

import { columns } from './columns';
import * as util from '../util';

const tableColumns = columns.topicColumns;

class Topic extends React.Component {

  data = {
    items: [],
    originItems: [],
    newTopicItem: { title: '', explanation: '' },
    inputValidData: [],
    loadedTopicCnt: 0,
    totalTopicCnt: 0,
  };

  state = {
    addModalVisible: false,
    qrVisible: false,
    getTopicInfo: false,
    didSort: false,
    didSearch: false,
    loading: false,
  };

  async topicDynamicLoading() {
    this.data.totalTopicCnt = await this.props.contracts.topicRegistry.getTotal();
    this.props.contracts.topicRegistry.getAllTopic({
      handler: ret => this.handleAdd(ret),
      cb: () => {this.data.loadedTopicCnt = this.data.totalTopicCnt; this.setState({loading: true});}
    });
  }

  componentDidMount() {
    this.topicDynamicLoading();
  }

  handleAdd = async (m) => {
    ++this.data.loadedTopicCnt;
    if (! m) return;

    this.data.items = [...this.data.items, util.refine(m)];
    this.data.originItems = this.data.items;
    this.setState({ getTopicInfo: true });
  }

  handleSorting = (e) => {
    let sortData = [];
    switch(e.target.value) {
      case 'All':
        sortData = this.data.originItems;  break;
      case 'Pre-fixed':
        this.data.originItems.forEach(element => { if (element.id < 1025) sortData.push(element) }); break;
      case 'Added':
        this.data.originItems.forEach(element => { if (element.id > 1024) sortData.push(element) }); break;
      default: break;
    }
    this.data.items = sortData;
    this.setState({ didSort: true });
  }

  updateNewTopicInfo = (e) => {
    switch (e.target.id) {
      case 'title':
      case 'explanation':
        if (util.isValidLength(e.target.value) > 32) {
          message.error('Input exceeds maximum range!');
          e.target.style.borderColor = 'red';
          e.target.value = this.data.inputValidData[e.target.id];
        } else e.target.style.borderColor = '#3db389';

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
      if (! this.data.newTopicItem[key]) formCheck = false;
    });
    if (formCheck) this.setState({ qrVisible: true });
    else message.error('Failed cause red box or Select at least one topic!');
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
          <h4 style={{ margin: '10px 0' }}>Registered on: {record.createdAt}</h4><hr />
          <h4 style={{ margin: '10px 0 0 0' }}>Explanation: {record.explanation}</h4><hr />
          <h4 style={{ margin: '10px 0' }}>Creator : Metadium / {record.issuer}</h4><hr />
        </div>
      ),
      onOk() {}
    });
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
          <div>
            <center><h1>Scan QR Code to Add New Topic</h1></center>
            <center><div style={{ marginTop: '10%' }}>
              <SendTransaction
                id='sendTransaction'
                request={this.props.contracts.topicRegistry.registerTopic(Buffer.from(this.data.newTopicItem.title), Buffer.from(this.data.newTopicItem.explanation))}
                usage='registerTopic'
                service='metagate'
                callbackUrl='none'
                qrsize={256}
              />
              <h2 style={{ marginTop: '6%' }} >Title: {this.data.newTopicItem.title}</h2>
              <h2>No.: {this.data.newTopicItem['id']}</h2>
            </div></center>
          </div>
          :
          <div>
            <Row>
              <Col span={12}>
                <Form.Item label='Title' style={{ marginBottom: '0px' }}>
                  <Input id='title' onChange={this.updateNewTopicInfo} placeholder='Input Title' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='No' style={{ float: 'right', marginBottom: '0px' }}>
                  <Input id='topic' onChange={this.updateNewTopicInfo} placeholder='Input Topic ID' disabled={true} />
                </Form.Item>
              </Col>
            </Row>
            <p style={{ float: 'right', color: 'red' }}>* No. in user / choose different No</p>
            <Form layout='vertical' style={{ margin: '30px 0' }}>
              <Form.Item label='Explanation'>
                <Input.TextArea
                  onChange={this.updateNewTopicInfo}
                  placeholder='Input Explanation (max. 32 bytes)'
                  autosize={{ minRows: 1, maxRows: 1 }}
                  id='explanation'
                />
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
            onChange={e => this.onSearch(e.target.value)}
            onSearch={value => this.onSearch(value)}
            enterButton
            style={{ width: '50%', float: 'right', marginBottom: '20px' }}
          />
        </div>
        <Radio.Group style={{ margin: '10px 0' }} onChange={this.handleSorting}>
          <Radio.Button value='All'>All</Radio.Button>
          <Radio.Button value='Pre-fixed'>Pre-fixed</Radio.Button>
          <Radio.Button value='Added'>Added</Radio.Button>
        </Radio.Group>
        <br />
        <Progress type='line' percent={ (this.data.loadedTopicCnt / this.data.totalTopicCnt) * 100 } /><br /><br />
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

export {Topic};
