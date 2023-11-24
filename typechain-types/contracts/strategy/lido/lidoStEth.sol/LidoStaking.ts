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
} from "../../../../common";

export interface LidoStakingInterface extends Interface {
  getFunction(
    nameOrSignature: "stEth" | "submit" | "userDeposit" | "withdraw"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "stEth", values?: undefined): string;
  encodeFunctionData(functionFragment: "submit", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "userDeposit",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "stEth", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "submit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "userDeposit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
}

export interface LidoStaking extends BaseContract {
  connect(runner?: ContractRunner | null): LidoStaking;
  waitForDeployment(): Promise<this>;

  interface: LidoStakingInterface;

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

  stEth: TypedContractMethod<[], [string], "view">;

  submit: TypedContractMethod<[], [void], "payable">;

  userDeposit: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;

  withdraw: TypedContractMethod<[_amount: BigNumberish], [void], "nonpayable">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "stEth"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "submit"
  ): TypedContractMethod<[], [void], "payable">;
  getFunction(
    nameOrSignature: "userDeposit"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "withdraw"
  ): TypedContractMethod<[_amount: BigNumberish], [void], "nonpayable">;

  filters: {};
}
