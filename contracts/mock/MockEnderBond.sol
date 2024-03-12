// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../EnderBond.sol";

contract MockEnderBond is EnderBond {
    function _findClosestS(uint256[] memory arr, uint256 _totalMaturity) external pure returns (uint256 _s) {
        return findClosestS(arr, _totalMaturity);
    }

    function _calculateRefractionData(
        address user,
        uint256 _principal,
        uint256 _maturity,
        uint256 _tokenId,
        uint256 _bondfee
    ) external {
        calculateRefractionData(user, _principal, _maturity, _tokenId, _bondfee);
    }

    function verify(signData memory userSign) external view returns (address) {
        return _verify(userSign);
    }

    function getDayToRefractionShareUpdation(uint256 idx) public view returns (uint256[] memory) {
        return dayToRefractionShareUpdation[idx];
    }

    function setDayToRefractionShareUpdation(uint256 idx, uint256 timeStamp) external {
        dayToRefractionShareUpdation[idx].push(timeStamp);
    }

    function getDayToRefractionShareUpdationSend(uint256 idx) public view returns (uint256[] memory) {
        return dayToRefractionShareUpdationSend[idx];
    }

    function setDayToRefractionShareUpdationSend(uint256 idx, uint256 timeStamp) external {
        dayToRefractionShareUpdationSend[idx].push(timeStamp);
    }

    function getDayToYeildShareUpdation(uint256 idx) public view returns (uint256[] memory) {
        return dayToYeildShareUpdation[idx];
    }

    function setDayToYeildShareUpdation(uint256 idx, uint256 timeStamp) external {
        dayToYeildShareUpdation[idx].push(timeStamp);
    }

    function setDayRewardShareIndexForSend(uint256 idx, uint256 timestamp) public {
        dayRewardShareIndexForSend[idx] = timestamp;
    }
    
    function getAvailableBondFee() external view returns (uint256) {
        return availableBondFee;
    }

    function initAvailableBondFee(uint256 _amount) external {
        availableBondFee = _amount;
    }

    function setRewardShareIndex(uint256 idx) external {
        rewardShareIndex = idx;
    }

    function setRewardShareIndexSend(uint256 idx) external {
        rewardShareIndexSend = idx;
    }

    function setRewardSharePerUserIndex(uint256 idx, uint256 rewardIdx) external {
        rewardSharePerUserIndex[idx] = rewardIdx;
    }

    function setRewardSharePerUserIndexSend(uint256 idx, uint256 rewardIdx) external {
        rewardSharePerUserIndexSend[idx] = rewardIdx;
    }

    function setUserBondYieldShareIndex(uint256 idx, uint256 value) external {
        userBondYieldShareIndex[idx] = value;
    }

    function setDayToRewardShareIndex(uint256 idx, uint256 value) external {
        dayToRewardShareIndex[idx] = value;
    }

    function setDayBondYieldShareIndex(uint256 idx, uint256 value) external {
        dayBondYieldShareIndex[idx] = value;
    }

    function setSecondsRefractionShareIndex(uint256 idx, uint256 value) external {
        secondsRefractionShareIndex[idx] = value;
    }

    function setSecondsRefractionShareIndexSend(uint256 idx, uint256 value) external {
        secondsRefractionShareIndexSend[idx] = value;
    }

    function setSecondsBondYieldShareIndex(uint256 idx, uint256 value) external {
        secondsBondYieldShareIndex[idx] = value;
    }

    function setTotalDeposit(uint256 value) external {
        totalDeposit = value;
    }

    function getAmountRequired() external view returns (uint256) {
        return amountRequired;
    }
}