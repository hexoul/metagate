import React from 'react';
import { Input, Collapse } from 'antd';
import faqContents from './faqContent';

class FAQ extends React.Component {
  data = {
    children: [],
  }
  state = {
    isSearch : false,
  }

  constructor(props) {
    super(props);
    this.getFaqData();
  }

  getFaqData() {
    this.data['children'].splice(0,this.data['children'].length);

    for (var i=0; i < faqContents.length; i++) {
      this.data['children'].push(
        <Collapse.Panel header={faqContents[i].title} key={i}>
          <p>{faqContents[i].content}</p>
        </Collapse.Panel>
      );
    }
  }

  onSearch(value) {
    if (value == '' || value == undefined) {
      this.getFaqData();
    } else {
      var searchData = [];
      faqContents.forEach(function(element) {
        //Exist value
        if (element.title.toLowerCase().includes(value) || element.content.toLowerCase().includes(value)) {
          searchData.push(
            <Collapse.Panel header={element.title}>
              <p>{element.content}</p>
            </Collapse.Panel>);
        }
      });
      this.data['children']=searchData;
    }
    this.setState({isSearch: true});
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
        <Collapse accordion
          style={{margin: '20px 0' }}>
            {this.data['children']}
        </Collapse>
      </div>
    );
  }
}

export {FAQ};