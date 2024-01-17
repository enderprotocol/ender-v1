// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./IEnderBase.sol";

interface IEnderTreasury is IEnderBase {
    function depositTreasury(EndRequest memory, uint256) external;

    function withdraw(EndRequest memory, uint256) external ;

    function collect(address, uint256) external;

    function mintEndToUser(address, uint256) external;

    function stakeRebasingReward(address _asset) external returns (uint256 rebaseReward);

    function ETHDenomination(address _stEthAddress) external view returns (uint stETHPoolAmount, uint ENDSupply);
}