import React from 'react'
import { Input } from 'antd'
import Collapsible from 'react-collapsible'
import { getGithubContents } from '../util'
import styles from '../components/style/style.css'

class FAQ extends React.Component {
  data = {
    items: [],
    originItems: [],
    faqTitle: ''
  }

  state = {
    didSearch: false,
    initContents: false
  }

  constructor (props) {
    super(props)
    this.data.faqTitle = this.props.faqTitle
    this.initFaqData()
  }

  async initFaqData () {
    this.faqContents = await getGithubContents('JeongGoEun', 'metagate_faq', 'master', 'FaqContents.json')
    for (var i = 0; i < this.faqContents.length; i++) {
      let open = false
      if (this.data.faqTitle === this.faqContents[i].title) open = true
      this.data.originItems.push(this.getCollapsibleComp(open, this.faqContents[i].title, i, i, this.faqContents[i].content))
    }
    this.getFaqOriginData()
  }

  getCollapsibleComp = (open, trigger, tabIndex, key, content) => {
    return <Collapsible className={styles.Collapsible} transitionTime={200} open={open} trigger={trigger} tabIndex={tabIndex} key={key}><div dangerouslySetInnerHTML={{ __html: content }} /></Collapsible>
  }

  getFaqOriginData = () => {
    this.data.items = this.data.originItems; this.setState({ initContents: true })
  }

  onSearch (value) {
    var regex = new RegExp(value, 'i')
    if (!value) this.getFaqOriginData()
    else {
      var searchedData = []
      this.faqContents.filter(element => Object.values(element).filter(val => val.toString().match(regex)).length > 0)
        .forEach(ret => searchedData.push(<Collapsible trigger={ret.title} tabIndex={ret.tabIndex} key={ret.title}>{ret.content}</Collapsible>))
      this.data.items = searchedData
    }
    this.setState({ didSearch: true })
  }

  onSearchInputChange = (e) => this.onSearch(e.target.value);

  render () {
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
    )
  }
}

export { FAQ }
