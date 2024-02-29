// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

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

    event AddressUpdated(address indexed _address, uint256 indexed _index);
    event TransactionStatusChanged(uint256 newStatus);
    event WhitelistChanged(address indexed whitelistingAddress, bool indexed action);
    
    function initialize() external initializer {
        __ERC20_init("sEndToken", "sEnd");
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        setStatus(1);
        status = 1;
        enableOrDisableTX = false;
    }

    function setAddress(address _addr, uint256 _type) public onlyRole(DEFAULT_ADMIN_ROLE) {
        if (_addr == address(0)) revert ZeroAddress();

        if (_type == 1) staking = _addr;

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

    function setMinterRole(address _staking) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(MINTER_ROLE, _staking);
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
        emit TransactionStatusChanged(_status);
    }

    function _transfer(address from, address to, uint256 value) internal override {
        verifyStatus();
        super._transfer(from, to, value);
    }

    function burn(address from, uint256 value) public {
        super._transfer(from, address(0xdead), value);
    }

    function whitelist(address _whitelistingAddress, bool _action) external onlyRole(DEFAULT_ADMIN_ROLE){
        isWhitelisted[_whitelistingAddress] = _action;
        emit WhitelistChanged(_whitelistingAddress, _action);
    }

    ///for testing purpose
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
