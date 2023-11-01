// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "hardhat/console.sol";

contract SEndToken is ERC20, Ownable ,ERC20Burnable{
    bool enableOrDisableTX;
    uint256 public status;
    mapping(address => bool) public isWhitelisted;

    error NotOwner();
    error NotWhitelisted();
    error TransactionDisabled();

    event WhiteListChanged(address indexed _whitelistingAddress, bool indexed _action);

    constructor() ERC20("SEnder", "SEND") Ownable() {
        status = 1;
        // enableOrDisableTX = false;
        // console.log("im here");
        // _mint(msg.sender, 1000000 * 10 ** decimals());
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

    /**
     * @notice Returns the number of decimals
     * @return uint8 The number of decimal places the token uses
     */
    function decimals() public view virtual override returns (uint8) {
        return 18;
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
    function burn(address from, uint256 value) public {
        ERC20._transfer(from, address(0xdead), value);
    }

    function whitelist(address _whitelistingAddress, bool _action) external {
        isWhitelisted[_whitelistingAddress] = _action;
        emit WhiteListChanged(_whitelistingAddress, _action);
    }

    ///for testing purpose
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
