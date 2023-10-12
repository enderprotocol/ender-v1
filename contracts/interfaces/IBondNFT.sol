// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IBondNFT interface
 * @notice Interface for the BondNFT contract
 */
interface IBondNFT {
    function mint(address to) external returns (uint256 tokenId);

    function ownerOf(uint256 tokenId) external view returns(address);
}
