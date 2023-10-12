// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./interfaces/IEndToken.sol";

error ZeroAddress();
error InvalidAmount();

contract EnderStaking is Initializable, OwnableUpgradeable {
    
    struct UserInfo {
        uint256 amount;
        uint256 pending;
        uint256 lastBlock;
    }

    mapping(address => UserInfo) public userInfo;
    uint256 public percentPerBlock;

    uint256 public stakingApy;

    uint256 private totalSEndBalance;
    uint256 private stakingReward;
    uint256 private rebseIndex = 1;

    address public endToken;

    event PercentUpdated(uint256 percent);
    event AddressUpdated(address indexed addr);
    event StakingApyUpdated(uint256 stakingApy);
    event Stake(address indexed account, uint256 stakeAmt);
    event Harvest(address indexed account, uint256 harvestAmt);
    event Withdraw(address indexed account, uint256 withdrawAmt);

    /**
     * @notice Initialize function
     * @param _end  address of END token contract
     */
    function initialize(address _end) external initializer {
        __Ownable_init();

        setAddress(_end);
    }

    /**
     * @notice Update the END token address
     * @param _addr The new address
     */
    function setAddress(address _addr) public onlyOwner {
        if (_addr == address(0)) revert ZeroAddress();

        endToken = _addr;

        emit AddressUpdated(_addr);
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
    function distribute(address account) public view returns (uint256 pending) {
        UserInfo storage userItem = userInfo[account];

        pending = userItem.amount * rebaseIndex;
    }

    /**
     * @notice Users do stake
     * @param amount  stake amount
     */
    function stake(uint256 amount) external {
        if (amount == 0) revert InvalidAmount();
        
        totalSEndBalance += amount;  
        rebase();

        // transfer tokens
        IERC20(endToken).transferFrom(msg.sender, address(this), amount);
        // update user info
        UserInfo storage userItem = userInfo[msg.sender];
        if (userItem.amount != 0) {
            // update pending
            userItem.pending = distribute(msg.sender);
        }

        userItem.amount += amount;
        userItem.lastBlock = block.number;

        emit Stake(msg.sender, amount);
    }

    /**
     * @notice Users can withdraw
     * @param amount  withdraw amount
     */
    function unstake(uint256 amount) external {
        if (amount == 0) revert InvalidAmount();
        totalSEndBalance -= amount;
        rebase();

        UserInfo storage userItem = userInfo[msg.sender];
        if (amount > userItem.amount) amount = userItem.amount;

        // add reward
        uint256 pending = distribute(msg.sender);

        // update userinfo
        unchecked {
            if (amount == userItem.amount) delete userInfo[msg.sender];
            else {
                userItem.pending = 0;
                userItem.amount -= amount;
            }
        }

        stakingReward -= pending;
        
        // mint reward token
        if (pending != 0) IEndToken(endToken).mint(address(this), pending);
        // transfer token
        IERC20(endToken).transfer(msg.sender, amount + pending);
        

        emit Withdraw(msg.sender, amount);
    }

    function rebase(uint256 _profit) public {
        stakingReward += _profit;
        rebaseIndex = (stakingReward + totalSEndBalance) / totalSEndBalance; 
    }
}
