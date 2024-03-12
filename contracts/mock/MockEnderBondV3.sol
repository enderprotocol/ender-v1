// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../EnderBond.sol";

contract MockEnderBondV3 is EnderBond {
    function setRewardShareIndex(uint256 idx) external {
        rewardShareIndex = idx;
    }

    function setRewardSharePerUserIndex(uint256 idx, uint256 rewardIdx) external {
        rewardSharePerUserIndex[idx] = rewardIdx;
    }
}