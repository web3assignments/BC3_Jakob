pragma solidity ^0.5.11;

contract Slots {
    
    uint256 public ContractBalance;
    
    
    function StartGame() public payable {
        uint256 playerBalance = msg.value;
        require(playerBalance > 0, "Balance to low");
        uint RandomValue = random();
        ContractBalance = address(this).balance;
        
        if(RandomValue > 50){
            uint256 WinBalance = playerBalance * 2;
            if(ContractBalance < WinBalance){
                WinBalance = ContractBalance;
            }
            msg.sender.transfer(WinBalance);
            ContractBalance = address(this).balance;
        }
        
    }
    
    function random() public view returns (uint) {
        return uint(keccak256(abi.encodePacked(now, block.timestamp)))%100;
    }
}
