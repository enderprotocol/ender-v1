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
import type { NonPayableOverrides } from "../../common";
import type {
  EnderStaking,
  EnderStakingInterface,
} from "../../contracts/EnderStaking";

const _abi = [
  {
    inputs: [],
    name: "InvalidAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "NotAllowed",
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
        name: "addr",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "addrType",
        type: "uint256",
      },
    ],
    name: "AddressUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "EIP712DomainChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalReward",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "rw2",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "sendTokens",
        type: "uint256",
      },
    ],
    name: "EpochStakingReward",
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
        indexed: false,
        internalType: "uint256",
        name: "percent",
        type: "uint256",
      },
    ],
    name: "PercentUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "staker",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Stake",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bool",
        name: "action",
        type: "bool",
      },
    ],
    name: "WhitelistChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_signer",
        type: "address",
      },
    ],
    name: "newSigner",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bool",
        name: "isEnable",
        type: "bool",
      },
    ],
    name: "stakingContractPauseSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bool",
        name: "isEnable",
        type: "bool",
      },
    ],
    name: "stakingEnableSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "withdrawer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "unStake",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bool",
        name: "isEnable",
        type: "bool",
      },
    ],
    name: "unstakeEnableSet",
    type: "event",
  },
  {
    inputs: [],
    name: "bondRewardPercentage",
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
        name: "_endAmount",
        type: "uint256",
      },
    ],
    name: "calculateSEndTokens",
    outputs: [
      {
        internalType: "uint256",
        name: "sEndTokens",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "eip712Domain",
    outputs: [
      {
        internalType: "bytes1",
        name: "fields",
        type: "bytes1",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "version",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "verifyingContract",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
      {
        internalType: "uint256[]",
        name: "extensions",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "endToken",
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
    name: "enderBond",
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
    name: "enderTreasury",
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
        name: "_asset",
        type: "address",
      },
    ],
    name: "epochStakingReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_end",
        type: "address",
      },
      {
        internalType: "address",
        name: "_sEnd",
        type: "address",
      },
      {
        internalType: "address",
        name: "_signer",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "isWhitelisted",
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
    name: "keeper",
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
    inputs: [],
    name: "rebasingIndex",
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "sEndToken",
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
        name: "_addr",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_type",
        type: "uint256",
      },
    ],
    name: "setAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "percent",
        type: "uint256",
      },
    ],
    name: "setBondRewardPercentage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_enable",
        type: "bool",
      },
    ],
    name: "setStakingEnable",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_enable",
        type: "bool",
      },
    ],
    name: "setStakingPause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_enable",
        type: "bool",
      },
    ],
    name: "setUnstakeEnable",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_signer",
        type: "address",
      },
    ],
    name: "setsigner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "signer",
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
    name: "stEth",
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
        name: "amount",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "string",
            name: "key",
            type: "string",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
        ],
        internalType: "struct EnderStaking.signData",
        name: "userSign",
        type: "tuple",
      },
    ],
    name: "stake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "stakingContractPause",
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
    name: "stakingEnable",
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
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "unstake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unstakeEnable",
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
        internalType: "bool",
        name: "_action",
        type: "bool",
      },
    ],
    name: "whitelist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50612060806100206000396000f3fe608060405234801561001057600080fd5b50600436106101cf5760003560e01c80635d7fbcb511610104578063aced1661116100a2578063c0c53b8b11610071578063c0c53b8b146103d6578063d8811d13146103e9578063e29cf50c146103fc578063f2fde38b1461041057600080fd5b8063aced166114610394578063adb3791c146103a7578063b8c0a3a1146103b0578063bf4afb1e146103c357600080fd5b8063715018a6116100de578063715018a61461034d57806384b0196e146103555780638da5cb5b1461037057806399940ece1461038157600080fd5b80635d7fbcb514610313578063611b40951461032657806370db69021461033a57600080fd5b806330d616f411610171578063426697cf1161014b578063426697cf146102b557806353cd4c3f146102c8578063596e92f2146102ec5780635d427a9a146102ff57600080fd5b806330d616f41461028657806336163b041461029957806338642973146102a257600080fd5b80631ff28376116101ad5780631ff283761461022c578063238ac9331461023f5780632bc19cf6146102525780632e17de781461027357600080fd5b806303360eb4146101d45780630b19b1a6146101e957806317bb32e3146101fc575b600080fd5b6101e76101e2366004611b69565b610423565b005b6101e76101f7366004611b86565b610474565b609d5461020f906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b6101e761023a366004611c6b565b6104d9565b609b5461020f906001600160a01b031681565b610265610260366004611b86565b610945565b604051908152602001610223565b6101e7610281366004611b86565b61096d565b6101e7610294366004611b69565b610bc7565b61026560995481565b6101e76102b0366004611d44565b610c18565b609f5461020f906001600160a01b031681565b60a1546102dc90600160a81b900460ff1681565b6040519015158152602001610223565b6101e76102fa366004611b69565b610cbc565b60a1546102dc90600160b01b900460ff1681565b609e5461020f906001600160a01b031681565b60a1546102dc90600160a01b900460ff1681565b6101e7610348366004611d5f565b610d0d565b6101e7610e62565b61035d610e76565b6040516102239796959493929190611dcf565b6067546001600160a01b031661020f565b60a15461020f906001600160a01b031681565b60a05461020f906001600160a01b031681565b610265609a5481565b6101e76103be366004611d44565b610f14565b609c5461020f906001600160a01b031681565b6101e76103e4366004611e65565b611158565b6101e76103f7366004611b69565b6112a2565b60a1546102dc90600160b81b900460ff1681565b6101e761041e366004611d44565b6112f3565b61042b61136c565b60a1805460ff60b81b1916600160b81b831515908102919091179091556040517f2958f77a8b908490871750adee8b93fa8d29451e5da363d7666e0f4c31b7222d90600090a250565b61047c61136c565b8060000361049d5760405163162908e360e11b815260040160405180910390fd5b60998190556040518181527fe0e6a36f218809ddf2501604b5999d92df38d34801ea531c19ef6105292bc074906020015b60405180910390a150565b60a154600160a81b900460ff16151560011461050857604051631eb49d6d60e11b815260040160405180910390fd5b60a154600160b81b900460ff16151560011461053757604051631eb49d6d60e11b815260040160405180910390fd5b816000036105585760405163162908e360e11b815260040160405180910390fd5b60a154600160a01b900460ff16156105f1576000610575826113c6565b609b549091506001600160a01b03808316911614801561059e575081516001600160a01b031633145b6105ef5760405162461bcd60e51b815260206004820152601760248201527f75736572206973206e6f742077686974656c697374656400000000000000000060448201526064015b60405180910390fd5b505b61062760405180604001604052806015815260200173522b732103a37b5b2b7103232b837b9b4ba1d169605d1b815250836113e9565b609c546040516370a0823160e01b81523060048201526001600160a01b03909116906370a0823190602401602060405180830381865afa15801561066f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106939190611ea8565b6000036107d45760a1546106af906001600160a01b0316610f14565b609c546040516323b872dd60e01b8152336004820152306024820152604481018490526001600160a01b03909116906323b872dd906064016020604051808303816000875af1158015610706573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061072a9190611ec1565b50600061073683610945565b905061076a6040518060400160405280601081526020016f02932b1b2b4b83a103a37b5b2b71d16960851b815250826113e9565b609d546040516340c10f1960e01b8152336004820152602481018390526001600160a01b03909116906340c10f1990604401600060405180830381600087803b1580156107b657600080fd5b505af11580156107ca573d6000803e3d6000fd5b505050505061090b565b609c546040516323b872dd60e01b8152336004820152306024820152604481018490526001600160a01b03909116906323b872dd906064016020604051808303816000875af115801561082b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061084f9190611ec1565b50600061085b83610945565b905061088f6040518060400160405280601081526020016f02932b1b2b4b83a103a37b5b2b71d16960851b815250826113e9565b609d546040516340c10f1960e01b8152336004820152602481018390526001600160a01b03909116906340c10f1990604401600060405180830381600087803b1580156108db57600080fd5b505af11580156108ef573d6000803e3d6000fd5b505060a15461090992506001600160a01b03169050610f14565b505b60405182815233907febedb8b3c678666e7f36970bc8f57abf6d8fa2e828c0da91ea5b75bf68ed101a906020015b60405180910390a25050565b6000609a54600003610955575090565b609a546109629083611ede565b92915050565b919050565b60a154600160b01b900460ff16151560011461099c57604051631eb49d6d60e11b815260040160405180910390fd5b60a154600160b81b900460ff1615156001146109cb57604051631eb49d6d60e11b815260040160405180910390fd5b806000036109ec5760405163162908e360e11b815260040160405180910390fd5b609d546040516370a0823160e01b815233600482015282916001600160a01b0316906370a0823190602401602060405180830381865afa158015610a34573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a589190611ea8565b1015610a775760405163162908e360e11b815260040160405180910390fd5b60a154610a8c906001600160a01b0316610f14565b6000610a9782611432565b9050610abb604051806060016040528060268152602001611fe360269139826113e9565b609c5460405163a9059cbb60e01b8152336004820152602481018390526001600160a01b039091169063a9059cbb906044016020604051808303816000875af1158015610b0c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b309190611ec1565b50609d54604051632770a7eb60e21b8152336004820152602481018490526001600160a01b0390911690639dc29fac90604401600060405180830381600087803b158015610b7d57600080fd5b505af1158015610b91573d6000803e3d6000fd5b50506040518481523392507fd93938149a1a7de7095bbc9fa7876d68376ae614031ae2687afe592d8aa69dcc9150602001610939565b610bcf61136c565b60a1805460ff60a81b1916600160a81b831515908102919091179091556040517f9077ec5e7e7955871b0e449054065ef86ffa98dca861c1f0ddaf73d47008a79090600090a250565b610c2061136c565b6001600160a01b038116610c6e5760405162461bcd60e51b8152602060048201526015602482015274416464726573732063616e2774206265207a65726f60581b60448201526064016105e6565b609b80546001600160a01b0319166001600160a01b0383169081179091556040519081527f3dc2a8437aef0e8d2839b5e75d0d93e6c7f43b3acf5d2ef2db79beb54cb47b3d906020016104ce565b610cc461136c565b60a1805460ff60b01b1916600160b01b831515908102919091179091556040517fd3902a813e75c5b85ae16a1e5087a50a1e2b60bf88bcbbca4b3d38df3301cef990600090a250565b610d1561136c565b6001600160a01b038216610d3c5760405163d92e233d60e01b815260040160405180910390fd5b80600103610d6457609f80546001600160a01b0319166001600160a01b038416179055610e28565b80600203610d8c57609e80546001600160a01b0319166001600160a01b038416179055610e28565b80600303610db457609c80546001600160a01b0319166001600160a01b038416179055610e28565b80600403610ddc57609d80546001600160a01b0319166001600160a01b038416179055610e28565b80600503610e045760a080546001600160a01b0319166001600160a01b038416179055610e28565b80600603610e285760a180546001600160a01b0319166001600160a01b0384161790555b60405181906001600160a01b038416907f95306b5a2fd59205b962127979145cbea114f061c770ddb77ec4b9a8c41738e290600090a35050565b610e6a61136c565b610e746000611489565b565b6000606080600080600060606001546000801b148015610e965750600254155b610eda5760405162461bcd60e51b81526020600482015260156024820152741152540dcc4c8e88155b9a5b9a5d1a585b1a5e9959605a1b60448201526064016105e6565b610ee26114db565b610eea61156d565b60408051600080825260208201909252600f60f81b9b939a50919850469750309650945092509050565b609e5460405163b224d54360e01b81526001600160a01b038381166004830152600092169063b224d543906024016020604051808303816000875af1158015610f61573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f859190611ea8565b90506000606460995483610f999190611f00565b610fa39190611ede565b9050610fc760405180606001604052806022815260200161200960229139826113e9565b6000610fd282610945565b609d54609f546040516340c10f1960e01b81526001600160a01b0391821660048201526024810184905292935016906340c10f1990604401600060405180830381600087803b15801561102457600080fd5b505af1158015611038573d6000803e3d6000fd5b5050609c546040516340c10f1960e01b8152306004820152602481018790526001600160a01b0390911692506340c10f199150604401600060405180830381600087803b15801561108857600080fd5b505af115801561109c573d6000803e3d6000fd5b5050609f54604051630325c1f360e51b8152600481018590526001600160a01b0390911692506364b83e609150602401600060405180830381600087803b1580156110e657600080fd5b505af11580156110fa573d6000803e3d6000fd5b5050505061110661157c565b60408051848152602081018490529081018290526001600160a01b038516907fe0387ec6ca591cf1cae66c61621f7596433cfa12ee784533f7a332da3ef5671c9060600160405180910390a250505050565b600054610100900460ff16158080156111785750600054600160ff909116105b806111925750303b158015611192575060005460ff166001145b6111f55760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b60648201526084016105e6565b6000805460ff191660011790558015611218576000805461ff0019166101001790555b6112206116a3565b609b80546001600160a01b0319166001600160a01b038416179055611246846003610d0d565b611251836004610d0d565b600a609955801561129c576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b50505050565b6112aa61136c565b60a1805460ff60a01b1916600160a01b831515908102919091179091556040517f0d50ffb8142306f44502939eeb37f97727c319ac3cd8ec196ca88f3338eca9af90600090a250565b6112fb61136c565b6001600160a01b0381166113605760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016105e6565b61136981611489565b50565b6067546001600160a01b03163314610e745760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016105e6565b6000806113d2836116d2565b90506113e2818460400151611750565b9392505050565b61142e82826040516024016113ff929190611f25565b60408051601f198184030181529190526020810180516001600160e01b0316632d839cb360e21b179052611774565b5050565b60006114686040518060400160405280601081526020016f03932b130b9b4b733a4b73232bc1d16960851b815250609a546113e9565b678ac7230489e80000609a548361147f9190611f00565b6109629190611ede565b606780546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6060600380546114ea90611f47565b80601f016020809104026020016040519081016040528092919081815260200182805461151690611f47565b80156115635780601f1061153857610100808354040283529160200191611563565b820191906000526020600020905b81548152906001019060200180831161154657829003601f168201915b5050505050905090565b6060600480546114ea90611f47565b609c546040516370a0823160e01b81523060048201526000916001600160a01b0316906370a0823190602401602060405180830381865afa1580156115c5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115e99190611ea8565b90506000609d60009054906101000a90046001600160a01b03166001600160a01b03166318160ddd6040518163ffffffff1660e01b8152600401602060405180830381865afa158015611640573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906116649190611ea8565b9050811580611671575080155b1561167f576001609a555050565b8061169283678ac7230489e80000611f00565b61169c9190611ede565b609a555050565b600054610100900460ff166116ca5760405162461bcd60e51b81526004016105e690611f81565b610e7461177d565b60006109627f76bb474a7a9de6f07f692a2e39e53c610f28bd5be9be96837a6a274de34716708360000151846020015180519060200120604051602001611735939291909283526001600160a01b03919091166020830152604082015260600190565b604051602081830303815290604052805190602001206117ad565b600080600061175f85856117da565b9150915061176c8161181f565b509392505050565b61136981611969565b600054610100900460ff166117a45760405162461bcd60e51b81526004016105e690611f81565b610e7433611489565b60006109626117ba61198a565b8360405161190160f01b8152600281019290925260228201526042902090565b60008082516041036118105760208301516040840151606085015160001a61180487828585611999565b94509450505050611818565b506000905060025b9250929050565b600081600481111561183357611833611fcc565b0361183b5750565b600181600481111561184f5761184f611fcc565b0361189c5760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e6174757265000000000000000060448201526064016105e6565b60028160048111156118b0576118b0611fcc565b036118fd5760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e6774680060448201526064016105e6565b600381600481111561191157611911611fcc565b036113695760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b60648201526084016105e6565b60006a636f6e736f6c652e6c6f679050600080835160208501845afa505050565b6000611994611a5d565b905090565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08311156119d05750600090506003611a54565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa158015611a24573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b038116611a4d57600060019250925050611a54565b9150600090505b94509492505050565b60007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f611a88611ad1565b611a90611b2a565b60408051602081019490945283019190915260608201524660808201523060a082015260c00160405160208183030381529060405280519060200120905090565b600080611adc6114db565b805190915015611af3578051602090910120919050565b6001548015611b025792915050565b7fc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a4709250505090565b600080611b3561156d565b805190915015611b4c578051602090910120919050565b6002548015611b025792915050565b801515811461136957600080fd5b600060208284031215611b7b57600080fd5b81356113e281611b5b565b600060208284031215611b9857600080fd5b5035919050565b634e487b7160e01b600052604160045260246000fd5b6040516060810167ffffffffffffffff81118282101715611bd857611bd8611b9f565b60405290565b80356001600160a01b038116811461096857600080fd5b600067ffffffffffffffff80841115611c1057611c10611b9f565b604051601f8501601f19908116603f01168101908282118183101715611c3857611c38611b9f565b81604052809350858152868686011115611c5157600080fd5b858560208301376000602087830101525050509392505050565b60008060408385031215611c7e57600080fd5b82359150602083013567ffffffffffffffff80821115611c9d57600080fd5b9084019060608287031215611cb157600080fd5b611cb9611bb5565b611cc283611bde565b8152602083013582811115611cd657600080fd5b8301601f81018813611ce757600080fd5b611cf688823560208401611bf5565b602083015250604083013582811115611d0e57600080fd5b80840193505086601f840112611d2357600080fd5b611d3287843560208601611bf5565b60408201528093505050509250929050565b600060208284031215611d5657600080fd5b6113e282611bde565b60008060408385031215611d7257600080fd5b611d7b83611bde565b946020939093013593505050565b6000815180845260005b81811015611daf57602081850181015186830182015201611d93565b506000602082860101526020601f19601f83011685010191505092915050565b60ff60f81b881681526000602060e081840152611def60e084018a611d89565b8381036040850152611e01818a611d89565b606085018990526001600160a01b038816608086015260a0850187905284810360c0860152855180825283870192509083019060005b81811015611e5357835183529284019291840191600101611e37565b50909c9b505050505050505050505050565b600080600060608486031215611e7a57600080fd5b611e8384611bde565b9250611e9160208501611bde565b9150611e9f60408501611bde565b90509250925092565b600060208284031215611eba57600080fd5b5051919050565b600060208284031215611ed357600080fd5b81516113e281611b5b565b600082611efb57634e487b7160e01b600052601260045260246000fd5b500490565b808202811582820484141761096257634e487b7160e01b600052601160045260246000fd5b604081526000611f386040830185611d89565b90508260208301529392505050565b600181811c90821680611f5b57607f821691505b602082108103611f7b57634e487b7160e01b600052602260045260246000fd5b50919050565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b634e487b7160e01b600052602160045260246000fdfe0a5769746872617720616d6f756e74206f66207374616b696e6720636f6e74726163743a2d205265626173652072657761726420666f7220626f6e6420686f6c64657227733a2d20a264697066735822122025c328340e0a40c11b766d61286f500878e7a430b66231d3aecadfa1d435880d64736f6c63430008120033";

type EnderStakingConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: EnderStakingConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class EnderStaking__factory extends ContractFactory {
  constructor(...args: EnderStakingConstructorParams) {
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
      EnderStaking & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): EnderStaking__factory {
    return super.connect(runner) as EnderStaking__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): EnderStakingInterface {
    return new Interface(_abi) as EnderStakingInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): EnderStaking {
    return new Contract(address, _abi, runner) as unknown as EnderStaking;
  }
}
