pragma solidity ^0.6.0;

contract Slots {
    
    mapping(address => uint[])  playerList;
    uint[] Numbers;


    // Setup an intial amount for the bank, supplied during the creation of the contract.    
    constructor() public payable {
    }

    event Won(bool win, uint256 WinAmount);  
    
    function StartGame() public payable {
        require(msg.value > 0, "Balance to low");
        uint256 amount = msg.value;
        delete Numbers;
        uint256 playerBalance = amount;
        //NOT random until oracalized for now they produce 3 times the same random number
        uint Slotwheel1 = Random();
        Numbers.push(Slotwheel1);
        uint Slotwheel2 = Random();
        Numbers.push(Slotwheel2);
        uint Slotwheel3 = Random();
        Numbers.push(Slotwheel3);
        
        playerList[msg.sender] = Numbers;
        
        //Cherry in slot one and two fruits
        if((Slotwheel1 > 15 && Slotwheel1 <= 19) && (Slotwheel2 <= 18) && (Slotwheel3 <= 18)){
            CalculateWinnings(playerBalance, 1);
        }
        //Cherry in slot two and two fruits
        if((Slotwheel1 <= 15) && (Slotwheel2 > 18 && Slotwheel2 <= 21) && (Slotwheel3 <= 18)){
            CalculateWinnings(playerBalance, 1);
        }
        //Cherry in slot three and two fruits
        if((Slotwheel1 <= 15) && (Slotwheel2 <= 18) && (Slotwheel3 > 18 && Slotwheel3 <= 21)){
            CalculateWinnings(playerBalance, 1);
        }
        
        //Cherries in slot one/two and one fruit
        if((Slotwheel1 > 15 && Slotwheel1 <= 19) && (Slotwheel2 > 18 && Slotwheel2 <= 21) && (Slotwheel3 <= 18)){
            CalculateWinnings(playerBalance, 4);
        }
        //Cherries in slot two/three and one fruit
        if((Slotwheel1 <= 15) && (Slotwheel2 > 18 && Slotwheel2 <= 21) && (Slotwheel3 > 18 && Slotwheel3 <= 21)){
            CalculateWinnings(playerBalance, 4);
        }
        //Cherries in slot one/three and one fruit
        if((Slotwheel1 > 15 && Slotwheel1 <= 19) && (Slotwheel2 <= 18) && (Slotwheel3 > 18 && Slotwheel3 <= 21)){
            CalculateWinnings(playerBalance, 4);
        }
        
        //Random fruit combination (Lemon, Banana, Orange)
        if(Slotwheel1 <= 15 && Slotwheel2 <= 18 && Slotwheel3 <= 18){
            //All lemons
            if(Slotwheel1 <= 5 && Slotwheel2 <= 6 && Slotwheel3 <= 6){
                CalculateWinnings(playerBalance, 10);
            }
            //All Banana
            if((Slotwheel1 > 5 && Slotwheel1 <= 10)&&(Slotwheel2 > 6 && Slotwheel2 <= 12)&&(Slotwheel3 > 6 && Slotwheel3 <= 12)){
                CalculateWinnings(playerBalance, 10);
            }
            //ALl Orange
            if((Slotwheel1 > 10 && Slotwheel1 <= 15)&&(Slotwheel2 > 12 && Slotwheel2 <= 18)&&(Slotwheel3 > 12 && Slotwheel3 <= 18)){
                CalculateWinnings(playerBalance, 10);
            }
        }
        
        //All cherries
        if((Slotwheel1 > 15 && Slotwheel1 <= 19) && (Slotwheel2 > 18 && Slotwheel2 <= 21) && (Slotwheel3 > 18 && Slotwheel3 <= 21)){
            CalculateWinnings(playerBalance, 20);
        }
        //All Sevens
        if((Slotwheel1 > 19 && Slotwheel1 <= 22) && (Slotwheel2 == 22) && (Slotwheel3 == 22)){
            CalculateWinnings(playerBalance, 40);
        }
        //All BARs
        if((Slotwheel1 == 23) && (Slotwheel2 == 23) && (Slotwheel3 == 23)){
            CalculateWinnings(playerBalance, 60);
        }
    }
    
    function Random() public view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.timestamp)))%23;
    }
    
    function ContractBalance() public view returns (uint){
        return address(this).balance;
    }
    
    function CalculateWinnings(uint Pbalance, uint Multiplier) private {
        uint256 WinBalance = Pbalance * Multiplier;
        bool win = true;
        if(ContractBalance() < WinBalance){
            WinBalance = ContractBalance();
            }
        msg.sender.transfer(WinBalance);
        emit Won(win, WinBalance);
        }
        
    function getNumbers() public view returns(uint[] memory) {
        return playerList[msg.sender];
    }
}