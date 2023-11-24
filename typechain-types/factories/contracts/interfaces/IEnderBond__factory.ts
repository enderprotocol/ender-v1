/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IEnderBond,
  IEnderBondInterface,
} from "../../../contracts/interfaces/IEnderBond";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "calculateBondRewardAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "_reward",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "deductFeesFromTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "endMint",
    outputs: [
      {
        internalType: "uint256",
        name: "_endMint",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_reward",
        type: "uint256",
      },
    ],
    name: "epochRewardShareIndex",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_reward",
        type: "uint256",
      },
    ],
    name: "epochRewardShareIndexForSend",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getLoopCount",
    outputs: [
      {
        internalType: "uint256",
        name: "amountRequired",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "resetEndMint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IEnderBond__factory {
  static readonly abi = _abi;
  static createInterface(): IEnderBondInterface {
    return new Interface(_abi) as IEnderBondInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): IEnderBond {
    return new Contract(address, _abi, runner) as unknown as IEnderBond;
  }
}
