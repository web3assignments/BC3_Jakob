var Slots = artifacts.require("slots");
var Oracle = artifacts.require("Oracle");

module.exports = async function (deployer) {
    await deployer.deploy(Oracle);
    const Orca = await Oracle.deployed();
    await deployer.deploy(Slots)
    const Slot = await Slots.deployed();
    console.log("Setting the oracle address")
    await Slot.set_addressOracle(Orca.address);
    console.log(`Current Oracle address ${Orca.address}`);
}