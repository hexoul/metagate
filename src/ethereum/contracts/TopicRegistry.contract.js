import web3 from '../web3';
import web3config from '../web3-config.json';
import { getAddresses } from './addresses';
import { getBranch, getABI } from './helpers';

var _ = require('underscore');

class TopicRegistry {
  async init() {
    const { TOPIC_REGISTRY_ADDRESS } = getAddresses(web3config.netid);
    const branch = getBranch(web3config.netid);

    const topicRegistryAbi = await getABI(branch, 'TopicRegistry');
    this.topicRegistryInstance = new web3.eth.Contract(topicRegistryAbi.abi, TOPIC_REGISTRY_ADDRESS);
  }

  async isRegistered(topicID) {
    // Validate ABI
    if (! this.topicRegistryInstance.methods.isRegistered) return;

    // Call
    return this.topicRegistryInstance.methods.isRegistered(topicID).call();
  }

  async getTopic(topicID) {
    // Validate ABI
    if (! this.topicRegistryInstance.methods.getTopic) return;

    // Call
    return this.topicRegistryInstance.methods.getTopic(topicID).call();
  }

  async getAllTopic({handler, cb}) {
    if (! handler || ! cb) return;
    
    // NOTE: range and topicID will be fixed after test
    Promise.all(_.range(20).map(async (id) => {
      let topicID = id + 1020;
      // Execute handler from getTopic() when a topic was registered
      if (await this.isRegistered(topicID)) {
        await this.getTopic(topicID).then(ret => { ret['id'] = topicID; handler(ret); });
      }
    })).then(() => cb());
  }
}

export {TopicRegistry}