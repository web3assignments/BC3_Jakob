pragma solidity ^0.6.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import "@openzeppelin/contracts/utils/Counters.sol";

contract Fungi is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("Fungi", "FUNG") public {
    }

    function CreateFungi(address tokenholder, string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(tokenholder, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}