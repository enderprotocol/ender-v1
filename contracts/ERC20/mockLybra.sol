// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "../lido/ISTETH.sol";
import "../interfaces/ILybraFinance.sol";

contract mockLybra is ILybraFinance {
    struct UserData {
        uint256 amount;
        uint256 mintAmount;
    }
    mapping(address => UserData) public userData;
    // mapping(address => uint256) public pendingRewards;
    address public stEth;
    uint256 public apy = 4000; //4%

    constructor(address _stEth) {
        stEth = _stEth;
    }

    function depositAssetToMint(uint256 amount, uint256 mintAmount) external override {
        IERC20(stEth).transferFrom(msg.sender, address(this), amount);
        userData[msg.sender] = UserData(amount, mintAmount);
    }

    function withdraw(address onBehalfOf, uint256 amount) external override returns (uint256 _amount) {
        // UserData memory userStakeData = userData[msg.sender];
        IERC20(stEth).transfer(onBehalfOf, amount);
        return amount;
    }
}
