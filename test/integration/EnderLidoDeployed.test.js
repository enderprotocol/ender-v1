// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("Ender Lido Deployed test", function () {
//   before("Deploy contract", async function () {
//     [this.alice, this.bob] = await ethers.getSigners();

//     this.oneWeek = 7;

//     this.enderBond = await ethers.getContractAt("EnderBond", "0xD48c23172e05291E07f689F5a204Cc8E41AF9008")
//     this.enderTreasury = await ethers.getContractAt("EnderTreasury", "0x3215d2906d273d33284f3ee798A83F98a3a7eBD8")

//     // this.lidoStrategy = "0x9bA548216c8a86cEE0d28E619387A51A112EA018"
//   })

//   it("Check deposit", async function () {
//     const depositAmt = ethers.parseEther("1")
//     await this.enderBond.connect(this.alice).deposit(depositAmt, this.oneWeek, 0, ethers.ZeroAddress, {
//       value: depositAmt
//     })
//   })
// })

