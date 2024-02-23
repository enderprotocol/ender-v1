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
  SEndToken,
  SEndTokenInterface,
} from "../../../contracts/ERC20/SEndToken";

const _abi = [
  {
    inputs: [],
    name: "NotOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "NotWhitelisted",
    type: "error",
  },
  {
    inputs: [],
    name: "TransactionDisabled",
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
        name: "_address",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_index",
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
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
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
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newStatus",
        type: "uint256",
      },
    ],
    name: "TransactionStatusChanged",
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
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "whitelistingAddress",
        type: "address",
      },
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
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MINTER_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
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
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
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
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
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
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
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
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
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
        internalType: "address",
        name: "_staking",
        type: "address",
      },
    ],
    name: "setMinterRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_status",
        type: "uint256",
      },
    ],
    name: "setStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "staking",
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
    name: "status",
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
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
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
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_whitelistingAddress",
        type: "address",
      },
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
  "0x608060405234801561001057600080fd5b506116a4806100206000396000f3fe608060405234801561001057600080fd5b50600436106101cf5760003560e01c806369ba1a75116101045780639dc29fac116100a2578063d539139311610071578063d5391393146103e6578063d547741f1461040d578063dd62ed3e14610420578063f59c37081461043357600080fd5b80639dc29fac146103a5578063a217fddf146103b8578063a457c2d7146103c0578063a9059cbb146103d357600080fd5b80638129fc1c116100de5780638129fc1c1461036f57806391d1485414610377578063945d12291461038a57806395d89b411461039d57600080fd5b806369ba1a751461032057806370a082311461033357806370db69021461035c57600080fd5b80632f2ff15d11610171578063395093511161014b57806339509351146102ac5780633af32abf146102bf57806340c10f19146102e25780634cf088d9146102f557600080fd5b80632f2ff15d14610275578063313ce5671461028a57806336568abe1461029957600080fd5b806318160ddd116101ad57806318160ddd14610224578063200d2ed21461023657806323b872dd1461023f578063248a9ca31461025257600080fd5b806301ffc9a7146101d457806306fdde03146101fc578063095ea7b314610211575b600080fd5b6101e76101e236600461121a565b610446565b60405190151581526020015b60405180910390f35b61020461047d565b6040516101f39190611268565b6101e761021f3660046112b7565b61050f565b6035545b6040519081526020016101f3565b61022860ca5481565b6101e761024d3660046112e1565b610527565b61022861026036600461131d565b60009081526097602052604090206001015490565b610288610283366004611336565b61054b565b005b604051601281526020016101f3565b6102886102a7366004611336565b610575565b6101e76102ba3660046112b7565b6105f8565b6101e76102cd366004611362565b60cb6020526000908152604090205460ff1681565b6102886102f03660046112b7565b61061a565b60c954610308906001600160a01b031681565b6040516001600160a01b0390911681526020016101f3565b61028861032e36600461131d565b610624565b610228610341366004611362565b6001600160a01b031660009081526033602052604090205490565b61028861036a3660046112b7565b61066b565b6102886106fc565b6101e7610385366004611336565b610873565b610288610398366004611362565b61089e565b6102046108d3565b6102886103b33660046112b7565b6108e2565b610228600081565b6101e76103ce3660046112b7565b6108ef565b6101e76103e13660046112b7565b61096a565b6102287f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a681565b61028861041b366004611336565b610978565b61022861042e36600461137d565b61099d565b6102886104413660046113a7565b6109c8565b60006001600160e01b03198216637965db0b60e01b148061047757506301ffc9a760e01b6001600160e01b03198316145b92915050565b60606036805461048c906113e3565b80601f01602080910402602001604051908101604052809291908181526020018280546104b8906113e3565b80156105055780601f106104da57610100808354040283529160200191610505565b820191906000526020600020905b8154815290600101906020018083116104e857829003601f168201915b5050505050905090565b60003361051d818585610a28565b5060019392505050565b600033610535858285610b4c565b610540858585610bc6565b506001949350505050565b60008281526097602052604090206001015461056681610bd9565b6105708383610be3565b505050565b6001600160a01b03811633146105ea5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b6105f48282610c69565b5050565b60003361051d81858561060b838361099d565b6106159190611433565b610a28565b6105f48282610cd0565b600061062f81610bd9565b60ca8290556040518281527f8adeaeebf4b8c4a43c9647be3262644d520651414f31a110bf1cdf0a213e68109060200160405180910390a15050565b600061067681610bd9565b6001600160a01b03831661069d5760405163d92e233d60e01b815260040160405180910390fd5b816001036106c15760c980546001600160a01b0319166001600160a01b0385161790555b60405182906001600160a01b038516907f95306b5a2fd59205b962127979145cbea114f061c770ddb77ec4b9a8c41738e290600090a3505050565b600054610100900460ff161580801561071c5750600054600160ff909116105b806107365750303b158015610736575060005460ff166001145b6107995760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b60648201526084016105e1565b6000805460ff1916600117905580156107bc576000805461ff0019166101001790555b6108036040518060400160405280600981526020016839a2b7322a37b5b2b760b91b815250604051806040016040528060048152602001631cd15b9960e21b815250610d91565b61080e600033610be3565b6108186001610624565b600160ca5560c9805460ff60a01b191690558015610870576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b50565b60009182526097602090815260408084206001600160a01b0393909316845291905290205460ff1690565b60006108a981610bd9565b6105f47f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a683610be3565b60606037805461048c906113e3565b6105f48261dead83610dc2565b600033816108fd828661099d565b90508381101561095d5760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084016105e1565b6105408286868403610a28565b60003361051d818585610bc6565b60008281526097602052604090206001015461099381610bd9565b6105708383610c69565b6001600160a01b03918216600090815260346020908152604080832093909416825291909152205490565b60006109d381610bd9565b6001600160a01b038316600081815260cb6020526040808220805460ff191686151590811790915590519092917fb840a1dbd8b09a3dc45161bba92dfb9aba643c0e44c085a447f839d1d02cf13b91a3505050565b6001600160a01b038316610a8a5760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b60648201526084016105e1565b6001600160a01b038216610aeb5760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b60648201526084016105e1565b6001600160a01b0383811660008181526034602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6000610b58848461099d565b90506000198114610bc05781811015610bb35760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e636500000060448201526064016105e1565b610bc08484848403610a28565b50505050565b610bce610f6d565b610570838383610dc2565b6108708133610fcc565b610bed8282610873565b6105f45760008281526097602090815260408083206001600160a01b03851684529091529020805460ff19166001179055610c253390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b610c738282610873565b156105f45760008281526097602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6001600160a01b038216610d265760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064016105e1565b8060356000828254610d389190611433565b90915550506001600160a01b0382166000818152603360209081526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a35050565b600054610100900460ff16610db85760405162461bcd60e51b81526004016105e190611446565b6105f48282611025565b6001600160a01b038316610e265760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b60648201526084016105e1565b6001600160a01b038216610e885760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b60648201526084016105e1565b6001600160a01b03831660009081526033602052604090205481811015610f005760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b60648201526084016105e1565b6001600160a01b0380851660008181526033602052604080822086860390559286168082529083902080548601905591517fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90610f609086815260200190565b60405180910390a3610bc0565b60ca54600103610f905760405163e792c15160e01b815260040160405180910390fd5b60ca54600203610fca5733600090815260cb602052604090205460ff16610fca5760405163e792c15160e01b815260040160405180910390fd5b565b610fd68282610873565b6105f457610fe381611065565b610fee836020611077565b604051602001610fff929190611491565b60408051601f198184030181529082905262461bcd60e51b82526105e191600401611268565b600054610100900460ff1661104c5760405162461bcd60e51b81526004016105e190611446565b6036611058838261156a565b506037610570828261156a565b60606104776001600160a01b03831660145b6060600061108683600261162a565b611091906002611433565b67ffffffffffffffff8111156110a9576110a9611506565b6040519080825280601f01601f1916602001820160405280156110d3576020820181803683370190505b509050600360fc1b816000815181106110ee576110ee611641565b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061111d5761111d611641565b60200101906001600160f81b031916908160001a905350600061114184600261162a565b61114c906001611433565b90505b60018111156111c4576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811061118057611180611641565b1a60f81b82828151811061119657611196611641565b60200101906001600160f81b031916908160001a90535060049490941c936111bd81611657565b905061114f565b5083156112135760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e7460448201526064016105e1565b9392505050565b60006020828403121561122c57600080fd5b81356001600160e01b03198116811461121357600080fd5b60005b8381101561125f578181015183820152602001611247565b50506000910152565b6020815260008251806020840152611287816040850160208701611244565b601f01601f19169190910160400192915050565b80356001600160a01b03811681146112b257600080fd5b919050565b600080604083850312156112ca57600080fd5b6112d38361129b565b946020939093013593505050565b6000806000606084860312156112f657600080fd5b6112ff8461129b565b925061130d6020850161129b565b9150604084013590509250925092565b60006020828403121561132f57600080fd5b5035919050565b6000806040838503121561134957600080fd5b823591506113596020840161129b565b90509250929050565b60006020828403121561137457600080fd5b6112138261129b565b6000806040838503121561139057600080fd5b6113998361129b565b91506113596020840161129b565b600080604083850312156113ba57600080fd5b6113c38361129b565b9150602083013580151581146113d857600080fd5b809150509250929050565b600181811c908216806113f757607f821691505b60208210810361141757634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b808201808211156104775761047761141d565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b7f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008152600083516114c9816017850160208801611244565b7001034b99036b4b9b9b4b733903937b6329607d1b60179184019182015283516114fa816028840160208801611244565b01602801949350505050565b634e487b7160e01b600052604160045260246000fd5b601f82111561057057600081815260208120601f850160051c810160208610156115435750805b601f850160051c820191505b818110156115625782815560010161154f565b505050505050565b815167ffffffffffffffff81111561158457611584611506565b6115988161159284546113e3565b8461151c565b602080601f8311600181146115cd57600084156115b55750858301515b600019600386901b1c1916600185901b178555611562565b600085815260208120601f198616915b828110156115fc578886015182559484019460019091019084016115dd565b508582101561161a5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b80820281158282048414176104775761047761141d565b634e487b7160e01b600052603260045260246000fd5b6000816116665761166661141d565b50600019019056fea2646970667358221220edb18b10686c992900a436af273bf009e937e903d33803a2b45d3f5fc7e9a70a64736f6c63430008120033";

type SEndTokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SEndTokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SEndToken__factory extends ContractFactory {
  constructor(...args: SEndTokenConstructorParams) {
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
      SEndToken & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): SEndToken__factory {
    return super.connect(runner) as SEndToken__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SEndTokenInterface {
    return new Interface(_abi) as SEndTokenInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): SEndToken {
    return new Contract(address, _abi, runner) as unknown as SEndToken;
  }
}
