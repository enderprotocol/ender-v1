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
  EigenLayerStaking,
  EigenLayerStakingInterface,
} from "../../../../../contracts/strategy/eigenlayer/eigenLayer.sol/EigenLayerStaking";

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
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6080604052610fa060025534801561001657600080fd5b50604051610a75380380610a7583398181016040528101906100389190610119565b610052671b1aeea9e1def84b60c01b6100b360201b60201c565b61006c67ee257ff610037ae160c01b6100b360201b60201c565b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050610146565b50565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006100e6826100bb565b9050919050565b6100f6816100db565b811461010157600080fd5b50565b600081519050610113816100ed565b92915050565b60006020828403121561012f5761012e6100b6565b5b600061013d84828501610104565b91505092915050565b610920806101556000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c80633bcfc4b81461005c5780633ccfd60b1461007a57806399940ece14610084578063b6b55f25146100a2578063c8910913146100be575b600080fd5b6100646100ef565b60405161007191906105c9565b60405180910390f35b6100826100f5565b005b61008c610403565b6040516100999190610625565b60405180910390f35b6100bc60048036038101906100b79190610671565b610429565b005b6100d860048036038101906100d391906106ca565b610589565b6040516100e69291906106f7565b60405180910390f35b60025481565b61010967fe8729482620f47060c01b6105ad565b61011d67e8ea351320fe1b1160c01b6105ad565b6101316769c728204ef991e660c01b6105ad565b60008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206040518060400160405290816000820154815260200160018201548152505090506101a6674a22d00731622b5860c01b6105ad565b6101ba67ad24e64f6efdb27060c01b6105ad565b60006502de413530008260200151426101d3919061074f565b83600001516002546101e59190610783565b6101ef9190610783565b6101f991906107f4565b905061020f676a5ccf911a707a8860c01b6105ad565b60405180604001604052806000815260200160008152506000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082015181600001556020820151816001015590505061028f6776505d74f6f8f00260c01b6105ad565b6102a367da24a96f1b07c51960c01b6105ad565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb3384600001516040518363ffffffff1660e01b8152600401610304929190610825565b6020604051808303816000875af1158015610323573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103479190610886565b5061035c67c4e63b4e4ef4aaac60c01b6105ad565b61037067b63c16ee94edc7fa60c01b6105ad565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166340c10f1933836040518363ffffffff1660e01b81526004016103cd929190610825565b600060405180830381600087803b1580156103e757600080fd5b505af11580156103fb573d6000803e3d6000fd5b505050505050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b61043d679c627878c281420b60c01b6105ad565b610451674cd5016123cd7f0160c01b6105ad565b61046567c19381e4783565b460c01b6105ad565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd3330846040518463ffffffff1660e01b81526004016104c4939291906108b3565b6020604051808303816000875af11580156104e3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105079190610886565b5061051c6738204816685d2f5e60c01b6105ad565b6040518060400160405280828152602001428152506000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082015181600001556020820151816001015590505050565b60006020528060005260406000206000915090508060000154908060010154905082565b50565b6000819050919050565b6105c3816105b0565b82525050565b60006020820190506105de60008301846105ba565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061060f826105e4565b9050919050565b61061f81610604565b82525050565b600060208201905061063a6000830184610616565b92915050565b600080fd5b61064e816105b0565b811461065957600080fd5b50565b60008135905061066b81610645565b92915050565b60006020828403121561068757610686610640565b5b60006106958482850161065c565b91505092915050565b6106a781610604565b81146106b257600080fd5b50565b6000813590506106c48161069e565b92915050565b6000602082840312156106e0576106df610640565b5b60006106ee848285016106b5565b91505092915050565b600060408201905061070c60008301856105ba565b61071960208301846105ba565b9392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061075a826105b0565b9150610765836105b0565b925082820390508181111561077d5761077c610720565b5b92915050565b600061078e826105b0565b9150610799836105b0565b92508282026107a7816105b0565b915082820484148315176107be576107bd610720565b5b5092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b60006107ff826105b0565b915061080a836105b0565b92508261081a576108196107c5565b5b828204905092915050565b600060408201905061083a6000830185610616565b61084760208301846105ba565b9392505050565b60008115159050919050565b6108638161084e565b811461086e57600080fd5b50565b6000815190506108808161085a565b92915050565b60006020828403121561089c5761089b610640565b5b60006108aa84828501610871565b91505092915050565b60006060820190506108c86000830186610616565b6108d56020830185610616565b6108e260408301846105ba565b94935050505056fea26469706673582212208cc5617f5fcc274932557a8ce612e4eca2412b2463f00b920ba804fd490d8e5164736f6c63430008120033";

type EigenLayerStakingConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: EigenLayerStakingConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class EigenLayerStaking__factory extends ContractFactory {
  constructor(...args: EigenLayerStakingConstructorParams) {
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
      EigenLayerStaking & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): EigenLayerStaking__factory {
    return super.connect(runner) as EigenLayerStaking__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): EigenLayerStakingInterface {
    return new Interface(_abi) as EigenLayerStakingInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): EigenLayerStaking {
    return new Contract(address, _abi, runner) as unknown as EigenLayerStaking;
  }
}
