// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IEnderBase.sol";

interface IEnderTreasury is IEnderBase {
    function depositTreasury(EndRequest memory) external;

    function withdraw(EndRequest memory) external ;

    function collect(address, uint256) external;

    function mintEndToUser(address, uint256) external;

    function getStakingReward(address _tokenAddress) external returns (uint256 rebaseReward);
}