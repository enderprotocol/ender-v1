// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IEnderBond {
  function calculateBondRewardAmount(uint256 _tokenId) external  returns (uint256 _reward) ;
}