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

contract EnderTreasury is Initializable, OwnableUpgradeable, EnderELStrategy {
    mapping(address => bool) public strategies;
    mapping(address => uint256) public fundsInfo;
    mapping(address => uint256) public totalAssetStakedInStrategy;
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
    // address public stEthELS;
    IEnderOracle private enderOracle;

    uint256 public bondYieldBaseRate;
    uint256 public balanceLastEpoch;
    uint256 public nominalYield;
    uint256 public availableFundsPercentage;
    uint256 public reserveFundsPercentage;
    uint256 public epochDeposit;
    uint256 public epochWithdrawl;
    /* Use an interval in seconds and a timestamp to slow execution of Upkeep */

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
        address _oracle
    ) external initializer {
        if (_availableFundsPercentage != 70 && _reserveFundsPercentage != 30) revert InvalidRatio();
        __Ownable_init();
        enderStaking = _enderStaking;
        enderOracle = IEnderOracle(_oracle);
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

        else if (_type == 5) strategyToReceiptToken[instadapp] = _addr;
        else if (_type == 6) strategyToReceiptToken[lybraFinance] = _addr;
        else if (_type == 7) strategyToReceiptToken[eigenLayer] = _addr;
        


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

    function setPriorityStrategy(address _priorityStrategy) public onlyOwner {
        priorityStrategy = _priorityStrategy;
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

    function depositTreasury(EndRequest memory param, uint256 amountRequired) external onlyBond {
        unchecked {
            if (amountRequired > 0) {
                withdrawFromStrategy(param.stakingToken, priorityStrategy, amountRequired);
            }
            epochDeposit += param.tokenAmt;
            fundsInfo[param.stakingToken] += param.tokenAmt;
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
        console.log(depositReturn, "depositReturn");
        balanceLastEpoch = IERC20(_tokenAddress).balanceOf(address(this));
        if (depositReturn == 0) {
            epochWithdrawl = 0;
            epochDeposit = 0;
            rebaseReward = 0;
        } else {
            //we get the eth price in 8 decimal and  depositReturn= 18 decimal  bondReturn = 18decimal
            (uint256 ethPrice, uint256 ethDecimal) = enderOracle.getPrice(address(0));
            (uint256 priceEnd, uint256 endDecimal) = enderOracle.getPrice(address(endToken));

            depositReturn = (ethPrice * depositReturn) / 10 ** ethDecimal;

            console.log(depositReturn, "depositReturn ");

            bondReturn = (priceEnd * bondReturn) / 10 ** ethDecimal;

            console.log(bondReturn, " bond return after");

            rebaseReward = depositReturn - bondReturn + (depositReturn * nominalYield);

            rebaseReward = ((rebaseReward) / priceEnd) * 10 ** ethDecimal;

            epochWithdrawl = 0;
            epochDeposit = 0;
        }
        console.log("rebaseReward", rebaseReward);
    }

    /**
     * @notice function to deposit available funds to strategies.
     * @param _asset address of underlying staked asset e.g: stETH
     * @param _strategy address of the strategy in which admin wish to deposit,
     * @param _depositAmt amount of stETH admin wants to deposit to the strategy.
     */

    function depositInStrategy(address _asset, address _strategy, uint256 _depositAmt) public validStrategy(strategy) {
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
            //Todo will add the instance while going on mainnet.
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
    ) public validStrategy(_strategy) returns (uint256 _returnAmount) {
        console.log("block.timestamp", block.timestamp);
        if (_withdrawAmt == 0) revert ZeroAmount();
        console.log("_asset == address(0) || _strategy == address(0)",_asset , _strategy);
        if (_asset == address(0) || _strategy == address(0)) revert ZeroAddress();
        address receiptToken = strategyToReceiptToken[_strategy];
        if (_strategy == instadapp) {
            //Todo set the asset as recipt tokens and need to check the assets ratio while depolying on mainnet
            IERC20(receiptToken).approve(instadapp, _withdrawAmt);
            _returnAmount = IInstadappLite(instadapp).withdraw(_withdrawAmt, address(this), address(this));
        } else if (_strategy == lybraFinance) {
            IERC20(receiptToken).approve(lybraFinance, _withdrawAmt);
            _returnAmount = ILybraFinance(lybraFinance).withdraw(address(this), _withdrawAmt);
        }
        totalAssetStakedInStrategy[_asset] -= _withdrawAmt;
        if (_returnAmount > 0) {
            totalRewardsFromStrategy[_asset] += _returnAmount;
        }
    }

    /**
     * @notice Withdraw function
     * @param param Withdraw parameter
     */
    function withdraw(EndRequest memory param, uint256 amountRequired) external onlyBond {
        if (amountRequired > IERC20(param.stakingToken).balanceOf(address(this))) {
            withdrawFromStrategy(param.stakingToken, priorityStrategy, amountRequired);
        }
        epochWithdrawl += param.tokenAmt;
        fundsInfo[param.stakingToken] -= param.tokenAmt;

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
        // console.log(IERC20(_stEthAddress).balanceOf(address(this)), epochWithdrawl, epochDeposit, "mmmmmmmmm");
        // console.log(_stEthAddress, "balanceLastEpoch3232");

        totalReturn = IERC20(_stEthAddress).balanceOf(address(this)) + epochWithdrawl - epochDeposit - balanceLastEpoch;
        // console.log(totalReturn, "totalReturn");
    }

    /**
     * @dev Calculates the deposit return ba sed on the total return and available funds.
     * @param _stEthAddress The address of the asset (e.g., stETH token).
     * @return depositReturn The deposit return as a fraction of available funds.
     */

    function calculateDepositReturn(address _stEthAddress) public view returns (uint256 depositReturn) {
        uint256 totalReturn = calculateTotalReturn(_stEthAddress);
        if (totalReturn == 0 || balanceLastEpoch == 0) {
            depositReturn = 0;
        } else {
            console.log(
                "fundsInfo[_stEthAddress].depositFunds / balanceLastEpoch",
                fundsInfo[_stEthAddress],
                balanceLastEpoch
            );
            //here we have to multiply 100000and dividing so that the balanceLastEpoch < fundsInfo[_stEthAddress].depositFunds
            depositReturn = (totalReturn * ((fundsInfo[_stEthAddress] * 100000) / balanceLastEpoch)) / 100000;
        }
    }

    receive() external payable virtual override {}
}
