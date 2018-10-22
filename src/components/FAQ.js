import React from 'react';
import { Input, Collapse } from 'antd';
import faqContents from './faqContent';

class FAQ extends React.Component {
  constructor(props) {
    super(props);
  }

  onSearch(value) {
  }

  getCollapseComponent() {
    var children = [];
  
    for (var i=0; i < faqContents.length; i++) {
      children.push(
        <Collapse.Panel header={faqContents[i].title} key={i}>
          <p>{faqContents[i].content}</p>
        </Collapse.Panel>
      );
    }
    console.log('getCollapseComponent: ',children);
    return children;
  }

  render() {
    return (
      <div>
        <h1><b>FAQ</b></h1>
        <br />
        <Input.Search
          placeholder='Search by Topic, Keywords or Phrase'
          onSearch={value => this.onSearch(value)}
          enterButton
          style={{ width: '80%', marginBottom: '20px' }}
        />
        <Collapse accordion
          style={{margin: '20px 0' }}>
            {this.getCollapseComponent()}
        </Collapse>
      </div>
    );
  }
}

export {FAQ};