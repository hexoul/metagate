# Gateway

[![License](http://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/hexoul/metagate/master/LICENSE)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> Entrypoint to use ERC721, 725, 735 by registering identity, topic and achievement.

## Web3

Before compiling, `src/ethereum/web3-config.json` should be provided following spec described in `web3.js`.
Here is example:
```
{
  "netid": "ropsten",
  "url": "https://ropsten.infura.io",
  "addr": "0xA408FCD6B7f3847686Cb5f41e52A7f4E084FD3cc",
  "privkey": "11111111111111111111111111111111111111111111",
  "identity": "0x7304f14b0909640acc4f6a192381091eb1f37701"
}
```

## Preview

```bash
$ npm install
$ npm start
```

## Deploy

```bash
$ npm run build
$ npm install -g serve
$ serve -l 3002 -s build
```

## What more

- [antd](http://github.com/ant-design/ant-design/)
- [babel-plugin-import](http://github.com/ant-design/babel-plugin-import/)
- [create-react-app](https://github.com/facebookincubator/create-react-app)
- [react-app-rewired](https://github.com/timarney/react-app-rewired)
- [less-loader](https://github.com/webpack/less-loader)
