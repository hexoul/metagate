import { constants } from '../constants';
import { addressesURL, wrongRepoAlert } from './helpers';

let TESTNET_ADDRESSES = {};

async function getContractsAddresses(branch) {
  let addr = addressesURL(branch);
  let response;
  try {
    response = await fetch(addr);
  } catch (e) {
    return wrongRepoAlert(addr);
  }

  let contracts = await response.json()
  console.log('contract addresses', contracts);

  switch (branch) {
    case 'testnet':
      TESTNET_ADDRESSES = contracts;
      break;
    default:
      TESTNET_ADDRESSES = contracts;
      break;
  }
}

function getAddresses(netId) {
  switch (netId) {
    case constants.NETID_TESTNET:
      return TESTNET_ADDRESSES;
    default:
      return TESTNET_ADDRESSES;
  }
}

export {
  getContractsAddresses,
  getAddresses
}