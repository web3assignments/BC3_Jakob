const Slotsaddress="0x6A15d9336Fd6ee10788CfA7665310dDD13F42309"
const SlotsAbi=[
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
		"constant": false,
		"inputs": [],
		"name": "StartGame",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "ContractBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getNumbers",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "Random",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]

var accounts;

function Round(x){
    return Number.parseFloat(x).toFixed(5);
}

function logEvents(str,...arguments){
    var logstr=arguments.toString();
    document.getElementById("log").innerHTML +=str+" "+logstr+"\n";
}

async function Play(){
    const SlotsContract = new web3.eth.Contract(SlotsAbi, Slotsaddress);
    var betAmount = document.getElementById("bet").value;
    var betAmountWei = web3.utils.toWei(betAmount);
    logEvents(`Betting: ${Round(betAmount)} ETH`);
    var result =  await SlotsContract.methods.StartGame().send({from: accounts[0], value:betAmountWei});
    var gasprice= await web3.eth.getGasPrice()   
    var Numbers = await SlotsContract.methods.getNumbers.call();
    logEvents(`Your numbers this spin: ${Numbers[3]}`);
    logEvents(`Gas used: ${Round(web3.utils.fromWei( (result.gasUsed*gasprice).toString(), 'ether'))} ETH`);    
    var win = result.events.Won.returnValues['win'];
    var winAmount = Round(web3.utils.fromWei(result.events.Won.returnValues['WinAmount'].toString(), 'ether'));
    if (win)
        logEvents(`You won: ${winAmount} ETH!`);
    else
        logEvents(`You lost: ${betAmount} ETH, but thats life!`);
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

        UpdateBalances(); 
    }     
window.addEventListener('load', asyncloaded); 