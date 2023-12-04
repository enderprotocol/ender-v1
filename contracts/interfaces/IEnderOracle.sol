// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IPriceFeed {
    function decimals() external view returns (uint8);

    function latestAnswer() external view returns (int256);
}

interface IEnderOracle {
    function getPrice(address) external view returns (uint256, uint8);
}
