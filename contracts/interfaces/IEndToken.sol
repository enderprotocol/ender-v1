// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IEndToken interface
 * @notice Interface for the EndToken contract
 */
interface IEndToken {
    function mint(address to, uint256 amount) external;
}
