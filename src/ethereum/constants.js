let constants = {};
constants.organization = 'hexoul';
constants.repoName = 'poa-chain-spec';
constants.addressesSourceFile = 'contracts.json';
constants.ABIsSources = {
  Identity: 'Identity.json',
  IdentityManager: 'IdentityManager.json',
  AttestationAgencyRegistry: 'AttestationAgencyRegistry.json',
  TopicRegistry: 'TopicRegistry.json',
  Achievement: 'Achievement.json',
  AchievementManager: 'AchievementManager.json',
};
constants.NETID_TESTNET = '101';

export {constants}