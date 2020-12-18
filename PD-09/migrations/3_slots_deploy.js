const { deployProxy } = require('@openzeppelin/truffle-upgrades');

var Slots = artifacts.require("slots");
var Oracle = artifacts.require("Oracle");

module.exports = async function (deployer) {
    const Oralacle = await deployer.deploy(Oracle);
    const SlotsS = await deployProxy(Slots, [] ,{ deployer, initializer: 'initialize' });
    console.log(`Address of Oracle contract: ${Oralacle.address}`);
    console.log(`Address of Slots contract: ${SlotsS.address}`);
}