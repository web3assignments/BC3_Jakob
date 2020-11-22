pragma solidity ^0.5.11;

contract Slots {
    
    function StartGame(uint256 amount) public payable {
        require(msg.value == amount);
        require(msg.value > 0, "Balance to low");
        uint256 playerBalance = amount;
        uint RandomValue = Random();
       
        if(RandomValue > 50){
            uint256 WinBalance = playerBalance * 2;
            if(ContractBalance() < WinBalance){
                WinBalance = ContractBalance();
            }
            msg.sender.transfer(WinBalance);
        }
      
    }
    
    function Random() public view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.timestamp)))%100;
    }
    
    function ContractBalance() public view returns (uint){
        return address(this).balance;
    }
    
    
}
