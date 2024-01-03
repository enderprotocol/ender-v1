// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


interface IStEth is IERC20 {
    function getPooledEthByShares(uint256) external;
    function getSharesByPooledEth(uint256) external;
}
