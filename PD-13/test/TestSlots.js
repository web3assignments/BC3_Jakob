const Slots = artifacts.require("slots");
const truffleAssert = require('truffle-assertions');

contract('Slots', (accounts) => {
    it('Intial contract balance should equal zero', async () => {
      const SlotsInstance = await Slots.deployed();
      const balance = await SlotsInstance.ContractBalance();
      assert.equal(balance.valueOf(), 0, "Intial balance was not equal to zero!");
    });
    it('Should fail at starting the game because no ether was gambled', async () => {
        const SlotsInstance = await Slots.deployed();
        await truffleAssert.reverts(SlotsInstance.StartGame(), "Transaction value to low");
    });
    it('Input of SliceAndDice should not be equal to the output', async () => {
        const SlotsInstance = await Slots.deployed();
        const value = await SlotsInstance.SliceAndDice(1000)
        assert.notEqual(value.valueOf(),1000, "Oh oh in and output are the same!");
    });
    it('Check if event is emitted', async () => {
        const SlotsInstance = await Slots.deployed();
        let result = await SlotsInstance.StartGame({value: 1000000000000000000, from: accounts[0]})
        truffleAssert.eventEmitted(result, 'Won');
    });
    it('Should fail to selfdestruct because of not owner call', async () => {
        const SlotsInstance = await Slots.deployed();
        truffleAssert.reverts(await SlotsInstance.selfDestruct({from: accounts[1]}), "Ownable: caller is not the owner");
    });
});