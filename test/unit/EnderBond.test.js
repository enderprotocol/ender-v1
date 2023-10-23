// const { expect } = require("chai");
// const { ethers, upgrades } = require("hardhat");

// const { EigenLayerStrategyManagerAddress } = require("../utils/common");
// const signature = "0xA2fFDf332d92715e88a958A705948ADF75d07d01";

// describe("EnderBond", function () {
//   let owner, wallet1, signer1, signer2, signer3;
//   let endTokenAddress,
//     enderBondAddress,
//     enderTreasuryAddress,
//     enderELStrategyAddress;
//   let endToken, enderBond, enderTreasury, enderELStrategy;

//   before(async function () {
//     // Deploy EndToken
//     const EndToken = await ethers.getContractFactory("EndToken");
//     endToken = await upgrades.deployProxy(EndToken, [1], {
//       initializer: "initialize",
//     });
//     await endToken.waitForDeployment();
//     endTokenAddress = await endToken.getAddress();

//     // Deploy EnderBond
//     const EnderBond = await ethers.getContractFactory("EnderBond");
//     enderBond = await upgrades.deployProxy(
//       EnderBond,
//       [endTokenAddress, signature],
//       {
//         initializer: "initialize",
//       }
//     );
//     await enderBond.waitForDeployment();
//     enderBondAddress = await enderBond.getAddress();

//     // Deploy EnderTreasury
//     // const EnderTreasury = await ethers.getContractFactory("EnderTreasury");
//     // enderTreasury = await upgrades.deployProxy(
//     //   EnderTreasury,
//     //   [endTokenAddress, enderBondAddress],
//     //   {
//     //     initializer: "initialize",
//     //   }
//     // );
//     // await enderTreasury.waitForDeployment();
//     // enderTreasuryAddress = await enderTreasury.getAddress();

//     // // Deploy EnderELStrategy
//     // const EnderELStrategy = await ethers.getContractFactory("EnderELStrategy");
//     // enderELStrategy = await upgrades.deployProxy(
//     //   EnderELStrategy,
//     //   [enderTreasuryAddress, EigenLayerStrategyManagerAddress],
//     //   {
//     //     initializer: "initialize",
//     //   }
//     // );
//     // await enderELStrategy.waitForDeployment();
//     // enderELStrategyAddress = await enderELStrategy.getAddress();

//     // // add strategy in treasury
//     // await enderTreasury.setStrategy([enderELStrategyAddress], true);

//     [owner, wallet1, signer1, signer2, signer3] = await ethers.getSigners();
//   });

//   describe("initialize", function () {
//     it("Should set the right owner", async function () {
//       expect(await enderBond.owner()).to.equal(owner.address);
//     });
//   });

//   describe("setTreasury", function () {
//     it("Should not allow non-owner to set treasury", async function () {
//       await expect(
//         enderBond.connect(wallet1).setAddress(enderTreasuryAddress, 0)
//       ).to.be.revertedWith("Ownable: caller is not the owner");
//     });

//     it("Should not allow setting zero address as treasury", async function () {
//       await expect(
//         enderBond.connect(owner).setAddress(ethers.ZeroAddress, 0)
//       ).to.be.revertedWithCustomError(enderBond, "ZeroAddress()");
//     });
//   });

//   describe("Check set END token", function () {
//     it("Should not allow non-owner to set end token", async function () {
//       await expect(
//         enderBond.connect(wallet1).setAddress(endTokenAddress, 1)
//       ).to.be.revertedWith("Ownable: caller is not the owner");
//     });

//     it("Should not allow setting zero address as end token", async function () {
//       await expect(
//         enderBond.connect(owner).setAddress(ethers.ZeroAddress, 1)
//       ).to.be.revertedWithCustomError(enderBond, "ZeroAddress()");
//     });
//   });

//   describe("setBondableTokens", function () {
//     it("Should allow owner to set bondable tokens", async function () {
//       await enderBond.connect(owner).setBondableTokens([endTokenAddress], true);
//       expect(await enderBond.bondableTokens(endTokenAddress)).to.equal(true);
//     });

//     it("Should not allow non-owner to set bondable tokens", async function () {
//       await expect(
//         enderBond.connect(wallet1).setBondableTokens([endTokenAddress], true)
//       ).to.be.revertedWith("Ownable: caller is not the owner");
//     });

//     it("Should allow owner to unset bondable tokens", async function () {
//       await enderBond.connect(owner).setBondableTokens([endTokenAddress], true);
//       await enderBond
//         .connect(owner)
//         .setBondableTokens([endTokenAddress], false);
//       expect(await enderBond.bondableTokens(endTokenAddress)).to.equal(false);
//     });
//   });

//   describe("EnderBond", function () {
//     it.only("Should allow a user to deposit with valid parameters", async function () {
//       const depositPrincipal = 1000;
//       const maturity = 90;
//       const bondFee = 5;

//       const tokenId = 1;

//       await endToken.mint(signer1.getAddress,)
//       await enderBond.connect(owner).setBondableTokens([endTokenAddress], true);

//       await enderBond.deposit(
//         depositPrincipal,
//         maturity,
//         bondFee,
//         endTokenAddress
//       );

//       // Assert
//       // Check if the deposit was successful
//       // Check userDeposit mapping for the deposited amount
//       // Check if the Bond NFT was minted and owned by the user
//       // Check if other contract state variables are updated correctly
//     });
//   });
// });
