// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../BaseStrategy.sol";

interface IStrategy {
    function maxTotalDeposits() external view returns (uint256);
}

interface IStrategyManager {
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

contract EnderELStrategy is BaseStrategy {
    uint256 private constant strategyIndex = 0;

    IStrategy public tokenStrategy;

    mapping(address => uint96) private userNonce;
    mapping(address => uint32) private queueBlock;

    /**
     * @notice Get user pending queue
     * @param account Address of user wallet
     */
    function getQueueBlock(address account) external view returns (uint32) {
        return queueBlock[account];
    }

    /**
     * @notice Set EL token strategy
     * @param _str address of strategy
     */
    function setTokenStrategy(address _str) external onlyOwner {
        if (_str == address(0)) revert ZeroAddress();
        tokenStrategy = IStrategy(_str);
    }

    /**
     * @notice Function for deposit
     * @param param deposit parameters
     */
    function deposit(EndRequest memory param) public onlyTreasury returns (uint256) {
        // approve token first
        IERC20(param.stakingToken).approve(strategy, param.tokenAmt);

        // deposit to strategy
        return
            IStrategyManager(strategy).depositIntoStrategy(tokenStrategy, IERC20(param.stakingToken), param.tokenAmt);
    }

    /**
     * @notice Function for withdraw request
     * @param param withdraw request parameters
     */
    function withdrawRequest(EndRequest memory param) external onlyTreasury {
        if (queueBlock[param.account] != 0) revert AlreadyRequested();

        unchecked {
            uint256[] memory strs = new uint256[](1);
            strs[0] = strategyIndex;

            uint256[] memory amts = new uint256[](1);
            amts[0] = param.tokenAmt;

            IStrategy[] memory addrs = new IStrategy[](1);
            addrs[0] = tokenStrategy;

            // queueWithdrawal
            IStrategyManager(strategy).queueWithdrawal(strs, addrs, amts, address(this), false);

            queueBlock[param.account] = uint32(block.number);
        }
    }

    /**
     * @notice Function for withdraw
     * @param param withdraw parameters
     */
    function withdrawStEth(EndRequest memory param) external onlyTreasury returns (uint256) {
        if (queueBlock[param.account] == 0) revert NotRequested();

        IStrategyManager.WithdrawerAndNonce memory param1 = IStrategyManager.WithdrawerAndNonce(
            address(this),
            userNonce[param.account]
        );

        IStrategy[] memory strs = new IStrategy[](1);
        strs[0] = tokenStrategy;

        uint256[] memory amts = new uint256[](1);
        amts[0] = param.tokenAmt;

        IStrategyManager.QueuedWithdrawal memory param2 = IStrategyManager.QueuedWithdrawal(
            strs,
            amts,
            address(this),
            param1,
            queueBlock[param.account],
            address(0)
        );

        IERC20[] memory tokens = new IERC20[](1);
        tokens[0] = IERC20(param.stakingToken);

        uint256 tokenAmt = IERC20(param.stakingToken).balanceOf(address(this));
        IStrategyManager(strategy).completeQueuedWithdrawal(param2, tokens, 0, true);

        unchecked {
            tokenAmt = IERC20(param.stakingToken).balanceOf(address(this)) - tokenAmt;

            delete queueBlock[param.account];
            ++userNonce[param.account];
        }

        // transfer token to treasury
        IERC20(param.stakingToken).transfer(treasury, tokenAmt);

        return tokenAmt;
    }

    /**
     * @notice Function to check depositable
     * @param depositToken Address of deposit token
     * @param depositAmt deposit token amount
     */
    function checkDeposit(address depositToken, uint256 depositAmt) external view override returns (bool depositable) {
        uint256 depositLimit = tokenStrategy.maxTotalDeposits();
        uint256 currentDeposit = IERC20(depositToken).balanceOf(address(tokenStrategy));

        depositable = currentDeposit + depositAmt > depositLimit;
    }

    function hasRequest() external pure override returns (bool) {
        return true;
    }
}
