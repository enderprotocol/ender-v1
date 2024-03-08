const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { BigNumber } = require("ethers");


const { EigenLayerStrategyManagerAddress } = require("../utils/common");
const exp = require("constants");
const { sign } = require("crypto");
const { log } = require("console");
// const { describe, it } = require('mocha');
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

describe("EnderBond Deposit and Withdraw", function () {
  let owner, signer, signer1, signer2, signer3, signer4;
  let endTokenAddress,
    enderBondAddress,
    enderBondLiquidityDepositAddress,
    enderTreasuryAddress,
    enderStakingAddress,
    mockWETHAddress,
    instadappLiteAddress;

  let endToken,
    enderBond,
    enderBondLiquidityDeposit,
    enderTreasury,
    enderELStrategy,
    enderStaking,
    sEnd,
    sEndTokenAddress,
    instadappLitelidoStaking,
    WETH,
    stEth,
    bondNFT;
  // oracle,
  // oracleAddress;

  this.beforeEach(async function () {
    const wETH = await ethers.getContractFactory("mockWETH");
    const StEth = await ethers.getContractFactory("StETH");
    const InstadappLite = await ethers.getContractFactory("StinstaToken");
    const EndToken = await ethers.getContractFactory("EndToken");
    const EnderBondLiquidityBond = await ethers.getContractFactory("EnderBondLiquidityDeposit");
    const EnderBond = await ethers.getContractFactory("EnderBond");
    const EnderTreasury = await ethers.getContractFactory("EnderTreasury");
    const EnderStaking = await ethers.getContractFactory("EnderStaking");
    const SEnd = await ethers.getContractFactory("SEndToken");
    // const Oracle = await ethers.getContractFactory("EnderOracle");

    [owner, signer, wallet1, signer1, signer2, signer3, signer4,] = await ethers.getSigners();

    stEth = await StEth.deploy();
    stEthAddress = await stEth.getAddress();

    // sEnd = await SEnd.connect(owner).deploy();
    sEnd = await upgrades.deployProxy(SEnd, [], {
      initializer: "initialize",
    });
    sEndTokenAddress = await sEnd.connect(owner).getAddress();

    enderBondLiquidityDeposit = await upgrades.deployProxy(
      EnderBondLiquidityBond,
      [stEthAddress, stEthAddress, owner.address, owner.address],
      {
        initializer: "initialize",
      }
    );

    instadappLitelidoStaking = await InstadappLite.deploy("InstaToken", "Inst", owner.address, stEthAddress);
    instadappLiteAddress = await instadappLitelidoStaking.getAddress();
    endToken = await upgrades.deployProxy(EndToken, [], {
      initializer: "initialize",
    });
    endTokenAddress = await endToken.getAddress();

    // oracle = await upgrades.deployProxy(Oracle, [], {
    //   initializer: "initialize",
    // });

    // oracleAddress = await oracle.getAddress();

    enderBond = await upgrades.deployProxy(
      EnderBond,
      [endTokenAddress, ethers.ZeroAddress, signer.address],
      {
        initializer: "initialize",
      }
    );

    enderBondAddress = await enderBond.getAddress();

    await endToken.setBond(enderBondAddress);

    enderStaking = await upgrades.deployProxy(
      EnderStaking,
      [endTokenAddress, sEndTokenAddress, stEthAddress, signer.address],
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
        instadappLiteAddress,
        ethers.ZeroAddress,
        ethers.ZeroAddress,
        70,
        30
      ],
      {
        initializer: "initializeTreasury",
      }
    );

    enderTreasuryAddress = await enderTreasury.getAddress();

    const BondNFT = await ethers.getContractFactory("BondNFT");
    bondNFT = await upgrades.deployProxy(BondNFT, [enderBondAddress, baseURI], {
      initializer: "initialize",
    });
    await bondNFT.waitForDeployment();
    bondNFTAddress = await bondNFT.getAddress();
    // await sEnd.connect(owner).grantRole("0x0000000000000000000000000000000000000000000000000000000000000000", "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
    await sEnd.setAddress(enderStakingAddress, 1);
    await enderStaking.setAddress(enderBondAddress, 1);
    await enderStaking.setAddress(enderTreasuryAddress, 2);

    await enderStaking.setAddress(stEthAddress, 6);
    await enderBond.setBondableTokens([stEthAddress], true);
    await enderBond.setAddress(enderTreasuryAddress, 1);
    await enderBond.setAddress(bondNFTAddress, 3);
    await enderBond.setAddress(sEndTokenAddress, 9);
    await sEnd.setStatus(2);
    await sEnd.whitelist(enderBondAddress, true);
    await endToken.grantRole(MINTER_ROLE, owner.address);
    await endToken.setFee(20);

    await endToken.setExclude([enderBondAddress], true);
    await endToken.setExclude([enderTreasuryAddress], true);
    await endToken.setExclude([enderStakingAddress], true);

    await enderBond.setAddress(enderStakingAddress, 8);
    await enderBond.setAddress(stEthAddress, 6);

    await endToken.grantRole(MINTER_ROLE, enderStakingAddress);
    await endToken.grantRole("0xe13c49f41ace7b3f26b0cf23ab168b4c48591998827e86cfa78a62930e4d6953", enderBondAddress);
    await endToken.grantRole("0xe13c49f41ace7b3f26b0cf23ab168b4c48591998827e86cfa78a62930e4d6953", owner.address);

    await enderBond.setBool(true);
    // await endToken.grantRole()

    //signature
    sig= await signatureDigest();
    sig_1 = await signatureDigest1();
    sig_2 = await signatureDigest2();
  });

  describe("deposit and withdraw", async () => {
    it("should successfully withdraw and update balances", async () => {
      const maturity = 90;
      const bondFee = 500;
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
      //await WETH.mint(signer1.address, depositPrincipalStEth);
      // await WETH.connect(signer1).approve(stEthAddress, depositPrincipalStEth);
      await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });

      await stEth
        .connect(signer1)
        .approve(enderBondAddress, depositPrincipalStEth);

      await enderTreasury.setAddress(instadappLiteAddress, 5);

      //this is where the user will deposit the StEth in to the contract
      //in the deposit the amount will be divided in to 30 and 70% where the admin Will have access to further
      //deposit it into the strategy for every 24 hours
      await sleep(1200);
      console.log("Here");
      const tokenId = await depositAndSetup(
        signer1,
        depositPrincipalStEth,
        maturity,
        bondFee,
        [signer1.address, "0", sig],
      );

      await endToken.connect(signer1).transfer(signer2.address, "1000000000000000000")
      // await WETH.mint(signer2.address, depositPrincipalStEth);
      // await WETH.connect(signer2).approve(stEthAddress, depositPrincipalStEth);
      await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });

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
        bondFee,
        [signer2.address, "0", sig_1],
      );
      //this fundtion will set the bondYeildShareIndex where it is used to calculate the user S0
      increaseTime(6000);
      await enderBond.epochBondYieldShareIndex();
      //user cant collect the refraction rewards before the Distribution is done
      // await expect(
      //   enderBond.connect(signer1).calculateRefractionRewards(tokenId)
      // ).to.be.revertedWithCustomError(enderBond, "NotAllowed");

      expect(await enderBond.bondYieldShareIndex()).to.be.greaterThan(
        await enderBond.userBondYieldShareIndex(tokenId)
      );

      await endToken.distributeRefractionFees();
      // await enderBond.connect(signer1).claimRewards(tokenId);

      //now this can be called because the first deposit has done

      //  there are two tx done above which have 20% fee it will be equal to 400000000000000000
      // expect(await endToken.balanceOf(enderBondAddress)).to.be.equal(
      //   expandTo18Decimals(0.4)
      // );


      const initialBalanceOfuser = await endToken.balanceOf(signer1.address);

      //   as he claimed the rewards
      // expect(await endToken.balanceOf(signer1.address)).to.be.greaterThan(
      //   initialBalanceOfuser
      // );

      //for depositing second time by the same user
      // await WETH.mint(signer1.address, depositPrincipalStEth);
      // await WETH.connect(signer1).approve(stEthAddress, depositPrincipalStEth);
      await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });

      await stEth
        .connect(signer1)
        .approve(enderBondAddress, depositPrincipalStEth);
      await enderTreasury.setAddress(instadappLitelidoStaking, 5);
      await enderTreasury.setStrategy([instadappLitelidoStaking], true);
      await enderTreasury.setPriorityStrategy(instadappLitelidoStaking);
      await enderTreasury.depositInStrategy(stEthAddress, instadappLitelidoStaking, "2000000000000000000");
      const tokenId2 = await depositAndSetup(
        signer1,
        depositPrincipalStEth,
        maturity,
        bondFee,
        [signer1.address, "0", sig],
      );
      await enderTreasury.depositInStrategy(stEthAddress, instadappLitelidoStaking, depositPrincipalStEth);

      //this fundtion will set the bondYeildShareIndex where it is used to calculate the user S0
      await enderBond.epochBondYieldShareIndex();
      expect(await enderBond.bondYieldShareIndex()).to.be.greaterThan(
        await enderBond.userBondYieldShareIndex(tokenId2)
      );

      
      expect(await bondNFT.ownerOf(tokenId2)).to.be.equal(
        await bondNFT.ownerOf(tokenId)
        );
        
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
            
            
            const initialBalanceOfuser1 = await endToken.balanceOf(signer1.address);
            
            //as the distribution is done user now can withdraw the rewards
            //   await enderBond.connect(signer1).calculateRefractionRewards(tokenId2);
            
            //   await enderBond.connect(signer1).calculateRefractionRewards(tokenId);
            
            //as he claimed the rewards
            //   expect(await endToken.balanceOf(signer1.address)).to.be.greaterThan(
              //     initialBalanceOfuser1
              //   );
              
              //now we hit the refraction function in the token contract
              //which will update the rewardShareIndex in the enderbond
              
      const userAddressBefore = await endToken.balanceOf(signer1.address);
      
      await endToken.connect(owner).mint(signer3.address, depositAmountEnd);
      await endToken.connect(signer3).approve(enderStakingAddress, depositAmountEnd);
      await sEnd.connect(owner).whitelist(enderStakingAddress, true);
      await sEnd.connect(owner).setStatus(2);
      
      // await WETH.mint(signer1.address, depositPrincipalStEth);
      // await WETH.connect(signer1).approve(stEthAddress, depositPrincipalStEth);
      await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
      await stEth.connect(signer1).transfer(instadappLiteAddress, depositPrincipalStEth);
      await enderStaking.connect(signer3).stake(depositAmountEnd, [signer3.address, "0", sig_2],);
      
      // Wait for the bond to mature
      await increaseTime(180 * 600);
      const sEndAmount = await sEnd.connect(signer3).balanceOf(signer3.address);
      
      await enderStaking.connect(signer3).unstake(sEndAmount);
      
      //   await endToken.distributeRefractionFees();
      
      // await WETH.mint(signer1.address, depositPrincipalStEth);
      // await WETH.connect(signer1).approve(stEthAddress, depositPrincipalStEth);
      await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
      await stEth.connect(signer1).transfer(instadappLiteAddress, depositPrincipalStEth)
      await withdrawAndSetup(signer1, tokenId);

      // await withdrawAndSetup(signer1, tokenId2);
      
      // expect(await stEth.balanceOf(signer1.address)).to.be.equal(
      //   expandTo18Decimals(1.9)
      //   );
    });

    it("complete Ender protocol scenario 1", async () => {
        const maturity = 90;
      const bondFee = 500;
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
      
      expect(await enderBond.rewardShareIndex()).to.be.equal(0);
      // await WETH.mint(signer1.address, depositPrincipalStEth);
      //await WETH.connect(signer1).approve(stEthAddress, depositPrincipalStEth);
      // signer1 = ethers.parseEther("1000000000000000000");
      await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
      console.log("get the stEth--------->>>>>>>", await stEth.connect(signer1).balanceOf(signer1.address));

      await stEth
        .connect(signer1)
        .approve(enderBondAddress, depositPrincipalStEth);

      await enderTreasury.setAddress(instadappLiteAddress, 5);
      await sleep(1200);
      let sig1 = signatureDigest();
      const tokenId = await depositAndSetup(
        signer1,
        depositPrincipalStEth,
        maturity,
        bondFee,
        [signer1.address, "0", sig1]
      );

      await endToken.connect(signer1).transfer(signer2.address, "1000000000000000000")
      // await WETH.mint(signer2.address, depositPrincipalStEth);
      // await WETH.connect(signer2).approve(stEthAddress, depositPrincipalStEth);
      await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });

      await stEth
        .connect(signer2)
        .approve(enderBondAddress, depositPrincipalStEth);
      let sig2 = signatureDigest1();
      const tokenId1 = await depositAndSetup(
        signer2,
        depositPrincipalStEth,
        maturity,
        bondFee,
        [signer2.address, "0", sig2]
      );
      increaseTime(6000);
      // await enderBond.epochBondYieldShareIndex();

      expect(await enderBond.bondYieldShareIndex()).to.be.greaterThan(
        await enderBond.userBondYieldShareIndex(tokenId)
      );

      //now this can be called because the first deposit has done
      await endToken.distributeRefractionFees();

      const initialBalanceOfuser = await endToken.balanceOf(signer1.address);

      //as the distribution is done user now can withdraw the rewards
      // await enderBond.connect(signer1).calculateRefractionRewards(tokenId,0);

      //for depositing second time by the same user
      // await WETH.mint(signer1.address, depositPrincipalStEth);
      // await WETH.connect(signer1).approve(stEthAddress, depositPrincipalStEth);
      await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });

      await stEth
        .connect(signer1)
        .approve(enderBondAddress, depositPrincipalStEth);
      await enderTreasury.setAddress(instadappLitelidoStaking, 5);
      await enderTreasury.setStrategy([instadappLitelidoStaking], true);
      await enderTreasury.setPriorityStrategy(instadappLitelidoStaking);
      await enderTreasury.depositInStrategy(stEthAddress, instadappLitelidoStaking, "2000000000000000000");
      await increaseTime(20 * 600);
      console.log("---------------------------------------------------3rd-deposit-----------------------------------");
      const tokenId2 = await depositAndSetup(
        signer1,
        depositPrincipalStEth,
        maturity,
        bondFee,
        [signer1.address, "0", sig1]
      );
      await enderTreasury.depositInStrategy(stEthAddress, instadappLitelidoStaking, depositPrincipalStEth);
      await enderBond.epochBondYieldShareIndex();
      expect(await enderBond.bondYieldShareIndex()).to.be.greaterThan(
        await enderBond.userBondYieldShareIndex(tokenId2)
      );

      expect(await bondNFT.ownerOf(tokenId2)).to.be.equal(
        await bondNFT.ownerOf(tokenId)
      );
      await bondNFT.connect(signer1).transferFrom(signer1.address, signer4.address, tokenId2);




      increaseTime(600);
      const initalBalanceOfEnderBond = await endToken.balanceOf(
        enderBondAddress
      );

      const initialBalanceOfuser1 = await endToken.balanceOf(signer1.address);



      const userAddressBefore = await endToken.balanceOf(signer1.address);

      await endToken.connect(owner).mint(signer3.address, depositAmountEnd);
      await endToken.connect(signer3).approve(enderStakingAddress, depositAmountEnd);
      await sEnd.connect(owner).whitelist(enderStakingAddress, true);
      await sEnd.connect(owner).setStatus(2);


      await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
      let sig3 = signatureDigest2();
      let receiptTokenAmount = await enderStaking.calculateSEndTokens(depositAmountEnd);
      await enderStaking.connect(signer3).stake(depositAmountEnd, [signer3.address, "0", sig3]);

      await increaseTime(180 * 600);
      await stEth.connect(signer1).transfer(instadappLiteAddress, depositPrincipalStEth);
      const sEndAmount = await sEnd.connect(signer3).balanceOf(signer3.address);

      await enderStaking.connect(signer3).unstake(sEndAmount);


      await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
      await stEth.connect(signer1).transfer(instadappLiteAddress, depositPrincipalStEth)

    });

    it("Ender protocol scenario 2:- BondFee is 100% and maturity is 365 days", async () => {
      const maturity = 90;
      const bondFee = 10000;
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

      expect(await enderBond.rewardShareIndex()).to.be.equal(0);
      await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
      console.log("get the stEth--------->>>>>>>", await stEth.connect(signer1).balanceOf(signer1.address));

      await stEth
        .connect(signer1)
        .approve(enderBondAddress, depositPrincipalStEth);
      await enderTreasury.setAddress(instadappLiteAddress, 5);
      await sleep(1200);
      let sig1 = signatureDigest();
      console.log("signer address:- ", signer.address);
      const tokenId = await depositAndSetup(
        signer1,
        depositPrincipalStEth,
        maturity,
        bondFee,
        [signer1.address, "0", sig1]
      );
      await endToken.connect(signer1).transfer(signer2.address, "1000000000000000000")
      await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });
      await stEth
        .connect(signer2)
        .approve(enderBondAddress, depositPrincipalStEth);
      let sig2 = signatureDigest1();
      const tokenId1 = await depositAndSetup(
        signer2,
        depositPrincipalStEth,
        maturity,
        bondFee,
        [signer2.address, "0", sig2]
      );
      increaseTime(6000);
      await endToken.distributeRefractionFees();
      const initialBalanceOfuser = await endToken.balanceOf(signer1.address);
      await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
      await stEth
        .connect(signer1)
        .approve(enderBondAddress, depositPrincipalStEth);      
      await enderTreasury.setAddress(instadappLitelidoStaking, 5);
      await enderTreasury.setStrategy([instadappLitelidoStaking], true);
      await enderTreasury.setPriorityStrategy(instadappLitelidoStaking);
      await enderTreasury.depositInStrategy(stEthAddress, instadappLitelidoStaking, "2000000000000000000");
      await increaseTime(20 * 600);
      const tokenId2 = await depositAndSetup(
        signer1,
        depositPrincipalStEth,
        maturity,
        bondFee,
        [signer1.address, "0", sig1]
      );
      await enderTreasury.depositInStrategy(stEthAddress, instadappLitelidoStaking, depositPrincipalStEth);
      console.log("---------------------------------------------------3rd-deposit-----------------------------------");
      expect(await bondNFT.ownerOf(tokenId2)).to.be.equal(
        await bondNFT.ownerOf(tokenId)
      );
      await bondNFT.connect(signer1).transferFrom(signer1.address, signer4.address, tokenId2);

      //increasing the time 1 day
      increaseTime(600);
      const initalBalanceOfEnderBond = await endToken.balanceOf(
        enderBondAddress
      );
      const initialBalanceOfuser1 = await endToken.balanceOf(signer1.address);
      const userAddressBefore = await endToken.balanceOf(signer1.address);
      await endToken.connect(owner).mint(signer3.address, depositAmountEnd);
      await endToken.connect(signer3).approve(enderStakingAddress, depositAmountEnd);
      await sEnd.connect(owner).whitelist(enderStakingAddress, true);
      await sEnd.connect(owner).setStatus(2);
      await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
      let sig3 = signatureDigest2();
      await enderStaking.connect(signer3).stake(depositAmountEnd, [signer3.address, "0", sig3]);
      await increaseTime(90 * 600);
      await stEth.connect(signer1).transfer(instadappLiteAddress, depositPrincipalStEth);
      const sEndAmount = await sEnd.connect(signer3).balanceOf(signer3.address);
      await enderStaking.connect(signer3).unstake(sEndAmount);
      await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
      await stEth.connect(signer1).transfer(instadappLiteAddress, depositPrincipalStEth)
      // await withdrawAndSetup(signer1, tokenId);

      // await withdrawAndSetup(signer4, tokenId2);


    });

    it("Ender protocol scenario 3:- BondFee is 0.01%% and maturity is 5 days", async () => {
      const maturity = 5;
      const bondFee = 1;
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

      expect(await enderBond.rewardShareIndex()).to.be.equal(0);
      await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
      console.log("get the stEth--------->>>>>>>", await stEth.connect(signer1).balanceOf(signer1.address));

      await stEth
        .connect(signer1)
        .approve(enderBondAddress, depositPrincipalStEth);
      await enderTreasury.setAddress(instadappLiteAddress, 5);
      await sleep(1200);
      let sig1 = signatureDigest();
      const tokenId = await depositAndSetup(
        signer1,
        depositPrincipalStEth,
        maturity,
        bondFee,
        [signer1.address, "0", sig1]
      );
      await endToken.connect(signer1).transfer(signer2.address, "1000000000000000000")
      await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });
      await stEth
        .connect(signer2)
        .approve(enderBondAddress, depositPrincipalStEth);
      let sig2 = signatureDigest1();
      const tokenId1 = await depositAndSetup(
        signer2,
        depositPrincipalStEth,
        maturity,
        bondFee,
        [signer2.address, "0", sig2]
      );
      increaseTime(6000);
      await endToken.distributeRefractionFees();
      const initialBalanceOfuser = await endToken.balanceOf(signer1.address);
      await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
      await stEth
        .connect(signer1)
        .approve(enderBondAddress, depositPrincipalStEth);
      await enderTreasury.setAddress(instadappLitelidoStaking, 5);
      await enderTreasury.setStrategy([instadappLitelidoStaking], true);
      await enderTreasury.setPriorityStrategy(instadappLitelidoStaking);
      await enderTreasury.depositInStrategy(stEthAddress, instadappLitelidoStaking, "2000000000000000000");
      await increaseTime(20 * 600);
      const tokenId2 = await depositAndSetup(
        signer1,
        depositPrincipalStEth,
        maturity,
        bondFee,
        [signer1.address, "0", sig1]
      );
      await enderTreasury.depositInStrategy(stEthAddress, instadappLitelidoStaking, depositPrincipalStEth);
      console.log("---------------------------------------------------3rd-deposit-----------------------------------");
      expect(await bondNFT.ownerOf(tokenId2)).to.be.equal(
        await bondNFT.ownerOf(tokenId)
      );
      await bondNFT.connect(signer1).transferFrom(signer1.address, signer4.address, tokenId2);

      //increasing the time 1 day
      increaseTime(600);
      const initalBalanceOfEnderBond = await endToken.balanceOf(
        enderBondAddress
      );
      const initialBalanceOfuser1 = await endToken.balanceOf(signer1.address);
      const userAddressBefore = await endToken.balanceOf(signer1.address);
      await endToken.connect(owner).mint(signer3.address, depositAmountEnd);
      await endToken.connect(signer3).approve(enderStakingAddress, depositAmountEnd);
      await sEnd.connect(owner).whitelist(enderStakingAddress, true);
      await sEnd.connect(owner).setStatus(2);
      await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
      let sig3 = signatureDigest2();
      await enderStaking.connect(signer3).stake(depositAmountEnd, [signer3.address, "0", sig3]);
      await increaseTime(90 * 600);
      await stEth.connect(signer1).transfer(instadappLiteAddress, depositPrincipalStEth);
      const sEndAmount = await sEnd.connect(signer3).balanceOf(signer3.address);
      await enderStaking.connect(signer3).unstake(sEndAmount);
      await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
      await stEth.connect(signer1).transfer(instadappLiteAddress, depositPrincipalStEth)
      await withdrawAndSetup(signer1, tokenId);
      console.log("Withdraw");
      await withdrawAndSetup(signer4, tokenId2);


    });

    it("Ender protocol scenario 4:- BondFee is 100% and maturity is 5 days", async () => {
      const maturity = 5;
      const bondFee = 10000;
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

      expect(await enderBond.rewardShareIndex()).to.be.equal(0);
      await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
      console.log("get the stEth--------->>>>>>>", await stEth.connect(signer1).balanceOf(signer1.address));

      await stEth
        .connect(signer1)
        .approve(enderBondAddress, depositPrincipalStEth);
      await enderTreasury.setAddress(instadappLiteAddress, 5);
      await sleep(1200);
      let sig1 = signatureDigest();
      const tokenId = await depositAndSetup(
        signer1,
        depositPrincipalStEth,
        maturity,
        bondFee,
        [signer1.address, "0", sig1]
      );
      await endToken.connect(signer1).transfer(signer2.address, "1000000000000000000")
      await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });
      await stEth
        .connect(signer2)
        .approve(enderBondAddress, depositPrincipalStEth);
      let sig2 = signatureDigest1();
      const tokenId1 = await depositAndSetup(
        signer2,
        depositPrincipalStEth,
        maturity,
        bondFee,
        [signer2.address, "0", sig2]
      );
      increaseTime(6000);
      await endToken.distributeRefractionFees();
      const initialBalanceOfuser = await endToken.balanceOf(signer1.address);
      await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
      await stEth
        .connect(signer1)
        .approve(enderBondAddress, depositPrincipalStEth);
      await enderTreasury.setAddress(instadappLitelidoStaking, 5);
      await enderTreasury.setStrategy([instadappLitelidoStaking], true);
      await enderTreasury.setPriorityStrategy(instadappLitelidoStaking);
      await enderTreasury.depositInStrategy(stEthAddress, instadappLitelidoStaking, "2000000000000000000");
      await increaseTime(20 * 600);
      const tokenId2 = await depositAndSetup(
        signer1,
        depositPrincipalStEth,
        maturity,
        bondFee,
        [signer1.address, "0", sig1]
      );
      await enderTreasury.depositInStrategy(stEthAddress, instadappLitelidoStaking, depositPrincipalStEth);
      console.log("---------------------------------------------------3rd-deposit-----------------------------------");
      expect(await bondNFT.ownerOf(tokenId2)).to.be.equal(
        await bondNFT.ownerOf(tokenId)
      );
      await bondNFT.connect(signer1).transferFrom(signer1.address, signer4.address, tokenId2);

      //increasing the time 1 day
      increaseTime(600);
      const initalBalanceOfEnderBond = await endToken.balanceOf(
        enderBondAddress
      );
      const initialBalanceOfuser1 = await endToken.balanceOf(signer1.address);
      const userAddressBefore = await endToken.balanceOf(signer1.address);
      await endToken.connect(owner).mint(signer3.address, depositAmountEnd);
      await endToken.connect(signer3).approve(enderStakingAddress, depositAmountEnd);
      await sEnd.connect(owner).whitelist(enderStakingAddress, true);
      await sEnd.connect(owner).setStatus(2);
      await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
      let sig3 = signatureDigest2();
      await enderStaking.connect(signer3).stake(depositAmountEnd, [signer3.address, "0", sig3]);
      await increaseTime(90 * 600);
      await stEth.connect(signer1).transfer(instadappLiteAddress, depositPrincipalStEth);
      const sEndAmount = await sEnd.connect(signer3).balanceOf(signer3.address);
      await enderStaking.connect(signer3).unstake(sEndAmount);
      await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
      await stEth.connect(signer1).transfer(instadappLiteAddress, depositPrincipalStEth)
      await withdrawAndSetup(signer1, tokenId);
      console.log("Withdraw");
      await withdrawAndSetup(signer4, tokenId2);
    });

    it("Deposit Revert InvalidAmount()", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      // const depositPrincipalStEth = expandTo18Decimals(1);
      const depositPrincipalStEth = 100000000000000
      await endToken.setFee(20);


      expect(await enderBond.rewardShareIndex()).to.be.equal(0);
      await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
      console.log("get the stEth--------->>>>>>>", await stEth.connect(signer1).balanceOf(signer1.address));

      await stEth
        .connect(signer1)
        .approve(enderBondAddress, depositPrincipalStEth);

      await enderTreasury.setAddress(instadappLiteAddress, 5);
      await sleep(1200);
      let sig1 = signatureDigest();
      await expect(
        enderBond.connect(signer1).deposit(
          signer1.address,
          depositPrincipalStEth,
          maturity,
          bondFee,
          stEthAddress,
          [signer1.address, "0", sig1]
        )
      ).to.be.revertedWithCustomError(enderBond, "InvalidAmount");

    });

    it("Deposit Revert InvalidMaturity() maturity >90", async () => {
      let maturity = 91;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      await endToken.setFee(20);


      expect(await enderBond.rewardShareIndex()).to.be.equal(0);
      await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
      console.log("get the stEth--------->>>>>>>", await stEth.connect(signer1).balanceOf(signer1.address));

      await stEth
        .connect(signer1)
        .approve(enderBondAddress, depositPrincipalStEth);

      await enderTreasury.setAddress(instadappLiteAddress, 5);
      await sleep(1200);
      let sig1 = signatureDigest();
      await expect(
        enderBond.connect(signer1).deposit(
          signer1.address,
          depositPrincipalStEth,
          maturity,
          bondFee,
          stEthAddress,
          [signer.address, "0", sig1]
        )
      ).to.be.revertedWithCustomError(enderBond, "InvalidMaturity");

    });

    it("Deposit Revert NotBondableToken() ", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      await endToken.setFee(20);


      expect(await enderBond.rewardShareIndex()).to.be.equal(0);
      await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
      console.log("get the stEth--------->>>>>>>", await stEth.connect(signer1).balanceOf(signer1.address));

      await stEth
        .connect(signer1)
        .approve(enderBondAddress, depositPrincipalStEth);

      await enderTreasury.setAddress(instadappLiteAddress, 5);
      await sleep(1200);
      let sig1 = signatureDigest();
      await expect(
        enderBond.connect(signer1).deposit(
          signer1.address,
          depositPrincipalStEth,
          maturity,
          bondFee,
          endToken,
          [signer.address, "0", sig1]
        )
      ).to.be.revertedWithCustomError(enderBond, "NotBondableToken");

    });
    it("Should revert if an incorrect asset is passed to epochStakingReward", async function () {
      const otherAsset = ethers.Wallet.createRandom().address; 
  
      await expect(
          enderStaking.epochStakingReward(otherAsset)
      ).to.be.revertedWithCustomError(enderStaking, "NotAllowed");
  });

  it("should return the same amount if rebasingIndex is 0", async function () {
    const endAmount = ethers.parseEther("1"); 
    const expectedSEndTokens = endAmount; 
    expect(await enderStaking.calculateSEndTokens(endAmount)).to.equal(expectedSEndTokens);
  });
//   it("should return the correct hash", async function () {
//     const sig = await signatureDigest2();
//     const signature = [signer3.address, "0", sig];
//     const user = signer1.address; 
//     const key = "example_key";
//     const expectedHash = ethers.utils.solidityKeccak256(
//       ["bytes"],
//       [ethers.utils.defaultAbiCoder.encode(["string", "address", "string"], ["userSign(address,string)", user, key])]
//     );

//     const hash = await signer._hash(user, key);
//     expect(hash).to.equal(expectedHash);
// });

    it("Deposit Revert InvalidAmount by Sending Ether", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      await endToken.setFee(20);


      expect(await enderBond.rewardShareIndex()).to.be.equal(0);
      await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
      console.log("get the stEth--------->>>>>>>", await stEth.connect(signer1).balanceOf(signer1.address));

      await stEth
        .connect(signer1)
        .approve(enderBondAddress, depositPrincipalStEth);

      await enderTreasury.setAddress(instadappLiteAddress, 5);
      await sleep(1200);
      let sig1 = signatureDigest();
      await expect(
        enderBond.connect(signer1).deposit(
          signer1.address,
          depositPrincipalStEth,
          maturity,
          bondFee,
          sEndTokenAddress,
          [signer.address, "0", sig1]
        )
      ).to.be.revertedWithCustomError(enderBond, "NotBondableToken");


    });
 
    
    it("Should set the correct addresses for valid input types", async function () {
      //random addresses to test function
      const newEndTokenAddress = ethers.Wallet.createRandom().address;
      const newEnderBondAddress = ethers.Wallet.createRandom().address;
      const newEnderDepositorAddress = ethers.Wallet.createRandom().address;
      const newInstaDappReceiptTokenAddress = ethers.Wallet.createRandom().address;
      const newLybraFinanceReceiptTokenAddress = ethers.Wallet.createRandom().address;
      const newEigenLayerReceiptTokenAddress= ethers.Wallet.createRandom().address;

      await enderTreasury.connect(owner).setAddress(newEndTokenAddress, 1);
      await enderTreasury.connect(owner).setAddress(newEnderBondAddress, 2);
      await enderTreasury.connect(owner).setAddress(newEnderDepositorAddress, 3);
      await enderTreasury.connect(owner).setAddress(newInstaDappReceiptTokenAddress, 4);
      await enderTreasury.connect(owner).setAddress(newLybraFinanceReceiptTokenAddress, 5);
      await enderTreasury.connect(owner).setAddress(newEigenLayerReceiptTokenAddress, 6);
      expect(await enderTreasury.getAddress(1)).to.equal(newEndTokenAddress);
      expect(await enderTreasury.getAddress(2)).to.equal(newEnderBondAddress);
      expect(await enderTreasury.getAddress(3)).to.equal(newEnderDepositorAddress);
      expect(await enderTreasury.getAddress(4)).to.equal(newInstaDappReceiptTokenAddress);
      expect(await enderTreasury.getAddress(5)).to.equal(newLybraFinanceReceiptTokenAddress);
      expect(await enderTreasury.getAddress(6)).to.equal(newEigenLayerReceiptTokenAddress); 

  });
    it("Should return the correct addresses for valid input types", async function () {
      //addresses of the contracts
      const address1 = await enderTreasury.getAddress(1);
      const address2 = await enderTreasury.getAddress(2);
      const address3 = await enderTreasury.getAddress(3);
      const address4 = await enderTreasury.getAddress(4);
      const address5 = await enderTreasury.getAddress(5);
      const address6 = await enderTreasury.getAddress(6);
      expect(await enderTreasury.getAddress(1)).to.equal(address1);
      expect(await enderTreasury.getAddress(2)).to.equal(address2);
      expect(await enderTreasury.getAddress(3)).to.equal(address3);
      expect(await enderTreasury.getAddress(4)).to.equal(address4);
      expect(await enderTreasury.getAddress(5)).to.equal(address5);
      expect(await enderTreasury.getAddress(6)).to.equal(address6);
  });
  it("Should return ZeroAddress for value 0", async function () {

    expect(await enderTreasury.getAddress(0)).to.revertedWith("ZeroAddress");

});

    it("Ender Bond:- setBondFeeEnabled", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      await enderBond.setBondFeeEnabled(false);
    })
    it("Ender Bond:- setBondFeeEnabled revert with invalid caller", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      await expect(enderBond.connect(signer2).setBondFeeEnabled(false)).to.be.revertedWith("Ownable: caller is not the owner");
    })

    it("Ender Bond:- setDepositEnable", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      await enderBond.setDepositEnable(true);
    })

    it("Ender Bond:- setDepositEnable revert with invalid caller", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      await expect(enderBond.connect(signer2).setDepositEnable(true)).to.be.revertedWith("Ownable: caller is not the owner");
    })

    it("Ender Bond:- setWithdrawPause", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      await enderBond.setWithdrawPause(true);
    })

    it("Ender Bond:- setWithdrawPause revert with invalid caller", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      await expect(enderBond.connect(signer2).setWithdrawPause(true)).to.be.revertedWith("Ownable: caller is not the owner");
    })

    it("Ender Bond:- setBondPause", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      await enderBond.setBondPause(true);
    })
    it("Ender Bond:- setBondPause revert with invalid caller", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      await expect(enderBond.connect(signer2).setBondPause(true)).to.be.rejectedWith("Ownable: caller is not the owner");
    })

    it("Ender Bond:- setWhitelist", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      await enderBond.whitelist(true);
    })
    it("Ender Bond:- setWhitelist revert with invalid caller", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      await expect(enderBond.connect(signer2).whitelist(true)).to.be.rejectedWith("Ownable: caller is not the owner");
    })
    it("Ender Treasury:- setBondYieldBaseRate", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      await enderTreasury.setBondYieldBaseRate(50);
    })
    it("Ender Treasury:- setBondYieldBaseRate revert with invalid caller", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      await expect(enderTreasury.connect(signer2).setBondYieldBaseRate(50)).to.be.rejectedWith("Ownable: caller is not the owner");
    })

    it("Ender Treasury:- setBondYieldBaseRate revert with InvalidBaseRate", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      await expect(enderTreasury.setBondYieldBaseRate(0)).to.be.revertedWithCustomError(enderTreasury, "InvalidBaseRate");
    })

    it("Ender Treasury:- setNominalYield revert with invalid caller", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      await expect(enderTreasury.connect(signer2).setNominalYield(50)).to.be.revertedWith("Ownable: caller is not the owner");
    })
    it("Ender Treasury:- setNominalYield", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      enderTreasury.setNominalYield(50);
    })
    it("Ender Treasury:- setNominalYield revert with invaild owner", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      await expect(enderTreasury.connect(signer2).setNominalYield(50)).to.be.revertedWith("Ownable: caller is not the owner");
    })

    it("Ender staking:- setStakingEnable", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      await enderStaking.setStakingEnable(true);
    })

    it("Should not allow staking when staking is disabled", async function () {
      await enderStaking.setStakingEnable(false);
      const depositAmountEnd = expandTo18Decimals(5);

      let sig = await signatureDigest2();
      await expect(
          enderStaking.connect(signer3).stake(depositAmountEnd, [signer3.address, "0", sig])
      ).to.be.reverted; 

      await enderStaking.setStakingEnable(true);
  });

  it("Should not allow staking when staking contract is paused", async function () {
    const depositAmountEnd = expandTo18Decimals(5);

      await enderStaking.setStakingPause(true);

      let sig = await signatureDigest2();
      await expect(
          enderStaking.connect(signer3).stake(depositAmountEnd, [signer3.address, "0", sig])
      ).to.be.reverted; 

      await enderStaking.setStakingPause(false); 
  });

  it("Should not allow unstaking when staking is disabled", async function () {
    
      await enderStaking.setStakingEnable(false);

      const sEndAmount = expandTo18Decimals(1); 
      await expect(
          enderStaking.connect(signer3).unstake(sEndAmount)
      ).to.be.reverted; 

      await enderStaking.setStakingEnable(true); 
  });

  it("Should not allow unstaking when staking contract is paused", async function () {
      await enderStaking.setStakingPause(true);

      const sEndAmount = expandTo18Decimals(1); 
      await expect(
          enderStaking.connect(signer3).unstake(sEndAmount)
      ).to.be.reverted; 

      await enderStaking.setStakingPause(false);
  });


    it("Ender staking:- setStakingEnable revert with invaild owner", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      await expect(enderStaking.connect(signer2).setStakingEnable(true)).to.be.revertedWith("Ownable: caller is not the owner");
    })

    it("Ender staking:- setUnstakeEnable", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      enderStaking.setUnstakeEnable(true);
    })

    it("Ender staking:- setUnstakeEnable revert with invaild owner", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      await expect(enderStaking.connect(signer2).setUnstakeEnable(true)).to.be.revertedWith("Ownable: caller is not the owner");
    })
    it("Ender staking:- setStakingPause", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      enderStaking.setStakingPause(true);
    })
    it("Ender staking:- setStakingPause revert with invaild owner", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      await expect(enderStaking.connect(signer2).setStakingPause(true)).to.be.revertedWith("Ownable: caller is not the owner");
    })

    it("Ender staking:- setsigner", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      enderStaking.setsigner(signer2.address);
    });

    it("Ender staking:- setsigner revert with invaild owner", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      await expect(enderStaking.connect(signer2).setsigner(signer2.address)).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Ender staking:- setsigner revert with ZeroAddress", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      await expect(enderStaking.setsigner(ethers.ZeroAddress)).to.be.revertedWithCustomError(enderStaking, "ZeroAddress");
    });
    it("Ender staking:- setBondRewardPercentage", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      enderStaking.setBondRewardPercentage(10);
    });

    it("Ender staking:- setBondRewardPercentage revert with invaild owner", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      await expect(enderStaking.connect(signer2).setBondRewardPercentage(10)).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Ender staking:- setBondRewardPercentage revert with InvalidAmount", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
     await expect(enderStaking.setBondRewardPercentage(0)).to.be.revertedWithCustomError(enderStaking, "InvalidAmount");
    });
    it("Ender staking:- setWhitelist", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      enderStaking.whitelist(false);
    });
    it("Ender staking:- setWhitelist revert with invalid caller", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      await expect(enderStaking.connect(signer2).whitelist(false)).to.be.rejectedWith("Ownable: caller is not the owner");
    });


    describe("Ender Staking Functionality", function () {
      let depositAmountEnd;
      let sEndAmountBeforeStake;
      let sEndAmountAfterStake;
      let sEndAmountBeforeUnstake;
      let sEndAmountAfterUnstake;
  
      beforeEach(async function () {
          depositAmountEnd = expandTo18Decimals(5);
          // Setup more initial conditions if necessary
      });
  
      it("Should allow users to stake tokens", async function () {
          await endToken.connect(owner).mint(signer3.address, depositAmountEnd);
          await endToken.connect(signer3).approve(enderStakingAddress, depositAmountEnd);
          sEndAmountBeforeStake = await sEnd.balanceOf(signer3.address);
  
          let sig = await signatureDigest2();
          await enderStaking.connect(signer3).stake(depositAmountEnd, [signer3.address, "0", sig]);
  
          sEndAmountAfterStake = await sEnd.balanceOf(signer3.address);
          expect(sEndAmountAfterStake).to.be.gt(sEndAmountBeforeStake);
      });
      
    
      it("calculates rebasing index correctly", async function () {

        rewardAmount = ethers.parseEther("100"); 

        await endToken.connect(owner).mint(signer3.address, depositAmountEnd);
        await endToken.connect(signer3).approve(enderStakingAddress, depositAmountEnd);
        sEndAmountBeforeStake = await sEnd.balanceOf(signer3.address);

        let sig = await signatureDigest2();
        await enderStaking.connect(signer3).stake(depositAmountEnd, [signer3.address, "0", sig]);

        sEndAmountAfterStake = await sEnd.balanceOf(signer3.address);
        expect(sEndAmountAfterStake).to.be.gt(sEndAmountBeforeStake);
        sEndAmountBeforeStake = await sEnd.balanceOf(signer3.address);
        initialSEndTotalSupply = await sEnd.totalSupply();
        initialRebasingIndex = await enderStaking.rebasingIndex();
  
        await endToken.connect(owner).mint(enderStakingAddress, rewardAmount);
    
        await enderStaking.connect(owner).epochStakingReward(stEthAddress);
    
        finalRebasingIndex = await enderStaking.rebasingIndex();
        finalSEndTotalSupply = await sEnd.totalSupply();
        sEndAmountAfterStake = await sEnd.balanceOf(signer3.address);
    
        // const totalEndInStakingAfterReward = await endToken.balanceOf(enderStakingAddress);
        const expectedRebasingIndexAfterReward = 21000000000000000000n;
        expect(finalRebasingIndex).to.equal(expectedRebasingIndexAfterReward, "Final rebasing index does not match the expected value after reward distribution");
        expect(finalSEndTotalSupply).to.equal(initialSEndTotalSupply, "Total sEND supply should not change after rebasing");
      });
      

      
      it("Should allow users to unstake tokens", async function () {
          await endToken.connect(owner).mint(signer3.address, depositAmountEnd);
          await endToken.connect(signer3).approve(enderStakingAddress, depositAmountEnd);
          let sig = await signatureDigest2();
          await enderStaking.connect(signer3).stake(depositAmountEnd, [signer3.address, "0", sig]);
  
          sEndAmountBeforeUnstake = await sEnd.balanceOf(signer3.address);
            await enderStaking.connect(signer3).unstake(sEndAmountBeforeUnstake);
  
          sEndAmountAfterUnstake = await sEnd.balanceOf(signer3.address);
          expect(sEndAmountAfterUnstake).to.be.lt(sEndAmountBeforeUnstake);
      });
  });

  });



  async function depositAndSetup(signer, depositAmount, maturity, bondFee, [user, key, signature]) {
    await enderBond
      .connect(signer)
      .deposit(signer, depositAmount, maturity, bondFee, stEthAddress, [user, key, signature]);
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


  async function signatureDigestOfEarlyBond() {
    let sig = await owner.signTypedData(
      {
          name: "depositContract",
          version: "1",
          chainId: 31337,
          verifyingContract: enderBondLiquidityDepositAddress,
      },
      {
          userSign: [
              {
                  name: 'user',
                  type: 'address',
              },
              {
                  name: 'key',
                  type: 'string',
              },
          ],
      },
      {
          user: signer1.address,
          key: "0",
      }
  )
  return sig;
};

  async function signatureDigestOfEarlyBond1() {
    let sig = await signer.signTypedData(
      {
        name: "depositContract",
        version: "1",
        chainId: 31337,
        verifyingContract: enderBondLiquidityDepositAddress,
      },
      {
        userSign: [
          {
            name: 'user',
            type: 'address',
          },
          {
            name: 'key',
            type: 'string',
          },
        ],
      },
      {
        user: signer2.address,
        key: "0",
      }
    )
    return sig;
  };

  async function signatureDigest() {
    let sig = await signer.signTypedData(
      {
        name: "bondContract",
        version: "1",
        chainId: 31337,
        verifyingContract: enderBondAddress,
      },
      {
        userSign: [
          {
            name: 'user',
            type: 'address',
          },
          {
            name: 'key',
            type: 'string',
          },
        ],
      },
      {
        user: signer1.address,
        key: "0",
      }
    )
    return sig;
  };

  async function signatureDigest1() {
    let sig = await signer.signTypedData(
      {
        name: "bondContract",
        version: "1",
        chainId: 31337,
        verifyingContract: enderBondAddress,
      },
      {
        userSign: [
          {
            name: 'user',
            type: 'address',
          },
          {
            name: 'key',
            type: 'string',
          },
        ],
      },
      {
        user: signer2.address,
        key: "0",
      }
    )
    return sig;
  };

  async function signatureDigest2() {
    let sig = await signer.signTypedData(
      {
        name: "stakingContract",
        version: "1",
        chainId: 31337,
        verifyingContract: enderStakingAddress,
      },
      {
        userSign: [
          {
            name: 'user',
            type: 'address',
          },
          {
            name: 'key',
            type: 'string',
          },
        ],
      },
      {
        user: signer3.address,
        key: "0",
      }
    )
    return sig;
  };

  async function increaseTime(seconds) {
    await ethers.provider.send("evm_increaseTime", [seconds]);
    await ethers.provider.send("evm_mine");
  }
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
});


