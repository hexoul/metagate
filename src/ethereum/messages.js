let messages = {};
messages.wrongRepo = repo => {
  return `There is no contracts.json in configured repo ${repo}`
};

export {messages}