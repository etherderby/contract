
var EtherDerby = artifacts.require("EtherDerbyTestable");

module.exports = function(deployer) {
  deployer.deploy(EtherDerby);
};
