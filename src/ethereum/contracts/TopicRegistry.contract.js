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

  async getTopic(topicID) {
    // Validate ABI
    if (! this.topicRegistryInstance.methods.topics) {
      return null;
    }

    // Call
    return this.topicRegistryInstance.methods.topics(topicID).call();
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async test(id) {
    await this.sleep(id*1000);
    return {
      id: id,
      issuer: '0xA408FCD6B7f3847686Cb5f41e52A7f4E084FD3cc',
      explanation: Buffer.from('explanation')
    };
  }

  async getAllTopic(handler, cb) {
    Promise.all(_.range(5).map(async (id) => {
      await this.test(id).then(id => console.log('go', id));
    })).then(() => cb());
  }
}

export {TopicRegistry}