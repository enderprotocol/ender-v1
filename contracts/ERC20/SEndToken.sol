// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "hardhat/console.sol";

contract SEndToken is ERC20Upgradeable, AccessControlUpgradeable {
    address public staking;
    bool enableOrDisableTX;

    uint256 public status;

    mapping(address => bool) public isWhitelisted;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    error NotOwner();
    error NotWhitelisted();
    error TransactionDisabled();
    error ZeroAddress();

    event WhiteListChanged(address indexed _whitelistingAddress, bool indexed _action);
    event AddressUpdated(address indexed _address, uint256 indexed _index);

    function initialize() external initializer {
        __ERC20_init("End Token", "END");
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        status = 1;
        enableOrDisableTX = false;
        console.log("im here");
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function setAddress(address _addr, uint256 _type) public onlyRole(DEFAULT_ADMIN_ROLE) {
        if (_addr == address(0)) revert ZeroAddress();

        if (_type == 1) staking = _addr;
        // else if (_type == 2) enderTreasury = _addr;
        // else if (_type == 3) endToken = _addr;
        // else if (_type == 4) sEndToken = _addr;

        emit AddressUpdated(_addr, _type);
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

    function setMinterRole() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(MINTER_ROLE, staking);
    }

    /**
     * @notice Returns the number of decimals
     * @return uint8 The number of decimal places the token uses
     */
    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    function setStatus(uint256 _status) public onlyRole(DEFAULT_ADMIN_ROLE) {
        status = _status;
    }

    function _transfer(address from, address to, uint256 value) internal override {
        verifyStatus();
        super._transfer(from, to, value);
    }

    function burn(address from, uint256 value) public {
        super._transfer(from, address(0xdead), value);
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
