// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title IEndToken interface
 * @notice Interface for the EndToken contract
 */
interface ISEndToken is IERC20 {
    function mint(address to, uint256 amount) external;

    function burn(address from, uint256 amount) external;

    // function totalSupply() external;
}
