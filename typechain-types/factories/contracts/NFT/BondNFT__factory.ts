/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type { BondNFT, BondNFTInterface } from "../../../contracts/NFT/BondNFT";

const _abi = [
  {
    inputs: [],
    name: "NotBondContract",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroAddress",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "newURI",
        type: "string",
      },
    ],
    name: "BaseURIChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newBond",
        type: "address",
      },
    ],
    name: "BondContractChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "NFTMinted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bond",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "bond_",
        type: "address",
      },
      {
        internalType: "string",
        name: "baseURI_",
        type: "string",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "mint",
    outputs: [
      {
        internalType: "uint256",
        name: "newTokenId",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "newURI_",
        type: "string",
      },
    ],
    name: "setBaseURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "bond_",
        type: "address",
      },
    ],
    name: "setBondContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenByIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b5061208d806100206000396000f3fe608060405234801561001057600080fd5b50600436106101585760003560e01c806364c9ec6f116100c3578063a22cb4651161007c578063a22cb465146102cb578063b88d4fde146102de578063c87b56dd146102f1578063e985e9c514610304578063f2fde38b14610340578063f399e22e1461035357600080fd5b806364c9ec6f146102715780636a6278421461028457806370a0823114610297578063715018a6146102aa5780638da5cb5b146102b257806395d89b41146102c357600080fd5b806323b872dd1161011557806323b872dd146101ff5780632f745c591461021257806342842e0e146102255780634f6ccce71461023857806355f804b31461024b5780636352211e1461025e57600080fd5b806301ffc9a71461015d57806306fdde0314610185578063081812fc1461019a578063095ea7b3146101c557806318160ddd146101da5780632340e030146101ec575b600080fd5b61017061016b366004611984565b610366565b60405190151581526020015b60405180910390f35b61018d610391565b60405161017c91906119f1565b6101ad6101a8366004611a04565b610423565b6040516001600160a01b03909116815260200161017c565b6101d86101d3366004611a39565b61044a565b005b6099545b60405190815260200161017c565b6101d86101fa366004611a63565b610564565b6101d861020d366004611a7e565b6105dd565b6101de610220366004611a39565b61060e565b6101d8610233366004611a7e565b6106a4565b6101de610246366004611a04565b6106bf565b6101d8610259366004611b66565b610752565b6101ad61026c366004611a04565b6107a1565b60fc546101ad906001600160a01b031681565b6101de610292366004611a63565b610801565b6101de6102a5366004611a63565b610893565b6101d8610919565b60c9546001600160a01b03166101ad565b61018d61092d565b6101d86102d9366004611b9b565b61093c565b6101d86102ec366004611bd7565b61094b565b61018d6102ff366004611a04565b610983565b610170610312366004611c53565b6001600160a01b039182166000908152606a6020908152604080832093909416825291909152205460ff1690565b6101d861034e366004611a63565b6109ea565b6101d8610361366004611c86565b610a63565b60006001600160e01b0319821663780e9d6360e01b148061038b575061038b82610bd7565b92915050565b6060606580546103a090611cd4565b80601f01602080910402602001604051908101604052809291908181526020018280546103cc90611cd4565b80156104195780601f106103ee57610100808354040283529160200191610419565b820191906000526020600020905b8154815290600101906020018083116103fc57829003601f168201915b5050505050905090565b600061042e82610c27565b506000908152606960205260409020546001600160a01b031690565b6000610455826107a1565b9050806001600160a01b0316836001600160a01b0316036104c75760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b60648201526084015b60405180910390fd5b336001600160a01b03821614806104e357506104e38133610312565b6105555760405162461bcd60e51b815260206004820152603d60248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60448201527f6b656e206f776e6572206f7220617070726f76656420666f7220616c6c00000060648201526084016104be565b61055f8383610c86565b505050565b61056c610cf4565b6001600160a01b0381166105935760405163d92e233d60e01b815260040160405180910390fd5b60fc80546001600160a01b0319166001600160a01b0383169081179091556040517f324d9307ec4fb98cc63ab3e3da008365135ea44fda913447fb68ff761db910f690600090a250565b6105e73382610d4e565b6106035760405162461bcd60e51b81526004016104be90611d0e565b61055f838383610dcd565b600061061983610893565b821061067b5760405162461bcd60e51b815260206004820152602b60248201527f455243373231456e756d657261626c653a206f776e657220696e646578206f7560448201526a74206f6620626f756e647360a81b60648201526084016104be565b506001600160a01b03919091166000908152609760209081526040808320938352929052205490565b61055f8383836040518060200160405280600081525061094b565b60006106ca60995490565b821061072d5760405162461bcd60e51b815260206004820152602c60248201527f455243373231456e756d657261626c653a20676c6f62616c20696e646578206f60448201526b7574206f6620626f756e647360a01b60648201526084016104be565b6099828154811061074057610740611d5b565b90600052602060002001549050919050565b61075a610cf4565b60fd6107668282611dbf565b507f5411e8ebf1636d9e83d5fc4900bf80cbac82e8790da2a4c94db4895e889eedf68160405161079691906119f1565b60405180910390a150565b6000818152606760205260408120546001600160a01b03168061038b5760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b60448201526064016104be565b60fc546000906001600160a01b0316331461082f576040516394b99b5960e01b815260040160405180910390fd5b61083d60fb80546001019055565b5060fb5461084b8282610e8f565b816001600160a01b03167f4cc0a9c4a99ddc700de1af2c9f916a7cbfdb71f14801ccff94061ad1ef8a80408260405161088691815260200190565b60405180910390a2919050565b60006001600160a01b0382166108fd5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a2061646472657373207a65726f206973206e6f7420612076616044820152683634b21037bbb732b960b91b60648201526084016104be565b506001600160a01b031660009081526068602052604090205490565b610921610cf4565b61092b6000611028565b565b6060606680546103a090611cd4565b61094733838361107a565b5050565b6109553383610d4e565b6109715760405162461bcd60e51b81526004016104be90611d0e565b61097d84848484611148565b50505050565b606061098e82610c27565b600061099861117b565b905060008151116109b857604051806020016040528060008152506109e3565b806109c28461118a565b6040516020016109d3929190611e7f565b6040516020818303038152906040525b9392505050565b6109f2610cf4565b6001600160a01b038116610a575760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016104be565b610a6081611028565b50565b600054610100900460ff1615808015610a835750600054600160ff909116105b80610a9d5750303b158015610a9d575060005460ff166001145b610b005760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b60648201526084016104be565b6000805460ff191660011790558015610b23576000805461ff0019166101001790555b610b2b61121d565b610b7b6040518060400160405280600e81526020016d115b99195c88109bdb990813919560921b815250604051806040016040528060088152602001671153910b5093d39160c21b81525061124c565b610b8483610564565b610b8d82610752565b801561055f576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a1505050565b60006001600160e01b031982166380ac58cd60e01b1480610c0857506001600160e01b03198216635b5e139f60e01b145b8061038b57506301ffc9a760e01b6001600160e01b031983161461038b565b6000818152606760205260409020546001600160a01b0316610a605760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b60448201526064016104be565b600081815260696020526040902080546001600160a01b0319166001600160a01b0384169081179091558190610cbb826107a1565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b60c9546001600160a01b0316331461092b5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016104be565b600080610d5a836107a1565b9050806001600160a01b0316846001600160a01b03161480610da157506001600160a01b038082166000908152606a602090815260408083209388168352929052205460ff165b80610dc55750836001600160a01b0316610dba84610423565b6001600160a01b0316145b949350505050565b6001600160a01b03831615801590610ded57506001600160a01b03821615155b15610e8457610e256040518060400160405280600f81526020016e027333a103a3930b739b332b91d169608d1b81525084848461127d565b60fc54604051631c1202fb60e11b8152600481018390526001600160a01b039091169063382405f690602401600060405180830381600087803b158015610e6b57600080fd5b505af1158015610e7f573d6000803e3d6000fd5b505050505b61055f8383836112c6565b6001600160a01b038216610ee55760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f206164647265737360448201526064016104be565b6000818152606760205260409020546001600160a01b031615610f4a5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e7465640000000060448201526064016104be565b610f58600083836001611437565b6000818152606760205260409020546001600160a01b031615610fbd5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e7465640000000060448201526064016104be565b6001600160a01b038216600081815260686020908152604080832080546001019055848352606790915280822080546001600160a01b0319168417905551839291907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b60c980546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b816001600160a01b0316836001600160a01b0316036110db5760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c65720000000000000060448201526064016104be565b6001600160a01b038381166000818152606a6020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b611153848484610dcd565b61115f8484848461156b565b61097d5760405162461bcd60e51b81526004016104be90611eae565b606060fd80546103a090611cd4565b606060006111978361166c565b600101905060008167ffffffffffffffff8111156111b7576111b7611aba565b6040519080825280601f01601f1916602001820160405280156111e1576020820181803683370190505b5090508181016020015b600019016f181899199a1a9b1b9c1cb0b131b232b360811b600a86061a8153600a85049450846111eb57509392505050565b600054610100900460ff166112445760405162461bcd60e51b81526004016104be90611f00565b61092b611744565b600054610100900460ff166112735760405162461bcd60e51b81526004016104be90611f00565b6109478282611774565b61097d848484846040516024016112979493929190611f4b565b60408051601f198184030181529190526020810180516001600160e01b0316638ef3f39960e01b1790526117b4565b826001600160a01b03166112d9826107a1565b6001600160a01b0316146112ff5760405162461bcd60e51b81526004016104be90611f81565b6001600160a01b0382166113615760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b60648201526084016104be565b61136e8383836001611437565b826001600160a01b0316611381826107a1565b6001600160a01b0316146113a75760405162461bcd60e51b81526004016104be90611f81565b600081815260696020908152604080832080546001600160a01b03199081169091556001600160a01b0387811680865260688552838620805460001901905590871680865283862080546001019055868652606790945282852080549092168417909155905184937fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b60018111156114a65760405162461bcd60e51b815260206004820152603560248201527f455243373231456e756d657261626c653a20636f6e7365637574697665207472604482015274185b9cd9995c9cc81b9bdd081cdd5c1c1bdc9d1959605a1b60648201526084016104be565b816001600160a01b038516611502576114fd81609980546000838152609a60205260408120829055600182018355919091527f72a152ddfb8e864297c917af52ea6c1c68aead0fee1a62673fcc7e0c94979d000155565b611525565b836001600160a01b0316856001600160a01b0316146115255761152585826117bd565b6001600160a01b0384166115415761153c8161185a565b611564565b846001600160a01b0316846001600160a01b031614611564576115648482611909565b5050505050565b60006001600160a01b0384163b1561166157604051630a85bd0160e11b81526001600160a01b0385169063150b7a02906115af903390899088908890600401611fc6565b6020604051808303816000875af19250505080156115ea575060408051601f3d908101601f191682019092526115e791810190612003565b60015b611647573d808015611618576040519150601f19603f3d011682016040523d82523d6000602084013e61161d565b606091505b50805160000361163f5760405162461bcd60e51b81526004016104be90611eae565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050610dc5565b506001949350505050565b60008072184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b83106116ab5772184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b830492506040015b6d04ee2d6d415b85acef810000000083106116d7576d04ee2d6d415b85acef8100000000830492506020015b662386f26fc1000083106116f557662386f26fc10000830492506010015b6305f5e100831061170d576305f5e100830492506008015b612710831061172157612710830492506004015b60648310611733576064830492506002015b600a831061038b5760010192915050565b600054610100900460ff1661176b5760405162461bcd60e51b81526004016104be90611f00565b61092b33611028565b600054610100900460ff1661179b5760405162461bcd60e51b81526004016104be90611f00565b60656117a78382611dbf565b50606661055f8282611dbf565b610a608161194d565b600060016117ca84610893565b6117d49190612020565b600083815260986020526040902054909150808214611827576001600160a01b03841660009081526097602090815260408083208584528252808320548484528184208190558352609890915290208190555b5060009182526098602090815260408084208490556001600160a01b039094168352609781528383209183525290812055565b60995460009061186c90600190612020565b6000838152609a60205260408120546099805493945090928490811061189457611894611d5b565b9060005260206000200154905080609983815481106118b5576118b5611d5b565b6000918252602080832090910192909255828152609a909152604080822084905585825281205560998054806118ed576118ed612041565b6001900381819060005260206000200160009055905550505050565b600061191483610893565b6001600160a01b039093166000908152609760209081526040808320868452825280832085905593825260989052919091209190915550565b60006a636f6e736f6c652e6c6f679050600080835160208501845afa505050565b6001600160e01b031981168114610a6057600080fd5b60006020828403121561199657600080fd5b81356109e38161196e565b60005b838110156119bc5781810151838201526020016119a4565b50506000910152565b600081518084526119dd8160208601602086016119a1565b601f01601f19169290920160200192915050565b6020815260006109e360208301846119c5565b600060208284031215611a1657600080fd5b5035919050565b80356001600160a01b0381168114611a3457600080fd5b919050565b60008060408385031215611a4c57600080fd5b611a5583611a1d565b946020939093013593505050565b600060208284031215611a7557600080fd5b6109e382611a1d565b600080600060608486031215611a9357600080fd5b611a9c84611a1d565b9250611aaa60208501611a1d565b9150604084013590509250925092565b634e487b7160e01b600052604160045260246000fd5b600067ffffffffffffffff80841115611aeb57611aeb611aba565b604051601f8501601f19908116603f01168101908282118183101715611b1357611b13611aba565b81604052809350858152868686011115611b2c57600080fd5b858560208301376000602087830101525050509392505050565b600082601f830112611b5757600080fd5b6109e383833560208501611ad0565b600060208284031215611b7857600080fd5b813567ffffffffffffffff811115611b8f57600080fd5b610dc584828501611b46565b60008060408385031215611bae57600080fd5b611bb783611a1d565b915060208301358015158114611bcc57600080fd5b809150509250929050565b60008060008060808587031215611bed57600080fd5b611bf685611a1d565b9350611c0460208601611a1d565b925060408501359150606085013567ffffffffffffffff811115611c2757600080fd5b8501601f81018713611c3857600080fd5b611c4787823560208401611ad0565b91505092959194509250565b60008060408385031215611c6657600080fd5b611c6f83611a1d565b9150611c7d60208401611a1d565b90509250929050565b60008060408385031215611c9957600080fd5b611ca283611a1d565b9150602083013567ffffffffffffffff811115611cbe57600080fd5b611cca85828601611b46565b9150509250929050565b600181811c90821680611ce857607f821691505b602082108103611d0857634e487b7160e01b600052602260045260246000fd5b50919050565b6020808252602d908201527f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560408201526c1c881bdc88185c1c1c9bdd9959609a1b606082015260800190565b634e487b7160e01b600052603260045260246000fd5b601f82111561055f57600081815260208120601f850160051c81016020861015611d985750805b601f850160051c820191505b81811015611db757828155600101611da4565b505050505050565b815167ffffffffffffffff811115611dd957611dd9611aba565b611ded81611de78454611cd4565b84611d71565b602080601f831160018114611e225760008415611e0a5750858301515b600019600386901b1c1916600185901b178555611db7565b600085815260208120601f198616915b82811015611e5157888601518255948401946001909101908401611e32565b5085821015611e6f5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60008351611e918184602088016119a1565b835190830190611ea58183602088016119a1565b01949350505050565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b608081526000611f5e60808301876119c5565b6001600160a01b0395861660208401529390941660408201526060015292915050565b60208082526025908201527f4552433732313a207472616e736665722066726f6d20696e636f72726563742060408201526437bbb732b960d91b606082015260800190565b6001600160a01b0385811682528416602082015260408101839052608060608201819052600090611ff9908301846119c5565b9695505050505050565b60006020828403121561201557600080fd5b81516109e38161196e565b8181038181111561038b57634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052603160045260246000fdfea2646970667358221220b0ff26978224355d50eb739f30c04db7f6e33a97e1499b2c658724ffe5393e2764736f6c63430008120033";

type BondNFTConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: BondNFTConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class BondNFT__factory extends ContractFactory {
  constructor(...args: BondNFTConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      BondNFT & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): BondNFT__factory {
    return super.connect(runner) as BondNFT__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BondNFTInterface {
    return new Interface(_abi) as BondNFTInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): BondNFT {
    return new Contract(address, _abi, runner) as unknown as BondNFT;
  }
}
