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
  LidoStaking,
  LidoStakingInterface,
} from "../../../../../contracts/strategy/lido/lidoStEth.sol/LidoStaking";

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
    inputs: [],
    name: "submit",
    outputs: [],
    stateMutability: "payable",
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
    name: "userDeposit",
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
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b506040516102ed3803806102ed83398101604081905261002f91610054565b600080546001600160a01b0319166001600160a01b0392909216919091179055610084565b60006020828403121561006657600080fd5b81516001600160a01b038116811461007d57600080fd5b9392505050565b61025a806100936000396000f3fe60806040526004361061003f5760003560e01c80632e1a7d4d146100445780635bcb2fc61461006657806399940ece1461006e578063d1260edd146100ab575b600080fd5b34801561005057600080fd5b5061006461005f3660046101db565b6100e6565b005b610064610176565b34801561007a57600080fd5b5060005461008e906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b3480156100b757600080fd5b506100d86100c63660046101f4565b60016020526000908152604090205481565b6040519081526020016100a2565b604051600090339083908381818185875af1925050503d8060008114610128576040519150601f19603f3d011682016040523d82523d6000602084013e61012d565b606091505b50509050806101725760405162461bcd60e51b815260206004820152600d60248201526c115d1a081d1e0819985a5b1959609a1b604482015260640160405180910390fd5b5050565b6000546040516340c10f1960e01b81523360048201523460248201526001600160a01b03909116906340c10f1990604401600060405180830381600087803b1580156101c157600080fd5b505af11580156101d5573d6000803e3d6000fd5b50505050565b6000602082840312156101ed57600080fd5b5035919050565b60006020828403121561020657600080fd5b81356001600160a01b038116811461021d57600080fd5b939250505056fea2646970667358221220401e7405f25dfc8e21fb698a457ad52a0f89be7ebbfc6c8bc1419491cc17210e64736f6c63430008120033";

type LidoStakingConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: LidoStakingConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class LidoStaking__factory extends ContractFactory {
  constructor(...args: LidoStakingConstructorParams) {
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
      LidoStaking & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): LidoStaking__factory {
    return super.connect(runner) as LidoStaking__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): LidoStakingInterface {
    return new Interface(_abi) as LidoStakingInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): LidoStaking {
    return new Contract(address, _abi, runner) as unknown as LidoStaking;
  }
}
