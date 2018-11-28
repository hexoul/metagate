import web3 from '../web3';
import web3config from '../web3-config.json';
import { getAddresses } from './addresses';
import { getBranch, getABI } from './helpers';

var _ = require('underscore');

class AttestationAgencyRegistry {

  async init() {
    this.addresses = getAddresses(web3config.netid);
    const branch = getBranch(web3config.netid);

    const aaRegistryAbi = await getABI(branch, 'AttestationAgencyRegistry');
    this.aaRegistryInstance = new web3.eth.Contract(aaRegistryAbi.abi, this.addresses.ATTESTATION_AGENCY_REGISTRY_ADDRESS);
  }

  async isRegistered(addr) {
    // Validate ABI
    if (! this.aaRegistryInstance.methods.isRegistered) return;

    // Call
    return this.aaRegistryInstance.methods.isRegistered(addr).call();
  }

  async getAttestationAgencyNum() {
    // Validate ABI
    if (! this.aaRegistryInstance.methods.attestationAgencyNum) return;

    // Call
    return this.aaRegistryInstance.methods.attestationAgencyNum().call();
  }

  async getAttestationAgencySingle(idx) {
    // Validate ABI
    if (! this.aaRegistryInstance.methods.getAttestationAgencySingle) return;

    // Call
    return this.aaRegistryInstance.methods.getAttestationAgencySingle(idx).call();
  }

  async getAllAttestationAgencies({handler, cb}) {
    if (! handler || ! cb) return;

    // Search AAs with the range from zero to total
    let total = await this.getAttestationAgencyNum();
    Promise.all(_.range(total).map(async (idx) => {
      // Execute handler from getAttestationAgencySingle() when an AA was registered
      await this.getAttestationAgencySingle(idx).then(ret => handler(ret));
    })).then(() => cb());
  }

  /**
   * 
   * @param {address} addr 
   * @param {bytes32} title 
   * @param {bytes32} explanation 
   */
  registerAttestationAgency(addr, title, explanation) {
    // Validate ABI
    if (! this.aaRegistryInstance.methods.registerAttestationAgency) return;

    // Return transaction param
    return {
      to: this.addresses.ATTESTATION_AGENCY_REGISTRY_ADDRESS,
      data: this.aaRegistryInstance.methods.registerAttestationAgency(addr, title, explanation).encodeABI()
    };
  }
}

export {AttestationAgencyRegistry}