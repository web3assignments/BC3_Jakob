// use plenty of gas
pragma solidity >=0.6.0 <0.7.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
contract Funghi is ERC721 {
constructor() ERC721("Paddestoel", "FUNGI" )  public {  
    _mint(0xEA9a7c7cD8d4Dc3acc6f0AaEc1506C8D6041a1c5, 1);    
  }
}