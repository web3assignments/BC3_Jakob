document.getElementById('gif').hidden = true;

var slotImages = [
	'Images/bar.png',
	'Images/cherry.png',
	'Images/citrus.png',
	'Images/orange.png',
	'Images/seven.png',
	'Images/watermelon.png'
];

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

function logEvents(colors, place, str,...arguments){
    var logstr=arguments.toString();
    document.getElementById(place).innerHTML +=str.fontcolor(colors)+" "+logstr.fontcolor(colors)+"\n";
}
var getal1;
async function Play(){
	document.getElementById('play').hidden = true;
	document.getElementById('gif').hidden = false;
	var betAmount = document.getElementById("bet").value;

	if(document.getElementById("bet").value == document.getElementById("bet").defaultValue || document.getElementById("bet").value == 0){
		logEvents('red', 'log', 'Please enter your bet amount! Spin the wheels again!')
		document.getElementById('play').hidden = false;
		document.getElementById('gif').hidden = true;
	}
	else{
		var spin1 = 0;
		var spin2 = 0;
		var spin3 = 0;

		var one = setInterval(function(){
			spin1 = Math.round(Math.random() * (slotImages.length - 1))
			$('#slot1').attr('src', slotImages[spin1])
		},100);
		var two = setInterval(function(){
			spin2 = Math.round(Math.random() * (slotImages.length - 1))
			$('#slot2').attr('src', slotImages[spin2])
		},100);
		var three = setInterval(function(){
			spin3 = Math.round(Math.random() * (slotImages.length - 1))
			$('#slot3').attr('src', slotImages[spin3])
		},100);

		const SlotsContract = new web3.eth.Contract(SlotsAbi, Slotsaddress);
		try{
			var betAmountWei = web3.utils.toWei(betAmount);
		}
		catch(e){
			betAmount = (betAmount.toString()).replace(',','.');
			logEvents('red','log', 'Hey, you! Next time use a dot instead of a comma!');
			var betAmountWei = web3.utils.toWei(betAmount);
		}
		logEvents('black','log2', `Betting: ${Round(betAmount)} ETH`);
		var result =  await SlotsContract.methods.StartGame().send({from: accounts[0], value:betAmountWei},function(err){
			if(!err){
			}
			else{
				clearInterval(one);
				clearInterval(two);
				clearInterval(three);
				logEvents('red', 'log', 'Please try to spin the wheels again!')
				document.getElementById('play').hidden = false;
				document.getElementById('gif').hidden = true;

			}
		} );
		UpdateBalances();
		var gasprice= await web3.eth.getGasPrice()   
		var Numbers = await SlotsContract.methods.getNumbers().call({from: accounts[0]}).catch(error => {
			ErrorHandling(error)
		});
		UpdateBalances();
		logEvents('black','log2',`Gas used: ${Round(web3.utils.fromWei( (result.gasUsed*gasprice).toString(), 'ether'))} ETH`); 

		//stop spins
		stopSpins(Numbers[0], one, '#slot1');
		stopSpins2(Numbers[1], two, '#slot2');
		stopSpins2(Numbers[2], three, '#slot3');
		
		try{
			var win = await result.events.Won.returnValues['win'];
			var winAmount = Round(web3.utils.fromWei(await result.events.Won.returnValues['WinAmount'].toString(), 'ether'));
		}
		catch(e){
			logEvents('red', 'log2',`You lost: ${betAmount} ETH, but thats life!`);
		};

		if (win){
			logEvents('purple', 'log2', `You won: ${winAmount} ETH!`);
		};
		document.getElementById('gif').hidden = true;	
		document.getElementById('GRN').hidden = false;
	}
}	

async function getNumber() {
	var Flag = false;
	document.getElementById('GRN').hidden = true;
	document.getElementById('gif').hidden = false;
	document.getElementById('play').hidden = true;
	const SlotsContract = new web3.eth.Contract(SlotsAbi, Slotsaddress);
	try{
		await SlotsContract.methods.CallOracle().send({from: accounts[0]})
	}
	catch(e){
		Flag = true;
	};

	if(Flag){
		logEvents('red', 'log', 'Please accept the oracle request! Please ty again!')
		document.getElementById('GRN').hidden = false;
		document.getElementById('gif').hidden = true;
	}
	else{
		$('#log2').empty();

		logEvents('black','log2','Wait 1 minute on the oracle call! Be patient!');
		await new Promise(r => setTimeout(r, 60000));
		logEvents('black','log2',`Your oracle returned a number! Please let us do some backend magic on it!`);
		await SlotsContract.methods.alterNumbers().send({from: accounts[0]}).catch(error => {
			logEvents('red', 'log', 'Please accept backend request! Please ty again!')
			document.getElementById('GRN').hidden = false;
		});	

		if(document.getElementById('GRN').hidden == false){
			document.getElementById('play').hidden = true;
			document.getElementById('GRN').hidden = false;
		}
		else{
			document.getElementById('gif').hidden = true;
			document.getElementById('play').hidden = false;
			document.getElementById('GRN').hidden = true;
			logEvents('green','log2',`You can spin the wheels now!`)
		}   
	}
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
        var result= await web3.eth.requestAccounts().catch(x=>logEvents('red','log',x.message));
        logEvents('black','log', `web3 is present: ${web3.version}`);
        const network = await web3.eth.net.getId().catch( (reason) => logEvents('red','log',`Cannnot find network ${reason}`) );            
        if (typeof network === 'undefined' || network != 4) 
            { logEvents('red','log',"Please select Rinkeby test network");return;}
        logEvents('black','log',"Ethereum network: Rinkeby")
		accounts=await web3.eth.getAccounts(); 
		const name = "decentralizedslots.eth";
		Slotsaddress = await web3.eth.ens.getAddress(name);  
		UpdateBalances();
		logEvents('black','log',"-------------------------");      
		
}

function stopSpins(nummer, one, slot){
	if(nummer <= 5)
		$(slot).attr("src","Images/citrus.png");
		clearInterval(one)

	if(nummer > 5 && nummer <= 10)
		$(slot).attr("src","Images/watermelon.png");
		clearInterval(one)

	if(nummer > 10 && nummer <= 15)
		$(slot).attr("src","Images/orange.png");
		clearInterval(one)

	if(nummer > 15 && nummer <= 19)
		$(slot).attr("src","Images/cherry.png");
		clearInterval(one)

	if(nummer > 19 && nummer <= 22)
		$(slot).attr("src","Images/seven.png");
		clearInterval(one)

	if(nummer == 23)
		$(slot).attr("src","Images/bar.png");	
		clearInterval(one)
};

function stopSpins2(nummer, one, slot){
	if(nummer <= 6)
		$(slot).attr("src","Images/citrus.png");
		clearInterval(one)

	if(nummer > 6 && nummer <= 12)
		$(slot).attr("src","Images/watermelon.png");
		clearInterval(one)

	if(nummer > 12 && nummer <= 18)
		$(slot).attr("src","Images/orange.png");
		clearInterval(one)

	if(nummer > 18 && nummer <= 21)
		$(slot).attr("src","Images/cherry.png");
		clearInterval(one)

	if(nummer == 22)
		$(slot).attr("src","Images/seven.png");
		clearInterval(one)

	if(nummer == 23)
		$(slot).attr("src","Images/bar.png");	
		clearInterval(one)
};

function ErrorHandling(error) {
    if (error)
        var msg = error.toString();
    msg = msg.slice(0, msg.indexOf('{'))
    msg = msg.replace('Error: execution reverted:', 'Error: ');
    logEvents('red','log2',msg);
}

window.addEventListener('load', asyncloaded); 