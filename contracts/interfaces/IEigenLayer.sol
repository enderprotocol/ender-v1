// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IEigenLayer {
    struct WithdrawerAndNonce {
        address withdrawer;
        uint96 nonce;
    }

    struct QueuedWithdrawal {
        IStrategy[] strategies;
        uint256[] shares;
        address depositor;
        WithdrawerAndNonce withdrawerAndNonce;
        uint32 withdrawalStartBlock;
        address delegatedAddress;
    }

    function depositIntoStrategy(IStrategy strategy, IERC20 token, uint256 amount) external returns (uint256 shares);

    function queueWithdrawal(
        uint256[] calldata strategyIndexes,
        IStrategy[] calldata strategies,
        uint256[] calldata shares,
        address withdrawer,
        bool undelegateIfPossible
    ) external returns (bytes32);

    function completeQueuedWithdrawal(
        QueuedWithdrawal calldata queuedWithdrawal,
        IERC20[] calldata tokens,
        uint256 middlewareTimesIndex,
        bool receiveAsTokens
    ) external;
}