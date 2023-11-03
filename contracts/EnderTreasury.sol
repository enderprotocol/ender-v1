// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Openzeppelin
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@chainlink/contracts/src/v0.8/automation/KeeperCompatible.sol";

import "./strategy/eigenlayer/EnderELStrategy.sol";

// Interfaces
import "./interfaces/IEndToken.sol";
import "./interfaces/IEnderOracle.sol";
import "./interfaces/IEnderStrategy.sol";
import "./interfaces/IEnderTreasury.sol";
import "./interfaces/IInstadappLite.sol";
import "./interfaces/ILybraFinance.sol";
import "./interfaces/IEnderBond.sol";

import "hardhat/console.sol";

error NotAllowed();
// error ZeroAddress();
error TransferFailed();
error InvalidStrategy();
error InvalidRequest();
error InvalidBaseRate();
error ZeroAmount();
error InvalidRatio();
error NotEnoughAvailableFunds();
error CanNotDepositToStrategyBeforeOneDay();

contract EnderTreasury is Initializable, OwnableUpgradeable, EnderELStrategy, KeeperCompatibleInterface {
    mapping(address => bool) public strategies;
    mapping(address => FundInfo) public fundsInfo;
    mapping(address => uint256) public totalAssetStakedInStrategy;
    mapping(address => uint256) public totalRewardsFromStrategy;
    mapping(uint256 => uint256) public availableFundsAtMaturity;

    struct FundInfo {
        uint256 availableFunds;
        uint256 reserveFunds;
        uint256 depositFunds;
        uint256 shares;
    }

    address private endToken;
    address private enderBond;
    address private enderDepositor;
    address public enderStaking;
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
    uint256 public lastDepositTime;
    uint256 public epochDeposit;
    uint256 public epochWithdrawl;
    /* Use an interval in seconds and a timestamp to slow execution of Upkeep */
    uint public interval;
    uint public lastTimeStamp;

    // uint256 public stEthBalBeforeStDep;
    // uint256 public totalEthStakedInStrategy;
    // uint256 public totalDeposit

    event AddressUpdated(address indexed newAddr, uint256 addrType);
    event BondYieldBaseRateUpdated(uint256 bondYieldBaseRate);

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
        uint256 _reserveFundsPercentage,
        address _oracle,
        uint256 _updateIntervel
    )
        external
        // address _stEthELS
        initializer
    {
        if (_availableFundsPercentage != 70 && _reserveFundsPercentage != 30) revert InvalidRatio();
        __Ownable_init();
        // stEthELS = _stEthELS;
        enderStaking = _enderStaking;
        enderOracle = IEnderOracle(_oracle);
        instadapp = _instadapp;
        lybraFinance = _lybraFinance;
        eigenLayer = _eigenLayer;
        strategies[instadapp] = true;
        strategies[lybraFinance] = true;
        strategies[eigenLayer] = true;
        availableFundsPercentage = _availableFundsPercentage;
        reserveFundsPercentage = _reserveFundsPercentage;
        // interval = _updateIntervel;
        interval = _updateIntervel;
        lastTimeStamp = block.timestamp;
        if (availableFundsPercentage + _reserveFundsPercentage != 100) revert InvalidRatio();
        setAddress(_endToken, 1);
        setAddress(_bond, 2);
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
    //need to make the numbers uniform accross the contracts

    function setAddress(address _addr, uint256 _type) public onlyOwner {
        if (_addr == address(0)) revert ZeroAddress();

        if (_type == 1) endToken = _addr;
        else if (_type == 2) enderBond = _addr;
        else if (_type == 3) enderDepositor = _addr;
        else if (_type == 4) enderOracle = IEnderOracle(_addr);

        emit AddressUpdated(_addr, _type);
    }

    function setInterval(uint256 _interval) public onlyOwner {
        interval = _interval;
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

    function getAddress(uint256 _type) external view returns (address addr) {
        if (_type == 1) addr = endToken;
        else if (_type == 2) addr = enderBond;
        else if (_type == 3) addr = enderDepositor;
        else if (_type == 4) addr = address(enderOracle);
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

    function depositTreasury(EndRequest memory param) external onlyBond {
        unchecked {
            uint256 amountRequired = IEnderBond(enderBond).getLoopCount();
            if (amountRequired > 0) {
                withdrawFromStrategy(param.stakingToken, instadapp, amountRequired);
            }
            epochDeposit += param.tokenAmt;
            // update available info
            fundsInfo[param.stakingToken].availableFunds += ((param.tokenAmt) * availableFundsPercentage) / 100;
            fundsInfo[param.stakingToken].reserveFunds += ((param.tokenAmt) * reserveFundsPercentage) / 100;

            console.log(fundsInfo[param.stakingToken].availableFunds, "fundsInfo[param.stakingToken].availableFunds");
            console.log(fundsInfo[param.stakingToken].reserveFunds, "fundsInfo[param.stakingToken].reserveFunds");
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

    function stakeRebasingReward(address _tokenAddress) public returns (uint256 rebaseReward) {
        uint256 bondReturn = IEnderBond(enderBond).endMint();
        uint256 depositReturn = calculateDepositReturn(_tokenAddress);
        //we get the eth price in 8 decimal and  depositReturn= 18 decimal  bondReturn = 18decimal
        (uint256 ethPrice, uint256 ethDecimal) = enderOracle.getPrice(address(0));
        (uint256 priceEnd, uint256 endDecimal) = enderOracle.getPrice(address(endToken));

        depositReturn = (ethPrice * depositReturn) / 10 ** ethDecimal;

        bondReturn = (priceEnd * bondReturn) / 10 ** endDecimal;

        rebaseReward = depositReturn - bondReturn + depositReturn * nominalYield;

        rebaseReward = ((rebaseReward * 1e10) / priceEnd);
    }

    // function getStakingReward(address _asset) public returns (uint256 mintAmount) {
    //     uint256 depositReturn = totalAssetStakedInStrategy[_asset] +
    //         totalRewardsFromStrategy[_asset] +
    //         IERC20(_asset).balanceOf(address(this)) -
    //         (fundsInfo[_asset].availableFunds + fundsInfo[_asset].reserveFunds);

    //     uint256 bondReturn = IEnderBond(enderBond).endMint();
    //     uint256 nominalReturn = depositReturn * nominalYield;
    //     mintAmount = depositReturn - bondReturn + nominalReturn;
    //     IEndToken(_asset).mint(enderStaking, mintAmount);
    // }

    /**
     * @notice function to deposit available funds to strategies.
     * @param _asset address of underlying staked asset e.g: stETH
     * @param _strategy address of the strategy in which admin wish to deposit,
     * @param _depositAmt amount of stETH admin wants to deposit to the strategy.
     */

    function depositInStrategy(address _asset, address _strategy, uint256 _depositAmt) public validStrategy(strategy) {
        if (lastDepositTime == 0) {
            lastDepositTime = block.timestamp;
        } else if (lastDepositTime + 1 days > block.timestamp) {
            revert CanNotDepositToStrategyBeforeOneDay();
        }

        // function depositInStrategy(address _asset, address _strategy, uint256 _depositAmt) public {

        // stEthBalBeforeStDep = IERC20(_asset).balanceOf(address(this));
        if (_depositAmt == 0) revert ZeroAmount();
        if (_asset == address(0) || _strategy == address(0)) revert ZeroAddress();
        if (_strategy == instadapp) {
            IERC20(_asset).approve(_strategy, _depositAmt);
            IInstadappLite(instadapp).deposit(_depositAmt, address(this));
        } else if (_strategy == lybraFinance) {
            IERC20(_asset).approve(lybraFinance, _depositAmt);
            ILybraFinance(lybraFinance).depositAssetToMint(_depositAmt, 0);
        } else if (_strategy == eigenLayer) {
            deposit(EndRequest(address(this), _asset, _depositAmt));
        }
        totalAssetStakedInStrategy[_asset] += _depositAmt;
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
        console.log("block.timestamp", block.timestamp);
        if (_withdrawAmt == 0) revert ZeroAmount();
        if (_asset == address(0) || _strategy == address(0)) revert ZeroAddress();
        // uint256 balBef = totalAssetStakedInStrategy[_asset];
        if (_strategy == instadapp) {
            IERC20(_asset).approve(instadapp, _withdrawAmt);
            _returnAmount = IInstadappLite(instadapp).withdraw(_withdrawAmt, address(this), address(this));
        } else if (_strategy == lybraFinance) {
            IERC20(_asset).approve(lybraFinance, _withdrawAmt);
            _returnAmount = ILybraFinance(lybraFinance).withdraw(address(this), _withdrawAmt);
        }
        // uint256 balAfter = IERC20(_asset).balanceOf(address(this));
        if (_returnAmount > 0) {
            // console.log("balAfter - balBef",_withdrawAmt,_returnAmount);
            totalRewardsFromStrategy[_asset] += _returnAmount;
        }
    }

    /**
     * @notice Withdraw function
     * @param param Withdraw parameter
     */
    function withdraw(EndRequest memory param) external onlyBond {
        uint256 amountRequired = IEnderBond(enderBond).getLoopCount();
        if (amountRequired > 0) {
            withdrawFromStrategy(param.stakingToken, instadapp, amountRequired);
        }
        epochWithdrawl += param.tokenAmt;
        // if invalid reserve funds then withdraw from protocol
        uint256 currentFundsAmount = param.tokenAmt;

        if (fundsInfo[param.stakingToken].reserveFunds < param.tokenAmt) {
            currentFundsAmount -= fundsInfo[param.stakingToken].reserveFunds;
            fundsInfo[param.stakingToken].reserveFunds = 0;

            if (fundsInfo[param.stakingToken].availableFunds < currentFundsAmount) {
                uint256 withdrawAmount = withdrawFromStrategy(param.stakingToken, instadapp, currentFundsAmount);
                fundsInfo[param.stakingToken].availableFunds += withdrawAmount;
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

    function mintEndToUser(address _to, uint256 _amount) external onlyBond {
        ///just return for temp  should changethe
        IEndToken(endToken).mint(_to, _amount);
    }

    /**
     * @dev Calculates the total return for a given asset.
     * @param _stEthAddress The address of the asset (e.g., stETH token).
     * @return totalReturn The total return, which is the change in asset balance.
     */
    function calculateTotalReturn(address _stEthAddress) internal view returns (uint256 totalReturn) {
        totalReturn = IERC20(_stEthAddress).balanceOf(address(this)) + epochWithdrawl - epochDeposit - balanceLastEpoch;
    }

    /**
     * @dev Records the results of an epoch, including the deposit into a strategy.
     * @param _stEthAddress The address of the asset (e.g., stETH token).
     * @param _strategy The address of the strategy to deposit the total return.
     * this will be hit in order to balance the balance in the available and str
     */
    // function recordEpochResults(address _stEthAddress, address _strategy) public {
    //     uint256 totalReturn = calculateTotalReturn(_stEthAddress);
    //     uint256 totalStaked = totalAssetStakedInStrategy[_stEthAddress];
    //     uint256 requiredReserveFund = (totalStaked * reserveFundsPercentage) / 100;
    //     uint256 existingReserveFund = fundsInfo[_stEthAddress].reserveFunds;

    //     if (existingReserveFund > requiredReserveFund) {
    //         totalReturn += existingReserveFund - requiredReserveFund;
    //         depositInStrategy(_stEthAddress, _strategy, totalReturn);
    //     } else {
    //         if (totalReturn > requiredReserveFund) {
    //             uint256 remainingReturns = totalReturn - requiredReserveFund;
    //             fundsInfo[_stEthAddress].reserveFunds += requiredReserveFund;
    //             depositInStrategy(_stEthAddress, _strategy, remainingReturns);
    //         } else {
    //             requiredReserveFund -= totalReturn;
    //             uint256 requiredAmount = withdrawFromStrategy(_stEthAddress, _strategy, requiredReserveFund);
    //             fundsInfo[_stEthAddress].reserveFunds += totalReturn + requiredAmount;
    //         }
    //     }
    //     epochDeposit = 0;
    //     epochWithdrawl = 0;
    //     balanceLastEpoch = IERC20(_stEthAddress).balanceOf(address(this));
    // }

    // function recordEpochResults1(address _stEthAddress, address _strategy) public {
    //     uint256 totalReturn = calculateTotalReturn(_stEthAddress);
    //     uint256 totalStaked = totalAssetStakedInStrategy[_stEthAddress];
    //     uint256 requiredReserveFund = (totalStaked * reserveFundsPercentage) / 100;
    //     uint256 existingReserveFund = fundsInfo[_stEthAddress].reserveFunds;

    //     if (existingReserveFund < requiredReserveFund) {
    //         uint256 temp = requiredReserveFund - existingReserveFund;

    //         if (totalReturn > temp) {
    //             fundsInfo[_stEthAddress].reserveFunds += requiredReserveFund;
    //             depositInStrategy(_stEthAddress, _strategy, totalReturn - temp);
    //         } else {
    //             requiredReserveFund = totalReturn;
    //             fundsInfo[_stEthAddress].reserveFunds += totalReturn;
    //             withdrawFromStrategy(_stEthAddress, _strategy, temp - totalReturn);
    //         }
    //     } else {
    //         totalReturn += existingReserveFund - requiredReserveFund;
    //         depositInStrategy(_stEthAddress, _strategy, totalReturn);
    //     }

    //     balanceLastEpoch = IERC20(_stEthAddress).balanceOf(address(this));
    // }

    /**
     * @dev Calculates the deposit return based on the total return and available funds.
     * @param _stEthAddress The address of the asset (e.g., stETH token).
     * @return depositReturn The deposit return as a fraction of available funds.
     */

    function calculateDepositReturn(address _stEthAddress) public view returns (uint256 depositReturn) {
        uint256 totalReturn = calculateTotalReturn(_stEthAddress);
        depositReturn = totalReturn * (fundsInfo[_stEthAddress].availableFunds / balanceLastEpoch);
    }

    function checkUpkeep(
        bytes calldata 
    ) external view override returns (bool upkeepNeeded, bytes memory performData) {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
        // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
    }

    function performUpkeep(bytes calldata /* performData */) external override {
        //We highly recommend revalidating the upkeep in the performUpkeep function
        if ((block.timestamp - lastTimeStamp) > interval) {
            lastTimeStamp = block.timestamp;
            // call the epoch functions
        }
        // We don't use the performData in this example. The performData is generated by the Keeper's call to your checkUpkeep function
    }

    receive() external payable virtual override {}
}
