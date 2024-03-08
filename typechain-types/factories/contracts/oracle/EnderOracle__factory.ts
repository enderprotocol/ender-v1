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
  "0x608060405234801561001057600080fd5b50610fe5806100206000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c80638129fc1c1161005b5780638129fc1c146100ed5780638da5cb5b146100f7578063f2fde38b14610115578063f7af4ab4146101315761007d565b80631fd48b9a1461008257806341976e09146100b2578063715018a6146100e3575b600080fd5b61009c60048036038101906100979190610a54565b61014d565b6040516100a99190610a90565b60405180910390f35b6100cc60048036038101906100c79190610a54565b610180565b6040516100da929190610ae0565b60405180910390f35b6100eb61028d565b005b6100f56102a1565b005b6100ff610443565b60405161010c9190610a90565b60405180910390f35b61012f600480360381019061012a9190610a54565b61046d565b005b61014b60048036038101906101469190610b6e565b6104f0565b005b60656020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008061019767585b5561896c345f60c01b6107b5565b6101ab675cd9d3137747e05a60c01b6107b5565b6101bf676fd75f3ac81842b760c01b6107b5565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff160361024057610207676b4cf1e8e111964d60c01b6107b5565b61021b67fd9e773317a1ae4760c01b6107b5565b642794ca240091506102376719c81d2df64274d560c01b6107b5565b60129050610288565b6102546769c59e3e319289a760c01b6107b5565b61026867514bdcc3f0f2f3fe60c01b6107b5565b6305f5e100915061028367b63c874664caa56260c01b6107b5565b601290505b915091565b6102956107b8565b61029f6000610836565b565b6102b567b104ad2cbf39b52760c01b6107b5565b60008060019054906101000a900460ff161590508080156102e65750600160008054906101000a900460ff1660ff16105b8061031357506102f5306108fc565b1580156103125750600160008054906101000a900460ff1660ff16145b5b610352576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161034990610c72565b60405180910390fd5b60016000806101000a81548160ff021916908360ff160217905550801561038f576001600060016101000a81548160ff0219169083151502179055505b6103a3673a624288a8162d5760c01b6107b5565b6103b767ca88d4aa9421841960c01b6107b5565b6103cb6774f98459a028b91f60c01b6107b5565b6103df67a32d46856dc74a3660c01b6107b5565b6103e761091f565b80156104405760008060016101000a81548160ff0219169083151502179055507f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb384740249860016040516104379190610cd7565b60405180910390a15b50565b6000603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6104756107b8565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036104e4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104db90610d64565b60405180910390fd5b6104ed81610836565b50565b61050467aefce87bfb27290360c01b6107b5565b61050c6107b8565b6105206768fda9c94dafc46360c01b6107b5565b61053467615cde17378d1c6060c01b6107b5565b61054867c0e677c4870e989960c01b6107b5565b61055c67fd326994c0587abf60c01b6107b5565b60008484905014801561057f575061057e67b4a6d52f5f14dc4e60c01b610978565b5b806105ac57508181905084849050141580156105ab57506105aa679b233674ea76cdb760c01b610978565b5b5b156105f7576105c56740007a777627797060c01b6107b5565b6040517fa86b651200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b61060b675df0d02e6861c5b560c01b6107b5565b61061f67759db7a16755080660c01b6107b5565b61063367370b87eeba9a77c560c01b6107b5565b610647675f81cfa4790e579e60c01b6107b5565b60005b848490508160ff1610156107495761066c67bf9277d16bacd33260c01b6107b5565b82828260ff1681811061068257610681610d84565b5b90506020020160208101906106979190610a54565b6065600087878560ff168181106106b1576106b0610d84565b5b90506020020160208101906106c69190610a54565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600101905061064a565b5061075e678c1c7084ddd0289960c01b6107b5565b61077267fc033aee4d5218c460c01b6107b5565b7fe9b71ccdf7027fc35a2b117d5ad8bfd3f94fe9996e77f4ff4697af7f2a6271e1848484846040516107a79493929190610e76565b60405180910390a150505050565b50565b6107c0610983565b73ffffffffffffffffffffffffffffffffffffffff166107de610443565b73ffffffffffffffffffffffffffffffffffffffff1614610834576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161082b90610efd565b60405180910390fd5b565b6000603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081603360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b600060019054906101000a900460ff1661096e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161096590610f8f565b60405180910390fd5b61097661098b565b565b600060019050919050565b600033905090565b600060019054906101000a900460ff166109da576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109d190610f8f565b60405180910390fd5b6109ea6109e5610983565b610836565b565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610a21826109f6565b9050919050565b610a3181610a16565b8114610a3c57600080fd5b50565b600081359050610a4e81610a28565b92915050565b600060208284031215610a6a57610a696109ec565b5b6000610a7884828501610a3f565b91505092915050565b610a8a81610a16565b82525050565b6000602082019050610aa56000830184610a81565b92915050565b6000819050919050565b610abe81610aab565b82525050565b600060ff82169050919050565b610ada81610ac4565b82525050565b6000604082019050610af56000830185610ab5565b610b026020830184610ad1565b9392505050565b600080fd5b600080fd5b600080fd5b60008083601f840112610b2e57610b2d610b09565b5b8235905067ffffffffffffffff811115610b4b57610b4a610b0e565b5b602083019150836020820283011115610b6757610b66610b13565b5b9250929050565b60008060008060408587031215610b8857610b876109ec565b5b600085013567ffffffffffffffff811115610ba657610ba56109f1565b5b610bb287828801610b18565b9450945050602085013567ffffffffffffffff811115610bd557610bd46109f1565b5b610be187828801610b18565b925092505092959194509250565b600082825260208201905092915050565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b6000610c5c602e83610bef565b9150610c6782610c00565b604082019050919050565b60006020820190508181036000830152610c8b81610c4f565b9050919050565b6000819050919050565b6000819050919050565b6000610cc1610cbc610cb784610c92565b610c9c565b610ac4565b9050919050565b610cd181610ca6565b82525050565b6000602082019050610cec6000830184610cc8565b92915050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b6000610d4e602683610bef565b9150610d5982610cf2565b604082019050919050565b60006020820190508181036000830152610d7d81610d41565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600082825260208201905092915050565b6000819050919050565b610dd781610a16565b82525050565b6000610de98383610dce565b60208301905092915050565b6000610e046020840184610a3f565b905092915050565b6000602082019050919050565b6000610e258385610db3565b9350610e3082610dc4565b8060005b85811015610e6957610e468284610df5565b610e508882610ddd565b9750610e5b83610e0c565b925050600181019050610e34565b5085925050509392505050565b60006040820190508181036000830152610e91818688610e19565b90508181036020830152610ea6818486610e19565b905095945050505050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b6000610ee7602083610bef565b9150610ef282610eb1565b602082019050919050565b60006020820190508181036000830152610f1681610eda565b9050919050565b7f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960008201527f6e697469616c697a696e67000000000000000000000000000000000000000000602082015250565b6000610f79602b83610bef565b9150610f8482610f1d565b604082019050919050565b60006020820190508181036000830152610fa881610f6c565b905091905056fea26469706673582212204d7173436f80d71afa6df017c729681a3368e751e7793688380cc7b4579b504d64736f6c63430008120033";

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
