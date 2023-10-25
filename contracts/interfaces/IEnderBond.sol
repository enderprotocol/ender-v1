// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IEnderBond {
    function calculateBondRewardAmount(uint256 _tokenId) external returns (uint256 _reward);

    function endMint() external returns (uint256 _endMint);

    function updateRewardShareIndexForSend(uint256 _reward, uint256 _totalPrinciple) external;
    function updateRewardShareIndex(uint256 _reward) external;

}
