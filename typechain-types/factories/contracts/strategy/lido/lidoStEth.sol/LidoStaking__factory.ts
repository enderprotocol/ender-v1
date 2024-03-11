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
  "0x608060405234801561001057600080fd5b506040516106dc3803806106dc83398181016040528101906100329190610112565b61004c6763ee0c7c7bc4735960c01b6100ac60201b60201c565b61006667e44457bcc558347f60c01b6100ac60201b60201c565b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505061013f565b50565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006100df826100b4565b9050919050565b6100ef816100d4565b81146100fa57600080fd5b50565b60008151905061010c816100e6565b92915050565b600060208284031215610128576101276100af565b5b6000610136848285016100fd565b91505092915050565b61058e8061014e6000396000f3fe60806040526004361061003f5760003560e01c80632e1a7d4d146100445780635bcb2fc61461006d57806399940ece14610077578063d1260edd146100a2575b600080fd5b34801561005057600080fd5b5061006b60048036038101906100669190610360565b6100df565b005b61007561021b565b005b34801561008357600080fd5b5061008c6102e6565b60405161009991906103ce565b60405180910390f35b3480156100ae57600080fd5b506100c960048036038101906100c49190610415565b61030a565b6040516100d69190610451565b60405180910390f35b6100f3672263ba270730797e60c01b610322565b610107677e8e910964c1831c60c01b610322565b61011b677a0fbdc1d78d9f2a60c01b610322565b60003373ffffffffffffffffffffffffffffffffffffffff16826040516101419061049d565b60006040518083038185875af1925050503d806000811461017e576040519150601f19603f3d011682016040523d82523d6000602084013e610183565b606091505b5050905061019b67de25af693016fa6a60c01b610322565b6101af6752f8f567faaed34160c01b610322565b6101c36742025516e5d35d3860c01b610322565b80610203576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101fa9061050f565b60405180910390fd5b610217673678de8430de7d7f60c01b610322565b5050565b61022f67eece00c92ceef29660c01b610322565b610243672460ff525d95ab8560c01b610322565b610257673e97928cc9d28ccb60c01b610322565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166340c10f1933346040518363ffffffff1660e01b81526004016102b292919061052f565b600060405180830381600087803b1580156102cc57600080fd5b505af11580156102e0573d6000803e3d6000fd5b50505050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60016020528060005260406000206000915090505481565b50565b600080fd5b6000819050919050565b61033d8161032a565b811461034857600080fd5b50565b60008135905061035a81610334565b92915050565b60006020828403121561037657610375610325565b5b60006103848482850161034b565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006103b88261038d565b9050919050565b6103c8816103ad565b82525050565b60006020820190506103e360008301846103bf565b92915050565b6103f2816103ad565b81146103fd57600080fd5b50565b60008135905061040f816103e9565b92915050565b60006020828403121561042b5761042a610325565b5b600061043984828501610400565b91505092915050565b61044b8161032a565b82525050565b60006020820190506104666000830184610442565b92915050565b600081905092915050565b50565b600061048760008361046c565b915061049282610477565b600082019050919050565b60006104a88261047a565b9150819050919050565b600082825260208201905092915050565b7f457468207478206661696c656400000000000000000000000000000000000000600082015250565b60006104f9600d836104b2565b9150610504826104c3565b602082019050919050565b60006020820190508181036000830152610528816104ec565b9050919050565b600060408201905061054460008301856103bf565b6105516020830184610442565b939250505056fea26469706673582212200fec9b9233c099d300b5a5d279c540877f3d03900ffa17bf386b6bb105e292c864736f6c63430008120033";

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
