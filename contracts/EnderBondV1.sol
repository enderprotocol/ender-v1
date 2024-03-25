// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

// Openzeppelin
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol";
import "@chainlink/contracts/src/v0.8/automation/KeeperCompatible.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "hardhat/console.sol";

// Interfaces
import "./interfaces/IBondNFT.sol";
import "./interfaces/IEnderBondLiquidityDeposit.sol";
import "./interfaces/IEnderTreasury.sol";
import "./interfaces/ISEndToken.sol";
import "./interfaces/IEndToken.sol";
import "./interfaces/IEnderStaking.sol";
import "./interfaces/IEnderStakeEth.sol";

error BondAlreadyWithdrawn();
error NotWhitelisted();
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
error NotEnderStaking();
error NotEndToken();
error NoTreasury();
error ZeroValue();
error InvalidAddress();
error NotBondNFTOwner();
error InsufficientEndETH();

/**
 * @title EnderBondV1 contract
 * @dev Implements bonding functionality with multiple tokens
 */
contract EnderBondV1 is
    Initializable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable,
    EIP712Upgradeable,
    KeeperCompatibleInterface
{
    using SafeERC20 for IERC20;
    using SafeERC20 for ISEndToken;
    string private constant SIGNING_DOMAIN = "bondContract";
    string private constant SIGNATURE_VERSION = "1";

    /* ======== STATE VARIABLES ======== */

    /// @notice A mapping that indicates whether a token is bondable.
    mapping(address => bool) public bondableTokens;

    /// @notice A mapping of bonds by token ID.
    mapping(uint256 => Bond) public bonds;
    mapping(uint256 => uint256) public rewardSharePerUserIndex;
    mapping(uint256 => uint256) public rewardSharePerUserIndexSend;

    mapping(uint256 => uint256) public userBondYieldShareIndex; //s0
    mapping(uint256 => uint256[]) public bondIdAtMaturity;

    mapping(uint256 => uint256) public bondIdAtMaturityDepositPrincipal;
    mapping(uint256 => uint256) public bondIdAtMaturityRefractionPrincipal;
    mapping(uint256 => uint256) public bondIdAtMaturityAvailableBondFee;
    mapping(uint256 => uint256) public bondIdAtMaturityPrincipal;    

    mapping(uint256 => uint256) public dayToRewardShareIndex;

    mapping(uint256 => uint256) public dayRewardShareIndexForSend;

    mapping(uint256 => uint256) public dayBondYieldShareIndex;

    mapping(uint256 => uint256) public secondsBondYieldShareIndex;
    mapping(uint256 => uint256[]) public dayToRefractionShareUpdation;
    mapping(uint256 => uint256[]) public dayToYeildShareUpdation;
    mapping(uint256 => uint256) public secondsRefractionShareIndex;

    mapping(uint256 => uint256[]) public dayToRefractionShareUpdationSend;
    mapping(uint256 => uint256) public secondsRefractionShareIndexSend;

    // new variables
   
    mapping(uint256 => uint256) public avgDailyBondYield;
    mapping(uint256 => uint256) public totalTreasuryValue;
    mapping(uint256 => uint256) public totalBondReturnAmount;

    mapping(uint256 => BondReward) public finalRewardValue;
    mapping(uint256 => BondIdMaturityDetail) public bondIdAtMaturityDetail;
    mapping(uint256 => BondIdMaturityDetail) public dailyDepositDetail;

    uint256 public rewardShareIndex;
    uint256 public rewardShareIndexSend;
    uint256 public totalRewardPrincipal;
    uint256 public totalRefractionPrincipal;
    uint256 public rateOfChange;
    
    uint256 public totalDeposit;


    uint256 public bondYieldShareIndex;
    uint256 public totalBondPrincipalAmount;
    uint256 public totalBondRewardAmount;
    uint256 public endMint;
    uint256 public bondYieldBaseRate;
    uint256 public netYieldRate;
    uint256 public txFees;
    uint256 public minDepositAmount;
    uint256 public SECONDS_IN_DAY;
    uint256 public lastDay;
    uint256 internal amountRequired;
    uint256 private depositAmountRequired;
    uint256 private refractionAmountRequired;
    uint256 public availableBondFee;
    uint256 private withdrawAmntFromSt;
    uint public interval;
    uint public lastTimeStamp;
    uint public lastSecOfRefraction;
    uint public lastSecOfYeildUpdation;
    uint public lastSecOfSendReward;
    bool public isWhitelisted;
    bool public isSet;
    uint256 public rewardIndex;

    /// @notice An array containing all maturities.
    uint256[] public maturities;

    address public contractSigner;
    address private endSignature;
    address private endToken;
    address private enderStakeEth;
    address private sEndToken;
    address public lido;
    address public stEth;
    address public keeper;

    IBondNFT private bondNFT;
    IEnderBondLiquidityDeposit private depositContract;
    IEnderTreasury private endTreasury;
    IEnderStaking private endStaking;

    bool public depositEnable;  // status of deposit-feature (enabled/disabled)
    bool public isWithdrawPause;   // status of withdraw-pause
    bool public bondFeeEnabled; // status of bond-fee feature (enabled/disabled)
    bool public bondPause; // status of bond-contract pause/unpause

    /* ======== STRUCTS ======== */

    struct Bond {
        bool withdrawn; // The withdrawn status of the bond
        uint256 principal; // The principal amount of the bond
        uint256 startTime; // Timestamp of the bond
        uint256 maturity; // The maturity date of the bond
        address token; // The token used for the bond
        uint256 bondFee; // bond fee self-set
        uint256 dailyBondYield;
        uint256 totalBondReward;
        uint256 pastRewardDays;
        uint256 refractionPrincipal;
        uint256 refractionSIndex;
        uint256 stakingSendIndex;
        uint256 YieldIndex;
    }

    struct signData {
        address user;
        string key;
        bytes signature;
    }

    struct BondReward {
        uint256 totalDepositAmount;
        uint256 avgDailyBondYield;
        uint256 totalTreasuryValue;
        uint256 totalBondReturnAmount;   
    }

    struct BondIdMaturityDetail {
        uint256 principal;
        uint256 dailyBondYield;
    }

    /* ======== EVENTS ======== */

    event IntervalSet(uint256 indexed newInterval);
    event BoolSet(bool indexed newValue);
    event AddressSet(uint256 indexed addrType, address indexed newAddress);
    event MinDepAmountSet(uint256 indexed newAmount);
    event TxFeesSet(uint256 indexed newTxFees);
    event BondYieldBaseRateSet(uint256 indexed newBondYieldBaseRate);
    event DepositEnableSet(bool indexed isEnabled);
    event WithdrawPauseSet(bool indexed isEnabled);
    event BondPauseSet(bool indexed isEnabled);
    event BondableTokensSet(address indexed token, bool indexed isEnabled);
    event Deposit(address indexed sender, uint256 indexed tokenId, uint256 principal, uint256 maturity, address token,uint256 bondFee);
    event Withdrawal(address indexed sender, uint256 indexed tokenId);
    event RefractionRewardsClaimed(address indexed sender, uint256 indexed tokenId, uint256 rewardAmount);
    event StakingRewardsClaimed(address indexed sender, uint256 indexed tokenId, uint256 rewardAmount);
    event RewardShareIndexUpdated(uint256 indexed newRewardShareIndex);
    event NetYieldRateUpdated(uint256 indexed newNetYieldRate);
    event BondYieldShareIndexUpdated(uint256 indexed newBondYieldShareIndex);
    event EndMintReset();
    event NewSigner(address _signer);
    event WhitelistChanged(bool indexed action);
    event RewardSharePerUserIndexSet(uint256 indexed tokenId, uint256 indexed newRewardSharePerUserIndex);
    event ClaimRewards(address indexed account, uint256 reward,uint256 tokenId);

    /* ======== INITIALIZATION ======== */
    
    /**
     * @dev Initializes the contract
     * @param endToken_ The address of the END token
     */
    function initialize(address endToken_, address enderStakeEth_, address _lido, address _signer) public initializer {
        __Ownable_init();
        __EIP712_init(SIGNING_DOMAIN, SIGNATURE_VERSION);
        rateOfChange = 100;
        lido = _lido;
        setAddress(endToken_, 2);
        setAddress(enderStakeEth_, 11);
        // todo set the value according to doc
        minDepositAmount = 1000000000000000;
        txFees = 200;
        contractSigner = _signer;
        bondYieldBaseRate = 300;
        SECONDS_IN_DAY = 600; // note for testing purpose we have set it to 10 mint
        interval = 10 * 60; // note for testing purpose we have set it to 10 mint
        lastTimeStamp = block.timestamp;
        lastDay = block.timestamp / SECONDS_IN_DAY;
        lastSecOfRefraction = block.timestamp;
        lastSecOfYeildUpdation = block.timestamp;
        lastSecOfSendReward = block.timestamp;
        depositEnable = true; // for testing purpose
        isWithdrawPause = true; // for testing purpose
        bondPause = true; // for testing purpose
        isWhitelisted = true; // for testing purpose
    }

    modifier depositEnabled() {
        if (depositEnable != true) revert NotAllowed();
        _;
    }

    modifier withdrawEnabled() {
        if (isWithdrawPause != true) revert NotAllowed();
        _;
    }

    modifier bondPaused() {
        if (bondPause != true) revert NotAllowed();
        _;
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
        else if (_type == 10) depositContract = IEnderBondLiquidityDeposit(_addr);
        else if (_type == 11) enderStakeEth = _addr;
        else revert InvalidAddress();

        emit AddressSet(_type, _addr);
    }

    function setsigner(address _signer) external onlyOwner {
        if (_signer == address(0)) revert ZeroAddress();
        contractSigner = _signer;
        emit NewSigner(contractSigner);
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

    function getPrivateAddress(uint256 _type) external view returns (address addr) {
        if (_type == 0) revert ZeroAddress();

        if (_type == 1) addr = address(endTreasury);
        else if (_type == 2) addr = endToken;
        else if (_type == 3) addr = address(bondNFT);
        else if (_type == 4) addr = endSignature;
        else if (_type == 5) addr = lido;
        else if (_type == 6) addr = stEth;
        else if (_type == 7) addr = keeper;
        else if (_type == 8) addr = address(endStaking);
        else if (_type == 9) addr = sEndToken;
        else if (_type == 10) addr = address(depositContract);
        else if (_type == 11) addr = enderStakeEth;
        else revert InvalidAddress();
    }

    /**
     * @notice Update the deposit-function status
     * @param _enabled status
     */
    function setDepositEnable(bool _enabled) public onlyOwner {
        depositEnable = _enabled;
        emit DepositEnableSet(_enabled);
    }

    /**
     * @notice Update the withdraw-pause status
     * @param _enabled status
     */
    function setWithdrawPause(bool _enabled) public onlyOwner {
        isWithdrawPause = _enabled;
        emit WithdrawPauseSet(_enabled);
    }

    /**
     * @notice Update the bondContract-pause status
     * @param _enabled status
     */
    function setBondPause(bool _enabled) public onlyOwner {
        bondPause = _enabled;
        emit BondPauseSet(_enabled);
    }

    /**
     * @notice Updated the netYieldRate
     * @param _netYieldRate new netYieldRate value 
     */
    function setNetYieldRate(uint256 _netYieldRate) public onlyOwner {
        netYieldRate = _netYieldRate;
        emit NetYieldRateUpdated(netYieldRate);
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
            rate = bondYieldBaseRate * maturityModifier;
        }
    }

    function whitelist(bool _action) external onlyOwner{
        isWhitelisted = _action;
        emit WhitelistChanged(_action);
    }

    function userInfoDepositContract(uint256[] memory index, signData memory userSign) external onlyOwner{
        if (index.length > 0){
            for (uint256 i = 0; i < index.length; i++){
                (address user, uint256 principal, uint256 bondFees, uint256 maturity) = depositContract.depositedIntoBond(index[i]);
                deposit(user, principal, maturity, bondFees, stEth, userSign);
            }
        }
    }

    /**
     * @notice Allows a user to deposit a specified token into a bond
     * @param principal The principal amount of the bond
     * @param maturity The maturity date of the bond (lock time)
     * @param bondFee Self-set bond fee
     * @param token The address of the token (if token is zero address, then depositing ETH)
     * @notice @Todo for testing purpose maturity is set to 7-365 days
     */
    function deposit(
        address user,
        uint256 principal,
        uint256 maturity,
        uint256 bondFee,
        address token,
        signData memory userSign
    ) public payable nonReentrant depositEnabled bondPaused returns (uint256 tokenId) {
        address _owner = owner();
        if(msg.sender != _owner){               //When the deposit is made via deposit contract, needs to be reviewed
            if (principal < minDepositAmount) revert InvalidAmount();
            if (maturity < 7 || maturity > 365) revert InvalidMaturity();
            if (token != address(0) && !bondableTokens[token]) revert NotBondableToken();
            if (bondFee > 10000) revert InvalidBondFee();
            if(isWhitelisted){
                address signAddress = _verify(userSign);
                if(signAddress != contractSigner || userSign.user != msg.sender) revert NotWhitelisted();
            }
        }
        
        IEndToken(endToken).distributeRefractionFees();
        epochBondYieldShareIndex();
        uint256 beforeBalance = IERC20(stEth).balanceOf(address(endTreasury));
        // token transfer
        if (token == address(0)) {
            if (msg.value != principal) revert InvalidAmount();
            (bool suc, ) = payable(lido).call{value: msg.value}(
                abi.encodeWithSignature("submit(address)", address(this))
            );             
            require(suc, "lido eth deposit failed");                                                                
            IERC20(stEth).safeTransfer(address(endTreasury), IERC20(stEth).balanceOf(address(this)));                  
        } else {                                                                                                   
            // send directly to the ender treasury

            //When the deposit is made via deposit contract, needs to be reviewed
            if(msg.sender == _owner)IERC20(token).safeTransferFrom(address(depositContract), address(endTreasury), principal);   
            else IERC20(token).safeTransferFrom(user, address(endTreasury), principal);                                
        }
        uint256 afterBalance = IERC20(stEth).balanceOf(address(endTreasury)); 
        principal = afterBalance - beforeBalance;                                                                                
        tokenId = _deposit(user, principal, maturity, token, bondFee);   
                                                               
        // IEnderStaking(endStaking).epochStakingReward(stEth);
        emit Deposit(user, tokenId, principal, maturity, token,bondFee);
    }

    function _deposit(
        address user,
        uint256 principal,
        uint256 maturity,
        address token,
        uint256 bondFee
    ) private returns (uint256 tokenId) {
        endTreasury.depositTreasury(IEnderBase.EndRequest(user, token, principal), getLoopCount());        
        // mint bond nft                                                                      
        tokenId = bondNFT.mint(user);
        IEnderStakeEth(enderStakeEth).mint(user, principal, bondFee);
        uint256 currentTime = block.timestamp;
        uint256 depositDay = currentTime / SECONDS_IN_DAY;
        uint256 bondEndDay = depositDay + maturity;

        bondIdAtMaturity[bondEndDay].push(tokenId);

        uint256 refractionPrincipal = calculateRefractionData(user, principal, maturity, tokenId, bondFee);          
        rewardSharePerUserIndex[tokenId] = rewardShareIndex;                                         
        rewardSharePerUserIndexSend[tokenId] = rewardShareIndexSend;                                                                                      
        userBondYieldShareIndex[tokenId] = bondYieldShareIndex;

        // new calculation
        uint256 dailyBondYield = (getInterest(maturity) * (10000 + (bondFee)) * principal) / (365 * 100000000);
        uint256 bondRewardAmount = dailyBondYield * maturity * 1000;
        uint256 depositReward = (netYieldRate * principal) / (365 * 10000);
        uint256 depositAmount = depositReward * maturity;

        totalDeposit += principal;
        
        totalRewardPrincipal += depositAmount;
        totalBondRewardAmount += bondRewardAmount;


        totalRefractionPrincipal += refractionPrincipal;
        totalBondPrincipalAmount += dailyBondYield;

        bondIdAtMaturityDepositPrincipal[bondEndDay] += dailyBondYield;
        bondIdAtMaturityRefractionPrincipal[bondEndDay] += refractionPrincipal;
        bondIdAtMaturityAvailableBondFee[bondEndDay] += (principal * bondFee) / 10000;

        bondIdAtMaturityDetail[bondEndDay].principal += principal;
        bondIdAtMaturityDetail[bondEndDay].dailyBondYield += dailyBondYield;
        dailyDepositDetail[depositDay].principal += principal;
        dailyDepositDetail[depositDay].dailyBondYield += dailyBondYield;
        


        // save bond info
        bonds[tokenId] = Bond(
            false,
            principal,
            currentTime,
            maturity,
            token,
            bondFee,
            dailyBondYield,
            bondRewardAmount,
            0,
            refractionPrincipal,
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
    function withdraw(uint256 tokenId) external nonReentrant withdrawEnabled bondPaused{
        address nftOwner = bondNFT.ownerOf(tokenId);
        if (msg.sender != nftOwner) revert NotBondNFTOwner();
        _withdraw(tokenId);
        emit Withdrawal(msg.sender, tokenId);
    }

    /**
     * @notice Private function for withdraw and withdraw request
     * @param _tokenId Bond nft tokenid

     */
    function _withdraw(uint256 _tokenId) private {
        Bond memory bond = bonds[_tokenId];
        if (bond.withdrawn) revert BondAlreadyWithdrawn();
        if (block.timestamp <= bond.startTime + (bond.maturity * SECONDS_IN_DAY)) revert BondNotMatured();

        uint256 feeEndEthAmount = bond.principal * bond.bondFee / 10000;
        uint256 requireEndEth = bond.principal - feeEndEthAmount;
        address nftOwner = bondNFT.ownerOf(_tokenId);
        uint256 endEthBalance = IEnderStakeEth(enderStakeEth).balanceOf(nftOwner);
        if (endEthBalance < requireEndEth) revert InsufficientEndETH();
        IEnderStakeEth(enderStakeEth).burn(nftOwner, requireEndEth);

        claimRewards(_tokenId);
        bonds[_tokenId].withdrawn = true;

        endTreasury.withdraw(IEnderBase.EndRequest(msg.sender, bond.token, (bond.principal * (10000 - bond.bondFee)) / 10000 ), getLoopCount());
        //todo need to check this
        dayBondYieldShareIndex[(bonds[_tokenId].startTime/SECONDS_IN_DAY) + bonds[_tokenId].maturity] = userBondYieldShareIndex[_tokenId]; 
       
        totalBondPrincipalAmount -= bond.dailyBondYield;

        totalRewardPrincipal -= bond.dailyBondYield;
        depositAmountRequired -= bond.dailyBondYield;   
        refractionAmountRequired -= bond.refractionPrincipal;
        totalRefractionPrincipal -= bond.refractionPrincipal;

        totalDeposit -= bond.principal;

        amountRequired -= bond.principal;

    }

    function claimRewards(uint256 _tokenId) public {
        epochRewardShareIndexByPass();
        epochBondYieldShareIndex();
        epochRewardShareIndexSendByPass();

        Bond memory bond = bonds[_tokenId];
        if (bondNFT.ownerOf(_tokenId) != msg.sender) revert NotBondUser();

        IEndToken(endToken).distributeRefractionFees();

        // uint256 reward = calculateBondRewardAmount(_tokenId, bond.YieldIndex);
        uint256 reward = 0;
        uint256 idx = (block.timestamp - bond.startTime) / SECONDS_IN_DAY;
        if (idx >= bond.maturity) {
            bonds[_tokenId].pastRewardDays = bond.maturity;
            reward = bond.totalBondReward;
            bonds[_tokenId].totalBondReward = 0;
        } else {
            reward = bond.dailyBondYield * 1000 * (idx - bond.pastRewardDays);
            bonds[_tokenId].pastRewardDays = idx;
            bonds[_tokenId].totalBondReward -= reward;
        }
        console.log("reward ->", reward);
        endTreasury.mintEndToUser(msg.sender, reward);

        // userBondYieldShareIndex[_tokenId] = bondYieldShareIndex;
        // if(rewardShareIndex != rewardSharePerUserIndex[_tokenId]) {
        //     uint256 refractionReward = calculateRefractionRewards(_tokenId, bond.refractionSIndex);
        //     IERC20(endToken).safeTransfer(
        //         msg.sender, refractionReward
        //     );
        //     rewardSharePerUserIndex[_tokenId] = rewardShareIndex;
        //     emit RefractionRewardsClaimed(msg.sender, _tokenId, refractionReward);

        // }
        // if(rewardShareIndexSend != rewardSharePerUserIndexSend[_tokenId]){             
        //     uint256 sEndTokenReward = calculateStakingReward(_tokenId, bond.stakingSendIndex);
        //     ISEndToken(sEndToken).safeTransfer(msg.sender, sEndTokenReward);
        //     rewardSharePerUserIndexSend[_tokenId] = rewardShareIndexSend;
        //     emit StakingRewardsClaimed(msg.sender, _tokenId, reward);

        // }
        emit ClaimRewards(msg.sender, reward, _tokenId);
    }

    function getDailyReward() public {
        uint256 currentDay = block.timestamp / SECONDS_IN_DAY;
        if (currentDay > lastDay) {
            for (uint256 i = lastDay + 1; i <= currentDay; i++) {
                BondReward memory prevReward = finalRewardValue[i-1];
                finalRewardValue[i].totalDepositAmount = prevReward.totalDepositAmount + dailyDepositDetail[i-1].principal - bondIdAtMaturityDetail[i-1].principal;
                finalRewardValue[i].totalBondReturnAmount = prevReward.totalBondReturnAmount + dailyDepositDetail[i-1].dailyBondYield * 1000 - bondIdAtMaturityDetail[i-1].dailyBondYield * 1000;
                finalRewardValue[i].totalTreasuryValue = prevReward.totalTreasuryValue + (dailyDepositDetail[i-1].principal * netYieldRate) / (365 * 10000) - (bondIdAtMaturityDetail[i-1].dailyBondYield * netYieldRate) / (365 * 10000);
            }
        }
    }

    function getLoopCount() public returns (uint256) {
        uint256 currentDay = block.timestamp / SECONDS_IN_DAY;
        if (currentDay == lastDay) return withdrawAmntFromSt = 0;
        else{
            for (uint256 i = lastDay + 1; i <= currentDay; i++) {
                ///@dev loop will start from the first day of the deployment.
                /// minimum deposit is for 7 days. So it will cover the 4 days gaps in below condition. 
                if(bondIdAtMaturity[i].length > 0){
                    depositAmountRequired += bondIdAtMaturityDepositPrincipal[i];
                    refractionAmountRequired += bondIdAtMaturityRefractionPrincipal[i];
                    availableBondFee += bondIdAtMaturityAvailableBondFee[i];
                    // for(uint256 j = 0; j < bondIdAtMaturity[i].length; j++){
                    //     Bond memory bond = bonds[bondIdAtMaturity[i][j]];
                    //     depositAmountRequired += bond.depositPrincipal;
                    //     refractionAmountRequired += bond.refractionPrincipal;
                    //     availableBondFee += (bond.principal * bond.bondFee) / 10000;
                    // }
                }
                if(bondIdAtMaturity[i+4].length > 0){
                    amountRequired += bondIdAtMaturityPrincipal[i+4];
                    // for(uint256 j = 0; j < bondIdAtMaturity[i+4].length; j++){
                    //     Bond memory bond = bonds[bondIdAtMaturity[i+4][j]];
                    //     amountRequired += bond.principal;
                    // }
                }

            }
            lastDay = currentDay;
            uint256 balanceInTreasury = ISEndToken(stEth).balanceOf(address(endTreasury));
            if (amountRequired <= balanceInTreasury){ 
                withdrawAmntFromSt = 0;
            }
            else{
                withdrawAmntFromSt = amountRequired - balanceInTreasury;
            }
            return withdrawAmntFromSt;
        }
    }

    function deductFeesFromTransfer(uint256 _tokenId) public {
        if (msg.sender != address(bondNFT)) {
            revert NotBondNFT();
        }
        if (bonds[_tokenId].bondFee < 10000) {
            uint deductAmount = (bonds[_tokenId].principal * txFees) / 10000;
            bonds[_tokenId].principal -= deductAmount;
            bonds[_tokenId].bondFee += txFees;
        }
    }

    /**
     * @dev Sets the reward share for a given `_reward` .
     * @param _reward The reward to be added to the reward share.
     */
    function epochRewardShareIndex(uint256 _reward) external {
        if(msg.sender != endToken) revert NotEndToken();

        if (totalRefractionPrincipal - refractionAmountRequired != 0) {
            IERC20(endToken).safeTransferFrom(endToken, address(this), _reward);
            uint256 timeNow = block.timestamp / SECONDS_IN_DAY;
            
            rewardShareIndex =
                (rewardShareIndex) +
                ((_reward * 10 ** 18) / (totalRefractionPrincipal - refractionAmountRequired));
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
            dayToRewardShareIndex[block.timestamp] = rewardShareIndex;
            secondsRefractionShareIndex[block.timestamp] = rewardShareIndex;
        }
        emit RewardShareIndexUpdated(rewardShareIndex);
    }

    function epochRewardShareIndexByPass() public{

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
    }

    /**
     * @dev Sets the reward share for sending, based on `_reward` and `_totalPrinciple`.
     * @param _reward The reward to be added to the reward share.
     */

    function epochRewardShareIndexForSend(uint256 _reward) public {
        if(msg.sender != address(endStaking)) revert NotEnderStaking();
        if (totalDeposit - amountRequired != 0) {
            uint256 timeNow = block.timestamp / SECONDS_IN_DAY;
            rewardShareIndexSend =
                rewardShareIndexSend +
                ((_reward * 10 ** 18) / (totalDeposit - amountRequired));            
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
            dayRewardShareIndexForSend[timeNow] = rewardShareIndexSend;
            secondsRefractionShareIndexSend[block.timestamp] = rewardShareIndexSend;
        }
    }

    function epochRewardShareIndexSendByPass() public{
         uint256 timeNow = block.timestamp / SECONDS_IN_DAY;
        if( lastSecOfSendReward / SECONDS_IN_DAY == timeNow && dayToRefractionShareUpdationSend[timeNow].length == 0){
            dayToRefractionShareUpdationSend[timeNow].push(lastSecOfSendReward);
        }else{
            uint day = lastSecOfSendReward / SECONDS_IN_DAY;
            for(uint i = day+1; i <= timeNow; i++){
                dayToRefractionShareUpdationSend[i].push(lastSecOfSendReward);
            }
        }
        lastSecOfSendReward = block.timestamp;
    }


    function findClosestS(uint256[] memory arr, uint256 _totalMaturity) internal pure returns (uint256 _s) {
        uint256 low = 0;
        uint256 high;
        if(arr.length == 0){
            return 0;
        }else{
            high = arr.length - 1;
        }
        uint256 mid;

        while (low <= high) {
            mid = (low + high) / 2;
            if (mid == 0 || mid == arr.length -1) {
                return arr[mid];
            } else if (arr[mid] == _totalMaturity || (arr[mid + 1] > _totalMaturity && arr[mid] < _totalMaturity)) {
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
    }

    /**
     * @dev Gets and sets the ETH price and updates the bond yield share.
     */ 
    function epochBondYieldShareIndex() public {        
        if(totalBondPrincipalAmount - depositAmountRequired != 0){
            uint256 timeNow = block.timestamp / SECONDS_IN_DAY;
            uint256 finalRewardPrincipal = (totalBondPrincipalAmount - depositAmountRequired);
            uint256 _endMint = (finalRewardPrincipal * 1000);
            endMint += _endMint;
            
            bondYieldShareIndex = bondYieldShareIndex + ((_endMint) / finalRewardPrincipal);
            
            if( lastSecOfYeildUpdation / SECONDS_IN_DAY == timeNow ){
                if(dayToYeildShareUpdation[timeNow].length == 0) dayToYeildShareUpdation[timeNow].push(lastSecOfYeildUpdation);
                dayToYeildShareUpdation[timeNow].push(block.timestamp);
            }else{
                uint day = lastSecOfYeildUpdation / SECONDS_IN_DAY;
                for(uint i = day+1; i <= timeNow; i++){
                    dayToYeildShareUpdation[i].push(lastSecOfYeildUpdation);
                }
            }

            console.log("sbondYieldShareIndex 2 ->", bondYieldShareIndex);

            lastSecOfYeildUpdation = block.timestamp;
            dayBondYieldShareIndex[timeNow] = bondYieldShareIndex;
            secondsBondYieldShareIndex[block.timestamp] = bondYieldShareIndex;            
            emit BondYieldShareIndexUpdated(bondYieldShareIndex);
        }
    }

    /**
     * @dev Calculates pending rewards and related information for a bond.
     * @param _principal The principle amount of the bond.
     * @param _maturity The maturity of the bond.
     * @param _tokenId The unique identifier of the bond.
     * @return rewardPrinciple The principle amount used in reward calculations.
     */
    function calculateRefractionData(
        address user,
        uint256 _principal,
        uint256 _maturity,
        uint256 _tokenId,
        uint256 _bondfee
    ) internal returns (uint256 rewardPrinciple) {
        if ( bondNFT.ownerOf(_tokenId) != user) revert NotBondUser();
        uint avgRefractionIndex = _bondfee != 0 ? 
            100 + ((rateOfChange * _bondfee * (_maturity - 1)) / (2 * 1000000)) :
            100 + ((rateOfChange * (_maturity - 1)) / (2 * 100));
        rewardPrinciple = (_principal * avgRefractionIndex) / 100;
        secondsRefractionShareIndex[block.timestamp] = rewardShareIndex;
    }

    /**
     * @dev Claims rewards for staking based on a given `_tokenId`.
     * @param _tokenId The unique identifier of the bond.
     */

    function calculateStakingReward(uint256 _tokenId, uint256 precalUsers) public view returns(uint256 _reward) {
        Bond memory bond = bonds[_tokenId];
        uint rewardPrincipal = bond.principal;
        uint256 idx = bond.maturity + (bond.startTime / SECONDS_IN_DAY);
        if (precalUsers != 0) {
            if (precalUsers > rewardSharePerUserIndexSend[_tokenId]) {
                _reward = ((rewardPrincipal * (precalUsers - rewardSharePerUserIndexSend[_tokenId])) / 1e18);
            } 
        } else {
            if (bondNFT.ownerOf(_tokenId) != msg.sender) revert NotBondUser();
            if (isSet) {
                if (dayRewardShareIndexForSend[idx] == 0) {
                    if (rewardShareIndexSend > rewardSharePerUserIndexSend[_tokenId]) {
                        _reward = ((rewardPrincipal * (rewardShareIndexSend - rewardSharePerUserIndexSend[_tokenId])) / 1e18);
                    }
                } else {
                    uint256 sTime;                    
                    if(dayToRefractionShareUpdationSend[idx].length == 1){
                        sTime = dayToRefractionShareUpdationSend[idx][0];
                    }else{
                        sTime = findClosestS(
                            dayToRefractionShareUpdationSend[idx],
                            ((bonds[_tokenId].maturity * SECONDS_IN_DAY) + bonds[_tokenId].startTime)
                        );
                    }
                    uint256 userS = secondsRefractionShareIndexSend[sTime];
                    if (userS > rewardSharePerUserIndexSend[_tokenId]) {
                        _reward = ((rewardPrincipal * (userS - rewardSharePerUserIndexSend[_tokenId])) / 1e18);
                    }
                }
            } else {
                revert NotAllowed();
            }
        }
    }

    /**
     * @dev Claims rewards for a bond based on a given `_tokenId`.
     * @param _tokenId The unique identifier of the bond.
     */

    function calculateRefractionRewards(uint256 _tokenId, uint256 precalUsers) public view returns (uint256 _reward) {
        Bond memory bond = bonds[_tokenId];
        uint rewardPrincipal = bond.refractionPrincipal;
        uint256 idx = (bond.startTime / SECONDS_IN_DAY) + bond.maturity;
        if (precalUsers != 0) {
            if (precalUsers > rewardSharePerUserIndex[_tokenId]) {
                _reward = ((rewardPrincipal * (precalUsers - rewardSharePerUserIndex[_tokenId])) / 1e18);
            }
        } else {
            if (isSet) {
                if (bondNFT.ownerOf(_tokenId) != msg.sender) revert NotBondUser();
                if (rewardShareIndex == rewardSharePerUserIndex[_tokenId]) revert NoRewardCollected();
                if (dayToRewardShareIndex[idx] == 0){ 
                    if(rewardShareIndex > rewardSharePerUserIndex[_tokenId]) {
                        _reward = ((rewardPrincipal * (rewardShareIndex - rewardSharePerUserIndex[_tokenId])) / 1e18);
                    }
                } else {
                    uint256 sTime;
                    if(dayToRefractionShareUpdation[idx].length == 1){
                        sTime = dayToRefractionShareUpdation[idx][0];
                    }else{
                        sTime = findClosestS(
                            dayToRefractionShareUpdation[idx],
                            ((bonds[_tokenId].maturity * SECONDS_IN_DAY) + bonds[_tokenId].startTime)
                        );
                    }
                    uint256 userS = secondsRefractionShareIndex[sTime];
                    if (userS > rewardSharePerUserIndex[_tokenId]) {
                        _reward = ((rewardPrincipal * (userS - rewardSharePerUserIndex[_tokenId])) / 1e18);
                    }
                }
            } else {
                revert NotAllowed();
            }
        }
    }

    // /**
    //  * @dev Calculates the reward amount for a given `_tokenId`.
    //  * @param _tokenId The unique identifier of the bond.
    //  * @return _reward The reward amount for the bond.
    //  */
    // function calculateBondRewardAmount(uint256 _tokenId, uint256 precalUsers) public view returns (uint256 _reward) {
    //     Bond memory bond = bonds[_tokenId];
    //     uint256 idx = (bond.startTime / SECONDS_IN_DAY) + bond.maturity;
    //     if (precalUsers != 0) {
    //         if (precalUsers > userBondYieldShareIndex[_tokenId]) {
    //             _reward = (bond.depositPrincipal * (precalUsers - userBondYieldShareIndex[_tokenId]));
    //             console.log("start 1 ->", _reward);
    //         }
    //     } else {
    //         if (isSet) {
    //             if (dayBondYieldShareIndex[idx] == 0) {
    //                 if (bondYieldShareIndex > userBondYieldShareIndex[_tokenId]) {
    //                     _reward = (bond.depositPrincipal * (bondYieldShareIndex - userBondYieldShareIndex[_tokenId]));
    //                     console.log("start 2 ->", _reward, bondYieldShareIndex );
    //                 }
    //             } else {                        
    //                     // uint256 userS = secondsBondYieldShareIndex[((bonds[_tokenId].maturity * SECONDS_IN_DAY) + bonds[_tokenId].startTime)] == 0 ?
    //                     // secondsBondYieldShareIndex[((bonds[_tokenId].maturity * SECONDS_IN_DAY) + bonds[_tokenId].startTime) - 1] :
    //                     // secondsBondYieldShareIndex[((bonds[_tokenId].maturity * SECONDS_IN_DAY) + bonds[_tokenId].startTime)];                        
    //                     // _reward = (bond.depositPrincipal * (userS - userBondYieldShareIndex[_tokenId]));

    //                 uint256 sTime;
    //                 if(dayToYeildShareUpdation[idx].length == 1){
    //                     sTime = dayToYeildShareUpdation[idx][0];
    //                 }else{                        
    //                     sTime = findClosestS(
    //                         dayToYeildShareUpdation[idx],
    //                         ((bonds[_tokenId].maturity * SECONDS_IN_DAY) + bonds[_tokenId].startTime)
    //                     );
    //                 }
    //                 uint256 userS = secondsBondYieldShareIndex[sTime];
    //                 if (userS > userBondYieldShareIndex[_tokenId]) {
    //                     _reward = (bond.depositPrincipal * (userS - userBondYieldShareIndex[_tokenId]));
    //                 }
    //             }
    //         } else {
    //             revert NotAllowed();
    //         }
    //     }
    // }

    function checkUpkeep(bytes calldata) external view override returns (bool upkeepNeeded, bytes memory performData) {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
        // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
    }

    function performUpkeep(bytes calldata /* performData */) external override {
        //We highly recommend revalidating the upkeep in the performUpkeep function
            epochBondYieldShareIndex();
            epochRewardShareIndexByPass();
            epochRewardShareIndexSendByPass();
            endStaking.epochStakingReward(stEth);
            getLoopCount();
        // We don't use the performData in this example. The performData is generated by the Keeper's call to your checkUpkeep function
    }

    function setIndexesOfUser(uint256[] memory tokenId,uint256 refractionSIndex,uint256 stakingSendIndex,uint256 YieldIndex) external onlyOwner{
        
        if(refractionSIndex==0 || stakingSendIndex ==0 || YieldIndex == 0){
            revert ZeroValue();
        }

       for(uint i=0;i<tokenId.length; i++){
        bonds[tokenId[i]].refractionSIndex = refractionSIndex;
        bonds[tokenId[i]].stakingSendIndex = stakingSendIndex;
        bonds[tokenId[i]].YieldIndex = YieldIndex;
        emit RewardSharePerUserIndexSet(tokenId[i], rewardShareIndex);
       }
    }

    function resetEndMint() external{
        if(msg.sender != address(endTreasury)) revert NoTreasury();
        endMint = 0;
        emit EndMintReset();
    }

    function setAvailableBondFee(uint amount) external {
        if(msg.sender != address(endTreasury)) revert NoTreasury();
        availableBondFee -= amount;
    }
    
    function _hash(signData memory userSign) internal view returns (bytes32) {
        return
            _hashTypedDataV4(
                keccak256(
                    abi.encode(
                        keccak256("userSign(address user,string key)"),
                        userSign.user,
                        keccak256(bytes(userSign.key))
                    )
                )
            );
    }

    /**
     * @notice verifying the owner signature to check whether the user is whitelisted or not
     */
    function _verify(signData memory userSign) internal view returns (address) {
        bytes32 digest = _hash(userSign);
        return ECDSAUpgradeable.recover(digest, userSign.signature);
    }

    receive() external payable {}
}
