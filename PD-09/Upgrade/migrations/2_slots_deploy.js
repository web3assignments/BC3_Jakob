const { deployProxy } = require('@openzeppelin/truffle-upgrades');

var Slots = artifacts.require("slots");
var Oracle = artifacts.require("Oracle");

module.exports = async function (deployer) {
    await deployer.deploy(Oracle);
    const SlotsS = await deployProxy(Slots, [] ,{ deployer, initializer: 'initialize' });
    console.log("Doing some tests:")
    var Amount = await SlotsS.ContractBalance();
    console.log(`Current contract balance ${Amount}`);
}