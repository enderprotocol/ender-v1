// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../lido/ISTETH.sol";

contract lybra {
    struct UserData {
        uint256 amount;
        uint256 depositTime;
    }
    mapping(address => UserData) public userData;
    // mapping(address => uint256) public pendingRewards;
    address public stEth;
    uint256 public apy = 4000; //4%

    constructor(address _stEth) {
        stEth = _stEth;
    }

    function depositAssetToMint(uint256 _amount, address _user) public {
        IERC20(stEth).transferFrom(_user, address(this), _amount);
        userData[_user] = UserData(_amount, block.timestamp);
    }

    function withdraw() public {
        UserData memory userStakeData = userData[msg.sender];
        uint256 reward = (apy * userStakeData.amount * (block.timestamp - userStakeData.depositTime)) /
            (365 days * 100 * 1000);

        userData[msg.sender] = UserData(0, 0);
        IERC20(stEth).transfer(msg.sender, userStakeData.amount);
        IERC20(stEth).mint(msg.sender, reward);
    }
}
