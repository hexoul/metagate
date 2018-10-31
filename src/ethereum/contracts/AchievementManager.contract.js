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

  async getAchievementById(achievementID) {
    // Validate ABI
    if (! this.achievementManagerInstance.methods.getAchievementById) return;

    // Call
    return this.achievementManagerInstance.methods.getAchievementById(achievementID).call();
  }

  async getAllAchievements({handler, cb}) {
    if (! handler || ! cb) return;

    // Validate ABI
    if (! this.achievementManagerInstance.methods.getAllAchievementList) return;

    // Get achievement IDs
    var achievementIDs = await this.achievementManagerInstance.methods.getAllAchievementList().call();
    
    // Get achievement list by iterating IDs
    Promise.all(achievementIDs.map(async (id) => {
      await this.getAchievementById(id).then(achievement => handler(achievement));
    })).then(() => cb());
  }

  async getLengthOfAchievements() {
    // Validate ABI
    if (! this.achievementManagerInstance.methods.getLengthOfAchievements) return;

    // Call
    return this.achievementManagerInstance.methods.getLengthOfAchievements().call();
  }

  async getAllAchievementsByLength({handler, cb}) {
    if (! handler || ! cb) return;

    // Validate ABI
    if (! this.achievementManagerInstance.methods.allAchievements) return;

    // Get achievement list length
    let length = await this.getLengthOfAchievements();

    // Get achievement list by iterating list indexes
    Promise.all(_.range(length).map(async (idx) => {
      let achievementID = await this.achievementManagerInstance.methods.allAchievements(idx).call();
      await this.getAchievementById(achievementID).then(achievement => handler(achievement));
    })).then(() => cb());
  }

  /**
   * 
   * @param {uint256[]} topics 
   * @param {address[]} issuers 
   * @param {bytes32} title 
   * @param {bytes32} explanation 
   * @param {uint256} reward 
   * @param {string} uri 
   */
  createAchievement(topics, issuers, title, explanation, reward, uri) {
    // Validate ABI
    if (! this.achievementManagerInstance.methods.createAchievement) return;

    // Return transaction param
    return this.achievementManagerInstance.methods.createAchievement(topics, issuers, title, explanation, reward, uri).send.request();
  }
}

export {AchievementManager}