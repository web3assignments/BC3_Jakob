const Spacezilla_token = artifacts.require("Spacezilla_token");

module.exports = function(deployer) {
  deployer.deploy(Spacezilla_token);
};