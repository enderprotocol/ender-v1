// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface ILido{
    function submit(address _referral) external payable returns (uint256);

    // function withdrawStEth(EndRequest memory) external returns (uint256);
}
