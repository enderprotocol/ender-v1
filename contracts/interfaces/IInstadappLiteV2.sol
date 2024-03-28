// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IInstadappLite {
    /**
     * @dev See {IERC4626-deposit}.
     * @dev User function to deposit.
     * @param assets_ amount to supply.
     * @param receiver_ address to send iTokens to.
     * @return shares_ amount of iTokens sent to the `receiver_` address passed
    */
    function deposit(
        uint256 assets_,
        address receiver_
    ) external returns (uint256 shares_);

    /**
     * @dev See {IERC4626-withdraw}.
     * @dev User function to withdraw.
     * @param assets_ amount to withdraw.
     * @param receiver_ address to send withdrawn amount to.
     * @param owner_ address of owner whose shares will be burned.
     * @return shares_ amount of iTokens burned of owner.
    */
    function withdraw(
        uint256 assets_,
        address receiver_,
        address owner_
    ) external returns (uint256 shares_);

    function convertToShares(uint256 assets) external view returns (uint256 shares);

    function convertToAssets(uint256 shares) external view returns (uint256 assets);
}

//0xA0D3707c569ff8C87FA923d3823eC5D81c98Be78
