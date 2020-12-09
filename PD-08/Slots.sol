pragma solidity ^0.6.0;

import "https://raw.githubusercontent.com/smartcontractkit/chainlink/develop/evm-contracts/src/v0.6/VRFConsumerBase.sol";

contract Slots is VRFConsumerBase {
    
    bytes32 internal keyHash;
    uint256 internal fee;
    mapping(address => uint[])  playerList;
    uint[3] public  Numbers;
    uint256 public Number;
    
    event Won(bool win, uint256 WinAmount);  

    constructor() 
        VRFConsumerBase(
            0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9, // VRF Coordinator
            0xa36085F69e2889c224210F603D836748e7dC0088  // LINK Token
        ) public payable
    {
        keyHash = 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4;
        fee = 0.1 * 10 ** 18; // 0.1 LINK
    }
    
    function StartGame() public payable {
        require(msg.value > 0, "Balance to low");
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
        
    function alterNumbers() public {
        Numbers = SliceAndDice(Number);
        playerList[msg.sender] = Numbers;
    }
    
    
    function getNumbers() public view returns(uint[] memory) {
        return playerList[msg.sender];
    }
    
    function getRandomNumber() public returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        uint256 seed = uint256(keccak256(abi.encode(blockhash(block.number))));
        return requestRandomness(keyHash, fee, seed);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        Number = randomness;
    }
    
    
    function SliceAndDice(uint256 input) internal returns (uint[3] memory) {
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
}