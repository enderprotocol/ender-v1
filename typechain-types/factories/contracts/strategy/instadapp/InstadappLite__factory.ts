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
import type { NonPayableOverrides } from "../../../../common";
import type {
  InstadappLite,
  InstadappLiteInterface,
} from "../../../../contracts/strategy/instadapp/InstadappLite";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_stEth",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "apy",
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
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "deposit",
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
    name: "userData",
    outputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "depositTime",
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
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "address",
        name: "_too",
        type: "address",
      },
    ],
    name: "withdraw",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6080604052610fa060025534801561001657600080fd5b506040516105303803806105308339810160408190526100359161005a565b600180546001600160a01b0319166001600160a01b039290921691909117905561008a565b60006020828403121561006c57600080fd5b81516001600160a01b038116811461008357600080fd5b9392505050565b610497806100996000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c80633bcfc4b81461005c5780636e553f651461007857806399940ece1461008d578063b460af94146100b8578063c8910913146100cb575b600080fd5b61006560025481565b6040519081526020015b60405180910390f35b61008b61008636600461034d565b610107565b005b6001546100a0906001600160a01b031681565b6040516001600160a01b03909116815260200161006f565b6100656100c6366004610379565b6101bd565b6100f26100d93660046103b5565b6000602081905290815260409020805460019091015482565b6040805192835260208301919091520161006f565b6001546040516323b872dd60e01b81526001600160a01b03838116600483015230602483015260448201859052909116906323b872dd906064016020604051808303816000875af1158015610160573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061018491906103d7565b506040805180820182529283524260208085019182526001600160a01b0390931660009081529283905291209151825551600190910155565b33600090815260208181526040808320815180830190925280548252600101549181018290529082906502de41353000906101f8904261040f565b83516002546102079190610428565b6102119190610428565b61021b919061043f565b6040805180820182526000808252602080830182815233808452918390529184902092518355905160019283015590548551925163a9059cbb60e01b8152600481019290925260248201929092529192506001600160a01b03169063a9059cbb906044016020604051808303816000875af115801561029e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102c291906103d7565b506001546040516340c10f1960e01b8152336004820152602481018390526001600160a01b03909116906340c10f1990604401600060405180830381600087803b15801561030f57600080fd5b505af1158015610323573d6000803e3d6000fd5b509298975050505050505050565b80356001600160a01b038116811461034857600080fd5b919050565b6000806040838503121561036057600080fd5b8235915061037060208401610331565b90509250929050565b60008060006060848603121561038e57600080fd5b8335925061039e60208501610331565b91506103ac60408501610331565b90509250925092565b6000602082840312156103c757600080fd5b6103d082610331565b9392505050565b6000602082840312156103e957600080fd5b815180151581146103d057600080fd5b634e487b7160e01b600052601160045260246000fd5b81810381811115610422576104226103f9565b92915050565b8082028115828204841417610422576104226103f9565b60008261045c57634e487b7160e01b600052601260045260246000fd5b50049056fea2646970667358221220ea104c86a8bae586a31f54b6c5890d7d2a002fc8bcf8c168ca999e784f7ad97464736f6c63430008120033";

type InstadappLiteConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: InstadappLiteConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class InstadappLite__factory extends ContractFactory {
  constructor(...args: InstadappLiteConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _stEth: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(_stEth, overrides || {});
  }
  override deploy(
    _stEth: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(_stEth, overrides || {}) as Promise<
      InstadappLite & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): InstadappLite__factory {
    return super.connect(runner) as InstadappLite__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): InstadappLiteInterface {
    return new Interface(_abi) as InstadappLiteInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): InstadappLite {
    return new Contract(address, _abi, runner) as unknown as InstadappLite;
  }
}
