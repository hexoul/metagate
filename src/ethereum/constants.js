let constants = {};
constants.organization = 'hexoul';
constants.repoName = 'poa-chain-spec';
constants.addressesSourceFile = 'contracts.json';
constants.ABIsSources = {
  Identity: 'Identity.abi.json',
  IdentityManager: 'IdentityManager.abi.json',
  AttestationAgencyRegistry: 'AttestationAgencyRegistry.abi.json',
  TopicRegistry: 'TopicRegistry.abi.json',
  Achievement: 'Achievement.abi.json',
  AchievementManager: 'AchievementManager.abi.json',
};
constants.NETID_TESTNET = '101';

export {constants}