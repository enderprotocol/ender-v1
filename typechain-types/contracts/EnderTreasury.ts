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
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../common";

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

export interface EnderTreasuryInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "availableFundsPercentage"
      | "balanceLastEpoch"
      | "bondYieldBaseRate"
      | "calculateDepositReturn"
      | "checkDeposit"
      | "collect"
      | "deposit"
      | "depositInStrategy"
      | "depositTreasury"
      | "eigenLayer"
      | "enderStaking"
      | "epochDeposit"
      | "epochWithdrawl"
      | "fundsInfo"
      | "getAddress"
      | "getQueueBlock"
      | "hasRequest"
      | "initialize"
      | "initializeTreasury"
      | "instaDappDepositValuations"
      | "instaDappLastValuation"
      | "instaDappWithdrawlValuations"
      | "instadapp"
      | "lybraFinance"
      | "mintEndToUser"
      | "nominalYield"
      | "owner"
      | "priorityStrategy"
      | "renounceOwnership"
      | "reserveFundsPercentage"
      | "setAddress"
      | "setAddressBase"
      | "setBondYieldBaseRate"
      | "setNominalYield"
      | "setPriorityStrategy"
      | "setStrategy"
      | "setTokenStrategy"
      | "stakeRebasingReward"
      | "strategies"
      | "strategy"
      | "strategyToReceiptToken"
      | "tokenStrategy"
      | "totalAssetStakedInStrategy"
      | "totalRewardsFromStrategy"
      | "transferOwnership"
      | "treasury"
      | "withdraw"
      | "withdrawFromStrategy"
      | "withdrawRequest"
      | "withdrawStEth"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "AddressUpdated"
      | "BondYieldBaseRateUpdated"
      | "Collect"
      | "Initialized"
      | "MintEndToUser"
      | "NominalYieldUpdated"
      | "OwnershipTransferred"
      | "PriorityStrategyUpdated"
      | "StrategyDeposit"
      | "StrategyUpdated"
      | "StrategyWithdraw"
      | "TreasuryDeposit"
      | "TreasuryWithdraw"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "availableFundsPercentage",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "balanceLastEpoch",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "bondYieldBaseRate",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "calculateDepositReturn",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "checkDeposit",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "collect",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [IEnderBase.EndRequestStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "depositInStrategy",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "depositTreasury",
    values: [IEnderBase.EndRequestStruct, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "eigenLayer",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "enderStaking",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "epochDeposit",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "epochWithdrawl",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "fundsInfo",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getAddress",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getQueueBlock",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "hasRequest",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "initializeTreasury",
    values: [
      AddressLike,
      AddressLike,
      AddressLike,
      AddressLike,
      AddressLike,
      AddressLike,
      BigNumberish,
      BigNumberish,
      AddressLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "instaDappDepositValuations",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "instaDappLastValuation",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "instaDappWithdrawlValuations",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "instadapp", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "lybraFinance",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "mintEndToUser",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "nominalYield",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "priorityStrategy",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "reserveFundsPercentage",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setAddress",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setAddressBase",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setBondYieldBaseRate",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setNominalYield",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setPriorityStrategy",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setStrategy",
    values: [AddressLike[], boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "setTokenStrategy",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "stakeRebasingReward",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "strategies",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "strategy", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "strategyToReceiptToken",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenStrategy",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "totalAssetStakedInStrategy",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "totalRewardsFromStrategy",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "treasury", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [IEnderBase.EndRequestStruct, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawFromStrategy",
    values: [AddressLike, AddressLike, BigNumberish]
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
    functionFragment: "availableFundsPercentage",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "balanceLastEpoch",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "bondYieldBaseRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calculateDepositReturn",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "checkDeposit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "collect", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "depositInStrategy",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "depositTreasury",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "eigenLayer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "enderStaking",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "epochDeposit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "epochWithdrawl",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "fundsInfo", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getAddress", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getQueueBlock",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "hasRequest", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "initializeTreasury",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "instaDappDepositValuations",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "instaDappLastValuation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "instaDappWithdrawlValuations",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "instadapp", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "lybraFinance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "mintEndToUser",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "nominalYield",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "priorityStrategy",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "reserveFundsPercentage",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setAddress", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setAddressBase",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setBondYieldBaseRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setNominalYield",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPriorityStrategy",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setStrategy",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setTokenStrategy",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "stakeRebasingReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "strategies", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "strategy", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "strategyToReceiptToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tokenStrategy",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalAssetStakedInStrategy",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalRewardsFromStrategy",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "treasury", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "withdrawFromStrategy",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawRequest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawStEth",
    data: BytesLike
  ): Result;
}

export namespace AddressUpdatedEvent {
  export type InputTuple = [newAddr: AddressLike, addrType: BigNumberish];
  export type OutputTuple = [newAddr: string, addrType: bigint];
  export interface OutputObject {
    newAddr: string;
    addrType: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace BondYieldBaseRateUpdatedEvent {
  export type InputTuple = [bondYieldBaseRate: BigNumberish];
  export type OutputTuple = [bondYieldBaseRate: bigint];
  export interface OutputObject {
    bondYieldBaseRate: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace CollectEvent {
  export type InputTuple = [account: AddressLike, amount: BigNumberish];
  export type OutputTuple = [account: string, amount: bigint];
  export interface OutputObject {
    account: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace InitializedEvent {
  export type InputTuple = [version: BigNumberish];
  export type OutputTuple = [version: bigint];
  export interface OutputObject {
    version: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace MintEndToUserEvent {
  export type InputTuple = [to: AddressLike, amount: BigNumberish];
  export type OutputTuple = [to: string, amount: bigint];
  export interface OutputObject {
    to: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace NominalYieldUpdatedEvent {
  export type InputTuple = [nominalYield: BigNumberish];
  export type OutputTuple = [nominalYield: bigint];
  export interface OutputObject {
    nominalYield: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PriorityStrategyUpdatedEvent {
  export type InputTuple = [priorityStrategy: AddressLike];
  export type OutputTuple = [priorityStrategy: string];
  export interface OutputObject {
    priorityStrategy: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace StrategyDepositEvent {
  export type InputTuple = [
    asset: AddressLike,
    strategy: AddressLike,
    amount: BigNumberish
  ];
  export type OutputTuple = [asset: string, strategy: string, amount: bigint];
  export interface OutputObject {
    asset: string;
    strategy: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace StrategyUpdatedEvent {
  export type InputTuple = [strategy: AddressLike, isActive: boolean];
  export type OutputTuple = [strategy: string, isActive: boolean];
  export interface OutputObject {
    strategy: string;
    isActive: boolean;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace StrategyWithdrawEvent {
  export type InputTuple = [
    asset: AddressLike,
    strategy: AddressLike,
    amount: BigNumberish
  ];
  export type OutputTuple = [asset: string, strategy: string, amount: bigint];
  export interface OutputObject {
    asset: string;
    strategy: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace TreasuryDepositEvent {
  export type InputTuple = [asset: AddressLike, amount: BigNumberish];
  export type OutputTuple = [asset: string, amount: bigint];
  export interface OutputObject {
    asset: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace TreasuryWithdrawEvent {
  export type InputTuple = [asset: AddressLike, amount: BigNumberish];
  export type OutputTuple = [asset: string, amount: bigint];
  export interface OutputObject {
    asset: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface EnderTreasury extends BaseContract {
  connect(runner?: ContractRunner | null): EnderTreasury;
  waitForDeployment(): Promise<this>;

  interface: EnderTreasuryInterface;

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

  availableFundsPercentage: TypedContractMethod<[], [bigint], "view">;

  balanceLastEpoch: TypedContractMethod<[], [bigint], "view">;

  bondYieldBaseRate: TypedContractMethod<[], [bigint], "view">;

  calculateDepositReturn: TypedContractMethod<
    [_stEthAddress: AddressLike],
    [bigint],
    "view"
  >;

  checkDeposit: TypedContractMethod<
    [depositToken: AddressLike, depositAmt: BigNumberish],
    [boolean],
    "view"
  >;

  collect: TypedContractMethod<
    [account: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  deposit: TypedContractMethod<
    [param: IEnderBase.EndRequestStruct],
    [bigint],
    "nonpayable"
  >;

  depositInStrategy: TypedContractMethod<
    [_asset: AddressLike, _strategy: AddressLike, _depositAmt: BigNumberish],
    [void],
    "nonpayable"
  >;

  depositTreasury: TypedContractMethod<
    [param: IEnderBase.EndRequestStruct, amountRequired: BigNumberish],
    [void],
    "nonpayable"
  >;

  eigenLayer: TypedContractMethod<[], [string], "view">;

  enderStaking: TypedContractMethod<[], [string], "view">;

  epochDeposit: TypedContractMethod<[], [bigint], "view">;

  epochWithdrawl: TypedContractMethod<[], [bigint], "view">;

  fundsInfo: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;

  getAddress: TypedContractMethod<[_type: BigNumberish], [string], "view">;

  getQueueBlock: TypedContractMethod<[account: AddressLike], [bigint], "view">;

  hasRequest: TypedContractMethod<[], [boolean], "view">;

  initialize: TypedContractMethod<
    [_treasury: AddressLike, _strategy: AddressLike],
    [void],
    "nonpayable"
  >;

  initializeTreasury: TypedContractMethod<
    [
      _endToken: AddressLike,
      _enderStaking: AddressLike,
      _bond: AddressLike,
      _instadapp: AddressLike,
      _lybraFinance: AddressLike,
      _eigenLayer: AddressLike,
      _availableFundsPercentage: BigNumberish,
      _reserveFundsPercentage: BigNumberish,
      _oracle: AddressLike
    ],
    [void],
    "nonpayable"
  >;

  instaDappDepositValuations: TypedContractMethod<[], [bigint], "view">;

  instaDappLastValuation: TypedContractMethod<[], [bigint], "view">;

  instaDappWithdrawlValuations: TypedContractMethod<[], [bigint], "view">;

  instadapp: TypedContractMethod<[], [string], "view">;

  lybraFinance: TypedContractMethod<[], [string], "view">;

  mintEndToUser: TypedContractMethod<
    [_to: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  nominalYield: TypedContractMethod<[], [bigint], "view">;

  owner: TypedContractMethod<[], [string], "view">;

  priorityStrategy: TypedContractMethod<[], [string], "view">;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  reserveFundsPercentage: TypedContractMethod<[], [bigint], "view">;

  setAddress: TypedContractMethod<
    [_addr: AddressLike, _type: BigNumberish],
    [void],
    "nonpayable"
  >;

  setAddressBase: TypedContractMethod<
    [_addr: AddressLike, _type: BigNumberish],
    [void],
    "nonpayable"
  >;

  setBondYieldBaseRate: TypedContractMethod<
    [_newBaseRate: BigNumberish],
    [void],
    "nonpayable"
  >;

  setNominalYield: TypedContractMethod<
    [_nominalYield: BigNumberish],
    [void],
    "nonpayable"
  >;

  setPriorityStrategy: TypedContractMethod<
    [_priorityStrategy: AddressLike],
    [void],
    "nonpayable"
  >;

  setStrategy: TypedContractMethod<
    [_strs: AddressLike[], _flag: boolean],
    [void],
    "nonpayable"
  >;

  setTokenStrategy: TypedContractMethod<
    [_str: AddressLike],
    [void],
    "nonpayable"
  >;

  stakeRebasingReward: TypedContractMethod<
    [_tokenAddress: AddressLike],
    [bigint],
    "nonpayable"
  >;

  strategies: TypedContractMethod<[arg0: AddressLike], [boolean], "view">;

  strategy: TypedContractMethod<[], [string], "view">;

  strategyToReceiptToken: TypedContractMethod<
    [arg0: AddressLike],
    [string],
    "view"
  >;

  tokenStrategy: TypedContractMethod<[], [string], "view">;

  totalAssetStakedInStrategy: TypedContractMethod<
    [arg0: AddressLike],
    [bigint],
    "view"
  >;

  totalRewardsFromStrategy: TypedContractMethod<
    [arg0: AddressLike],
    [bigint],
    "view"
  >;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  treasury: TypedContractMethod<[], [string], "view">;

  withdraw: TypedContractMethod<
    [param: IEnderBase.EndRequestStruct, amountRequired: BigNumberish],
    [void],
    "nonpayable"
  >;

  withdrawFromStrategy: TypedContractMethod<
    [_asset: AddressLike, _strategy: AddressLike, _withdrawAmt: BigNumberish],
    [bigint],
    "nonpayable"
  >;

  withdrawRequest: TypedContractMethod<
    [param: IEnderBase.EndRequestStruct],
    [void],
    "nonpayable"
  >;

  withdrawStEth: TypedContractMethod<
    [param: IEnderBase.EndRequestStruct],
    [bigint],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "availableFundsPercentage"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "balanceLastEpoch"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "bondYieldBaseRate"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "calculateDepositReturn"
  ): TypedContractMethod<[_stEthAddress: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "checkDeposit"
  ): TypedContractMethod<
    [depositToken: AddressLike, depositAmt: BigNumberish],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "collect"
  ): TypedContractMethod<
    [account: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "deposit"
  ): TypedContractMethod<
    [param: IEnderBase.EndRequestStruct],
    [bigint],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "depositInStrategy"
  ): TypedContractMethod<
    [_asset: AddressLike, _strategy: AddressLike, _depositAmt: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "depositTreasury"
  ): TypedContractMethod<
    [param: IEnderBase.EndRequestStruct, amountRequired: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "eigenLayer"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "enderStaking"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "epochDeposit"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "epochWithdrawl"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "fundsInfo"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "getAddress"
  ): TypedContractMethod<[_type: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "getQueueBlock"
  ): TypedContractMethod<[account: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "hasRequest"
  ): TypedContractMethod<[], [boolean], "view">;
  getFunction(
    nameOrSignature: "initialize"
  ): TypedContractMethod<
    [_treasury: AddressLike, _strategy: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "initializeTreasury"
  ): TypedContractMethod<
    [
      _endToken: AddressLike,
      _enderStaking: AddressLike,
      _bond: AddressLike,
      _instadapp: AddressLike,
      _lybraFinance: AddressLike,
      _eigenLayer: AddressLike,
      _availableFundsPercentage: BigNumberish,
      _reserveFundsPercentage: BigNumberish,
      _oracle: AddressLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "instaDappDepositValuations"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "instaDappLastValuation"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "instaDappWithdrawlValuations"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "instadapp"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "lybraFinance"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "mintEndToUser"
  ): TypedContractMethod<
    [_to: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "nominalYield"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "priorityStrategy"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "reserveFundsPercentage"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "setAddress"
  ): TypedContractMethod<
    [_addr: AddressLike, _type: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setAddressBase"
  ): TypedContractMethod<
    [_addr: AddressLike, _type: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setBondYieldBaseRate"
  ): TypedContractMethod<[_newBaseRate: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setNominalYield"
  ): TypedContractMethod<[_nominalYield: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setPriorityStrategy"
  ): TypedContractMethod<
    [_priorityStrategy: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setStrategy"
  ): TypedContractMethod<
    [_strs: AddressLike[], _flag: boolean],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setTokenStrategy"
  ): TypedContractMethod<[_str: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "stakeRebasingReward"
  ): TypedContractMethod<[_tokenAddress: AddressLike], [bigint], "nonpayable">;
  getFunction(
    nameOrSignature: "strategies"
  ): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "strategy"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "strategyToReceiptToken"
  ): TypedContractMethod<[arg0: AddressLike], [string], "view">;
  getFunction(
    nameOrSignature: "tokenStrategy"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "totalAssetStakedInStrategy"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "totalRewardsFromStrategy"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "treasury"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "withdraw"
  ): TypedContractMethod<
    [param: IEnderBase.EndRequestStruct, amountRequired: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "withdrawFromStrategy"
  ): TypedContractMethod<
    [_asset: AddressLike, _strategy: AddressLike, _withdrawAmt: BigNumberish],
    [bigint],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "withdrawRequest"
  ): TypedContractMethod<
    [param: IEnderBase.EndRequestStruct],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "withdrawStEth"
  ): TypedContractMethod<
    [param: IEnderBase.EndRequestStruct],
    [bigint],
    "nonpayable"
  >;

  getEvent(
    key: "AddressUpdated"
  ): TypedContractEvent<
    AddressUpdatedEvent.InputTuple,
    AddressUpdatedEvent.OutputTuple,
    AddressUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "BondYieldBaseRateUpdated"
  ): TypedContractEvent<
    BondYieldBaseRateUpdatedEvent.InputTuple,
    BondYieldBaseRateUpdatedEvent.OutputTuple,
    BondYieldBaseRateUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "Collect"
  ): TypedContractEvent<
    CollectEvent.InputTuple,
    CollectEvent.OutputTuple,
    CollectEvent.OutputObject
  >;
  getEvent(
    key: "Initialized"
  ): TypedContractEvent<
    InitializedEvent.InputTuple,
    InitializedEvent.OutputTuple,
    InitializedEvent.OutputObject
  >;
  getEvent(
    key: "MintEndToUser"
  ): TypedContractEvent<
    MintEndToUserEvent.InputTuple,
    MintEndToUserEvent.OutputTuple,
    MintEndToUserEvent.OutputObject
  >;
  getEvent(
    key: "NominalYieldUpdated"
  ): TypedContractEvent<
    NominalYieldUpdatedEvent.InputTuple,
    NominalYieldUpdatedEvent.OutputTuple,
    NominalYieldUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;
  getEvent(
    key: "PriorityStrategyUpdated"
  ): TypedContractEvent<
    PriorityStrategyUpdatedEvent.InputTuple,
    PriorityStrategyUpdatedEvent.OutputTuple,
    PriorityStrategyUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "StrategyDeposit"
  ): TypedContractEvent<
    StrategyDepositEvent.InputTuple,
    StrategyDepositEvent.OutputTuple,
    StrategyDepositEvent.OutputObject
  >;
  getEvent(
    key: "StrategyUpdated"
  ): TypedContractEvent<
    StrategyUpdatedEvent.InputTuple,
    StrategyUpdatedEvent.OutputTuple,
    StrategyUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "StrategyWithdraw"
  ): TypedContractEvent<
    StrategyWithdrawEvent.InputTuple,
    StrategyWithdrawEvent.OutputTuple,
    StrategyWithdrawEvent.OutputObject
  >;
  getEvent(
    key: "TreasuryDeposit"
  ): TypedContractEvent<
    TreasuryDepositEvent.InputTuple,
    TreasuryDepositEvent.OutputTuple,
    TreasuryDepositEvent.OutputObject
  >;
  getEvent(
    key: "TreasuryWithdraw"
  ): TypedContractEvent<
    TreasuryWithdrawEvent.InputTuple,
    TreasuryWithdrawEvent.OutputTuple,
    TreasuryWithdrawEvent.OutputObject
  >;

  filters: {
    "AddressUpdated(address,uint8)": TypedContractEvent<
      AddressUpdatedEvent.InputTuple,
      AddressUpdatedEvent.OutputTuple,
      AddressUpdatedEvent.OutputObject
    >;
    AddressUpdated: TypedContractEvent<
      AddressUpdatedEvent.InputTuple,
      AddressUpdatedEvent.OutputTuple,
      AddressUpdatedEvent.OutputObject
    >;

    "BondYieldBaseRateUpdated(uint256)": TypedContractEvent<
      BondYieldBaseRateUpdatedEvent.InputTuple,
      BondYieldBaseRateUpdatedEvent.OutputTuple,
      BondYieldBaseRateUpdatedEvent.OutputObject
    >;
    BondYieldBaseRateUpdated: TypedContractEvent<
      BondYieldBaseRateUpdatedEvent.InputTuple,
      BondYieldBaseRateUpdatedEvent.OutputTuple,
      BondYieldBaseRateUpdatedEvent.OutputObject
    >;

    "Collect(address,uint256)": TypedContractEvent<
      CollectEvent.InputTuple,
      CollectEvent.OutputTuple,
      CollectEvent.OutputObject
    >;
    Collect: TypedContractEvent<
      CollectEvent.InputTuple,
      CollectEvent.OutputTuple,
      CollectEvent.OutputObject
    >;

    "Initialized(uint8)": TypedContractEvent<
      InitializedEvent.InputTuple,
      InitializedEvent.OutputTuple,
      InitializedEvent.OutputObject
    >;
    Initialized: TypedContractEvent<
      InitializedEvent.InputTuple,
      InitializedEvent.OutputTuple,
      InitializedEvent.OutputObject
    >;

    "MintEndToUser(address,uint256)": TypedContractEvent<
      MintEndToUserEvent.InputTuple,
      MintEndToUserEvent.OutputTuple,
      MintEndToUserEvent.OutputObject
    >;
    MintEndToUser: TypedContractEvent<
      MintEndToUserEvent.InputTuple,
      MintEndToUserEvent.OutputTuple,
      MintEndToUserEvent.OutputObject
    >;

    "NominalYieldUpdated(uint256)": TypedContractEvent<
      NominalYieldUpdatedEvent.InputTuple,
      NominalYieldUpdatedEvent.OutputTuple,
      NominalYieldUpdatedEvent.OutputObject
    >;
    NominalYieldUpdated: TypedContractEvent<
      NominalYieldUpdatedEvent.InputTuple,
      NominalYieldUpdatedEvent.OutputTuple,
      NominalYieldUpdatedEvent.OutputObject
    >;

    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;

    "PriorityStrategyUpdated(address)": TypedContractEvent<
      PriorityStrategyUpdatedEvent.InputTuple,
      PriorityStrategyUpdatedEvent.OutputTuple,
      PriorityStrategyUpdatedEvent.OutputObject
    >;
    PriorityStrategyUpdated: TypedContractEvent<
      PriorityStrategyUpdatedEvent.InputTuple,
      PriorityStrategyUpdatedEvent.OutputTuple,
      PriorityStrategyUpdatedEvent.OutputObject
    >;

    "StrategyDeposit(address,address,uint256)": TypedContractEvent<
      StrategyDepositEvent.InputTuple,
      StrategyDepositEvent.OutputTuple,
      StrategyDepositEvent.OutputObject
    >;
    StrategyDeposit: TypedContractEvent<
      StrategyDepositEvent.InputTuple,
      StrategyDepositEvent.OutputTuple,
      StrategyDepositEvent.OutputObject
    >;

    "StrategyUpdated(address,bool)": TypedContractEvent<
      StrategyUpdatedEvent.InputTuple,
      StrategyUpdatedEvent.OutputTuple,
      StrategyUpdatedEvent.OutputObject
    >;
    StrategyUpdated: TypedContractEvent<
      StrategyUpdatedEvent.InputTuple,
      StrategyUpdatedEvent.OutputTuple,
      StrategyUpdatedEvent.OutputObject
    >;

    "StrategyWithdraw(address,address,uint256)": TypedContractEvent<
      StrategyWithdrawEvent.InputTuple,
      StrategyWithdrawEvent.OutputTuple,
      StrategyWithdrawEvent.OutputObject
    >;
    StrategyWithdraw: TypedContractEvent<
      StrategyWithdrawEvent.InputTuple,
      StrategyWithdrawEvent.OutputTuple,
      StrategyWithdrawEvent.OutputObject
    >;

    "TreasuryDeposit(address,uint256)": TypedContractEvent<
      TreasuryDepositEvent.InputTuple,
      TreasuryDepositEvent.OutputTuple,
      TreasuryDepositEvent.OutputObject
    >;
    TreasuryDeposit: TypedContractEvent<
      TreasuryDepositEvent.InputTuple,
      TreasuryDepositEvent.OutputTuple,
      TreasuryDepositEvent.OutputObject
    >;

    "TreasuryWithdraw(address,uint256)": TypedContractEvent<
      TreasuryWithdrawEvent.InputTuple,
      TreasuryWithdrawEvent.OutputTuple,
      TreasuryWithdrawEvent.OutputObject
    >;
    TreasuryWithdraw: TypedContractEvent<
      TreasuryWithdrawEvent.InputTuple,
      TreasuryWithdrawEvent.OutputTuple,
      TreasuryWithdrawEvent.OutputObject
    >;
  };
}