// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../EnderBond.sol";

contract MockEnderBondV2 is EnderBond {
    function setDayRewardShareIndexForSend(uint256 idx, uint256 timestamp) public {
        dayRewardShareIndexForSend[idx] = timestamp;
    }
    
    function getAvailableBondFee() external view returns (uint256) {
        return availableBondFee;
    }

    function initAvailableBondFee(uint256 _amount) external {
        availableBondFee = _amount;
    }
}