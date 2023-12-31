/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export declare namespace IEnderBase {
  export type EndRequestStruct = {
    account: AddressLike;
    stakingToken: AddressLike;
    tokenAmt: BigNumberish;
  };

  export type EndRequestStructOutput = [
    account: string,
    stakingToken: string,
    tokenAmt: bigint
  ] & { account: string; stakingToken: string; tokenAmt: bigint };
}

export interface IEnderStrategyInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "checkDeposit"
      | "deposit"
      | "hasRequest"
      | "withdrawRequest"
      | "withdrawStEth"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "checkDeposit",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [IEnderBase.EndRequestStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "hasRequest",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawRequest",
    values: [IEnderBase.EndRequestStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawStEth",
    values: [IEnderBase.EndRequestStruct]
  ): string;

  decodeFunctionResult(
    functionFragment: "checkDeposit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "hasRequest", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "withdrawRequest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawStEth",
    data: BytesLike
  ): Result;
}

export interface IEnderStrategy extends BaseContract {
  connect(runner?: ContractRunner | null): IEnderStrategy;
  waitForDeployment(): Promise<this>;

  interface: IEnderStrategyInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  checkDeposit: TypedContractMethod<
    [arg0: AddressLike, arg1: BigNumberish],
    [boolean],
    "view"
  >;

  deposit: TypedContractMethod<
    [arg0: IEnderBase.EndRequestStruct],
    [bigint],
    "nonpayable"
  >;

  hasRequest: TypedContractMethod<[], [boolean], "view">;

  withdrawRequest: TypedContractMethod<
    [arg0: IEnderBase.EndRequestStruct],
    [void],
    "nonpayable"
  >;

  withdrawStEth: TypedContractMethod<
    [arg0: IEnderBase.EndRequestStruct],
    [bigint],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "checkDeposit"
  ): TypedContractMethod<
    [arg0: AddressLike, arg1: BigNumberish],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "deposit"
  ): TypedContractMethod<
    [arg0: IEnderBase.EndRequestStruct],
    [bigint],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "hasRequest"
  ): TypedContractMethod<[], [boolean], "view">;
  getFunction(
    nameOrSignature: "withdrawRequest"
  ): TypedContractMethod<
    [arg0: IEnderBase.EndRequestStruct],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "withdrawStEth"
  ): TypedContractMethod<
    [arg0: IEnderBase.EndRequestStruct],
    [bigint],
    "nonpayable"
  >;

  filters: {};
}
