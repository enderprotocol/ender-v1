// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

// Openzeppelin
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol";
import "@chainlink/contracts/src/v0.8/automation/KeeperCompatible.sol";

// Interfaces
import "./interfaces/IBondNFT.sol";
import "./interfaces/IEnderTreasury.sol";
import "./interfaces/IEnderOracle.sol";
import "./interfaces/ISEndToken.sol";
import "./interfaces/IEndToken.sol";
import "./interfaces/IEnderStaking.sol";

import "hardhat/console.sol";

error BondAlreadyWithdrawn();
error BondNotMatured();
error BondFeeDisabled();
error NotBondUser();
error NotBondableToken();
error SignatureExpired();
error ZeroAddress();
error InvalidAmount();
error InvalidNonce();
error InvalidMaturity();
error InvalidBondFee();
error NotBondNFT();
error WaitForFirstDeposit();
error NoRewardCollected();
error NotTreasury();
error NotKeeper();
error NotAllowed();

/**
 * @title EnderBond contract
 * @dev Implements bonding functionality with multiple tokens
 */
contract EnderBond is
    Initializable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable,
    EIP712Upgradeable,
    KeeperCompatibleInterface
{
    /// @notice A mapping that indicates whether a token is bondable.
    mapping(address => bool) public bondableTokens;

    /// @notice A mapping of bonds by token ID.
    mapping(uint256 => Bond) public bonds;
    mapping(address => bool) public isWhitelisted;
    mapping(uint256 => uint256) public rewardSharePerUserIndex;
    mapping(uint256 => uint256) public rewardSharePerUserIndexSend;

    mapping(uint256 => uint256) public userBondPrincipalAmount;
    mapping(uint256 => uint256) public userBondYieldShareIndex; //s0
    mapping(uint256 => uint256) public availableFundsAtMaturity;
    mapping(uint256 => uint256) public depositPrincipalAtMaturity;

    mapping(uint256 => uint256) public dayToRewardShareIndex;

    mapping(uint256 => uint256) public dayRewardShareIndexForSend;

    mapping(uint256 => uint256) public dayBondYieldShareIndex;

    // mapping(uint256 => uint256[]) public dayToBondYieldShareUpdation;
    mapping(uint256 => uint256) public secondsBondYieldShareIndex;
    ////
    mapping(uint256 => uint256[]) public dayToRefractionShareUpdation;
    mapping(uint256 => uint256) public secondsRefractionShareIndex;

    mapping(uint256 => uint256[]) public dayToRefractionShareUpdationSend;
    mapping(uint256 => uint256) public secondsRefractionShareIndexSend;

    uint256 public rewardShareIndex;
    uint256 public rewardShareIndexSend;
    uint256 public totalRewardPrincipal;
    uint256 public rateOfChange;
    uint256 public totalDeposit;
    uint256 public bondYieldShareIndex;
    uint256 public totalBondPrincipalAmount;
    uint256 public endMint;
    uint256 public bondYieldBaseRate;
    uint256 public txFees;
    uint256 public minDepositAmount;
    uint256 public SECONDS_IN_DAY;
    uint256 public lastDay;
    uint256 private amountRequired;
    uint256 private depositAmountRequired;
    uint256 private withdrawAmntFromSt;
    uint public interval;
    uint public lastTimeStamp;
    uint public lastSecOfRefraction;
    uint public lastSecOfSendReward;

    bool public isSet;

    /// @notice An array containing all maturities.
    uint256[] public maturities;

    address private endSignature;
    address private endToken;
    address private sEndToken;
    address public lido;
    address public stEth;
    address public keeper;
    // address public endStaking;

    IBondNFT private bondNFT;
    IEnderTreasury private endTreasury;
    IEnderOracle private enderOracle;
    IEnderStaking private endStaking;

    bool public bondFeeEnabled; // status of bond-fee feature (enabled/disabled)

    struct Bond {
        bool withdrawn; // The withdrawn status of the bond
        uint256 principal; // The principal amount of the bond
        // uint256 endAmt; // The END token amount of deposit
        uint256 startTime; // Timestamp of the bond
        uint256 maturity; // The maturity date of the bond
        address token; // The token used for the bond
        uint256 bondFee; // bond fee self-set
        uint256 depositPrincipal;
        uint256 rewardPrincipal;
        uint256 refractionSIndex;
        uint256 stakingSendIndex;
        uint256 YieldIndex;
    }

event IntervalSet(uint256 indexed newInterval);
event BoolSet(bool indexed newValue);
event AddressSet(uint256 indexed addrType, address indexed newAddress);
event MinDepAmountSet(uint256 indexed newAmount);
event TxFeesSet(uint256 indexed newTxFees);
event BondYieldBaseRateSet(uint256 indexed newBondYieldBaseRate);
event BondFeeEnabledSet(bool indexed isEnabled);
event BondableTokensSet(address indexed token, bool indexed isEnabled);
event Deposit(address indexed sender, uint256 indexed tokenId, uint256 principal, uint256 maturity, address token);
event Withdrawal(address indexed sender, uint256 indexed tokenId);
event RefractionRewardsClaimed(address indexed sender, uint256 indexed tokenId, uint256 rewardAmount);
event StakingRewardsClaimed(address indexed sender, uint256 indexed tokenId, uint256 rewardAmount);
event RewardShareIndexUpdated(uint256 indexed newRewardShareIndex);
event BondYieldShareIndexUpdated(uint256 indexed newBondYieldShareIndex);
event EndMintReset();
event WhitelistChanged(address indexed whitelistingAddress, bool indexed action);
event RewardSharePerUserIndexSet(uint256 indexed tokenId, uint256 indexed newRewardSharePerUserIndex);
    

    /**
     * @dev Initializes the contract
     * @param endToken_ The address of the END token
     */
    function initialize(address endToken_, address _lido, address _oracle) public initializer {
        __Ownable_init();
        __EIP712_init("EnderBond", "1");
        rateOfChange = 100;
        lido = _lido;
        setAddress(endToken_, 2);
        // todo set the value according to doc
        minDepositAmount = 1000000000000000;
        txFees = 200;
        enderOracle = IEnderOracle(_oracle);
        bondYieldBaseRate = 100;
        SECONDS_IN_DAY = 600; // note for testing purpose we have set it to 10 mint
        interval = 10 * 60; // note for testing purpose we have set it to 10 mint
        lastTimeStamp = block.timestamp;
        lastDay = block.timestamp / SECONDS_IN_DAY;
        lastSecOfRefraction = block.timestamp;
        lastSecOfSendReward = block.timestamp;

        //this function is not used
        setBondFeeEnabled(true);
    }

    function setInterval(uint256 _interval) public onlyOwner {
        interval = _interval;
        emit IntervalSet(_interval);
    }

    function setBool(bool _bool) public onlyOwner {
        isSet = _bool;
        emit BoolSet(_bool);
    }

    /**
     * @notice Update the address
     * @param _addr  The address
     * @param _type  Type of updating address
     */
    function setAddress(address _addr, uint256 _type) public onlyOwner {
        if (_addr == address(0)) revert ZeroAddress();

        if (_type == 1) endTreasury = IEnderTreasury(_addr);
        else if (_type == 2) endToken = _addr;
        else if (_type == 3) bondNFT = IBondNFT(_addr);
        else if (_type == 4) endSignature = _addr;
        else if (_type == 5) lido = _addr;
        else if (_type == 6) stEth = _addr;
        else if (_type == 7) keeper = _addr;
        else if (_type == 8) endStaking = IEnderStaking(_addr);
        else if (_type == 9) sEndToken = _addr;

        emit AddressSet(_type, _addr);
    }

    function setMinDepAmount(uint256 _amt) public onlyOwner {
        minDepositAmount = _amt;
        emit MinDepAmountSet(_amt);
    }

    function setTxFees(uint256 _txFees) public onlyOwner {
        txFees = _txFees;
        emit TxFeesSet(_txFees);
    }

    function setBondYieldBaseRate(uint256 _bondYieldBaseRate) public onlyOwner {
        bondYieldBaseRate = _bondYieldBaseRate;
        emit BondYieldBaseRateSet(_bondYieldBaseRate);
    }

    function getAddress(uint256 _type) external view returns (address addr) {
        if (_type == 1) addr = address(endTreasury);
        else if (_type == 2) addr = endToken;
        else if (_type == 3) addr = address(bondNFT);
        else if (_type == 4) addr = endSignature;
        else if (_type == 5) addr = lido;
    }

    /**
     * @notice Update the bond-fee status
     * @param _enabled status
     */
    function setBondFeeEnabled(bool _enabled) public onlyOwner {
        bondFeeEnabled = _enabled;
        emit BondFeeEnabledSet(_enabled);
    }

    /**
     * @notice Updates the bondable status for a list of tokens.
     * @dev Sets the bondable status of a list of tokens. Only callable by the contract owner.
     * @param tokens The addresses of the tokens to be updated.
     * @param enabled Boolean value representing whether each token is bondable.
     */
    function setBondableTokens(address[] calldata tokens, bool enabled) external onlyOwner {
        uint256 length = tokens.length;
        for (uint256 i; i < length; ++i) {
            bondableTokens[tokens[i]] = enabled;
        emit BondableTokensSet(tokens[i], enabled);
        }
    }

    function getInterest(uint256 maturity) public view returns (uint256 rate) {
        uint256 maturityModifier;
        //Todo make it dynamic in phase 2
        unchecked {
            if (maturity >= 360) maturityModifier = 150;
            if (maturity >= 320 && maturity < 360) maturityModifier = 140;
            if (maturity >= 280 && maturity < 320) maturityModifier = 130;
            if (maturity >= 260 && maturity < 280) maturityModifier = 125;
            if (maturity >= 220 && maturity < 260) maturityModifier = 120;
            if (maturity >= 180 && maturity < 220) maturityModifier = 115;
            if (maturity >= 150 && maturity < 180) maturityModifier = 110;
            if (maturity >= 120 && maturity < 150) maturityModifier = 105;
            if (maturity >= 90 && maturity < 120) maturityModifier = 100;
            if (maturity >= 60 && maturity < 90) maturityModifier = 90;
            if (maturity >= 30 && maturity < 60) maturityModifier = 85;
            if (maturity >= 15 && maturity < 30) maturityModifier = 80;
            if (maturity >= 7 && maturity < 15) maturityModifier = 70;
            console.log("bondYieldBaseRate * maturityModifier", bondYieldBaseRate, maturityModifier);
            rate = bondYieldBaseRate * maturityModifier;
        }
    }

    function whitelist(address _whitelistingAddress, bool _action) external onlyOwner{
        isWhitelisted[_whitelistingAddress] = _action;
        emit WhitelistChanged(_whitelistingAddress, _action);
    }

    /**
     * @notice Allows a user to deposit a specified token into a bond
     * @param principal The principal amount of the bond
     * @param maturity The maturity date of the bond (lock time)
     * @param bondFee Self-set bond fee
     * @param token The address of the token (if token is zero address, then depositing ETH)
     */
    function deposit(
        uint256 principal,
        uint256 maturity,
        uint256 bondFee,
        address token
    ) external payable nonReentrant returns (uint256 tokenId) {
        console.log("\nDeposited Amount:- ", principal);
        console.log("Maturity:- ", maturity);
        console.log("Bond Fees:- ", bondFee);
        if (principal < minDepositAmount) revert InvalidAmount();
        if (maturity < 7 || maturity > 365) revert InvalidMaturity();
        if (token != address(0) && !bondableTokens[token]) revert NotBondableToken();
        if (bondFee <= 0 || bondFee > 10000) revert InvalidBondFee();
        IEndToken(endToken).distributeRefractionFees();

        // token transfer
        if (token == address(0)) {
            if (msg.value != principal) revert InvalidAmount();
            (bool suc, ) = payable(lido).call{value: msg.value}(abi.encodeWithSignature("submit()"));
            require(suc, "lido eth deposit failed");
            IERC20(stEth).transfer(address(endTreasury), IERC20(stEth).balanceOf(address(this)));
        } else {
            // send directly to the ender treasury
            IERC20(token).transferFrom(msg.sender, address(endTreasury), principal);
        }
        tokenId = _deposit(principal, maturity, token, bondFee);
        epochBondYieldShareIndex();
        // IEnderStaking(endStaking).epochStakingReward(stEth);
        emit Deposit(msg.sender, tokenId, principal, maturity, token);
    }

    function _deposit(
        uint256 principal,
        uint256 maturity,
        address token,
        uint256 bondFee
    ) private returns (uint256 tokenId) {
        endTreasury.depositTreasury(IEnderBase.EndRequest(msg.sender, token, principal), getLoopCount());
        principal = (principal * (10000 - bondFee)) / 10000;
        // uint256 timeNow = block.timestamp / SECONDS_IN_DAY;
        // dayToBondYieldShareUpdation[timeNow].push(block.timestamp + (maturity * SECONDS_IN_DAY));

        // mint bond nft
        tokenId = bondNFT.mint(msg.sender);
        console.log("Token Id of user:- ", tokenId,"\n");
        availableFundsAtMaturity[(block.timestamp + ((maturity - 4) * SECONDS_IN_DAY)) / SECONDS_IN_DAY] += principal;
        (, uint256 rewardPrinciple) = calculateRefractionData(principal, maturity, tokenId, bondFee);

        rewardSharePerUserIndex[tokenId] = rewardShareIndex;
         rewardSharePerUserIndexSend[tokenId] = rewardShareIndexSend;
        userBondYieldShareIndex[tokenId] = bondYieldShareIndex;

        console.log("Yield Multiplier", 10000 + (bondFee));
        uint256 depositPrincipal = (getInterest(maturity) * (10000 + (bondFee)) * principal) / (365 * 100000000);
        console.log("depositPrincipal For bond rewards per day",depositPrincipal);
        depositPrincipalAtMaturity[(block.timestamp + ((maturity) * SECONDS_IN_DAY)) / SECONDS_IN_DAY] += depositPrincipal;

        totalDeposit += principal;
        totalRewardPrincipal += depositPrincipal;
        userBondPrincipalAmount[tokenId] = depositPrincipal;
        totalBondPrincipalAmount += depositPrincipal;

        // save bond info
        bonds[tokenId] = Bond(
            false,
            principal,
            block.timestamp,
            maturity,
            token,
            bondFee,
            depositPrincipal,
            rewardPrinciple,
            0,
            0,
            0
        );
    }

    /**
     * @notice Allows a bond holder to withdraw their funds once the bond has matured.
     * @dev Checks if a bond exists for the sender,
     *     If it has not already been withdrawn, and if it has matured.
     *     If all checks pass, the bond is marked as withdrawn and the principal
     *       plus interest is transferred to the sender.
     * @param tokenId The ID of the token to be withdrawn.
     */
    function withdraw(uint256 tokenId) external nonReentrant {
        _withdraw(tokenId);
        emit Withdrawal(msg.sender, tokenId);
    }

    /**
     * @notice Private function for withdraw and withdraw request
     * @param _tokenId Bond nft tokenid

     */
    function _withdraw(uint256 _tokenId) private {
        epochRewardShareIndexByPass();
        epochRewardShareIndexSendByPass();
        Bond storage bond = bonds[_tokenId];
        if (bond.withdrawn) revert BondAlreadyWithdrawn();
        if (bondNFT.ownerOf(_tokenId) != msg.sender) revert NotBondUser();
        if (block.timestamp <= bond.startTime + (bond.maturity * SECONDS_IN_DAY)) revert BondNotMatured();
        // require(block.timestamp >= bond.startTime + (bond.maturity * SECONDS_IN_DAY), "Bond is not matured");
        IEndToken(endToken).distributeRefractionFees();
        console.log("User withdraw is amount from bond contract:- ", userBondPrincipalAmount[_tokenId]);
        // update current bond 
        bond.withdrawn = true;
        endTreasury.withdraw(IEnderBase.EndRequest(msg.sender, bond.token, bond.principal), getLoopCount());
        uint256 reward = calculateBondRewardAmount(_tokenId, bond.YieldIndex);
        console.log("Bond reward:- ", reward);
        dayBondYieldShareIndex[bonds[_tokenId].maturity] = userBondYieldShareIndex[_tokenId]; 

        endTreasury.mintEndToUser(msg.sender, reward);
        if(rewardShareIndex != rewardSharePerUserIndex[_tokenId]) claimRefractionRewards(_tokenId, bond.refractionSIndex);
        if(rewardShareIndexSend != rewardSharePerUserIndexSend[_tokenId]) claimStakingReward(_tokenId, bond.stakingSendIndex);
        totalBondPrincipalAmount -= userBondPrincipalAmount[_tokenId];

        userBondPrincipalAmount[_tokenId] == 0;
        delete userBondYieldShareIndex[_tokenId];

        totalRewardPrincipal -= bond.depositPrincipal;
        depositAmountRequired -= bond.depositPrincipal;                            
        totalDeposit -= bond.principal;
        amountRequired -= bond.principal; 
    }

    function getLoopCount() public returns (uint256) {
        // if (msg.sender != address(endTreasury)) revert NotTreasury();
        uint256 currentDay = block.timestamp / SECONDS_IN_DAY;
        if (currentDay == lastDay) return withdrawAmntFromSt = 0;
        else{
            for (uint256 i = lastDay + 1; i <= currentDay; i++) {
                if(availableFundsAtMaturity[i] != 0) amountRequired += availableFundsAtMaturity[i];
                if(depositPrincipalAtMaturity[i] != 0){
                    depositAmountRequired += depositPrincipalAtMaturity[i];
                } 
                console.log("amountRequired-------For---------->>>>>>>>>", amountRequired);
            }
            lastDay = currentDay;
            uint256 balanceInTreasury = ISEndToken(stEth).balanceOf(address(endTreasury));
            console.log("balanceInTreasury---------->>>>>>>>>>>", balanceInTreasury);
            console.log("amountRequired------------->>>>>>>>>>>", amountRequired);
            if (amountRequired <= balanceInTreasury){ 
                withdrawAmntFromSt = 0;
            }
            else{
                withdrawAmntFromSt = amountRequired - balanceInTreasury;
            }
            return withdrawAmntFromSt;
            console.log("withdrawAmntFromSt---------->>>>>>>>>>", withdrawAmntFromSt);
        }
    }

    function deductFeesFromTransfer(uint256 _tokenId) public {
        if (msg.sender != address(bondNFT)) {
            revert NotBondNFT();
        }
        if (userBondPrincipalAmount[_tokenId] == 0) {
            revert NotBondUser();
        }
        console.log("\nNft trading fees:- ", txFees);
        uint deductAmount = (bonds[_tokenId].principal * txFees) / 1000000;
        console.log("Amount deduct from Nft Trading:- ", deductAmount);
        bonds[_tokenId].principal -= deductAmount;
        console.log("Ater deduct Nft Trading User Principal Amount:- ", bonds[_tokenId].principal);
        userBondPrincipalAmount[_tokenId] -= (userBondPrincipalAmount[_tokenId] * txFees) / 1000000;
        // console.log(availableFundsAtMaturity[(block.timestamp + ((bonds[_tokenId].maturity - 4) * SECONDS_IN_DAY)) / SECONDS_IN_DAY], "availableFundsAtMaturity[bonds[_tokenId].maturity]");
        availableFundsAtMaturity[(block.timestamp + ((bonds[_tokenId].maturity - 4) * SECONDS_IN_DAY)) / SECONDS_IN_DAY] -= deductAmount;
    }

    /**
     * @dev Sets the reward share for a given `_reward` .
     * @param _reward The reward to be added to the reward share.
     */
    function epochRewardShareIndex(uint256 _reward) external {
        // if (msg.sender != keeper) revert NotKeeper();
        // if (totalRewardPrincipal == 0) revert WaitForFirstDeposit();

        if (totalDeposit != 0) {
            IERC20(endToken).transferFrom(endToken, address(this), _reward);
            uint256 timeNow = block.timestamp / SECONDS_IN_DAY;
            
            rewardShareIndex =
                (rewardShareIndex) +
                ((_reward * 10 ** 18) / (totalDeposit - amountRequired));
            if( lastSecOfRefraction / SECONDS_IN_DAY == timeNow ){
                if(dayToRefractionShareUpdation[timeNow].length == 0) dayToRefractionShareUpdation[timeNow].push(lastSecOfRefraction);
                dayToRefractionShareUpdation[timeNow].push(block.timestamp);
            }else{
                uint day = lastSecOfRefraction / SECONDS_IN_DAY;
                for(uint i = day+1; i <= timeNow; i++){
                    dayToRefractionShareUpdation[i].push(lastSecOfRefraction);
                }
            }
            lastSecOfRefraction = block.timestamp;
            console.log("Reward Share Index for Refraction:- ", rewardShareIndex);
            // dayToRefractionShareUpdation[timeNow].push(block.timestamp);
            dayToRewardShareIndex[block.timestamp] = rewardShareIndex;
        }
        emit RewardShareIndexUpdated(rewardShareIndex);
    }

    function epochRewardShareIndexByPass() internal{

        uint256 timeNow = block.timestamp / SECONDS_IN_DAY;
        if( lastSecOfRefraction / SECONDS_IN_DAY == timeNow && dayToRefractionShareUpdation[timeNow].length == 0){
                dayToRefractionShareUpdation[timeNow].push(lastSecOfRefraction);
            }else{
                uint day = lastSecOfRefraction / SECONDS_IN_DAY;
                for(uint i = day+1; i <= timeNow; i++){
                    dayToRefractionShareUpdation[i].push(lastSecOfRefraction);
                }
            }
            lastSecOfRefraction = block.timestamp;
            console.log("Reward Share Index for Refraction:- ", rewardShareIndex);
            // dayToRefractionShareUpdation[timeNow].push(block.timestamp);
    }

    /**
     * @dev Sets the reward share for sending, based on `_reward` and `_totalPrinciple`.
     * @param _reward The reward to be added to the reward share.
     */

    function epochRewardShareIndexForSend(uint256 _reward) public {
        // if (msg.sender != keeper) revert NotKeeper();
        if (totalDeposit != 0) {
            uint256 timeNow = block.timestamp / SECONDS_IN_DAY;
           rewardShareIndexSend =
            rewardShareIndexSend +
            ((_reward * 10 ** 18) / totalDeposit - amountRequired);
            if( lastSecOfSendReward / SECONDS_IN_DAY == timeNow ){
                if(dayToRefractionShareUpdationSend[timeNow].length == 0) dayToRefractionShareUpdationSend[timeNow].push(lastSecOfSendReward);
                dayToRefractionShareUpdationSend[timeNow].push(block.timestamp);
            }else{
                uint day = lastSecOfSendReward / SECONDS_IN_DAY;
                for(uint i = day+1; i <= timeNow; i++){
                    dayToRefractionShareUpdationSend[i].push(lastSecOfSendReward);
                }
            }
            lastSecOfSendReward = block.timestamp;
            console.log("Reward Share Index for Refraction:- ", rewardShareIndexSend);
            // dayToRefractionShareUpdation[timeNow].push(block.timestamp);
            console.log("timeNow----->",timeNow);
            dayRewardShareIndexForSend[timeNow] = rewardShareIndexSend;
            secondsRefractionShareIndexSend[block.timestamp] = rewardShareIndexSend;
        }
        // uint256 timeNow = block.timestamp / SECONDS_IN_DAY;
        
        // console.log("Reward share index for sEnd:- ", rewardShareIndexSend);
        // console.log("dayToRefractionShareUpdationSend[timeNow]====>", timeNow);
        // dayToRefractionShareUpdationSend[timeNow].push(block.timestamp);
    }

    function epochRewardShareIndexSendByPass() internal{
         uint256 timeNow = block.timestamp / SECONDS_IN_DAY;
        if( lastSecOfSendReward / SECONDS_IN_DAY == timeNow && dayToRefractionShareUpdationSend[timeNow].length == 0){
                dayToRefractionShareUpdationSend[timeNow].push(lastSecOfSendReward);
            }else{
                uint day = lastSecOfSendReward / SECONDS_IN_DAY;
                for(uint i = day+1; i <= timeNow; i++){
                    console.log("-----------------refraction-------------------------------------------");
                    dayToRefractionShareUpdationSend[i].push(lastSecOfSendReward);
                }
            }
            lastSecOfSendReward = block.timestamp;
            // console.log("Reward Share Index for Refraction:- ", rewardShareIndex);
            // dayToRefractionShareUpdation[timeNow].push(block.timestamp);
    }


    function findClosestS(uint256[] memory arr, uint256 _totalMaturity) internal pure returns (uint256 _s) {
        uint256 low = 0;
        console.log("arr",arr.length);
        uint256 high = arr.length - 1;
        uint256 mid;

        while (low <= high) {
            mid = (low + high) / 2;

            if (arr[mid] == _totalMaturity || (arr[mid + 1] > _totalMaturity && arr[mid] < _totalMaturity)) {
                return arr[mid];
            } else if((arr[mid - 1] < _totalMaturity && arr[mid] > _totalMaturity)){
                return arr[mid - 1];
            } 
            else if (arr[mid] < _totalMaturity) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        if (arr[low] > _totalMaturity) {
            return arr[low];
        } else if (arr[high] < _totalMaturity) {
            return arr[high];
        } else {
            return 0;
        }
    }

    /**
     * @dev Gets and sets the ETH price and updates the bond yield share.
     */ 
    function epochBondYieldShareIndex() public {
        // if (msg.sender != keeper) revert NotKeeper();

        (uint256 priceEth, uint256 ethDecimal) = enderOracle.getPrice(address(0));
        (uint256 priceEnd, uint256 endDecimal) = enderOracle.getPrice(address(endToken));
        uint256 timeNow = block.timestamp / SECONDS_IN_DAY;
        uint256 finalRewardPrincipal = (totalBondPrincipalAmount - depositAmountRequired);
        console.log("finalRewardPrincipal = (totalBondPrincipalAmount - depositAmountRequired)",finalRewardPrincipal ,totalBondPrincipalAmount , depositAmountRequired);
        uint256 _endMint = (priceEth * finalRewardPrincipal)/priceEnd;
        endMint += _endMint;
        console.log("BondMinted", _endMint);
        bondYieldShareIndex = bondYieldShareIndex + ((_endMint) / finalRewardPrincipal);
        dayBondYieldShareIndex[timeNow] = bondYieldShareIndex;
        secondsBondYieldShareIndex[timeNow] = bondYieldShareIndex;
        emit BondYieldShareIndexUpdated(bondYieldShareIndex);
    }

    /**
     * @dev Calculates pending rewards and related information for a bond.
     * @param _principle The principle amount of the bond.
     * @param _maturity The maturity of the bond.
     * @param _tokenId The unique identifier of the bond.
     * @return avgRefractionIndex The average refraction index for the bond.
     * @return rewardPrinciple The principle amount used in reward calculations.
     */
    function calculateRefractionData(
        uint256 _principle,
        uint256 _maturity,
        uint256 _tokenId,
        uint256 _bondfee
    ) internal returns (uint256 avgRefractionIndex, uint256 rewardPrinciple) {
        if (bondNFT.ownerOf(_tokenId) != msg.sender) revert NotBondUser();
        avgRefractionIndex = 100 + ((rateOfChange * _bondfee * (_maturity - 1)) / (2 * 1000000));
        console.log("avgRefractionIndex---->",avgRefractionIndex);
        rewardPrinciple = (_principle * avgRefractionIndex) / 100;
        console.log("rewardPrinciple---->",rewardPrinciple);
        secondsRefractionShareIndex[block.timestamp] = rewardShareIndex;

        // pendingReward = rewardPrinciple * (rewardShareIndex - rewardSharePerUserIndex[_tokenId]);
    }

    /**
     * @dev Calculates pending rewards for staking and related information for a bond.
     * @param _principle The principle amount of the bond.
     * @param _maturity The maturity of the bond.
     * @param _tokenId The unique identifier of the bond.
     * @return avgRefractionIndex The average refraction index for the bond.
     * @return rewardPrincipleSend The principle amount used in reward calculations for staking.
     */
    function calculateStakingPendingReward(
        uint _principle,
        uint256 _maturity,
        uint256 _tokenId
    ) internal view returns (uint256 avgRefractionIndex, uint256 rewardPrincipleSend) {
        if (bondNFT.ownerOf(_tokenId) != msg.sender) revert NotBondUser();
        avgRefractionIndex = 100 + ((rateOfChange * (_maturity - 1)) / (2 * 100));
        rewardPrincipleSend = _principle * avgRefractionIndex;
    }

    /**
     * @dev Claims rewards for staking based on a given `_tokenId`.
     * @param _tokenId The unique identifier of the bond.
     */

    function claimStakingReward(uint256 _tokenId, uint256 precalUsers) internal {
        Bond memory temp = bonds[_tokenId];
        if (precalUsers != 0) {
            // (, uint rewardPrinciple) = calculateStakingPendingReward(temp.principal, temp.maturity, _tokenId);
            uint rewardPrinciple = temp.principal;
            uint sEndTokenReward = ((rewardPrinciple * (precalUsers - rewardSharePerUserIndexSend[_tokenId])) / 1e18);
            if (sEndTokenReward > 0) {
                ISEndToken(sEndToken).transfer(msg.sender, sEndTokenReward);
                console.log("Bond holder sEnd Amount:- ", sEndTokenReward);
            }
        } else {
            if (bondNFT.ownerOf(_tokenId) != msg.sender) revert NotBondUser();
            if (isSet) {
                uint rewardPrinciple = temp.principal;
                // (, uint rewardPrinciple) = calculateStakingPendingReward(temp.principal, temp.maturity, _tokenId);

                if (dayRewardShareIndexForSend[(block.timestamp / SECONDS_IN_DAY)] != 0 && block.timestamp / SECONDS_IN_DAY == bonds[_tokenId].maturity + (bonds[_tokenId].startTime/SECONDS_IN_DAY)) {
                    uint sEndTokenReward = ((rewardPrinciple *
                        (rewardShareIndexSend - rewardSharePerUserIndexSend[_tokenId])) / 1e18);

                    if (sEndTokenReward > 0) {
                        ISEndToken(sEndToken).transfer(msg.sender, sEndTokenReward);
                        console.log("Bond holder sEnd Amount:- ", sEndTokenReward);
                    }
                } else {
                    uint256 sTime;
                    if(dayToRefractionShareUpdationSend[bonds[_tokenId].maturity + (bonds[_tokenId].startTime/SECONDS_IN_DAY)].length == 1){
                        sTime = dayToRefractionShareUpdationSend[bonds[_tokenId].maturity + (bonds[_tokenId].startTime/SECONDS_IN_DAY)][0];
                    }else{
                        sTime = findClosestS(
                        dayToRefractionShareUpdationSend[bonds[_tokenId].maturity],
                        ((bonds[_tokenId].maturity * SECONDS_IN_DAY) + bonds[_tokenId].startTime)
                    );

                    }
                    uint256 userS = secondsRefractionShareIndexSend[sTime];
                    uint sEndTokenReward = ((rewardPrinciple * (userS - rewardSharePerUserIndexSend[_tokenId])) / 1e18);

                    if (sEndTokenReward > 0) {
                        ISEndToken(sEndToken).transfer(msg.sender, sEndTokenReward);
                        console.log("Bond holder sEnd Amount:- ", sEndTokenReward);
                    }
                }
                rewardSharePerUserIndexSend[_tokenId] = rewardShareIndexSend;
            } else {
                revert NotAllowed();
            }
        }
    }

    /**
     * @dev Claims rewards for a bond based on a given `_tokenId`.
     * @param _tokenId The unique identifier of the bond.
     */

    function claimRefractionRewards(uint256 _tokenId, uint256 precalUsers) internal {
        Bond memory temp = bonds[_tokenId];
        if (precalUsers != 0) {
            uint rewardPrinciple = temp.principal;
            // (, uint rewardPrinciple) = calculateRefractionData(temp.principal, temp.maturity, _tokenId);
            IERC20(endToken).transfer(
                msg.sender,
                ((rewardPrinciple * (precalUsers - rewardSharePerUserIndex[_tokenId])) / 1e18)
            );
            console.log("Refraction reward:- ", ((rewardPrinciple * (precalUsers - rewardSharePerUserIndex[_tokenId])) / 1e18));
        } else {
            if (isSet) {
                if (bondNFT.ownerOf(_tokenId) != msg.sender) revert NotBondUser();
                if (userBondPrincipalAmount[_tokenId] == 0) revert NotBondUser();
                if (rewardShareIndex == rewardSharePerUserIndex[_tokenId]) revert NoRewardCollected();
                uint rewardPrinciple = temp.principal;
                // (, uint rewardPrinciple) = calculateRefractionData(temp.principal, temp.maturity, _tokenId);
                console.log(block.timestamp / SECONDS_IN_DAY, bonds[_tokenId].maturity , bonds[_tokenId].startTime/SECONDS_IN_DAY,"bonds[_tokenId].maturity======>");
                if (dayToRewardShareIndex[(block.timestamp / SECONDS_IN_DAY)] != 0 && block.timestamp / SECONDS_IN_DAY == bonds[_tokenId].maturity + (bonds[_tokenId].startTime/SECONDS_IN_DAY)){ 
                    IERC20(endToken).transfer(
                        msg.sender,
                        ((rewardPrinciple * (rewardShareIndex - rewardSharePerUserIndex[_tokenId])) / 1e18)
                    );
                    console.log("Refraction reward2:- ", rewardPrinciple * (rewardShareIndex - rewardSharePerUserIndex[_tokenId]) / 1e18);
                } else {
                    console.log(bonds[_tokenId].maturity + (bonds[_tokenId].startTime/SECONDS_IN_DAY), "bonds[_tokenId].maturity + (bonds[_tokenId].startTime/SECONDS_IN_DAY)====>");
                    uint256 sTime;
                    if(dayToRefractionShareUpdation[bonds[_tokenId].maturity + (bonds[_tokenId].startTime/SECONDS_IN_DAY)].length == 1){
                        sTime = dayToRefractionShareUpdation[bonds[_tokenId].maturity + (bonds[_tokenId].startTime/SECONDS_IN_DAY)][0];
                    }else{
                        sTime = findClosestS(
                            dayToRefractionShareUpdation[bonds[_tokenId].maturity + (bonds[_tokenId].startTime/SECONDS_IN_DAY)],
                            ((bonds[_tokenId].maturity * SECONDS_IN_DAY) + bonds[_tokenId].startTime)
                        );
                    }
                    uint256 userS = secondsRefractionShareIndex[sTime];
                    IERC20(endToken).transfer(
                        msg.sender,
                        ((rewardPrinciple * (userS - rewardSharePerUserIndex[_tokenId])) / 1e18)
                    );
                    console.log("Refraction reward1:- ", ((rewardPrinciple * (userS - rewardSharePerUserIndex[_tokenId])) / 1e18));
                }

                rewardSharePerUserIndex[_tokenId] = rewardShareIndex;
            } else {
                revert NotAllowed();
            }
        }
    }

    /**
     * @dev Calculates the reward amount for a given `_tokenId`.
     * @param _tokenId The unique identifier of the bond.
     * @return _reward The reward amount for the bond.
     */
    function calculateBondRewardAmount(uint256 _tokenId, uint256 precalUsers) internal view returns (uint256 _reward) {
        if (precalUsers != 0) {
            _reward = (userBondPrincipalAmount[_tokenId] * (precalUsers - userBondYieldShareIndex[_tokenId]));
        } else {
            if (isSet) {
                if (dayBondYieldShareIndex[bonds[_tokenId].maturity] == 0) {
                    _reward = (userBondPrincipalAmount[_tokenId] *
                        (bondYieldShareIndex - userBondYieldShareIndex[_tokenId]));
                } else {
                    uint256 userS = secondsBondYieldShareIndex[((bonds[_tokenId].maturity * SECONDS_IN_DAY) + bonds[_tokenId].startTime)] == 0 ?
                        secondsBondYieldShareIndex[((bonds[_tokenId].maturity * SECONDS_IN_DAY) + bonds[_tokenId].startTime) - 1] :
                        secondsBondYieldShareIndex[((bonds[_tokenId].maturity * SECONDS_IN_DAY) + bonds[_tokenId].startTime)];
                        _reward = (userBondPrincipalAmount[_tokenId] * (userS - userBondYieldShareIndex[_tokenId]));
                }
            } else {
                revert NotAllowed();
            }
        }
    }

    function checkUpkeep(bytes calldata) external view override returns (bool upkeepNeeded, bytes memory performData) {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
        // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
    }

    function performUpkeep(bytes calldata /* performData */) external override {
        //We highly recommend revalidating the upkeep in the performUpkeep function
        if ((block.timestamp - lastTimeStamp) > interval) {
            lastTimeStamp = block.timestamp;
            epochBondYieldShareIndex();
            endStaking.epochStakingReward(stEth);
        }
        // We don't use the performData in this example. The performData is generated by the Keeper's call to your checkUpkeep function
    }

    function setIndexesOfUser(uint256 tokenId,uint256 refractionSIndex,uint256 stakingSendIndex,uint256 YieldIndex) external onlyOwner{
        bonds[tokenId].refractionSIndex = refractionSIndex;
        bonds[tokenId].stakingSendIndex = stakingSendIndex;
        bonds[tokenId].YieldIndex = YieldIndex;
        emit RewardSharePerUserIndexSet(tokenId, rewardShareIndex);
    }

    function resetEndMint() external{
        require(msg.sender == address(endTreasury));
        endMint = 0;
    }

    receive() external payable {}
}
