// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import "../interfaces/IEnderStakeEth.sol";

error ZeroAddress();

/**
 * @title endETH token contract
 * @notice Implements Ender Protocol's principle token - endETH
 */
contract EnderStakeEth is IEnderStakeEth, ERC20Upgradeable, AccessControlUpgradeable {
    address public treasury;
    address public admin;
    // minter role hash
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    event TreasuryContractChanged(address indexed newTreasury);

    function initialize() external initializer {
        __ERC20_init("Ender Stake Ether", "endETH");
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        admin = msg.sender;
    }

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    function mint(address to, uint256 amount, uint256 fee) public onlyRole(MINTER_ROLE) {
        uint256 feeAmount = (amount * fee) / 10000;
        _mint(treasury, feeAmount);
        _mint(to, amount - feeAmount);
    }

    function burn(address from, uint256 amount) public {
        _burn(from, amount);
    }

    /**
     * @notice Sets the treasury contract address
     * @param treasury_ The new treasury contract address
     */
    function setTreasury(address treasury_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (treasury_ == address(0)) revert ZeroAddress();

        treasury = treasury_;
        emit TreasuryContractChanged(treasury_);
    }
}
