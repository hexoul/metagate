import React from 'react';
import { Table, Input, Modal, Button, Radio, Form } from 'antd';
import * as util from '../util';
import { columns } from './columns'
import web3 from '../ethereum/web3';

const tableColumns = columns.topicColumns;
var newTopicData = [];

class Topic extends React.Component {
  data= {
    items: [],
    originItems: [],
  }
  state = {
    addModalVisible: false,
    qrVisible: false,
    getTopicInfo: false,
    isSort: false,
    isSearch: false,
  };

  async topicDynamicLoading() {
    this.props.contracts.topicRegistry.getAllTopic({
      handler: (ret) => { this.handleAdd(ret); console.log(ret); },
      cb: () => { this.data.originItems = this.data.items }
    });
  }

  componentDidMount() {
    this.topicDynamicLoading();
  }

  handleAdd = (result) => {
    let newItem = {};
    tableColumns.map(({ key }) => {
      switch (key) {
        // case 'title':
        case 'explanation':
          newItem[key] = util.convertHexToString(result[key]);
          break;
        case 'claimTopics':
          break;
        case 'reward': 
          newItem[key] = web3.utils.fromWei(result[key], 'ether');
          break;
        case 'createdAt':
          newItem[key] = util.timeConverter(Date(result[key]));
          break;
        default:
          if (result[key]) newItem[key] = result[key];
          else newItem[key] = '';
          break;
      }
    });
    this.data.items = [...this.data.items, newItem];
    this.setState({ getTopicInfo: true });
  }

  handleSorting = (e) => {
    let sortData=[];
    switch(e.target.value) {
      case 'All':
        sortData = this.data.originItems;
        break;
      case 'Pre-fixed':
        this.data.originItems.forEach(function(element) {
          if(Object.values(element)[1]<1025) { sortData.push(element); }
        });
        break;
      case 'Added':
        this.data.originItems.forEach(function(element) {
          if(Object.values(element)[1]>1024) { sortData.push(element); }
        });
        break;
      default: break;
    }
    this.data.items = sortData;
    this.setState({isSort: true});
  }

  handleChange = (e) => {
    newTopicData[e.target.id] = e.target.value;
  }

  onSearch(value) {
    let searchedData = [];
    value = value.toString().toLowerCase();
    
    if (! value) { this.data.items = this.data.originItems; return; }

    this.data.originItems.forEach(function(element) {
      let columns = Object.values(element);
      for (var i=0; i < columns.length; i++) {
        if (columns[i].toString().toLowerCase().includes(value)) {
          searchedData.push(element);
          return;
        }
      }
    });
    this.setState({ isSearch: true });
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
          <h5 style={{ float: 'right' }}>Registered on: {record.createAt}</h5>
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
          <div>
            {Object.keys(newTopicData).map(key => { return key + ':' + newTopicData[key] + ` // `; })}
          </div>
          :
          <div>
            <Form layout='inline'>
              <Form.Item label='Title'>
                <Input id='title' onChange={this.handleChange} placeholder='Input Title' />
              </Form.Item>
              <Form.Item style={{ float: 'right'}} label='No'>
                <Input id='topic' onChange={this.handleChange} placeholder='Input Topic ID' disabled={true}/>
              </Form.Item>
            </Form>
            <p style={{ float: 'right', color: 'red'}}>* No. in user / choose different No</p>
            <Form layout='vertical' style={{ margin: '30px 0'}}>
              <Form.Item label='Explanation'>
                <Input.TextArea onChange={this.handleChange} placeholder='Input Explanation (max. 32 bytes)'
                  autosize={{ minRows: 2, maxRows: 6 }}
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
            onChange={this.onSearchInputChange}
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
          rowKey="uid"
          onRow={(record, index) => ({
            onClick: () => { this.getModalTopicDetail(record); }
          })}
          columns={tableColumns}
          dataSource={this.data.items}
        />
        {this.getModalAddTopic()}
      </div>
    );
  }
}

export {Topic};