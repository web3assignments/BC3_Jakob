const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');
var Slots = artifacts.require("slots");
var Slots2 = artifacts.require("slotsV2");
var Oracle = artifacts.require("Oracle");

module.exports = async function(deployer) {
    const Orca = await Oracle.deployed();
    const SlotsS = await Slots.deployed();
    const SlotsV2 = await upgradeProxy(SlotsS.address, Slots2, { deployer, initializer: 'initialize' });
    console.log(`Address of Oracle contract: ${Orca.address}`);
    console.log(`Address of Slots contract: ${SlotsS.address}`);
    console.log(`Address of SlotsV2 contract: ${SlotsV2.address}`);
    var Amount = await SlotsV2.ContractBalance();
    console.log(`Contract balance of SlotsV2 is currently ${Amount}`);
}