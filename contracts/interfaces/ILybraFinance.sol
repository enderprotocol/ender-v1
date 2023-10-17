// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ILybraFinance{
    function depositAssetToMint(uint256 assetAmount,uint256 mintAmount) external;
    function withdraw(address onBehalfOf,uint256 amount) external;
}
//0xa980d4c0C2E48d305b582AA439a3575e3de06f0E