import web3 from '../web3';
import web3config from '../web3-config.json';
import { getAddresses } from './addresses';
import { getBranch, getABI } from './helpers';

var _ = require('underscore');

class AchievementManager {
  async init() {
    const { ACHIEVEMENT_MANAGER_ADDRESS } = getAddresses(web3config.netid);
    const branch = getBranch(web3config.netid);

    const achievementManagerAbi = await getABI(branch, 'AchievementManager');
    this.achievementManagerInstance = new web3.eth.Contract(achievementManagerAbi.abi, ACHIEVEMENT_MANAGER_ADDRESS);
  }

  async getAchievement(achievementID) {
    // Validate ABI
    if (! this.achievementManagerInstance.methods.achievements) return;

    // Call
    return this.achievementManagerInstance.methods.achievements(achievementID).call();
  }

  async getAllAchievements({handler, cb}) {
    if (! handler || ! cb) return;

    // Validate ABI
    if (! this.achievementManagerInstance.methods.getAllAchievementList) return;

    // Get achievement IDs
    var achievementIDs = await this.achievementManagerInstance.methods.getAllAchievementList().call();

    // Get achievement list by iterating IDs
    Promise.all(achievementIDs.map(async (id) => {
      await this.getAchievement(id).then(achievement => handler(achievement));
    })).then(() => cb());
  }

  async getAllAchievementsByLength({handler, cb}) {
    if (! handler || ! cb) return;

    // Validate ABI
    if (! this.achievementManagerInstance.methods.allAchievements
      || ! this.achievementManagerInstance.methods.getAchievementLength) return;

    // Get achievement list length
    let length = await this.achievementManagerInstance.methods.getAchievementLength().call();

    // Get achievement list by iterating list indexes
    Promise.all(_.range(length).map(async (idx) => {
      let achievementID = await this.achievementManagerInstance.methods.allAchievements(idx).call();
      await this.getAchievement(achievementID).then(achievement => handler(achievement));
    })).then(() => cb());
  }
}

export {AchievementManager}