// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    bool enableOrDisableTX;
    StatusType status;
    mapping(address => bool) public isWhitelisted;

    enum StatusType {
        FIRST,
        SECOND,
        THIRD
    }

    error NotOwner();
    error NotWhitelisted();
    error TransactionDisabled();

    event WhiteListChanged(address indexed _whitelistingAddress, bool indexed _action);

    constructor() ERC20("Ender", "END") Ownable() {
        status = StatusType.FIRST;
        enableOrDisableTX = false;
        _mint(msg.sender, 100000000000 * decimals());
    }

    function verifyStatus() internal {
        if (status == StatusType.FIRST) {
            revert TransactionDisabled();
        } else if (status == StatusType.SECOND) {
            if (!isWhitelisted[msg.sender]) revert TransactionDisabled();
        } else if (status == StatusType.THIRD) {
            if (!enableOrDisableTX) revert TransactionDisabled();
        }
    }

    function setStatus(StatusType _status) public {
        if (msg.sender != owner()) {
            revert NotOwner();
        }
        status = _status;
    }

    function getStatus() external view returns (StatusType) {
        return status;
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
