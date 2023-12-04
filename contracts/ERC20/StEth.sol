// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract StEth is ERC20 {
    constructor() ERC20("dStEth", "stETH") {
        _mint(msg.sender, 1000000000e18);
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
