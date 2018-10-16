let constants = {};
constants.organization = 'hexoul';
constants.repoName = 'poa-chain-spec';
constants.addressesSourceFile = 'contracts.json';
constants.ABIsSources = {
  Identity: 'Identity.abi.json',
  IdentityManager: 'IdentityManager.abi.json',
  AchievementManager: 'AchievementManager.abi.json',
  TopicRegistry: 'TopicRegistry.abi.json'
};
constants.NETID_TESTNET = '101';

export {constants}