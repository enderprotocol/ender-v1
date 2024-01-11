// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IEnderBond {
    function calculateBondRewardAmount(uint256 _tokenId) external returns (uint256 _reward);

    function endMint() external returns (uint256 _endMint);

    function epochRewardShareIndexForSend(uint256 _reward) external;

    function epochRewardShareIndex(uint256 _reward) external;

    function deductFeesFromTransfer(uint256 _tokenId) external;

    function getLoopCount() external returns (uint256 amountRequired);

    function resetEndMint() external;

    function setAvailableBondFee(uint amount) external;

    function availableBondFee() external view returns(uint256);

}
