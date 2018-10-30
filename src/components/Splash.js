import React from 'react';

class Splash extends React.Component {

  render() {
    return (
      <center>
        <img alt='logo' src='https://github.com/METADIUM/metadium-token-contract/blob/master/misc/Metadium_Logo_Vertical_PNG.png?raw=true' />
        <br/><h1><b>METAGATE</b></h1><br />
        <h2>Search, Identify and Register</h2><br />
        <div onClick={() => this.props.onClick()}>
          <h2><p style={{ color: 'blue' }}>How to use?</p></h2>
        </div>
      </center>
    );
  }
}

export {Splash};