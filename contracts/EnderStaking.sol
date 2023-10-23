// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./interfaces/IEndToken.sol";
import "./interfaces/IEnderTreasury.sol";
import "./interfaces/ISEndToken.sol";
import "./interfaces/IEnderBond.sol";

error ZeroAddress();
error InvalidAmount();

contract EnderStaking is Initializable, OwnableUpgradeable {
    mapping(address => UserInfo) public userInfo;
    mapping(address => uint256) public userSEndToken;

    struct UserInfo {
        uint256 amount;
        uint256 pending;
        uint256 lastBlock;
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
    event Stake(address indexed account, uint256 stakeAmt);
    event Harvest(address indexed account, uint256 harvestAmt);
    event Withdraw(address indexed account, uint256 withdrawAmt);

    function initialize(address _end, address _sEnd) external initializer {
        __Ownable_init();
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
    function pendingReward(address account) public view returns (uint256 pending) {
        UserInfo storage userItem = userInfo[account];

        pending = userItem.pending + ((block.number - userItem.lastBlock) * percentPerBlock * userItem.amount) / 1e9;
    }

    /**
     * @notice Users do stake
     * @param amount  stake amount
     */
    function stake(uint256 amount) external {
        if (amount == 0) revert InvalidAmount();

        // transfer tokens
        IERC20(endToken).transferFrom(msg.sender, address(this), amount);
        uint256 sEndAmount = calculateSEndTokens(amount);
        userSEndToken[msg.sender] += sEndAmount;

        ISEndToken(sEndToken).mint(address(this), sEndAmount);

        // update user info
        UserInfo storage userItem = userInfo[msg.sender];

        if (userItem.amount != 0) {
            // update pending
            userItem.pending += claimRebaseRewards();
        }

        userItem.amount += amount;
        userItem.lastBlock = block.number;

        emit Stake(msg.sender, amount);
    }

    /**
     * @notice Users can withdraw
     * @param amount  withdraw amount
     */
    function withdraw(uint256 amount) external {
        if (amount == 0) revert InvalidAmount();
        if (IERC20(sEndToken).balanceOf(msg.sender) > 0) revert InvalidAmount();

        UserInfo storage userItem = userInfo[msg.sender];
        if (amount > userItem.amount) amount = userItem.amount;

        // add reward
        uint256 pending = claimRebaseRewards();

        // update userinfo
        unchecked {
            if (amount == userItem.amount) delete userInfo[msg.sender];
            else {
                userItem.pending = 0;
                userItem.amount -= amount;
            }
        }

        // transfer token
        IERC20(endToken).transfer(msg.sender, amount + pending);

        emit Withdraw(msg.sender, amount);
    }

    /**
     * @notice Harvest only the rewards
     */
    // function harvest() external {
    //     uint256 pending = pendingReward(msg.sender);

    //     if (pending != 0) {
    //         // update userinfo
    //         unchecked {
    //             UserInfo storage userItem = userInfo[msg.sender];
    //             userItem.pending = 0;
    //             userItem.lastBlock = block.number;
    //         }

    //         // mint reward token to user
    //         IEndToken(endToken).mint(msg.sender, pending);

    //         emit Harvest(msg.sender, pending);
    //     }
    // }

    function getStakingReward(address _asset) external {
        uint256 totalReward = IEnderTreasury(enderTreasury).getStakingReward(_asset);
        uint256 rw2 = (totalReward * 10) / 100;

        uint256 sendTokens = calculateSEndTokens(rw2);
        IERC20(sEndToken).transfer(enderBond, sendTokens);
        IEnderBond(enderBond).updateRewardShareIndexForSend(sendTokens, IERC20(sEndToken).totalSupply());
    }

    function calculateSEndTokens(uint256 _endAmount) public view returns (uint256 sEndTokens) {
        uint256 rebasingIndex = calculateRebaseIndex();
        sEndTokens = _endAmount / rebasingIndex;
    }

    function calculateRebaseIndex() public view returns (uint256 rebasingIndex) {
        rebasingIndex = IERC20(endToken).balanceOf(address(this)) / IERC20(sEndToken).totalSupply();
    }

    function claimRebaseRewards() internal view returns (uint256 reward) {
        //TODO
        reward = IERC20(sEndToken).balanceOf(msg.sender) * calculateRebaseIndex();
    }

    //the epoc function
}
