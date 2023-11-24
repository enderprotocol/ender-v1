// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./IEnderBase.sol";

interface IEnderStrategy is IEnderBase {
    function deposit(EndRequest memory) external returns (uint256);

    function withdrawStEth(EndRequest memory) external returns (uint256);

    function withdrawRequest(EndRequest memory) external;

    function checkDeposit(address, uint256) external view returns (bool);

    function hasRequest() external view returns (bool);
}
