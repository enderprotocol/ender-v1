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
  "0x608060405234801561000f575f80fd5b5061116b8061001d5f395ff3fe608060405234801561000f575f80fd5b5060043610610111575f3560e01c8063715018a61161009e578063aced16611161006e578063aced166114610222578063adb3791c14610235578063b8c0a3a11461023e578063bf4afb1e14610251578063f2fde38b14610264575f80fd5b8063715018a6146101e35780638da5cb5b146101eb57806399940ece146101fc578063a694fc3a1461020f575f80fd5b806336163b04116100e457806336163b041461018e578063426697cf14610197578063485cc955146101aa5780635d7fbcb5146101bd57806370db6902146101d0575f80fd5b80630b19b1a61461011557806317bb32e31461012a5780632bc19cf61461015a5780632e1a7d4d1461017b575b5f80fd5b610128610123366004610f2d565b610277565b005b60685461013d906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b61016d610168366004610f2d565b6102da565b604051908152602001610151565b610128610189366004610f2d565b61037f565b61016d60655481565b606a5461013d906001600160a01b031681565b6101286101b8366004610f5a565b61057e565b60695461013d906001600160a01b031681565b6101286101de366004610f8b565b6106ab565b6101286107ff565b6033546001600160a01b031661013d565b606c5461013d906001600160a01b031681565b61012861021d366004610f2d565b610812565b606b5461013d906001600160a01b031681565b61016d60665481565b61012861024c366004610fb3565b610910565b60675461013d906001600160a01b031681565b610128610272366004610fb3565b610b5d565b61027f610bd6565b805f0361029f5760405163162908e360e11b815260040160405180910390fd5b60658190556040518181527fe0e6a36f218809ddf2501604b5999d92df38d34801ea531c19ef6105292bc0749060200160405180910390a150565b5f61031c6040518060400160405280601d81526020017f7265626173696e67496e6465782d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d000000815250606654610c30565b6066545f0361032c57508061034e565b60665461034183670de0b6b3a7640000610fe7565b61034b9190610ffe565b90505b61037a6040518060400160405280600a81526020016973456e64546f6b656e7360b01b81525082610c30565b919050565b805f0361039f5760405163162908e360e11b815260040160405180910390fd5b6068546040516370a0823160e01b815233600482015282916001600160a01b0316906370a0823190602401602060405180830381865afa1580156103e5573d5f803e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610409919061101d565b10156104285760405163162908e360e11b815260040160405180910390fd5b606c5461043d906001600160a01b0316610910565b5f61044782610c79565b90506104726040518060400160405280600781526020016670656e64696e6760c81b81525082610c30565b606854604051632770a7eb60e21b8152336004820152602481018490526001600160a01b0390911690639dc29fac906044015f604051808303815f87803b1580156104bb575f80fd5b505af11580156104cd573d5f803e3d5ffd5b505060675460405163a9059cbb60e01b8152336004820152602481018590526001600160a01b03909116925063a9059cbb91506044016020604051808303815f875af115801561051f573d5f803e3d5ffd5b505050506040513d601f19601f820116820180604052508101906105439190611034565b5060405182815233907f884edad9ce6fa2440d8a54cc123490eb96d2768479d49ff9c7366125a9424364906020015b60405180910390a25050565b5f54610100900460ff161580801561059c57505f54600160ff909116105b806105b55750303b1580156105b557505f5460ff166001145b61061d5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b60648201526084015b60405180910390fd5b5f805460ff19166001179055801561063e575f805461ff0019166101001790555b610646610ca1565b6106518360036106ab565b61065c8260046106ab565b600a60655580156106a6575f805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b505050565b6106b3610bd6565b6001600160a01b0382166106da5760405163d92e233d60e01b815260040160405180910390fd5b8060010361070257606a80546001600160a01b0319166001600160a01b0384161790556107c6565b8060020361072a57606980546001600160a01b0319166001600160a01b0384161790556107c6565b8060030361075257606780546001600160a01b0319166001600160a01b0384161790556107c6565b8060040361077a57606880546001600160a01b0319166001600160a01b0384161790556107c6565b806005036107a257606b80546001600160a01b0319166001600160a01b0384161790556107c6565b806006036107c657606c80546001600160a01b0319166001600160a01b0384161790555b60405181906001600160a01b038416907f95306b5a2fd59205b962127979145cbea114f061c770ddb77ec4b9a8c41738e2905f90a35050565b610807610bd6565b6108105f610ccf565b565b805f036108325760405163162908e360e11b815260040160405180910390fd5b606c54610847906001600160a01b0316610910565b5f610851826102da565b905061087f6040518060400160405280600a8152602001691cd15b99105b5bdd5b9d60b21b81525082610c30565b6068546040516340c10f1960e01b8152336004820152602481018390526001600160a01b03909116906340c10f19906044015f604051808303815f87803b1580156108c8575f80fd5b505af11580156108da573d5f803e3d5ffd5b50506040518481523392507febedb8b3c678666e7f36970bc8f57abf6d8fa2e828c0da91ea5b75bf68ed101a9150602001610572565b60695460405163b224d54360e01b81526001600160a01b0383811660048301525f92169063b224d543906024016020604051808303815f875af1158015610959573d5f803e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061097d919061101d565b90505f6064606554836109909190610fe7565b61099a9190610ffe565b90506109c481604051806040016040528060068152602001657277322d2d2d60d01b815250610d20565b5f6109ce826102da565b606854606a546040516340c10f1960e01b81526001600160a01b0391821660048201526024810184905292935016906340c10f19906044015f604051808303815f87803b158015610a1d575f80fd5b505af1158015610a2f573d5f803e3d5ffd5b50506067546001600160a01b031691506340c10f19905030610a518587611053565b6040516001600160e01b031960e085901b1681526001600160a01b03909216600483015260248201526044015f604051808303815f87803b158015610a94575f80fd5b505af1158015610aa6573d5f803e3d5ffd5b5050606a54604051630325c1f360e51b8152600481018590526001600160a01b0390911692506364b83e6091506024015f604051808303815f87803b158015610aed575f80fd5b505af1158015610aff573d5f803e3d5ffd5b50505050610b0b610d65565b60408051848152602081018490529081018290526001600160a01b038516907fe0387ec6ca591cf1cae66c61621f7596433cfa12ee784533f7a332da3ef5671c9060600160405180910390a250505050565b610b65610bd6565b6001600160a01b038116610bca5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610614565b610bd381610ccf565b50565b6033546001600160a01b031633146108105760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610614565b610c758282604051602401610c469291906110a9565b60408051601f198184030181529190526020810180516001600160e01b0316632d839cb360e21b179052610e8f565b5050565b5f670de0b6b3a764000060665483610c919190610fe7565b610c9b9190610ffe565b92915050565b5f54610100900460ff16610cc75760405162461bcd60e51b8152600401610614906110ca565b610810610e98565b603380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0905f90a35050565b610c758282604051602401610d36929190611115565b60408051601f198184030181529190526020810180516001600160e01b031663643fd0df60e01b179052610e8f565b6067546040516370a0823160e01b81523060048201525f916001600160a01b0316906370a0823190602401602060405180830381865afa158015610dab573d5f803e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610dcf919061101d565b90505f60685f9054906101000a90046001600160a01b03166001600160a01b03166318160ddd6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610e22573d5f803e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610e46919061101d565b9050610e528282610ec7565b811580610e5d575080155b15610e6b5760016066555050565b80610e7e83670de0b6b3a7640000610fe7565b610e889190610ffe565b6066555050565b610bd381610f0e565b5f54610100900460ff16610ebe5760405162461bcd60e51b8152600401610614906110ca565b61081033610ccf565b6040516024810183905260448101829052610c759060640160408051601f198184030181529190526020810180516001600160e01b0316637b3338ad60e11b179052610e8f565b5f6a636f6e736f6c652e6c6f6790505f80835160208501845afa505050565b5f60208284031215610f3d575f80fd5b5035919050565b80356001600160a01b038116811461037a575f80fd5b5f8060408385031215610f6b575f80fd5b610f7483610f44565b9150610f8260208401610f44565b90509250929050565b5f8060408385031215610f9c575f80fd5b610fa583610f44565b946020939093013593505050565b5f60208284031215610fc3575f80fd5b610fcc82610f44565b9392505050565b634e487b7160e01b5f52601160045260245ffd5b8082028115828204841417610c9b57610c9b610fd3565b5f8261101857634e487b7160e01b5f52601260045260245ffd5b500490565b5f6020828403121561102d575f80fd5b5051919050565b5f60208284031215611044575f80fd5b81518015158114610fcc575f80fd5b81810381811115610c9b57610c9b610fd3565b5f81518084525f5b8181101561108a5760208185018101518683018201520161106e565b505f602082860101526020601f19601f83011685010191505092915050565b604081525f6110bb6040830185611066565b90508260208301529392505050565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b828152604060208201525f61112d6040830184611066565b94935050505056fea2646970667358221220d3f36529cf16d8302da6142b22a316221ef3d37027972c86656ed7901b895ecc64736f6c63430008140033";

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
