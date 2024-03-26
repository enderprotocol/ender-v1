// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {EnderStaking} from "../EnderStaking.sol";

contract MockEnderStaking is EnderStaking {
    function hash(signData memory userSign) external view returns (bytes32) {
        return _hash(userSign);
    }

    function hashTypedDataV4(bytes32 structHash) external view virtual returns (bytes32) {
        return _hashTypedDataV4(structHash);
    }

    function verify(signData memory userSign) external view returns (address) {
        return _verify(userSign);
    }

    function _calculateRebaseIndex() external {
        return calculateRebaseIndex();
    }
}
