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
    name: "ERC721EnumerableForbiddenBatchMint",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "ERC721IncorrectOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ERC721InsufficientApproval",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address",
      },
    ],
    name: "ERC721InvalidApprover",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "ERC721InvalidOperator",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "ERC721InvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "ERC721InvalidReceiver",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "ERC721InvalidSender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ERC721NonexistentToken",
    type: "error",
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
    name: "ERC721OutOfBoundsIndex",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidInitialization",
    type: "error",
  },
  {
    inputs: [],
    name: "NotBondContract",
    type: "error",
  },
  {
    inputs: [],
    name: "NotInitializing",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
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
        internalType: "uint64",
        name: "version",
        type: "uint64",
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
  "0x608060405234801561001057600080fd5b50611d4c806100206000396000f3fe608060405234801561001057600080fd5b50600436106101585760003560e01c806364c9ec6f116100c3578063a22cb4651161007c578063a22cb465146102f7578063b88d4fde1461030a578063c87b56dd1461031d578063e985e9c514610330578063f2fde38b14610343578063f399e22e1461035657600080fd5b806364c9ec6f1461027e5780636a6278421461029157806370a08231146102a4578063715018a6146102b75780638da5cb5b146102bf57806395d89b41146102ef57600080fd5b806323b872dd1161011557806323b872dd1461020c5780632f745c591461021f57806342842e0e146102325780634f6ccce71461024557806355f804b3146102585780636352211e1461026b57600080fd5b806301ffc9a71461015d57806306fdde0314610185578063081812fc1461019a578063095ea7b3146101c557806318160ddd146101da5780632340e030146101f9575b600080fd5b61017061016b366004611727565b610369565b60405190151581526020015b60405180910390f35b61018d610394565b60405161017c9190611794565b6101ad6101a83660046117a7565b610438565b6040516001600160a01b03909116815260200161017c565b6101d86101d33660046117dc565b61044d565b005b600080516020611cf7833981519152545b60405190815260200161017c565b6101d8610207366004611806565b61045c565b6101d861021a366004611821565b6104d5565b6101eb61022d3660046117dc565b610565565b6101d8610240366004611821565b6105d9565b6101eb6102533660046117a7565b6105f9565b6101d8610266366004611909565b610671565b6101ad6102793660046117a7565b6106c0565b6001546101ad906001600160a01b031681565b6101eb61029f366004611806565b6106cb565b6101eb6102b2366004611806565b610764565b6101d86107c0565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b03166101ad565b61018d6107d4565b6101d861030536600461193e565b610813565b6101d861031836600461197a565b61081e565b61018d61032b3660046117a7565b610835565b61017061033e3660046119f6565b61089d565b6101d8610351366004611806565b6108ea565b6101d8610364366004611a29565b610928565b60006001600160e01b0319821663780e9d6360e01b148061038e575061038e82610a9b565b92915050565b600080516020611cd783398151915280546060919081906103b490611a77565b80601f01602080910402602001604051908101604052809291908181526020018280546103e090611a77565b801561042d5780601f106104025761010080835404028352916020019161042d565b820191906000526020600020905b81548152906001019060200180831161041057829003601f168201915b505050505091505090565b600061044382610aeb565b5061038e82610b23565b610458828233610b5d565b5050565b610464610b6a565b6001600160a01b03811661048b5760405163d92e233d60e01b815260040160405180910390fd5b600180546001600160a01b0319166001600160a01b0383169081179091556040517f324d9307ec4fb98cc63ab3e3da008365135ea44fda913447fb68ff761db910f690600090a250565b6001600160a01b03821661050457604051633250574960e11b8152600060048201526024015b60405180910390fd5b6000610511838333610bc5565b9050836001600160a01b0316816001600160a01b03161461055f576040516364283d7b60e01b81526001600160a01b03808616600483015260248201849052821660448201526064016104fb565b50505050565b6000600080516020611cb783398151915261057f84610764565b83106105b05760405163295f44f760e21b81526001600160a01b0385166004820152602481018490526044016104fb565b6001600160a01b0384166000908152602091825260408082208583529092522054905092915050565b6105f48383836040518060200160405280600081525061081e565b505050565b6000600080516020611cb7833981519152610620600080516020611cf78339815191525490565b83106106495760405163295f44f760e21b815260006004820152602481018490526044016104fb565b80600201838154811061065e5761065e611ab1565b9060005260206000200154915050919050565b610679610b6a565b60026106858282611b15565b507f5411e8ebf1636d9e83d5fc4900bf80cbac82e8790da2a4c94db4895e889eedf6816040516106b59190611794565b60405180910390a150565b600061038e82610aeb565b6001546000906001600160a01b031633146106f9576040516394b99b5960e01b815260040160405180910390fd5b60008054908061070883611beb565b9190505550600054905061071c8282610cc6565b816001600160a01b03167f4cc0a9c4a99ddc700de1af2c9f916a7cbfdb71f14801ccff94061ad1ef8a80408260405161075791815260200190565b60405180910390a2919050565b6000600080516020611cd78339815191526001600160a01b03831661079f576040516322718ad960e21b8152600060048201526024016104fb565b6001600160a01b039092166000908152600390920160205250604090205490565b6107c8610b6a565b6107d26000610d2b565b565b7f80bb2b638cc20bc4d0a60d66940f3ab4a00c1d7b313497ca82fb0b4ab00793018054606091600080516020611cd7833981519152916103b490611a77565b610458338383610d9c565b6108298484846104d5565b61055f84848484610e4d565b606061084082610aeb565b50600061084b610f76565b9050600081511161086b5760405180602001604052806000815250610896565b8061087584611008565b604051602001610886929190611c04565b6040516020818303038152906040525b9392505050565b6001600160a01b0391821660009081527f80bb2b638cc20bc4d0a60d66940f3ab4a00c1d7b313497ca82fb0b4ab00793056020908152604080832093909416825291909152205460ff1690565b6108f2610b6a565b6001600160a01b03811661091c57604051631e4fbdf760e01b8152600060048201526024016104fb565b61092581610d2b565b50565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a008054600160401b810460ff16159067ffffffffffffffff1660008115801561096e5750825b905060008267ffffffffffffffff16600114801561098b5750303b155b905081158015610999575080155b156109b75760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff1916600117855583156109e157845460ff60401b1916600160401b1785555b6109ea3361109b565b610a3a6040518060400160405280600e81526020016d115b99195c88109bdb990813919560921b815250604051806040016040528060088152602001671153910b5093d39160c21b8152506110ac565b610a438761045c565b610a4c86610671565b8315610a9257845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b50505050505050565b60006001600160e01b031982166380ac58cd60e01b1480610acc57506001600160e01b03198216635b5e139f60e01b145b8061038e57506301ffc9a760e01b6001600160e01b031983161461038e565b600080610af7836110be565b90506001600160a01b03811661038e57604051637e27328960e01b8152600481018490526024016104fb565b60009081527f80bb2b638cc20bc4d0a60d66940f3ab4a00c1d7b313497ca82fb0b4ab007930460205260409020546001600160a01b031690565b6105f483838360016110f8565b33610b9c7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b031690565b6001600160a01b0316146107d25760405163118cdaa760e01b81523360048201526024016104fb565b600080610bd385858561120e565b90506001600160a01b038116610c5c57610c5784600080516020611cf7833981519152805460008381527f645e039705490088daad89bae25049a34f4a9072d398537b1ab2425f24cbed0360205260408120829055600182018355919091527fa42f15e5d656f8155fd7419d740a6073999f19cd6e061449ce4a257150545bf20155565b610c7f565b846001600160a01b0316816001600160a01b031614610c7f57610c7f8185611318565b6001600160a01b038516610c9b57610c96846113bc565b610cbe565b846001600160a01b0316816001600160a01b031614610cbe57610cbe8585611493565b949350505050565b6001600160a01b038216610cf057604051633250574960e11b8152600060048201526024016104fb565b6000610cfe83836000610bc5565b90506001600160a01b038116156105f4576040516339e3563760e11b8152600060048201526024016104fb565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c19930080546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b600080516020611cd78339815191526001600160a01b038316610ddd57604051630b61174360e31b81526001600160a01b03841660048201526024016104fb565b6001600160a01b038481166000818152600584016020908152604080832094881680845294825291829020805460ff191687151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a350505050565b6001600160a01b0383163b1561055f57604051630a85bd0160e11b81526001600160a01b0384169063150b7a0290610e8f903390889087908790600401611c33565b6020604051808303816000875af1925050508015610eca575060408051601f3d908101601f19168201909252610ec791810190611c70565b60015b610f33573d808015610ef8576040519150601f19603f3d011682016040523d82523d6000602084013e610efd565b606091505b508051600003610f2b57604051633250574960e11b81526001600160a01b03851660048201526024016104fb565b805181602001fd5b6001600160e01b03198116630a85bd0160e11b14610f6f57604051633250574960e11b81526001600160a01b03851660048201526024016104fb565b5050505050565b606060028054610f8590611a77565b80601f0160208091040260200160405190810160405280929190818152602001828054610fb190611a77565b8015610ffe5780601f10610fd357610100808354040283529160200191610ffe565b820191906000526020600020905b815481529060010190602001808311610fe157829003601f168201915b5050505050905090565b60606000611015836114ee565b600101905060008167ffffffffffffffff8111156110355761103561185d565b6040519080825280601f01601f19166020018201604052801561105f576020820181803683370190505b5090508181016020015b600019016f181899199a1a9b1b9c1cb0b131b232b360811b600a86061a8153600a850494508461106957509392505050565b6110a36115c6565b6109258161160f565b6110b46115c6565b6104588282611617565b60009081527f80bb2b638cc20bc4d0a60d66940f3ab4a00c1d7b313497ca82fb0b4ab007930260205260409020546001600160a01b031690565b600080516020611cd7833981519152818061111b57506001600160a01b03831615155b156111dd57600061112b85610aeb565b90506001600160a01b038416158015906111575750836001600160a01b0316816001600160a01b031614155b801561116a5750611168818561089d565b155b156111935760405163a9fbf51f60e01b81526001600160a01b03851660048201526024016104fb565b82156111db5784866001600160a01b0316826001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45b505b600093845260040160205250506040902080546001600160a01b0319166001600160a01b0392909216919091179055565b6000600080516020611cd783398151915281611229856110be565b90506001600160a01b0384161561124557611245818587611648565b6001600160a01b03811615611285576112626000866000806110f8565b6001600160a01b0381166000908152600383016020526040902080546000190190555b6001600160a01b038616156112b6576001600160a01b03861660009081526003830160205260409020805460010190555b600085815260028301602052604080822080546001600160a01b0319166001600160a01b038a811691821790925591518893918516917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a495945050505050565b600080516020611cb7833981519152600061133284610764565b6000848152600184016020526040902054909150808214611387576001600160a01b03851660009081526020848152604080832085845282528083205484845281842081905583526001860190915290208190555b50600092835260018201602090815260408085208590556001600160a01b039095168452918252838320908352905290812055565b600080516020611cf783398151915254600080516020611cb7833981519152906000906113eb90600190611c8d565b600084815260038401602052604081205460028501805493945090928490811061141757611417611ab1565b906000526020600020015490508084600201838154811061143a5761143a611ab1565b60009182526020808320909101929092558281526003860190915260408082208490558682528120556002840180548061147657611476611ca0565b600190038181906000526020600020016000905590555050505050565b600080516020611cb7833981519152600060016114af85610764565b6114b99190611c8d565b6001600160a01b0390941660009081526020838152604080832087845282528083208690559482526001909301909252502055565b60008072184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b831061152d5772184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b830492506040015b6d04ee2d6d415b85acef81000000008310611559576d04ee2d6d415b85acef8100000000830492506020015b662386f26fc10000831061157757662386f26fc10000830492506010015b6305f5e100831061158f576305f5e100830492506008015b61271083106115a357612710830492506004015b606483106115b5576064830492506002015b600a831061038e5760010192915050565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a0054600160401b900460ff166107d257604051631afcd79f60e31b815260040160405180910390fd5b6108f26115c6565b61161f6115c6565b600080516020611cd7833981519152806116398482611b15565b506001810161055f8382611b15565b6116538383836116ac565b6105f4576001600160a01b03831661168157604051637e27328960e01b8152600481018290526024016104fb565b60405163177e802f60e01b81526001600160a01b0383166004820152602481018290526044016104fb565b60006001600160a01b03831615801590610cbe5750826001600160a01b0316846001600160a01b031614806116e657506116e6848461089d565b80610cbe5750826001600160a01b03166116ff83610b23565b6001600160a01b031614949350505050565b6001600160e01b03198116811461092557600080fd5b60006020828403121561173957600080fd5b813561089681611711565b60005b8381101561175f578181015183820152602001611747565b50506000910152565b60008151808452611780816020860160208601611744565b601f01601f19169290920160200192915050565b6020815260006108966020830184611768565b6000602082840312156117b957600080fd5b5035919050565b80356001600160a01b03811681146117d757600080fd5b919050565b600080604083850312156117ef57600080fd5b6117f8836117c0565b946020939093013593505050565b60006020828403121561181857600080fd5b610896826117c0565b60008060006060848603121561183657600080fd5b61183f846117c0565b925061184d602085016117c0565b9150604084013590509250925092565b634e487b7160e01b600052604160045260246000fd5b600067ffffffffffffffff8084111561188e5761188e61185d565b604051601f8501601f19908116603f011681019082821181831017156118b6576118b661185d565b816040528093508581528686860111156118cf57600080fd5b858560208301376000602087830101525050509392505050565b600082601f8301126118fa57600080fd5b61089683833560208501611873565b60006020828403121561191b57600080fd5b813567ffffffffffffffff81111561193257600080fd5b610cbe848285016118e9565b6000806040838503121561195157600080fd5b61195a836117c0565b91506020830135801515811461196f57600080fd5b809150509250929050565b6000806000806080858703121561199057600080fd5b611999856117c0565b93506119a7602086016117c0565b925060408501359150606085013567ffffffffffffffff8111156119ca57600080fd5b8501601f810187136119db57600080fd5b6119ea87823560208401611873565b91505092959194509250565b60008060408385031215611a0957600080fd5b611a12836117c0565b9150611a20602084016117c0565b90509250929050565b60008060408385031215611a3c57600080fd5b611a45836117c0565b9150602083013567ffffffffffffffff811115611a6157600080fd5b611a6d858286016118e9565b9150509250929050565b600181811c90821680611a8b57607f821691505b602082108103611aab57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052603260045260246000fd5b601f8211156105f457600081815260208120601f850160051c81016020861015611aee5750805b601f850160051c820191505b81811015611b0d57828155600101611afa565b505050505050565b815167ffffffffffffffff811115611b2f57611b2f61185d565b611b4381611b3d8454611a77565b84611ac7565b602080601f831160018114611b785760008415611b605750858301515b600019600386901b1c1916600185901b178555611b0d565b600085815260208120601f198616915b82811015611ba757888601518255948401946001909101908401611b88565b5085821015611bc55787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b634e487b7160e01b600052601160045260246000fd5b600060018201611bfd57611bfd611bd5565b5060010190565b60008351611c16818460208801611744565b835190830190611c2a818360208801611744565b01949350505050565b6001600160a01b0385811682528416602082015260408101839052608060608201819052600090611c6690830184611768565b9695505050505050565b600060208284031215611c8257600080fd5b815161089681611711565b8181038181111561038e5761038e611bd5565b634e487b7160e01b600052603160045260246000fdfe645e039705490088daad89bae25049a34f4a9072d398537b1ab2425f24cbed0080bb2b638cc20bc4d0a60d66940f3ab4a00c1d7b313497ca82fb0b4ab0079300645e039705490088daad89bae25049a34f4a9072d398537b1ab2425f24cbed02a26469706673582212209d789fc4feacb4dc8d0589a7cdf0738470cc2832e8289248f85e9094106ba45e64736f6c63430008140033";

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
