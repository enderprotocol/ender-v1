/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../../../../common";
import type {
  StinstaToken,
  StinstaTokenInterface,
} from "../../../../../contracts/strategy/instadapp/instadappLite.sol/StinstaToken";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name_",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_mstEth",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
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
        name: "allowance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientAllowance",
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
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientBalance",
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
    name: "ERC20InvalidApprover",
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
    name: "ERC20InvalidReceiver",
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
    name: "ERC20InvalidSender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "ERC20InvalidSpender",
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
        indexed: true,
        internalType: "address",
        name: "depositor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Deposit",
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
        name: "value",
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
        internalType: "uint256",
        name: "mstEthAmount",
        type: "uint256",
      },
    ],
    name: "deposit",
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
    name: "deposits",
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
    name: "mstEth",
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
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
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
        name: "value",
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
        name: "value",
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
        name: "stinstaAmount",
        type: "uint256",
      },
    ],
    name: "viewStinstaTokens",
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
        name: "mstValue",
        type: "uint256",
      },
    ],
    name: "viewStinstaTokensValue",
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
        name: "stinstaAmount",
        type: "uint256",
      },
    ],
    name: "withdrawStinstaTokens",
    outputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604051620016e6380380620016e68339810160408190526200003491620001f0565b81848460036200004583826200030e565b5060046200005482826200030e565b5050506001600160a01b0381166200008657604051631e4fbdf760e01b81526000600482015260240160405180910390fd5b6200009181620000bc565b50600680546001600160a01b0319166001600160a01b039290921691909117905550620003da915050565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200013657600080fd5b81516001600160401b03808211156200015357620001536200010e565b604051601f8301601f19908116603f011681019082821181831017156200017e576200017e6200010e565b816040528381526020925086838588010111156200019b57600080fd5b600091505b83821015620001bf5785820183015181830184015290820190620001a0565b600093810190920192909252949350505050565b80516001600160a01b0381168114620001eb57600080fd5b919050565b600080600080608085870312156200020757600080fd5b84516001600160401b03808211156200021f57600080fd5b6200022d8883890162000124565b955060208701519150808211156200024457600080fd5b50620002538782880162000124565b9350506200026460408601620001d3565b91506200027460608601620001d3565b905092959194509250565b600181811c908216806200029457607f821691505b602082108103620002b557634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200030957600081815260208120601f850160051c81016020861015620002e45750805b601f850160051c820191505b818110156200030557828155600101620002f0565b5050505b505050565b81516001600160401b038111156200032a576200032a6200010e565b62000342816200033b84546200027f565b84620002bb565b602080601f8311600181146200037a5760008415620003615750858301515b600019600386901b1c1916600185901b17855562000305565b600085815260208120601f198616915b82811015620003ab578886015182559484019460019091019084016200038a565b5085821015620003ca5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b6112fc80620003ea6000396000f3fe608060405234801561001057600080fd5b50600436106101165760003560e01c806395d89b41116100a2578063dd62ed3e11610071578063dd62ed3e14610240578063eb24318d14610279578063f2fde38b1461028c578063f48d03bb1461029f578063fc7e286d146102b257600080fd5b806395d89b41146101ff578063a9059cbb14610207578063b2648dd11461021a578063b6b55f251461022d57600080fd5b80632f221601116100e95780632f22160114610181578063313ce567146101ac57806370a08231146101bb578063715018a6146101e45780638da5cb5b146101ee57600080fd5b806306fdde031461011b578063095ea7b31461013957806318160ddd1461015c57806323b872dd1461016e575b600080fd5b6101236102d2565b6040516101309190610ffd565b60405180910390f35b61014c61014736600461102c565b610364565b6040519015158152602001610130565b6002545b604051908152602001610130565b61014c61017c366004611056565b61037e565b600654610194906001600160a01b031681565b6040516001600160a01b039091168152602001610130565b60405160128152602001610130565b6101606101c9366004611092565b6001600160a01b031660009081526020819052604090205490565b6101ec6103a2565b005b6005546001600160a01b0316610194565b6101236103b6565b61014c61021536600461102c565b6103c5565b6101606102283660046110ad565b6103d3565b6101ec61023b3660046110ad565b6104ab565b61016061024e3660046110c6565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6101606102873660046110ad565b6106b1565b6101ec61029a366004611092565b610919565b6101606102ad3660046110ad565b610957565b6101606102c0366004611092565b60076020526000908152604090205481565b6060600380546102e1906110f9565b80601f016020809104026020016040519081016040528092919081815260200182805461030d906110f9565b801561035a5780601f1061032f5761010080835404028352916020019161035a565b820191906000526020600020905b81548152906001019060200180831161033d57829003601f168201915b5050505050905090565b600033610372818585610a92565b60019150505b92915050565b60003361038c858285610aa4565b610397858585610b22565b506001949350505050565b6103aa610b81565b6103b46000610bae565b565b6060600480546102e1906110f9565b600033610372818585610b22565b336000908152602081905260408120546104199083903360405180604001604052806011815260200170766965775374696e737461546f6b656e7360781b815250610c00565b600061042460025490565b6006546040516370a0823160e01b81523060048201526001600160a01b03909116906370a0823190602401602060405180830381865afa15801561046c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104909190611133565b61049a9085611162565b6104a49190611179565b9392505050565b6000811161050e5760405162461bcd60e51b815260206004820152602560248201527f4465706f73697420616d6f756e74206d75737420626520677265617465722074604482015264068616e20360dc1b60648201526084015b60405180910390fd5b6006546040516370a0823160e01b81523360048201526001600160a01b03909116906370a0823190602401602060405180830381865afa158015610556573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061057a9190611133565b3360009081526007602052604090205461059590839061119b565b11156105e35760405162461bcd60e51b815260206004820152601b60248201527f496e73756666696369656e74206d73744574682062616c616e636500000000006044820152606401610505565b6006546040516323b872dd60e01b8152336004820152306024820152604481018390526001600160a01b03909116906323b872dd906064016020604051808303816000875af115801561063a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061065e91906111ae565b6106a25760405162461bcd60e51b8152602060048201526015602482015274151bdad95b881d1c985b9cd9995c8819985a5b1959605a1b6044820152606401610505565b806106ad3382610c49565b5050565b336000908152602081905260408120548211156106e05760405162461bcd60e51b8152600401610505906111d0565b6006546040516370a0823160e01b815230600482015261075a9184916001600160a01b03909116906370a0823190602401602060405180830381865afa15801561072e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107529190611133565b600254610c7f565b600061076560025490565b6006546040516370a0823160e01b81523060048201526001600160a01b03909116906370a0823190602401602060405180830381865afa1580156107ad573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107d19190611133565b6107db9085611162565b6107e59190611179565b6006546040516370a0823160e01b81523060048201529192506108939183916001600160a01b0316906370a0823190602401602060405180830381865afa158015610834573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108589190611133565b6040518060400160405280601f81526020017f77697468647261775374696e737461546f6b656e732d2d2d2d2d2d3e3e3e3e00815250610ccd565b61089d3384610d14565b60065460405163a9059cbb60e01b8152336004820152602481018390526001600160a01b039091169063a9059cbb906044016020604051808303816000875af11580156108ee573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061091291906111ae565b5092915050565b610921610b81565b6001600160a01b03811661094b57604051631e4fbdf760e01b815260006004820152602401610505565b61095481610bae565b50565b336000908152602081905260408120548211156109865760405162461bcd60e51b8152600401610505906111d0565b610a1d6040518060600160405280602681526020016112a160269139836109ac60025490565b6006546040516370a0823160e01b81523060048201526001600160a01b03909116906370a0823190602401602060405180830381865afa1580156109f4573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a189190611133565b610d4a565b6006546040516370a0823160e01b81523060048201526000916001600160a01b0316906370a0823190602401602060405180830381865afa158015610a66573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a8a9190611133565b600254610490565b610a9f8383836001610d93565b505050565b6001600160a01b038381166000908152600160209081526040808320938616835292905220546000198114610b1c5781811015610b0d57604051637dc7a0d960e11b81526001600160a01b03841660048201526024810182905260448101839052606401610505565b610b1c84848484036000610d93565b50505050565b6001600160a01b038316610b4c57604051634b637e8f60e11b815260006004820152602401610505565b6001600160a01b038216610b765760405163ec442f0560e01b815260006004820152602401610505565b610a9f838383610e68565b6005546001600160a01b031633146103b45760405163118cdaa760e01b8152336004820152602401610505565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b610b1c84848484604051602401610c1a9493929190611212565b60408051601f198184030181529190526020810180516001600160e01b0316630d9bc81760e31b179052610f92565b6001600160a01b038216610c735760405163ec442f0560e01b815260006004820152602401610505565b6106ad60008383610e68565b604051602481018490526044810183905260648101829052610a9f9060840160408051601f198184030181529190526020810180516001600160e01b031663347b5e8f60e21b179052610f92565b610a9f838383604051602401610ce593929190611249565b60408051601f198184030181529190526020810180516001600160e01b03166338e8257960e11b179052610f92565b6001600160a01b038216610d3e57604051634b637e8f60e11b815260006004820152602401610505565b6106ad82600083610e68565b610b1c84848484604051602401610d649493929190611271565b60408051601f198184030181529190526020810180516001600160e01b031663a7a8785360e01b179052610f92565b6001600160a01b038416610dbd5760405163e602df0560e01b815260006004820152602401610505565b6001600160a01b038316610de757604051634a1406b160e11b815260006004820152602401610505565b6001600160a01b0380851660009081526001602090815260408083209387168352929052208290558015610b1c57826001600160a01b0316846001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051610e5a91815260200190565b60405180910390a350505050565b6001600160a01b038316610e93578060026000828254610e88919061119b565b90915550610f059050565b6001600160a01b03831660009081526020819052604090205481811015610ee65760405163391434e360e21b81526001600160a01b03851660048201526024810182905260448101839052606401610505565b6001600160a01b03841660009081526020819052604090209082900390555b6001600160a01b038216610f2157600280548290039055610f40565b6001600160a01b03821660009081526020819052604090208054820190555b816001600160a01b0316836001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610f8591815260200190565b60405180910390a3505050565b6109548160006a636f6e736f6c652e6c6f679050600080835160208501845afa505050565b6000815180845260005b81811015610fdd57602081850181015186830182015201610fc1565b506000602082860101526020601f19601f83011685010191505092915050565b6020815260006104a46020830184610fb7565b80356001600160a01b038116811461102757600080fd5b919050565b6000806040838503121561103f57600080fd5b61104883611010565b946020939093013593505050565b60008060006060848603121561106b57600080fd5b61107484611010565b925061108260208501611010565b9150604084013590509250925092565b6000602082840312156110a457600080fd5b6104a482611010565b6000602082840312156110bf57600080fd5b5035919050565b600080604083850312156110d957600080fd5b6110e283611010565b91506110f060208401611010565b90509250929050565b600181811c9082168061110d57607f821691505b60208210810361112d57634e487b7160e01b600052602260045260246000fd5b50919050565b60006020828403121561114557600080fd5b5051919050565b634e487b7160e01b600052601160045260246000fd5b80820281158282048414176103785761037861114c565b60008261119657634e487b7160e01b600052601260045260246000fd5b500490565b808201808211156103785761037861114c565b6000602082840312156111c057600080fd5b815180151581146104a457600080fd5b60208082526022908201527f496e73756666696369656e74205374696e73746120746f6b656e2062616c616e604082015261636560f01b606082015260800190565b84815283602082015260018060a01b038316604082015260806060820152600061123f6080830184610fb7565b9695505050505050565b8381528260208201526060604082015260006112686060830184610fb7565b95945050505050565b6080815260006112846080830187610fb7565b602083019590955250604081019290925260609091015291905056fe2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2da2646970667358221220d6834c605eab897d0619ad292d7b71aed62afebbb19c73de8042c94ec287b16a64736f6c63430008120033";

type StinstaTokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: StinstaTokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class StinstaToken__factory extends ContractFactory {
  constructor(...args: StinstaTokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    name_: string,
    symbol_: string,
    owner: AddressLike,
    _mstEth: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      name_,
      symbol_,
      owner,
      _mstEth,
      overrides || {}
    );
  }
  override deploy(
    name_: string,
    symbol_: string,
    owner: AddressLike,
    _mstEth: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(
      name_,
      symbol_,
      owner,
      _mstEth,
      overrides || {}
    ) as Promise<
      StinstaToken & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): StinstaToken__factory {
    return super.connect(runner) as StinstaToken__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): StinstaTokenInterface {
    return new Interface(_abi) as StinstaTokenInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): StinstaToken {
    return new Contract(address, _abi, runner) as unknown as StinstaToken;
  }
}
