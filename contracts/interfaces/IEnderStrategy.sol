// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IEnderBase.sol";

interface IEnderStrategy is IEnderBase {
    function deposit(EndRequest memory) external returns (uint256);

    function withdraw(EndRequest memory) external returns (uint256);

    function withdrawRequest(EndRequest memory) external;

    function checkDeposit(address, uint256) external view returns (bool);

    function hasRequest() external view returns (bool);
}
