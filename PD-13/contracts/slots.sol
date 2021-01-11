// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

/// @title Decentralized slotmachine
/// @author Parzivalza
/// @notice A simple decentralized slotmachine game/backend 

import "@openzeppelin/contracts/access/Ownable.sol";

contract Slots is Ownable {
    address public OracleAdress;
    mapping(address => uint[]) playerList;
    uint[3] public Numbers;
    
    event Won(bool win, uint256 WinAmount);  
    modifier minAmount(uint _amount)    {require(msg.value >= _amount,  "Transaction value to low");            _;}

    constructor() public payable Ownable(){
    }

    function set_addressOracle(address _addy) public onlyOwner{
        OracleAdress = address(_addy);
    }

    function CallOracle() public returns (bytes32){
        Oracle2 o = Oracle2(OracleAdress);
        return o.getRandomNumber();
    }

    function ReturnOracleNumber() public returns (uint256){
        Oracle2 o = Oracle2(OracleAdress);
        return o.returnNumber();  
    }
        
    /// @notice Starts the slotgame when the user genereted the numbers before
    /// @dev Depends on oracle for random numbers. Oracle needs to be called before issuing StartGame  
    function StartGame() minAmount(1 ether) public payable {
        uint256 amount = msg.value;
        uint256 playerBalance = amount;
        uint Slotwheel1 = Numbers[0];
        uint Slotwheel2 = Numbers[1];
        uint Slotwheel3 = Numbers[2];
        
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
    
    
    /// @notice Shows the bankbalance 
    /// @return Balance of the contract in wei
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
    
    /// @notice Alters the random number retrieved from the oracle and adds them to the playerList   
    function alterNumbers() public {
        uint256 Number = ReturnOracleNumber();
        Numbers = SliceAndDice(Number);
        playerList[msg.sender] = Numbers;
    }
    
    /// @notice Gets the random number associated with the player
    /// @return Array from mapping with the three random numbers
    function getNumbers() public view returns(uint[] memory) {
        return playerList[msg.sender];
    }
    
    function SliceAndDice(uint256 input) public returns (uint[3] memory) {
        uint[3] memory array;
        uint[3] memory random;
        
        for(uint i=0; i<3; i++) {
            uint digit = input % 10000;
            // do something with digit
            array[i] = digit;
            input /= 10000;
            random[i] =digit % 23;
        }
        return random;
    } 
    
    /// @notice Destruct the smartcontract 
    /// @dev Only callable by specific owner
    
    function selfDestruct() payable public onlyOwner{
        selfdestruct(msg.sender);
    }
    
}

interface Oracle2{
    function getRandomNumber() external returns (bytes32);
    function returnNumber() external returns (uint256);
}