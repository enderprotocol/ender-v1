// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
// import "@chainlink/contracts/src/v0.8/automation/KeeperCompatible.sol";
// Interfaces
import "../interfaces/IEndToken.sol";
import "../interfaces/IEnderBond.sol";
import "hardhat/console.sol";

error ZeroAddress();
error InvalidParam();
error InvalidEarlyEpoch();
error ZeroAmount();
error WaitingTimeNotCompleted();

/**
 * @title EndToken contract
 * @notice Implements Ender Protocol's rebasing token - END
 */
contract EndToken is IEndToken, ERC20Upgradeable, AccessControlUpgradeable {
    address public treasury;
    address public admin;

    uint256 public refractionFeePercentage;
    uint256 public refractionFeeTotal;

    uint256 private lastTransfer;

    uint256 public lastEpoch;

    //Mint
    uint256 public mintFee;

    uint256 public mintCount;

    address public enderBond;

    uint256 public lastYear;

    struct VestAmount {
        uint256 totalAmount;
        bool threeMonths;
        bool sixMonths;
        bool nineMonths;
    }
    // minter role hash
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ENDERBOND_ROLE = keccak256("ENDERBOND_ROLE");

    mapping(address => bool) public excludeWallets;

    //mint
    mapping(uint256 => uint256) public vestedAmounts; // count => amount
    mapping(uint256 => uint256) public vestedTime; // count => time
    mapping(uint256 => VestAmount) public yearlyVestAmount;

    event TreasuryContractChanged(address indexed newTreasury);
    event FeeUpdated(uint256 fee);
    event RefractionFeesDistributed(address indexed to, uint256 indexed amount);
    event MintAndVest(uint256 time, uint256 mintAmount);
    event GetMintedEnd(uint256 time, uint256 withdrawAmount);

    /**
     * @notice Initializes the EndToken contract
     */
    function initialize() external initializer {
        __ERC20_init("End Token", "END");

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        admin = msg.sender; //todo pass the admin address in parameter
        // add exclude wallets
        excludeWallets[address(this)] = true;
        excludeWallets[msg.sender] = true; //todo pass the admin address in parameter
        mintCount = 4;
        mintFee = 1600;
        lastYear = block.timestamp/ 31536000;
        setFee(500);
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
        return 18;
    }

    function setBond(address addrs) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (addrs == address(0)) revert ZeroAddress();
        enderBond = addrs;
        _grantRole(ENDERBOND_ROLE, enderBond);
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
        _grantRole(MINTER_ROLE, treasury);
        emit TreasuryContractChanged(treasury_);
    }

    function setAdmin(address _admin) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (_admin == address(0)) revert ZeroAddress();
        admin = _admin;
    }



   function getMintedEnd() external{
        mintAndVest();
        uint256 time = block.timestamp;
        uint256 withdrawAmount = 0;
        uint256 secondsInYear = 31536000;
        uint256 lastYearStart = lastYear ;

        VestAmount storage lastYearVest = yearlyVestAmount[lastYear];

        if (lastYear*secondsInYear< time ) {
            uint256 theeeMonths = lastYearStart*secondsInYear + 90 days;
            uint256 sixMonths = lastYearStart*secondsInYear + 180 days;
            uint256 nineMonths = lastYearStart*secondsInYear + 270 days;

            if (lastYearVest.threeMonths && theeeMonths <= time)
                {
                withdrawAmount += lastYearVest.totalAmount / 3;
                lastYearVest.threeMonths = false;
                }
            if (lastYearVest.sixMonths && sixMonths <= time) 
               {
                withdrawAmount += lastYearVest.totalAmount / 3;
                lastYearVest.sixMonths = false;
               }
            if (lastYearVest.nineMonths && nineMonths <= time) 
              {
                withdrawAmount += lastYearVest.totalAmount / 3;
                lastYearVest.nineMonths = false;
              }
        }
        if (withdrawAmount > 0) {
            _transfer(address(this),admin,withdrawAmount);
        }
    }


    /**
     * @notice Mints a specified amount of tokens to the treasury
     * @param amount The amount of tokens to mint
     * Note deleted the minter role for testing
     */
    function mint(address to, uint256 amount) public {
        if (to == address(0)) revert ZeroAddress();

        _mint(to, amount);
    }


    function mintAndVest() internal {
        uint256 time = block.timestamp;
        if(time>=lastYear*31536000 + 365 days){
        uint256 mintAmount = (totalSupply() * mintFee) / 10000;
        yearlyVestAmount[time / 31536000] = VestAmount(mintAmount, true, true, true);
        mint(address(this), mintAmount);
        if (mintFee != 100) {
            mintFee -= 100;
        }
        lastYear = time / 31536000;
        emit MintAndVest(block.timestamp, mintAmount);
        }
    }
    function _transfer(address from, address to, uint256 amount) internal override {
        if (excludeWallets[from] || excludeWallets[to]) {
            super._transfer(from, to, amount);
        } else {
            uint256 fee = (amount * refractionFeePercentage) / 100;
            console.log("Refraction fees deducted in End token:- ", fee);

            if (fee != 0) {
                unchecked {
                    refractionFeeTotal += fee;
                }

                super._transfer(from, address(this), fee);
            }

            super._transfer(from, to, amount - fee);
        }
    }

    // function distributeRefractionFees() external onlyRole(DEFAULT_ADMIN_ROLE) {
    function distributeRefractionFees() external onlyRole(ENDERBOND_ROLE) {
        // if (lastEpoch + 1 days > block.timestamp) revert InvalidEarlyEpoch();
        uint256 feesToTransfer = refractionFeeTotal;
        if (feesToTransfer != 0) {
            refractionFeeTotal = 0;
            // console.log("Total Refraction fees:- ", feesToTransfer);
            lastEpoch = block.timestamp;
            _approve(address(this), enderBond, feesToTransfer);
            IEnderBond(enderBond).epochRewardShareIndex(feesToTransfer);
            // _transfer(address(this), enderBond, feesToTransfer);
            emit RefractionFeesDistributed(enderBond, feesToTransfer);
        }
        console.log("Total Refraction fees outside if block:- ", feesToTransfer);
    }
}
