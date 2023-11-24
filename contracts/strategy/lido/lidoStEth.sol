// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../lido/ISTETH.sol";
import "./ISTETH.sol";

contract lidoStaking {
    address public stEth;
    mapping(address => uint256) public userDeposit;

    constructor(address _stEth) {
        stEth = _stEth;
    }

    function submit() public payable {
        IERC20(stEth).mint(msg.sender, msg.value);
    }

    function withdraw(uint256 _amount) public {
        (bool suc, ) = payable(msg.sender).call{value: _amount}("");
        require(suc,"Eth tx failed");
    }
}
