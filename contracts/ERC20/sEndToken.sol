// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    bool enableOrDisableTX;
    uint256 public status;
    mapping(address => bool) public isWhitelisted;

    error NotOwner();
    error NotWhitelisted();
    error TransactionDisabled();

    event WhiteListChanged(address indexed _whitelistingAddress, bool indexed _action);

    constructor() ERC20("Ender", "END") Ownable() {
        status = 1;
        // enableOrDisableTX = false;
        _mint(msg.sender, 100000000000 * decimals());
    }

    function verifyStatus() internal view {
        if (status == 1) {
            revert TransactionDisabled();
        } else if (status == 2) {
            if (!isWhitelisted[msg.sender]) revert TransactionDisabled();
        } else if (status == 3) {
            //-----
        }
    }

    function setStatus(uint256 _status) public {
        if (msg.sender != owner()) {
            revert NotOwner();
        }
        status = _status;
    }

    function _transfer(address from, address to, uint256 value) internal override {
        verifyStatus();
        ERC20._transfer(from, to, value);
    }

    function whitelist(address _whitelistingAddress, bool _action) external {
        isWhitelisted[_whitelistingAddress] = _action;
        emit WhiteListChanged(_whitelistingAddress, _action);
    }
}
