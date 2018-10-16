import web3, { signTx, getTxDataWoNonce } from '../web3';
import web3config from '../web3-config.json';
import { getBranch, getABI } from './helpers';

const ethUtil = require('ethereumjs-util');

class Identity {
  async init() {
    const branch = getBranch(web3config.netid);

    this.identityAbi = await getABI(branch, 'Identity');
    this.identityInstance = new web3.eth.Contract(this.identityAbi.abi, web3config.addr);
  }

  /**
   * @param {addr} string
   * @param {topic} uint256
   * @param {scheme} uint256 // 1: ECDSA_SCHEME, 2: RSA_SCHEME
   * @param {data} bytes
   * @param {signature} bytes
   * @param {uri} string
   */
  addClaim({ addr, topic, scheme, uri }) {
    const data = 'data';
    const bData = ethUtil.hashPersonalMessage(new Buffer(data, 'hex'));
    
    const claim = this.identityInstance.methods.claimToSign(web3config.addr, topic, bData).encodeABI();
    const signature = signTx(getTxDataWoNonce(addr, claim));
    return this.identityInstance.methods.addClaim(topic, scheme, web3config.addr, signature, bData, uri).encodeABI();
  }
}

export {Identity}