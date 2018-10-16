import web3 from '../web3';
import web3config from '../web3-config.json';
import { getAddresses } from './addresses';
import { getBranch, getABI } from './helpers';

class IdentityManager {
  async init() {
    const { IDENTITY_MANAGER_ADDRESS } = getAddresses(web3config.netid);
    const branch = getBranch(web3config.netid);

    const identityManagerAbi = await getABI(branch, 'IdentityManager');
    this.identityManagerInstance = new web3.eth.Contract(identityManagerAbi.abi, IDENTITY_MANAGER_ADDRESS);
  }
}

export {IdentityManager}