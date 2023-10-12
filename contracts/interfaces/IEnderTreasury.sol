// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IEnderBase.sol";

interface IEnderTreasury is IEnderBase {
    function deposit(bool, uint256, uint256, EndRequest memory) external returns (uint256);

    function withdraw(EndRequest memory) external returns (uint256);

    function collect(address, uint256) external;
}
