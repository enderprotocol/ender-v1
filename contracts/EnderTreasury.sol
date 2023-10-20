// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Openzeppelin
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./strategy/eigenlayer/EnderELStrategy.sol";

// Interfaces
import "./interfaces/IEndToken.sol";
import "./interfaces/IEnderOracle.sol";
import "./interfaces/IEnderStrategy.sol";
import "./interfaces/IEnderTreasury.sol";
import "./interfaces/IInstadappLite.sol";
import "./interfaces/ILybraFinance.sol";
import "./interfaces/IEnderBond.sol";

error NotAllowed();
// error ZeroAddress();
error TransferFailed();
error InvalidStrategy();
error InvalidRequest();
error InvalidBaseRate();
error ZeroAmount();
error InvalidRatio();
error NotEnoughAvailableFunds();

contract EnderTreasury is Initializable, OwnableUpgradeable, EnderELStrategy {
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
    address public instadapp;
    address public lybraFinance;
    address public eigenLayer;
    // address public stEthELS;
    IEnderOracle private enderOracle;

    uint256 public bondYieldBaseRate;
    uint256 public balanceLastEpoch;
    uint256 public nominalYield;
    uint256 public availableFundsPercentage;
    uint256 public reserveFundsPercentage;
    // uint256 public totalDeposit

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
    function initialize(
        address _endToken,
        address _bond,
        address _instadapp,
        address _lybraFinance,
        address _eigenLayer,
        uint256 _availableFundsPercentage,
        uint256 _reserveFundsPercentage
    )
        external
        // address _stEthELS
        initializer
    {
        __Ownable_init();
        // stEthELS = _stEthELS;
        instadapp = _instadapp;
        lybraFinance = _lybraFinance;
        eigenLayer = _eigenLayer;
        availableFundsPercentage = _availableFundsPercentage;
        reserveFundsPercentage = _reserveFundsPercentage;
        if (availableFundsPercentage + _reserveFundsPercentage != 100) revert InvalidRatio();
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

    function setNominalYield(uint256 _nominalYield) public onlyOwner {
        nominalYield = _nominalYield;
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
        uint256 _tokenId,
        // uint256 maturity,
        // uint256 bondFee,
        EndRequest memory param
    ) external onlyBond {
        unchecked {
            // update available info
            fundsInfo[param.stakingToken].availableFunds += ((param.tokenAmt) * availableFundsPercentage) / 100;
            fundsInfo[param.stakingToken].reserveFunds += ((param.tokenAmt) * reserveFundsPercentage) / 100;
            // uint256 bondReturn = IEnderBond(enderBond).calculateBondRewardAmount(_tokenId);
            // uint256 depositReturn = calculateDepositReturn(param.stakingToken);

            // rebaseReward = depositReturn - bondReturn + depositReturn * nominalYield;

            // mint END token
            // if (rebaseReward != 0) IEndToken(endToken).mint(address(this), rebaseReward);
        }
    }

    function _transferFunds(address _account, address _token, uint256 _amount) private {
        if (_token == address(0)) {
            (bool success, ) = payable(_account).call{value: _amount}("");
            if (!success) revert TransferFailed();
        } else IERC20(_token).transfer(_account, _amount);
    }

    function stakeRebasingReward(uint256 _tokenId, address _tokenAddress) public returns (uint256 rebaseReward) {
        uint256 bondReturn = IEnderBond(enderBond).calculateBondRewardAmount(_tokenId);
        uint256 depositReturn = calculateDepositReturn(_tokenAddress);
        rebaseReward = depositReturn - bondReturn + depositReturn * nominalYield;
    }

    /**
     * @notice function to deposit available funds to strategies.
     * @param _asset address of underlying staked asset e.g: stETH
     * @param _strategy address of the strategy in which admin wish to deposit,
     * @param _depositAmt amount of stETH admin wants to deposit to the strategy.
     */

    function depositInStrategy(address _asset, address _strategy, uint256 _depositAmt) public validStrategy(strategy) {
        if (_depositAmt == 0) revert ZeroAmount();
        if (_asset == address(0) || _strategy == address(0)) revert ZeroAddress();
        if (_strategy == instadapp) {
            IERC20(_asset).approve(instadapp, _depositAmt);
            IInstadappLite(instadapp).deposit(_depositAmt, msg.sender);
        } else if (_strategy == lybraFinance) {
            IERC20(_asset).approve(lybraFinance, _depositAmt);
            ILybraFinance(lybraFinance).depositAssetToMint(_depositAmt, 0);
        } else if (_strategy == eigenLayer) {
            deposit(EndRequest(address(this), _asset, _depositAmt));
        }
    }

    /**
     * @notice function to deposit available funds to strategies.
     * @param _asset address of underlying staked asset e.g: stETH
     * @param _strategy address of the strategy from which admin wish to withdraw,
     * @param _withdrawAmt amount of stETH admin wants to withdraw from the strategy.
     */
    function withdrawFromStrategy(
        address _asset,
        address _strategy,
        uint256 _withdrawAmt
    ) public validStrategy(strategy) returns (uint256 _returnAmount) {
        if (_withdrawAmt == 0) revert ZeroAmount();
        if (_asset == address(0) || _strategy == address(0)) revert ZeroAddress();
        if (_strategy == instadapp) {
            IERC20(_asset).approve(instadapp, _withdrawAmt);
            _returnAmount = IInstadappLite(instadapp).withdraw(_withdrawAmt, address(this), address(this));
        } else if (_strategy == lybraFinance) {
            IERC20(_asset).approve(lybraFinance, _withdrawAmt);
            _returnAmount = ILybraFinance(lybraFinance).withdraw(address(this), _withdrawAmt);
        }
    }

    /**
     * @notice Withdraw function
     * @param param Withdraw parameter
     */
    function withdraw(EndRequest memory param) external onlyBond {
        // if invalid reserve funds then withdraw from protocol
        uint256 currentFundsAmount = param.tokenAmt;
        if (fundsInfo[param.stakingToken].reserveFunds < param.tokenAmt) {
            currentFundsAmount -= fundsInfo[param.stakingToken].reserveFunds;
            fundsInfo[param.stakingToken].reserveFunds = 0;
            if (fundsInfo[param.stakingToken].availableFunds < currentFundsAmount) {
                uint256 withdrawAmount = withdrawFromStrategy(param.stakingToken, instadapp, currentFundsAmount);
                fundsInfo[param.stakingToken].reserveFunds += withdrawAmount;
            }
            fundsInfo[param.stakingToken].availableFunds -= currentFundsAmount;
        }
        // bond token transfer
        _transferFunds(param.account, param.stakingToken, param.tokenAmt);
    }

    /**
     * @notice Collect END token as bond reward
     * @param account Address of user's wallet
     * @param amount Collect amount
     */
    function collect(address account, uint256 amount) external onlyBond {
        IERC20(endToken).transfer(account, amount);
    }

    function mintEndRewToUser(address _to, uint256 _amount) external {
        ///just return for temp  should changethe
        IEndToken(endToken).mint(_to, _amount);
    }

    /**
     * @dev Calculates the total return for a given asset.
     * @param _stEthAddress The address of the asset (e.g., stETH token).
     * @return totalReturn The total return, which is the change in asset balance.
     */
    function calculateTotalReturn(address _stEthAddress) internal view returns (uint256 totalReturn) {
        totalReturn = IERC20(_stEthAddress).balanceOf(address(this)) - balanceLastEpoch;
    }

    /**
     * @dev Records the results of an epoch, including the deposit into a strategy.
     * @param _stEthAddress The address of the asset (e.g., stETH token).
     * @param _strategy The address of the strategy to deposit the total return.
     */
    function recordEpochResults(address _stEthAddress, address _strategy) public {
        uint256 totalReturn = calculateTotalReturn(_stEthAddress);
        depositInStrategy(_stEthAddress, _strategy, totalReturn);

        balanceLastEpoch = IERC20(_stEthAddress).balanceOf(address(this));
    }

    /**
     * @dev Calculates the deposit return based on the total return and available funds.
     * @param _stEthAddress The address of the asset (e.g., stETH token).
     * @return depositReturn The deposit return as a fraction of available funds.
     */

    function calculateDepositReturn(address _stEthAddress) public view returns (uint256 depositReturn) {
        uint256 totalReturn = calculateTotalReturn(_stEthAddress);
        depositReturn = totalReturn * (fundsInfo[_stEthAddress].availableFunds / balanceLastEpoch);
    }

    receive() external payable virtual override {}
}
