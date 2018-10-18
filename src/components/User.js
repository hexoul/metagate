import React from 'react';
import { Table, Input, Modal, List } from 'antd';

var storedData = [];
var typeArr = ['Personal', 'Institution'];
var titleArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
var rollArr = ['Attestation Agency', 'Service Provider'];
var metaidArr = ['0x7304f14b0909640acc4f6a192381091eb1f37701', '0x7304f14b0909640acc4f6a192381091eb1f37702',  
                 '0x7304f14b0909640acc4f6a192381091eb1f37703', '0x7304f14b0909640acc4f6a192381091eb1f37704',
                 '0x7304f14b0909640acc4f6a192381091eb1f37705', '0x7304f14b0909640acc4f6a192381091eb1f37706'];
var registerdate;

const Search = Input.Search;

const columns = [{
                    title: 'Type',
                    dataIndex: 'type',
                    key: 'type',
                    sorter: (a, b) => a.type.length - b.type.length,
                    width: '10%',
                  }, {
                    title: 'Title',
                    dataIndex: 'title',
                    key: 'title',
                    width: '10%',
                  }, {
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
                  }, {
                    title: 'MetaID',
                    dataIndex: 'metaID',
                    key: 'metaID',
                    width: '30%',
                  }, {
                    title: 'Registered on',
                    dataIndex: 'registerDate',
                    key: 'registerDate',
                }];

  const listData = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
  ];

class User extends React.Component {
  state = {
    data: [],
    modalVisible: false,
    type: '',
    title: '',
    roll: '',
    metaID: '',
    registerDate: '',
  }

  showModal = (record) => {
    this.setState({
      modalVisible: true,
      type: record.type,
      title: record.title,
      roll: record.roll,
      metaID: record.metaID,
      registerDate: record.registerDate,
    });
  }

  handleOk = (e) => {
    console.log(e);
    this.setState({
      modalVisible: false,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      modalVisible: false,
    });
  }

  componentWillMount() {
    console.log('componentWillMount');
    this.initialize();
  }

  initialize() {
    var i;
    for (i=0; i<20; i++) {
      //Get data (hardcoding)
      storedData.push({
        type: typeArr[Math.floor((Math.random() * 10)/9)],
        title: titleArr[Math.floor(Math.random() * 6)],
        roll: rollArr[Math.floor((Math.random() * 10)/9)],
        metaID: metaidArr[Math.floor(Math.random() * 6)],
        registerDate: Date.now() - Math.floor((Math.random()*10)),
      });
    }
    this.setState({data: storedData});
  }

  onSearch(value) {
    console.log('onSearch value: ',value);
    if (value == '' || value == undefined) {
      this.setState({data: storedData});
    }
    else {
      var searchData = [];
      storedData.forEach(function(element) {
        //Exist value
        if(Object.values(element).indexOf(value) > -1) {
          console.log('onSearch1: ',Object.values(element).indexOf(value));
          searchData.push(element);
        }
      });
      this.setState({data: searchData});
    }
  }

  render() {
    return (
      <div>
        <Search
          placeholder="Search by Type, Meta ID, Title"
          onSearch={value => this.onSearch(value)}
          enterButton
          style={{ width: 500, float: 'right', marginBottom: '20px' }}
        />
        <br />
        <Modal
          title={this.state.title}
          visible={this.state.modalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}>
          <div>
            <h5 style={{ margin: '10px 0', float: 'right' }}>Registered on: {this.state.registerDate}</h5>
            <h3 style={{ margin: '10px 0' }}>Roll: {this.state.roll}</h3>
            <h3 style={{ margin: '10px 0' }}>Getting Explanation</h3>
            <h3 style={{ margin: '10px 0' }}>Meta ID: {this.state.metaID}</h3>
            <List
              size="small"
              header={<div><h2>Topic Created</h2></div>}
              bordered
              dataSource={listData}
              renderItem={item => (<List.Item>{item}</List.Item>)}
            />
            <br />
            <List
              size="small"
              header={<div><h2>Acheivement Created</h2></div>}
              bordered
              dataSource={listData}
              renderItem={item => (<List.Item>{item}</List.Item>)}
            />
          </div>
        </Modal>
        <br />
        <Table
          rowKey={record => record.uid}
          onRow={(record, index) => ({
            onClick: () => { console.log('onRow', record); this.showModal(record); } 
          })}
          columns={columns}
          dataSource={this.state.data}
        />
      </div>
    );
  }
}

export {User};