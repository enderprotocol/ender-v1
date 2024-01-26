/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  EndToken,
  EndTokenInterface,
} from "../../../contracts/ERC20/EndToken";

const _abi = [
  {
    inputs: [],
    name: "InvalidParam",
    type: "error",
  },
  {
    inputs: [],
    name: "WaitingTimeNotCompleted",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroAddress",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "updateTime",
        type: "uint256",
      },
    ],
    name: "DayfeeUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
    ],
    name: "FeeUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "time",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "withdrawAmount",
        type: "uint256",
      },
    ],
    name: "GetMintedEnd",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "time",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "mintAmount",
        type: "uint256",
      },
    ],
    name: "MintAndVest",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "RefractionFeesDistributed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newTreasury",
        type: "address",
      },
    ],
    name: "TreasuryContractChanged",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ENDERBOND_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MINTER_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "admin",
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
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
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
    inputs: [],
    name: "currentMintCount",
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
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "distributeRefractionFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "enderBond",
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
    name: "excludeWallets",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMintedEnd",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "lastEpoch",
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
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "mintAndVest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "mintCount",
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
    inputs: [],
    name: "mintFee",
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
    inputs: [],
    name: "mintPrec",
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
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "prevAmount",
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
    inputs: [],
    name: "refractionFeePercentage",
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
    inputs: [],
    name: "refractionFeeTotal",
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
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_admin",
        type: "address",
      },
    ],
    name: "setAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addrs",
        type: "address",
      },
    ],
    name: "setBond",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "addrs",
        type: "address[]",
      },
      {
        internalType: "bool",
        name: "flag",
        type: "bool",
      },
    ],
    name: "setExclude",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
    ],
    name: "setFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "treasury_",
        type: "address",
      },
    ],
    name: "setTreasury",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "todayAmount",
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
    inputs: [],
    name: "totalSupply",
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
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "treasury",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "vestedAmounts",
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
        name: "",
        type: "uint256",
      },
    ],
    name: "vestedTime",
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
        name: "",
        type: "uint256",
      },
    ],
    name: "yearlyVestAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "totalAmount",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "nineMonths",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "twelveMonths",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "fifteenMonths",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50612157806100206000396000f3fe608060405234801561001057600080fd5b506004361061028a5760003560e01c80636823f1401161015c578063a217fddf116100ce578063d959fb2e11610087578063d959fb2e146105f0578063dd62ed3e14610603578063e61c027414610616578063e6e617911461061e578063f0f4426014610631578063f851a4401461064457600080fd5b8063a217fddf1461057f578063a457c2d714610587578063a9059cbb1461059a578063ccbf459a146105ad578063d5391393146105b6578063d547741f146105dd57600080fd5b80638046b13c116101205780638046b13c146105235780638129fc1c1461054a57806387fd1f161461055257806391d148541461055b57806395d89b411461056e5780639659867e1461057657600080fd5b80636823f140146104c357806369fe0e2d146104cc578063704b6c02146104df57806370a08231146104f25780637f73e3181461051b57600080fd5b806336568abe1161020057806348440c86116101b957806348440c861461041057806349697763146104305780634a467ddb146104395780634ef276d514610442578063549028051461044b57806361d027b3146104b057600080fd5b806336568abe14610381578063395093511461039457806340c10f19146103a7578063421947ca146103ba578063426697cf146103c257806342a8e2cd146103ed57600080fd5b806313966db51161025257806313966db51461031657806318160ddd1461031f57806323b872dd14610327578063248a9ca31461033a5780632f2ff15d1461035d578063313ce5671461037257600080fd5b806301e74c351461028f57806301ffc9a7146102c257806306a4c983146102e557806306fdde03146102ee578063095ea7b314610303575b600080fd5b6102af61029d366004611bca565b60d96020526000908152604090205481565b6040519081526020015b60405180910390f35b6102d56102d0366004611be3565b610657565b60405190151581526020016102b9565b6102af60d05481565b6102f661068e565b6040516102b99190611c5d565b6102d5610311366004611c8c565b610720565b6102af60d45481565b6035546102af565b6102d5610335366004611cb6565b610738565b6102af610348366004611bca565b60009081526097602052604090206001015490565b61037061036b366004611cf2565b61075c565b005b604051601281526020016102b9565b61037061038f366004611cf2565b610786565b6102d56103a2366004611c8c565b610809565b6103706103b5366004611c8c565b61082b565b61037061085c565b60d6546103d5906001600160a01b031681565b6040516001600160a01b0390911681526020016102b9565b6102d56103fb366004611d1e565b60d76020526000908152604090205460ff1681565b6102af61041e366004611bca565b60d86020526000908152604090205481565b6102af60d25481565b6102af60cb5481565b6102af60d15481565b610488610459366004611bca565b60da602052600090815260409020805460019091015460ff808216916101008104821691620100009091041684565b60408051948552921515602085015290151591830191909152151560608201526080016102b9565b60c9546103d5906001600160a01b031681565b6102af60ce5481565b6103706104da366004611bca565b6109ef565b6103706104ed366004611d1e565b610a57565b6102af610500366004611d1e565b6001600160a01b031660009081526033602052604090205490565b610370610aac565b6102af7fe13c49f41ace7b3f26b0cf23ab168b4c48591998827e86cfa78a62930e4d695381565b610370610d4e565b6102af60cc5481565b6102d5610569366004611cf2565b610f4c565b6102f6610f77565b6102af60d55481565b6102af600081565b6102d5610595366004611c8c565b610f86565b6102d56105a8366004611c8c565b611001565b6102af60cd5481565b6102af7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a681565b6103706105eb366004611cf2565b61100f565b6103706105fe366004611d1e565b611034565b6102af610611366004611d39565b611089565b6103706110b4565b61037061062c366004611d63565b611201565b61037061063f366004611d1e565b6112a2565b60ca546103d5906001600160a01b031681565b60006001600160e01b03198216637965db0b60e01b148061068857506301ffc9a760e01b6001600160e01b03198316145b92915050565b60606036805461069d90611dee565b80601f01602080910402602001604051908101604052809291908181526020018280546106c990611dee565b80156107165780601f106106eb57610100808354040283529160200191610716565b820191906000526020600020905b8154815290600101906020018083116106f957829003601f168201915b5050505050905090565b60003361072e81858561131f565b5060019392505050565b600033610746858285611443565b6107518585856114bd565b506001949350505050565b60008281526097602052604090206001015461077781611579565b6107818383611583565b505050565b6001600160a01b03811633146107fb5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b6108058282611609565b5050565b60003361072e81858561081c8383611089565b6108269190611e3e565b61131f565b6001600160a01b0382166108525760405163d92e233d60e01b815260040160405180910390fd5b6108058282611670565b600061086781611579565b60d3544290819061087c906301e13380611e51565b61088a906301e13380611e3e565b10156108a957604051632350ee6d60e11b815260040160405180910390fd5b600061271060d4546108ba60355490565b6108c49190611e51565b6108ce9190611e68565b604080516080810182528281526000602082018190529181018290526060810182905291925060da906109056301e1338086611e68565b81526020808201929092526040908101600020835181559183015160019092018054918401516060909401511515620100000262ff0000199415156101000261ff00199415159490941661ffff19909316929092179290921792909216919091179055610972308261082b565b60d45460641461099557600a60d4600082825461098f9190611e8a565b90915550505b60d3546000036109b1576109ad6301e1338083611e68565b60d3555b60408051428152602081018390527fda65a2412f18d749fd614d03e6d0ca7c846aa8b3656a9af4fea5716aeddda0ad910160405180910390a1505050565b60006109fa81611579565b81600003610a1b57604051633494a40d60e21b815260040160405180910390fd5b60cb8290556040518281527f8c4d35e54a3f2ef1134138fd8ea3daee6a3c89e10d2665996babdf70261e2c769060200160405180910390a15050565b6000610a6281611579565b6001600160a01b038216610a895760405163d92e233d60e01b815260040160405180910390fd5b5060ca80546001600160a01b0319166001600160a01b0392909216919091179055565b6000610ab781611579565b60d35442906000906301e13380908290610ad2908390611e51565b60d354600090815260da602090815260409182902082516080810184528154815260019091015460ff80821615159383019390935261010081048316151593820193909352620100009092041615156060820152909150610b338386611e68565b60d3541015610c21576000610b4c83630163f500611e3e565b90506000610b5e846301da9c00611e3e565b90506000610b70856302514300611e3e565b90508360200151158015610b8357508783105b15610ba3578351610b9690600390611e68565b610ba09088611e3e565b96505b8360400151158015610bb457508782105b15610bd4578351610bc790600390611e68565b610bd19088611e3e565b96505b8360600151158015610be557508781105b15610c1d578351600390610bfa906002611e51565b610c049190611e68565b8451610c109190611e8a565b610c1a9088611e3e565b96505b5050505b600083610c2e8188611e68565b610c389190611e51565b9050600060da81610c49878a611e68565b8152602080820192909252604090810160002081516080810183528154815260019091015460ff80821615801595840186905261010083048216151594840194909452620100009091041615156060820152925090610cb4575086610cb283630163f500611e3e565b105b15610cd4578051610cc790600390611e68565b610cd19087611e3e565b95505b8060400151158015610cf2575086610cf0836301da9c00611e3e565b105b15610d12578051610d0590600390611e68565b610d0f9087611e3e565b95505b610d1c8588611e68565b60d35414610d3257610d2e8588611e68565b60d3555b8515610d4457610d423387611001565b505b5050505050505050565b600054610100900460ff1615808015610d6e5750600054600160ff909116105b80610d885750303b158015610d88575060005460ff166001145b610deb5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b60648201526084016107f2565b6000805460ff191660011790558015610e0e576000805461ff0019166101001790555b610e546040518060400160405280600981526020016822b732102a37b5b2b760b91b8152506040518060400160405280600381526020016211539160ea1b815250611731565b610e5f600033611583565b60d654610e96907fe13c49f41ace7b3f26b0cf23ab168b4c48591998827e86cfa78a62930e4d6953906001600160a01b0316611583565b60ca80546001600160a01b0319163390811790915530600090815260d76020526040808220805460ff19908116600190811790925593835291208054909216179055600460d555610ee86101f46109ef565b620151804206420360cf55610f03336509184e72a000611670565b8015610f49576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b50565b60009182526097602090815260408084206001600160a01b0393909316845291905290205460ff1690565b60606037805461069d90611dee565b60003381610f948286611089565b905083811015610ff45760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084016107f2565b610751828686840361131f565b60003361072e8185856114bd565b60008281526097602052604090206001015461102a81611579565b6107818383611609565b600061103f81611579565b6001600160a01b0382166110665760405163d92e233d60e01b815260040160405180910390fd5b5060d680546001600160a01b0319166001600160a01b0392909216919091179055565b6001600160a01b03918216600090815260346020908152604080832093909416825291909152205490565b7fe13c49f41ace7b3f26b0cf23ab168b4c48591998827e86cfa78a62930e4d69536110de81611579565b60cc5480156111df57600060cc5560408051808201909152601881527f546f74616c2052656672616374696f6e20666565733a2d200000000000000000602082015261112a9082611762565b4260d05560d6546111469030906001600160a01b03168361131f565b60d6546040516310b2bd0560e11b8152600481018390526001600160a01b03909116906321657a0a90602401600060405180830381600087803b15801561118c57600080fd5b505af11580156111a0573d6000803e3d6000fd5b505060d6546040518493506001600160a01b0390911691507f7ff6b628b0f10a21224ff3f833dc0cb77a9d547aea02ba7efe315366efa2d56690600090a35b6108056040518060600160405280602981526020016120d16029913982611762565b600061120c81611579565b600083900361122e57604051633494a40d60e21b815260040160405180910390fd5b60005b60ff811684111561129b578260d7600087878560ff1681811061125657611256611e9d565b905060200201602081019061126b9190611d1e565b6001600160a01b031681526020810191909152604001600020805460ff1916911515919091179055600101611231565b5050505050565b60006112ad81611579565b6001600160a01b0382166112d45760405163d92e233d60e01b815260040160405180910390fd5b60c980546001600160a01b0319166001600160a01b0384169081179091556040517fed4cba48bb0103bee038dacae2c51285355c80bb54c658efef8a93cdaef3043390600090a25050565b6001600160a01b0383166113815760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b60648201526084016107f2565b6001600160a01b0382166113e25760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b60648201526084016107f2565b6001600160a01b0383811660008181526034602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b600061144f8484611089565b905060001981146114b757818110156114aa5760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e636500000060448201526064016107f2565b6114b7848484840361131f565b50505050565b6001600160a01b038316600090815260d7602052604090205460ff16806114fc57506001600160a01b038216600090815260d7602052604090205460ff165b1561150c576107818383836117a7565b6000606460cb548361151e9190611e51565b6115289190611e68565b905061154c6040518060600160405280602881526020016120fa6028913982611762565b80156115655760cc8054820190556115658430836117a7565b6114b784846115748486611e8a565b6117a7565b610f498133611952565b61158d8282610f4c565b6108055760008281526097602090815260408083206001600160a01b03851684529091529020805460ff191660011790556115c53390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6116138282610f4c565b156108055760008281526097602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6001600160a01b0382166116c65760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064016107f2565b80603560008282546116d89190611e3e565b90915550506001600160a01b0382166000818152603360209081526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a35050565b600054610100900460ff166117585760405162461bcd60e51b81526004016107f290611eb3565b61080582826119ab565b6108058282604051602401611778929190611efe565b60408051601f198184030181529190526020810180516001600160e01b0316632d839cb360e21b1790526119eb565b6001600160a01b03831661180b5760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b60648201526084016107f2565b6001600160a01b03821661186d5760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b60648201526084016107f2565b6001600160a01b038316600090815260336020526040902054818110156118e55760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b60648201526084016107f2565b6001600160a01b0380851660008181526033602052604080822086860390559286168082529083902080548601905591517fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef906119459086815260200190565b60405180910390a36114b7565b61195c8282610f4c565b61080557611969816119f4565b611974836020611a06565b604051602001611985929190611f20565b60408051601f198184030181529082905262461bcd60e51b82526107f291600401611c5d565b600054610100900460ff166119d25760405162461bcd60e51b81526004016107f290611eb3565b60366119de8382611ff9565b5060376107818282611ff9565b610f4981611ba9565b60606106886001600160a01b03831660145b60606000611a15836002611e51565b611a20906002611e3e565b67ffffffffffffffff811115611a3857611a38611f95565b6040519080825280601f01601f191660200182016040528015611a62576020820181803683370190505b509050600360fc1b81600081518110611a7d57611a7d611e9d565b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110611aac57611aac611e9d565b60200101906001600160f81b031916908160001a9053506000611ad0846002611e51565b611adb906001611e3e565b90505b6001811115611b53576f181899199a1a9b1b9c1cb0b131b232b360811b85600f1660108110611b0f57611b0f611e9d565b1a60f81b828281518110611b2557611b25611e9d565b60200101906001600160f81b031916908160001a90535060049490941c93611b4c816120b9565b9050611ade565b508315611ba25760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e7460448201526064016107f2565b9392505050565b60006a636f6e736f6c652e6c6f679050600080835160208501845afa505050565b600060208284031215611bdc57600080fd5b5035919050565b600060208284031215611bf557600080fd5b81356001600160e01b031981168114611ba257600080fd5b60005b83811015611c28578181015183820152602001611c10565b50506000910152565b60008151808452611c49816020860160208601611c0d565b601f01601f19169290920160200192915050565b602081526000611ba26020830184611c31565b80356001600160a01b0381168114611c8757600080fd5b919050565b60008060408385031215611c9f57600080fd5b611ca883611c70565b946020939093013593505050565b600080600060608486031215611ccb57600080fd5b611cd484611c70565b9250611ce260208501611c70565b9150604084013590509250925092565b60008060408385031215611d0557600080fd5b82359150611d1560208401611c70565b90509250929050565b600060208284031215611d3057600080fd5b611ba282611c70565b60008060408385031215611d4c57600080fd5b611d5583611c70565b9150611d1560208401611c70565b600080600060408486031215611d7857600080fd5b833567ffffffffffffffff80821115611d9057600080fd5b818601915086601f830112611da457600080fd5b813581811115611db357600080fd5b8760208260051b8501011115611dc857600080fd5b602092830195509350508401358015158114611de357600080fd5b809150509250925092565b600181811c90821680611e0257607f821691505b602082108103611e2257634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b8082018082111561068857610688611e28565b808202811582820484141761068857610688611e28565b600082611e8557634e487b7160e01b600052601260045260246000fd5b500490565b8181038181111561068857610688611e28565b634e487b7160e01b600052603260045260246000fd5b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b604081526000611f116040830185611c31565b90508260208301529392505050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351611f58816017850160208801611c0d565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351611f89816028840160208801611c0d565b01602801949350505050565b634e487b7160e01b600052604160045260246000fd5b601f82111561078157600081815260208120601f850160051c81016020861015611fd25750805b601f850160051c820191505b81811015611ff157828155600101611fde565b505050505050565b815167ffffffffffffffff81111561201357612013611f95565b612027816120218454611dee565b84611fab565b602080601f83116001811461205c57600084156120445750858301515b600019600386901b1c1916600185901b178555611ff1565b600085815260208120601f198616915b8281101561208b5788860151825594840194600190910190840161206c565b50858210156120a95787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b6000816120c8576120c8611e28565b50600019019056fe546f74616c2052656672616374696f6e2066656573206f75747369646520696620626c6f636b3a2d2052656672616374696f6e206665657320646564756374656420696e20456e6420746f6b656e3a2d20a2646970667358221220238121f1a07f62d518910599b55ff4ae3ff1e7622b3016cfaf6a54a51709282564736f6c63430008120033";

type EndTokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: EndTokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class EndToken__factory extends ContractFactory {
  constructor(...args: EndTokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      EndToken & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): EndToken__factory {
    return super.connect(runner) as EndToken__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): EndTokenInterface {
    return new Interface(_abi) as EndTokenInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): EndToken {
    return new Contract(address, _abi, runner) as unknown as EndToken;
  }
}
