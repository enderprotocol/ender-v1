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
  EnderProxy,
  EnderProxyInterface,
} from "../../../contracts/OwnedUpgradeabilityProxy.sol/EnderProxy";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "ProxyOwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [],
    name: "implementation",
    outputs: [
      {
        internalType: "address",
        name: "impl",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maintenance",
    outputs: [
      {
        internalType: "bool",
        name: "_maintenance",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proxyOwner",
    outputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_maintenance",
        type: "bool",
      },
    ],
    name: "setMaintenance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferProxyOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
    ],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b506200002e67937fa5170c696d1060c01b6200007d60201b60201c565b6200004a671fdeeb8d5569bbee60c01b6200007d60201b60201c565b62000066672243410617c9b85e60c01b6200007d60201b60201c565b62000077336200008060201b60201c565b6200011c565b50565b6200009c671ccdb4c3cb7efb6460c01b6200007d60201b60201c565b620000b8671b83cd91a49d3dee60c01b6200007d60201b60201c565b620000d4677649000418c61df860c01b6200007d60201b60201c565b60007f127708131c7435127ed6f385809bed9360985cc735efa3ab7ce86da2c1f5fffb905062000115679c0a85f55b1ac0aa60c01b6200007d60201b60201c565b8181555050565b61158a806200012c6000396000f3fe6080604052600436106100745760003560e01c80635c60da1b1161004e5780635c60da1b1461014d578063612f2f37146101785780636c376cc5146101a1578063f1739cae146101cc57610097565b8063025313a2146100dd5780633659cfe6146101085780634f1ef2861461013157610097565b366100975761008d67221c940016448ba260c01b6101f5565b6100956101f8565b005b6100ab6733f1e8dce722bd8660c01b6101f5565b6100bf674fbcd3e949c6d83860c01b6101f5565b6100d3678379cf1fd20b614260c01b6101f5565b6100db6101f8565b005b3480156100e957600080fd5b506100f2610462565b6040516100ff91906110b5565b60405180910390f35b34801561011457600080fd5b5061012f600480360381019061012a9190611110565b6104e1565b005b61014b60048036038101906101469190611283565b61063e565b005b34801561015957600080fd5b506101626108c3565b60405161016f91906110b5565b60405180910390f35b34801561018457600080fd5b5061019f600480360381019061019a9190611317565b610942565b005b3480156101ad57600080fd5b506101b6610ad3565b6040516101c39190611353565b60405180910390f35b3480156101d857600080fd5b506101f360048036038101906101ee9190611110565b610b52565b005b50565b61020c67d4dcf81996f4d69260c01b6101f5565b610220678c49a127f94dd82f60c01b6101f5565b61023467a60c19805cb1e58860c01b6101f5565b61023c610ad3565b1561031f5761025567b70722e6b59737d560c01b6101f5565b610269672f556c26b9bef92d60c01b6101f5565b61027d67911897070e038dce60c01b6101f5565b61029167ff91f01982e6dea060c01b6101f5565b610299610462565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610306576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102fd906113f1565b60405180910390fd5b61031a6793fd56ded822e35d60c01b6101f5565b610334565b610333676c28be9cf660e4c160c01b6101f5565b5b61034867dd3257d735060bc260c01b6101f5565b61035c67d964a0e998d0a29560c01b6101f5565b60006103666108c3565b905061037c6751221803d2fd055260c01b6101f5565b61039067aa5e03c75bfb72b960c01b6101f5565b6103a467dddb64ae25059e0560c01b6101f5565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610413576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161040a90611483565b60405180910390fd5b61042767a4bd836bc8c4108760c01b6101f5565b61043b67290f92573ae8822760c01b6101f5565b60405136600082376000803683855af43d806000843e816000811461045e578184f35b8184fd5b60006104786762aacde908af5b9060c01b6101f5565b61048c6703c7ca982a29b64560c01b6101f5565b6104a0674300928b67bdeca660c01b6101f5565b60007f127708131c7435127ed6f385809bed9360985cc735efa3ab7ce86da2c1f5fffb90506104d9673dda120f6f4c899160c01b6101f5565b805491505090565b6104f56715dc8634d6469d7a60c01b6101f5565b61050967a5598198f217507760c01b6101f5565b61051d67b39f70228e64e25860c01b6101f5565b61053167cb06da86fd30292860c01b6101f5565b610545672b15d55c2cc8159e60c01b6101f5565b61054d610462565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146105ba576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105b1906113f1565b60405180910390fd5b6105ce6705e6bba89df6c6f160c01b6101f5565b6105e2673159bad55df210d260c01b6101f5565b6105f667f4c7aa5888fe20cd60c01b6101f5565b61060a67df54ed84c9cc78f660c01b6101f5565b61061e67080326a7353b556660c01b6101f5565b61063267376d61c258afaaf260c01b6101f5565b61063b81610dd6565b50565b61065267e72ba505e4b7002660c01b6101f5565b61066667a5598198f217507760c01b6101f5565b61067a67b39f70228e64e25860c01b6101f5565b61068e67cb06da86fd30292860c01b6101f5565b6106a2672b15d55c2cc8159e60c01b6101f5565b6106aa610462565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610717576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161070e906113f1565b60405180910390fd5b61072b6705e6bba89df6c6f160c01b6101f5565b61073f673159bad55df210d260c01b6101f5565b6107536794e888a1b284b16260c01b6101f5565b610767677ad576c18fc2fde660c01b6101f5565b61077b6710e0c92ad36414b460c01b6101f5565b61078f67073ce7020a0025dd60c01b6101f5565b610798826104e1565b6107ac67e0ab58cdca589a5660c01b6101f5565b6107c06710c8670c90b77be560c01b6101f5565b60003073ffffffffffffffffffffffffffffffffffffffff1634836040516107e89190611514565b60006040518083038185875af1925050503d8060008114610825576040519150601f19603f3d011682016040523d82523d6000602084013e61082a565b606091505b505090506108426763a64b3b7153ef0f60c01b6101f5565b610856676979bea93ba7cc8560c01b6101f5565b61086a67f99c32159af5268f60c01b6101f5565b806108aa576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108a190611483565b60405180910390fd5b6108be674764087cbacc9fe160c01b6101f5565b505050565b60006108d967dc179d859af52b7f60c01b6101f5565b6108ed674c09ffdd120fe50d60c01b6101f5565b610901670f4f0cc6f2066f4c60c01b6101f5565b60007f9ab02dcb56b946b957b4d88c05e9905e8a50979ab2c93d1f05b7872215a93106905061093a67427dd08a3e78651860c01b6101f5565b805491505090565b61095667299dec56c8f5e65f60c01b6101f5565b61096a67a5598198f217507760c01b6101f5565b61097e67b39f70228e64e25860c01b6101f5565b61099267cb06da86fd30292860c01b6101f5565b6109a6672b15d55c2cc8159e60c01b6101f5565b6109ae610462565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610a1b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a12906113f1565b60405180910390fd5b610a2f6705e6bba89df6c6f160c01b6101f5565b610a43673159bad55df210d260c01b6101f5565b610a5767d2ab5cd3159738f560c01b6101f5565b610a6b67941282059738f4e760c01b6101f5565b610a7f67ca550eaa0e9fba7b60c01b6101f5565b610a93676cb54fc8a66728c860c01b6101f5565b60007fbdea91235d25bb9906bd9a4ab42f41c0ada3384bb42758d2900fe2fcae34c1fa9050610acc67830a62aa2240046460c01b6101f5565b8181555050565b6000610ae967b9eb5d3d4e4cf3e860c01b6101f5565b610afd6791e084649bd7ba5360c01b6101f5565b610b116702ec39cac72d0ce160c01b6101f5565b60007fbdea91235d25bb9906bd9a4ab42f41c0ada3384bb42758d2900fe2fcae34c1fa9050610b4a67abf4534700c005b660c01b6101f5565b805491505090565b610b66677a7763672986bff060c01b6101f5565b610b7a67a5598198f217507760c01b6101f5565b610b8e67b39f70228e64e25860c01b6101f5565b610ba267cb06da86fd30292860c01b6101f5565b610bb6672b15d55c2cc8159e60c01b6101f5565b610bbe610462565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610c2b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c22906113f1565b60405180910390fd5b610c3f6705e6bba89df6c6f160c01b6101f5565b610c53673159bad55df210d260c01b6101f5565b610c67676e3351db1e08114960c01b6101f5565b610c7b67b5412c500ab6c70d60c01b6101f5565b610c8f6719960dd43b2fe03960c01b6101f5565b610ca36772c1f6609bdbb05a60c01b6101f5565b610cb767f2b13064986500da60c01b6101f5565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610d26576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d1d90611483565b60405180910390fd5b610d3a675044785b33524f2260c01b6101f5565b610d4e6798d9e4dcc1fdc1e160c01b6101f5565b610d626760a0df577565488360c01b6101f5565b7f5a3e66efaa1e445ebd894728a69d6959842ea1e97bd79b892797106e270efcd9610d8b610462565b82604051610d9a92919061152b565b60405180910390a1610db6673afe61a7e132257760c01b6101f5565b610dca67d0ec4926bd7064bb60c01b6101f5565b610dd381610f7c565b50565b610dea676ca897e3a672d33c60c01b6101f5565b610dfe67efd12f349935533d60c01b6101f5565b610e1267766c38a5ca920db860c01b6101f5565b6000610e1c6108c3565b9050610e32676304451739d4bb2060c01b6101f5565b610e46675d23fe9e4604b34960c01b6101f5565b610e5a67a9eac09af79eaa1a60c01b6101f5565b8173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610ec8576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ebf90611483565b60405180910390fd5b610edc674ae1b00595e1ceb560c01b6101f5565b610ef067cf64bf57373b27e060c01b6101f5565b610f0467d0f4642a69a9572260c01b6101f5565b610f0d82610ff8565b610f2167b81bae0c406673c660c01b6101f5565b610f3567d043d9e8c8bfcc5960c01b6101f5565b8173ffffffffffffffffffffffffffffffffffffffff167fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b60405160405180910390a25050565b610f90671ccdb4c3cb7efb6460c01b6101f5565b610fa4671b83cd91a49d3dee60c01b6101f5565b610fb8677649000418c61df860c01b6101f5565b60007f127708131c7435127ed6f385809bed9360985cc735efa3ab7ce86da2c1f5fffb9050610ff1679c0a85f55b1ac0aa60c01b6101f5565b8181555050565b61100c67d001c6f65e5bbfbe60c01b6101f5565b61102067d464f600e422fb5f60c01b6101f5565b61103467fd6a2671dc262a4160c01b6101f5565b60007f9ab02dcb56b946b957b4d88c05e9905e8a50979ab2c93d1f05b7872215a93106905061106d67a3ecd8d2e59ba1ae60c01b6101f5565b8181555050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061109f82611074565b9050919050565b6110af81611094565b82525050565b60006020820190506110ca60008301846110a6565b92915050565b6000604051905090565b600080fd5b600080fd5b6110ed81611094565b81146110f857600080fd5b50565b60008135905061110a816110e4565b92915050565b600060208284031215611126576111256110da565b5b6000611134848285016110fb565b91505092915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61119082611147565b810181811067ffffffffffffffff821117156111af576111ae611158565b5b80604052505050565b60006111c26110d0565b90506111ce8282611187565b919050565b600067ffffffffffffffff8211156111ee576111ed611158565b5b6111f782611147565b9050602081019050919050565b82818337600083830152505050565b6000611226611221846111d3565b6111b8565b90508281526020810184848401111561124257611241611142565b5b61124d848285611204565b509392505050565b600082601f83011261126a5761126961113d565b5b813561127a848260208601611213565b91505092915050565b6000806040838503121561129a576112996110da565b5b60006112a8858286016110fb565b925050602083013567ffffffffffffffff8111156112c9576112c86110df565b5b6112d585828601611255565b9150509250929050565b60008115159050919050565b6112f4816112df565b81146112ff57600080fd5b50565b600081359050611311816112eb565b92915050565b60006020828403121561132d5761132c6110da565b5b600061133b84828501611302565b91505092915050565b61134d816112df565b82525050565b60006020820190506113686000830184611344565b92915050565b600082825260208201905092915050565b7f4f776e6564557067726164656162696c69747950726f78793a20464f5242494460008201527f44454e0000000000000000000000000000000000000000000000000000000000602082015250565b60006113db60238361136e565b91506113e68261137f565b604082019050919050565b6000602082019050818103600083015261140a816113ce565b9050919050565b7f4f776e6564557067726164656162696c69747950726f78793a20494e56414c4960008201527f4400000000000000000000000000000000000000000000000000000000000000602082015250565b600061146d60218361136e565b915061147882611411565b604082019050919050565b6000602082019050818103600083015261149c81611460565b9050919050565b600081519050919050565b600081905092915050565b60005b838110156114d75780820151818401526020810190506114bc565b60008484015250505050565b60006114ee826114a3565b6114f881856114ae565b93506115088185602086016114b9565b80840191505092915050565b600061152082846114e3565b915081905092915050565b600060408201905061154060008301856110a6565b61154d60208301846110a6565b939250505056fea26469706673582212208d0ac11700080187e7635501d4692c6b80f7f91dd0cc0bf6ddadf49eb57cd60664736f6c63430008120033";

type EnderProxyConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: EnderProxyConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class EnderProxy__factory extends ContractFactory {
  constructor(...args: EnderProxyConstructorParams) {
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
      EnderProxy & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): EnderProxy__factory {
    return super.connect(runner) as EnderProxy__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): EnderProxyInterface {
    return new Interface(_abi) as EnderProxyInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): EnderProxy {
    return new Contract(address, _abi, runner) as unknown as EnderProxy;
  }
}
