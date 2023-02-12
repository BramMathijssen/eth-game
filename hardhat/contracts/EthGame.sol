// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "hardhat/console.sol";

/// @title EthGame
/// @author Bram Mathijssen
/// @notice A game where the 14th person that deposit ether wins all the ether in the contract
contract EthGame {
    uint256 public s_playerCounter;
    uint256 public ETH_AMOUNT = 0.1 ether;
    mapping(address => uint256) public winnerAddresses;
    event GameWon(address Winner, uint256 amountWon);

    function deposit() public payable {
        require(msg.value >= ETH_AMOUNT, "Need to send atleast 0.1 ETH");
        s_playerCounter++;
        if (s_playerCounter == 14) {
            console.log("You won the game!");
            s_playerCounter = 0;
            winnerAddresses[msg.sender] = address(this).balance;
            emit GameWon(msg.sender, address(this).balance);
            payable(msg.sender).transfer(address(this).balance);
        } else {
            console.log("You didnt win the game yet");
        }
    }
}
