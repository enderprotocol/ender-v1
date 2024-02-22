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
  EnderBondLiquidityDeposit,
  EnderBondLiquidityDepositInterface,
} from "../../contracts/EnderBondLiquidityDeposit";

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
    inputs: [],
    name: "addressNotWhitelisted",
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
        name: "index",
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
    inputs: [],
    name: "EIP712DomainChanged",
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
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
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
        name: "_bond",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "approvalForBond",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
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
        internalType: "struct EnderBondLiquidityDeposit.signData",
        name: "userSign",
        type: "tuple",
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
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "depositedIntoBond",
    outputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "principal",
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
    stateMutability: "nonpayable",
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
    name: "index",
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
        name: "_signer",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
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
        name: "",
        type: "uint256",
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
  "0x608060405234801561001057600080fd5b5061202c806100206000396000f3fe6080604052600436106101815760003560e01c806370db6902116100d157806399940ece1161008a578063f2fde38b11610064578063f2fde38b14610514578063f851a44014610534578063f8c8765e14610554578063fa09e4a11461057457600080fd5b806399940ece146104be578063ccfe07f1146104de578063d3fd67d9146104f457600080fd5b806370db6902146103f6578063715018a6146104165780637935707a1461042b5780637b88dca21461044b57806384b0196e146104785780638da5cb5b146104a057600080fd5b8063386429731161013e578063498d81aa11610118578063498d81aa1461030a578063516be0f81461033a5780635f1c17c01461035a578063645006ca146103e057600080fd5b806338642973146102a85780633b66f353146102ca578063426697cf146102ea57600080fd5b80631faf4fe1146101865780632242b9de146101d557806323509a2d14610210578063238ac933146102485780632986c0e5146102685780632eb5c7601461027e575b600080fd5b34801561019257600080fd5b506101a66101a13660046119a7565b610587565b604080516001600160a01b03909516855260208501939093529183015260608201526080015b60405180910390f35b3480156101e157600080fd5b506102026101f03660046119a7565b60d66020526000908152604090205481565b6040519081526020016101cc565b34801561021c57600080fd5b5060cc54610230906001600160a01b031681565b6040516001600160a01b0390911681526020016101cc565b34801561025457600080fd5b5060cd54610230906001600160a01b031681565b34801561027457600080fd5b5061020260d05481565b34801561028a57600080fd5b5060d3546102989060ff1681565b60405190151581526020016101cc565b3480156102b457600080fd5b506102c86102c33660046119dc565b6106f2565b005b3480156102d657600080fd5b506102c86102e53660046119f7565b6107a2565b3480156102f657600080fd5b5060cf54610230906001600160a01b031681565b34801561031657600080fd5b506102986103253660046119dc565b60d46020526000908152604090205460ff1681565b34801561034657600080fd5b506102c8610355366004611a2f565b610874565b34801561036657600080fd5b506103ae6103753660046119a7565b60d760205260009081526040902080546001820154600283015460038401546004909401546001600160a01b0390931693919290919085565b604080516001600160a01b0390961686526020860194909452928401919091526060830152608082015260a0016101cc565b3480156103ec57600080fd5b5061020260d15481565b34801561040257600080fd5b506102c86104113660046119f7565b6108c3565b34801561042257600080fd5b506102c8610968565b34801561043757600080fd5b506102c86104463660046119a7565b61097c565b34801561045757600080fd5b506102026104663660046119a7565b60d56020526000908152604090205481565b34801561048457600080fd5b5061048d6109b7565b6040516101cc9796959493929190611a9c565b3480156104ac57600080fd5b506067546001600160a01b0316610230565b3480156104ca57600080fd5b5060cb54610230906001600160a01b031681565b3480156104ea57600080fd5b5061020260d25481565b34801561050057600080fd5b506102c861050f366004611b32565b610a55565b34801561052057600080fd5b506102c861052f3660046119dc565b610b33565b34801561054057600080fd5b5060ce54610230906001600160a01b031681565b34801561056057600080fd5b506102c861056f366004611bb8565b610bac565b6102c8610582366004611cc1565b610d92565b60cf546000908190819081906001600160a01b031633146105bb57604051631eb49d6d60e11b815260040160405180910390fd5b60cb54600086815260d7602052604090819020600101549051630f451f7160e31b81526001600160a01b0390921691637a28fb88916106009160040190815260200190565b6020604051808303816000875af115801561061f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106439190611dbe565b600086815260d76020908152604091829020805460d054600183015460038401546004909401548651928352948201528085018690526060810192909252608082019290925291519295506001600160a01b0316917fc3bbf6b9e10fad05843097a5efb0f9c177d491d7fa9b10e51e65ea27c6676d9f9181900360a00190a25050600092835260d76020526040909220805460038201546004909201546001600160a01b039091169491925090565b6106fa61126d565b6001600160a01b03811661074d5760405162461bcd60e51b8152602060048201526015602482015274416464726573732063616e2774206265207a65726f60581b60448201526064015b60405180910390fd5b60cd80546001600160a01b0319166001600160a01b0383169081179091556040519081527f3dc2a8437aef0e8d2839b5e75d0d93e6c7f43b3acf5d2ef2db79beb54cb47b3d906020015b60405180910390a150565b6107aa61126d565b6001600160a01b0382166107f85760405162461bcd60e51b8152602060048201526015602482015274416464726573732063616e2774206265207a65726f60581b6044820152606401610744565b60cb5460405163095ea7b360e01b81526001600160a01b038481166004830152602482018490529091169063095ea7b3906044016020604051808303816000875af115801561084b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061086f9190611dd7565b505050565b61087c61126d565b60d3805460ff191682151590811790915560405160ff909116151581527fd73bb71bc27cef03d6ee2916c27379137cd9df2244b2db7e09f48108a93606be90602001610797565b6108cb61126d565b6001600160a01b0382166108f25760405163d92e233d60e01b815260040160405180910390fd5b806001036109195760cb80546001600160a01b0319166001600160a01b0384161790555050565b806002036109405760cc80546001600160a01b0319166001600160a01b0384161790555050565b806003036109645760cf80546001600160a01b0319166001600160a01b0384161790555b5050565b61097061126d565b61097a60006112c7565b565b61098461126d565b60d181905560405181907f05625a0f1171b5e8585c9019c420fefb294d1f26ee3db33c7d243b3cdf12c37b90600090a250565b6000606080600080600060606001546000801b1480156109d75750600254155b610a1b5760405162461bcd60e51b81526020600482015260156024820152741152540dcc4c8e88155b9a5b9a5d1a585b1a5e9959605a1b6044820152606401610744565b610a23611319565b610a2b6113ab565b60408051600080825260208201909252600f60f81b9b939a50919850469750309650945092509050565b610a5d61126d565b8160005b81811015610b2c578260d46000878785818110610a8057610a80611df4565b9050602002016020810190610a9591906119dc565b6001600160a01b031681526020810191909152604001600020805460ff1916911515919091179055821515858583818110610ad257610ad2611df4565b9050602002016020810190610ae791906119dc565b6001600160a01b03167f8152f2b5c649b38f5ba259a7fd9c4145e82bfb846f01794f2ed60493ecf00cc260405160405180910390a3610b2581611e0a565b9050610a61565b5050505050565b610b3b61126d565b6001600160a01b038116610ba05760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610744565b610ba9816112c7565b50565b600054610100900460ff1615808015610bcc5750600054600160ff909116105b80610be65750303b158015610be6575060005460ff166001145b610c495760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608401610744565b6000805460ff191660011790558015610c6c576000805461ff0019166101001790555b610c746113ba565b610c7c6113e9565b610cc66040518060400160405280600f81526020016e19195c1bdcda5d10dbdb9d1c9858dd608a1b815250604051806040016040528060018152602001603160f81b815250611418565b60cb80546001600160a01b038088166001600160a01b03199283161790925560cc805487841690831617905560cd805486841690831617905560ce80549285169290911682179055610d17906112c7565b6001600160a01b038516600090815260d460205260409020805460ff1916600117905567016345785d8a000060d1558015610b2c576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15050505050565b610d9a611449565b60d35460ff161515600114610dc257604051631eb49d6d60e11b815260040160405180910390fd5b60d154851015610de55760405163162908e360e11b815260040160405180910390fd5b6007841080610df5575061016d84115b15610e13576040516318f4d05960e31b815260040160405180910390fd5b6001600160a01b03821615801590610e4457506001600160a01b038216600090815260d4602052604090205460ff16155b15610e625760405163014cb61f60e51b815260040160405180910390fd5b612710831115610e8557604051631c97324360e21b815260040160405180910390fd5b6000610e90826114a2565b60cd549091506001600160a01b038083169116148015610eb9575081516001600160a01b031633145b610f055760405162461bcd60e51b815260206004820152601760248201527f75736572206973206e6f742077686974656c69737465640000000000000000006044820152606401610744565b6001600160a01b03831661101f57853414610f335760405163162908e360e11b815260040160405180910390fd5b60cc546040513060248201526000916001600160a01b031690349060440160408051601f198184030181529181526020820180516001600160e01b031663a1903eab60e01b17905251610f869190611e31565b60006040518083038185875af1925050503d8060008114610fc3576040519150601f19603f3d011682016040523d82523d6000602084013e610fc8565b606091505b50509050806110195760405162461bcd60e51b815260206004820152601760248201527f6c69646f20657468206465706f736974206661696c65640000000000000000006044820152606401610744565b50611098565b6040516323b872dd60e01b8152336004820152306024820152604481018790526001600160a01b038416906323b872dd906064016020604051808303816000875af1158015611072573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110969190611dd7565b505b60d080549060006110a883611e0a565b90915550506040805160a08101825233815260cb549151631920845160e01b815260048101899052909160208301916001600160a01b03909116906319208451906024016020604051808303816000875af115801561110b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061112f9190611dbe565b815260cb54604051631920845160e01b8152600481018a90526020909201916001600160a01b03909116906319208451906024016020604051808303816000875af1158015611182573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111a69190611dbe565b81526020808201879052604091820188905260d08054600090815260d78352839020845181546001600160a01b0319166001600160a01b039182161782558584015160018301558585015160028301556060808701516003840155608096870151600490930192909255915484519081529283018990529282018a90529181018890529085169181019190915233907fd2d20e69c4772a959fae177f20d86f2d40cd940cf11e356d0306670ea7df42279060a00160405180910390a250610b2c6001609955565b6067546001600160a01b0316331461097a5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610744565b606780546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b60606003805461132890611e4d565b80601f016020809104026020016040519081016040528092919081815260200182805461135490611e4d565b80156113a15780601f10611376576101008083540402835291602001916113a1565b820191906000526020600020905b81548152906001019060200180831161138457829003601f168201915b5050505050905090565b60606004805461132890611e4d565b600054610100900460ff166113e15760405162461bcd60e51b815260040161074490611e87565b61097a6114cc565b600054610100900460ff166114105760405162461bcd60e51b815260040161074490611e87565b61097a6114fc565b600054610100900460ff1661143f5760405162461bcd60e51b815260040161074490611e87565b6109648282611523565b60026099540361149b5760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606401610744565b6002609955565b6000806114ae83611572565b90506114be8184604001516115f6565b9392505050565b6001609955565b600054610100900460ff166114f35760405162461bcd60e51b815260040161074490611e87565b61097a336112c7565b600054610100900460ff166114c55760405162461bcd60e51b815260040161074490611e87565b600054610100900460ff1661154a5760405162461bcd60e51b815260040161074490611e87565b60036115568382611f20565b5060046115638282611f20565b50506000600181905560025550565b60006115f07f76bb474a7a9de6f07f692a2e39e53c610f28bd5be9be96837a6a274de347167083600001518460200151805190602001206040516020016115d5939291909283526001600160a01b03919091166020830152604082015260600190565b6040516020818303038152906040528051906020012061161a565b92915050565b60008060006116058585611647565b915091506116128161168c565b509392505050565b60006115f06116276117d6565b8360405161190160f01b8152600281019290925260228201526042902090565b600080825160410361167d5760208301516040840151606085015160001a611671878285856117e5565b94509450505050611685565b506000905060025b9250929050565b60008160048111156116a0576116a0611fe0565b036116a85750565b60018160048111156116bc576116bc611fe0565b036117095760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610744565b600281600481111561171d5761171d611fe0565b0361176a5760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610744565b600381600481111561177e5761177e611fe0565b03610ba95760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b6064820152608401610744565b60006117e06118a9565b905090565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a083111561181c57506000905060036118a0565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa158015611870573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b038116611899576000600192509250506118a0565b9150600090505b94509492505050565b60007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f6118d461191d565b6118dc611976565b60408051602081019490945283019190915260608201524660808201523060a082015260c00160405160208183030381529060405280519060200120905090565b600080611928611319565b80519091501561193f578051602090910120919050565b600154801561194e5792915050565b7fc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a4709250505090565b6000806119816113ab565b805190915015611998578051602090910120919050565b600254801561194e5792915050565b6000602082840312156119b957600080fd5b5035919050565b80356001600160a01b03811681146119d757600080fd5b919050565b6000602082840312156119ee57600080fd5b6114be826119c0565b60008060408385031215611a0a57600080fd5b611a13836119c0565b946020939093013593505050565b8015158114610ba957600080fd5b600060208284031215611a4157600080fd5b81356114be81611a21565b60005b83811015611a67578181015183820152602001611a4f565b50506000910152565b60008151808452611a88816020860160208601611a4c565b601f01601f19169290920160200192915050565b60ff60f81b881681526000602060e081840152611abc60e084018a611a70565b8381036040850152611ace818a611a70565b606085018990526001600160a01b038816608086015260a0850187905284810360c0860152855180825283870192509083019060005b81811015611b2057835183529284019291840191600101611b04565b50909c9b505050505050505050505050565b600080600060408486031215611b4757600080fd5b833567ffffffffffffffff80821115611b5f57600080fd5b818601915086601f830112611b7357600080fd5b813581811115611b8257600080fd5b8760208260051b8501011115611b9757600080fd5b60209283019550935050840135611bad81611a21565b809150509250925092565b60008060008060808587031215611bce57600080fd5b611bd7856119c0565b9350611be5602086016119c0565b9250611bf3604086016119c0565b9150611c01606086016119c0565b905092959194509250565b634e487b7160e01b600052604160045260246000fd5b6040516060810167ffffffffffffffff81118282101715611c4557611c45611c0c565b60405290565b600067ffffffffffffffff80841115611c6657611c66611c0c565b604051601f8501601f19908116603f01168101908282118183101715611c8e57611c8e611c0c565b81604052809350858152868686011115611ca757600080fd5b858560208301376000602087830101525050509392505050565b600080600080600060a08688031215611cd957600080fd5b853594506020860135935060408601359250611cf7606087016119c0565b9150608086013567ffffffffffffffff80821115611d1457600080fd5b908701906060828a031215611d2857600080fd5b611d30611c22565b611d39836119c0565b8152602083013582811115611d4d57600080fd5b8301601f81018b13611d5e57600080fd5b611d6d8b823560208401611c4b565b602083015250604083013582811115611d8557600080fd5b80840193505089601f840112611d9a57600080fd5b611da98a843560208601611c4b565b60408201528093505050509295509295909350565b600060208284031215611dd057600080fd5b5051919050565b600060208284031215611de957600080fd5b81516114be81611a21565b634e487b7160e01b600052603260045260246000fd5b600060018201611e2a57634e487b7160e01b600052601160045260246000fd5b5060010190565b60008251611e43818460208701611a4c565b9190910192915050565b600181811c90821680611e6157607f821691505b602082108103611e8157634e487b7160e01b600052602260045260246000fd5b50919050565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b601f82111561086f57600081815260208120601f850160051c81016020861015611ef95750805b601f850160051c820191505b81811015611f1857828155600101611f05565b505050505050565b815167ffffffffffffffff811115611f3a57611f3a611c0c565b611f4e81611f488454611e4d565b84611ed2565b602080601f831160018114611f835760008415611f6b5750858301515b600019600386901b1c1916600185901b178555611f18565b600085815260208120601f198616915b82811015611fb257888601518255948401946001909101908401611f93565b5085821015611fd05787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b634e487b7160e01b600052602160045260246000fdfea2646970667358221220116e5d82a8767a08290d90420aeb52c099254ac71760a52c8e42390cfc60451c64736f6c63430008120033";

type EnderBondLiquidityDepositConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: EnderBondLiquidityDepositConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class EnderBondLiquidityDeposit__factory extends ContractFactory {
  constructor(...args: EnderBondLiquidityDepositConstructorParams) {
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
      EnderBondLiquidityDeposit & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(
    runner: ContractRunner | null
  ): EnderBondLiquidityDeposit__factory {
    return super.connect(runner) as EnderBondLiquidityDeposit__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): EnderBondLiquidityDepositInterface {
    return new Interface(_abi) as EnderBondLiquidityDepositInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): EnderBondLiquidityDeposit {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as EnderBondLiquidityDeposit;
  }
}
