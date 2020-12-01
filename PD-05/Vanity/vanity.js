console.log('Program running...');
Web3 = require('web3');
web3 = new Web3();
var i = 0;
var find = "1111";
var findlength_plus2 = find.length+2;
var prefix;

console.log(`Searching for prefix ${find}`);
do {
	newAddress = web3.eth.accounts.create();
	prefix = newAddress.address.slice(2, findlength_plus2).toLowerCase();
	if (++i % 1000 == 0) console.log(i);
} while (prefix != find);

console.log(`Found an address with prefix ${prefix}!`);
console.log(`address = ${newAddress.address}`);
console.log(`privateKey = ${newAddress.privateKey}`);