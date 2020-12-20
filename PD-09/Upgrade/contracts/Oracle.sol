// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

/// @title Random Oracle
/// @author Parzivalza
/// @notice Seperate chainlink call contract 

import "./VRFConsumerBase.sol";

contract Oracle is VRFConsumerBase {

    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 public Number;

    constructor() 
        VRFConsumerBase(
            0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9, // VRF Coordinator
            0xa36085F69e2889c224210F603D836748e7dC0088  // LINK Token
        ) public payable
    {
        keyHash = 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4;
        fee = 0.1 * 10 ** 18; // 0.1 LINK
    }

    /// @notice Calls chainlink oracle for random numbers
    /// @dev Make sure there is enough LINK on the contract for oracle call
    /// @return requestId the call id for the oracle
    function getRandomNumber() public returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        uint256 seed = uint256(keccak256(abi.encode(blockhash(block.number))));
        return requestRandomness(keyHash, fee, seed);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        Number = randomness;
    }

    function returnNumber() public returns (uint256 number){
        return Number;
    }
}