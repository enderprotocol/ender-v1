const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

const { EigenLayerStrategyManagerAddress, LidoAgentAddress } = require("../utils/common")
const signature = "0xA2fFDf332d92715e88a958A705948ADF75d07d01";

describe("EnderTreasury", function () {
  let owner, wallet1;
  let endTokenAddress, enderBondAddress, enderTreasuryAddress, enderELStrategyAddress, enderLidoStrategyAddress;
  let endToken, enderBond, enderTreasury, enderELStrategy, enderLidoStrategy;

  before(async function () {
    // Deploy EndToken
    const EndToken = await ethers.getContractFactory("EndToken");
    endToken = await upgrades.deployProxy(EndToken, [1], {
      initializer: "initialize",
    });
    await endToken.waitForDeployment();
    endTokenAddress = await endToken.getAddress();

    // Deploy EnderBond
    const EnderBond = await ethers.getContractFactory("EnderBond");
    enderBond = await upgrades.deployProxy(EnderBond, [endTokenAddress, signature], {
      initializer: "initialize",
    });
    await enderBond.waitForDeployment();
    enderBondAddress = await enderBond.getAddress();

    // Deploy EnderTreasury
    const EnderTreasury = await ethers.getContractFactory("EnderTreasury");
    enderTreasury = await upgrades.deployProxy(EnderTreasury, [enderBondAddress, enderBondAddress], {
      initializer: "initialize",
    });
    await enderTreasury.waitForDeployment();
    enderTreasuryAddress = await enderTreasury.getAddress();

    // Deploy EnderELStrategy
    const EnderELStrategy = await ethers.getContractFactory("EnderELStrategy");
    enderELStrategy = await upgrades.deployProxy(EnderELStrategy, [enderTreasuryAddress, EigenLayerStrategyManagerAddress], {
      initializer: "initialize",
    });
    await enderELStrategy.waitForDeployment();
    enderELStrategyAddress = await enderELStrategy.getAddress();

    // Deploy EnderLidoStrategy
    const EnderLidoStrategy = await ethers.getContractFactory("EnderLidoStrategy");
    enderLidoStrategy = await upgrades.deployProxy(EnderLidoStrategy, [enderTreasuryAddress, LidoAgentAddress], {
      initializer: "initialize",
    });
    await enderLidoStrategy.waitForDeployment();
    enderLidoStrategyAddress = await enderLidoStrategy.getAddress();

    [owner, wallet1] = await ethers.getSigners();
  });

  describe("initialize", function () {
    it("Should set the right owner", async function () {
      expect(await enderTreasury.owner()).to.equal(owner.address);
    });
  });

  describe("setBond", function () {
    it("Should not allow non-owner to set the end token address", async function () {
      await expect(enderTreasury.connect(wallet1).setAddress(enderBondAddress, 0))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should revert if the bond contract address is the zero address", async function () {
      await expect(enderTreasury.connect(owner).setAddress(ethers.ZeroAddress, 0))
        .to.be.revertedWithCustomError(enderTreasury, "ZeroAddress");
    });

    it("Should emit a BondUpdated event", async function () {
      await expect(enderTreasury.setAddress(enderBondAddress, 0))
        .to.emit(enderTreasury, 'AddressUpdated')
        .withArgs(enderBondAddress, 0);
    });
  });

  describe("setStrategy", function () {
    it("Should set the strategy correctly when called by the owner", async function () {
      const strategies = [enderELStrategyAddress];
      await enderTreasury.connect(owner).setStrategy(strategies, true);

      expect(await enderTreasury.strategies(enderELStrategyAddress)).to.equal(true);
    });

    it("Should revert when called by non-owner", async function () {
      const strategies = [enderELStrategyAddress];
      await expect(enderTreasury.connect(wallet1).setStrategy(strategies, true))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should revert when strategies address array input is empty", async function () {
      await expect(enderTreasury.connect(owner).setStrategy([], true)).to.be.revertedWithCustomError(enderTreasury, 'InvalidStrategy');
    });

    it("Should set multiple strategies correctly", async function () {
      const strategies = [enderELStrategyAddress, enderLidoStrategyAddress];
      await enderTreasury.connect(owner).setStrategy(strategies, true);
      expect(await enderTreasury.strategies(enderELStrategyAddress)).to.equal(true);
      expect(await enderTreasury.strategies(enderLidoStrategyAddress)).to.equal(true);
    });
  });

  describe("receive", function () {
    it("Should accept ether", async function () {
      const initialBalance = await ethers.provider.getBalance(enderTreasuryAddress);
      await owner.sendTransaction({ to: enderTreasuryAddress, value: ethers.parseEther("1.0") });
      const finalBalance = await ethers.provider.getBalance(enderTreasuryAddress);
      expect(finalBalance).to.equal(initialBalance + ethers.parseEther("1.0"));
    });
  });
});
