// const { expect } = require("chai");
// const { ethers, upgrades } = require("hardhat");

// const { EigenLayerStrategyManagerAddress, TokenStrategyAddress } = require("../../utils/common")
// const signature = "0xA2fFDf332d92715e88a958A705948ADF75d07d01";

// describe("EnderELStrategy", function () {
//   let owner, wallet1;
//   let endTokenAddress, enderBondAddress, enderTreasuryAddress;
//   let endToken, enderBond, enderTreasury, enderELStrategy;

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
//     enderTreasury = await upgrades.deployProxy(EnderTreasury, [enderBondAddress, enderBondAddress], {
//       initializer: "initialize",
//     });
//     await enderTreasury.waitForDeployment();
//     enderTreasuryAddress = await enderTreasury.getAddress();

//     // Deploy EnderELStrategy
//     const EnderELStrategy = await ethers.getContractFactory("EnderELStrategy");
//     enderELStrategy = await upgrades.deployProxy(EnderELStrategy, [enderTreasuryAddress, EigenLayerStrategyManagerAddress], {
//       initializer: "initialize",
//     });
//     await enderELStrategy.waitForDeployment();

//     [owner, wallet1] = await ethers.getSigners();
//   });

//   describe("initialize", function () {
//     it("Should set the right owner", async function () {
//       expect(await enderELStrategy.owner()).to.equal(owner.address);
//     });

//     it("Should set the correct treasury contract address", async function () {
//       await enderELStrategy.connect(owner).setAddress(enderTreasuryAddress, 0);
//       expect(await enderELStrategy.treasury()).to.equal(enderTreasuryAddress);
//     });

//     it("Should set the correct strategy contract address", async function () {
//       await enderELStrategy.connect(owner).setAddress(EigenLayerStrategyManagerAddress, 1);
//       expect(await enderELStrategy.strategy()).to.equal(EigenLayerStrategyManagerAddress);
//     });
//   });

//   describe("setTreasury", function () {
//     it("Should allow owner to set the treasury contract address", async function () {
//       await expect(enderELStrategy.connect(owner).setAddress(enderTreasuryAddress, 0)).to.emit(enderELStrategy, 'AddressUpdated').withArgs(enderTreasuryAddress, 0);
//       expect(await enderELStrategy.treasury()).to.equal(enderTreasuryAddress);
//     });

//     it("Should not allow non-owner to set the treasury contract address", async function () {
//       await expect(enderELStrategy.connect(wallet1).setAddress(enderTreasuryAddress, 0))
//         .to.be.revertedWith("Ownable: caller is not the owner");
//     });

//     it("Should revert if the treasury address is the zero address", async function () {
//       await expect(enderELStrategy.connect(owner).setAddress(ethers.ZeroAddress, 0)).to.be.revertedWithCustomError(enderELStrategy, 'ZeroAddress');
//     });

//     it("Should emit a TreasuryUpdated event", async function () {
//       await expect(enderELStrategy.setAddress(enderTreasuryAddress, 0))
//         .to.emit(enderELStrategy, 'AddressUpdated')
//         .withArgs(enderTreasuryAddress, 0);
//     });
//   });

//   describe("setStrategy", function () {
//     it("Should allow owner to set the strategy contract address", async function () {
//       await enderELStrategy.connect(owner).setAddress(EigenLayerStrategyManagerAddress, 1);
//       expect(await enderELStrategy.strategy()).to.equal(EigenLayerStrategyManagerAddress);
//     });

//     it("Should not allow non-owner to set the strategy contract address", async function () {
//       await expect(enderELStrategy.connect(wallet1).setAddress(EigenLayerStrategyManagerAddress, 1))
//         .to.be.revertedWith("Ownable: caller is not the owner");
//     });

//     it("Should revert if the strategy address is the zero address", async function () {
//       await expect(enderELStrategy.connect(owner).setAddress(ethers.ZeroAddress, 1)).to.be.revertedWithCustomError(enderELStrategy, 'ZeroAddress');
//     });

//     it("Should emit a AddressUpdated event", async function () {
//       await expect(enderELStrategy.setAddress(EigenLayerStrategyManagerAddress, 1))
//         .to.emit(enderELStrategy, 'AddressUpdated')
//         .withArgs(EigenLayerStrategyManagerAddress, 1);
//     });
//   });

//   describe("setTokenStrategy", function () {
//     it("Should allow owner to set the token strategy address", async function () {
//       await enderELStrategy.connect(owner).setTokenStrategy(TokenStrategyAddress);
//       expect(await enderELStrategy.tokenStrategy()).to.equal(TokenStrategyAddress);
//     });

//     it("Should not allow non-owner to set the token strategy address", async function () {
//       await expect(enderELStrategy.connect(wallet1).setTokenStrategy(TokenStrategyAddress))
//         .to.be.revertedWith("Ownable: caller is not the owner");
//     });

//     it("Should revert if the token strategy address is the zero address", async function () {
//       await expect(enderELStrategy.connect(owner).setTokenStrategy(ethers.ZeroAddress)).to.be.revertedWithCustomError(enderELStrategy, 'ZeroAddress');
//     });
//   });
// });
