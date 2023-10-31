// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Openzeppelin
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol";

// Interfaces
import "./interfaces/IBondNFT.sol";
import "./interfaces/IEnderTreasury.sol";
import "./interfaces/IEnderOracle.sol";
import "./interfaces/ISEndToken.sol";
import "./interfaces/ILido.sol";

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

/**
 * @title EnderBond contract
 * @dev Implements bonding functionality with multiple tokens
 */
contract EnderBond is Initializable, OwnableUpgradeable, ReentrancyGuardUpgradeable, EIP712Upgradeable {
    /// @notice A mapping that indicates whether a token is bondable.
    mapping(address => bool) public bondableTokens;

    /// @notice A mapping of bonds by token ID.
    mapping(uint256 => Bond) public bonds;

    mapping(address => uint256) public userNonces;

    mapping(uint256 => uint256) public pendingRefractionReward;
    mapping(uint256 => uint256) public rewardSharePerUserIndex;
    mapping(uint256 => uint256) public rewardSharePerUserIndexSend;
    mapping(uint256 => uint256) public userDeposit;

    mapping(uint256 => uint256) public userBondPrincipalAmount;
    mapping(uint256 => uint256) public userBondYieldShareIndex; //s0
    mapping(uint256 => uint256) public availableFundsAtMaturity;

    uint256 public rewardShareIndex;
    uint256 public rewardShareIndexSend;
    uint256 public totalRewardPriciple;
    uint256 public rateOfChange;
    uint256 public totalDeposit;
    uint256 public bondYeildShareIndex;
    uint256 public totalBondPrincipalAmount;
    uint256 public endMint;
    uint256 public bondYieldBaseRate;
    uint256 public txFees;
    uint256 constant SECONDS_IN_DAY = 86400;

    /// @notice An array containing all maturities.
    uint256[] public maturities;

    address private endSignature;
    address private endToken;
    address private sEndToken;
    address public lido;
    IBondNFT private bondNFT;
    IEnderTreasury private endTreasury;
    IEnderOracle private enderOracle;

    bool public bondFeeEnabled; // status of bond-fee feature (enabled/disabled)

    // enum AddressType {
    //     TREASURY,
    //     ENDTOKEN,
    //     BONDNFT,
    //     SIGNATURE
    // }

    struct Bond {
        bool withdrawn; // The withdrawn status of the bond
        uint256 principal; // The principal amount of the bond
        // uint256 endAmt; // The END token amount of deposit
        uint256 startTime; // Timestamp of the bond
        uint256 maturity; // The maturity date of the bond
        address token; // The token used for the bond
        uint256 bondFee; // bond fee self-set
    }

    event AddressUpdated(address indexed addr, uint256 addrType);
    event Deposit(address indexed user, uint256 tokenId);
    event Withdraw(address indexed user, uint256 tokenId);
    event Collect(address indexed user, uint256 tokenId, uint256 refraction, uint256 nonce);
    event Rebond(address indexed user, uint256 tokenId, uint256 bondId);
    event BondableTokensUpdated(address[] indexed token, bool enabled);
    event BondFeeEnableDisabled(bool enabled);

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
        enderOracle = IEnderOracle(_oracle);
        bondYieldBaseRate = 400;

        setBondFeeEnabled(true);
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

        emit AddressUpdated(_addr, _type);
    }

    function setTxFees(uint256 _txFees) public onlyOwner {
        txFees = _txFees;
    }

    function setBondYieldBaseRate(uint256 _bondYieldBaseRate) public onlyOwner {
        bondYieldBaseRate = _bondYieldBaseRate;
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

        emit BondFeeEnableDisabled(_enabled);
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
        }

        emit BondableTokensUpdated(tokens, enabled);
    }

    function getInterest(uint256 maturity) public view returns (uint256 rate) {
        console.log(maturity, "maturity");
        uint256 maturityModifier;
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

            console.log("----------", bondYieldBaseRate, maturityModifier);
            rate = bondYieldBaseRate * maturityModifier;
        }
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
        console.log("====================================");
        if (principal == 0) revert InvalidAmount();
        if (maturity < 7 || maturity > 365) revert InvalidMaturity();
        if (token != address(0) && !bondableTokens[token]) revert NotBondableToken();
        if (bondFee < 0 || bondFee > 100) revert InvalidBondFee();

        // token transfer
        if (token == address(0)) {
            if (msg.value != principal) revert InvalidAmount();
            uint256 stEthAmount = ILido(lido).submit(address(0));
            IERC20(token).transfer(address(endTreasury), stEthAmount);
        } else {
            // send directly to the ender treasury
            IERC20(token).transferFrom(msg.sender, address(endTreasury), principal);
        }
        tokenId = _deposit(principal, maturity, token, bondFee);

        emit Deposit(msg.sender, tokenId);
    }

    function _deposit(
        uint256 principal,
        uint256 maturity,
        address token,
        uint256 bondFee
    )
        private
        returns (
            // bool _rebond
            uint256 tokenId
        )
    {
        principal = (principal * (100 - bondFee)) / 100;
        console.log(principal, "principal");

        // mint bond nft
        tokenId = bondNFT.mint(msg.sender);
        // uint256 day = (block.timestamp + (maturity * SECONDS_IN_DAY)) / SECONDS_IN_DAY;
        // console.log(day, "day");
        availableFundsAtMaturity[(block.timestamp + (maturity * SECONDS_IN_DAY)) / SECONDS_IN_DAY] += principal;
        userDeposit[tokenId] += principal;
        (, uint256 rewardPrinciple) = calculateRefractionData(principal, maturity, tokenId);

        rewardSharePerUserIndex[tokenId] = rewardShareIndex;
        console.log(rewardShareIndex, "rewardShareIndex");
        console.log(rewardSharePerUserIndex[tokenId], "rewardSharePerUserIndex[tokenId]");

        rewardSharePerUserIndexSend[tokenId] = rewardShareIndexSend;
        userBondYieldShareIndex[tokenId] = bondYeildShareIndex;
        console.log(bondYeildShareIndex, "bondYeildShareIndex ");
        console.log(userBondYieldShareIndex[tokenId], "userBondYieldShareIndex[tokenId] ");
        totalDeposit += principal;
        totalRewardPriciple += rewardPrinciple;
        console.log("getInterest(maturity)", getInterest(maturity));
        uint256 depositPrincipal = (getInterest(maturity) * principal) / (365 * 1e6);
        console.log("depositPrincipal", (getInterest(maturity) * principal) / (365 * 1e6));
        IEnderTreasury(endTreasury).depositTreasury(IEnderBase.EndRequest(msg.sender, token, principal));
        userBondPrincipalAmount[tokenId] = depositPrincipal;
        totalBondPrincipalAmount += depositPrincipal;

        // save bond info
        bonds[tokenId] = Bond(false, principal, block.timestamp, maturity, token, bondFee);
        console.log("===============end=====================");
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

        emit Withdraw(msg.sender, tokenId);
    }

    /**
     * @notice Private function for withdraw and withdraw request
     * @param _tokenId Bond nft tokenid

     */
    function _withdraw(uint256 _tokenId) private {
        Bond storage bond = bonds[_tokenId];
        if (bond.withdrawn) revert BondAlreadyWithdrawn();
        if (bondNFT.ownerOf(_tokenId) != msg.sender) revert NotBondUser();
        if (block.timestamp < bond.startTime + bond.maturity) revert BondNotMatured();

        // update current bond
        bond.withdrawn = true;

        endTreasury.withdraw(IEnderBase.EndRequest(msg.sender, bond.token, bond.principal));

        uint256 reward = calculateBondRewardAmount(_tokenId);
        console.log(reward, "reward in the contract");
        endTreasury.mintEndToUser(msg.sender, reward);
        console.log(_tokenId, "tokennnn");
        claimRefractionRewards(_tokenId);
        totalBondPrincipalAmount -= userBondPrincipalAmount[_tokenId];
        userBondPrincipalAmount[_tokenId] = 0;
    }

    function deductFeesFromTransfer(uint256 _tokenId) public {
        if (msg.sender != address(bondNFT)) {
            revert NotBondNFT();
        }
        if (userBondPrincipalAmount[_tokenId] == 0) {
            revert NotBondUser();
        }
        userBondPrincipalAmount[_tokenId] -= (userBondPrincipalAmount[_tokenId] * txFees) / 1000000;
    }

    /**
     * @dev Sets the reward share for a given `_reward` .
     * @param _reward The reward to be added to the reward share.
     */
    function epochRewardShareIndex(uint256 _reward) external {
        if (totalRewardPriciple == 0) revert WaitForFirstDeposit();

        console.log(_reward, totalRewardPriciple, "_reward ,  totalRewardPriciple");
        IERC20(endToken).transferFrom(endToken, address(this), _reward);

        //error if the total reward is greater than the total reward , then thats fked

        rewardShareIndex = (rewardShareIndex * 1e8) + ((_reward * 1e8) / totalRewardPriciple);
        console.log(rewardShareIndex, "rewardShareIndex first time");
    }

    /**
     * @dev Sets the reward share for sending, based on `_reward` and `_totalPrinciple`.
     * @param _reward The reward to be added to the reward share.
     * @param _totalPrinciple The total principle used for calculating the reward share.
     */
    function epochRewardShareIndexForSend(uint256 _reward, uint256 _totalPrinciple) public {
        rewardShareIndexSend = rewardShareIndexSend + (_reward / _totalPrinciple);
    }

    /**
     * @dev Calculates pending rewards and related information for a bond.
     * @param _principle The principle amount of the bond.
     * @param _maturity The maturity of the bond.
     * @param _tokenId The unique identifier of the bond.
=    * @return avgRefractionIndex The average refraction index for the bond.
     * @return rewardPrinciple The principle amount used in reward calculations.
     */
    function calculateRefractionData(
        uint256 _principle,
        uint256 _maturity,
        uint256 _tokenId
    ) public view returns (uint256 avgRefractionIndex, uint256 rewardPrinciple) {
        if (bondNFT.ownerOf(_tokenId) != msg.sender) revert NotBondUser();
        avgRefractionIndex = 100 + ((rateOfChange * (_maturity - 1)) / (2 * 100));
        console.log(avgRefractionIndex, "avgRefractionIndex");
        rewardPrinciple = (_principle * avgRefractionIndex) / 100;
        // pendingReward = rewardPrinciple * (rewardShareIndex - rewardSharePerUserIndex[_tokenId]);
    }

    /**
     * @dev Calculates pending rewards for staking and related information for a bond.
     * @param _principle The principle amount of the bond.
     * @param _maturity The maturity of the bond.
     * @param _tokenId The unique identifier of the bond.
     * @return pendingRewardSend The pending reward for staking.
     * @return avgRefractionIndex The average refraction index for the bond.
     * @return rewardPrincipleSend The principle amount used in reward calculations for staking.
     */
    function calculateStakingPendingReward(
        uint _principle,
        uint256 _maturity,
        uint256 _tokenId
    ) public view returns (uint256 pendingRewardSend, uint256 avgRefractionIndex, uint256 rewardPrincipleSend) {
        if (bondNFT.ownerOf(_tokenId) != msg.sender) revert NotBondUser();
        avgRefractionIndex = 1 + ((rateOfChange * (_maturity - 1)) / 2) * 10000;
        rewardPrincipleSend = _principle * avgRefractionIndex;
        pendingRewardSend = rewardPrincipleSend * (rewardPrincipleSend - rewardSharePerUserIndexSend[_tokenId]);
    }

    /**
     * @dev Claims rewards for staking based on a given `_tokenId`.
     * @param _tokenId The unique identifier of the bond.
     */
    function claimStakingReward(uint256 _tokenId) public {
        if (bondNFT.ownerOf(_tokenId) != msg.sender) revert NotBondUser();
        Bond memory temp = bonds[_tokenId];

        (uint256 pendingReward, , uint rewardPrinciple) = calculateStakingPendingReward(
            temp.principal,
            temp.maturity,
            _tokenId
        );

        uint sEndTokenReward = pendingReward +
            (rewardPrinciple * (rewardShareIndexSend - rewardSharePerUserIndexSend[_tokenId]));

        if (sEndTokenReward > 0) {
            IERC20(endToken).transfer(msg.sender, sEndTokenReward);
            ISEndToken(sEndToken).burn(msg.sender, sEndTokenReward);
        }
    }

    /**
     * @dev Claims rewards for a bond based on a given `_tokenId`.
     * @param _tokenId The unique identifier of the bond.
     */
    function claimRefractionRewards(uint256 _tokenId) public {
        if (bondNFT.ownerOf(_tokenId) != msg.sender) revert NotBondUser();
        if (userBondPrincipalAmount[_tokenId] <= 0) revert NotBondUser();
        if (rewardShareIndex == rewardSharePerUserIndex[_tokenId]) revert NoRewardCollected();

        Bond memory temp = bonds[_tokenId];

        (, uint rewardPrinciple) = calculateRefractionData(temp.principal, temp.maturity, _tokenId);

        // console.log(
        //     (rewardPrinciple * (rewardShareIndex - rewardSharePerUserIndex[_tokenId])) / 1e8,
        //     "reward for refraction"
        // );
        console.log(rewardShareIndex,rewardSharePerUserIndex[_tokenId],"rewardShareIndex - rewardSharePerUserIndex[_tokenId]");
        // console.log("(rewardPrinciple * (rewardShareIndex - rewardSharePerUserIndex[_tokenId])) / 1e8",(rewardPrinciple * (rewardShareIndex - rewardSharePerUserIndex[_tokenId])) / 1e8);

        IERC20(endToken).transfer(
            msg.sender,
            (rewardPrinciple * (rewardShareIndex - rewardSharePerUserIndex[_tokenId])) / 1e8
        );
        rewardSharePerUserIndex[_tokenId] = rewardShareIndex;
    }

    /**
     * @dev Gets and sets the ETH price and updates the bond yield share.
     */
    function epochBondYieldShareIndex() external onlyOwner {
        (uint256 priceEth, uint256 ethDecimal) = enderOracle.getPrice(address(0));
        (uint256 priceEnd, uint256 endDecimal) = enderOracle.getPrice(address(endToken));
        console.log(totalBondPrincipalAmount, "totalBondPrincipalAmount");
        uint256 _endMint = (priceEth * priceEnd * totalBondPrincipalAmount) / (10 ** ethDecimal);
        endMint += _endMint * 100;
        console.log(endMint, "endMint");

        bondYeildShareIndex = bondYeildShareIndex + ((endMint) / totalBondPrincipalAmount);
    }

    /**
     * @dev Calculates the reward amount for a given `_tokenId`.
     * @param _tokenId The unique identifier of the bond.
     * @return _reward The reward amount for the bond.
     */
    function calculateBondRewardAmount(uint256 _tokenId) public view returns (uint256 _reward) {
        _reward = bondYeildShareIndex == userBondYieldShareIndex[_tokenId]
            ? (userBondPrincipalAmount[_tokenId] * 1) / 1e9
            : (userBondPrincipalAmount[_tokenId] * (bondYeildShareIndex - userBondYieldShareIndex[_tokenId])) / 1e9;

        console.log(bondYeildShareIndex, "bondYeildShareIndex");
    }

    receive() external payable {}
}
