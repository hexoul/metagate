import React from 'react';
import { Table } from 'antd';

var structArr = [];
var typeArr = ['Personal', 'Institution'];
var titleArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
var rollArr = ['Attestation Agency', 'Service Provider'];
var metaidArr = ['0x1111111', '0x1111112','0x1111113','0x1111114', '0x1111115','0x1111116'];
var registerdate;

const columns = [{
  title: 'Type',
  dataIndex: 'type',
  sorter: (a, b) => a.type.length - b.type.length,
  width: '10%',
  }, {
  title: 'Title',
  dataIndex: 'title',
  render: text => <a href="https://github.com/hexoul/metagate">{text}</a>
  }, {
  title: 'Roll',
  dataIndex: 'roll',
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
  width: '30%',
  }, {
  title: 'Registered on',
  dataIndex: 'registerDate',
  }];

class User extends React.Component {
   state = {
     data: [],
   };

  // handleTableChange = (pagination, filters, sorter) => {
  //   const pager = { ...this.state.pagination };
  //   pager.current = pagination.current;
  //   this.setState({
  //     pagination: pager,
  //   });
  //   console.log(pagination,filters,sorter);
  //   this.fetch({
  //     results: pagination.pageSize,
  //     page: pagination.current,
  //     sortField: sorter.field,
  //     sortOrder: sorter.order,
  //     ...filters,
  //   });
  // }

  // fetch = (params = {}) => {
  //   console.log('params:', params);
  //   this.setState({ loading: true });
  //   reqwest({
  //     url: 'https://randomuser.me/api',
  //     method: 'get',
  //     data: {
  //       results: 10,
  //       ...params,
  //     },
  //     type: 'json',
  //   }).then((data) => {
  //     const pagination = { ...this.state.pagination };
  //     // Read total count from server
  //     // pagination.total = data.totalCount;
  //     pagination.total = 200;
  //     this.setState({
  //       loading: false,
  //       data: data.results,
  //       pagination,
  //     });
  //   });
  // }

  componentDidMount() {
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

  //   const pagination = { ...this.state.pagination };
  //     // Read total count from server
  //     // pagination.total = data.totalCount;
  //     pagination.total = 200;
  //     this.setState({
  //       loading: false,
  //       data: structArr,
  //       pagination,
  //     });
  // }
  onChange(pagination, filters, sorter) {
    console.log('params', pagination, filters, sorter);
  }
  render() {
    console.log(structArr);
    return (
      <Table
        columns={columns}
        dataSource={this.state.data}
        onChange={this.onChange}
      />
    );
  }
}

export {User};