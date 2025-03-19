// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleToken is ERC20, Ownable {
    mapping(address => uint256) public lastFaucetRequest;
    uint256 public faucetCooldown = 1 days;
    uint256 public faucetAmount = 10 * 10 ** 18;

    event FaucetClaimed(address indexed user, uint256 timestamp);

    // ✅ THIS is correct for OpenZeppelin v4.x (not v5)
    constructor(uint256 initialSupply) ERC20("HumNowYouBabe", "HUM") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * 10 ** 18);
    }

    function requestTokens() external {
        require(
            block.timestamp >= lastFaucetRequest[msg.sender] + faucetCooldown,
            "Please wait before requesting again"
        );
        lastFaucetRequest[msg.sender] = block.timestamp;
        _mint(msg.sender, faucetAmount);
        emit FaucetClaimed(msg.sender, block.timestamp);
    }

    function setFaucetAmount(uint256 amount) external onlyOwner {
        faucetAmount = amount;
    }

    function setFaucetCooldown(uint256 cooldown) external onlyOwner {
        faucetCooldown = cooldown;
    }
}
