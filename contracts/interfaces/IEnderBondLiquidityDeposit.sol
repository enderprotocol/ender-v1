// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IEnderBondLiquidityDeposit {
    function depositedIntoBond(uint256 index) external  returns(address user, uint256 principal, uint256 bonfees, uint256 maturity);
}