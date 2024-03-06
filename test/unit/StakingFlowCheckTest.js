// const { expect } = require("chai");
// const { ethers, upgrades } = require("hardhat");
// const { BigNumber } = require("ethers");

// const { EigenLayerStrategyManagerAddress } = require("../utils/common");
// const exp = require("constants");
// const { sign } = require("crypto");
// const { log } = require("console");
// // const { describe } = require("node:test");
// const signature = "0xA2fFDf332d92715e88a958A705948ADF75d07d01";
// const baseURI =
//   "https://endworld-backend-git-dev-metagaming.vercel.app/nft/metadata/";
// const MINTER_ROLE =
//   "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
// const ADMIN_ROLE =
//   "0x0000000000000000000000000000000000000000000000000000000000000000";

// function expandTo18Decimals(n) {
//   return ethers.parseUnits(n.toString(), 18);
// }

// describe("EnderBond Deposit and Withdraw", function () {
//   let owner, signer, signer1, signer2, signer3, signer4;
//   let endTokenAddress,
//     enderBondAddress,
//     enderTreasuryAddress,
//     enderStakingAddress,
//     mockWETHAddress,
//     instadappLiteAddress;

//   let endToken,
//     enderBond,
//     enderTreasury,
//     enderELStrategy,
//     enderStaking,
//     sEnd,
//     sEndTokenAddress,
//     instadappLitelidoStaking,
//     WETH,
//     stEth,
//     bondNFT,
//     oracle,
//     oracleAddress;

//   before(async function () {
//     const wETH = await ethers.getContractFactory("mockWETH");
//     const StEth = await ethers.getContractFactory("StETH");
//     const InstadappLite = await ethers.getContractFactory("StinstaToken");
//     const EndToken = await ethers.getContractFactory("EndToken");
//     const EnderBond = await ethers.getContractFactory("EnderBond");
//     const EnderTreasury = await ethers.getContractFactory("EnderTreasury");
//     const EnderStaking = await ethers.getContractFactory("EnderStaking");
//     const SEnd = await ethers.getContractFactory("SEndToken");
//     const Oracle = await ethers.getContractFactory("EnderOracle");

//     [owner, signer, wallet1, signer1, signer2, signer3, signer4] = await ethers.getSigners();

//     stEth = await StEth.deploy();
//     stEthAddress = await stEth.getAddress();

//     // sEnd = await SEnd.connect(owner).deploy();
//     sEnd = await upgrades.deployProxy(SEnd, [], {
//       initializer: "initialize",
//     });
//     sEndTokenAddress = await sEnd.connect(owner).getAddress();

//     instadappLitelidoStaking = await InstadappLite.deploy("InstaToken", "Inst", owner.address, stEthAddress);
//     instadappLiteAddress = await instadappLitelidoStaking.getAddress();
//     endToken = await upgrades.deployProxy(EndToken, [], {
//       initializer: "initialize",
//     });
//     endTokenAddress = await endToken.getAddress();

//     oracle = await upgrades.deployProxy(Oracle, [], {
//       initializer: "initialize",
//     });

//     oracleAddress = await oracle.getAddress();

//     enderBond = await upgrades.deployProxy(
//       EnderBond,
//       [endTokenAddress, ethers.ZeroAddress, oracleAddress, signer.address],
//       {
//         initializer: "initialize",
//       }
//     );

//     enderBondAddress = await enderBond.getAddress();

//     await endToken.setBond(enderBondAddress);

//     enderStaking = await upgrades.deployProxy(
//       EnderStaking,
//       [endTokenAddress, sEndTokenAddress, signer.address],
//       {
//         initializer: "initialize",
//       }
//     );
//     enderStakingAddress = await enderStaking.getAddress();

//     enderTreasury = await upgrades.deployProxy(
//       EnderTreasury,
//       [
//         endTokenAddress,
//         enderStakingAddress,
//         enderBondAddress,
//         instadappLiteAddress,
//         ethers.ZeroAddress,
//         ethers.ZeroAddress,
//         70,
//         30,
//         oracleAddress,
//       ],
//       {
//         initializer: "initializeTreasury",
//       }
//     );

//     enderTreasuryAddress = await enderTreasury.getAddress();

//     const BondNFT = await ethers.getContractFactory("BondNFT");
//     bondNFT = await upgrades.deployProxy(BondNFT, [enderBondAddress, baseURI], {
//       initializer: "initialize",
//     });
//     await bondNFT.waitForDeployment();
//     bondNFTAddress = await bondNFT.getAddress();
//     // await sEnd.connect(owner).grantRole("0x0000000000000000000000000000000000000000000000000000000000000000", "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
//     await sEnd.setAddress(enderStakingAddress, 1);
//     await enderStaking.setAddress(enderBondAddress, 1);
//     await enderStaking.setAddress(enderTreasuryAddress, 2);

//     await enderStaking.setAddress(stEthAddress, 6);
//     await enderBond.setBondableTokens([stEthAddress], true);
//     await enderBond.setAddress(enderTreasuryAddress, 1);
//     await enderBond.setAddress(bondNFTAddress, 3);
//     await enderBond.setAddress(sEndTokenAddress, 9);
//     await sEnd.setStatus(2);
//     await sEnd.whitelist(enderBondAddress, true);
//     await endToken.grantRole(MINTER_ROLE, owner.address);
//     await endToken.setFee(20);

//     await endToken.setExclude([enderBondAddress], true);
//     await endToken.setExclude([enderTreasuryAddress], true);
//     await endToken.setExclude([enderStakingAddress], true);

//     await enderBond.setAddress(enderStakingAddress, 8);
//     await enderBond.setAddress(stEthAddress, 6);

//     await endToken.grantRole(MINTER_ROLE, enderStakingAddress);
//     await endToken.grantRole("0xe13c49f41ace7b3f26b0cf23ab168b4c48591998827e86cfa78a62930e4d6953", enderBondAddress);
//     await endToken.grantRole("0xe13c49f41ace7b3f26b0cf23ab168b4c48591998827e86cfa78a62930e4d6953", owner.address);

//     await enderBond.setBool(true);
//     // await endToken.grantRole()
//   });

//   describe("Staking", async () => {
   
//     it("stake", async () => {

//         await endToken.mint(90);

//        await enderStaking.stake(90);

//     });

 
//   });

//   async function depositAndSetup(signer, depositAmount, maturity, bondFee, [user, key, signature]) {
//     await enderBond
//       .connect(signer)
//       .deposit(signer, depositAmount, maturity, bondFee, stEthAddress, [user, key, signature]);
//     filter = enderBond.filters.Deposit;
//     const events = await enderBond.queryFilter(filter, -1);

//     const event1 = events[0];

//     const args1 = event1.args;
//     const tokenId = args1.tokenId;

//     return tokenId;
//   }

//   async function withdrawAndSetup(signer, tokenId) {
//     await endToken.grantRole(MINTER_ROLE, enderTreasuryAddress);
//     await enderBond.connect(signer).withdraw(tokenId);
//   }

//   async function signatureDigest() {
//     let sig = await signer.signTypedData(
//       {
//         name: "bondContract",
//         version: "1",
//         chainId: 31337,
//         verifyingContract: enderBondAddress,
//       },
//       {
//         userSign: [
//           {
//             name: 'user',
//             type: 'address',
//           },
//           {
//             name: 'key',
//             type: 'string',
//           },
//         ],
//       },
//       {
//         user: signer1.address,
//         key: "0",
//       }
//     )
//     return sig;
//   };

//   async function signatureDigest1() {
//     let sig = await signer.signTypedData(
//       {
//         name: "bondContract",
//         version: "1",
//         chainId: 31337,
//         verifyingContract: enderBondAddress,
//       },
//       {
//         userSign: [
//           {
//             name: 'user',
//             type: 'address',
//           },
//           {
//             name: 'key',
//             type: 'string',
//           },
//         ],
//       },
//       {
//         user: signer2.address,
//         key: "0",
//       }
//     )
//     return sig;
//   };

//   async function signatureDigest2() {
//     let sig = await signer.signTypedData(
//       {
//         name: "stakingContract",
//         version: "1",
//         chainId: 31337,
//         verifyingContract: enderStakingAddress,
//       },
//       {
//         userSign: [
//           {
//             name: 'user',
//             type: 'address',
//           },
//           {
//             name: 'key',
//             type: 'string',
//           },
//         ],
//       },
//       {
//         user: signer3.address,
//         key: "0",
//       }
//     )
//     return sig;
//   };

//   async function increaseTime(seconds) {
//     await ethers.provider.send("evm_increaseTime", [seconds]);
//     await ethers.provider.send("evm_mine");
//   }
// });

// function sleep(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }
