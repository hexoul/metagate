import React from 'react';
import { Table, Input, Modal, Button, Radio, Form, Row, Col, message } from 'antd';
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
  };

  state = {
    addModalVisible: false,
    qrVisible: false,
    getTopicInfo: false,
    isSort: false,
    isSearch: false,
  };

  async topicDynamicLoading() {
    this.props.contracts.topicRegistry.getAllTopic({
      handler: ret => this.handleAdd(ret),
      cb: () => {}
    });
  }

  componentDidMount() {
    this.topicDynamicLoading();
  }

  handleAdd = async (m) => {
    this.data.items = [...this.data.items, util.refine(m)];
    this.data.originItems = this.data.items;
    this.setState({ getTopicInfo: true });
  }

  handleSorting = (e) => {
    let sortData = [];
    switch(e.target.value) {
      case 'All':
        sortData = this.data.originItems;
        break;
      case 'Pre-fixed':
        this.data.originItems.forEach(element => {
          if (Object.values(element)[1] < 1025) sortData.push(element);
        });
        break;
      case 'Added':
        this.data.originItems.forEach(element => {
          if (Object.values(element)[1] > 1024) sortData.push(element);
        });
        break;
      default: break;
    }
    this.data.items = sortData;
    this.setState({ isSort: true });
  }

  handleInputChange = (e) => {
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
    if (! value) this.data.items = this.data.originItems;
    else this.data.items = this.data.originItems.filter(element => Object.values(element).filter(val => val.toString().toLowerCase().includes(value.toLowerCase())).length > 0);
    this.setState({ isSearch: true });
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
            {Object.keys(this.data.newTopicItem).map(key => { return key + ':' + this.data.newTopicItem[key] + ` // `; })}
            <SendTransaction
              id='sendTransaction'
              request={this.props.contracts.topicRegistry.registerTopic(Buffer.from(this.data.newTopicItem.title), Buffer.from(this.data.newTopicItem.explanation))}
              usage='registerTopic'
              service='metagate'
              callbackUrl='none'
            />
          </div>
          :
          <div>
            <Row>
              <Col span={12}>
                <Form.Item label='Title' style={{ marginBottom: '0px'}}>
                  <Input id='title' onChange={this.handleInputChange} placeholder='Input Title' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='No' style={{ float: 'right', marginBottom: '0px'}}>
                  <Input id='topic' onChange={this.handleInputChange} placeholder='Input Topic ID' disabled={true}/>
                </Form.Item>
              </Col>
            </Row>
            <p style={{ float: 'right', color: 'red'}}>* No. in user / choose different No</p>
            <Form layout='vertical' style={{ margin: '30px 0'}}>
              <Form.Item label='Explanation'>
                <Input.TextArea onChange={this.handleInputChange} placeholder='Input Explanation (max. 32 bytes)'
                  autosize={{ minRows: 1, maxRows: 2 }}
                  id='explanation' />
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
            onChange={ (e) => this.onSearch(e.target.value) }
            onSearch={value => this.onSearch(value)}
            enterButton
            style={{ width: '50%', float: 'right', marginBottom: '20px' }}
          />
        </div>
        <Radio.Group style={{margin: '10px 0'}} onChange={this.handleSorting}>
          <Radio.Button value='All'>All</Radio.Button>
          <Radio.Button value='Pre-fixed'>Pre-fixed</Radio.Button>
          <Radio.Button value='Added'>Added</Radio.Button>
        </Radio.Group>
        <br />
        <Table
          rowKey={record => record.uid}
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