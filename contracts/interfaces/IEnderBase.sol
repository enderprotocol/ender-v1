// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IEnderBase {
    struct EndRequest {
        address account;
        address stakingToken; // non-zero address: stETH, zero address: ETH
        uint256 tokenAmt;
    }
}
