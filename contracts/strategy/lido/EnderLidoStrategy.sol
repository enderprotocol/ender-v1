// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.18;

// import "../BaseStrategy.sol";

// interface IStrategy {
//     function submit(address _referral) external payable returns (uint256);

//     function requestWithdrawals(
//         uint256[] calldata _amounts,
//         address _owner
//     ) external returns (uint256[] memory requestIds);

//     function claimWithdrawal(uint256 _requestId) external;

//     function getApproved(uint256) external view returns (address);
// }

// contract EnderLidoStrategy is BaseStrategy {
//     address public withdrawStrategy;

//     mapping(address => uint256) private requestIds;

//     function setWithdrawStr(address _strategy) external onlyOwner {
//         if (_strategy == address(0)) revert ZeroAddress();

//         withdrawStrategy = _strategy;
//     }

//     function deposit(EndRequest memory param) external onlyTreasury returns (uint256 tokenAmt) {
//         tokenAmt = IERC20(strategy).balanceOf(address(this));

//         IStrategy(strategy).submit{value: param.tokenAmt}(treasury);

//         unchecked {
//             tokenAmt = IERC20(strategy).balanceOf(address(this)) - tokenAmt;
//         }
//     }

//     function withdrawRequest(EndRequest memory param) external onlyTreasury {
//         if (requestIds[param.account] != 0) revert AlreadyRequested();

//         IERC20(strategy).approve(withdrawStrategy, param.tokenAmt);

//         uint256[] memory amts = new uint256[](1);
//         amts[0] = param.tokenAmt;
//         uint256[] memory ids = IStrategy(withdrawStrategy).requestWithdrawals(amts, address(this));

//         requestIds[param.account] = ids[0];
//     }

//     function withdraw(EndRequest memory param) external onlyTreasury returns (uint256 ethAmt) {
//         if (requestIds[param.account] == 0) revert NotRequested();

//         ethAmt = address(this).balance;

//         IStrategy(withdrawStrategy).claimWithdrawal(requestIds[param.account]);

//         unchecked {
//             ethAmt = address(this).balance - ethAmt;
//         }

//         // transer eth
//         payable(treasury).transfer(ethAmt);
//     }

//     function onERC721Received(address, address, uint256, bytes memory) external pure returns (bytes4) {
//         return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
//     }

//     function hasRequest() external pure override returns (bool) {
//         return true;
//     }
// }
