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
import type { NonPayableOverrides } from "../../../../common";
import type {
  StETH,
  StETHInterface,
} from "../../../../contracts/ERC20/mockStEth.sol/StETH";

const _abi = [
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
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "preRebaseTokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "postRebaseTokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "sharesAmount",
        type: "uint256",
      },
    ],
    name: "SharesBurnt",
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
        name: "sharesValue",
        type: "uint256",
      },
    ],
    name: "TransferShares",
    type: "event",
  },
  {
    inputs: [],
    name: "TOTAL_SHARES_POSITION",
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
    name: "TotalEthAmount",
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
        name: "_owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_spender",
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
        name: "_spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
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
        name: "_account",
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
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_subtractedValue",
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
    inputs: [
      {
        internalType: "uint256",
        name: "_sharesAmount",
        type: "uint256",
      },
    ],
    name: "getPooledEthByShares",
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
        name: "_ethAmount",
        type: "uint256",
      },
    ],
    name: "getSharesByPooledEth",
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
    name: "getTotalPooledEther",
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
    name: "getTotalShares",
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
        name: "_spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_addedValue",
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
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
    ],
    name: "sharesOf",
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
    name: "submit",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
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
    stateMutability: "pure",
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
        name: "_recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
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
        name: "_sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
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
    inputs: [
      {
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_sharesAmount",
        type: "uint256",
      },
    ],
    name: "transferShares",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_sharesAmount",
        type: "uint256",
      },
    ],
    name: "transferSharesFrom",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const _bytecode =
  "0x60806040526001600255600160035534801561001a57600080fd5b506127078061002a6000396000f3fe60806040526004361061012e5760003560e01c80635bcb2fc6116100ab57806395d89b411161006f57806395d89b4114610442578063a457c2d71461046d578063a9059cbb146104aa578063d5002f2e146104e7578063dd62ed3e14610512578063f5eb42dc1461054f57610135565b80635bcb2fc6146103305780636d7804591461034e57806370a082311461038b5780637a28fb88146103c85780638fcb4e5b1461040557610135565b806330033d1e116100f257806330033d1e14610247578063313ce5671461027257806337cfdaca1461029d57806339509351146102c857806354712edf1461030557610135565b806306fdde031461013a578063095ea7b31461016557806318160ddd146101a257806319208451146101cd57806323b872dd1461020a57610135565b3661013557005b600080fd5b34801561014657600080fd5b5061014f61058c565b60405161015c9190611f4d565b60405180910390f35b34801561017157600080fd5b5061018c60048036038101906101879190612008565b610605565b6040516101999190612063565b60405180910390f35b3480156101ae57600080fd5b506101b7610680565b6040516101c4919061208d565b60405180910390f35b3480156101d957600080fd5b506101f460048036038101906101ef91906120a8565b6106cb565b604051610201919061208d565b60405180910390f35b34801561021657600080fd5b50610231600480360381019061022c91906120d5565b610735565b60405161023e9190612063565b60405180910390f35b34801561025357600080fd5b5061025c6107e4565b604051610269919061208d565b60405180910390f35b34801561027e57600080fd5b506102876107ea565b6040516102949190612144565b60405180910390f35b3480156102a957600080fd5b506102b261082f565b6040516102bf919061208d565b60405180910390f35b3480156102d457600080fd5b506102ef60048036038101906102ea9190612008565b61087a565b6040516102fc9190612063565b60405180910390f35b34801561031157600080fd5b5061031a61097c565b604051610327919061208d565b60405180910390f35b610338610982565b604051610345919061208d565b60405180910390f35b34801561035a57600080fd5b50610375600480360381019061037091906120d5565b610a31565b604051610382919061208d565b60405180910390f35b34801561039757600080fd5b506103b260048036038101906103ad919061215f565b610b49565b6040516103bf919061208d565b60405180910390f35b3480156103d457600080fd5b506103ef60048036038101906103ea91906120a8565b610b9f565b6040516103fc919061208d565b60405180910390f35b34801561041157600080fd5b5061042c60048036038101906104279190612008565b610c09565b604051610439919061208d565b60405180910390f35b34801561044e57600080fd5b50610457610ced565b6040516104649190611f4d565b60405180910390f35b34801561047957600080fd5b50610494600480360381019061048f9190612008565b610d66565b6040516104a19190612063565b60405180910390f35b3480156104b657600080fd5b506104d160048036038101906104cc9190612008565b610f29565b6040516104de9190612063565b60405180910390f35b3480156104f357600080fd5b506104fc610fa4565b604051610509919061208d565b60405180910390f35b34801561051e57600080fd5b506105396004803603810190610534919061218c565b610fef565b604051610546919061208d565b60405180910390f35b34801561055b57600080fd5b506105766004803603810190610571919061215f565b6110b2565b604051610583919061208d565b60405180910390f35b60606105a267ffe645c11658e63560c01b611100565b6105b667ddc1761ed6ca784c60c01b611100565b6105ca67e482d102e2462eef60c01b611100565b6040518060400160405280601781526020017f4c6971756964207374616b656420457468657220322e30000000000000000000815250905090565b600061061b678a99db0415872c5a60c01b611100565b61062f672d292987faae58c660c01b611100565b61064367216b09286e3a081e60c01b611100565b61064e338484611103565b610662671d316f99c0f9d99860c01b611100565b610676670e2e3a34ff91c46b60c01b611100565b6001905092915050565b60006106966716f46afa694cb9c960c01b611100565b6106aa674c9a799284d62d1960c01b611100565b6106be67a5191299a562122460c01b611100565b6106c66113bc565b905090565b60006106e1673a78fca7489bc22a60c01b611100565b6106f5673d68fbb909ac955860c01b611100565b6107096736353029d069c7ae60c01b611100565b6107116113bc565b610719611402565b8361072491906121fb565b61072e919061226c565b9050919050565b600061074b67d0c7bcb11f4786c460c01b611100565b61075f67116f49b76bec414160c01b611100565b61077367254e6870f9f59c1060c01b611100565b61077e843384611448565b610792673545daac1115ea8960c01b611100565b6107a6676fb2aeeb971c9e2960c01b611100565b6107b184848461163b565b6107c5678e1e579ac749c28560c01b611100565b6107d96780189ef17d01e0b560c01b611100565b600190509392505050565b60025481565b600061080067a98f3e3152387e1460c01b611100565b6108146768a47dc7f4b96f4c60c01b611100565b610828676c22dd80d1a33a1560c01b611100565b6012905090565b6000610845678bf3016d8226a72960c01b611100565b61085967df12d00cf78d554660c01b611100565b61086d672c9a04118e42502360c01b611100565b6108756113bc565b905090565b600061089067dbbcbbc3306b9ba160c01b611100565b6108a467ff796dac2024f53060c01b611100565b6108b86781e9c40cae7c1a8460c01b611100565b61094a338484600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054610945919061229d565b611103565b61095e672dd71d1178cc0ead60c01b611100565b61097267fa708a1a0e14e6e060c01b611100565b6001905092915050565b60035481565b60006109986718349deda4480d2360c01b611100565b6109ac67365ab510a3abcfa560c01b611100565b6109c067b3a3475e1daa591560c01b611100565b60006109cb346106cb565b90506109e1673806a92a6aae964060c01b611100565b34600360008282546109f3919061229d565b92505081905550610a0e670c7fcdba73f580ad60c01b611100565b610a226798613f620010243f60c01b611100565b610a2c33826116f0565b505090565b6000610a476763daf0016ee5840d60c01b611100565b610a5b67ad022bb7975b532860c01b611100565b610a6f67972f847c4916b0ef60c01b611100565b6000610a7a83610b9f565b9050610a90670c2e1c344a95fb1960c01b611100565b610aa4676842bf602788faf760c01b611100565b610aaf853383611448565b610ac36736c331ec5490ce1a60c01b611100565b610ad767b4a5b5d06f4f6ed760c01b611100565b610ae28585856118af565b610af6676098776385ddbc7160c01b611100565b610b0a676bac5f82dcc8024c60c01b611100565b610b1685858386611d05565b610b2a67f19927d7e633c69360c01b611100565b610b3e67b1465e44aefb338c60c01b611100565b809150509392505050565b6000610b5f67baa7be3fc0524a9f60c01b611100565b610b7367716afed5aa78d53560c01b611100565b610b876768d7f5e72e357c7960c01b611100565b610b98610b9383611e39565b610b9f565b9050919050565b6000610bb5672a445f48158e89a360c01b611100565b610bc96702af7ff810552a0660c01b611100565b610bdd67d6729f9e0e6b610c60c01b611100565b610be5611402565b610bed6113bc565b83610bf891906121fb565b610c02919061226c565b9050919050565b6000610c1f67e7b2783fbf06830060c01b611100565b610c33670ddaf3eb51bfddf660c01b611100565b610c4767e272eaec312f15c760c01b611100565b610c523384846118af565b610c6667b03fe6c0f6ac3a8160c01b611100565b610c7a67f0b69f67ff6721a060c01b611100565b6000610c8583610b9f565b9050610c9b67c311bf2dd7f6dc9160c01b611100565b610caf67332c6317a2b9ed3c60c01b611100565b610cbb33858386611d05565b610ccf67127bb53dfe40f75060c01b611100565b610ce367eeb48846691fb6fc60c01b611100565b8091505092915050565b6060610d0367b769910ce4c3a93d60c01b611100565b610d17673c39a0feec4c8edc60c01b611100565b610d2b67e845c57c02e787cc60c01b611100565b6040518060400160405280600581526020017f7374455448000000000000000000000000000000000000000000000000000000815250905090565b6000610d7c677adb6b701080171060c01b611100565b610d90677d50b9208234c20060c01b611100565b610da4677052f711b277cc1c60c01b611100565b6000600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050610e3967adf8ca0ca203aa8660c01b611100565b610e4d6719a33c6571439e3260c01b611100565b610e6167d3aba41f0e5642bb60c01b611100565b82811015610ea4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e9b9061231d565b60405180910390fd5b610eb867c4bf2bbc203dc14360c01b611100565b610ecc671593706a6831e64860c01b611100565b610ee067d5b8423d166f618160c01b611100565b610ef633858584610ef1919061233d565b611103565b610f0a6778f764604e9fafa560c01b611100565b610f1e67d17aebf7fccf46e360c01b611100565b600191505092915050565b6000610f3f677a7e4e48b7d5486660c01b611100565b610f53678bd3419561f80bee60c01b611100565b610f6767039ac58af489dce060c01b611100565b610f7233848461163b565b610f866765418e102f9fef5260c01b611100565b610f9a6735c95d4fb0a1d33360c01b611100565b6001905092915050565b6000610fba673b9fb7beeaed2e2960c01b611100565b610fce6783fe610dc768936360c01b611100565b610fe267b740d191fe01cc0a60c01b611100565b610fea611402565b905090565b600061100567da88e07b4ff19e7760c01b611100565b611019676f81473aecbba1f060c01b611100565b61102d674142b959e91c988f60c01b611100565b600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b60006110c86714672a8c7d8d81f660c01b611100565b6110dc678191691787fd36e760c01b611100565b6110f067c980751361afe48060c01b611100565b6110f982611e39565b9050919050565b50565b611117676193f9dca3ac3c6160c01b611100565b61112b6744a6b9514bc0a87760c01b611100565b61113f67cdb38e0ad0e79f8660c01b611100565b61115367c415f09da3fb124b60c01b611100565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036111c2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016111b9906123bd565b60405180910390fd5b6111d667fe78c6081495b05460c01b611100565b6111ea67bce054b08a2b9f0160c01b611100565b6111fe67eebacd21bbda073d60c01b611100565b611212672578943f5bab887560c01b611100565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603611281576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161127890612429565b60405180910390fd5b61129567131f4ccae34bb91460c01b611100565b6112a967ec916e903dd6585060c01b611100565b80600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555061133e67bea79863409640e360c01b611100565b61135267f6650033ad83705160c01b611100565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925836040516113af919061208d565b60405180910390a3505050565b60006113d26704837a14e2e03d4a60c01b611100565b6113e66782aee0a69676b07760c01b611100565b6113fa67add51793a6816c7960c01b611100565b600354905090565b6000611418677e076d081f6d762960c01b611100565b61142c673bb068137c13a91a60c01b611100565b6114406749a166aeba40afc060c01b611100565b600254905090565b61145c67f578db163430a05b60c01b611100565b61147067218d3de017b1443760c01b611100565b6114846781cb7a44c06a4eb060c01b611100565b6000600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905061151967ef70751677c13aca60c01b611100565b61152d6709c4b4ba9ecce84060c01b611100565b60001981146116205761154a67d2e0b155e121171560c01b611100565b61155e67e151d99ece63a30860c01b611100565b6115726798c79041e53b69b760c01b611100565b61158667a4bdc6aa2146c40660c01b611100565b818110156115c9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016115c090612495565b60405180910390fd5b6115dd6732b1404c0f1e6e0460c01b611100565b6115f1676336c07e88f47e7b60c01b611100565b61160567616b1e6277920c2060c01b611100565b61161b84848484611616919061233d565b611103565b611635565b61163467d5e9ac7b92137c0960c01b611100565b5b50505050565b61164f67dfa83783fb5f3a4860c01b611100565b61166266aabc83babd9c3e60c01b611100565b61167667d25a6c6505ff737360c01b611100565b6000611681826106cb565b905061169767a8b947116072ccc460c01b611100565b6116ab67125145ab8169d3f960c01b611100565b6116b68484836118af565b6116ca6757019a6a7766cd2d60c01b611100565b6116de6764ec7869e40a60b360c01b611100565b6116ea84848484611d05565b50505050565b600061170667d8625587c37bbe3b60c01b611100565b61171a67bf89753636f6e88460c01b611100565b61172e67f658053dc3bfab3d60c01b611100565b6117426772b8ff8f2b6f992d60c01b611100565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036117b1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016117a890612501565b60405180910390fd5b6117c567e3f2f41fef60dcd960c01b611100565b6117d967558537489acdb6ae60c01b611100565b816117e2611402565b6117ec919061229d565b9050611802677933ebf14ef656ee60c01b611100565b8060028190555061181d67ed90f7e3da75eba260c01b611100565b816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054611867919061229d565b6000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555092915050565b6118c36703af29873b97001e60c01b611100565b6118d7671ef88e357328725360c01b611100565b6118eb67be43df899cefebf360c01b611100565b6118ff67cd4d2d1cdc023d7460c01b611100565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff160361196e576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016119659061256d565b60405180910390fd5b61198267880fb884bf24bcad60c01b611100565b61199667f7ec4957ccdd5f9760c01b611100565b6119aa67227d646aac1d2acc60c01b611100565b6119be675a127f3479e2c32760c01b611100565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603611a2d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611a24906125d9565b60405180910390fd5b611a416761d6bde0b557fbc760c01b611100565b611a55675f838bd5e8c6c8ea60c01b611100565b611a69676b15f8edc0d3ce8b60c01b611100565b611a7d6783143b51bc10478860c01b611100565b3073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603611aeb576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611ae290612645565b60405180910390fd5b611aff67b33e0f0d65eda22e60c01b611100565b611b13672cb962880172c3bb60c01b611100565b611b2767fb131d1fd118657a60c01b611100565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050611b7e67334896cf041fc60a60c01b611100565b611b9267b2dcac07ac36993860c01b611100565b611ba6670d9058d8ac9f48eb60c01b611100565b80821115611be9576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611be0906126b1565b60405180910390fd5b611bfd674132fb083203a41160c01b611100565b611c1167f4f8152784a6d01060c01b611100565b8181611c1d919061233d565b6000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550611c736724aff7d40bc7209760c01b611100565b816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054611cbd919061229d565b6000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555050505050565b611d196708758920e42042fb60c01b611100565b611d2d6720cc2e6766010c9460c01b611100565b611d4167045b7b9d2b83038c60c01b611100565b8273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051611d9e919061208d565b60405180910390a3611dba672c38ae9f560558f760c01b611100565b611dce67b38fe541956046d460c01b611100565b8273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f9d9c909296d9c674451c0c24f02cb64981eb3b727f99865939192f880a755dcb83604051611e2b919061208d565b60405180910390a350505050565b6000611e4f678c30960fba97f4f060c01b611100565b611e6367d5939cd005fef01a60c01b611100565b611e776719a9227e7ad8901460c01b611100565b6000808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b600081519050919050565b600082825260208201905092915050565b60005b83811015611ef7578082015181840152602081019050611edc565b60008484015250505050565b6000601f19601f8301169050919050565b6000611f1f82611ebd565b611f298185611ec8565b9350611f39818560208601611ed9565b611f4281611f03565b840191505092915050565b60006020820190508181036000830152611f678184611f14565b905092915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000611f9f82611f74565b9050919050565b611faf81611f94565b8114611fba57600080fd5b50565b600081359050611fcc81611fa6565b92915050565b6000819050919050565b611fe581611fd2565b8114611ff057600080fd5b50565b60008135905061200281611fdc565b92915050565b6000806040838503121561201f5761201e611f6f565b5b600061202d85828601611fbd565b925050602061203e85828601611ff3565b9150509250929050565b60008115159050919050565b61205d81612048565b82525050565b60006020820190506120786000830184612054565b92915050565b61208781611fd2565b82525050565b60006020820190506120a2600083018461207e565b92915050565b6000602082840312156120be576120bd611f6f565b5b60006120cc84828501611ff3565b91505092915050565b6000806000606084860312156120ee576120ed611f6f565b5b60006120fc86828701611fbd565b935050602061210d86828701611fbd565b925050604061211e86828701611ff3565b9150509250925092565b600060ff82169050919050565b61213e81612128565b82525050565b60006020820190506121596000830184612135565b92915050565b60006020828403121561217557612174611f6f565b5b600061218384828501611fbd565b91505092915050565b600080604083850312156121a3576121a2611f6f565b5b60006121b185828601611fbd565b92505060206121c285828601611fbd565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061220682611fd2565b915061221183611fd2565b925082820261221f81611fd2565b91508282048414831517612236576122356121cc565b5b5092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b600061227782611fd2565b915061228283611fd2565b9250826122925761229161223d565b5b828204905092915050565b60006122a882611fd2565b91506122b383611fd2565b92508282019050808211156122cb576122ca6121cc565b5b92915050565b7f414c4c4f57414e43455f42454c4f575f5a45524f000000000000000000000000600082015250565b6000612307601483611ec8565b9150612312826122d1565b602082019050919050565b60006020820190508181036000830152612336816122fa565b9050919050565b600061234882611fd2565b915061235383611fd2565b925082820390508181111561236b5761236a6121cc565b5b92915050565b7f415050524f56455f46524f4d5f5a45524f5f4144445200000000000000000000600082015250565b60006123a7601683611ec8565b91506123b282612371565b602082019050919050565b600060208201905081810360008301526123d68161239a565b9050919050565b7f415050524f56455f544f5f5a45524f5f41444452000000000000000000000000600082015250565b6000612413601483611ec8565b915061241e826123dd565b602082019050919050565b6000602082019050818103600083015261244281612406565b9050919050565b7f414c4c4f57414e43455f45584345454445440000000000000000000000000000600082015250565b600061247f601283611ec8565b915061248a82612449565b602082019050919050565b600060208201905081810360008301526124ae81612472565b9050919050565b7f4d494e545f544f5f5a45524f5f41444452000000000000000000000000000000600082015250565b60006124eb601183611ec8565b91506124f6826124b5565b602082019050919050565b6000602082019050818103600083015261251a816124de565b9050919050565b7f5452414e534645525f46524f4d5f5a45524f5f41444452000000000000000000600082015250565b6000612557601783611ec8565b915061256282612521565b602082019050919050565b600060208201905081810360008301526125868161254a565b9050919050565b7f5452414e534645525f544f5f5a45524f5f414444520000000000000000000000600082015250565b60006125c3601583611ec8565b91506125ce8261258d565b602082019050919050565b600060208201905081810360008301526125f2816125b6565b9050919050565b7f5452414e534645525f544f5f53544554485f434f4e5452414354000000000000600082015250565b600061262f601a83611ec8565b915061263a826125f9565b602082019050919050565b6000602082019050818103600083015261265e81612622565b9050919050565b7f42414c414e43455f455843454544454400000000000000000000000000000000600082015250565b600061269b601083611ec8565b91506126a682612665565b602082019050919050565b600060208201905081810360008301526126ca8161268e565b905091905056fea26469706673582212205e5478f59f9838d384bd9d4d391015cf72b92554d9e5ded1c88c34aa15b5d85a64736f6c63430008120033";

type StETHConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: StETHConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class StETH__factory extends ContractFactory {
  constructor(...args: StETHConstructorParams) {
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
      StETH & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): StETH__factory {
    return super.connect(runner) as StETH__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): StETHInterface {
    return new Interface(_abi) as StETHInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): StETH {
    return new Contract(address, _abi, runner) as unknown as StETH;
  }
}
