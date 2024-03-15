// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract MockLido {
    function submit(address addr) external pure {
        revert();
    }
}