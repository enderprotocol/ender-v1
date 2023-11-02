// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

// Interfaces
import "../interfaces/IEndToken.sol";
import "../interfaces/IEnderBond.sol";
import "hardhat/console.sol";

error ZeroAddress();
error InvalidParam();
error InvalidEarlyEpoch();
error ZeroFeeCollected();
error ThreeMonthVestingNotComplete();
error ZeroAmount();
error MoreThanMintAmount();
error VestingNotCompleted();

/**
 * @title EndToken contract
 * @notice Implements Ender Protocol's rebasing token - END
 */
contract EndToken is IEndToken, ERC20Upgradeable, AccessControlUpgradeable {
    address public treasury;

    uint256 public refractionFeePercentage;
    uint256 public refractionFeeTotal;

    uint256 public prevAmount;

    uint256 public todayAmount;

    uint256 private lastTransfer;

    uint256 public lastEpoch;

    uint256 public mintPrec;

    uint256 public treasuryMintAmount;

    uint256 public treasuryClaimTime;

    uint256 public treasuryClaimedAmount;

    uint256 public treasuryMintTime;

    address public enderBond;

    // minter role hash
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    mapping(address => bool) public excludeWallets;

    event TreasuryContractChanged(address indexed newTreasury);
    event FeeUpdated(uint256 fee);
    event DayfeeUpdated(uint256 amount, uint256 updateTime);
    event RefractionFeesDistributed(address indexed to, uint256 indexed amount);

    /**
     * @notice Initializes the EndToken contract
     */
    function initialize() external initializer {
        __ERC20_init("End Token", "END");

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);

        // add exclude wallets
        excludeWallets[address(this)] = true;
        excludeWallets[msg.sender] = true;

        unchecked {
            lastTransfer = block.timestamp - (block.timestamp % 1 days);
        }

        ///// this is only for testing
        _mint(msg.sender, 1e13);
    }

    /**
     * @notice Returns the number of decimals
     * @return uint8 The number of decimal places the token uses
     */
    function decimals() public view virtual override returns (uint8) {
        return 9;
    }

    function setBond(address addrs) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (addrs == address(0)) revert ZeroAddress();
        enderBond = addrs;
    }

    function setFee(uint256 fee) public onlyRole(DEFAULT_ADMIN_ROLE) {
        if (fee == 0) revert InvalidParam();

        refractionFeePercentage = fee;

        emit FeeUpdated(fee);
    }

    function setExclude(address[] calldata addrs, bool flag) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (addrs.length == 0) revert InvalidParam();

        unchecked {
            for (uint8 i; i < addrs.length; ++i) excludeWallets[addrs[i]] = flag;
        }
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

    function treasuryMint() external onlyRole(DEFAULT_ADMIN_ROLE) {
        if ((treasuryMintTime + 365 days) > block.timestamp) revert ThreeMonthVestingNotComplete();
        treasuryMintTime = block.timestamp;
        uint256 mintAmount = ((totalSupply()) * mintPrec) / 10000;
        treasuryMintAmount = mintAmount;
        mint(address(this), mintAmount);
    }

    function getMintedEnd(uint256 _amount, address _addr) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (_amount == 0) revert ZeroAmount();
        if (_amount > (treasuryMintAmount*4)/100) revert MoreThanMintAmount();
        if (treasuryClaimTime + 90 days > block.timestamp) revert VestingNotCompleted();        
        treasuryClaimTime = block.timestamp;
        transfer(_addr, _amount);
    }

    /**
     * @notice Mints a specified amount of tokens to the treasury
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        if (to == address(0)) revert ZeroAddress();

        _mint(to, amount);
    }

    function _transfer(address from, address to, uint256 amount) internal override {
        if (excludeWallets[from] || excludeWallets[to]) {
            console.log("excluded");
            super._transfer(from, to, amount);
        } else {
            uint256 fee = (amount * refractionFeePercentage) / 100;

            if (fee != 0) {
                unchecked {
                    refractionFeeTotal += fee;
                }

                super._transfer(from, address(this), fee);
            }

            super._transfer(from, to, amount - fee);
        }
    }

    function distributeRefractionFees() external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (lastEpoch + 1 days > block.timestamp) revert InvalidEarlyEpoch();
        uint256 feesToTransfer = refractionFeeTotal;
        if (feesToTransfer == 0) revert ZeroFeeCollected();
        refractionFeeTotal = 0;

        lastEpoch = block.timestamp;
        console.log("feesCollected", feesToTransfer);
        _approve(address(this), enderBond, feesToTransfer);
        IEnderBond(enderBond).epochRewardShareIndex(feesToTransfer);
        // _transfer(address(this), enderBond, feesToTransfer);
        emit RefractionFeesDistributed(enderBond, feesToTransfer);
    }
}
