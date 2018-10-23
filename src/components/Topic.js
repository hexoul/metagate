import React from 'react';
import { Table, Input, Modal, Button, Radio, Form } from 'antd';
import * as util from '../util';
import {columns} from './columns'

const tableColumns = columns.topicColumns;
var newTopicData = [];

class Topic extends React.Component {
  state = {
    items: [],
    originItems: [],
    addModalVisible: false,
    qrVisible: false,
    rowCount: 0,
  };

  async topicDynamicLoading() {
    this.props.contracts.topicRegistry.getAllTopic({
      handler: (ret) => this.handleAdd(ret),
      cb: () => this.state.originItems = this.state.items
    });
  }

  componentDidMount() {
    this.topicDynamicLoading();
  }

  handleAdd = (result) => {
    const newItem = {
      key: this.state.rowCount,
      topicID: result.id,
      issuer: result.issuer,
      title: new TextDecoder("utf-8").decode(result.explanation),
      explanation: new TextDecoder("utf-8").decode(result.explanation),
      registerDate: util.timeConverter(Date.now()),
    };

    this.setState({
      items: [...this.state.items, newItem],
      rowCount: this.state.rowCount+1,
    });
  }

  handleSorting = (e) => {
    let sortData=[];
    switch(e.target.value) {
      case 'All':
        this.setState({items: this.state.originItems});
        break;
      case 'Pre-fixed':
        this.state.originItems.forEach(function(element) {
          if(Object.values(element)[0]<1025) {
            sortData.push(element);
          }
        });
        this.setState({items: sortData});
        break;
      case 'Added':
        this.state.originItems.forEach(function(element) {
          if(Object.values(element)[0]>1024) {
            sortData.push(element);
          }
        });
        this.setState({items: sortData});
        break;
      default: break;
    }
  }

  handleChange = (e) => {
    newTopicData[e.target.id] = e.target.value;
  }

  onSearch(value) {
    let searchedData = [];
    value = value.toString().toLowerCase();
    
    if (! value) {
      this.setState({items: this.state.originItems});
      return;
    }

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
              <Form.Item label="Title">
                <Input
                  onChange={this.handleChange} 
                  id='title'
                  placeholder="Input Title"/>
              </Form.Item>
              <Form.Item style={{ float: 'right'}} label="No">
                <Input 
                  onChange={this.handleChange} 
                  id='topic'
                  placeholder="Input Reward"/>
              </Form.Item>
            </Form>

            <p style={{ float: 'right', color: 'red'}}>* No. in user / choose different No</p>

            <Form layout='vertical'style={{ margin: '30px 0'}}>
              <Form.Item label="Explanation">
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
          dataSource={this.state.items}
        />
        {this.getModalAddTopic()}
      </div>
    );
  }
}

export {Topic};