/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IInstadappLite,
  IInstadappLiteInterface,
} from "../../../contracts/interfaces/IInstadappLite";

const _abi = [
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
    inputs: [
      {
        internalType: "uint256",
        name: "assets_",
        type: "uint256",
      },
    ],
    name: "withdraw",
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

export class IInstadappLite__factory {
  static readonly abi = _abi;
  static createInterface(): IInstadappLiteInterface {
    return new Interface(_abi) as IInstadappLiteInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): IInstadappLite {
    return new Contract(address, _abi, runner) as unknown as IInstadappLite;
  }
}
