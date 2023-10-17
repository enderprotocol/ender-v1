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
    mapping(uint256 => uint256) public rewardSharePerUser;
    mapping(uint256 => uint256) public rewardSharePerUserStaking;
    mapping(uint256 => uint256) public userDeposit;

    mapping(uint256 => uint256) public userBondPrincipalAmount;
    mapping(uint256 => uint256) public userBondYieldShare; //s0

    uint256 rewardShare;
    uint256 rewardShareStaking;
    uint256 totalRewardPriciple;
    uint256 rateOfChange;
    uint256 totalDeposit;
    uint256 public bondYeildShare;
    uint256 public totalBondPrincipalAmount;
    uint256 public endMint;
    uint256 public bondYieldBaseRate;

    /// @notice An array containing all maturities.
    uint256[] public maturities;

    address private endSignature;
    address private endToken;
    address private sEndToken;
    IBondNFT private bondNFT;
    IEnderTreasury private endTreasury;
    IEnderOracle private enderOracle;

    bool public bondFeeEnabled; // status of bond-fee feature (enabled/disabled)

    enum AddressType {
        TREASURY,
        ENDTOKEN,
        BONDNFT,
        SIGNATURE
    }

    struct Bond {
        bool withdrawn; // The withdrawn status of the bond
        uint256 principal; // The principal amount of the bond
        uint256 endAmt; // The END token amount of deposit
        uint256 startTime; // Timestamp of the bond
        uint256 maturity; // The maturity date of the bond
        address token; // The token used for the bond
        uint256 bondFee; // bond fee self-set
    }

    event AddressUpdated(address indexed addr, AddressType addrType);
    event Deposit(address indexed user, uint256 tokenId);
    event Withdraw(address indexed user, uint256 tokenId);
    event Collect(address indexed user, uint256 tokenId, uint256 refraction, uint256 nonce);
    event Rebond(address indexed user, uint256 tokenId, uint256 bondId);
    event BondableTokensUpdated(address[] indexed token, bool enabled);
    event BondFeeEnableDisabled(bool enabled);

    /**
     * @dev Initializes the contract
     * @param endToken_ The address of the END token
     * @param signature_ The valid signer address
     */
    function initialize(address endToken_, address signature_) public initializer {
        __Ownable_init();
        __EIP712_init("EnderBond", "1");
        rateOfChange = 100;
        setAddress(endToken_, AddressType.ENDTOKEN);
        setAddress(signature_, AddressType.SIGNATURE);
        setBondFeeEnabled(true);
    }

    /**
     * @notice Update the address
     * @param _addr  The address
     * @param _type  Type of updating address
     */
    function setAddress(address _addr, AddressType _type) public onlyOwner {
        if (_addr == address(0)) revert ZeroAddress();

        if (_type == AddressType.TREASURY) endTreasury = IEnderTreasury(_addr);
        else if (_type == AddressType.ENDTOKEN) endToken = _addr;
        else if (_type == AddressType.BONDNFT) bondNFT = IBondNFT(_addr);
        else if (_type == AddressType.SIGNATURE) endSignature = _addr;

        emit AddressUpdated(_addr, _type);
    }

    function getAddress(AddressType _type) external view returns (address addr) {
        if (_type == AddressType.TREASURY) addr = address(endTreasury);
        else if (_type == AddressType.ENDTOKEN) addr = endToken;
        else if (_type == AddressType.BONDNFT) addr = address(bondNFT);
        else if (_type == AddressType.SIGNATURE) addr = endSignature;
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
        if (principal == 0) revert InvalidAmount();
        if (maturity < 7 || maturity > 365) revert InvalidMaturity();
        if (token != address(0) && !bondableTokens[token]) revert NotBondableToken();
        if (bondFee < 0 || bondFee > 100) revert InvalidBondFee();
        if (!bondFeeEnabled && bondFee > 0 && bondFee <= 100) revert BondFeeDisabled();

        // token transfer
        if (token == address(0)) {
            if (msg.value != principal) revert InvalidAmount();

            // send directly to the ender treasury
            (bool success, ) = payable(address(endTreasury)).call{value: principal}("");
            if (!success) revert InvalidAmount();
        } else {
            // send directly to the ender treasury
            IERC20(token).transferFrom(msg.sender, address(endTreasury), principal);
        }

        tokenId = _deposit(principal, maturity, token, bondFee, false);
        userDeposit[tokenId] += principal;
        (uint256 pendingReward, uint256 avgRefractionIndex, ) = getPendingReward(principal, maturity, tokenId);
        pendingRefractionReward[tokenId] += pendingReward;
        rewardSharePerUser[tokenId] = rewardShare;
        totalDeposit += principal;
        totalRewardPriciple += principal * avgRefractionIndex;

        uint256 depositPrincipal = (getInterest(maturity) * principal) / 365;
        userBondPrincipalAmount[tokenId] = depositPrincipal;
        totalBondPrincipalAmount += depositPrincipal;
        emit Deposit(msg.sender, tokenId);
    }

    function _deposit(
        uint256 _principal,
        uint256 _maturity,
        address _token,
        uint256 _bondFee,
        bool _rebond
    ) private returns (uint256 _tokenId) {
        if (_rebond && _bondFee > 0) _principal = (_principal * (100 - _bondFee)) / 100;

        // deposit
        uint256 endAmt = endTreasury.deposit(
            _rebond,
            _maturity,
            _bondFee,
            IEnderBase.EndRequest(msg.sender, _token, _principal)
        );

        // mint bond nft
        _tokenId = bondNFT.mint(msg.sender);

        unchecked {
            _maturity = _maturity * 1 days;
        }

        // save bond info
        bonds[_tokenId] = Bond(false, _principal, endAmt, block.timestamp, _maturity, _token, _bondFee);
    }

    /**
     * @notice Private function for withdraw and withdraw request
     * @param _tokenId Bond nft tokenid
     * @param _maturity Value of new maturity
     */
    function _withdraw(uint256 _tokenId, uint256 _maturity, uint256 bondFee) private returns (uint256 tokenId) {
        Bond storage bond = bonds[_tokenId];

        if (bond.withdrawn) revert BondAlreadyWithdrawn();
        if (bondNFT.ownerOf(_tokenId) != msg.sender) revert NotBondUser();
        if (block.timestamp < bond.startTime + bond.maturity) revert BondNotMatured();

        // update current bond
        bond.withdrawn = true;

        if (_maturity == 0) {
            endTreasury.withdraw(
                IEnderBase.EndRequest(
                    msg.sender,
                    bond.token,
                    bond.bondFee > 0 && bondFeeEnabled ? (bond.principal * (100 - bond.bondFee)) / 100 : bond.principal
                )
            ); // is a rebond
            uint256 reward = getRewardAmount(_tokenId);
            endTreasury.mintEndRewToUser(msg.sender, reward);
        }
        // not a rebond
        else tokenId = _deposit(bond.principal, _maturity, bond.token, bondFee, true);
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
        _withdraw(tokenId, 0, 0);

        emit Withdraw(msg.sender, tokenId);
    }

    // function withdrawStakingRewards()

    /**
     * @notice Function to return the collectable amount
     * @param tokenId  Token id of BondNFT
     */
    function collectable(uint256 tokenId) public view returns (uint256 amount) {
        Bond storage bond = bonds[tokenId];

        unchecked {
            if (bond.startTime == 0) amount = 0;
            else if (bond.startTime + bond.maturity <= block.timestamp) amount = bond.endAmt;
            else {
                amount = (bond.endAmt * (block.timestamp - bond.startTime)) / bond.maturity;
            }
        }
    }

    function _validateRefraction(
        uint256 _amount,
        uint256 _nonce,
        uint256 _deadline,
        bytes calldata _signature
    ) private view returns (bool) {
        if (userNonces[msg.sender] >= _nonce) revert InvalidNonce();
        if (block.timestamp > _deadline) revert SignatureExpired();

        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    keccak256("Rebond(uint256 amount, uint256 deadline, uint256 nonce)"),
                    _amount,
                    _deadline,
                    _nonce
                )
            )
        );

        return ECDSAUpgradeable.recover(digest, _signature) == endSignature;
    }

    /**
     * @notice Function to collect the bond reward in END token
     * @param tokenId  Token id of BondNFT
     * @param refraction Collectable refraction fee amount
     * @param refraction User nonce
     * @param signature Signature hash
     */
    function collect(
        uint256 tokenId,
        uint256 refraction,
        uint256 deadline,
        uint256 nonce,
        bytes calldata signature
    ) external nonReentrant returns (uint256 collectAmt) {
        if (bondNFT.ownerOf(tokenId) != msg.sender) revert NotBondUser();

        // check refraction info
        _validateRefraction(refraction, nonce, deadline, signature);

        collectAmt = collectable(tokenId);
        if (collectAmt != 0) {
            // update user bond info
            unchecked {
                bonds[tokenId].endAmt -= collectAmt;

                // add refraction amount
                if (refraction != 0) collectAmt += refraction;

                userNonces[msg.sender] = nonce;
            }

            // token transfer
            endTreasury.collect(msg.sender, collectAmt);
        }

        emit Collect(msg.sender, tokenId, refraction, nonce);
    }

    /**
     * @notice Function to rebond
     * @param tokenId  Token id of BondNFT
     * @param maturity  New maturiy value
     */
    function rebond(uint256 tokenId, uint256 maturity, uint256 bondFee) external nonReentrant returns (uint256 bondId) {
        if (maturity < 7 || maturity > 365) revert InvalidMaturity();

        bondId = _withdraw(tokenId, maturity, bondFee);

        emit Rebond(msg.sender, tokenId, bondId);
    }

/**
 * @dev Sets the reward share for a given `_reward`.
 * @param _reward The reward to be added to the reward share.
 */
function setRewardShare(uint256 _reward) external {
    rewardShare = rewardShare + (_reward / totalRewardPriciple);
}

/**
 * @dev Sets the reward share for sending, based on `_reward` and `_totalPrinciple`.
 * @param _reward The reward to be added to the reward share.
 * @param _totalPrinciple The total principle used for calculating the reward share.
 */
function setRewardShareForSend(uint256 _reward, uint256 _totalPrinciple) public {
    rewardShareStaking = rewardShareStaking + (_reward / _totalPrinciple);
}

/**
 * @dev Calculates pending rewards and related information for a bond.
 * @param _principle The principle amount of the bond.
 * @param _maturity The maturity of the bond.
 * @param _tokenId The unique identifier of the bond.
 * @return pendingReward The pending reward for the bond.
 * @return avgRefractionIndex The average refraction index for the bond.
 * @return rewardPrinciple The principle amount used in reward calculations.
 */
function getPendingReward(
    uint _principle,
    uint256 _maturity,
    uint256 _tokenId
) public view returns (uint256 pendingReward, uint256 avgRefractionIndex, uint256 rewardPrinciple) {
    if (bondNFT.ownerOf(_tokenId) != msg.sender) revert NotBondUser();
    avgRefractionIndex = 1 + (rateOfChange * (_maturity - 1)) / 2;
    rewardPrinciple = _principle * avgRefractionIndex;
    pendingReward = rewardPrinciple * (rewardShare - rewardSharePerUser[_tokenId]);
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
function getPendingRewardSend(
    uint _principle,
    uint256 _maturity,
    uint256 _tokenId
) public view returns (uint256 pendingRewardSend, uint256 avgRefractionIndex, uint256 rewardPrincipleSend) {
    if (bondNFT.ownerOf(_tokenId) != msg.sender) revert NotBondUser();
    avgRefractionIndex = 1 + (rateOfChange * (_maturity - 1)) / 2;
    rewardPrincipleSend = _principle * avgRefractionIndex;
    pendingRewardSend = rewardPrincipleSend * (rewardPrincipleSend - rewardSharePerUserStaking[_tokenId]);
}

/**
 * @dev Claims rewards for staking based on a given `_tokenId`.
 * @param _tokenId The unique identifier of the bond.
 */
function claimRewardSend(uint256 _tokenId) public {
    if (bondNFT.ownerOf(_tokenId) != msg.sender) revert NotBondUser();
    Bond memory temp = bonds[_tokenId];

    (uint256 pendingReward, , uint rewardPrinciple) = getPendingRewardSend(temp.principal, temp.maturity, _tokenId);

    uint sEndTokenReward = pendingReward +
        (rewardPrinciple * (rewardShareStaking - rewardSharePerUserStaking[_tokenId]));

    if (sEndTokenReward > 0) {
        IERC20(endToken).transfer(msg.sender, sEndTokenReward);

        ISEndToken(sEndToken).burn(msg.sender, sEndTokenReward);
    }
}

/**
 * @dev Claims rewards for a bond based on a given `_tokenId`.
 * @param _tokenId The unique identifier of the bond.
 */
function claimRewards(uint256 _tokenId) public {
    if (bondNFT.ownerOf(_tokenId) != msg.sender) revert NotBondUser();
    Bond memory temp = bonds[_tokenId];

    (uint256 pendingReward, , uint rewardPrinciple) = getPendingReward(temp.principal, temp.maturity, _tokenId);

    IERC20(endToken).transfer(
        msg.sender,
        pendingReward + (rewardPrinciple * (rewardShare - rewardSharePerUser[_tokenId]))
    );
}

/**
 * @dev Gets and sets the ETH price and updates the bond yield share.
 */
function getAndSetETHPrice() external {
    (uint256 price, uint8 decimal) = enderOracle.getPrice(address(0));
    uint256 _endMint = price * totalBondPrincipalAmount * (1);
    endMint += _endMint;
    bondYeildShare = bondYeildShare + (endMint / totalBondPrincipalAmount);
}

/**
 * @dev Calculates the reward amount for a given `_tokenId`.
 * @param _tokenId The unique identifier of the bond.
 * @return _reward The reward amount for the bond.
 */
function getRewardAmount(uint256 _tokenId) public view returns (uint256 _reward) {
    _reward = userBondPrincipalAmount[_tokenId] * (bondYeildShare - userBondYieldShare[_tokenId]);
}


    receive() external payable {}
}
