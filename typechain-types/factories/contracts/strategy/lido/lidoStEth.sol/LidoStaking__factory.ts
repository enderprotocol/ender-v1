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
  "0x608060405234801561000f575f80fd5b506040516102d13803806102d183398101604081905261002e91610052565b5f80546001600160a01b0319166001600160a01b039290921691909117905561007f565b5f60208284031215610062575f80fd5b81516001600160a01b0381168114610078575f80fd5b9392505050565b6102458061008c5f395ff3fe60806040526004361061003e575f3560e01c80632e1a7d4d146100425780635bcb2fc61461006357806399940ece1461006b578063d1260edd146100a6575b5f80fd5b34801561004d575f80fd5b5061006161005c3660046101cb565b6100df565b005b61006161016c565b348015610076575f80fd5b505f54610089906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b3480156100b1575f80fd5b506100d16100c03660046101e2565b60016020525f908152604090205481565b60405190815260200161009d565b6040515f90339083908381818185875af1925050503d805f811461011e576040519150601f19603f3d011682016040523d82523d5f602084013e610123565b606091505b50509050806101685760405162461bcd60e51b815260206004820152600d60248201526c115d1a081d1e0819985a5b1959609a1b604482015260640160405180910390fd5b5050565b5f546040516340c10f1960e01b81523360048201523460248201526001600160a01b03909116906340c10f19906044015f604051808303815f87803b1580156101b3575f80fd5b505af11580156101c5573d5f803e3d5ffd5b50505050565b5f602082840312156101db575f80fd5b5035919050565b5f602082840312156101f2575f80fd5b81356001600160a01b0381168114610208575f80fd5b939250505056fea26469706673582212204de69761045f9a29a194778cc0bbd9774b68ed93f203efaf772f61d08c3bfdad64736f6c63430008140033";

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
