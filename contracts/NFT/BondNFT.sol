// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Openzeppelin
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

error ZeroAddress();
error NotBondContract();

/**
 * @title BondNFT
 * @dev An NFT contract for bonds.
 */
contract BondNFT is ERC721EnumerableUpgradeable, OwnableUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private _tokenIdsCounter;

    /**
     * @dev The address of the Bond contract.
     */
    address public bond;

    /**
     * @dev base URI for bond NFT
     */
    string private uri;

    /**
     * @dev Emitted when the Bond contract address is changed.
     */
    event BondContractChanged(address indexed newBond);

    modifier onlyBond() {
        if (msg.sender != bond) {
            revert NotBondContract();
        }
        _;
    }

    /**
     * @notice Initializes the contract.
     * @dev Sets the name and the symbol of the token and the Bond contract address.
     * @param bond_ The address of the Bond contract.
     * @param baseURI_ Base Uri for bond NFT
     */
    function initialize(address bond_, string memory baseURI_) public initializer {
        __Ownable_init();
        __ERC721_init("Ender Bond NFT", "END-BOND");

        setBondContract(bond_);
        setBaseURI(baseURI_);
    }

    /**
     * @notice Mints a new token.
     * @dev Only the Bond contract can mint tokens.
     * @param to The address that will receive the minted token.
     * @return newTokenId The token ID of the minted token.
     */
    function mint(address to) external onlyBond returns (uint256 newTokenId) {
        _tokenIdsCounter.increment();
        newTokenId = _tokenIdsCounter.current();

        _mint(to, newTokenId);
    }

    /**
     * @notice Sets the base URI.
     * @dev Only the contract owner can set the base URI.
     * @param newURI_ The new base URI
     */
    function setBaseURI(string memory newURI_) public onlyOwner {
        uri = newURI_;
    }

    /**
     * @notice Sets the Bond contract address.
     * @dev Only the contract owner can set the Bond contract address.
     * @param bond_ The new Bond contract address.
     */
    function setBondContract(address bond_) public onlyOwner {
        if (bond_ == address(0)) revert ZeroAddress();

        bond = bond_;

        emit BondContractChanged(bond_);
    }

    // The following functions are overrides required by Solidity.
    function _baseURI() internal view override returns (string memory) {
        return uri;
    }
}
