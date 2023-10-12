// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    mapping(address => bool) public isWhitelisted;

    error NotOwner();
    error NotWhitelisted();

    event WhiteListChanged(address indexed _whitelistingAddress, bool indexed _action);

    constructor() ERC20("Ender", "END") Ownable(msg.sender) {
        _mint(msg.sender, 100000000000 * decimals());
    }

    function _transfer(address from, address to, uint256 value) internal override {
        require(isWhitelisted[from], "Not Whitelisted");
        ERC20._transfer(from, to, value);
    }

    function whitelist(address _whitelistingAddress, bool _action) external {
        if (msg.sender != owner()) {
            revert NotOwner();
        }
        isWhitelisted[_whitelistingAddress] = _action;
        emit WhiteListChanged(_whitelistingAddress, _action);
    }
}
