const Funghi = artifacts.require("Fungi");

module.exports = async function(deployer) {
  await deployer.deploy(Funghi);
  const Padde = await Funghi.deployed();
  console.log("Mint Fungi!")
  Padde.CreateFungi('0xF9C84A2E1a9AFfF08785b2bCc8BD1519B2C86BAe', 'https://gateway.pinata.cloud/ipfs/QmTFCAKVwofbMjEQPBZWQCg1vmdtUccTkfVh52FrJnRDkv');
  console.log("Mint Another Fungi!")
  Padde.CreateFungi('0xEA9a7c7cD8d4Dc3acc6f0AaEc1506C8D6041a1c5','https://gateway.pinata.cloud/ipfs/QmVvQZ8JNDTYP5BhM2ZjeAmxKa2VYjwQ2wZvYtwihFNSBq' );

};