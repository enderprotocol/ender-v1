// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../EnderBond.sol";

contract MockEnderBondV1 is EnderBond {
    function getDayToRefractionShareUpdation(uint256 idx) public view returns (uint256[] memory) {
        return dayToRefractionShareUpdation[idx];
    }

    function getDayToRefractionShareUpdationSend(uint256 idx) public view returns (uint256[] memory) {
        return dayToRefractionShareUpdationSend[idx];
    }

    function setDayRewardShareIndexForSend(uint256 idx, uint256 timestamp) public {
        dayRewardShareIndexForSend[idx] = timestamp;
    }
}