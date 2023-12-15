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
    name: "Withdraw",
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
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
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
    ],
    name: "stake",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50611323806100206000396000f3fe608060405234801561001057600080fd5b50600436106101165760003560e01c8063715018a6116100a2578063aced166111610071578063aced166114610228578063adb3791c1461023b578063b8c0a3a114610244578063bf4afb1e14610257578063f2fde38b1461026a57600080fd5b8063715018a6146101e95780638da5cb5b146101f157806399940ece14610202578063a694fc3a1461021557600080fd5b806336163b04116100e957806336163b0414610194578063426697cf1461019d578063485cc955146101b05780635d7fbcb5146101c357806370db6902146101d657600080fd5b80630b19b1a61461011b57806317bb32e3146101305780632bc19cf6146101605780632e1a7d4d14610181575b600080fd5b61012e6101293660046110d4565b61027d565b005b606854610143906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b61017361016e3660046110d4565b6102e1565b604051908152602001610157565b61012e61018f3660046110d4565b610309565b61017360655481565b606a54610143906001600160a01b031681565b61012e6101be366004611104565b61050c565b606954610143906001600160a01b031681565b61012e6101e4366004611137565b61063f565b61012e610794565b6033546001600160a01b0316610143565b606c54610143906001600160a01b031681565b61012e6102233660046110d4565b6107a8565b606b54610143906001600160a01b031681565b61017360665481565b61012e610252366004611161565b610b1b565b606754610143906001600160a01b031681565b61012e610278366004611161565b610d5f565b610285610dd8565b806000036102a65760405163162908e360e11b815260040160405180910390fd5b60658190556040518181527fe0e6a36f218809ddf2501604b5999d92df38d34801ea531c19ef6105292bc0749060200160405180910390a150565b60006066546000036102f1575090565b6066546102fe9083611183565b92915050565b919050565b8060000361032a5760405163162908e360e11b815260040160405180910390fd5b6068546040516370a0823160e01b815233600482015282916001600160a01b0316906370a0823190602401602060405180830381865afa158015610372573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061039691906111a5565b10156103b55760405163162908e360e11b815260040160405180910390fd5b606c546103ca906001600160a01b0316610b1b565b60006103d582610e32565b90506103f96040518060600160405280602681526020016112a66026913982610e89565b60675460405163a9059cbb60e01b8152336004820152602481018390526001600160a01b039091169063a9059cbb906044016020604051808303816000875af115801561044a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061046e91906111be565b50606854604051632770a7eb60e21b8152336004820152602481018490526001600160a01b0390911690639dc29fac90604401600060405180830381600087803b1580156104bb57600080fd5b505af11580156104cf573d6000803e3d6000fd5b50506040518481523392507f884edad9ce6fa2440d8a54cc123490eb96d2768479d49ff9c7366125a9424364915060200160405180910390a25050565b600054610100900460ff161580801561052c5750600054600160ff909116105b806105465750303b158015610546575060005460ff166001145b6105ae5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b60648201526084015b60405180910390fd5b6000805460ff1916600117905580156105d1576000805461ff0019166101001790555b6105d9610ed2565b6105e483600361063f565b6105ef82600461063f565b600a606555801561063a576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b505050565b610647610dd8565b6001600160a01b03821661066e5760405163d92e233d60e01b815260040160405180910390fd5b8060010361069657606a80546001600160a01b0319166001600160a01b03841617905561075a565b806002036106be57606980546001600160a01b0319166001600160a01b03841617905561075a565b806003036106e657606780546001600160a01b0319166001600160a01b03841617905561075a565b8060040361070e57606880546001600160a01b0319166001600160a01b03841617905561075a565b8060050361073657606b80546001600160a01b0319166001600160a01b03841617905561075a565b8060060361075a57606c80546001600160a01b0319166001600160a01b0384161790555b60405181906001600160a01b038416907f95306b5a2fd59205b962127979145cbea114f061c770ddb77ec4b9a8c41738e290600090a35050565b61079c610dd8565b6107a66000610f01565b565b806000036107c95760405163162908e360e11b815260040160405180910390fd5b6107ff60405180604001604052806015815260200173522b732103a37b5b2b7103232b837b9b4ba1d169605d1b81525082610e89565b6067546040516370a0823160e01b81523060048201526001600160a01b03909116906370a0823190602401602060405180830381865afa158015610847573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061086b91906111a5565b6000036109ac57606c54610887906001600160a01b0316610b1b565b6067546040516323b872dd60e01b8152336004820152306024820152604481018390526001600160a01b03909116906323b872dd906064016020604051808303816000875af11580156108de573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061090291906111be565b50600061090e826102e1565b90506109426040518060400160405280601081526020016f02932b1b2b4b83a103a37b5b2b71d16960851b81525082610e89565b6068546040516340c10f1960e01b8152336004820152602481018390526001600160a01b03909116906340c10f1990604401600060405180830381600087803b15801561098e57600080fd5b505af11580156109a2573d6000803e3d6000fd5b5050505050610ae3565b6067546040516323b872dd60e01b8152336004820152306024820152604481018390526001600160a01b03909116906323b872dd906064016020604051808303816000875af1158015610a03573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a2791906111be565b506000610a33826102e1565b9050610a676040518060400160405280601081526020016f02932b1b2b4b83a103a37b5b2b71d16960851b81525082610e89565b6068546040516340c10f1960e01b8152336004820152602481018390526001600160a01b03909116906340c10f1990604401600060405180830381600087803b158015610ab357600080fd5b505af1158015610ac7573d6000803e3d6000fd5b5050606c54610ae192506001600160a01b03169050610b1b565b505b60405181815233907febedb8b3c678666e7f36970bc8f57abf6d8fa2e828c0da91ea5b75bf68ed101a9060200160405180910390a250565b60695460405163b224d54360e01b81526001600160a01b038381166004830152600092169063b224d543906024016020604051808303816000875af1158015610b68573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b8c91906111a5565b90506000606460655483610ba091906111e0565b610baa9190611183565b9050610bce6040518060600160405280602281526020016112cc6022913982610e89565b6000610bd9826102e1565b606854606a546040516340c10f1960e01b81526001600160a01b0391821660048201526024810184905292935016906340c10f1990604401600060405180830381600087803b158015610c2b57600080fd5b505af1158015610c3f573d6000803e3d6000fd5b50506067546040516340c10f1960e01b8152306004820152602481018790526001600160a01b0390911692506340c10f199150604401600060405180830381600087803b158015610c8f57600080fd5b505af1158015610ca3573d6000803e3d6000fd5b5050606a54604051630325c1f360e51b8152600481018590526001600160a01b0390911692506364b83e609150602401600060405180830381600087803b158015610ced57600080fd5b505af1158015610d01573d6000803e3d6000fd5b50505050610d0d610f53565b60408051848152602081018490529081018290526001600160a01b038516907fe0387ec6ca591cf1cae66c61621f7596433cfa12ee784533f7a332da3ef5671c9060600160405180910390a250505050565b610d67610dd8565b6001600160a01b038116610dcc5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016105a5565b610dd581610f01565b50565b6033546001600160a01b031633146107a65760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016105a5565b6000610e686040518060400160405280601081526020016f03932b130b9b4b733a4b73232bc1d16960851b815250606654610e89565b678ac7230489e8000060665483610e7f91906111e0565b6102fe9190611183565b610ece8282604051602401610e9f929190611205565b60408051601f198184030181529190526020810180516001600160e01b0316632d839cb360e21b17905261107a565b5050565b600054610100900460ff16610ef95760405162461bcd60e51b81526004016105a59061125a565b6107a6611083565b603380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6067546040516370a0823160e01b81523060048201526000916001600160a01b0316906370a0823190602401602060405180830381865afa158015610f9c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610fc091906111a5565b90506000606860009054906101000a90046001600160a01b03166001600160a01b03166318160ddd6040518163ffffffff1660e01b8152600401602060405180830381865afa158015611017573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061103b91906111a5565b9050811580611048575080155b156110565760016066555050565b8061106983678ac7230489e800006111e0565b6110739190611183565b6066555050565b610dd5816110b3565b600054610100900460ff166110aa5760405162461bcd60e51b81526004016105a59061125a565b6107a633610f01565b60006a636f6e736f6c652e6c6f679050600080835160208501845afa505050565b6000602082840312156110e657600080fd5b5035919050565b80356001600160a01b038116811461030457600080fd5b6000806040838503121561111757600080fd5b611120836110ed565b915061112e602084016110ed565b90509250929050565b6000806040838503121561114a57600080fd5b611153836110ed565b946020939093013593505050565b60006020828403121561117357600080fd5b61117c826110ed565b9392505050565b6000826111a057634e487b7160e01b600052601260045260246000fd5b500490565b6000602082840312156111b757600080fd5b5051919050565b6000602082840312156111d057600080fd5b8151801515811461117c57600080fd5b80820281158282048414176102fe57634e487b7160e01b600052601160045260246000fd5b604081526000835180604084015260005b818110156112335760208187018101516060868401015201611216565b506000606082850101526060601f19601f8301168401019150508260208301529392505050565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b60608201526080019056fe0a5769746872617720616d6f756e74206f66207374616b696e6720636f6e74726163743a2d205265626173652072657761726420666f7220626f6e6420686f6c64657227733a2d20a2646970667358221220ed418b44762ea43df50e0b6efbe0863e9ace2b56b37e7fe435b8fef435aec8d964736f6c63430008120033";

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
