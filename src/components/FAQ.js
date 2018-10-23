import React from 'react';
import { Input, Collapse } from 'antd';
import faqContents from './faqContent';

class FAQ extends React.Component {
  data = {
    items: [],
    originItems: [],
  }

  state = {
    didSearch : false,
  }

  constructor(props) {
    super(props);
    this.initFaqData();
  }

  initFaqData() {
    for (var i=0; i < faqContents.length; i++) {
      this.data.originItems.push(
        <Collapse.Panel header={faqContents[i].title} key={i}>
          <p>{faqContents[i].content}</p>
        </Collapse.Panel>
      );
    }
    this.getFaqOriginData();
  }

  getFaqOriginData() {
    this.data.items = this.data.originItems;
  }

  onSearch(value) {
    if (! value) {
      this.getFaqOriginData();
      return this.setState({ didSearch: true });
    }

    var searchedData = [];
    faqContents.forEach(function(element) {
      if (! element.title.toLowerCase().includes(value)
          && ! element.content.toLowerCase().includes(value)) {
        return;
      }
      searchedData.push(
        <Collapse.Panel header={element.title}>
          <p>{element.content}</p>
        </Collapse.Panel>);
    });
    this.data.items = searchedData;

    this.setState({ didSearch: true });
  }

  onSearchInputChange = (e) => {
    this.onSearch(e.target.value);
  }

  render() {
    return (
      <div>
        <h1><b>FAQ</b></h1>
        <br />
        <Input.Search
          placeholder='Search by Topic, Keywords or Phrase'
          onChange={this.onSearchInputChange}
          onSearch={value => this.onSearch(value)}
          enterButton
          style={{ width: '80%', marginBottom: '20px' }}
        />
        <Collapse
          accordion
          style={{margin: '20px 0' }}
        >
          {this.data.items}
        </Collapse>
      </div>
    );
  }
}

export {FAQ};