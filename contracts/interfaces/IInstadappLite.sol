// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
interface IInstadappLite is IERC20{
    // function deposit(
    //     uint256 assets_,
    //     address receiver_
    // ) external returns (uint256 shares_);
    function deposit(uint256 _amount) external;   // note changed the function sig. for testing

    function withdrawStinstaTokens(uint256 assets_) external returns(uint256 _amount); // note changed the function sig. for testing

    function viewStinstaTokensValue(uint256 mstValue) external view returns (uint256); //provide the amount of stETH as per my share

    function viewStinstaTokens(uint256 stinstaAmount) external view returns (uint256);

}

//0xA0D3707c569ff8C87FA923d3823eC5D81c98Be78