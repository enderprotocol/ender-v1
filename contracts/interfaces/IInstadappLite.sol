// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IInstadappLite{
    function deposit(
        uint256 assets_,
        address receiver_
    ) external returns (uint256 shares_);
    function withdraw(uint256 assets_,address receiver_,address owner_) external returns(uint256 _amount);
}

//0xA0D3707c569ff8C87FA923d3823eC5D81c98Be78