// const { expect } = require("chai");
// const { ethers, upgrades } = require("hardhat");
// const { BigNumber } = require("ethers");

// const { EigenLayerStrategyManagerAddress } = require("../utils/common");
// // const { describe } = require("node:test");
// const signature = "0xA2fFDf332d92715e88a958A705948ADF75d07d01";
// const baseURI = "https://endworld-backend-git-dev-metagaming.vercel.app/nft/metadata/";
// const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
// const ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";

// function expandTo18Decimals(n) {
//     return BigNumber.from(n).mul(BigNumber.from(10).pow(18));
// }
// function convert(number) {
//     return ethers.BigNumber.from(number).toNumber();
// }

// describe.only("EnderBond", function () {
//     let owner, wallet1, signer1, signer2, signer3;
//     let endTokenAddress,
//         enderBondAddress,
//         enderTreasuryAddress,
//         enderStakingAddress,
//         instadappLiteAddress,
//         enderOracleAddress;

//     let endToken,
//         enderBond,
//         enderTreasury,
//         enderELStrategy,
//         enderStaking,
//         sEnd,
//         sEndTokenAddress,
//         instadappLitelidoStaking,
//         stEth,
//         bondNFT,
//         enderOracle;

//     before(async function () {
//         const StEth = await ethers.getContractFactory("StEth");
//         const InstadappLite = await ethers.getContractFactory("instadappLite");
//         const EndToken = await ethers.getContractFactory("EndToken");
//         const EnderBond = await ethers.getContractFactory("EnderBond");
//         const EnderTreasury = await ethers.getContractFactory("EnderTreasury");
//         const EnderStaking = await ethers.getContractFactory("EnderStaking");
//         const SEnd = await ethers.getContractFactory("SEndToken");
//         const EnderOracle = await ethers.getContractFactory("EnderOracle");

//         enderOracle = await upgrades.deployProxy(EnderOracle, [], {
//             initializer: "initialize",
//         });
//         enderOracleAddress = await enderOracle.getAddress();

//         stEth = await StEth.deploy();
//         stEthAddress = await stEth.getAddress();

//         sEnd = await SEnd.deploy();
//         sEndTokenAddress = await sEnd.getAddress();

//         instadappLite = await InstadappLite.deploy(stEthAddress);
//         instadappLiteAddress = await instadappLite.getAddress();

//         endToken = await upgrades.deployProxy(EndToken, [], {
//             initializer: "initialize",
//         });
//         await endToken.waitForDeployment();
//         endTokenAddress = await endToken.getAddress();

//         enderBond = await upgrades.deployProxy(EnderBond, [endTokenAddress, instadappLiteAddress], {
//             initializer: "initialize",
//         });
//         // await enderBond.waitForDeployment();
//         // enderBond = await upgrades.upgradeProxy(await enderBond.getAddress(), EnderBond);

//         enderBondAddress = await enderBond.getAddress();

//         await endToken.setBond(enderBondAddress);
//         await endToken.setFee(1);

//         enderStaking = await upgrades.deployProxy(
//             EnderStaking,
//             [endTokenAddress, sEndTokenAddress],
//             {
//                 initializer: "initialize",
//             },
//         );
//         enderStakingAddress = await enderStaking.getAddress();
//         // console.log(
//         //     endTokenAddress,
//         //     enderStakingAddress,
//         //     enderBondAddress,
//         //     lidoStakingAddress,
//         //     ethers.ZeroAddress,
//         //     ethers.ZeroAddress,
//         // );
//         // console.log({EnderTreasury});
//         enderTreasury = await upgrades.deployProxy(
//             EnderTreasury,
//             [
//                 endTokenAddress,
//                 enderStakingAddress,
//                 enderBondAddress,
//                 instadappLiteAddress,
//                 ethers.ZeroAddress,
//                 ethers.ZeroAddress,
//                 30,
//                 70,
//                 enderOracleAddress
//             ],
//             {
//                 initializer: "initializeTreasury",
//             },
//         );
//         // console.log("-------------------------------------------------------------------------");

//         enderTreasuryAddress = await enderTreasury.getAddress();

//         const BondNFT = await ethers.getContractFactory("BondNFT");
//         bondNFT = await upgrades.deployProxy(BondNFT, [enderBondAddress, baseURI], {
//             initializer: "initialize",
//         });
//         await bondNFT.waitForDeployment();
//         bondNFTAddress = await bondNFT.getAddress();

//         await enderBond.setTxFees("50000");

//         await enderStaking.setAddress(enderBondAddress, 1);
//         await enderStaking.setAddress(enderTreasuryAddress, 2);

//         // console.log({enderBond});
//         await enderBond.setBondableTokens([stEthAddress], true);
//         await enderBond.setAddress(enderTreasuryAddress, 1);
//         await enderBond.setAddress(bondNFTAddress, 3);
//         [owner, wallet1, signer1, signer2, signer3] = await ethers.getSigners();
//     });

//     describe("initialize", function () {
//         it("Should set the right owner", async function () {
//             expect(await enderBond.owner()).to.equal(owner.address);
//         });
//     });
//     describe("EnderBond StEth", function () {
//         it("Should allow a user to deposit with valid parameters", async function () {
//             const depositPrincipal = 1000;
//             const maturity = 90;
//             const bondFee = 5;

//             await stEth.mint(await signer1.getAddress(), "1000000000000000000000000000");
//             await enderBond.connect(owner).setBondableTokens([endTokenAddress], true);

//             await stEth.connect(signer1).approve(enderBondAddress, 1000);
//             await enderBond
//                 .connect(signer1)
//                 .deposit(depositPrincipal, maturity, bondFee, stEthAddress);
//         });
//         it("TokenId should change every time when the same user comes", async function () {
//             const depositPrincipal = 1000;
//             const maturity = 90;
//             const bondFee = 5;

//             await stEth.mint(await signer1.getAddress(), "1000000000000000000000000000");
//             await enderBond.connect(owner).setBondableTokens([endTokenAddress], true);
//             await stEth.connect(signer1).approve(enderBondAddress, 2000);

//             // Make the first deposit and capture tokenId1
//             await enderBond
//                 .connect(signer1)
//                 .deposit(depositPrincipal, maturity, bondFee, stEthAddress);

//             await enderBond
//                 .connect(signer1)
//                 .deposit(depositPrincipal, maturity, bondFee, stEthAddress);
//             filter = enderBond.filters.Deposit;
//             const events = await enderBond.queryFilter(filter, -1);

//             const event1 = events[0];
//             const event2 = events[1];
//             const args1 = event1.args;
//             const args2 = event2.args;
//             expect(args1.tokenId).to.not.equal(args2.tokenId);
//             expect(args1.user).to.be.equal(args2.user);
//         });

//         it("checking the owner of the tokenId", async function () {
//             const depositPrincipal = 1000;
//             const maturity = 90;
//             const bondFee = 5;

//             await stEth.mint(await signer1.getAddress(), "1000000000000000000000000000");
//             await enderBond.connect(owner).setBondableTokens([endTokenAddress], true);

//             await stEth.connect(signer1).approve(enderBondAddress, 2000);

//             await enderBond
//                 .connect(signer1)
//                 .deposit(depositPrincipal, maturity, bondFee, stEthAddress);
//             filter = enderBond.filters.Deposit;
//             const events = await enderBond.queryFilter(filter, -1);

//             const event1 = events[0];

//             const args1 = event1.args;

//             expect(await bondNFT.ownerOf(args1.tokenId)).to.be.equal(signer1.address);
//         });
//         it("Should decuct fees on each transfer of NFT", async function () {
//             const depositPrincipal = 100000000000000;
//             const maturity = 90;
//             const bondFee = 5;

//             await stEth.mint(await signer1.getAddress(), "1000000000000000000000000000");
//             await enderBond.connect(owner).setBondableTokens([endTokenAddress], true);

//             await stEth.connect(signer1).approve(enderBondAddress, depositPrincipal);
//             await enderBond
//                 .connect(signer1)
//                 .deposit(depositPrincipal, maturity, bondFee, stEthAddress);
//                 console.log(await signer1.getAddress(),await owner.getAddress());
//                 console.log(await bondNFT.ownerOf(1));
//             let userBondPrincipalAmountBef = await enderBond.userBondPrincipalAmount(1);
//             console.log(userBondPrincipalAmountBef);
//             await bondNFT.connect(signer1).safeTransferFrom(await signer1.getAddress(),await owner.getAddress(),1);
//             let userBondPrincipalAmountAf = await enderBond.userBondPrincipalAmount(1);
//             expect(Number(userBondPrincipalAmountAf)).to.be.lessThan(userBondPrincipalAmountBef);
//         });
//     });
//     describe("Deposit Reverts", function () {
//         it("Should not allow principal to be zero", async function () {
//             const depositPrincipal = 0;
//             const maturity = 90;
//             const bondFee = 5;
//             await stEth.connect(signer1).approve(enderBondAddress, 1000);
//             await expect(
//                 enderBond
//                     .connect(signer1)
//                     .deposit(depositPrincipal, maturity, bondFee, stEthAddress),
//             ).to.be.revertedWithCustomError(enderBond, "InvalidAmount()");
//         });

//         it("Should not allow maturity to be greater than 365 days and less than 7 days", async function () {
//             const depositPrincipal = 1000;
//             const maturity = 366;
//             const bondFee = 5;
//             await stEth.connect(signer1).approve(enderBondAddress, 1000);
//             await expect(
//                 enderBond
//                     .connect(signer1)
//                     .deposit(depositPrincipal, maturity, bondFee, stEthAddress),
//             ).to.be.revertedWithCustomError(enderBond, "InvalidMaturity()");

//             await expect(
//                 enderBond.connect(signer1).deposit(1000, 6, 5, stEthAddress),
//             ).to.be.revertedWithCustomError(enderBond, "InvalidMaturity()");
//         });

//         it("Should not allow tokens other than bondable token", async function () {
//             const depositPrincipal = 1000;
//             const maturity = 365;
//             const bondFee = 5;
//             const usdc = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
//             await stEth.connect(signer1).approve(enderBondAddress, 1000);
//             await expect(
//                 enderBond.connect(signer1).deposit(depositPrincipal, maturity, bondFee, usdc),
//             ).to.be.revertedWithCustomError(enderBond, "NotBondableToken()");
//         });
//         it("Should not allow bond fees above 100 and below or equal to zero", async function () {
//             const depositPrincipal = 1000;
//             const maturity = 365;
//             const bondFee = 101;
//             await expect(
//                 enderBond
//                     .connect(signer1)
//                     .deposit(depositPrincipal, maturity, bondFee, stEthAddress),
//             ).to.be.revertedWithCustomError(enderBond, "InvalidBondFee()");
//         });
//     });

//     describe("Should properly set state variables", function () {
//         it("Should allow a user to deposit with valid parameters", async function () {
//             const depositAmountEth = "1";
//             const depositPrincipal = ethers.parseEther(depositAmountEth);
//             // console.log({depositPrincipal});
//             const maturity = 90;
//             const bondFee = 5;
//             const tokenId = 1;

//             await stEth.mint(await signer1.getAddress(), depositPrincipal);

//             await stEth.connect(signer1).approve(enderBondAddress, depositPrincipal);
//             await enderBond
//                 .connect(signer1)
//                 .deposit(depositPrincipal, maturity, bondFee, stEthAddress);
//             filter = enderBond.filters.Deposit;
//             const events = await enderBond.queryFilter(filter, -1);

//             const event1 = events[0];

//             const args1 = event1.args;
//             const bigIntValue = 1000000000000004000n;
//             const stringValue = bigIntValue.toString();
//             expect(await enderBond.availableFundsAtMaturity(19745)).to.be.equal(stringValue);
//             expect(await enderBond.rewardSharePerUserIndex(args1.tokenId)).to.be.equal(0);
//             expect(await enderBond.rewardSharePerUserIndexSend(args1.tokenId)).to.be.equal(0);
//             expect(await enderBond.totalDeposit()).to.be.equal(stringValue);
//         });
//         it("check for the availableFundsAtMaturity for one user", async function () {
//             const depositAmountEth = "1";
//             const depositPrincipal = ethers.parseEther(depositAmountEth);
//             // console.log({depositPrincipal});
//             const maturity = 90;
//             const bondFee = 5;

//             await stEth.mint(await signer1.getAddress(), depositPrincipal);

//             await stEth.connect(signer1).approve(enderBondAddress, depositPrincipal);
//             await enderBond
//                 .connect(signer1)
//                 .deposit(depositPrincipal, maturity, bondFee, stEthAddress);
//             filter = enderBond.filters.Deposit;
//             const events = await enderBond.queryFilter(filter, -1);

//             const event1 = events[0];

//             const args1 = event1.args;
//             const bigIntValue = 2000000000000004000n;
//             const stringValue = bigIntValue.toString();

//             const currentTime = await ethers.provider.getBlock("latest").timestamp;

//             expect(await enderBond.availableFundsAtMaturity(19745)).to.be.equal(stringValue);
//             expect(await enderBond.rewardSharePerUserIndex(args1.tokenId)).to.be.equal(0);
//             expect(await enderBond.rewardSharePerUserIndexSend(args1.tokenId)).to.be.equal(0);
//             expect(await enderBond.totalDeposit()).to.be.equal(stringValue);
//         });
//         it("checkin the availableFundsAtMaturity with in  the same day", async function () {
//             const depositAmountEth = "1";
//             const depositPrincipal = ethers.parseEther(depositAmountEth);
//             // console.log({depositPrincipal});
//             const maturity = 90;
//             const bondFee = 5;

//             await stEth.mint(await signer1.getAddress(), depositPrincipal);

//             await stEth.connect(signer1).approve(enderBondAddress, depositPrincipal);

//             //   const currentTime = await ethers.provider.getBlock("latest");
//             //   console.log(currentTime.timestamp, "currentTime");

//             await ethers.provider.send("evm_setNextBlockTimestamp", [1698233706 + 3600]);
//             await enderBond
//                 .connect(signer1)
//                 .deposit(depositPrincipal, maturity, bondFee, stEthAddress);
//             filter = enderBond.filters.Deposit;
//             const events = await enderBond.queryFilter(filter, -1);

//             const event1 = events[0];

//             const args1 = event1.args;
//             const bigIntValue = 3000000000000004000n;
//             const stringValue = bigIntValue.toString();

//             expect(await enderBond.availableFundsAtMaturity(19745)).to.be.equal(stringValue);

//             expect(await enderBond.totalDeposit()).to.be.equal(stringValue);
//         });
//         it("checkin the availableFundsAtMaturity with in the different day  ", async function () {
//             const depositAmountEth = "1";
//             const depositPrincipal = ethers.parseEther(depositAmountEth);
//             // console.log({depositPrincipal});
//             const maturity = 90;
//             const bondFee = 5;

//             await stEth.mint(await signer1.getAddress(), depositPrincipal);

//             await stEth.connect(signer1).approve(enderBondAddress, depositPrincipal);

//             //   const currentTime = await ethers.provider.getBlock("latest");
//             //   console.log(currentTime.timestamp, "currentTime");

//             await ethers.provider.send("evm_setNextBlockTimestamp", [1698233706 + 24 * 3600]);
//             await enderBond
//                 .connect(signer1)
//                 .deposit(depositPrincipal, maturity, bondFee, stEthAddress);
//             filter = enderBond.filters.Deposit;
//             const events = await enderBond.queryFilter(filter, -1);

//             const event1 = events[0];

//             const args1 = event1.args;
//             const bigIntValue = 1000000000000000000n;
//             const stringValue = bigIntValue.toString();

//             const bigIntValueTotalDeposit = 4000000000000004000n;
//             const stringValueTotalDeposit = bigIntValueTotalDeposit.toString();

//             expect(await enderBond.availableFundsAtMaturity(19746)).to.be.equal(stringValue);
//             expect(await enderBond.userDeposit(args1.tokenId)).to.be.equal(stringValue);

//             expect(await enderBond.totalDeposit()).to.be.equal(stringValueTotalDeposit);
//         });
//         it("checkin the rewardSharePerUserIndex   ", async function () {
//             const depositAmountEnd = "5";
//             const depositPrincipalEnd = ethers.parseEther(depositAmountEnd);
//             const amountEndTransfer = "1";
//             const endTransfer = ethers.parseEther(amountEndTransfer);

//             await endToken.grantRole(MINTER_ROLE, owner.address);
//             await endToken.setFee(20);
//             await endToken.connect(owner).mint(signer1.address, depositPrincipalEnd);
//             await endToken.connect(signer1).transfer(signer2.address, endTransfer);

//             await endToken.connect(signer1).transfer(signer2.address, endTransfer);
//             console.log(await endToken.allowance(endTokenAddress, enderBondAddress));
//             await endToken.distributeRefractionFees();

//             const depositAmountEth = "1";
//             const depositPrincipal = ethers.parseEther(depositAmountEth);
//             const maturity = 90;
//             const bondFee = 5;

//             await stEth.mint(await signer1.getAddress(), depositPrincipal);

//             await stEth.connect(signer1).approve(enderBondAddress, depositPrincipal);
//             await enderBond
//                 .connect(signer1)
//                 .deposit(depositPrincipal, maturity, bondFee, stEthAddress);
//         });

//         it("Should deposit and withdraw assets into the strategies", async function () {
//             const depositAmountEnd = "5";
//             const depositPrincipalEnd = ethers.parseEther(depositAmountEnd);
//             const amountEndTransfer = "1";
//             const endTransfer = ethers.parseEther(amountEndTransfer);

//             await endToken.grantRole(MINTER_ROLE, owner.address);
//             await endToken.setFee(20);
//             await endToken.connect(owner).mint(signer1.address, depositPrincipalEnd);
//             await endToken.connect(signer1).transfer(signer2.address, endTransfer);

//             await endToken.connect(signer1).transfer(signer2.address, endTransfer);
//             console.log(await endToken.allowance(endTokenAddress, enderBondAddress));
//             await endToken.distributeRefractionFees();

//             const depositAmountEth = "1";
//             const depositPrincipal = ethers.parseEther(depositAmountEth);
//             const maturity = 90;
//             const bondFee = 5;

//             await stEth.mint(await signer1.getAddress(), depositPrincipal);

//             await stEth.connect(signer1).approve(enderBondAddress, depositPrincipal);
//             await enderBond
//                 .connect(signer1)
//                 .deposit(depositPrincipal, maturity, bondFee, stEthAddress);

//             let initialStEthBalTreasury = await stEth.balanceOf(enderTreasuryAddress);
//             console.log(await stEth.balanceOf(enderTreasuryAddress));

//             await enderTreasury
//                 .connect(signer1)
//                 .depositInStrategy(stEthAddress, instadappLiteAddress, 1000);
//             expect(Number(await stEth.balanceOf(enderTreasuryAddress))).to.be.equal(
//                 Number(initialStEthBalTreasury) - 1000,
//             );
//             expect(Number(await stEth.balanceOf(instadappLiteAddress))).to.be.equal(1000);

//             await ethers.provider.send("evm_increaseTime", [365 * 24 * 60 * 60]);
//             await ethers.provider.send("evm_mine");

//             await enderTreasury
//                 .connect(signer1)
//                 .withdrawFromStrategy(stEthAddress, instadappLiteAddress, 1000);

//             console.log(await stEth.balanceOf(enderTreasuryAddress));
//             expect(await stEth.balanceOf(enderTreasuryAddress)).to.be.greaterThan(
//                 initialStEthBalTreasury,
//             );
//             expect(Number(await stEth.balanceOf(instadappLiteAddress))).to.be.equal(0);

//             expect(await enderTreasury.totalRewardsFromStrategy(stEthAddress)).to.be.equal(
//                 (1000 * 4) / 100,
//             );

//             console.log(
//                 "=====================",
//                 await enderTreasury.totalRewardsFromStrategy(stEthAddress),
//             );
//         });
//         it("Should not allow deposit inot the strategy before 1 day of last deposit", async function () {
//             const depositAmountEnd = "5";
//             const depositPrincipalEnd = ethers.parseEther(depositAmountEnd);
//             const amountEndTransfer = "1";
//             const endTransfer = ethers.parseEther(amountEndTransfer);

//             await endToken.grantRole(MINTER_ROLE, owner.address);
//             await endToken.setFee(20);
//             await endToken.connect(owner).mint(signer1.address, depositPrincipalEnd);
//             await endToken.connect(signer1).transfer(signer2.address, endTransfer);

//             await endToken.connect(signer1).transfer(signer2.address, endTransfer);
//             console.log(await endToken.allowance(endTokenAddress, enderBondAddress));
//             await endToken.distributeRefractionFees();

//             const depositAmountEth = "1";
//             const depositPrincipal = ethers.parseEther(depositAmountEth);
//             const maturity = 90;
//             const bondFee = 5;

//             await stEth.mint(await signer1.getAddress(), depositPrincipal);

//             await stEth.connect(signer1).approve(enderBondAddress, depositPrincipal);
//             await enderBond
//                 .connect(signer1)
//                 .deposit(depositPrincipal, maturity, bondFee, stEthAddress);

//             let initialStEthBalTreasury = await stEth.balanceOf(enderTreasuryAddress);
//             console.log(await stEth.balanceOf(enderTreasuryAddress));

//             await enderTreasury
//                 .connect(signer1)
//                 .depositInStrategy(stEthAddress, instadappLiteAddress, 1000);
//             expect(Number(await stEth.balanceOf(enderTreasuryAddress))).to.be.equal(
//                 Number(initialStEthBalTreasury) - 1000,
//             );
//             expect(Number(await stEth.balanceOf(instadappLiteAddress))).to.be.equal(1000);

//             console.log("==================================");
//             await expect(
//                 enderTreasury
//                     .connect(signer1)
//                     .depositInStrategy(stEthAddress, instadappLiteAddress, 1000),
//             ).to.be.revertedWithCustomError(enderTreasury, "CanNotDepositToStrategyBeforeOneDay()");
//         });
//         it("Should only allow another deposit after 1 day of previous one", async function () {
//             const depositAmountEnd = "5";
//             const depositPrincipalEnd = ethers.parseEther(depositAmountEnd);
//             const amountEndTransfer = "1";
//             const endTransfer = ethers.parseEther(amountEndTransfer);

//             await endToken.grantRole(MINTER_ROLE, owner.address);
//             await endToken.setFee(20);
//             await endToken.connect(owner).mint(signer1.address, depositPrincipalEnd);
//             await endToken.connect(signer1).transfer(signer2.address, endTransfer);

//             await endToken.connect(signer1).transfer(signer2.address, endTransfer);
//             console.log(await endToken.allowance(endTokenAddress, enderBondAddress));
//             await endToken.distributeRefractionFees();

//             const depositAmountEth = "1";
//             const depositPrincipal = ethers.parseEther(depositAmountEth);
//             const maturity = 90;
//             const bondFee = 5;

//             await stEth.mint(await signer1.getAddress(), depositPrincipal);

//             await stEth.connect(signer1).approve(enderBondAddress, depositPrincipal);
//             await enderBond
//                 .connect(signer1)
//                 .deposit(depositPrincipal, maturity, bondFee, stEthAddress);

//             let initialStEthBalTreasury = await stEth.balanceOf(enderTreasuryAddress);
//             console.log(await stEth.balanceOf(enderTreasuryAddress));

//             await enderTreasury
//                 .connect(signer1)
//                 .depositInStrategy(stEthAddress, instadappLiteAddress, 1000);
//             expect(Number(await stEth.balanceOf(enderTreasuryAddress))).to.be.equal(
//                 Number(initialStEthBalTreasury) - 1000,
//             );
//             expect(Number(await stEth.balanceOf(instadappLiteAddress))).to.be.equal(1000);

//             console.log("==================================");
//             await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]);
//             await ethers.provider.send("evm_mine");
//             await enderTreasury
//                 .connect(signer1)
//                 .depositInStrategy(stEthAddress, instadappLiteAddress, 1000);
//         });
//         it("Should set treasury setter functoins", async function () {
//             await enderTreasury.setAddress(signer1.getAddress(),1);
//             await enderTreasury.setAddress(signer1.getAddress(),2);
//             await enderTreasury.setAddress(signer1.getAddress(),3);
//             await enderTreasury.setAddress(signer1.getAddress(),4);
//             await enderTreasury.setStrategy([signer1.getAddress()],true);
//             await enderTreasury.setNominalYield(5);
//         });
//     });
// });
