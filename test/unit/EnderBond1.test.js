const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

const { EigenLayerStrategyManagerAddress } = require("../utils/common");
const signature = "0xA2fFDf332d92715e88a958A705948ADF75d07d01";

describe("EnderBond", function () {
  let owner, wallet1, signer1, signer2, signer3;
  let endTokenAddress,
    enderBondAddress,
    enderTreasuryAddress,
    enderStakingAddress,
    lidoStakingAddress;

  let endToken,
    enderBond,
    enderTreasury,
    enderELStrategy,
    enderStaking,
    sEnd,
    sEndTokenAddress,
    lidoStaking,
    stEth;

  before(async function () {
    const StEth = await ethers.getContractFactory("StEth");
    const LidoStaking = await ethers.getContractFactory("lidoStaking");
    const EndToken = await ethers.getContractFactory("EndToken");
    const EnderBond = await ethers.getContractFactory("EnderBond");
    const EnderTreasury = await ethers.getContractFactory("EnderTreasury");
    const EnderStaking = await ethers.getContractFactory("EnderStaking");
    const SEnd = await ethers.getContractFactory("SEndToken");

    stEth = await StEth.deploy();
    stEthAddress = await stEth.getAddress();

    sEnd = await SEnd.deploy();
    sEndTokenAddress = await sEnd.getAddress();

    lidoStaking = await LidoStaking.deploy(stEthAddress);
    lidoStakingAddress = await lidoStaking.getAddress();
    console.log("first");

    endToken = await upgrades.deployProxy(EndToken, [], {
      initializer: "initialize",
    });
    await endToken.waitForDeployment();
    endTokenAddress = await endToken.getAddress();

    enderBond = await upgrades.deployProxy(
      EnderBond,
      [endTokenAddress, lidoStakingAddress],
      {
        initializer: "initialize",
      }
    );
    await enderBond.waitForDeployment();
    enderBondAddress = await enderBond.getAddress();

    await endToken.setBond(enderBondAddress);
    await endToken.setFee(1);

    enderStaking = await upgrades.deployProxy(
      EnderStaking,
      [endTokenAddress, sEndTokenAddress],
      {
        initializer: "initialize",
      }
    );
    enderStakingAddress = await enderStaking.getAddress();
    console.log(
      endTokenAddress,
      enderStakingAddress,
      enderBondAddress,
      lidoStakingAddress,
      ethers.ZeroAddress,
      ethers.ZeroAddress
    );
    enderTreasury = await upgrades.deployProxy(
      EnderTreasury,
      [
        endTokenAddress,
        enderStakingAddress,
        enderBondAddress,
        lidoStakingAddress,
        ethers.ZeroAddress,
        ethers.ZeroAddress,
        30,
        70
      ],
      {
        initializer: "initialize",
      }
    );

    enderTreasuryAddress = await enderTreasury.getAddress();

    await enderStaking.setAddress(enderBondAddress, 1);
    await enderStaking.setAddress(enderTreasuryAddress, 2);

    await enderBond.setBondableTokens([stEthAddress], true);
    await enderBond.setAddress(enderTreasuryAddress);
    [owner, wallet1, signer1, signer2, signer3] = await ethers.getSigners();
  });

  describe("initialize", function () {
    it.only("Should set the right owner", async function () {
      expect(await enderBond.owner()).to.equal(owner.address);
    });
  });
  describe("EnderBond StEth", function () {
    it.only("Should allow a user to deposit with valid parameters", async function () {
      // const depositPrincipal = 1000;
      // const maturity = 90;
      // const bondFee = 5;

      // const tokenId = 1;

      await stEth.mint(signer1.getAddress);
      await enderBond.connect(owner).setBondableTokens([endTokenAddress], true);

      await enderBond.deposit(
        depositPrincipal,
        maturity,
        bondFee,
        endTokenAddress
      );
    });
  });

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
});
