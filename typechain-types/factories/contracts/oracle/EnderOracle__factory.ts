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
  EnderOracle,
  EnderOracleInterface,
} from "../../../contracts/oracle/EnderOracle";

const _abi = [
  {
    inputs: [],
    name: "InvalidParams",
    type: "error",
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
        internalType: "address[]",
        name: "tokens",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "feeds",
        type: "address[]",
      },
    ],
    name: "UpdateFeed",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "getPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "priceDecimal",
        type: "uint8",
      },
    ],
    stateMutability: "view",
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
    name: "priceFeed",
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
        internalType: "address[]",
        name: "_tokens",
        type: "address[]",
      },
      {
        internalType: "address[]",
        name: "_feeds",
        type: "address[]",
      },
    ],
    name: "setFeeds",
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
  "0x608060405234801561001057600080fd5b5061072d806100206000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c80638129fc1c1161005b5780638129fc1c146100fc5780638da5cb5b14610104578063f2fde38b14610115578063f7af4ab41461012857600080fd5b80631fd48b9a1461008257806341976e09146100c8578063715018a6146100f2575b600080fd5b6100ab610090366004610543565b6065602052600090815260409020546001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b6100db6100d6366004610543565b61013b565b6040805192835260ff9091166020830152016100bf565b6100fa61016b565b005b6100fa61017f565b6033546001600160a01b03166100ab565b6100fa610123366004610543565b610295565b6100fa6101363660046105b1565b61030b565b6000806001600160a01b03831661015c5750642794ca240090506012915091565b506305f5e10090506012915091565b610173610421565b61017d600061047b565b565b600054610100900460ff161580801561019f5750600054600160ff909116105b806101b95750303b1580156101b9575060005460ff166001145b6102215760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b60648201526084015b60405180910390fd5b6000805460ff191660011790558015610244576000805461ff0019166101001790555b61024c6104cd565b8015610292576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b50565b61029d610421565b6001600160a01b0381166103025760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610218565b6102928161047b565b610313610421565b8215806103205750828114155b1561033e57604051635435b28960e11b815260040160405180910390fd5b60005b60ff81168411156103dd5782828260ff168181106103615761036161061d565b90506020020160208101906103769190610543565b6065600087878560ff1681811061038f5761038f61061d565b90506020020160208101906103a49190610543565b6001600160a01b039081168252602082019290925260400160002080546001600160a01b03191692909116919091179055600101610341565b507fe9b71ccdf7027fc35a2b117d5ad8bfd3f94fe9996e77f4ff4697af7f2a6271e184848484604051610413949392919061067a565b60405180910390a150505050565b6033546001600160a01b0316331461017d5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610218565b603380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b600054610100900460ff166104f45760405162461bcd60e51b8152600401610218906106ac565b61017d600054610100900460ff1661051e5760405162461bcd60e51b8152600401610218906106ac565b61017d3361047b565b80356001600160a01b038116811461053e57600080fd5b919050565b60006020828403121561055557600080fd5b61055e82610527565b9392505050565b60008083601f84011261057757600080fd5b50813567ffffffffffffffff81111561058f57600080fd5b6020830191508360208260051b85010111156105aa57600080fd5b9250929050565b600080600080604085870312156105c757600080fd5b843567ffffffffffffffff808211156105df57600080fd5b6105eb88838901610565565b9096509450602087013591508082111561060457600080fd5b5061061187828801610565565b95989497509550505050565b634e487b7160e01b600052603260045260246000fd5b8183526000602080850194508260005b8581101561066f576001600160a01b0361065c83610527565b1687529582019590820190600101610643565b509495945050505050565b60408152600061068e604083018688610633565b82810360208401526106a1818587610633565b979650505050505050565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b60608201526080019056fea2646970667358221220b8e16688b38d9e81b9005a20050074be6eb90cbbdbf5bc44e24fd1eb042c75a764736f6c63430008120033";

type EnderOracleConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: EnderOracleConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class EnderOracle__factory extends ContractFactory {
  constructor(...args: EnderOracleConstructorParams) {
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
      EnderOracle & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): EnderOracle__factory {
    return super.connect(runner) as EnderOracle__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): EnderOracleInterface {
    return new Interface(_abi) as EnderOracleInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): EnderOracle {
    return new Contract(address, _abi, runner) as unknown as EnderOracle;
  }
}
