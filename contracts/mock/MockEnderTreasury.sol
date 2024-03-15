// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../EnderTreasury.sol";

contract MockEnderTreasury is EnderTreasury {

    function transferFunds(address _account, address _token, uint256 _amount) external {
        _transferFunds(_account, _token, _amount);
    }
}