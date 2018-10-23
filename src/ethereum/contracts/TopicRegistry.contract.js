import web3 from '../web3';
import web3config from '../web3-config.json';
import { getAddresses } from './addresses';
import { getBranch, getABI } from './helpers';
import { sleep } from '../../util';

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
    if (! this.topicRegistryInstance.methods.topics) return;

    // Call
    return this.topicRegistryInstance.methods.topics(topicID).call();
  }

  async test(id) {
    await sleep(id*1000);
    return {
      id: id,
      issuer: '0xA408FCD6B7f3847686Cb5f41e52A7f4E084FD3cc',
      explanation: Buffer.from('explanation')
    };
  }

  async getAllTopic({handler, cb}) {
    if (! handler || ! cb) return;
    
    Promise.all(_.range(20).map(async (id) => {
      await this.test(id).then(id => handler(id));
    })).then(() => cb());
  }
}

export {TopicRegistry}