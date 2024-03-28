// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

// Openzeppelin
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./strategy/eigenlayer/EnderELStrategy.sol";

// Interfaces
import "./interfaces/IEndToken.sol";
import "./interfaces/IInstadappLite.sol";
import "./interfaces/ILybraFinance.sol";
import "./interfaces/IEnderBond.sol";
import "hardhat/console.sol";

error NotAllowed();
error TransferFailed();
error InvalidStrategy();
error InvalidRequest();
error InvalidBaseRate();
error ZeroAmount();
error InvalidRatio();
error NotEnoughAvailableFunds();
error InvalidAddress();
error InvalidType();

contract EnderTreasury is Initializable, OwnableUpgradeable, EnderELStrategy {
    using SafeERC20 for IERC20;
    mapping(address => bool) public strategies;
    mapping(address => uint256) public fundsInfo;
    mapping(address => uint256) public totalAssetStakedInStrategy;
    mapping(address => uint256) public totalAssetStakedPerStrategy;
    mapping(address => uint256) public totalRewardsFromStrategy;

    mapping(address => address) public strategyToReceiptToken;

    address private endToken;
    address private enderBond;
    address private enderDepositor;
    address public enderStaking;
    address public instadapp;
    address public lybraFinance;
    address public eigenLayer;
    address public priorityStrategy;

    uint256 public bondYieldBaseRate;
    uint256 public balanceLastEpoch;
    int256 public nominalYield;
    uint256 public availableFundsPercentage;
    uint256 public reserveFundsPercentage;
    uint256 public epochDeposit;
    uint256 public epochWithdrawl;
    uint256 public instaDappLastValuation;
    uint256 public instaDappWithdrawlValuations;
    uint256 public instaDappDepositValuations;
    uint256 public totalDepositInStrategy;

    event StrategyUpdated(address indexed strategy, bool isActive);
    event PriorityStrategyUpdated(address indexed priorityStrategy);
    event NominalYieldUpdated(int256 nominalYield);
    event BondYieldBaseRateUpdated(uint256 bondYieldBaseRate);
    event TreasuryDeposit(address indexed asset, uint256 amount);
    event TreasuryWithdraw(address indexed asset, uint256 amount);
    event StrategyDeposit(address indexed asset, address indexed strategy, uint256 amount);
    event StrategyWithdraw(address indexed asset, address indexed strategy, uint256 amount);
    event Collect(address indexed account, uint256 amount);
    event MintEndToUser(address indexed to, uint256 amount);

    /**
     * @notice Initialize the contract and set the END token address
     * @param _endToken  Address of END token contract
     * @param _bond  Address of Ender bond contract
     */
    function initializeTreasury(
        address _endToken,
        address _enderStaking,
        address _bond,
        address _instadapp,
        address _lybraFinance,
        address _eigenLayer,
        uint256 _availableFundsPercentage,
        uint256 _reserveFundsPercentage
    ) external initializer {
        if (_availableFundsPercentage != 70 && _reserveFundsPercentage != 30) revert InvalidRatio();
        __Ownable_init();
        enderStaking = _enderStaking;
        instadapp = _instadapp;
        lybraFinance = _lybraFinance;
        eigenLayer = _eigenLayer;
        strategies[instadapp] = true;
        strategies[lybraFinance] = true;
        strategies[eigenLayer] = true;
        setAddress(_endToken, 1);
        setAddress(_bond, 2);
        setBondYieldBaseRate(300);
        priorityStrategy = instadapp;
        nominalYield = 1000;
    }

    modifier validStrategy(address str) {
        if (!strategies[str]) revert NotAllowed();
        _;
    }

    modifier onlyBond() {
        if (msg.sender != enderBond) revert NotAllowed();
        _;
    }

    modifier onlyStaking() {
        if (msg.sender != enderStaking) revert NotAllowed();
        _;
    }

    /**
     * @notice Update the address
     * @param _addr The new address
     * @param _type  Address type
     */
    //need to make the numbers uniform accross the contracts

    function setAddress(address _addr, uint256 _type) public onlyOwner {
        if (_addr == address(0)) revert ZeroAddress();

        if (_type == 1) endToken = _addr;
        else if (_type == 2) enderBond = _addr;
        else if (_type == 3) enderDepositor = _addr;
        else if (_type == 4) strategyToReceiptToken[instadapp] = _addr;
        else if (_type == 5) strategyToReceiptToken[lybraFinance] = _addr;
        else if (_type == 6) strategyToReceiptToken[eigenLayer] = _addr;
        else revert InvalidAddress();
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

    // cannot use getAddress as for testing purpose
    function getAddressByType(uint256 _type) external view returns (address addr) {
        if (_type == 0) revert ZeroAddress();

        if (_type == 1) addr = endToken;
        else if (_type == 2) addr = enderBond;
        else if (_type == 3) addr = enderDepositor;
        else if (_type == 4) addr = strategyToReceiptToken[instadapp];
        else if (_type == 5) addr = strategyToReceiptToken[lybraFinance];
        else if (_type == 6) addr = strategyToReceiptToken[eigenLayer];
        else revert InvalidType();
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
                emit StrategyUpdated(_strs[i], _flag);
            }
        }
    }

    function setPriorityStrategy(address _priorityStrategy) public onlyOwner {
        priorityStrategy = _priorityStrategy;
        emit PriorityStrategyUpdated(_priorityStrategy);
    }

    function setNominalYield(int256 _nominalYield) public onlyOwner {
        nominalYield = _nominalYield;
        emit NominalYieldUpdated(_nominalYield);
    }

    function depositTreasury(EndRequest memory param, uint256 amountRequired) external onlyBond {
        unchecked {
            if (amountRequired > 0) {
                withdrawFromStrategy(param.stakingToken, priorityStrategy, amountRequired);
            }
            epochDeposit += param.tokenAmt;
            fundsInfo[param.stakingToken] += param.tokenAmt;
        }
        emit TreasuryDeposit(param.stakingToken, param.tokenAmt);
    }

    function _transferFunds(address _account, address _token, uint256 _amount) internal {
        if (_account == address(0)) revert ZeroAddress();
        if (_token == address(0)) {
            (bool success, ) = payable(_account).call{value: _amount}("");
            if (!success) revert TransferFailed();
        } else IERC20(_token).safeTransfer(_account, _amount);
    }

    function stakeRebasingReward(address _tokenAddress) public onlyStaking returns (uint256 rebaseReward) {
        int256 bondReturn = int256(IEnderBond(enderBond).endMint() / 1000);
        int256 depositReturn = int256(calculateDepositReturn(_tokenAddress));
        balanceLastEpoch = IERC20(_tokenAddress).balanceOf(address(this));
        if (depositReturn == 0) {
            epochWithdrawl = 0;
            epochDeposit = 0;
            rebaseReward = 0;
            address receiptToken = instadapp;
            if (IInstadappLite(receiptToken).balanceOf(address(this)) > 0) {
                instaDappLastValuation = IInstadappLite(instadapp).viewStinstaTokens(
                    IERC20(receiptToken).balanceOf(address(this))
                );
            }
            instaDappWithdrawlValuations = 0;
            instaDappDepositValuations = 0;
        } else {
            (uint stETHPool, uint ENDSupply) = ETHDenomination(_tokenAddress);
            depositReturn = (depositReturn * int256(stETHPool) * 1000) / int256(ENDSupply);
            rebaseReward = uint256((depositReturn + ((depositReturn * nominalYield) / 10000) - bondReturn));
            epochWithdrawl = 0;
            epochDeposit = 0;
            IEnderBond(enderBond).resetEndMint();
            address receiptToken = instadapp;
            instaDappLastValuation = IInstadappLite(instadapp).viewStinstaTokens(
                IERC20(receiptToken).balanceOf(address(this))
            );
            instaDappWithdrawlValuations = 0;
            instaDappDepositValuations = 0;
        }
    }

    /**
     * @notice function to deposit available funds to strategies.
     * @param _asset address of underlying staked asset e.g: stETH
     * @param _strategy address of the strategy in which admin wish to deposit,
     * @param _depositAmt amount of stETH admin wants to deposit to the strategy.
     */
    // validStrategy param is wrong, should be validStrategy(_strategy)
    function depositInStrategy(address _asset, address _strategy, uint256 _depositAmt) public validStrategy(_strategy) {
        if (_depositAmt == 0) revert ZeroAmount();
        //  ym: _strategy == address(0) can be removed as we are already checking in validStrategy
        if (_asset == address(0) || _strategy == address(0)) revert ZeroAddress();
        if (_strategy == instadapp) {
            IERC20(_asset).approve(_strategy, _depositAmt);
            IInstadappLite(instadapp).deposit(_depositAmt); // note for testing we changed the function sig.
            instaDappDepositValuations += _depositAmt;
            console.log("deposit:",_depositAmt);
        } else if (_strategy == lybraFinance) {
            IERC20(_asset).approve(lybraFinance, _depositAmt);
            ILybraFinance(lybraFinance).depositAssetToMint(_depositAmt, 0);
        } else if (_strategy == eigenLayer) {
            //Todo will add the instance while going on mainnet.
        }
        totalAssetStakedInStrategy[_asset] += _depositAmt;
        totalAssetStakedPerStrategy[_strategy] += _depositAmt;
        totalDepositInStrategy += _depositAmt;
        emit StrategyDeposit(_asset, _strategy, _depositAmt);
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
    ) public validStrategy(_strategy) returns (uint256 _returnAmount) {
        if (_withdrawAmt == 0) revert ZeroAmount();
        // ym: _strategy == address(0) can be removed as we are already checking in validStrategy
        if (_asset == address(0) || _strategy == address(0)) revert ZeroAddress();
        // ym: receiptToken should be asset token, otherwise there is no approve function
        address receiptToken = _asset;
        if (_strategy == instadapp) {
            //Todo set the asset as recipt tokens and need to check the assets ratio while depolying on mainnet
            _withdrawAmt = IInstadappLite(instadapp).viewStinstaTokensValue(_withdrawAmt);
            IERC20(receiptToken).approve(instadapp, _withdrawAmt);
            _returnAmount = IInstadappLite(instadapp).withdrawStinstaTokens(_withdrawAmt);
            instaDappWithdrawlValuations += _returnAmount;
        } else if (_strategy == lybraFinance) {
            IERC20(receiptToken).approve(lybraFinance, _withdrawAmt);
            _returnAmount = ILybraFinance(lybraFinance).withdraw(address(this), _withdrawAmt);
        }
        totalAssetStakedInStrategy[_asset] -= _withdrawAmt;
        totalAssetStakedPerStrategy[_strategy] -= _withdrawAmt;
        totalDepositInStrategy -= _withdrawAmt;

        // ym: why this value could be zero?
        if (_returnAmount > 0) {
            totalRewardsFromStrategy[_asset] += _returnAmount;
        }
        emit StrategyWithdraw(_asset, _strategy, _returnAmount);
    }

    /**
     * @notice Withdraw function
     * @param param Withdraw parameter
     */
    function withdraw(EndRequest memory param, uint256 amountRequired) external onlyBond {
        if (param.account == address(0)) revert ZeroAddress();
        if (param.stakingToken != address(0) && amountRequired > IERC20(param.stakingToken).balanceOf(address(this))) {
            withdrawFromStrategy(param.stakingToken, priorityStrategy, amountRequired);
        }
        epochWithdrawl += param.tokenAmt;
        // ym: fundsInfo has no zero address token
        if (param.stakingToken != address(0)) fundsInfo[param.stakingToken] -= param.tokenAmt;

        // bond token transfer
        _transferFunds(param.account, param.stakingToken, param.tokenAmt);
        emit TreasuryWithdraw(param.stakingToken, param.tokenAmt);
    }

    /**
     * @notice Collect END token as bond reward
     * @param account Address of user's wallet
     * @param amount Collect amount
     */

    function collect(address account, uint256 amount) external onlyBond {
        IERC20(endToken).safeTransfer(account, amount);
        emit Collect(account, amount);
    }

    function mintEndToUser(address _to, uint256 _amount) external onlyBond {
        ///just return for temp  should changethe
        IEndToken(endToken).mint(_to, _amount);
        emit MintEndToUser(_to, _amount);
    }

    /**
     * @dev Calculates the total return for a given asset.
     * @param _stEthAddress The address of the asset (e.g., stETH token).
     * @return totalReturn The total return, which is the change in asset balance.
     */
    function calculateTotalReturn(address _stEthAddress) internal view returns (uint256 totalReturn) {
        uint256 stReturn;
        address receiptToken = instadapp;
        uint256 receiptTokenAmount = IInstadappLite(receiptToken).balanceOf(address(this));
        if (IInstadappLite(receiptToken).balanceOf(address(this)) > 0) {
            stReturn =
                IInstadappLite(receiptToken).viewStinstaTokens(receiptTokenAmount) +
                instaDappWithdrawlValuations -
                instaDappDepositValuations -
                instaDappLastValuation;
        }
        totalReturn =
            IERC20(_stEthAddress).balanceOf(address(this)) +
            epochWithdrawl +
            instaDappDepositValuations +
            stReturn -
            epochDeposit -
            balanceLastEpoch;
    }

    /**
     * @dev Calculates the deposit return ba sed on the total return and available funds.
     * @param _stEthAddress The address of the asset (e.g., stETH token).
     * @return depositReturn The deposit return as a fraction of available funds.
     */

    function calculateDepositReturn(address _stEthAddress) public view returns (uint256 depositReturn) {
        uint256 totalReturn = calculateTotalReturn(_stEthAddress);
        console.log("totalReturn:", totalReturn);
        if (totalReturn == 0) {
            depositReturn = 0;
        } else {
            //here we have to multiply 100000 and dividing so that the balanceLastEpoch < fundsInfo[_stEthAddress].depositFunds
            depositReturn =
                (totalReturn * fundsInfo[_stEthAddress]) /
                (fundsInfo[_stEthAddress] + IERC20(_stEthAddress).balanceOf(address(this)));
        }
    }

    function ETHDenomination(address _stEthAddress) public view returns (uint stETHPoolAmount, uint ENDSupply) {
        uint stETHBalance = IERC20(_stEthAddress).balanceOf(address(this));
        address receiptToken = instadapp;
        uint256 receiptTokenAmount = IInstadappLite(receiptToken).balanceOf(address(this));
        uint stRewards;
        if (IInstadappLite(receiptToken).balanceOf(address(this)) > 0)
            stRewards = IInstadappLite(receiptToken).viewStinstaTokens(receiptTokenAmount);

        stETHPoolAmount = stETHBalance + stRewards + totalDepositInStrategy;
        ENDSupply = IERC20(endToken).totalSupply();
    }

    function withdrawBondFee(address stETH, uint amount) external onlyOwner {
        (uint stETHPoolAmount, uint ENDSupply) = ETHDenomination(stETH);
        // ym: IEnderBond(enderBond).availableBondFee() cannot return correct data
        if (((stETHPoolAmount * 1000) - ENDSupply) > amount && IEnderBond(enderBond).availableBondFee() >= amount) {
            IEnderBond(enderBond).setAvailableBondFee(amount);
            IERC20(stETH).safeTransfer(owner(), amount);
        }
    }

    receive() external payable virtual override {}
}
