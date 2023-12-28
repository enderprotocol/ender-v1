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
import type {
  EnderPreLounchDeposit,
  EnderPreLounchDepositInterface,
} from "../../../contracts/EnderPreLounchDeposit.sol/EnderPreLounchDeposit";

const _abi = [
  {
    inputs: [],
    name: "InvalidAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidBondFee",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidMaturity",
    type: "error",
  },
  {
    inputs: [],
    name: "NotAllowed",
    type: "error",
  },
  {
    inputs: [],
    name: "NotBondableToken",
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
        name: "token",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bool",
        name: "isEnabled",
        type: "bool",
      },
    ],
    name: "BondableTokensSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bondFees",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "principal",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "maturity",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "Deposit",
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
        internalType: "uint256",
        name: "newAmount",
        type: "uint256",
      },
    ],
    name: "MinDepAmountSet",
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
        internalType: "bool",
        name: "depositEnable",
        type: "bool",
      },
    ],
    name: "depositEnableSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "principal",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "Reward",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bondFees",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "maturity",
        type: "uint256",
      },
    ],
    name: "userInfo",
    type: "event",
  },
  {
    inputs: [],
    name: "admin",
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
        name: "",
        type: "address",
      },
    ],
    name: "bondableTokens",
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
        name: "",
        type: "address",
      },
    ],
    name: "bonds",
    outputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "principalAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bondFees",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maturity",
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
        name: "user",
        type: "address",
      },
      {
        internalType: "address",
        name: "_bond",
        type: "address",
      },
    ],
    name: "claimRebaseReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "principal",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maturity",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bondFee",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "depositEnable",
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
        name: "_stEth",
        type: "address",
      },
      {
        internalType: "address",
        name: "_lido",
        type: "address",
      },
      {
        internalType: "address",
        name: "_admin",
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
    name: "lido",
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
    name: "minDepositAmount",
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
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "pendingReward",
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
    name: "rewardShareIndex",
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
        name: "",
        type: "address",
      },
    ],
    name: "rewardSharePerUserIndexStEth",
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
        internalType: "address[]",
        name: "tokens",
        type: "address[]",
      },
      {
        internalType: "bool",
        name: "enabled",
        type: "bool",
      },
    ],
    name: "setBondableTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_depositEnable",
        type: "bool",
      },
    ],
    name: "setDepositEnable",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amt",
        type: "uint256",
      },
    ],
    name: "setMinDepAmount",
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
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "totalRewardOfUser",
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
    name: "totalStaked",
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
  "0x608060405234801561001057600080fd5b50611519806100206000396000f3fe6080604052600436106101355760003560e01c8063817b1cd2116100ab578063d3fd67d91161006f578063d3fd67d914610370578063f2fde38b14610390578063f40f0f52146103b0578063f851a440146103dd578063fad3cc4b146103fd578063fe10d7741461041057600080fd5b8063817b1cd2146102e65780638da5cb5b146102fc57806399940ece1461031a578063c0c53b8b1461033a578063ccfe07f11461035a57600080fd5b8063516be0f8116100fd578063516be0f81461022e578063645006ca1461024e578063674968671461026457806370db690214610291578063715018a6146102b15780637935707a146102c657600080fd5b80630c5960821461013a5780630ea821671461017a57806323509a2d1461019c5780632eb5c760146101d4578063498d81aa146101fe575b600080fd5b34801561014657600080fd5b506101676101553660046111be565b609f6020526000908152604090205481565b6040519081526020015b60405180910390f35b34801561018657600080fd5b5061019a6101953660046111e0565b610496565b005b3480156101a857600080fd5b506098546101bc906001600160a01b031681565b6040516001600160a01b039091168152602001610171565b3480156101e057600080fd5b50609d546101ee9060ff1681565b6040519015158152602001610171565b34801561020a57600080fd5b506101ee6102193660046111be565b609e6020526000908152604090205460ff1681565b34801561023a57600080fd5b5061019a610249366004611221565b61065a565b34801561025a57600080fd5b50610167609a5481565b34801561027057600080fd5b5061016761027f3660046111be565b60a16020526000908152604090205481565b34801561029d57600080fd5b5061019a6102ac36600461123e565b6106af565b3480156102bd57600080fd5b5061019a61072d565b3480156102d257600080fd5b5061019a6102e1366004611268565b610741565b3480156102f257600080fd5b50610167609c5481565b34801561030857600080fd5b506033546001600160a01b03166101bc565b34801561032657600080fd5b506097546101bc906001600160a01b031681565b34801561034657600080fd5b5061019a610355366004611281565b61077c565b34801561036657600080fd5b50610167609b5481565b34801561037c57600080fd5b5061019a61038b3660046112c4565b6108dd565b34801561039c57600080fd5b5061019a6103ab3660046111be565b6109bb565b3480156103bc57600080fd5b506101676103cb3660046111be565b60a06020526000908152604090205481565b3480156103e957600080fd5b506099546101bc906001600160a01b031681565b61019a61040b36600461134a565b610a34565b34801561041c57600080fd5b5061046461042b3660046111be565b60a260205260009081526040902080546001820154600283015460038401546004909401546001600160a01b0390931693919290919085565b604080516001600160a01b0390961686526020860194909452928401919091526060830152608082015260a001610171565b61049e610f33565b6001600160a01b0382166000908152609f6020526040902054609b546104c4919061139f565b6001600160a01b038316600090815260a260205260409020600101546104ea91906113b8565b6001600160a01b038316600090815260a0602052604090205461050d91906113cf565b6001600160a01b038316600090815260a16020908152604080832084905560a290915290206001015461054091906113cf565b6001600160a01b03838116600090815260a2602052604090819020600201839055609754905163a9059cbb60e01b815284831660048201526024810193909352169063a9059cbb906044016020604051808303816000875af11580156105aa573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105ce91906113e2565b506001600160a01b038216600081815260a260208181526040808420600181015460a184529482902054938352600281015460038201546004909201548351968752938601949094528482019390935260608401929092526080830152517fc3bbf6b9e10fad05843097a5efb0f9c177d491d7fa9b10e51e65ea27c6676d9f9181900360a00190a25050565b610662610f33565b609d805460ff191682151590811790915560405160ff909116151581527fd73bb71bc27cef03d6ee2916c27379137cd9df2244b2db7e09f48108a93606be9060200160405180910390a150565b6106b7610f33565b6001600160a01b0382166106de5760405163d92e233d60e01b815260040160405180910390fd5b8060010361070557609780546001600160a01b0319166001600160a01b0384161790555050565b8060020361072957609880546001600160a01b0319166001600160a01b0384161790555b5050565b610735610f33565b61073f6000610f8d565b565b610749610f33565b609a81905560405181907f05625a0f1171b5e8585c9019c420fefb294d1f26ee3db33c7d243b3cdf12c37b90600090a250565b600054610100900460ff161580801561079c5750600054600160ff909116105b806107b65750303b1580156107b6575060005460ff166001145b61081e5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b60648201526084015b60405180910390fd5b6000805460ff191660011790558015610841576000805461ff0019166101001790555b610849610fdf565b609780546001600160a01b038087166001600160a01b03199283161790925560988054868416908316179055609980549285169290911691909117905566038d7ea4c68000609a5580156108d7576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b50505050565b6108e5610f33565b8160005b818110156109b45782609e6000878785818110610908576109086113ff565b905060200201602081019061091d91906111be565b6001600160a01b031681526020810191909152604001600020805460ff191691151591909117905582151585858381811061095a5761095a6113ff565b905060200201602081019061096f91906111be565b6001600160a01b03167f8152f2b5c649b38f5ba259a7fd9c4145e82bfb846f01794f2ed60493ecf00cc260405160405180910390a36109ad81611415565b90506108e9565b5050505050565b6109c3610f33565b6001600160a01b038116610a285760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610815565b610a3181610f8d565b50565b610a3c61100e565b609d5460ff161515600114610a6457604051631eb49d6d60e11b815260040160405180910390fd5b609a54841015610a875760405163162908e360e11b815260040160405180910390fd5b6007831080610a97575061016d83115b15610ab5576040516318f4d05960e31b815260040160405180910390fd5b6001600160a01b03811615801590610ae657506001600160a01b0381166000908152609e602052604090205460ff16155b15610b045760405163014cb61f60e51b815260040160405180910390fd5b811580610b12575061271082115b15610b3057604051631c97324360e21b815260040160405180910390fd5b6001600160a01b038116610d2357833414610b5e5760405163162908e360e11b815260040160405180910390fd5b60985460408051600481526024810182526020810180516001600160e01b0316632de597e360e11b17905290516000926001600160a01b0316913491610ba4919061142e565b60006040518083038185875af1925050503d8060008114610be1576040519150601f19603f3d011682016040523d82523d6000602084013e610be6565b606091505b5050905080610c375760405162461bcd60e51b815260206004820152601760248201527f6c69646f20657468206465706f736974206661696c65640000000000000000006044820152606401610815565b6097546040516370a0823160e01b815230600482018190526001600160a01b039092169163a9059cbb9183906370a0823190602401602060405180830381865afa158015610c89573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610cad919061145d565b6040516001600160e01b031960e085901b1681526001600160a01b03909216600483015260248201526044016020604051808303816000875af1158015610cf8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d1c91906113e2565b5050610d9c565b6040516323b872dd60e01b8152336004820152306024820152604481018590526001600160a01b038216906323b872dd906064016020604051808303816000875af1158015610d76573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d9a91906113e2565b505b83609c6000828254610dae91906113cf565b9091555050609c546097546040516370a0823160e01b8152306004820152600092916001600160a01b0316906370a0823190602401602060405180830381865afa158015610e00573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e24919061145d565b610e2e919061139f565b90508015610e3e57610e3e611067565b609b54336000908152609f602090815260408083209390935560a29052206001015415610e6e57610e6e3361110a565b6040805160a0810182523380825260208083018981528385018a815260608086018a815260808088018d8152600088815260a288528a9020985189546001600160a01b0319166001600160a01b03918216178a55955160018a01559351600289015590516003880155915160049096019590955585518981529283018b9052948201899052861692810192909252917fede963da60ce3b657af455d654d08ff95549f13a4acb219b68756f68755e28e3910160405180910390a2506108d76001606555565b6033546001600160a01b0316331461073f5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610815565b603380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b600054610100900460ff166110065760405162461bcd60e51b815260040161081590611476565b61073f611172565b6002606554036110605760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606401610815565b6002606555565b609c546097546040516370a0823160e01b8152306004820152600092916001600160a01b0316906370a0823190602401602060405180830381865afa1580156110b4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110d8919061145d565b6110e2919061139f565b90508015610a3157609c546110f790826114c1565b609b5461110491906113cf565b609b5550565b6001600160a01b0381166000908152609f6020526040902054609b54611130919061139f565b6001600160a01b038216600090815260a2602052604090206001015461115691906113b8565b6001600160a01b03909116600090815260a06020526040902055565b600054610100900460ff166111995760405162461bcd60e51b815260040161081590611476565b61073f33610f8d565b80356001600160a01b03811681146111b957600080fd5b919050565b6000602082840312156111d057600080fd5b6111d9826111a2565b9392505050565b600080604083850312156111f357600080fd5b6111fc836111a2565b915061120a602084016111a2565b90509250929050565b8015158114610a3157600080fd5b60006020828403121561123357600080fd5b81356111d981611213565b6000806040838503121561125157600080fd5b61125a836111a2565b946020939093013593505050565b60006020828403121561127a57600080fd5b5035919050565b60008060006060848603121561129657600080fd5b61129f846111a2565b92506112ad602085016111a2565b91506112bb604085016111a2565b90509250925092565b6000806000604084860312156112d957600080fd5b833567ffffffffffffffff808211156112f157600080fd5b818601915086601f83011261130557600080fd5b81358181111561131457600080fd5b8760208260051b850101111561132957600080fd5b6020928301955093505084013561133f81611213565b809150509250925092565b6000806000806080858703121561136057600080fd5b84359350602085013592506040850135915061137e606086016111a2565b905092959194509250565b634e487b7160e01b600052601160045260246000fd5b818103818111156113b2576113b2611389565b92915050565b80820281158282048414176113b2576113b2611389565b808201808211156113b2576113b2611389565b6000602082840312156113f457600080fd5b81516111d981611213565b634e487b7160e01b600052603260045260246000fd5b60006001820161142757611427611389565b5060010190565b6000825160005b8181101561144f5760208186018101518583015201611435565b506000920191825250919050565b60006020828403121561146f57600080fd5b5051919050565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b6000826114de57634e487b7160e01b600052601260045260246000fd5b50049056fea26469706673582212203ee38ab8e69879aa53032d72e2d9f407181fee98338d8a639a5456aec836c43764736f6c63430008120033";

type EnderPreLounchDepositConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: EnderPreLounchDepositConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class EnderPreLounchDeposit__factory extends ContractFactory {
  constructor(...args: EnderPreLounchDepositConstructorParams) {
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
      EnderPreLounchDeposit & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(
    runner: ContractRunner | null
  ): EnderPreLounchDeposit__factory {
    return super.connect(runner) as EnderPreLounchDeposit__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): EnderPreLounchDepositInterface {
    return new Interface(_abi) as EnderPreLounchDepositInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): EnderPreLounchDeposit {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as EnderPreLounchDeposit;
  }
}
