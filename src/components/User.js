import React from 'react';
import { Table, Input, Modal, List } from 'antd';

var structArr = [];
var typeArr = ['Personal', 'Institution'];
var titleArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
var rollArr = ['Attestation Agency', 'Service Provider'];
var metaidArr = ['0x1111111', '0x1111112','0x1111113','0x1111114', '0x1111115','0x1111116'];
var registerdate;
var user;

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
  }
  
  constructor(props) {
    super(props);
    user=this;
  }

  showModal = () => {
    this.setState({
      modalVisible: true,
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
    this.initialize();
  }

  initialize() {
    var i;
    for(i=0; i<20; i++) {
      //Get data (hardcoding)
      structArr.push({
        type: typeArr[Math.floor((Math.random() * 10)/9)],
        title: titleArr[Math.floor(Math.random() * 6)],
        roll: rollArr[Math.floor((Math.random() * 10)/9)],
        metaID: metaidArr[Math.floor(Math.random() * 6)],
        registerDate: Date.now() - Math.floor((Math.random()*10)),
      });
    }
    this.setState({data: structArr});
  }

  onChange(pagination, filters, sorter) {
    console.log('params', pagination, filters, sorter);
  }

  render() {
    return (
      <div>
        <Search
          placeholder="Search by Type, Meta ID, Title"
          onSearch={value => console.log(value)}
          enterButton
          style={{ width: 500, right: 0 }}
        />
        <br />
        <Modal
          title="getting title"
          visible={this.state.modalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}>
          <h3 style={{ margin: '16px 0' }}>AA or SP</h3>
          <h3 style={{ margin: '16px 0' }}>Explain</h3>
          <h3 style={{ margin: '16px 0' }}>MetaID</h3>
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
        </Modal>
        <br />
        <Table
          onRow={(record, index) => ({
            onClick: () => { console.log('onRow', record,index); this.showModal(); } 
          })}
          columns={columns}
          dataSource={this.state.data}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

export {User};