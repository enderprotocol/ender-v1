// const { expect } = require("chai");
// const { ethers, upgrades } = require("hardhat");
// const signature = "0xA2fFDf332d92715e88a958A705948ADF75d07d01";

// describe("EnderStakingFlow", function () {
//   let owner, wallet1;
//   let endTokenAddress, enderStakingAddress;
//   let endToken, enderBond, enderStaking;

//   before(async function () {
//     [owner, wallet1] = await ethers.getSigners();

//     // Deploy EndToken
//     const EndToken = await ethers.getContractFactory("EndToken");
//     endToken = await upgrades.deployProxy(EndToken, [1], {
//       initializer: "initialize",
//     });
//     await endToken.waitForDeployment();
//     const minterRole = await endToken.MINTER_ROLE()

//     // grant minter role to treasury contract
//     await endToken.grantRole(minterRole, owner.address);
  
//     // Deploy EnderBond
//     const EnderBond = await ethers.getContractFactory("EnderBond");
//     enderBond = await upgrades.deployProxy(EnderBond, [endTokenAddress, signature], {
//       initializer: "initialize",
//     });
//     await enderBond.waitForDeployment();

//     // Deploy EnderStaking
//     const EnderStaking = await ethers.getContractFactory("EnderStaking");
//     enderStaking = await upgrades.deployProxy(EnderStaking, [endTokenAddress], {
//       initializer: "initialize",
//     });
//     await enderStaking.waitForDeployment();
//     enderStakingAddress = await enderStaking.getAddress();
//   });

//   describe("addReward", function () {
//     it("Mint some tokens to users", async function () {
//       await endToken.connect(owner).setTreasury(owner.address);
//       const mintAmount = ethers.parseUnits("100000", 9);

//       // mint to wallet1
//       await endToken.connect(owner).mint(owner.address, mintAmount);
//       await endToken.connect(owner).mint(wallet1.address, mintAmount);
//     });

//     it("Should revert when called by non-end token contract", async function () {
//       await enderStaking.connect(owner).setAddress(endTokenAddress, 0);

//       // send token first
//       const amount = ethers.parseUnits("1000", 9);
//       await endToken.connect(wallet1).transfer(enderStakingAddress, amount)

//       await expect(enderStaking.connect(wallet1).addReward(amount)).to.be.revertedWithCustomError(enderStaking, "NotAuthorized");
//     });
//   });

//   describe("check stake and pendingReward", function () {
//     it("Should stake successfully", async function () {
//       const stakeAmt = ethers.parseUnits('50', 9)

//       await endToken.connect(wallet1).approve(enderStakingAddress, stakeAmt);
//       await enderStaking.connect(wallet1).stake(stakeAmt);

//       // check userinfo
//       const userInfo = await enderStaking.userInfo(wallet1.address);
//       expect(userInfo.amount).to.equal(stakeAmt);
//     });

//   });

//   describe("harvest", function () {
//     it("Should harvest successfully", async function () {
//       const stakeAmt = ethers.parseUnits('50', 9)

//       const pendingAmt = await enderStaking.pendingReward(wallet1.address);
//       const beforeBal = await endToken.balanceOf(wallet1.address);

//       await enderStaking.connect(wallet1).harvest();

//       // check userinfo
//       const userInfo = await enderStaking.userInfo(wallet1.address);
//       expect(userInfo.amount).to.equal(stakeAmt);
//       expect(userInfo.pending).to.equal(0);

//       // check token balance
//       const tokenBal = await endToken.balanceOf(wallet1.address);
//       expect(ethers.toBigInt(tokenBal) - ethers.toBigInt(beforeBal)).to.be.eq(ethers.toBigInt(pendingAmt))
//     });
//   });

//   describe("withdraw", function () {
//     it("Check parameter", async function () {
//       await expect(enderStaking.connect(wallet1).withdraw(0)).to.be.revertedWithCustomError(enderStaking, "InvalidAmount");
//     });

//     it("Should withdraw successfully", async function () {
//       const stakeAmt = ethers.parseUnits('50', 9)

//       await enderStaking.connect(wallet1).withdraw(stakeAmt);
//       const userInfo = await enderStaking.userInfo(wallet1.address);
//       expect(userInfo.amount).to.equal(0);
//     });
//   });
// });
