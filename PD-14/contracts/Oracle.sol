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
            0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B, // VRF Coordinator
            0x01BE23585060835E02B77ef475b0Cc51aA1e0709  // LINK Token
        ) public payable
    {
        keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
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

    function returnNumber() public view returns (uint256){
        return Number;
    }
}