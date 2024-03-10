// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../EnderBond.sol";

contract MockEnderBond is EnderBond {
    function getAvailableBondFee() external view returns (uint256) {
        return availableBondFee;
    }

    function initAvailableBondFee(uint256 _amount) external {
        availableBondFee = _amount;
    }

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
}