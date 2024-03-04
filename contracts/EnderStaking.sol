// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol";
import "./interfaces/ISEndToken.sol";
import "./interfaces/IEnderTreasury.sol";
import "./interfaces/ISEndToken.sol";
import "./interfaces/IEnderBond.sol";
import "hardhat/console.sol";

error ZeroAddress();
error InvalidAmount();
error NotAllowed();
error NotWhitelisted();

contract EnderStaking is Initializable, EIP712Upgradeable, OwnableUpgradeable {
    string private constant SIGNING_DOMAIN = "stakingContract";
    string private constant SIGNATURE_VERSION = "1";
    uint256 public bondRewardPercentage;
    uint256 public rebasingIndex;  
    uint256 public rebaseRefractionReward;
    uint256 public lastRebaseReward;
    address public signer;
    address public endToken;
    address public sEndToken;
    address public enderTreasury;
    address public enderBond;
    address public stEth;
    bool public isWhitelisted;
    bool public stakingEnable;  // status of staking-pause feature (enabled/disabled)
    bool public unstakeEnable;  // status of unstake-pause feature (enabled/disabled)
    bool public stakingContractPause; // status of stakingContract-pause feature (enabled/disabled)

    struct signData {
        address user;
        string key;
        bytes signature;
    }

    event AddressUpdated(address indexed addr, uint256 indexed addrType);
    event PercentUpdated(uint256 percent);
    event stakingEnableSet(bool indexed isEnable);
    event unstakeEnableSet(bool indexed isEnable);
    event stakingContractPauseSet(bool indexed isEnable);
    event Stake(address indexed staker, uint256 amount);
    event unStake(address indexed withdrawer, uint256 amount);
    event EpochStakingReward(address indexed asset, uint256 totalReward, uint256 rebaseRefractionReward, uint256 sendTokens);
    event WhitelistChanged(bool indexed action);
    event newSigner(address _signer);
  
    function initialize(address _end, address _sEnd, address _stEth, address _signer) external initializer {
        __Ownable_init();
        __EIP712_init(SIGNING_DOMAIN, SIGNATURE_VERSION);
        signer = _signer;
        stakingEnable = true; // for testing purpose
        unstakeEnable = true;   // for testing purpose
        stakingContractPause = true; // for testing purpose
        isWhitelisted = false; // for testing purpose
        setAddress(_end, 3);
        setAddress(_sEnd, 4);
        setAddress(_stEth, 5);
        bondRewardPercentage = 10;
    }

    modifier stakingEnabled() {
        if (stakingEnable != true) revert NotAllowed();
        _;
    }

    modifier unstakeEnabled() {
        if (unstakeEnable != true) revert NotAllowed();
        _;
    }

    modifier stakingContractPaused() {
        if (stakingContractPause != true) revert NotAllowed();
        _; 
    }

    function setStakingEnable(bool _enable) external onlyOwner{
        stakingEnable = _enable;
        emit stakingEnableSet(_enable);
    }

    function setUnstakeEnable(bool _enable) external onlyOwner{
        unstakeEnable = _enable;
        emit unstakeEnableSet(_enable);
    }

    function setStakingPause(bool _enable) external onlyOwner{
        stakingContractPause = _enable;
        emit stakingContractPauseSet(_enable);
    }

    function setsigner(address _signer) external onlyOwner {
        if (_signer == address(0)) revert ZeroAddress();
        signer = _signer;
        emit newSigner(signer);
    }

    function setAddress(address _addr, uint256 _type) public onlyOwner {
        if (_addr == address(0)) revert ZeroAddress();

        if (_type == 1) enderBond = _addr;
        else if (_type == 2) enderTreasury = _addr;
        else if (_type == 3) endToken = _addr;
        else if (_type == 4) sEndToken = _addr;
        else if (_type == 5) stEth = _addr;

         emit AddressUpdated(_addr, _type);

       
    }

    function setBondRewardPercentage(uint256 percent) external onlyOwner {
        if (percent == 0) revert InvalidAmount();

        bondRewardPercentage = percent;
          emit PercentUpdated(bondRewardPercentage);

        
    }

    function whitelist(bool _action) external onlyOwner{
        isWhitelisted = _action;
        emit WhitelistChanged(_action);
    }

    /**
     * @notice Users do stake
     * @param amount  stake amount
     */
    function stake(uint256 amount, signData memory userSign) external stakingEnabled stakingContractPaused{
        // console.log("Inside Stake");
        if (amount == 0) revert InvalidAmount();
        if(isWhitelisted){
            address signAddress = _verify(userSign);
            if(signAddress != signer || userSign.user != msg.sender) revert NotWhitelisted();
        }
        console.log("\nEnd token deposit:- ", amount);
        if(ISEndToken(endToken).balanceOf(address(this)) == 0){
            uint256 sEndAmount = calculateSEndTokens(amount);
            console.log("\nReceipt token:- ", sEndAmount);
            ISEndToken(sEndToken).mint(msg.sender, sEndAmount);
            ISEndToken(endToken).transferFrom(msg.sender, address(this), amount);
            calculateRebaseIndex();
        } else {
            // epochStakingReward(stEth);
            ISEndToken(endToken).transferFrom(msg.sender, address(this), amount);          
            uint256 sEndAmount = calculateSEndTokens(amount);
            console.log("Receipt token:- ", sEndAmount);
            ISEndToken(sEndToken).mint(msg.sender, sEndAmount);
        }
        emit Stake(msg.sender, amount);
    }

    /**
     * @notice Users can unstake
     * @param amount  unstake amount
     */
    function unstake(uint256 amount) external unstakeEnabled stakingContractPaused{
        if (amount == 0) revert InvalidAmount();
        if (ISEndToken(sEndToken).balanceOf(msg.sender) < amount) revert InvalidAmount();
        // add reward
        // epochStakingReward(stEth);
        uint256 reward = claimRebaseValue(amount);
        console.log("\nWithraw amount of staking contract:- ", reward);
        // transfer token
        ISEndToken(endToken).transfer(msg.sender, reward);
        ISEndToken(sEndToken).burn(msg.sender, amount);
        emit unStake(msg.sender, amount);
     
    }

    // Here in the asset we are adding stEth
    function epochStakingReward(address _asset) public  {
        if(_asset != stEth) revert NotAllowed();
        uint256 totalReward = IEnderTreasury(enderTreasury).stakeRebasingReward(_asset);
        lastRebaseReward = totalReward;

        // console.log("Rebasereward", totalReward);
        if(totalReward > 0) {
        // console.log("tytyutyuuugyugu",totalReward);
            rebaseRefractionReward = (totalReward * bondRewardPercentage) / 100;
            uint256 sendTokens = calculateSEndTokens(rebaseRefractionReward);
            console.log("Rebase reward for bond holder's:- ", sendTokens);
            IEnderBond(enderBond).epochRewardShareIndexForSend(sendTokens);
            ISEndToken(sEndToken).mint(enderBond, sendTokens);
            ISEndToken(endToken).mint(address(this), totalReward);
            emit EpochStakingReward(_asset, totalReward, rebaseRefractionReward, sendTokens);  
        }
        calculateRebaseIndex();
    }

    function calculateSEndTokens(uint256 _endAmount) public view returns (uint256 sEndTokens) {
        if (rebasingIndex == 0) {
            sEndTokens = _endAmount;
            return sEndTokens;
        } else{
            sEndTokens = (_endAmount * 1e18/ rebasingIndex); 
            return sEndTokens; 
        }
    }

    function calculateRebaseIndex() internal {
        uint256 endBalStaking = ISEndToken(endToken).balanceOf(address(this));
        uint256 sEndTotalSupply = ISEndToken(sEndToken).totalSupply();
        if (endBalStaking == 0 || sEndTotalSupply == 0) {
            rebasingIndex = 1e18;
        } else {
            rebasingIndex = endBalStaking * 1e18/ sEndTotalSupply;
        }
    }

    function claimRebaseValue(uint256 _sendAmount) internal view returns (uint256 reward) {
        console.log("rebasingIndex:- ", rebasingIndex);

        reward = (_sendAmount * rebasingIndex) / 1e18;
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
}
