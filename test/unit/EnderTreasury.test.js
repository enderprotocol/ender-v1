const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

// const { EigenLayerStrategyManagerAddress, LidoAgentAddress } = require("../utils/common")
const signature = "0xA2fFDf332d92715e88a958A705948ADF75d07d01";

describe("EnderTreasury", function () {

  const EigenLayerStrategyManagerAddress = "0x858646372CC42E1A627fcE94aa7A7033e7CF075A";
  const LidoAgentAddress = "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c";

  const lybraFinanceAddress = "0x04919f277cfFB234CE2660769404FbFcC3673d85";
  const eigenLayerAddress = "0x85df364E61C35aBd0384DBb33598b6cCd2d90588";

  let owner, wallet1;
  let endTokenAddress, enderStakingAddress, enderBondAddress,
    enderTreasuryAddress, enderELStrategyAddress, enderLidoStrategyAddress,
    instadappLiteAddress, stEthAddress, sEndTokenAddress;
  let endToken, enderStaking, enderBond, enderTreasury, enderELStrategy, enderLidoStrategy,
    instadappLitelidoStaking, stEth, sEnd;

  before(async function () {
    [owner, wallet1] = await ethers.getSigners();

    const StEth = await ethers.getContractFactory("StETH");
    const EnderStaking = await ethers.getContractFactory("EnderStaking");
    const SEnd = await ethers.getContractFactory("SEndToken");


    stEth = await StEth.deploy();
    stEthAddress = await stEth.getAddress();

    sEnd = await upgrades.deployProxy(SEnd, [], {
      initializer: "initialize",
    });
    sEndTokenAddress = await sEnd.connect(owner).getAddress();

    // Deploy EndToken
    const EndToken = await ethers.getContractFactory("EndToken");
    endToken = await upgrades.deployProxy(EndToken, [], {
      initializer: "initialize",
    });
    await endToken.waitForDeployment();
    endTokenAddress = await endToken.getAddress();

    const InstadappLite = await ethers.getContractFactory("StinstaToken");
    instadappLitelidoStaking = await InstadappLite.deploy("InstaToken", "Inst", owner.address, stEthAddress);
    instadappLiteAddress = await instadappLitelidoStaking.getAddress();

    enderStaking = await upgrades.deployProxy(
      EnderStaking,
      [endTokenAddress, sEndTokenAddress, stEthAddress, wallet1.address],
      {
        initializer: "initialize",
      }
    );

    enderStakingAddress = await enderStaking.getAddress();

    // Deploy EnderBond
    const EnderBond = await ethers.getContractFactory("EnderBond");
    enderBond = await upgrades.deployProxy(EnderBond, [endTokenAddress, ethers.ZeroAddress, wallet1.address], {
      initializer: "initialize",
    });
    await enderBond.waitForDeployment();
    enderBondAddress = await enderBond.getAddress();

    // Deploy EnderTreasury
    const EnderTreasury = await ethers.getContractFactory("EnderTreasury");
    // enderTreasury = await upgrades.deployProxy(EnderTreasury, [enderBondAddress, enderBondAddress], {
    //   initializer: "initialize",
    // });
    // await enderTreasury.waitForDeployment();
    // enderTreasuryAddress = await enderTreasury.getAddress();

    enderTreasury = await upgrades.deployProxy(
      EnderTreasury,
      [
        endTokenAddress,
        enderStakingAddress,
        enderBondAddress, // type 2
        instadappLiteAddress,
        lybraFinanceAddress,
        eigenLayerAddress,
        70,
        30,
      ],
      {
        initializer: "initializeTreasury",
      }
    );

    enderTreasuryAddress = await enderTreasury.getAddress();

    enderStaking.setAddress(enderBondAddress, 1);
    enderStaking.setAddress(enderTreasuryAddress, 2);
    enderBond.setAddress(enderTreasuryAddress, 1); // set treasury
    enderBond.setAddress(enderStakingAddress, 8); // set staking


    // Deploy EnderELStrategy
    const EnderELStrategy = await ethers.getContractFactory("EnderELStrategy");
    enderELStrategy = await upgrades.deployProxy(EnderELStrategy, [enderTreasuryAddress, EigenLayerStrategyManagerAddress], {
      initializer: "initialize",
    });
    await enderELStrategy.waitForDeployment();
    enderELStrategyAddress = await enderELStrategy.getAddress();

    // Deploy EnderLidoStrategy
    // const EnderLidoStrategy = await ethers.getContractFactory("EnderLidoStrategy");
    // enderLidoStrategy = await upgrades.deployProxy(EnderLidoStrategy, [enderTreasuryAddress, LidoAgentAddress], {
    //   initializer: "initialize",
    // });
    // await enderLidoStrategy.waitForDeployment();
    // enderLidoStrategyAddress = await enderLidoStrategy.getAddress();

    console.log("endTokenAddress: ", endTokenAddress);
    console.log("enderStakingAddress: ", enderStakingAddress);
    console.log("enderBondAddress: ", enderBondAddress);
    console.log("enderTreasuryAddress: ", enderTreasuryAddress);
    console.log("instadappLiteAddress: ", instadappLiteAddress);

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

      await expect(enderTreasury.getAddressByType(0))
        .to.be.revertedWithCustomError(enderTreasury, "ZeroAddress");
    });

    it("Should set nominal yield correctly", async function () {
      const oldNominalYield = await enderTreasury.nominalYield();
      const newNominalYield = 700;
      await enderTreasury.connect(owner).setNominalYield(newNominalYield);
      expect(await enderTreasury.nominalYield()).to.equal(newNominalYield);

      await enderTreasury.connect(owner).setNominalYield(oldNominalYield);

      await expect(enderTreasury.connect(wallet1).setNominalYield(oldNominalYield))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should set address correctly", async function () {
      const tmpAddress = "0x2bf3937b8BcccE4B65650F122Bb3f1976B937B2f";

      await enderTreasury.connect(owner).setAddress(tmpAddress, 1);
      expect(await enderTreasury.getAddressByType(1)).to.equal(tmpAddress);

      await enderTreasury.connect(owner).setAddress(endTokenAddress, 1);
      expect(await enderTreasury.getAddressByType(1)).to.equal(endTokenAddress);

      await enderTreasury.connect(owner).setAddress(tmpAddress, 2);
      expect(await enderTreasury.getAddressByType(2)).to.equal(tmpAddress);

      await enderTreasury.connect(owner).setAddress(enderBondAddress, 2);
      expect(await enderTreasury.getAddressByType(2)).to.equal(enderBondAddress);

      // 3,4,5,6 are not used yet
      await enderTreasury.connect(owner).setAddress(tmpAddress, 3);
      expect(await enderTreasury.getAddressByType(3)).to.equal(tmpAddress);

      await enderTreasury.connect(owner).setAddress(tmpAddress, 4);
      expect(await enderTreasury.getAddressByType(4)).to.equal(tmpAddress);

      await enderTreasury.connect(owner).setAddress(tmpAddress, 5);
      expect(await enderTreasury.getAddressByType(5)).to.equal(tmpAddress);

      await enderTreasury.connect(owner).setAddress(tmpAddress, 6);
      expect(await enderTreasury.getAddressByType(6)).to.equal(tmpAddress);

    });

    it("Should set bond yield base rate correctly", async function () {

      const oldBondYieldBaseRate = await enderTreasury.bondYieldBaseRate();

      await enderTreasury.connect(owner).setBondYieldBaseRate(BigInt(20));
      expect(await enderTreasury.bondYieldBaseRate()).to.equal(BigInt(20));

      await enderTreasury.connect(owner).setBondYieldBaseRate(oldBondYieldBaseRate);
      expect(await enderTreasury.bondYieldBaseRate()).to.equal(oldBondYieldBaseRate);

      await expect(enderTreasury.connect(wallet1).setBondYieldBaseRate(oldBondYieldBaseRate))
        .to.be.revertedWith("Ownable: caller is not the owner");

      await expect(enderTreasury.connect(owner).setBondYieldBaseRate(BigInt(0)))
        .to.be.revertedWithCustomError(enderTreasury, "InvalidBaseRate");
    });
  });

  describe("setStrategy", function () {
    it("Should set the strategy correctly when called by the owner", async function () {
      const strategies = [enderELStrategyAddress];
      await enderTreasury.connect(owner).setStrategy(strategies, true);

      expect(await enderTreasury.strategies(enderELStrategyAddress)).to.equal(true);
    });

    it("Should revert when called by non-owner", async function () {
      // a random address to test ownership revert
      const strategies = ["0xA2fFDf332d92715e88a958A705948ADF75d07d01"];
      await expect(enderTreasury.connect(wallet1).setStrategy(strategies, true))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should revert when strategies address array input is empty", async function () {
      await expect(enderTreasury.connect(owner).setStrategy([], true)).to.be.revertedWithCustomError(enderTreasury, 'InvalidStrategy');
    });

    it("Should set multiple strategies correctly", async function () {
      const strategies = [enderELStrategyAddress, instadappLiteAddress];
      await enderTreasury.connect(owner).setStrategy(strategies, false);
      expect(await enderTreasury.strategies(enderELStrategyAddress)).to.equal(false);
      expect(await enderTreasury.strategies(instadappLiteAddress)).to.equal(false);

      await enderTreasury.connect(owner).setStrategy(strategies, true);
      expect(await enderTreasury.strategies(enderELStrategyAddress)).to.equal(true);
      expect(await enderTreasury.strategies(instadappLiteAddress)).to.equal(true);
    });

    it("Should set priority strategy correctly", async function () {
      await expect(enderTreasury.connect(wallet1).setPriorityStrategy(enderELStrategyAddress))
        .to.be.revertedWith("Ownable: caller is not the owner");

      await enderTreasury.connect(owner).setPriorityStrategy(enderELStrategyAddress);
      expect(await enderTreasury.priorityStrategy()).to.equal(enderELStrategyAddress);

      await enderTreasury.connect(owner).setPriorityStrategy(instadappLiteAddress);
      expect(await enderTreasury.priorityStrategy()).to.equal(instadappLiteAddress);
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

  describe("withdraw", function () {
    // it("Should withdraw stEther", async function () {
    //   const initialBalance = await ethers.provider.getBalance(enderTreasuryAddress);
    //   await owner.sendTransaction({ to: enderTreasuryAddress, value: ethers.parseEther("1.0") });
    //   const finalBalance = await ethers.provider.getBalance(enderTreasuryAddress);
    //   expect(finalBalance).to.equal(initialBalance + ethers.parseEther("1.0"));

    //   await enderTreasury.connect(owner).withdrawBondFee(stEthAddress, ethers.parseEther("1.0"));
    //   const finalBalance2 = await ethers.provider.getBalance(enderTreasuryAddress);
    //   expect(finalBalance2).to.equal(initialBalance);
    // });


    it("Should revert when called by non-owner", async function () {
      await expect(enderTreasury.connect(wallet1).withdrawBondFee(stEthAddress, ethers.parseEther("1.0")))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should return ETHDenomination", async function () {
      const ethDenomination = await enderTreasury.ETHDenomination(stEthAddress);
      const endTokenBalance = await endToken.totalSupply();

      console.log("ethDenomination: ", ethDenomination);

      expect(ethDenomination[0]).to.equal(BigInt(0));
      expect(ethDenomination[1]).to.equal(endTokenBalance);
    });

    it("Should calculate deposit return correctly", async function () {
      const depositReturn = await enderTreasury.calculateDepositReturn(stEthAddress);
      expect(depositReturn).to.equal(BigInt(0));
    });

  });

  describe("Should revert for function with modifier", function () {

    it("Should revert when called by non-bond", async function () {

      const amount = ethers.parseEther("1.0");

      await expect(enderTreasury.connect(wallet1).depositTreasury({
        account: wallet1.address,
        stakingToken: stEthAddress,
        tokenAmt: amount,
      }, amount))
        .to.be.revertedWithCustomError(enderTreasury, "NotAllowed");

      await expect(enderTreasury.connect(wallet1).withdraw({
        account: wallet1.address,
        stakingToken: stEthAddress,
        tokenAmt: amount,
      }, amount))
        .to.be.revertedWithCustomError(enderTreasury, "NotAllowed");

      await expect(enderTreasury.connect(wallet1).collect(wallet1.address, amount))
        .to.be.revertedWithCustomError(enderTreasury, "NotAllowed");

      await expect(enderTreasury.connect(wallet1).mintEndToUser(wallet1.address, amount))
        .to.be.revertedWithCustomError(enderTreasury, "NotAllowed");

      await expect(enderTreasury.connect(wallet1).stakeRebasingReward(wallet1.address))
        .to.be.revertedWithCustomError(enderTreasury, "NotAllowed");


      const wrongStrategyAddress = "0x2D4C407BBe49438ED859fe965b140dcF1aaB71a9";
      await expect(enderTreasury.connect(wallet1).depositInStrategy(stEthAddress, wrongStrategyAddress, amount))
        .to.be.revertedWithCustomError(enderTreasury, "NotAllowed");

      await expect(enderTreasury.connect(wallet1).withdrawFromStrategy(stEthAddress, wrongStrategyAddress, amount))
        .to.be.revertedWithCustomError(enderTreasury, "NotAllowed");

    });
  });

  describe("Should deposit and withdraw correctly", async function () {


    it("Should set strategy correctly", async function () {
      await stEth.connect(owner).submit({
        value: ethers.parseEther("1000"),
      });
      await stEth.connect(owner).transfer(enderTreasuryAddress, ethers.parseEther("100"));

      await stEth.connect(owner).approve(instadappLiteAddress, ethers.parseEther("100"));
      await instadappLitelidoStaking.connect(owner).deposit(ethers.parseEther("100"));


      // change the owner to the treasury
      await enderTreasury.connect(owner).setAddress(owner.address, 2);
      expect(await enderTreasury.getAddressByType(2)).to.equal(owner.address);

      const strategies = [enderELStrategyAddress, instadappLiteAddress];

      await enderTreasury.connect(owner).setStrategy(strategies, true);
      expect(await enderTreasury.strategies(enderELStrategyAddress)).to.equal(true);
      expect(await enderTreasury.strategies(instadappLiteAddress)).to.equal(true);

    });

    it("Invalid deposit in strategy", async function () {
      const asset = stEthAddress;
      const strategy = instadappLiteAddress;
      const amount = ethers.parseEther("2.0");

      const invalidAmount = ethers.parseEther("0");

      expect(await enderTreasury.strategies(instadappLiteAddress)).to.equal(true);

      await expect(enderTreasury.connect(owner).depositInStrategy(asset, strategy, invalidAmount))
        .to.be.revertedWithCustomError(enderTreasury, "ZeroAmount");

      const invalidAsset = ethers.ZeroAddress;
      await expect(enderTreasury.connect(owner).depositInStrategy(invalidAsset, strategy, amount))
        .to.be.revertedWithCustomError(enderTreasury, "ZeroAddress");
    });

    it("Should deposit in strategy correctly", async function () {
      const asset = stEthAddress;
      const instaDappStrategy = instadappLiteAddress;
      const amount = ethers.parseEther("2.0");

      await enderTreasury.connect(owner).depositInStrategy(asset, instaDappStrategy, amount);

      const instaDappDepositValuations = await enderTreasury.instaDappDepositValuations();
      expect(instaDappDepositValuations).to.equal(amount);

      // no lybraFinance and eigenLayer

      const totalDepositInStrategy = await enderTreasury.totalDepositInStrategy();
      expect(totalDepositInStrategy).to.equal(amount);

    });

    it("Invalid withdraw from strategy", async function () {
      const asset = stEthAddress;
      const strategy = instadappLiteAddress;
      const amount = ethers.parseEther("2.0");

      const invalidAmount = ethers.parseEther("0");

      expect(await enderTreasury.strategies(instadappLiteAddress)).to.equal(true);

      await expect(enderTreasury.connect(owner).withdrawFromStrategy(asset, strategy, invalidAmount))
        .to.be.revertedWithCustomError(enderTreasury, "ZeroAmount");

      const invalidAsset = ethers.ZeroAddress;
      await expect(enderTreasury.connect(owner).withdrawFromStrategy(invalidAsset, strategy, amount))
        .to.be.revertedWithCustomError(enderTreasury, "ZeroAddress");
    });

    it("Should withdraw from strategy correctly", async function () {
      const asset = stEthAddress;
      const instaDappStrategy = instadappLiteAddress;
      const amount = ethers.parseEther("2.0");

      await enderTreasury.connect(owner).withdrawFromStrategy(asset, instaDappStrategy, amount);

      const instaDappWithdrawlValuations = await enderTreasury.instaDappWithdrawlValuations();
      expect(instaDappWithdrawlValuations).to.equal(amount);

      // no lybraFinance and eigenLayer

      const totalDepositInStrategy = await enderTreasury.totalDepositInStrategy();
      expect(totalDepositInStrategy).to.equal(BigInt(0));
    });



    it("Should deposit and withdraw correctly", async function () {
      const amount = ethers.parseEther("1");
      const amount2 = ethers.parseEther("2");

      await enderTreasury.connect(owner).depositTreasury({
        account: owner.address,
        stakingToken: stEthAddress,
        tokenAmt: amount,
      }, BigInt(0));

      const epochDepoistAmount = await enderTreasury.epochDeposit();
      expect(epochDepoistAmount).to.equal(amount);

      const fundsInfoAmount = await enderTreasury.fundsInfo(stEthAddress);
      expect(fundsInfoAmount).to.equal(amount);


      // set 1 stEth to treasury, so it can be withdrawn
      const asset = stEthAddress;
      const instaDappStrategy = instadappLiteAddress;

      await enderTreasury.connect(owner).depositInStrategy(asset, instaDappStrategy, amount);

      const instaDappDepositValuations = await enderTreasury.instaDappDepositValuations();
      expect(instaDappDepositValuations).to.equal(amount + amount2);

      const totalDepositInStrategy = await enderTreasury.totalDepositInStrategy();
      expect(totalDepositInStrategy).to.equal(amount);

      await enderTreasury.connect(owner).depositTreasury({
        account: owner.address,
        stakingToken: stEthAddress,
        tokenAmt: amount,
      }, amount);

      const epochDepoistAmount2 = await enderTreasury.epochDeposit();
      expect(epochDepoistAmount2).to.equal(amount2);

      const fundsInfoAmount2 = await enderTreasury.fundsInfo(stEthAddress);
      expect(fundsInfoAmount2).to.equal(amount2);


      await enderTreasury.connect(owner).withdraw({
        account: owner.address,
        stakingToken: stEthAddress,
        tokenAmt: amount,
      }, amount);
    });

    // it("Should collect correctly", async function () {
    //   const amount = ethers.parseEther("1");
    //   // const amount2 = ethers.parseEther("2");

    //   await enderTreasury.connect(owner).collect(owner.address, amount);
    //   // await enderTreasury.connect(owner).collect(owner.address, amount2);

    //   const fundsInfoAmount = await enderTreasury.fundsInfo(owner.address);
    //   // expect(fundsInfoAmount).to.equal(amount + amount2);
    // });

    it("Should mintEndToUser correctly", async function () {
      const amount = ethers.parseEther("1");
      // const amount2 = ethers.parseEther("2");

      await enderTreasury.connect(owner).mintEndToUser(owner.address, amount);
      // await enderTreasury.connect(owner).mintEndToUser(owner.address, amount2);

      const fundsInfoAmount = await enderTreasury.fundsInfo(owner.address);
      // expect(fundsInfoAmount).to.equal(amount + amount2);
    });

    it("Should withdrawBondFee correctly", async function () {
      const amount = ethers.parseEther("0.1");

      // const oldBalance = await stEth.balanceOf(enderTreasuryAddress);

      // await enderTreasury.connect(owner).withdrawBondFee(stEthAddress, amount);

      // const newBalance = await stEth.balanceOf(enderTreasuryAddress);
      // expect(newBalance).to.equal(oldBalance - amount);
      // expect(fundsInfoAmount).to.equal(amount + amount2);
    });

    // this one always before stakeRebasingReward
    it("Should set it back correctly", async function () {
      await enderTreasury.connect(owner).setAddress(enderBondAddress, 2);
      expect(await enderTreasury.getAddressByType(2)).to.equal(enderBondAddress);
    });

    it("Should get stakeRebasingReward correctly", async function () {
      // console.log("stakeRebaseReward: ", stakeRebaseReward);

      // const epochWithraw = await enderTreasury.epochWithdrawl();
      // const instaDappDepositValuations = await enderTreasury.instaDappDepositValuations();
      // const epochDeposit = await enderTreasury.epochDeposit();
      // const balanceLastEpoch = await enderTreasury.balanceLastEpoch();

      // console.log("epochWithraw: ", epochWithraw);
      // console.log("instaDappDepositValuations: ", instaDappDepositValuations);
      // console.log("epochDeposit: ", epochDeposit);
      // console.log("balanceLastEpoch: ", balanceLastEpoch);

      // const balance = await stEth.balanceOf(enderTreasuryAddress);
      // console.log("balance: ", balance);

      await enderStaking.epochStakingReward(stEthAddress);

    });

  });

});
