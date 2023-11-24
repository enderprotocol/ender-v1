// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title IBondNFT interface
 * @notice Interface for the BondNFT contract
 */
interface IBondNFT {
    function mint(address to) external returns (uint256 tokenId);

    function ownerOf(uint256 tokenId) external view returns (address);

    function transferFrom(address from, address to, uint256 tokenId) external;

    function burn(uint256 tokenId) external;
}
