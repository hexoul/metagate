import React from 'react';

class Splash extends React.Component {

  render() {
    return (
      <center>
        <img alt='logo' src='https://github.com/METADIUM/metadium-token-contract/blob/master/misc/Metadium_Logo_Vertical_PNG.png?raw=true' />
        <br/><h1><b>METAGATE</b></h1><br />
        <h2>Search, Identify and Register<br />
        {/* eslint-disable-next-line */}
        <a onClick={() => this.props.onClick()}>How to use?</a></h2>
      </center>
    );
  }
}

export {Splash}