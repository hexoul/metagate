import React from 'react';
import { Input } from 'antd';
import Collapsible from 'react-collapsible';
import { getGithubContents } from '../util';
import styles from '../components/style/style.css'

class FAQ extends React.Component {

  data = {
    items: [],
    originItems: [],
    faqTitle: '',
    activeKey: '',
  };

  state = {
    didSearch : false,
    initContents: false,
  };

  constructor(props) {
    super(props);
    this.data.faqTitle = this.props.faqTitle;
    this.initFaqData();
  }

  async initFaqData() {
    this.faqContents = await getGithubContents('JeongGoEun', 'metagate_faq', 'master', 'FaqContents.json');
    for (var i=0; i < this.faqContents.length; i++) {
      var contents = [];
      if (this.data.faqTitle === this.faqContents[i].title) this.data.activeKey = i.toString();
      this.faqContents[i].content.forEach((item, index) => {contents.push(<p key={index.toString()+i.toString()}>{item}</p>)});
      this.faqContents[i].content = contents;
      this.data.originItems.push(<Collapsible className={styles.Collapsible} trigger={this.faqContents[i].title} tabIndex={i} key={i}>{this.faqContents[i].content}</Collapsible>);
    }
    this.getFaqOriginData();
  }

  getFaqOriginData = () => { 
    this.data.items = this.data.originItems; this.setState({ initContents: true });
  }

  onSearch(value) {
    var regex = new RegExp(value, 'i');
    if (! value) this.getFaqOriginData();
    else {
      var searchedData = [];
      this.faqContents.filter(element => Object.values(element).filter(val => val.toString().match(regex)).length > 0)
        .forEach(ret => searchedData.push(<Collapsible trigger={ret.title} tabIndex={ret.tabIndex} key={ret.title}>{ret.content}</Collapsible>));
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
        <div style={{ marginBottom: '20px' }}>
         {this.data.items}  
        </div>
      </div>
    );
  }
}

export {FAQ}