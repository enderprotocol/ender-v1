/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IEnderStaking,
  IEnderStakingInterface,
} from "../../../contracts/interfaces/IEnderStaking";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
    ],
    name: "epochStakingReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IEnderStaking__factory {
  static readonly abi = _abi;
  static createInterface(): IEnderStakingInterface {
    return new Interface(_abi) as IEnderStakingInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): IEnderStaking {
    return new Contract(address, _abi, runner) as unknown as IEnderStaking;
  }
}
