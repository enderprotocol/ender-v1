const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("EnderStaking", function () {
  let owner, wallet1;
  let endTokenAddress;
  let endToken, enderStaking;

  before(async function () {
    // Deploy EndToken
    const EndToken = await ethers.getContractFactory("EndToken");
    endToken = await upgrades.deployProxy(EndToken, [1], {
      initializer: "initialize",
    });
    await endToken.waitForDeployment();
    endTokenAddress = await endToken.getAddress();

    // Deploy EnderStaking
    const EnderStaking = await ethers.getContractFactory("EnderStaking");
    enderStaking = await upgrades.deployProxy(EnderStaking, [endTokenAddress], {
      initializer: "initialize",
    });
    await enderStaking.waitForDeployment();

    [owner, wallet1] = await ethers.getSigners();
  });

  describe("initialize", function () {
    it("Should set the right owner", async function () {
      expect(await enderStaking.owner()).to.equal(owner.address);
    });
  });

  describe("Check set END token", function () {
    it("Should not allow non-owner to set the end token address", async function () {
      await expect(enderStaking.connect(wallet1).setAddress(endTokenAddress))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should revert if the end token address is the zero address", async function () {
      await expect(enderStaking.connect(owner).setAddress(ethers.ZeroAddress))
        .to.be.revertedWithCustomError(enderStaking, "ZeroAddress");
    });

    it("Should emit a SetEnd event", async function () {
      await expect(enderStaking.setAddress(endTokenAddress))
        .to.emit(enderStaking, 'AddressUpdated')
        .withArgs(endTokenAddress);
    });
  });
});
