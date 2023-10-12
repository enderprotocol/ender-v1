// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Openzeppelin
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

// Interfaces
import "./interfaces/IEndToken.sol";
import "./interfaces/IEnderOracle.sol";
import "./interfaces/IEnderStrategy.sol";
import "./interfaces/IEnderTreasury.sol";

error NotAllowed();
error ZeroAddress();
error TransferFailed();
error InvalidStrategy();
error InvalidRequest();
error InvalidBaseRate();

contract EnderTreasury is IEnderTreasury, Initializable, OwnableUpgradeable {
    mapping(address => bool) public strategies;

    mapping(address => FundInfo) internal fundsInfo;
    struct FundInfo {
        uint256 availableFunds;
        uint256 reserveFunds;
        uint256 depositFunds;
        uint256 shares;
    }

    address private endToken;
    address private enderBond;
    address private enderDepositor;
    IEnderOracle private enderOracle;

    uint256 public bondYieldBaseRate;

    event AddressUpdated(address indexed newAddr, AddressType addrType);
    event BondYieldBaseRateUpdated(uint256 bondYieldBaseRate);

    enum AddressType {
        ENDBOND,
        ENDTOKEN,
        ENDORACLE,
        DEPOSITOR
    }

    /**
     * @notice Initialize the contract and set the END token address
     * @param _endToken  Address of END token contract
     * @param _bond  Address of Ender bond contract
     */
    function initialize(address _endToken, address _bond) external initializer {
        __Ownable_init();

        setAddress(_bond, AddressType.ENDBOND);
        setAddress(_endToken, AddressType.ENDTOKEN);
        setBondYieldBaseRate(300);
    }

    modifier validStrategy(address str) {
        if (!strategies[str]) revert NotAllowed();
        _;
    }

    modifier onlyBond() {
        if (msg.sender != enderBond) revert NotAllowed();
        _;
    }

    /**
     * @notice Update the address
     * @param _addr The new address
     * @param _type  Address type
     */
    function setAddress(address _addr, AddressType _type) public onlyOwner {
        if (_addr == address(0)) revert ZeroAddress();

        if (_type == AddressType.ENDTOKEN) endToken = _addr;
        else if (_type == AddressType.ENDBOND) enderBond = _addr;
        else if (_type == AddressType.DEPOSITOR) enderDepositor = _addr;
        else if (_type == AddressType.ENDORACLE) enderOracle = IEnderOracle(_addr);

        emit AddressUpdated(_addr, _type);
    }

    /**
     * @notice Update bond yield base rate (by default, 3%)
     * @param _newBaseRate new rate to be set
     */
    function setBondYieldBaseRate(uint256 _newBaseRate) public onlyOwner {
        if (_newBaseRate == 0) revert InvalidBaseRate();

        bondYieldBaseRate = _newBaseRate;

        emit BondYieldBaseRateUpdated(_newBaseRate);
    }

    function getAddress(AddressType _type) external view returns (address addr) {
        if (_type == AddressType.ENDTOKEN) addr = endToken;
        else if (_type == AddressType.ENDBOND) addr = enderBond;
        else if (_type == AddressType.DEPOSITOR) addr = enderDepositor;
        else if (_type == AddressType.ENDORACLE) addr = address(enderOracle);
    }

    /**
     * @notice Set ender strategy addresses
     * @param _strs Addresses of ender strategies
     * @param _flag Bool flag for active or inactive
     */
    function setStrategy(address[] calldata _strs, bool _flag) external onlyOwner {
        if (_strs.length == 0) revert InvalidStrategy();
        unchecked {
            for (uint8 i; i < _strs.length; ++i) {
                strategies[_strs[i]] = _flag;
            }
        }
    }

    function getInterest(uint256 maturity) public view returns (uint256 rate) {
        unchecked {
            if (maturity > 180) rate = ((maturity - 180) * 15) / 180 + (bondYieldBaseRate + 30);
            else if (maturity > 90) rate = ((maturity - 90) * 15) / 90 + (bondYieldBaseRate + 15);
            else if (maturity > 60) rate = ((maturity - 60) * 15) / 30 + bondYieldBaseRate;
            else if (maturity > 30) rate = ((maturity - 30) * 30) / 30 + (bondYieldBaseRate - 30);
            else if (maturity > 15) rate = ((maturity - 15) * 15) / 15 + (bondYieldBaseRate - 45);
            else if (maturity > 7) rate = ((maturity - 7) * 15) / 8 + (bondYieldBaseRate - 60);
            else rate = ((maturity - 7) * 30) / 6 + (bondYieldBaseRate - 90);
        }
    }

    function getYieldMultiplier(uint256 bondFee) public pure returns (uint256 yieldMultiplier) {
        unchecked {
            if (bondFee > 100 || bondFee < 1) yieldMultiplier = 100;
            else yieldMultiplier = 100 + bondFee;
        }
    }

    /**
     * @notice Deposit function
     * @param rebond Flag for rebond
     * @param param Deposit parameter
     */
    function deposit(
        bool rebond,
        uint256 maturity,
        uint256 bondFee,
        EndRequest memory param
    ) external onlyBond returns (uint256 mintAmt) {
        unchecked {
            // update available info
            if (!rebond) fundsInfo[param.stakingToken].availableFunds += param.tokenAmt;

            (uint256 price, uint8 decimal) = enderOracle.getPrice(param.stakingToken);
            uint8 tokenDecimal = param.stakingToken == address(0) ? 18 : IPriceFeed(param.stakingToken).decimals();

            uint256 rate = getInterest(maturity) * getYieldMultiplier(bondFee);
            mintAmt = price * param.tokenAmt * rate;
            // set decimal as 9
            mintAmt = (mintAmt * 1e9) / (10 ** (6 + tokenDecimal + decimal));

            // mint END token
            if (mintAmt != 0) IEndToken(endToken).mint(address(this), mintAmt);
        }
    }

    function _transferFunds(address _account, address _token, uint256 _amount) private {
        if (_token == address(0)) {
            (bool success, ) = payable(_account).call{value: _amount}("");
            if (!success) revert TransferFailed();
        } else IERC20(_token).transfer(_account, _amount);
    }

    function depositInStrategy(
        address stakingToken,
        address strategy,
        uint256 reserve,
        uint256 depositAmt
    ) external validStrategy(strategy) {
        if (msg.sender != enderDepositor) revert NotAllowed();

        FundInfo storage fundItem = fundsInfo[stakingToken];
        if (reserve + depositAmt > fundItem.availableFunds) revert InvalidRequest();

        unchecked {
            fundItem.availableFunds -= reserve + depositAmt;
            fundItem.reserveFunds += reserve;
            fundItem.depositFunds += depositAmt;
        }

        // transfer tokens first
        _transferFunds(strategy, stakingToken, depositAmt);

        // do deposit
        IEnderStrategy(strategy).deposit(EndRequest(address(0), stakingToken, depositAmt));
    }

    /**
     * @notice Withdraw function
     * @param param Withdraw parameter
     */
    function withdraw(EndRequest memory param) external onlyBond returns (uint256 withdrawAmt) {
        // if invalid reserve funds then withdraw from protocol
        if (fundsInfo[param.stakingToken].reserveFunds < param.tokenAmt) {
            // if has withdraw request
        }

        // bond token transfer
        _transferFunds(param.account, param.stakingToken, withdrawAmt);
    }

    /**
     * @notice Collect END token as bond reward
     * @param account Address of user's wallet
     * @param amount Collect amount
     */
    function collect(address account, uint256 amount) external onlyBond {
        IERC20(endToken).transfer(account, amount);
    }

    receive() external payable {}
}
