// const { expect } = require("chai");
// const { ethers, upgrades } = require("hardhat");

// const { WithdrawalStrategyAddress, LidoAgentAddress } = require("../../utils/common")
// const signature = "0xA2fFDf332d92715e88a958A705948ADF75d07d01";

// describe("EnderLidoStrategy", function () {
//   let owner, wallet1;
//   let endTokenAddress, enderBondAddress, enderTreasuryAddress;
//   let endToken, enderBond, enderTreasury, enderLidoStrategy;

//   before(async function () {
//     // Deploy EndToken
//     const EndToken = await ethers.getContractFactory("EndToken");
//     endToken = await upgrades.deployProxy(EndToken, [100], {
//       initializer: "initialize",
//     });
//     await endToken.waitForDeployment();
//     endTokenAddress = await endToken.getAddress();

//     // Deploy EnderBond
//     const EnderBond = await ethers.getContractFactory("EnderBond");
//     enderBond = await upgrades.deployProxy(EnderBond, [endTokenAddress, signature], {
//       initializer: "initialize",
//     });
//     await enderBond.waitForDeployment();
//     enderBondAddress = await enderBond.getAddress();

//     // Deploy EnderTreasury
//     const EnderTreasury = await ethers.getContractFactory("EnderTreasury");
//     enderTreasury = await upgrades.deployProxy(EnderTreasury, [endTokenAddress, enderBondAddress], {
//       initializer: "initialize",
//     });
//     await enderTreasury.waitForDeployment();
//     enderTreasuryAddress = await enderTreasury.getAddress();

//     // Deploy EnderLidoStrategy
//     const EnderLidoStrategy = await ethers.getContractFactory("EnderLidoStrategy");
//     enderLidoStrategy = await upgrades.deployProxy(EnderLidoStrategy, [enderTreasuryAddress, LidoAgentAddress], {
//       initializer: "initialize",
//     });
//     await enderLidoStrategy.waitForDeployment();

//     [owner, wallet1] = await ethers.getSigners();
//   });

//   describe("initialize", function () {
//     it("Should set the right owner", async function () {
//       expect(await enderLidoStrategy.owner()).to.equal(owner.address);
//     });

//     it("Should set the correct treasury contract address", async function () {
//       await enderLidoStrategy.connect(owner).setAddress(enderTreasuryAddress, 0);
//       expect(await enderLidoStrategy.treasury()).to.equal(enderTreasuryAddress);
//     });

//     it("Should set the correct strategy contract address", async function () {
//       await enderLidoStrategy.connect(owner).setAddress(LidoAgentAddress, 1);
//       expect(await enderLidoStrategy.strategy()).to.equal(LidoAgentAddress);
//     });
//   });

//   describe("setTreasury", function () {
//     it("Should allow owner to set the treasury contract address", async function () {
//       await enderLidoStrategy.connect(owner).setAddress(enderTreasuryAddress, 0);
//       expect(await enderLidoStrategy.treasury()).to.equal(enderTreasuryAddress);
//     });

//     it("Should not allow non-owner to set the treasury contract address", async function () {
//       await expect(enderLidoStrategy.connect(wallet1).setAddress(enderTreasuryAddress, 0))
//         .to.be.revertedWith("Ownable: caller is not the owner");
//     });

//     it("Should revert if the treasury address is the zero address", async function () {
//       await expect(enderLidoStrategy.connect(owner).setAddress(ethers.ZeroAddress, 0)).to.be.revertedWithCustomError(enderLidoStrategy, "ZeroAddress");
//     });

//     it("Should emit a TreasuryUpdated event", async function () {
//       await expect(enderLidoStrategy.setAddress(enderTreasuryAddress, 0))
//         .to.emit(enderLidoStrategy, 'AddressUpdated')
//         .withArgs(enderTreasuryAddress, 0);
//     });
//   });

//   describe("setStrategy", function () {
//     it("Should allow owner to set the strategy contract address", async function () {
//       await expect(enderLidoStrategy.connect(owner).setAddress(LidoAgentAddress, 1)).to.emit(enderLidoStrategy, 'AddressUpdated').withArgs(LidoAgentAddress, 1);
//       expect(await enderLidoStrategy.strategy()).to.equal(LidoAgentAddress);
//     });

//     it("Should not allow non-owner to set the strategy contract address", async function () {
//       await expect(enderLidoStrategy.connect(wallet1).setAddress(LidoAgentAddress, 0))
//         .to.be.revertedWith("Ownable: caller is not the owner");
//     });

//     it("Should revert if the strategy address is the zero address", async function () {
//       await expect(enderLidoStrategy.connect(owner).setAddress(ethers.ZeroAddress, 0)).to.be.revertedWithCustomError(enderLidoStrategy, "ZeroAddress");
//     });

//     it("Should emit a AddressUpdated event", async function () {
//       await expect(enderLidoStrategy.setAddress(LidoAgentAddress, 1))
//         .to.emit(enderLidoStrategy, 'AddressUpdated')
//         .withArgs(LidoAgentAddress, 1);
//     });
//   });

//   describe("setWithdrawStr", function () {
//     it("Should allow owner to set the withdrawal strategy address", async function () {
//       await enderLidoStrategy.connect(owner).setWithdrawStr(WithdrawalStrategyAddress);
//       expect(await enderLidoStrategy.withdrawStrategy()).to.equal(WithdrawalStrategyAddress);
//     });

//     it("Should not allow non-owner to set the token strategy address", async function () {
//       await expect(enderLidoStrategy.connect(wallet1).setWithdrawStr(WithdrawalStrategyAddress))
//         .to.be.revertedWith("Ownable: caller is not the owner");
//     });

//     it("Should revert if the token strategy address is the zero address", async function () {
//       await expect(enderLidoStrategy.connect(owner).setWithdrawStr(ethers.ZeroAddress)).to.be.revertedWithCustomError(enderLidoStrategy, 'ZeroAddress');
//     });
//   });
// });
