const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { BigNumber } = require("ethers");

const { EigenLayerStrategyManagerAddress } = require("../utils/common");
const exp = require("constants");
// const { describe } = require("node:test");
const signature = "0xA2fFDf332d92715e88a958A705948ADF75d07d01";
const baseURI =
  "https://endworld-backend-git-dev-metagaming.vercel.app/nft/metadata/";
const MINTER_ROLE =
  "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
const ADMIN_ROLE =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

function expandTo18Decimals(n) {
  return ethers.parseUnits(n.toString(), 18);
}
function expandTo9Decimals(n) {
  return ethers.parseUnits(n.toString(), 9);
}
function convert(number) {
  return ethers.BigNumber.from(number).toNumber();
}

// describe("EnderBond", function () {
//   let owner, wallet1, signer1, signer2, signer3;
//   let endTokenAddress,
//     enderBondAddress,
//     enderTreasuryAddress,
//     enderStakingAddress,
//     instadappLiteAddress;

//   let endToken,
//     enderBond,
//     enderTreasury,
//     enderELStrategy,
//     enderStaking,
//     sEnd,
//     sEndTokenAddress,
//     instadappLitelidoStaking,
//     stEth,
//     bondNFT;

//   before(async function () {
//     const StEth = await ethers.getContractFactory("StEth");
//     const InstadappLite = await ethers.getContractFactory("instadappLite");
//     const EndToken = await ethers.getContractFactory("EndToken");
//     const EnderBond = await ethers.getContractFactory("EnderBond");
//     const EnderTreasury = await ethers.getContractFactory("EnderTreasury");
//     const EnderStaking = await ethers.getContractFactory("EnderStaking");
//     const SEnd = await ethers.getContractFactory("SEndToken");

//     stEth = await StEth.deploy();
//     stEthAddress = await stEth.getAddress();

//     sEnd = await SEnd.deploy();
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
//       [endTokenAddress, instadappLiteAddress],
//       {
//         initializer: "initialize",
//       }
//     );
//     // await enderBond.waitForDeployment();
//     // enderBond = await upgrades.upgradeProxy(await enderBond.getAddress(), EnderBond);

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
//     // console.log(
//     //     endTokenAddress,
//     //     enderStakingAddress,
//     //     enderBondAddress,
//     //     lidoStakingAddress,
//     //     ethers.ZeroAddress,
//     //     ethers.ZeroAddress,
//     // );
//     // console.log({EnderTreasury});
//     enderTreasury = await upgrades.deployProxy(
//       EnderTreasury,
//       [
//         endTokenAddress,
//         enderStakingAddress,
//         enderBondAddress,
//         instadappLiteAddress,
//         ethers.ZeroAddress,
//         ethers.ZeroAddress,
//         30,
//         70,
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
//   });

//   describe("initialize", function () {
//     it("Should set the right owner", async function () {
//       expect(await enderBond.owner()).to.equal(owner.address);
//     });
//   });
//   describe("EnderBond StEth", function () {
//     it("Should allow a user to deposit with valid parameters", async function () {
//       const depositPrincipal = 1000;
//       const maturity = 90;
//       const bondFee = 5;

//       await stEth.mint(
//         await signer1.getAddress(),
//         "1000000000000000000000000000"
//       );
//       await enderBond.connect(owner).setBondableTokens([endTokenAddress], true);

//       await stEth.connect(signer1).approve(enderBondAddress, 1000);
//       await enderBond
//         .connect(signer1)
//         .deposit(depositPrincipal, maturity, bondFee, stEthAddress);
//     });
//     it("TokenId should change every time when the same user comes", async function () {
//       const depositPrincipal = 1000;
//       const maturity = 90;
//       const bondFee = 5;

//       await stEth.mint(
//         await signer1.getAddress(),
//         "1000000000000000000000000000"
//       );
//       await enderBond.connect(owner).setBondableTokens([endTokenAddress], true);
//       await stEth.connect(signer1).approve(enderBondAddress, 2000);

//       // Make the first deposit and capture tokenId1
//       await enderBond
//         .connect(signer1)
//         .deposit(depositPrincipal, maturity, bondFee, stEthAddress);

//       await enderBond
//         .connect(signer1)
//         .deposit(depositPrincipal, maturity, bondFee, stEthAddress);
//       filter = enderBond.filters.Deposit;
//       const events = await enderBond.queryFilter(filter, -1);

//       const event1 = events[0];
//       const event2 = events[1];
//       const args1 = event1.args;
//       const args2 = event2.args;
//       expect(args1.tokenId).to.not.equal(args2.tokenId);
//       expect(args1.user).to.be.equal(args2.user);
//     });

//     it("checking the owner of the tokenId", async function () {
//       const depositPrincipal = 1000;
//       const maturity = 90;
//       const bondFee = 5;

//       await stEth.mint(
//         await signer1.getAddress(),
//         "1000000000000000000000000000"
//       );
//       await enderBond.connect(owner).setBondableTokens([endTokenAddress], true);

//       await stEth.connect(signer1).approve(enderBondAddress, 2000);

//       await enderBond
//         .connect(signer1)
//         .deposit(depositPrincipal, maturity, bondFee, stEthAddress);
//       filter = enderBond.filters.Deposit;
//       const events = await enderBond.queryFilter(filter, -1);

//       const event1 = events[0];

//       const args1 = event1.args;

//       expect(await bondNFT.ownerOf(args1.tokenId)).to.be.equal(signer1.address);
//     });
//   });
//   describe("Deposit Reverts", function () {
//     it("Should not allow principal to be zero", async function () {
//       const depositPrincipal = 0;
//       const maturity = 90;
//       const bondFee = 5;
//       await stEth.connect(signer1).approve(enderBondAddress, 1000);
//       await expect(
//         enderBond
//           .connect(signer1)
//           .deposit(depositPrincipal, maturity, bondFee, stEthAddress)
//       ).to.be.revertedWithCustomError(enderBond, "InvalidAmount()");
//     });

//     it("Should not allow maturity to be greater than 365 days and less than 7 days", async function () {
//       const depositPrincipal = 1000;
//       const maturity = 366;
//       const bondFee = 5;
//       await stEth.connect(signer1).approve(enderBondAddress, 1000);
//       await expect(
//         enderBond
//           .connect(signer1)
//           .deposit(depositPrincipal, maturity, bondFee, stEthAddress)
//       ).to.be.revertedWithCustomError(enderBond, "InvalidMaturity()");

//       await expect(
//         enderBond.connect(signer1).deposit(1000, 6, 5, stEthAddress)
//       ).to.be.revertedWithCustomError(enderBond, "InvalidMaturity()");
//     });

//     it("Should not allow tokens other than bondable token", async function () {
//       const depositPrincipal = 1000;
//       const maturity = 365;
//       const bondFee = 5;
//       const usdc = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
//       await stEth.connect(signer1).approve(enderBondAddress, 1000);
//       await expect(
//         enderBond
//           .connect(signer1)
//           .deposit(depositPrincipal, maturity, bondFee, usdc)
//       ).to.be.revertedWithCustomError(enderBond, "NotBondableToken()");
//     });
//     it("Should not allow bond fees above 100 and below or equal to zero", async function () {
//       const depositPrincipal = 1000;
//       const maturity = 365;
//       const bondFee = 101;
//       await expect(
//         enderBond
//           .connect(signer1)
//           .deposit(depositPrincipal, maturity, bondFee, stEthAddress)
//       ).to.be.revertedWithCustomError(enderBond, "InvalidBondFee()");
//     });
//   });

//   describe("Should properly set state variables", function () {
//     it("Should allow a user to deposit with valid parameters", async function () {
//       const depositAmountEth = "1";
//       const depositPrincipal = ethers.parseEther(depositAmountEth);
//       // console.log({depositPrincipal});
//       const maturity = 90;
//       const bondFee = 5;
//       const tokenId = 1;

//       await stEth.mint(await signer1.getAddress(), depositPrincipal);

//       await stEth.connect(signer1).approve(enderBondAddress, depositPrincipal);
//       await enderBond
//         .connect(signer1)
//         .deposit(depositPrincipal, maturity, bondFee, stEthAddress);
//       filter = enderBond.filters.Deposit;
//       const events = await enderBond.queryFilter(filter, -1);

//       const event1 = events[0];

//       const args1 = event1.args;
//       const bigIntValue = 1000000000000004000n;
//       const stringValue = bigIntValue.toString();
//       expect(await enderBond.availableFundsAtMaturity(19745)).to.be.equal(
//         stringValue
//       );
//       expect(
//         await enderBond.rewardSharePerUserIndex(args1.tokenId)
//       ).to.be.equal(0);
//       expect(
//         await enderBond.rewardSharePerUserIndexSend(args1.tokenId)
//       ).to.be.equal(0);
//       expect(await enderBond.totalDeposit()).to.be.equal(stringValue);
//     });
//     it("check for the availableFundsAtMaturity for one user", async function () {
//       const depositAmountEth = "1";
//       const depositPrincipal = ethers.parseEther(depositAmountEth);
//       // console.log({depositPrincipal});
//       const maturity = 90;
//       const bondFee = 5;

//       await stEth.mint(await signer1.getAddress(), depositPrincipal);

//       await stEth.connect(signer1).approve(enderBondAddress, depositPrincipal);
//       await enderBond
//         .connect(signer1)
//         .deposit(depositPrincipal, maturity, bondFee, stEthAddress);
//       filter = enderBond.filters.Deposit;
//       const events = await enderBond.queryFilter(filter, -1);

//       const event1 = events[0];

//       const args1 = event1.args;
//       const bigIntValue = 2000000000000004000n;
//       const stringValue = bigIntValue.toString();

//       const currentTime = await ethers.provider.getBlock("latest").timestamp;

//       expect(await enderBond.availableFundsAtMaturity(19745)).to.be.equal(
//         stringValue
//       );
//       expect(
//         await enderBond.rewardSharePerUserIndex(args1.tokenId)
//       ).to.be.equal(0);
//       expect(
//         await enderBond.rewardSharePerUserIndexSend(args1.tokenId)
//       ).to.be.equal(0);
//       expect(await enderBond.totalDeposit()).to.be.equal(stringValue);
//     });
//     it("checkin the availableFundsAtMaturity with in  the same day", async function () {
//       const depositAmountEth = "1";
//       const depositPrincipal = ethers.parseEther(depositAmountEth);
//       // console.log({depositPrincipal});
//       const maturity = 90;
//       const bondFee = 5;

//       await stEth.mint(await signer1.getAddress(), depositPrincipal);

//       await stEth.connect(signer1).approve(enderBondAddress, depositPrincipal);

//       //   const currentTime = await ethers.provider.getBlock("latest");
//       //   console.log(currentTime.timestamp, "currentTime");

//       await ethers.provider.send("evm_setNextBlockTimestamp", [
//         1698233706 + 3600,
//       ]);
//       await enderBond
//         .connect(signer1)
//         .deposit(depositPrincipal, maturity, bondFee, stEthAddress);
//       filter = enderBond.filters.Deposit;
//       const events = await enderBond.queryFilter(filter, -1);

//       const event1 = events[0];

//       const args1 = event1.args;
//       const bigIntValue = 3000000000000004000n;
//       const stringValue = bigIntValue.toString();

//       expect(await enderBond.availableFundsAtMaturity(19745)).to.be.equal(
//         stringValue
//       );

//       expect(await enderBond.totalDeposit()).to.be.equal(stringValue);
//     });
//     it("checkin the availableFundsAtMaturity with in the different day  ", async function () {
//       const depositAmountEth = "1";
//       const depositPrincipal = ethers.parseEther(depositAmountEth);
//       // console.log({depositPrincipal});
//       const maturity = 90;
//       const bondFee = 5;

//       await stEth.mint(await signer1.getAddress(), depositPrincipal);

//       await stEth.connect(signer1).approve(enderBondAddress, depositPrincipal);

//       //   const currentTime = await ethers.provider.getBlock("latest");
//       //   console.log(currentTime.timestamp, "currentTime");

//       await ethers.provider.send("evm_setNextBlockTimestamp", [
//         1698233706 + 24 * 3600,
//       ]);
//       await enderBond
//         .connect(signer1)
//         .deposit(depositPrincipal, maturity, bondFee, stEthAddress);
//       filter = enderBond.filters.Deposit;
//       const events = await enderBond.queryFilter(filter, -1);

//       const event1 = events[0];

//       const args1 = event1.args;
//       const bigIntValue = 1000000000000000000n;
//       const stringValue = bigIntValue.toString();

//       const bigIntValueTotalDeposit = 4000000000000004000n;
//       const stringValueTotalDeposit = bigIntValueTotalDeposit.toString();

//       expect(await enderBond.availableFundsAtMaturity(19746)).to.be.equal(
//         stringValue
//       );
//       expect(await enderBond.userDeposit(args1.tokenId)).to.be.equal(
//         stringValue
//       );

//       expect(await enderBond.totalDeposit()).to.be.equal(
//         stringValueTotalDeposit
//       );
//     });
//     it("checkin the rewardSharePerUserIndex   ", async function () {
//       const depositAmountEnd = "5";
//       const depositPrincipalEnd = ethers.parseEther(depositAmountEnd);
//       const amountEndTransfer = "1";
//       const endTransfer = ethers.parseEther(amountEndTransfer);

//       await endToken.grantRole(MINTER_ROLE, owner.address);
//       await endToken.setFee(20);
//       await endToken.connect(owner).mint(signer1.address, depositPrincipalEnd);
//       await endToken.connect(signer1).transfer(signer2.address, endTransfer);

//       await endToken.connect(signer1).transfer(signer2.address, endTransfer);
//       console.log(await endToken.allowance(endTokenAddress, enderBondAddress));
//       await endToken.distributeRefractionFees();

//       const depositAmountEth = "1";
//       const depositPrincipal = ethers.parseEther(depositAmountEth);
//       const maturity = 90;
//       const bondFee = 5;

//       await stEth.mint(await signer1.getAddress(), depositPrincipal);

//       await stEth.connect(signer1).approve(enderBondAddress, depositPrincipal);
//       await enderBond
//         .connect(signer1)
//         .deposit(depositPrincipal, maturity, bondFee, stEthAddress);
//     });

//     it.only("Should deposit and withdraw assets into the strategies", async function () {
//       const depositAmountEnd = "5";
//       const depositPrincipalEnd = ethers.parseEther(depositAmountEnd);
//       const amountEndTransfer = "1";
//       const endTransfer = ethers.parseEther(amountEndTransfer);

//       await endToken.grantRole(MINTER_ROLE, owner.address);
//       await endToken.setFee(20);
//       await endToken.connect(owner).mint(signer1.address, depositPrincipalEnd);
//       await endToken.connect(signer1).transfer(signer2.address, endTransfer);

//       await endToken.connect(signer1).transfer(signer2.address, endTransfer);
//       console.log(await endToken.allowance(endTokenAddress, enderBondAddress));
//       await endToken.distributeRefractionFees();

//       const depositAmountEth = "1";
//       const depositPrincipal = ethers.parseEther(depositAmountEth);
//       const maturity = 90;
//       const bondFee = 5;

//       await stEth.mint(await signer1.getAddress(), depositPrincipal);

//       await stEth.connect(signer1).approve(enderBondAddress, depositPrincipal);
//       await enderBond
//         .connect(signer1)
//         .deposit(depositPrincipal, maturity, bondFee, stEthAddress);

//       let initialStEthBalTreasury = await stEth.balanceOf(enderTreasuryAddress);
//       console.log(await stEth.balanceOf(enderTreasuryAddress));

//       await enderTreasury
//         .connect(signer1)
//         .depositInStrategy(stEthAddress, instadappLiteAddress, 1000);
//       expect(Number(await stEth.balanceOf(enderTreasuryAddress))).to.be.equal(
//         Number(initialStEthBalTreasury) - 1000
//       );
//       expect(Number(await stEth.balanceOf(instadappLiteAddress))).to.be.equal(
//         1000
//       );

//       await ethers.provider.send("evm_increaseTime", [365 * 24 * 60 * 60]);
//       await ethers.provider.send("evm_mine");

//       await enderTreasury
//         .connect(signer1)
//         .withdrawFromStrategy(stEthAddress, instadappLiteAddress, 1000);

//       console.log(await stEth.balanceOf(enderTreasuryAddress));
//       expect(await stEth.balanceOf(enderTreasuryAddress)).to.be.greaterThan(
//         initialStEthBalTreasury
//       );
//       expect(Number(await stEth.balanceOf(instadappLiteAddress))).to.be.equal(
//         0
//       );

//       expect(
//         await enderTreasury.totalRewardsFromStrategy(stEthAddress)
//       ).to.be.equal((1000 * 4) / 100);

//       console.log(
//         "=====================",
//         await enderTreasury.totalRewardsFromStrategy(stEthAddress)
//       );
//     });
//   });
// });

// describe.only("EnderBondWithDraw", function () {
//   let owner, wallet1, signer1, signer2, signer3;
//   let endTokenAddress,
//     enderBondAddress,
//     enderTreasuryAddress,
//     enderStakingAddress,
//     instadappLiteAddress;

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
//     oracle,
//     oracleAddress;

//   before(async function () {
//     const StEth = await ethers.getContractFactory("StEth");
//     const InstadappLite = await ethers.getContractFactory("instadappLite");
//     const EndToken = await ethers.getContractFactory("EndToken");
//     const EnderBond = await ethers.getContractFactory("EnderBond");
//     const EnderTreasury = await ethers.getContractFactory("EnderTreasury");
//     const EnderStaking = await ethers.getContractFactory("EnderStaking");
//     const SEnd = await ethers.getContractFactory("SEndToken");
//     const Oracle = await ethers.getContractFactory("EnderOracle");

//     stEth = await StEth.deploy();
//     stEthAddress = await stEth.getAddress();

//     sEnd = await SEnd.deploy();
//     sEndTokenAddress = await sEnd.getAddress();

//     instadappLitelidoStaking = await InstadappLite.deploy(stEthAddress);
//     instadappLiteAddress = await instadappLitelidoStaking.getAddress();

//     endToken = await upgrades.deployProxy(EndToken, [], {
//       initializer: "initialize",
//     });
//     await endToken.waitForDeployment();
//     endTokenAddress = await endToken.getAddress();

//     enderBond = await upgrades.deployProxy(
//       EnderBond,
//       [endTokenAddress, instadappLiteAddress],
//       {
//         initializer: "initialize",
//       }
//     );
//     // await enderBond.waitForDeployment();
//     // enderBond = await upgrades.upgradeProxy(await enderBond.getAddress(), EnderBond);

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
//     // console.log(
//     //     endTokenAddress,
//     //     enderStakingAddress,
//     //     enderBondAddress,
//     //     lidoStakingAddress,
//     //     ethers.ZeroAddress,
//     //     ethers.ZeroAddress,
//     // );
//     // console.log({EnderTreasury});

//     oracle = await upgrades.deployProxy(Oracle, [], {
//       initializer: "initialize",
//     });

//     oracleAddress = await oracle.getAddress();

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
//   });
//   describe("withdraw", async () => {
//     it("check the withdraw functionality", async () => {
//       const depositAmountEnd = "5";
//       const depositPrincipalEnd = ethers.parseEther(depositAmountEnd);
//       const amountEndTransfer = "1";
//       const endTransfer = ethers.parseEther(amountEndTransfer);

//       await endToken.grantRole(MINTER_ROLE, owner.address);
//       await endToken.setFee(20);
//       await endToken.connect(owner).mint(signer1.address, depositPrincipalEnd);
//       await endToken.connect(signer1).transfer(signer2.address, endTransfer);

//       await endToken.connect(signer1).transfer(signer2.address, endTransfer);

//       // console.log(await endToken.allowance(endTokenAddress, enderBondAddress));
//       await endToken.distributeRefractionFees();

//       const depositAmountEth = "1";
//       const depositPrincipal = ethers.parseEther(depositAmountEth);
//       const maturity = 90;
//       const bondFee = 5;

//       await stEth.mint(await signer1.getAddress(), depositPrincipal);

//       await stEth.connect(signer1).approve(enderBondAddress, depositPrincipal);

//       await enderBond
//         .connect(signer1)
//         .deposit(depositPrincipal, maturity, bondFee, stEthAddress);
//       expect(await stEth.balanceOf(enderTreasuryAddress)).to.equal(
//         depositPrincipal
//       );
//       console.log(
//         await stEth.balanceOf(enderTreasuryAddress),
//         "stEth.balanceOf(enderTreasuryAddress)"
//       );

//       filter = enderBond.filters.Deposit;
//       const events = await enderBond.queryFilter(filter, -1);

//       const event1 = events[0];

//       const args1 = event1.args;
//       console.log(args1.tokenId, "tokenId");

//       let initialStEthBalTreasury = await stEth.balanceOf(enderTreasuryAddress);
//       // const depositInStrategy = "0.0005";
//       // const stEthTransfer = ethers.parseEther(depositInStrategy);
//       // console.log(stEthTransfer, "stEthTransfer");
//       await enderTreasury
//         .connect(signer1)
//         .depositInStrategy(stEthAddress, instadappLiteAddress, 500000000000000);
//       console.log("im here==============");
//       expect(Number(await stEth.balanceOf(enderTreasuryAddress))).to.be.equal(
//         Number(initialStEthBalTreasury) - 500000000000000
//       );
//       expect(Number(await stEth.balanceOf(instadappLiteAddress))).to.be.equal(
//         500000000000000
//       );

//       const currentTime1 = await ethers.provider.getBlock("latest");

//       await ethers.provider.send("evm_setNextBlockTimestamp", [
//         currentTime1.timestamp + 24 * 3600,
//       ]);
//       await enderTreasury
//         .connect(signer1)
//         .depositInStrategy(stEthAddress, instadappLiteAddress, 500000000000000);

//       expect(await bondNFT.ownerOf(args1.tokenId)).to.be.equal(signer1.address);
//       const currentTime = await ethers.provider.getBlock("latest");
//       //   console.log(currentTime.timestamp, "currentTime");

//       await ethers.provider.send("evm_setNextBlockTimestamp", [
//         currentTime.timestamp + 90 * 24 * 3600,
//       ]);

//       await endToken.grantRole(MINTER_ROLE, enderTreasuryAddress);

//       await enderBond.connect(signer1).withdraw(args1.tokenId);

//       expect(await stEth.balanceOf(signer1.address)).to.be.equal(
//         950000000000000000n
//       );
//       console.log(
//         await stEth.balanceOf(enderTreasuryAddress),
//         "await stEth.balanceOf(enderTreasuryAddress) before"
//       );
//     });
//     it("check the revert cases in withdraw functionality", async () => {
//       const depositAmountEnd = "5";
//       const depositPrincipalEnd = ethers.parseEther(depositAmountEnd);
//       const amountEndTransfer = "1";
//       const endTransfer = ethers.parseEther(amountEndTransfer);

//       await endToken.grantRole(MINTER_ROLE, owner.address);
//       await endToken.setFee(20);
//       await endToken.connect(owner).mint(signer1.address, depositPrincipalEnd);
//       await endToken.connect(signer1).transfer(signer2.address, endTransfer);

//       await endToken.connect(signer1).transfer(signer2.address, endTransfer);

//       // console.log(await endToken.allowance(endTokenAddress, enderBondAddress));
//       await endToken.distributeRefractionFees();

//       const depositAmountEth = "1";
//       const depositPrincipal = ethers.parseEther(depositAmountEth);
//       const maturity = 90;
//       const bondFee = 5;

//       await stEth.mint(await signer1.getAddress(), depositPrincipal);

//       await stEth.connect(signer1).approve(enderBondAddress, depositPrincipal);
//       console.log(
//         await stEth.balanceOf(enderTreasuryAddress),
//         "await stEth.balanceOf(enderTreasuryAddress) before"
//       );
//       const beforeBalance = await stEth.balanceOf(enderTreasuryAddress);
//       await enderBond
//         .connect(signer1)
//         .deposit(depositPrincipal, maturity, bondFee, stEthAddress);

//       expect(await stEth.balanceOf(enderTreasuryAddress)).to.equal(
//         beforeBalance + depositPrincipal
//       );

//       filter = enderBond.filters.Deposit;
//       const events = await enderBond.queryFilter(filter, -1);

//       const event1 = events[0];

//       const args1 = event1.args;
//       console.log(args1.tokenId, "tokenId");

//       let initialStEthBalTreasury = await stEth.balanceOf(enderTreasuryAddress);

//       console.log(initialStEthBalTreasury, "initialStEthBalTreasury");
//       await enderTreasury
//         .connect(signer1)
//         .depositInStrategy(stEthAddress, instadappLiteAddress, 500000000000000);
//       console.log("im here==============");

//       expect(Number(await stEth.balanceOf(enderTreasuryAddress))).to.be.equal(
//         Number(initialStEthBalTreasury) - 500000000000000
//       );
//       expect(Number(await stEth.balanceOf(instadappLiteAddress))).to.be.equal(
//         500000000000000
//       );

//       const currentTime1 = await ethers.provider.getBlock("latest");

//       await ethers.provider.send("evm_setNextBlockTimestamp", [
//         currentTime1.timestamp + 24 * 3600,
//       ]);
//       await enderTreasury
//         .connect(signer1)
//         .depositInStrategy(stEthAddress, instadappLiteAddress, 500000000000000);

//       expect(await bondNFT.ownerOf(args1.tokenId)).to.be.equal(signer1.address);
//       const currentTime = await ethers.provider.getBlock("latest");
//       //   console.log(currentTime.timestamp, "currentTime");

//       await ethers.provider.send("evm_setNextBlockTimestamp", [
//         currentTime.timestamp + 90 * 24 * 3600,
//       ]);

//       await endToken.grantRole(MINTER_ROLE, enderTreasuryAddress);

//       await enderBond.connect(signer1).withdraw(args1.tokenId);

//       expect(await stEth.balanceOf(signer1.address)).to.be.equal(
//         950000000000000000n
//       );

//       await enderBond.connect(signer1).withdraw(args1.tokenId);
//     });
//   });
// });
describe.only("EnderBond Deposit and Withdraw", function () {
  let owner, wallet1, signer1, signer2, signer3;
  let endTokenAddress,
    enderBondAddress,
    enderTreasuryAddress,
    enderStakingAddress,
    instadappLiteAddress;

  let endToken,
    enderBond,
    enderTreasury,
    enderELStrategy,
    enderStaking,
    sEnd,
    sEndTokenAddress,
    instadappLitelidoStaking,
    stEth,
    bondNFT,
    oracle,
    oracleAddress;

  before(async function () {
    const StEth = await ethers.getContractFactory("StEth");
    const InstadappLite = await ethers.getContractFactory("instadappLite");
    const EndToken = await ethers.getContractFactory("EndToken");
    const EnderBond = await ethers.getContractFactory("EnderBond");
    const EnderTreasury = await ethers.getContractFactory("EnderTreasury");
    const EnderStaking = await ethers.getContractFactory("EnderStaking");
    const SEnd = await ethers.getContractFactory("SEndToken");
    const Oracle = await ethers.getContractFactory("EnderOracle");

    stEth = await StEth.deploy();
    stEthAddress = await stEth.getAddress();

    sEnd = await SEnd.deploy();
    sEndTokenAddress = await sEnd.getAddress();

    instadappLitelidoStaking = await InstadappLite.deploy(stEthAddress);
    instadappLiteAddress = await instadappLitelidoStaking.getAddress();

    endToken = await upgrades.deployProxy(EndToken, [], {
      initializer: "initialize",
    });
    endTokenAddress = await endToken.getAddress();

    oracle = await upgrades.deployProxy(Oracle, [], {
      initializer: "initialize",
    });

    oracleAddress = await oracle.getAddress();

    enderBond = await upgrades.deployProxy(
      EnderBond,
      [endTokenAddress, instadappLiteAddress, oracleAddress],
      {
        initializer: "initialize",
      }
    );

    enderBondAddress = await enderBond.getAddress();

    await endToken.setBond(enderBondAddress);

    enderStaking = await upgrades.deployProxy(
      EnderStaking,
      [endTokenAddress, sEndTokenAddress],
      {
        initializer: "initialize",
      }
    );
    enderStakingAddress = await enderStaking.getAddress();

    enderTreasury = await upgrades.deployProxy(
      EnderTreasury,
      [
        endTokenAddress,
        enderStakingAddress,
        enderBondAddress,
        instadappLiteAddress,
        ethers.ZeroAddress,
        ethers.ZeroAddress,
        70,
        30,
        oracleAddress,
      ],
      {
        initializer: "initializeTreasury",
      }
    );
    // console.log("-------------------------------------------------------------------------");

    enderTreasuryAddress = await enderTreasury.getAddress();

    const BondNFT = await ethers.getContractFactory("BondNFT");
    bondNFT = await upgrades.deployProxy(BondNFT, [enderBondAddress, baseURI], {
      initializer: "initialize",
    });
    await bondNFT.waitForDeployment();
    bondNFTAddress = await bondNFT.getAddress();

    await enderStaking.setAddress(enderBondAddress, 1);
    await enderStaking.setAddress(enderTreasuryAddress, 2);

    // console.log({enderBond});
    await enderBond.setBondableTokens([stEthAddress], true);
    await enderBond.setAddress(enderTreasuryAddress, 1);
    await enderBond.setAddress(bondNFTAddress, 3);

    [owner, wallet1, signer1, signer2, signer3] = await ethers.getSigners();

    await endToken.grantRole(MINTER_ROLE, owner.address);
    await endToken.setFee(20);
  });

  describe("withdraw", async () => {
    it("should successfully withdraw and update balances", async () => {
      const maturity = 90;
      const bondFee = 5;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);

      const endTransfer = expandTo18Decimals(1);
      await endToken.setFee(20);

      //mint to signer1
      await endToken.connect(owner).mint(signer1.address, depositAmountEnd);

      //first transfer
      await endToken.connect(signer1).transfer(signer2.address, endTransfer);

      //second transfer
      await endToken.connect(signer1).transfer(signer2.address, endTransfer);

      expect(await endToken.balanceOf(enderBondAddress)).to.be.equal(0);

      //as we hit the distribute Refraction Fee the fee that is collected in the
      //end token will be send to the enderBond and S is updated Aswell
      //  and the user can cliam for the enderbond
      //******* this will revert here because , we cant call this function until first deposit
      // is done  *******************
      // await endToken.distributeRefractionFees();
      await expect(
        endToken.distributeRefractionFees()
      ).to.be.revertedWithCustomError(enderBond, "WaitForFirstDeposit");

      expect(await enderBond.rewardShareIndex()).to.be.equal(0);

      await stEth.mint(await signer1.getAddress(), depositPrincipalStEth);

      await stEth
        .connect(signer1)
        .approve(enderBondAddress, depositPrincipalStEth);

      //this is where the user will deposit the StEth in to the contract
      //in the deposit the amount will be divided in to 30 and 70% where the admin Will have access to further
      //deposit it into the strategy for every 24 hours
      const tokenId = await depositAndSetup(
        signer1,
        depositPrincipalStEth,
        maturity,
        bondFee
      );

      //this fundtion will set the bondYeildShareIndex where it is used to calculate the user S0
      await enderBond.epochBondYieldShareIndex();
      //user cant collect the refraction rewards before the Distribution is done
      await expect(
        enderBond.connect(signer1).claimRefractionRewards(tokenId)
      ).to.be.revertedWithCustomError(enderBond, "NoRewardCollected");

      expect(await enderBond.bondYeildShareIndex()).to.be.greaterThan(
        await enderBond.userBondYieldShareIndex(tokenId)
      );

      //now this can be called because the first deposit has done
      await endToken.distributeRefractionFees();

      //  there are two tx done above which have 20% fee it will be equal to 400000000000000000
      expect(await endToken.balanceOf(enderBondAddress)).to.be.equal(
        expandTo18Decimals(0.4)
      );

      const initialBalanceOfuser = await endToken.balanceOf(signer1.address);

      //as the distribution is done user now can withdraw the rewards
      await enderBond.connect(signer1).claimRefractionRewards(tokenId);

      //as he claimed the rewards
      expect(await endToken.balanceOf(signer1.address)).to.be.greaterThan(
        initialBalanceOfuser
      );
      console.log(
        await endToken.balanceOf(enderBondAddress),
        "),------------------)"
      );

      //for depositing second time by the same user

      // await stEth.mint(await signer1.getAddress(), depositPrincipalStEth);

      // await stEth
      //   .connect(signer1)
      //   .approve(enderBondAddress, depositPrincipalStEth);

      // const tokenId2 = await depositAndSetup(
      //   signer1,
      //   depositPrincipalStEth,
      //   maturity * 2,
      //   bondFee
      // );

      // //this fundtion will set the bondYeildShareIndex where it is used to calculate the user S0
      // await enderBond.epochBondYieldShareIndex();

      // expect(await enderBond.bondYeildShareIndex()).to.be.greaterThan(
      //   await enderBond.userBondYieldShareIndex(tokenId2)
      // );

      // expect(await bondNFT.ownerOf(tokenId2)).to.be.equal(
      //   await bondNFT.ownerOf(tokenId)
      // );

      // //user cant collect the refraction rewards before the Distribution is done
      // await expect(
      //   enderBond.connect(signer1).claimRefractionRewards(tokenId2)
      // ).to.be.revertedWithCustomError(enderBond, "NoRewardCollected");

      // //increasing the time 1 day

      // increaseTime(24 * 3600);
      // const initalBalanceOfEnderBond = await endToken.balanceOf(
      //   enderBondAddress
      // );
      // await endToken.distributeRefractionFees();

      // //  there are two tx done above which have 20% fee it will be equal to 0.080000000896
      // //because the refraction rewarded colledted when the rewared is transferred to the tokenId1
      // expect(await endToken.balanceOf(enderBondAddress)).to.be.greaterThan(
      //   initalBalanceOfEnderBond
      // );

      // console.log(await endToken.balanceOf(enderBondAddress),"endToken.balanceOf(enderBondAddress)")

      // const initialBalanceOfuser1 = await endToken.balanceOf(signer1.address);

      // //as the distribution is done user now can withdraw the rewards
      // await enderBond.connect(signer1).claimRefractionRewards(tokenId2);

      // //as he claimed the rewards
      // expect(await endToken.balanceOf(signer1.address)).to.be.greaterThan(
      //   initialBalanceOfuser1
      // );

      //now we hit the refraction function in the token contract
      //which will update the rewardShareIndex in the enderbond

      const userAddressBefore = await endToken.balanceOf(signer1.address);

      // Wait for the bond to mature
      // await increaseTime(90 * 24 * 3600);
      // await withdrawAndSetup(signer1, tokenId);
      // expect(await stEth.balanceOf(signer1.address)).to.be.equal(
      //   depositPrincipalStEth - expandTo18Decimals(0.05)
      // );
      // const userAddressAfter = await endToken.balanceOf(signer1.address);

      // expect(userAddressAfter).to.be.equal(userAddressBefore + 663308219);
    });
    // it("should successfully withdraw from the treasury", async () => {
    //   const maturity = 90;
    //   const bondFee = 5;
    //   const depositAmountEnd = expandTo18Decimals(5);
    //   const depositPrincipalStEth = expandTo18Decimals(1);

    //   const endTransfer = expandTo18Decimals(1);
    //   await endToken.setFee(20);
    //   await endToken.connect(owner).mint(signer1.address, depositAmountEnd);
    //   await endToken.connect(signer1).transfer(signer2.address, endTransfer);

    //   await endToken.connect(signer1).transfer(signer2.address, endTransfer);

    //   await stEth.mint(await signer1.getAddress(), depositPrincipalStEth);

    //   await stEth
    //     .connect(signer1)
    //     .approve(enderBondAddress, depositPrincipalStEth);

    //   //this is where the user will deposit the StEth in to the contract
    //   //in the deposit the amount will be divided in to 30 and 70% where the admin Will have access to further
    //   //deposit it into the strategy for every 24 hours
    //   const tokenId = await depositAndSetup(
    //     signer1,
    //     depositPrincipalStEth,
    //     maturity,
    //     bondFee
    //   );

    //   // Wait for the bond to mature
    //   await increaseTime(90 * 24 * 3600);

    //   await withdrawAndSetup(signer1, tokenId);
    // });

    // it("should handle revert cases during withdrawal", async () => {
    //   const maturity = 90;
    //   const bondFee = 5;
    //   const depositAmountEnd = expandTo18Decimals(5);
    //   const depositPrincipalStEth = expandTo18Decimals(1);

    //   const endTransfer = expandTo18Decimals(1);

    //   await endToken.connect(owner).mint(signer1.address, depositAmountEnd);
    //   await endToken.connect(signer1).transfer(signer2.address, endTransfer);

    //   await endToken.connect(signer1).transfer(signer2.address, endTransfer);

    //   await endToken.distributeRefractionFees();

    //   await stEth.mint(await signer1.getAddress(), depositPrincipalStEth);

    //   await stEth
    //     .connect(signer1)
    //     .approve(enderBondAddress, depositPrincipalStEth);

    //   //this is where the user will deposit the StEth in to the contract
    //   //in the deposit the amount will be divided in to 30 and 70% where the admin Will have access to further
    //   //deposit it into the strategy for every 24 hours
    //   const tokenId = await depositAndSetup(
    //     signer1,
    //     depositPrincipalStEth,
    //     maturity,
    //     bondFee
    //   );

    //   // Wait for the bond to mature
    //   await expect(
    //     withdrawAndSetup(signer1, tokenId)
    //   ).to.be.revertedWithCustomError(enderBond, "BondNotMatured");
    //   await increaseTime(90 * 24 * 3600);
    //   await withdrawAndSetup(signer1, tokenId);

    //   await expect(
    //     withdrawAndSetup(signer1, tokenId)
    //   ).to.be.revertedWithCustomError(enderBond, "BondAlreadyWithdrawn");

    //   await expect(
    //     withdrawAndSetup(signer2, tokenId)
    //   ).to.be.revertedWithCustomError(enderBond, "NotBondUser");
    //   console.log("last-----------------------------");
    // });
  });

  async function depositAndSetup(signer, depositAmount, maturity, bondFee) {
    await enderBond
      .connect(signer)
      .deposit(depositAmount, maturity, bondFee, stEthAddress);
    filter = enderBond.filters.Deposit;
    const events = await enderBond.queryFilter(filter, -1);

    const event1 = events[0];

    const args1 = event1.args;
    const tokenId = args1.tokenId;

    return tokenId;
  }

  async function withdrawAndSetup(signer, tokenId) {
    await endToken.grantRole(MINTER_ROLE, enderTreasuryAddress);
    await enderBond.connect(signer).withdraw(tokenId);
  }

  async function increaseTime(seconds) {
    await ethers.provider.send("evm_increaseTime", [seconds]);
    await ethers.provider.send("evm_mine");
  }
});
