// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../interfaces/IEnderStrategy.sol";

error ZeroAddress();
error NotRequested();
error AlreadyRequested();
error NotTreasury();

abstract contract BaseStrategy is IEnderStrategy, Initializable, OwnableUpgradeable {
    address public treasury;
    address public strategy;

    event AddressUpdated(address indexed newAddr, AddressTypeBase addrType);

    modifier onlyTreasury() {
        if (msg.sender != treasury) revert NotTreasury();
        _;
    }

    enum AddressTypeBase {
        ENDTREASURY,
        STRATEGY
    }

    /**
     * @notice Initialize the contract and set the END token address
     */
    function initialize(address _treasury, address _strategy) external initializer {
        __Ownable_init();

        setAddressBase(_strategy, AddressTypeBase.STRATEGY);
        setAddressBase(_treasury, AddressTypeBase.ENDTREASURY);
    }

    /**
     * @notice Update the address
     * @param _addr The new address
     * @param _type  Address type
     */
    function setAddressBase(address _addr, AddressTypeBase _type) public onlyOwner {
        if (_addr == address(0)) revert ZeroAddress();

        if (_type == AddressTypeBase.ENDTREASURY) treasury = _addr;
        else strategy = _addr;

        emit AddressUpdated(_addr, _type);
    }

    function checkDeposit(address, uint256) external view virtual returns (bool) {
        return true;
    }

    function hasRequest() external pure virtual returns (bool) {
        return false;
    }

    receive() external payable virtual {}
}
