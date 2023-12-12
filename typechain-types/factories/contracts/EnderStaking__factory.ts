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
  "0x608060405234801561001057600080fd5b5061140b806100206000396000f3fe608060405234801561001057600080fd5b50600436106101165760003560e01c8063715018a6116100a2578063aced166111610071578063aced166114610228578063adb3791c1461023b578063b8c0a3a114610244578063bf4afb1e14610257578063f2fde38b1461026a57600080fd5b8063715018a6146101e95780638da5cb5b146101f157806399940ece14610202578063a694fc3a1461021557600080fd5b806336163b04116100e957806336163b0414610194578063426697cf1461019d578063485cc955146101b05780635d7fbcb5146101c357806370db6902146101d657600080fd5b80630b19b1a61461011b57806317bb32e3146101305780632bc19cf6146101605780632e1a7d4d14610181575b600080fd5b61012e6101293660046111a7565b61027d565b005b606854610143906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b61017361016e3660046111a7565b6102e1565b604051908152602001610157565b61012e61018f3660046111a7565b61035c565b61017360655481565b606a54610143906001600160a01b031681565b61012e6101be3660046111d7565b61055f565b606954610143906001600160a01b031681565b61012e6101e436600461120a565b610692565b61012e6107e7565b6033546001600160a01b0316610143565b606c54610143906001600160a01b031681565b61012e6102233660046111a7565b6107fb565b606b54610143906001600160a01b031681565b61017360665481565b61012e610252366004611234565b610bcb565b606754610143906001600160a01b031681565b61012e610278366004611234565b610ded565b610285610e66565b806000036102a65760405163162908e360e11b815260040160405180910390fd5b60658190556040518181527fe0e6a36f218809ddf2501604b5999d92df38d34801ea531c19ef6105292bc0749060200160405180910390a150565b600060665460000361031b576103176040518060400160405280600881526020016749276d206865726560c01b81525083610ec0565b5090565b61034460405180604001604052806004815260200163656c736560e01b81525083606654610f09565b6066546103519083611256565b92915050565b919050565b8060000361037d5760405163162908e360e11b815260040160405180910390fd5b6068546040516370a0823160e01b815233600482015282916001600160a01b0316906370a0823190602401602060405180830381865afa1580156103c5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103e99190611278565b10156104085760405163162908e360e11b815260040160405180910390fd5b606c5461041d906001600160a01b0316610bcb565b600061042882610f50565b905061044c6040518060600160405280602581526020016113b16025913982610ec0565b60675460405163a9059cbb60e01b8152336004820152602481018390526001600160a01b039091169063a9059cbb906044016020604051808303816000875af115801561049d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104c19190611291565b50606854604051632770a7eb60e21b8152336004820152602481018490526001600160a01b0390911690639dc29fac90604401600060405180830381600087803b15801561050e57600080fd5b505af1158015610522573d6000803e3d6000fd5b50506040518481523392507f884edad9ce6fa2440d8a54cc123490eb96d2768479d49ff9c7366125a9424364915060200160405180910390a25050565b600054610100900460ff161580801561057f5750600054600160ff909116105b806105995750303b158015610599575060005460ff166001145b6106015760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b60648201526084015b60405180910390fd5b6000805460ff191660011790558015610624576000805461ff0019166101001790555b61062c610f60565b610637836003610692565b610642826004610692565b600a606555801561068d576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b505050565b61069a610e66565b6001600160a01b0382166106c15760405163d92e233d60e01b815260040160405180910390fd5b806001036106e957606a80546001600160a01b0319166001600160a01b0384161790556107ad565b8060020361071157606980546001600160a01b0319166001600160a01b0384161790556107ad565b8060030361073957606780546001600160a01b0319166001600160a01b0384161790556107ad565b8060040361076157606880546001600160a01b0319166001600160a01b0384161790556107ad565b8060050361078957606b80546001600160a01b0319166001600160a01b0384161790556107ad565b806006036107ad57606c80546001600160a01b0319166001600160a01b0384161790555b60405181906001600160a01b038416907f95306b5a2fd59205b962127979145cbea114f061c770ddb77ec4b9a8c41738e290600090a35050565b6107ef610e66565b6107f96000610f8f565b565b8060000361081c5760405163162908e360e11b815260040160405180910390fd5b61085260405180604001604052806014815260200173022b732103a37b5b2b7103232b837b9b4ba1d16960651b81525082610ec0565b6067546040516370a0823160e01b81523060048201526108c5916001600160a01b0316906370a0823190602401602060405180830381865afa15801561089c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108c09190611278565b610fe1565b6067546040516370a0823160e01b81523060048201526001600160a01b03909116906370a0823190602401602060405180830381865afa15801561090d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109319190611278565b600003610a5d576067546040516323b872dd60e01b8152336004820152306024820152604481018390526001600160a01b03909116906323b872dd906064016020604051808303816000875af115801561098f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109b39190611291565b5060006109bf826102e1565b90506109f36040518060400160405280601081526020016f02932b1b2b4b83a103a37b5b2b71d16960851b81525082610ec0565b6068546040516340c10f1960e01b8152336004820152602481018390526001600160a01b03909116906340c10f1990604401600060405180830381600087803b158015610a3f57600080fd5b505af1158015610a53573d6000803e3d6000fd5b5050505050610b93565b606c54610a72906001600160a01b0316610bcb565b6067546040516323b872dd60e01b8152336004820152306024820152604481018390526001600160a01b03909116906323b872dd906064016020604051808303816000875af1158015610ac9573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610aed9190611291565b506000610af9826102e1565b9050610b2d6040518060400160405280601081526020016f02932b1b2b4b83a103a37b5b2b71d16960851b81525082610ec0565b6068546040516340c10f1960e01b8152336004820152602481018390526001600160a01b03909116906340c10f1990604401600060405180830381600087803b158015610b7957600080fd5b505af1158015610b8d573d6000803e3d6000fd5b50505050505b60405181815233907febedb8b3c678666e7f36970bc8f57abf6d8fa2e828c0da91ea5b75bf68ed101a9060200160405180910390a250565b60695460405163b224d54360e01b81526001600160a01b038381166004830152600092169063b224d543906024016020604051808303816000875af1158015610c18573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c3c9190611278565b90506000606460655483610c5091906112b3565b610c5a9190611256565b90506000610c67826102e1565b606854606a546040516340c10f1960e01b81526001600160a01b0391821660048201526024810184905292935016906340c10f1990604401600060405180830381600087803b158015610cb957600080fd5b505af1158015610ccd573d6000803e3d6000fd5b50506067546040516340c10f1960e01b8152306004820152602481018790526001600160a01b0390911692506340c10f199150604401600060405180830381600087803b158015610d1d57600080fd5b505af1158015610d31573d6000803e3d6000fd5b5050606a54604051630325c1f360e51b8152600481018590526001600160a01b0390911692506364b83e609150602401600060405180830381600087803b158015610d7b57600080fd5b505af1158015610d8f573d6000803e3d6000fd5b50505050610d9b611026565b60408051848152602081018490529081018290526001600160a01b038516907fe0387ec6ca591cf1cae66c61621f7596433cfa12ee784533f7a332da3ef5671c9060600160405180910390a250505050565b610df5610e66565b6001600160a01b038116610e5a5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016105f8565b610e6381610f8f565b50565b6033546001600160a01b031633146107f95760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016105f8565b610f058282604051602401610ed692919061131e565b60408051601f198184030181529190526020810180516001600160e01b0316632d839cb360e21b17905261114d565b5050565b61068d838383604051602401610f2193929190611340565b60408051601f198184030181529190526020810180516001600160e01b031663ca47c4eb60e01b17905261114d565b60006066548261035191906112b3565b600054610100900460ff16610f875760405162461bcd60e51b81526004016105f890611365565b6107f9611156565b603380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b610e6381604051602401610ff791815260200190565b60408051601f198184030181529190526020810180516001600160e01b031663f82c50f160e01b17905261114d565b6067546040516370a0823160e01b81523060048201526000916001600160a01b0316906370a0823190602401602060405180830381865afa15801561106f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110939190611278565b90506000606860009054906101000a90046001600160a01b03166001600160a01b03166318160ddd6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156110ea573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061110e9190611278565b905081158061111b575080155b156111295760016066555050565b8061113c83670de0b6b3a76400006112b3565b6111469190611256565b6066555050565b610e6381611186565b600054610100900460ff1661117d5760405162461bcd60e51b81526004016105f890611365565b6107f933610f8f565b60006a636f6e736f6c652e6c6f679050600080835160208501845afa505050565b6000602082840312156111b957600080fd5b5035919050565b80356001600160a01b038116811461035757600080fd5b600080604083850312156111ea57600080fd5b6111f3836111c0565b9150611201602084016111c0565b90509250929050565b6000806040838503121561121d57600080fd5b611226836111c0565b946020939093013593505050565b60006020828403121561124657600080fd5b61124f826111c0565b9392505050565b60008261127357634e487b7160e01b600052601260045260246000fd5b500490565b60006020828403121561128a57600080fd5b5051919050565b6000602082840312156112a357600080fd5b8151801515811461124f57600080fd5b808202811582820484141761035157634e487b7160e01b600052601160045260246000fd5b6000815180845260005b818110156112fe576020818501810151868301820152016112e2565b506000602082860101526020601f19601f83011685010191505092915050565b60408152600061133160408301856112d8565b90508260208301529392505050565b60608152600061135360608301866112d8565b60208301949094525060400152919050565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b60608201526080019056fe5769746872617720616d6f756e74206f66207374616b696e6720636f6e74726163743a2d20a2646970667358221220a64a7e2df1a50cdbaf12ef8d7e1bdbc8790f46fd3a8553cb77a45ed7f7328c1e64736f6c63430008120033";

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
