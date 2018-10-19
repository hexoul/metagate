import React from 'react';
import { Input } from 'antd';

class FAQ extends React.Component {
  onSearch(value) {

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
          style={{ width: '80%', float: 'left', marginBottom: '20px' }}
        />
        <br />
      </div>
    );
  }
}

export {FAQ};