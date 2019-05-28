import Web3 from 'web3'
/**
 * web3-config.json includes:
 *   - netid
 *   - url
 *   - addr
 *   - privkey
 *   - identity
 */
import web3config from './web3-config.json'

const web3 = new Web3(new Web3.providers.HttpProvider(web3config.url))

export default web3
