import React from 'react';
import { Table, List, Input, Modal, Row, Col, Progress } from 'antd';

import {columns} from './columns';
import * as util from '../util';

const tableColumns = columns.userColumns;
const detailColumns = columns.userDetailColumns;

class User extends React.Component {

  data = {
    items: [],
    originItems: [],
    topics: [],
    achivements: [],
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

  onSearch(value) {
    var regex = new RegExp(value, 'i');
    if (! value) this.data.items = this.data.originItems;
    else this.data.items = this.data.originItems.filter(element => Object.values(element).filter(val => val.toString().match(regex)).length > 0);
    this.setState({ didSearch: true });
  }

  getModalUserDetail(record) {
    record.topics = this.data.topics.filter(val => val.issuer === record.addr);
    record.achivements = this.data.achivements.filter(val => val.creator === record.addr).map(val => val.title);
    Modal.info({
      width: '70%',
      maskClosable: true,
      title: record.title,
      content: (
        <div>
          <h5 style={{ margin: '10px 0', float: 'right' }}>Registered on: {record.createdAt}</h5><br />
          <h4 style={{ margin: '10px 0' }}>Explanation: {record.explanation}</h4>
          <h4 style={{ margin: '10px 0' }}>Meta ID: {record.addr}</h4>
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
          rowKey={record => record.addr}
          onRow={(record, index) => ({ onClick: () => this.getModalUserDetail(record) })}
          columns={tableColumns}
          dataSource={this.data.items}
        />
      </div>
    );
  }
}

export {User}