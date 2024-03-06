// const { expect } = require("chai");
// const { ethers, upgrades } = require("hardhat");
// const { BigNumber } = require("ethers");

// const { EigenLayerStrategyManagerAddress } = require("../utils/common");
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
// function convert(number) {
//   return ethers.BigNumber.from(number).toNumber();
// }

// describe("EnderBond", function () {
//   let owner, wallet1, signer1, signer2, signer3;
//   let endTokenAddress,
//     enderBondAddress,
//     enderTreasuryAddress,
//     enderStakingAddress,
//     instadappLiteAddress,
//     enderOracleAddress;

//   let endToken,
//     enderBond,
//     enderTreasury,
//     enderELStrategy,
//     enderStaking,
//     sEnd,
//     sEndTokenAddress,
//     instadappLitelidoStaking,
//     stEth,
//     bondNFT,
//     enderOracle;

//   before(async function () {
//     const StEth = await ethers.getContractFactory("StEth");
//     const InstadappLite = await ethers.getContractFactory("instadappLite");
//     const EndToken = await ethers.getContractFactory("EndToken");
//     const EnderBond = await ethers.getContractFactory("EnderBond");
//     const EnderTreasury = await ethers.getContractFactory("EnderTreasury");
//     const EnderStaking = await ethers.getContractFactory("EnderStaking");
//     const SEnd = await ethers.getContractFactory("SEndToken");
//     const EnderOracle = await ethers.getContractFactory("EnderOracle");

//     enderOracle = await upgrades.deployProxy(EnderOracle, [], {
//       initializer: "initialize",
//     });
//     enderOracleAddress = await enderOracle.getAddress();

//     stEth = await StEth.deploy();
//     stEthAddress = await stEth.getAddress();

//     // sEnd = await SEnd.deploy();

//     sEnd = await upgrades.deployProxy(SEnd, [], {
//       initializer: "initialize",
//     });
//     sEndTokenAddress = await sEnd.getAddress();

//     instadappLite = await InstadappLite.deploy(stEthAddress);
//     instadappLiteAddress = await instadappLite.getAddress();

//     endToken = await upgrades.deployProxy(EndToken, [], {
//       initializer: "initialize",
//     });
//     await endToken.waitForDeployment();
//     endTokenAddress = await endToken.getAddress();

//     enderBond = await upgrades.deployProxy(
//       EnderBond,
//       [endTokenAddress, instadappLiteAddress, enderOracleAddress],
//       {
//         initializer: "initialize",
//       }
//     );

//     enderBondAddress = await enderBond.getAddress();

//     await endToken.setBond(enderBondAddress);
//     await endToken.setFee(1);

//     enderStaking = await upgrades.deployProxy(
//       EnderStaking,
//       [endTokenAddress, sEndTokenAddress],
//       {
//         initializer: "initialize",
//       }
//     );
//     enderStakingAddress = await enderStaking.getAddress();
//     await sEnd.setMinterRole();
//     console.log("hhdd");
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
//         enderOracleAddress,
//       ],
//       {
//         initializer: "initializeTreasury",
//       }
//     );
//     // console.log("-------------------------------------------------------------------------");

//     enderTreasuryAddress = await enderTreasury.getAddress();

//     const BondNFT = await ethers.getContractFactory("BondNFT");
//     bondNFT = await upgrades.deployProxy(BondNFT, [enderBondAddress, baseURI], {
//       initializer: "initialize",
//     });
//     await bondNFT.waitForDeployment();
//     bondNFTAddress = await bondNFT.getAddress();

//     await enderStaking.setAddress(enderBondAddress, 1);
//     await enderStaking.setAddress(enderTreasuryAddress, 2);

//     // console.log({enderBond});
//     await enderBond.setBondableTokens([stEthAddress], true);
//     await enderBond.setAddress(enderTreasuryAddress, 1);
//     await enderBond.setAddress(bondNFTAddress, 3);
//     [owner, wallet1, signer1, signer2, signer3] = await ethers.getSigners();

//     await endToken.grantRole(MINTER_ROLE, enderStakingAddress);
//   });

//   describe("initialize", function () {
//     // it("Should set the right owner", async function () {
//     //   expect(await enderStaking.owner()).to.equal(owner.address);
//     //   expect(await enderStaking.endToken()).to.equal(endTokenAddress);
//     // });
//     // it("Should set bond and treasurry addresses", async function () {
//     //   await enderStaking.setAddress(enderBondAddress, 1);
//     //   await enderStaking.setAddress(enderTreasuryAddress, 2);
//     //   expect(await enderStaking.sEndToken()).to.equal(sEndTokenAddress);
//     //   expect(await enderStaking.enderBond()).to.equal(enderBondAddress);
//     // });

//     it("staking flow ", async () => {
//       ////////////////DepositPart/////////////////////////////////////////////////////

//       const maturity = 90;
//       const bondFee = 5;

//       const depositPrincipalStEth = expandTo18Decimals(1);

//       await stEth.mint(await signer1.getAddress(), depositPrincipalStEth);

//       await stEth
//         .connect(signer1)
//         .approve(enderBondAddress, depositPrincipalStEth);
//       console.log(
//         "Treasure contract balance before depost",
//         await stEth.balanceOf(enderTreasuryAddress)
//       );

//       //this is where the user will deposit the StEth in to the contract
//       //in the deposit the amount will be divided in to 30 and 70% where the admin Will have access to further
//       //deposit it into the strategy for every 24 hours
//       const tokenId = await depositAndSetup(
//         signer1,
//         depositPrincipalStEth,
//         maturity,
//         bondFee
//       );

//       console.log(
//         "Treasure contract balance after depost",
//         await stEth.balanceOf(enderTreasuryAddress)
//       );
//       expect(await enderBond.rewardShareIndexSend()).to.be.equal(0);
//       expect(await enderBond.rewardShareIndexSend()).to.be.equal(
//         await enderBond.rewardSharePerUserIndexSend(tokenId)
//       );

//       //this fundtion will set the bondYeildShareIndex where it is used to calculate the user S0
//       await enderBond.epochBondYieldShareIndex();
//       // await increaseTime(24 * 3400);

//       // // deposit 1 eth in strategy

//       console.log(
//         "balanceOf address(this)",
//         await stEth.balanceOf(enderTreasuryAddress)
//       );

//       await enderTreasury.depositInStrategy(
//         stEthAddress,
//         instadappLiteAddress,
//         expandTo18Decimals(1)
//       );

//       await increaseTime(24 * 60 * 60 * 365);

//       await enderTreasury.withdrawFromStrategy(
//         stEthAddress,
//         instadappLiteAddress,
//         expandTo18Decimals(1)
//       );

//       // // hit the rebasing reward epoch

//       await enderStaking.epochStakingReward(stEthAddress);

//       await enderTreasury.depositInStrategy(
//         stEthAddress,
//         instadappLiteAddress,
//         expandTo18Decimals(1)
//       );

//       await increaseTime(24 * 60 * 60 * 365);

//       await enderTreasury.withdrawFromStrategy(
//         stEthAddress,
//         instadappLiteAddress,
//         expandTo18Decimals(1)
//       );

//       await enderStaking.epochStakingReward(stEthAddress);


//      console.log( await endToken.balanceOf(enderStakingAddress)," endToken.balanceOf(enderStakingAddress)")
//      console.log(await sEnd.balanceOf(enderBondAddress),"sEnd.balanceOf(enderBondAddress)")
//       // await increaseTime(24 * 3400);

//       // withdrawAndSetup(signer1,tokenId);

//       // await enderStaking.epochStakingReward(stEthAddress);

//       // /////////////////////////////////////////////////////////////////////////////////////////

//       // const depositAmountEnd = expandTo18Decimals(5);

//       // const stakingAmount = expandTo18Decimals(1);
//       // await endToken.setFee(20);
//       // await endToken.setExclude([enderBondAddress], true);
//       // await endToken.setExclude([enderTreasuryAddress], true);
//       // await endToken.grantRole(MINTER_ROLE, owner.address);

//       // //mint to signer1
//       // await endToken.connect(owner).mint(signer1.address, depositAmountEnd);
//       // await endToken.connect(signer1).approve(enderStakingAddress, stakingAmount);
//       // await enderStaking.connect(signer1).stake(stakingAmount);
//       // let userInfo = await enderStaking.userInfo(await signer1.getAddress());
//       // const timeStamp = await ethers.provider.getBlock("latest");
//       // expect(userInfo[0]).to.equal(stakingAmount);
//       // expect(userInfo[1]).to.equal(timeStamp.timestamp);
//       // expect(await sEnd.balanceOf(await signer1.getAddress())).to.be.equal(stakingAmount);

//       // sEnd epoch
//     });

//     async function depositAndSetup(signer, depositAmount, maturity, bondFee) {
//       await enderBond
//         .connect(signer)
//         .deposit(depositAmount, maturity, bondFee, stEthAddress);
//       filter = enderBond.filters.Deposit;
//       const events = await enderBond.queryFilter(filter, -1);

//       const event1 = events[0];

//       const args1 = event1.args;
//       const tokenId = args1.tokenId;

//       return tokenId;
//     }

//     async function withdrawAndSetup(signer, tokenId) {
//       await endToken.grantRole(MINTER_ROLE, enderTreasuryAddress);
//       await enderBond.connect(signer).withdraw(tokenId);
//     }

//     async function increaseTime(seconds) {
//       await ethers.provider.send("evm_increaseTime", [seconds]);
//       await ethers.provider.send("evm_mine");
//     }
//     it("Should stake end tokens", async function () {
//         let stakeAmount = "100000000";
//         await endToken.approve(enderStakingAddress, stakeAmount);
//         await enderStaking.stake(stakeAmount);
//         const timeStamp = await ethers.provider.getBlock("latest");
//         let userInfo = await enderStaking.userInfo(await owner.getAddress());
//         expect(userInfo[0]).to.equal(stakeAmount);
//         expect(userInfo[1]).to.equal(timeStamp.timestamp);
//         expect(await sEnd.balanceOf(await owner.getAddress())).to.be.equal("1000000000000000000000000");
//     });

//     it("Should re-stake end tokens", async function () {
//         let stakeAmount = "100000000";
//         await endToken.approve(enderStakingAddress, stakeAmount);
//         await enderStaking.stake(stakeAmount);
//         const timeStamp = await ethers.provider.getBlock("latest");
//         let userInfo = await enderStaking.userInfo(await owner.getAddress());
//         expect(userInfo[0]).to.equal("200000000");
//         expect(await enderStaking.calculateRebaseIndex()).to.equal("58499999999999");
//         expect(userInfo[1]).to.equal(timeStamp.timestamp);
//         expect(await sEnd.balanceOf(await owner.getAddress())).to.be.equal("1000000000000000000000000");
//     });
//   });
// });
