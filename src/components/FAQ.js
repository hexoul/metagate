import React from 'react';
import { Input, Collapse } from 'antd';

import faqContents from './faqContent';

class FAQ extends React.Component {

  data = {
    items: [],
    originItems: [],
  };

  state = {
    didSearch : false,
  };

  constructor(props) {
    super(props);
    this.initFaqData();
  }

  initFaqData() {
    for (var i=0; i < faqContents.length; i++) {
      this.data.originItems.push(<Collapse.Panel header={faqContents[i].title} key={i}>{faqContents[i].content}</Collapse.Panel>);
    }
    this.getFaqOriginData();
  }

  getFaqOriginData = () => this.data.items = this.data.originItems;

  onSearch(value) {
    var regex = new RegExp(value, 'i');
    if (! value) this.getFaqOriginData();
    else {
      var searchedData = [];
      faqContents.filter(element => Object.values(element).filter(val => val.toString().match(regex)).length > 0)
        .forEach(ret => searchedData.push(<Collapse.Panel header={ret.title} key={ret.title}>{ret.content}</Collapse.Panel>));
      this.data.items = searchedData;
    }
    this.setState({ didSearch: true });
  }

  onSearchInputChange = (e) => this.onSearch(e.target.value);

  render() {
    return (
      <div>
        <h1><b>FAQ</b></h1><br />
        <Input.Search
          placeholder='Search by Topic, Keywords or Phrase'
          onChange={this.onSearchInputChange}
          onSearch={value => this.onSearch(value)}
          enterButton
          style={{ width: '80%', marginBottom: '20px' }}
        />
        <Collapse accordion style={{ margin: '20px 0' }}>
          {this.data.items}
        </Collapse>
      </div>
    );
  }
}

export {FAQ}