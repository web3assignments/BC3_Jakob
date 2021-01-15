const SlotsAbi=[
	{
		"inputs": [],
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bool",
				"name": "win",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "WinAmount",
				"type": "uint256"
			}
		],
		"name": "Won",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "CallOracle",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ContractBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "Numbers",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "OracleAdress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "StartGame",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "alterNumbers",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getNumbers",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "selfDestruct",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addy",
				"type": "address"
			}
		],
		"name": "set_addressOracle",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

var accounts;
var Slotsaddress;

function Round(x){
    return Number.parseFloat(x).toFixed(5);
}

function logEvents(str,...arguments){
    var logstr=arguments.toString();
    document.getElementById("log").innerHTML +=str+" "+logstr+"\n";
}
var getal1;
async function Play(){
	const SlotsContract = new web3.eth.Contract(SlotsAbi, Slotsaddress);
    var betAmount = document.getElementById("bet").value;
    var betAmountWei = web3.utils.toWei(betAmount);
    logEvents(`Betting: ${Round(betAmount)} ETH`);
	var result =  await SlotsContract.methods.StartGame().send({from: accounts[0], value:betAmountWei});
	UpdateBalances();
    var gasprice= await web3.eth.getGasPrice()   
	var Numbers = await SlotsContract.methods.getNumbers().call({from: accounts[0]});
	logEvents(`Your numbers this spin: ${Numbers}`);
	UpdateBalances();
	
    logEvents(`Gas used: ${Round(web3.utils.fromWei( (result.gasUsed*gasprice).toString(), 'ether'))} ETH`);    
    var win = result.events.Won.returnValues['win'];
    var winAmount = Round(web3.utils.fromWei(result.events.Won.returnValues['WinAmount'].toString(), 'ether'));
    if (win)
        logEvents(`You won: ${winAmount} ETH!`);
    else
		logEvents(`You lost: ${betAmount} ETH, but thats life!`);

	document.querySelector('#play').style.visibility = "hidden";
	document.querySelector('#GRN').style.visibility = "block";
}

async function getNumber() {
	const SlotsContract = new web3.eth.Contract(SlotsAbi, Slotsaddress);
	var test = await SlotsContract.methods.CallOracle().send({from: accounts[0]});
	logEvents('Wait 1 minute on the oracle call! Be patient!');
	await new Promise(r => setTimeout(r, 60000));
	logEvents(`Your oracle returned a number! Please let us do some backend magic on it!`);
	await SlotsContract.methods.alterNumbers().send({from: accounts[0]});
	document.querySelector('#play').style.visibility = "block";
	document.querySelector('#GRN').style.visibility = "hidden";
	logEvents(`You can spin the wheels now!`)
}

async function UpdateBalances(){
	var weiBalance= await web3.eth.getBalance(accounts[0])
	var ethBalance = web3.utils.fromWei(weiBalance, 'ether');
	document.getElementById("balance").value = Round(ethBalance).toString();    
	
	var weiBankBalance=await web3.eth.getBalance(Slotsaddress)
	document.getElementById("bank").value = Round(web3.utils.fromWei(weiBankBalance, 'ether')); 
}

async function asyncloaded() {
        web3 = new Web3(Web3.givenProvider); // provider from metamask         
        var result= await web3.eth.requestAccounts().catch(x=>logEvents(x.message));
        logEvents(`web3 is present: ${web3.version}`); // note: use ` (back quote)
        const network = await web3.eth.net.getId().catch( (reason) => logEvents(`Cannnot find network ${reason}`) );            
        if (typeof network === 'undefined' || network != 4) 
            { logEvents("Please select Rinkeby test network");return;}
        logEvents("Ethereum network: Rinkeby")
		accounts=await web3.eth.getAccounts(); 
		const name = "decentralizedslots.eth";
		Slotsaddress = await web3.eth.ens.getAddress(name);  
		UpdateBalances();
		logEvents("-------------------------");      
		
	}     

window.addEventListener('load', asyncloaded); 