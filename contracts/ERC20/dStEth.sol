// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DStEth is ERC20 {
    constructor() ERC20("dStEth", "stETH") {
        _mint(msg.sender, 1000000000e18);
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
