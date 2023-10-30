// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// import "@openzeppelin/contracts/token/ERC20/ISEndToken.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./interfaces/IEndToken.sol";
import "./interfaces/ISEndToken.sol";
import "./interfaces/IEnderTreasury.sol";
import "./interfaces/ISEndToken.sol";
import "./interfaces/IEnderBond.sol";
import "hardhat/console.sol";

error ZeroAddress();
error InvalidAmount();

contract EnderStaking is Initializable, OwnableUpgradeable {
    mapping(address => UserInfo) public userInfo;
    mapping(address => uint256) public userSEndToken;

    struct UserInfo {
        uint256 amount;
        uint256 stakedAt;
    }

    uint256 public percentPerBlock;

    uint256 public stakingApy;
    address public endToken;
    address public sEndToken;
    address public enderTreasury;
    address public enderBond;

    event PercentUpdated(uint256 percent);
    event AddressUpdated(address indexed addr, uint256 addrType);
    event StakingApyUpdated(uint256 stakingApy);
    event Stake(address indexed account, uint256 stakeAmt, uint256 reward);
    event Harvest(address indexed account, uint256 harvestAmt);
    event Withdraw(address indexed account, uint256 withdrawAmt);

    function initialize(address _end, address _sEnd) external initializer {
        __Ownable_init();
        // setAddress(_enderBond, 1);
        // setAddress(_enderTreasury, 2);
        setAddress(_end, 3);
        setAddress(_sEnd, 4);
    }

    function setAddress(address _addr, uint256 _type) public onlyOwner {
        if (_addr == address(0)) revert ZeroAddress();

        if (_type == 1) enderBond = _addr;
        else if (_type == 2) enderTreasury = _addr;
        else if (_type == 3) endToken = _addr;
        else if (_type == 4) sEndToken = _addr;

        emit AddressUpdated(_addr, _type);
    }

    /**
     * @notice Update reward per block
     * @param percent New reward percent per block
     */
    function setReward(uint256 percent) external onlyOwner {
        if (percent == 0) revert InvalidAmount();

        percentPerBlock = percent;

        emit PercentUpdated(percentPerBlock);
    }

    /**
     * @notice Update staking APY
     * @param _stakingApy Staking APY which is set manually for now
     */
    function setStakingApy(uint256 _stakingApy) external onlyOwner {
        if (_stakingApy == 0) revert InvalidAmount();

        stakingApy = _stakingApy;

        emit StakingApyUpdated(_stakingApy);
    }

    /**
     * @notice View function to get pending reward
     * @param account  user wallet address
     */
    // function pendingReward(address account) public view returns (uint256 pending) {
    //     UserInfo storage userItem = userInfo[account];

    //     pending = userItem.pending + ((block.number - userItem.lastBlock) * percentPerBlock * userItem.amount) / 1e9;
    // }

    /**
     * @notice Users do stake
     * @param amount  stake amount
     */
    function stake(uint256 amount) external {
        if (amount == 0) revert InvalidAmount();

        // transfer tokens

        // update user info
        UserInfo storage userItem = userInfo[msg.sender];
        uint256 sEndAmount = calculateSEndTokens(amount + userItem.amount);
        console.log("sEndAmount", sEndAmount);
        uint256 pendingRew;

        if (userItem.amount != 0) {
            // update pending
            pendingRew = claimRebaseRewards(userItem.amount);
            console.log("pendingRew", pendingRew);
        }

        userSEndToken[msg.sender] += sEndAmount;
        userItem.amount += amount + pendingRew;
        userItem.stakedAt = block.timestamp;

        ISEndToken(endToken).transferFrom(msg.sender, address(this), amount);
        ISEndToken(sEndToken).mint(msg.sender, sEndAmount);
        emit Stake(msg.sender, amount, pendingRew);
    }

    /**
     * @notice Users can withdraw
     * @param amount  withdraw amount
     */
    function withdraw(uint256 amount) external {
        if (amount == 0) revert InvalidAmount();
        if (ISEndToken(sEndToken).balanceOf(msg.sender) < 0) revert InvalidAmount();
        UserInfo storage userItem = userInfo[msg.sender];
        if (amount > userItem.amount) amount = userItem.amount;

        // add reward
        uint256 pending = claimRebaseRewards(amount);

        // update userinfo
        unchecked {
            if (amount == userItem.amount) delete userInfo[msg.sender];
            else {
                // userItem.pending = 0;
                userItem.amount -= amount;
            }
        }
        userSEndToken[msg.sender] -= amount;
        // transfer token
        console.log("pending",pending);
        ISEndToken(sEndToken).burn(msg.sender, amount);
        ISEndToken(endToken).transfer(msg.sender, pending);

        emit Withdraw(msg.sender, amount);
    }

    function getStakingReward(address _asset) external {
        uint256 totalReward = IEnderTreasury(enderTreasury).getStakingReward(_asset);
        uint256 rw2 = (totalReward * 10) / 100;

        uint256 sendTokens = calculateSEndTokens(rw2);
        ISEndToken(sEndToken).transfer(enderBond, sendTokens);
        IEnderBond(enderBond).updateRewardShareIndexForSend(sendTokens, ISEndToken(sEndToken).totalSupply());
    }

    function calculateSEndTokens(uint256 _endAmount) public view returns (uint256 sEndTokens) {
        uint256 rebasingIndex = calculateRebaseIndex();
        console.log("rebasingIndex----------------", rebasingIndex);
        sEndTokens = _endAmount / rebasingIndex;
        console.log("sEndTokens", sEndTokens);
    }

    function calculateRebaseIndex() public view returns (uint256 rebasingIndex) {
        uint256 endBalStaking = ISEndToken(endToken).balanceOf(address(this));
        uint256 sEndTotalSupply = ISEndToken(sEndToken).totalSupply();
        console.log(endBalStaking, sEndTotalSupply);
        if (endBalStaking == 0 || sEndTotalSupply == 0) {
            rebasingIndex = 1;
        } else {
            rebasingIndex = ISEndToken(endToken).balanceOf(address(this)) / ISEndToken(sEndToken).totalSupply();
        }
    }

    function claimRebaseRewards(uint256 _sendAMount) internal view returns (uint256 reward) {
        //TODO
        console.log("userSEndToken[msg.sender]", userSEndToken[msg.sender]);
        if (_sendAMount > userSEndToken[msg.sender]) {
            reward = userSEndToken[msg.sender] * calculateRebaseIndex();
        }else{
            reward = _sendAMount * calculateRebaseIndex();

        }
    }
}
