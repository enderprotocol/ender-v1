// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts-upgradeable/interfaces/IERC20Upgradeable.sol";

/**
 * @title IEnderStakeEth interface
 * @notice Interface for the EnderStakeEth contract
 */
interface IEnderStakeEth is IERC20Upgradeable {
    function mint(address to, uint256 amount, uint256 fee) external;
    function burn(address from, uint256 amount) external;
    function setTreasury(address treasury_) external;
}