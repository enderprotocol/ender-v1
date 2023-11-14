// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./interfaces/ISEndToken.sol";
import "./interfaces/IEnderTreasury.sol";
import "./interfaces/ISEndToken.sol";
import "./interfaces/IEnderBond.sol";
import "hardhat/console.sol";

error ZeroAddress();
error InvalidAmount();
error NotKeeper();

contract EnderStaking is Initializable, OwnableUpgradeable {
    uint public bondRewardPercentage;
    uint public rebasingIndex;

    address public endToken;
    address public sEndToken;
    address public enderTreasury;
    address public enderBond;
    address public keeper;
    address public stEth;

    event PercentUpdated(uint256 percent);
    event AddressUpdated(address indexed addr, uint256 addrType);
    event Stake(address indexed account, uint256 stakeAmt);
    event Withdraw(address indexed account, uint256 withdrawAmt);

    function initialize(address _end, address _sEnd) external initializer {
        __Ownable_init();
        // setAddress(_enderBond, 1);
        // setAddress(_enderTreasury, 2);
        setAddress(_end, 3);
        setAddress(_sEnd, 4);
        bondRewardPercentage = 10;
    }

    function setAddress(address _addr, uint256 _type) public onlyOwner {
        if (_addr == address(0)) revert ZeroAddress();

        if (_type == 1) enderBond = _addr;
        else if (_type == 2) enderTreasury = _addr;
        else if (_type == 3) endToken = _addr;
        else if (_type == 4) sEndToken = _addr;
        else if (_type == 5) keeper = _addr;
        else if (_type == 6) stEth = _addr;

        emit AddressUpdated(_addr, _type);
    }

    function setBondRewardPercentage(uint256 percent) external onlyOwner {
        if (percent == 0) revert InvalidAmount();

        bondRewardPercentage = percent;

        emit PercentUpdated(bondRewardPercentage);
    }

    /**
     * @notice Users do stake
     * @param amount  stake amount
     */
    function stake(uint256 amount) external {
        if (amount == 0) revert InvalidAmount();
        epochStakingReward(stEth);

        uint256 sEndAmount = calculateSEndTokens(amount);
        console.log("sEndAmount", sEndAmount);

        ISEndToken(sEndToken).mint(msg.sender, sEndAmount);
        emit Stake(msg.sender, amount);
    }

    /**
     * @notice Users can withdraw
     * @param amount  withdraw amount
     */
    function withdraw(uint256 amount) external {
        if (amount == 0) revert InvalidAmount();
        if (ISEndToken(sEndToken).balanceOf(msg.sender) < amount) revert InvalidAmount();
        epochStakingReward(stEth);
        // add reward
        uint256 reward = claimRebaseValue(amount);

        // transfer token
        console.log("pending", reward);
        ISEndToken(sEndToken).burn(msg.sender, amount);
        ISEndToken(endToken).transfer(msg.sender, reward);

        emit Withdraw(msg.sender, amount);
    }

    function epochStakingReward(address _asset) public {
        // if (msg.sender != keeper) revert NotKeeper();
        uint256 totalReward = IEnderTreasury(enderTreasury).stakeRebasingReward(_asset);
        uint256 rw2 = (totalReward * bondRewardPercentage) / 100;
        console.log(rw2, "rw2---");

        uint256 sendTokens = calculateSEndTokens(rw2);
        ISEndToken(sEndToken).mint(enderBond, sendTokens);
        ISEndToken(endToken).mint(address(this), totalReward - rw2);
        IEnderBond(enderBond).epochRewardShareIndexForSend(sendTokens);
        calculateRebaseIndex();
    }

    function calculateSEndTokens(uint256 _endAmount) public view returns (uint256 sEndTokens) {
        console.log("rebasingIndex----------------", rebasingIndex);
        if (rebasingIndex == 0) {
            sEndTokens = _endAmount;
        }else{
          sEndTokens = (_endAmount * 1e18 / rebasingIndex);  
        }
        console.log("sEndTokens", sEndTokens);
    }

    function calculateRebaseIndex() internal {
        uint256 endBalStaking = ISEndToken(endToken).balanceOf(address(this));
        uint256 sEndTotalSupply = ISEndToken(sEndToken).totalSupply();
        console.log(endBalStaking, sEndTotalSupply);
        if (endBalStaking == 0 || sEndTotalSupply == 0) {
            rebasingIndex = 1;
        } else {
            rebasingIndex = (endBalStaking * 10 ** 18) / sEndTotalSupply;
        }
    }

    function claimRebaseValue(uint256 _sendAMount) internal view returns (uint256 reward) {
        reward = (_sendAMount * rebasingIndex) / 10 ** 18;
    }
}
