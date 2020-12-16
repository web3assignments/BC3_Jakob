// SPDX-License-Identifier: MIT
// truffle run verify Token_erc20 --network rinkeby

pragma solidity ^0.6.2;

import "@openzeppelin/contracts/GSN/Context.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Spacezilla_token is Context, ERC20 {

    /**
     * @dev Constructor that gives _msgSender() all of existing tokens.
     */
    constructor () public ERC20("Spacezilla", "SPCZ") {
        _mint(msg.sender, 15);
        _mint(0xEA9a7c7cD8d4Dc3acc6f0AaEc1506C8D6041a1c5, 15);
    }
}