const { ethers, upgrades } = require("hardhat");
const { expect } = require("chai");

let EndToken, SEnd, StEth, EnderNFTBond, EnderBond, EnderTreasury;

describe("Ender Bond", function () {
  let owner, signer1, signer2, signer3, signer4;
  let endToken, sEnd, stEth, enderNFTBond, enderBond, enderTreasury;

  before(async function () {
    [owner, signer1, signer2, signer3, signer4] = await ethers.getSigners();

    EndToken = await ethers.getContractFactory("EndToken");
    SEnd = await ethers.getContractFactory("SEnd");
    StEth = await ethers.getContractFactory("StEth");
    EnderNFTBond = await ethers.getContractFactory("EnderNFTBond");
    EnderBond = await ethers.getContractFactory("EnderBond");
    EnderTreasury = await ethers.getContractFactory("EnderTreasury");

    endToken = await EndToken.deploy();
    sEnd = await SEnd.deploy(endToken.address);
    stEth = await StEth.deploy();
    enderNFTBond = await EnderNFTBond.deploy();
    enderBond = await EnderBond.deploy();
    enderTreasury = await EnderTreasury.deploy();
  });

  describe("Staking", function () {
    it("should fail to stake if the amount is zero", async function () {
      await expect(
        enderBond.connect(signer1).depositStEth(0, [])
      ).to.be.revertedWith("Invalid amount");
    });
  });
});
