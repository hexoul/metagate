import web3 from '../web3';
import web3config from '../web3-config.json';
import { getAddresses } from './addresses';
import { getBranch, getABI } from './helpers';

class AchievementManager {
  async init() {
    const { ACHIEVEMENT_MANAGER_ADDRESS } = getAddresses(web3config.netid);
    const branch = getBranch(web3config.netid);

    const achievementManagerAbi = await getABI(branch, 'AchievementManager');
    this.achievementManagerInstance = new web3.eth.Contract(achievementManagerAbi.abi, ACHIEVEMENT_MANAGER_ADDRESS);
  }

  async getAchievement(achievementID) {
    // Validate ABI
    if (! this.achievementManagerInstance.methods.achievements) {
      return null;
    }

    // Call
    return this.achievementManagerInstance.methods.achievements(achievementID).call();
  }

  async getAllAchievements() {
    var achievements = [];

    // Validate ABI
    if (! this.achievementManagerInstance.methods.allAchievements) {
      return achievements;
    }

    // Get achievement IDs
    let achievementIDs = await this.achievementManagerInstance.methods.allAchievements().call();

    // Make achievement list by iterating IDs
    await Promise.all(achievementIDs.map(async (achievementID) => {
      achievements.push(await this.getAchievement(achievementID));
    }));
    return achievements;
  }
}

export {AchievementManager}