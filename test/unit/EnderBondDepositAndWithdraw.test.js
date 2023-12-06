const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { BigNumber } = require("ethers");

const { EigenLayerStrategyManagerAddress } = require("../utils/common");
const exp = require("constants");
const { sign } = require("crypto");
// const { describe } = require("node:test");
const signature = "0xA2fFDf332d92715e88a958A705948ADF75d07d01";
const baseURI =
  "https://endworld-backend-git-dev-metagaming.vercel.app/nft/metadata/";
const MINTER_ROLE =
  "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
const ADMIN_ROLE =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

function expandTo18Decimals(n) {
  return ethers.parseUnits(n.toString(), 18);
}

describe.only("EnderBond Deposit and Withdraw", function () {
  let owner, signer1, signer2, signer3;
  let endTokenAddress,
    enderBondAddress,
    enderTreasuryAddress,
    enderStakingAddress,
    mockWETHAddress,
    instadappLiteAddress;

  let endToken,
    enderBond,
    enderTreasury,
    enderELStrategy,
    enderStaking,
    sEnd,
    sEndTokenAddress,
    instadappLitelidoStaking,
    WETH,
    stEth,
    bondNFT,
    oracle,
    oracleAddress;

  before(async function () {
    const wETH = await ethers.getContractFactory("mockWETH");
    const StEth = await ethers.getContractFactory("MockStEth");
    const InstadappLite = await ethers.getContractFactory("StinstaToken");
    const EndToken = await ethers.getContractFactory("EndToken");
    const EnderBond = await ethers.getContractFactory("EnderBond");
    const EnderTreasury = await ethers.getContractFactory("EnderTreasury");
    const EnderStaking = await ethers.getContractFactory("EnderStaking");
    const SEnd = await ethers.getContractFactory("SEndToken");
    const Oracle = await ethers.getContractFactory("EnderOracle");
    [owner, wallet1, signer1, signer2, signer3] = await ethers.getSigners();
    WETH = await wETH.connect(owner).deploy("wrappedETH", "weth", owner.address);
    mockWETHAddress = await WETH.getAddress();
    stEth = await StEth.deploy(mockWETHAddress ,owner.address);
    stEthAddress = await stEth.getAddress();
    console.log("I'm heeeeeeeeeeeeeeeeeeeeeeeeerrrrrrrrrrreeeeeeeeeeee");
    sEnd = await SEnd.deploy();
    sEndTokenAddress = await sEnd.getAddress();

    instadappLitelidoStaking = await InstadappLite.deploy("InstaToken", "Inst", owner.address, stEthAddress);
    instadappLiteAddress = await instadappLitelidoStaking.getAddress();

    endToken = await upgrades.deployProxy(EndToken, [], {
      initializer: "initialize",
    });
    endTokenAddress = await endToken.getAddress();

    oracle = await upgrades.deployProxy(Oracle, [], {
      initializer: "initialize",
    });

    oracleAddress = await oracle.getAddress();

    enderBond = await upgrades.deployProxy(
      EnderBond,
      [endTokenAddress, ethers.ZeroAddress, oracleAddress],
      {
        initializer: "initialize",
      }
    );

    enderBondAddress = await enderBond.getAddress();

    await endToken.setBond(enderBondAddress);

    enderStaking = await upgrades.deployProxy(
      EnderStaking,
      [endTokenAddress, sEndTokenAddress],
      {
        initializer: "initialize",
      }
    );
    enderStakingAddress = await enderStaking.getAddress();

    enderTreasury = await upgrades.deployProxy(
      EnderTreasury,
      [
        endTokenAddress,
        enderStakingAddress,
        enderBondAddress,
        ethers.ZeroAddress,
        ethers.ZeroAddress,
        ethers.ZeroAddress,
        70,
        30,
        oracleAddress,
      ],
      {
        initializer: "initializeTreasury",
      }
    );
    // console.log("-------------------------------------------------------------------------");

    enderTreasuryAddress = await enderTreasury.getAddress();

    const BondNFT = await ethers.getContractFactory("BondNFT");
    bondNFT = await upgrades.deployProxy(BondNFT, [enderBondAddress, baseURI], {
      initializer: "initialize",
    });
    await bondNFT.waitForDeployment();
    bondNFTAddress = await bondNFT.getAddress();

    await enderStaking.setAddress(enderBondAddress, 1);
    await enderStaking.setAddress(enderTreasuryAddress, 2);

    // console.log({enderBond});
    await enderBond.setBondableTokens([stEthAddress], true);
    await enderBond.setAddress(enderTreasuryAddress, 1);
    await enderBond.setAddress(bondNFTAddress, 3);


    await endToken.grantRole(MINTER_ROLE, owner.address);
    await endToken.setFee(20);

    await endToken.setExclude([enderBondAddress], true);
    await endToken.setExclude([enderTreasuryAddress], true);

    await enderBond.setAddress(enderStakingAddress,8);
    await enderBond.setAddress(stEthAddress,6);

    await endToken.grantRole(MINTER_ROLE,enderStakingAddress);
    await endToken.grantRole("0xe13c49f41ace7b3f26b0cf23ab168b4c48591998827e86cfa78a62930e4d6953",enderBondAddress);
    await endToken.grantRole("0xe13c49f41ace7b3f26b0cf23ab168b4c48591998827e86cfa78a62930e4d6953",owner.address);

    console.log("role chechking-------->",enderBondAddress,  await endToken.hasRole("0xe13c49f41ace7b3f26b0cf23ab168b4c48591998827e86cfa78a62930e4d6953", enderBondAddress));
    await enderBond.setBool(true);
    // await endToken.grantRole()
  });

  describe("deposit and withdraw", async () => {
    // it("should handle revert cases during withdrawal", async () => {
    //   const maturity = 90;
    //   const bondFee = 5;
    //   const depositAmountEnd = expandTo18Decimals(5);
    //   const depositPrincipalStEth = expandTo18Decimals(1);

    //   const endTransfer = expandTo18Decimals(1);

    //   await endToken.connect(owner).mint(signer1.address, depositAmountEnd);
    //   await endToken.connect(signer1).transfer(signer2.address, endTransfer);

    //   await endToken.connect(signer1).transfer(signer2.address, endTransfer);

    //   await endToken.distributeRefractionFees();

    //   await stEth.mint(await signer1.getAddress(), depositPrincipalStEth);

    //   await stEth
    //     .connect(signer1)
    //     .approve(enderBondAddress, depositPrincipalStEth);

    //   //this is where the user will deposit the StEth in to the contract
    //   //in the deposit the amount will be divided in to 30 and 70% where the admin Will have access to further
    //   //deposit it into the strategy for every 24 hours
    //   const tokenId = await depositAndSetup(
    //     signer1,
    //     depositPrincipalStEth,
    //     maturity,
    //     bondFee
    //   );

    //   // Wait for the bond to mature
    //   await expect(
    //     withdrawAndSetup(signer1, tokenId)
    //   ).to.be.revertedWithCustomError(enderBond, "BondNotMatured");
    //   await increaseTime(90 * 24 * 3600);
    //   await withdrawAndSetup(signer1, tokenId);

    //   await expect(
    //     withdrawAndSetup(signer1, tokenId)
    //   ).to.be.revertedWithCustomError(enderBond, "BondAlreadyWithdrawn");

    //   await expect(
    //     withdrawAndSetup(signer2, tokenId)
    //   ).to.be.revertedWithCustomError(enderBond, "NotBondUser");
    //   console.log("last-----------------------------");
    // });
    it("should successfully withdraw and update balances", async () => {
      const maturity = 90;
      const bondFee = 5;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);

      const endTransfer = expandTo18Decimals(1);
      await endToken.setFee(20);

      //mint to signer1
      await endToken.connect(owner).mint(signer1.address, depositAmountEnd);

      //first transfer
      await endToken.connect(signer1).transfer(signer2.address, endTransfer);

      //second transfer
      await endToken.connect(signer1).transfer(signer2.address, endTransfer);

      expect(await endToken.balanceOf(enderBondAddress)).to.be.equal(0);

      //as we hit the distribute Refraction Fee the fee that is collected in the
      //end token will be send to the enderBond and S is updated Aswell
      //  and the user can cliam for the enderbond
      //******* this will revert here because , we cant call this function until first deposit
      // is done  *******************
      // await endToken.distributeRefractionFees();
      // await expect(
      //   endToken.distributeRefractionFees()
      // ).to.be.revertedWithCustomError(enderBond, "WaitForFirstDeposit");

      expect(await enderBond.rewardShareIndex()).to.be.equal(0);
      await WETH.mint(signer1.address, depositPrincipalStEth);
      await WETH.connect(signer1).approve(stEthAddress, depositPrincipalStEth);
      await stEth.connect(signer1).mintShare(depositPrincipalStEth);
      
      await stEth
      .connect(signer1)
      .approve(enderBondAddress, depositPrincipalStEth);
      
      await enderTreasury.setAddress(stEthAddress, 5);
      
      //this is where the user will deposit the StEth in to the contract
      //in the deposit the amount will be divided in to 30 and 70% where the admin Will have access to further
      //deposit it into the strategy for every 24 hours
      await sleep(1200);
      const tokenId = await depositAndSetup(
        signer1,
        depositPrincipalStEth,
        maturity,
        bondFee
        );
        
      console.log("I'm hheeeeeerrrrrreeeeeeeeee-----------------------")
      await endToken.connect(signer1).transfer(signer2.address, "1000000000000000000")
      await WETH.mint(signer2.address, depositPrincipalStEth);
      await WETH.connect(signer2).approve(stEthAddress, depositPrincipalStEth);
      await stEth.connect(signer2).mintShare(depositPrincipalStEth);

      await stEth
        .connect(signer2)
        .approve(enderBondAddress, depositPrincipalStEth);

      //this is where the user will deposit the StEth in to the contract
      //in the deposit the amount will be divided in to 30 and 70% where the admin Will have access to further
      //deposit it into the strategy for every 24 hours
      const tokenId1 = await depositAndSetup(
        signer2,
        depositPrincipalStEth,
        maturity,
        bondFee
      );
        console.log("-------------------------------------------------------------------")
      //this fundtion will set the bondYeildShareIndex where it is used to calculate the user S0
      increaseTime(6000);
      await enderBond.epochBondYieldShareIndex();
      //user cant collect the refraction rewards before the Distribution is done
      // await expect(
      //   enderBond.connect(signer1).claimRefractionRewards(tokenId)
      // ).to.be.revertedWithCustomError(enderBond, "NotAllowed");

      expect(await enderBond.bondYieldShareIndex()).to.be.greaterThan(
        await enderBond.userBondYieldShareIndex(tokenId)
      );

      //now this can be called because the first deposit has done
      await endToken.distributeRefractionFees();

      //  there are two tx done above which have 20% fee it will be equal to 400000000000000000
      // expect(await endToken.balanceOf(enderBondAddress)).to.be.equal(
      //   expandTo18Decimals(0.4)
      // );
      console.log(
        await endToken.balanceOf(enderBondAddress),
        "after the first distribution balance of enderBond for end tokens"
      );

      const initialBalanceOfuser = await endToken.balanceOf(signer1.address);
      console.log("first");

      //as the distribution is done user now can withdraw the rewards
      await enderBond.connect(signer1).claimRefractionRewards(tokenId,0);
      console.log("ieufaksjfkajbfiabfikaf");

      //   as he claimed the rewards
      expect(await endToken.balanceOf(signer1.address)).to.be.greaterThan(
        initialBalanceOfuser
      );
      console.log(
        await endToken.balanceOf(enderBondAddress),
        "),------------------)"
      );

      //for depositing second time by the same user
      await WETH.mint(signer1.address, depositPrincipalStEth);
      await WETH.connect(signer1).approve(stEthAddress, depositPrincipalStEth);
      await stEth.connect(signer1).mintShare(depositPrincipalStEth);

      await stEth
        .connect(signer1)
        .approve(enderBondAddress, depositPrincipalStEth);
      await enderTreasury.setAddress(instadappLitelidoStaking, 5);
      await enderTreasury.setStrategy([instadappLitelidoStaking], true);
      await enderTreasury.setPriorityStrategy(instadappLitelidoStaking);
      await enderTreasury.depositInStrategy(stEthAddress, instadappLitelidoStaking, "2000000000000000000");
      console.log("------------before deposit------------------------------------------------------------------------------------")
      const tokenId2 = await depositAndSetup(
        signer1,
        depositPrincipalStEth,
        maturity * 2,
        bondFee
      );

      //this fundtion will set the bondYeildShareIndex where it is used to calculate the user S0
      await enderBond.epochBondYieldShareIndex();

      expect(await enderBond.bondYieldShareIndex()).to.be.greaterThan(
        await enderBond.userBondYieldShareIndex(tokenId2)
      );

      expect(await bondNFT.ownerOf(tokenId2)).to.be.equal(
        await bondNFT.ownerOf(tokenId)
      );

      //user cant collect the refraction rewards before the Distribution is done
      await expect(
        enderBond.connect(signer1).claimRefractionRewards(tokenId2,0)
      ).to.be.revertedWithCustomError(enderBond, "NoRewardCollected");

      //increasing the time 1 day

      increaseTime(600);
      const initalBalanceOfEnderBond = await endToken.balanceOf(
        enderBondAddress
      );
      //   await endToken.distributeRefractionFees();

      //  there are one tx done above which have 20% fee it will be equal to 0.080000000896
      //because the refraction rewarded colledted when the rewared is transferred to the tokenId1
      //   expect(await endToken.balanceOf(enderBondAddress)).to.be.greaterThan(
      //     initalBalanceOfEnderBond
      //   );
      
      console.log("jssksksksksksks");
      console.log(
        await endToken.balanceOf(enderBondAddress),
        "after the second distribution balance of enderBond for end tokens"
      );

      const initialBalanceOfuser1 = await endToken.balanceOf(signer1.address);

      //as the distribution is done user now can withdraw the rewards
      //   await enderBond.connect(signer1).claimRefractionRewards(tokenId2);

      //   await enderBond.connect(signer1).claimRefractionRewards(tokenId);

      //as he claimed the rewards
      //   expect(await endToken.balanceOf(signer1.address)).to.be.greaterThan(
      //     initialBalanceOfuser1
      //   );

      //now we hit the refraction function in the token contract
      //which will update the rewardShareIndex in the enderbond

      const userAddressBefore = await endToken.balanceOf(signer1.address);

      // Wait for the bond to mature
      await increaseTime(90 * 600);

      console.log(await stEth.balanceOf(signer1.address), "signer1");

      //   await endToken.distributeRefractionFees();

      console.log(
        await endToken.balanceOf(signer1.address),
        "balance before the withdraw before"
      );
      MINTER_ROLE;

      await withdrawAndSetup(signer1, tokenId);
      console.log(tokenId2, "-------------------------PASSSSSSSS first withdraw-------------------------");

      await withdrawAndSetup(signer1, tokenId2);

      expect(await stEth.balanceOf(signer1.address)).to.be.equal(
        expandTo18Decimals(1.9)
      );

      console.log(
        await endToken.balanceOf(signer1.address),
        "balance after the withdraw after--------------"
      );
    });


    // it("should set and get addresses correctly", async function () {
    //   // Test the setAddress function
    //   await enderBond.setAddress(enderTreasuryAddress, 1);
    //   await enderBond.setAddress(endTokenAddress, 2);
    //   await enderBond.setAddress(bondNFTAddress, 3);

    //   expect(await enderBond.getAddress(1)).to.equal(enderTreasuryAddress);
    //   expect(await enderBond.getAddress(2)).to.equal(endTokenAddress);
    //   expect(await enderBond.getAddress(3)).to.equal(bondNFTAddress);
    // });

  });

  async function depositAndSetup(signer, depositAmount, maturity, bondFee) {
    await enderBond
      .connect(signer)
      .deposit(depositAmount, maturity, bondFee, stEthAddress);
    filter = enderBond.filters.Deposit;
    const events = await enderBond.queryFilter(filter, -1);

    const event1 = events[0];

    const args1 = event1.args;
    const tokenId = args1.tokenId;

    return tokenId;
  }

  async function withdrawAndSetup(signer, tokenId) {
    await endToken.grantRole(MINTER_ROLE, enderTreasuryAddress);
    await enderBond.connect(signer).withdraw(tokenId);
  }

  async function increaseTime(seconds) {
    await ethers.provider.send("evm_increaseTime", [seconds]);
    await ethers.provider.send("evm_mine");
  }
});

function sleep(ms)
 {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
