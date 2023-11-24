// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "../interfaces/IEnderOracle.sol";

error InvalidParams();

contract EnderOracle is IEnderOracle, Initializable, OwnableUpgradeable {
    mapping(address => address) public priceFeed;

    event UpdateFeed(address[] tokens, address[] feeds);

    /**
     * @notice Initialize the contract and set the END token address
     */
    function initialize() external initializer {
        __Ownable_init();
    }

    function setFeeds(address[] calldata _tokens, address[] calldata _feeds) external onlyOwner {
        if (_tokens.length == 0 || _tokens.length != _feeds.length) revert InvalidParams();

        unchecked {
            for (uint8 i; i < _tokens.length; ++i) {
                priceFeed[_tokens[i]] = _feeds[i];
            }
        }

        emit UpdateFeed(_tokens, _feeds);
    }

    function getPrice(address token) external view returns (uint256 price, uint8 priceDecimal) {
        // if (priceFeed[token] == address(0)) return (0, 0);

        // unchecked {
        //     int256 _price = IPriceFeed(priceFeed[token]).latestAnswer();
        //     priceDecimal = IPriceFeed(priceFeed[token]).decimals();

        //     price = _price >= 0 ? uint256(_price) : 0;
        // }
        if (token == address(0)) {
            price = 170000000000; //$ is 8 decimal
            priceDecimal = 18;
        } else {
            price = 100000000; //$ is 8 decimal
            priceDecimal = 18;
        }
    }
}
