import web3 from '../web3';
import web3config from '../web3-config.json';
import { getAddresses } from './addresses';
import { getBranch, getABI } from './helpers';

export default class AchievementManager {
  async init() {
    const { ACHIEVEMENT_MANAGER_ADDRESS } = getAddresses(web3config.netid);
    const branch = getBranch(web3config.netid);

    const achievementManagerAbi = await getABI(branch, 'AchievementManager');
    this.achievementManagerInstance = new web3.eth.Contract(achievementManagerAbi.abi, ACHIEVEMENT_MANAGER_ADDRESS);
  }
}