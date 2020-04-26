var EventManager = artifacts.require("./EventManager.sol");

module.exports = function (deployer) {
  deployer.deploy(EventManager);
};
