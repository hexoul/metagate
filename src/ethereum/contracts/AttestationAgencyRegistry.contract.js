import web3 from '../web3';
import web3config from '../web3-config.json';
import { getAddresses } from './addresses';
import { getBranch, getABI } from './helpers';

class AttestationAgencyRegistry {
  async init() {
    const { ATTESTATION_AGENCY_REGISTRY_ADDRESS } = getAddresses(web3config.netid);
    const branch = getBranch(web3config.netid);

    const aaRegistryAbi = await getABI(branch, 'AttestationAgencyRegistry');
    this.aaRegistryInstance = new web3.eth.Contract(aaRegistryAbi.abi, ATTESTATION_AGENCY_REGISTRY_ADDRESS);
  }
}

export {AttestationAgencyRegistry}