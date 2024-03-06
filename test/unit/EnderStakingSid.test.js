const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { BigNumber } = require("ethers");

const { EigenLayerStrategyManagerAddress } = require("../utils/common");
const exp = require("constants");
const { sign } = require("crypto");
const { log } = require("console");

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
describe("Staking Functionality", function () {
  let endToken, enderStaking, signer1, signer3;

  before(async function () {
    [owner, signer1, signer2, signer3, signer4] = await ethers.getSigners();

    const EndToken = await ethers.getContractFactory("EndToken");
    const EnderStaking = await ethers.getContractFactory("EnderStaking");

    endToken = await EndToken.deploy();
    await endToken.deployed();

    enderStaking = await EnderStaking.deploy(endToken.address, signer1.address );
    await enderStaking.deployed();
  });



  async function signatureDigest2(signer) {
    return signer.signMessage("Dummy signature data for testing");
  }
});
describe("Initialise", function () {

  //INITIALIZATION 

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


  before(async function () {
    const wETH = await ethers.getContractFactory("mockWETH");
    const StEth = await ethers.getContractFactory("StETH");
    const InstadappLite = await ethers.getContractFactory("StinstaToken");
    const EndToken = await ethers.getContractFactory("EndToken");
    const EnderBondLiquidityBond = await ethers.getContractFactory("EnderBondLiquidityDeposit");
    const EnderBond = await ethers.getContractFactory("EnderBond");
    const EnderTreasury = await ethers.getContractFactory("EnderTreasury");
    const EnderStaking = await ethers.getContractFactory("EnderStaking");
    const SEnd = await ethers.getContractFactory("SEndToken");

    [owner, signer, wallet1, signer1, signer2, signer3, signer4] = await ethers.getSigners();

    stEth = await StEth.deploy();
    stEthAddress = await stEth.getAddress();

    sEnd = await upgrades.deployProxy(SEnd, [], {
      initializer: "initialize",
    });
    sEndTokenAddress = await sEnd.connect(owner).getAddress();

    enderBondLiquidityDeposit = await upgrades.deployProxy(
      EnderBondLiquidityBond,
      [stEthAddress, stEthAddress, signer.address, owner.address],
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
  });

  describe("Stake", async () => {

    it("should successfully stake and update balances", async () => {
      const maturity = 90;
      const bondFee = 500;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);

      const endTransfer = expandTo18Decimals(1);
      await endToken.setFee(20);

      await endToken.connect(owner).mint(signer1.address, depositAmountEnd);

      await endToken.connect(signer1).transfer(signer2.address, endTransfer);

      await endToken.connect(signer1).transfer(signer2.address, endTransfer);

      expect(await endToken.balanceOf(enderBondAddress)).to.be.equal(0);



      expect(await enderBond.rewardShareIndex()).to.be.equal(0);

      await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });

      await stEth
        .connect(signer1)
        .approve(enderBondAddress, depositPrincipalStEth);

      await enderTreasury.setAddress(instadappLiteAddress, 5);

      await sleep(1200);
      console.log("Here");
      const tokenId = await depositAndSetup(
        signer1,
        depositPrincipalStEth,
        maturity,
        bondFee
        );
        
      await endToken.connect(signer1).transfer(signer2.address, "1000000000000000000")
 
      await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });

      await stEth
        .connect(signer2)
        .approve(enderBondAddress, depositPrincipalStEth);


      const tokenId1 = await depositAndSetup(
        signer2,
        depositPrincipalStEth,
        maturity,
        bondFee
      );
      increaseTime(6000);


      expect(await enderBond.bondYieldShareIndex()).to.be.greaterThan(
        await enderBond.userBondYieldShareIndex(tokenId)
      );

      await endToken.distributeRefractionFees();



      const initialBalanceOfuser = await endToken.balanceOf(signer1.address);

      expect(await endToken.balanceOf(signer1.address)).to.be.greaterThan(
        initialBalanceOfuser
      );

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
        maturity * 2,
        bondFee
      );
      await enderTreasury.depositInStrategy(stEthAddress, instadappLitelidoStaking, depositPrincipalStEth);

      expect(await enderBond.bondYieldShareIndex()).to.be.greaterThan(
        await enderBond.userBondYieldShareIndex(tokenId2)
      );

      expect(await bondNFT.ownerOf(tokenId2)).to.be.equal(
        await bondNFT.ownerOf(tokenId)
      );


      increaseTime(600);




      await endToken.connect(owner).mint(signer3.address, depositAmountEnd);
      await endToken.connect(signer3).approve(enderStakingAddress, depositAmountEnd);
      await sEnd.connect(owner).whitelist(enderStakingAddress, true);
      await sEnd.connect(owner).setStatus(2);


      await enderStaking.connect(signer3).stake(depositAmountEnd);

      await increaseTime(180 * 600);
      const sEndAmount = await sEnd.connect(signer3).balanceOf(signer3.address);

      await enderStaking.connect(signer3).withdraw(sEndAmount);

      expect(await stEth.balanceOf(signer1.address)).to.be.equal(
        expandTo18Decimals(1.9)
      );
    });
    it("Stake and Unstake", async () => {
      const maturity = 90;
      const bondFee = 500;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);

      const endTransfer = expandTo18Decimals(1);
      await endToken.setFee(20);

      await endToken.connect(owner).mint(signer1.address, depositAmountEnd);

      await endToken.connect(signer1).transfer(signer2.address, endTransfer);

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

      expect(await enderBond.bondYieldShareIndex()).to.be.greaterThan(
        await enderBond.userBondYieldShareIndex(tokenId)
      );

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
        maturity * 2,
        bondFee,
        [signer1.address, "0", sig1]
      );
      await enderTreasury.depositInStrategy(stEthAddress, instadappLitelidoStaking, depositPrincipalStEth);

      expect(await enderBond.bondYieldShareIndex()).to.be.greaterThan(
        await enderBond.userBondYieldShareIndex(tokenId2)
      );

      expect(await bondNFT.ownerOf(tokenId2)).to.be.equal(
        await bondNFT.ownerOf(tokenId)
      );
      await bondNFT.connect(signer1).transferFrom(signer1.address, signer4.address, tokenId2);

      increaseTime(600);


      await endToken.connect(owner).mint(signer3.address, depositAmountEnd);
      await endToken.connect(signer3).approve(enderStakingAddress, depositAmountEnd);
      await sEnd.connect(owner).whitelist(enderStakingAddress, true);
      await sEnd.connect(owner).setStatus(2);
      await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
      let sig3 = signatureDigest2();
      await enderStaking.connect(signer3).stake(depositAmountEnd, [signer3.address, "0", sig3]);

      await increaseTime(180 * 600);
      const sEndAmount = await sEnd.connect(signer3).balanceOf(signer3.address);

      await enderStaking.connect(signer3).unstake(sEndAmount);

      await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
      await stEth.connect(signer1).transfer(instadappLiteAddress, depositPrincipalStEth)


    });

  it("rejects setting zero address for critical contract addresses", async function() {
    const zeroAddress = "0x0000000000000000000000000000000000000000";

    await expect(enderStaking.setAddress(zeroAddress, 1))
        .to.be.revertedWith("ZeroAddress");

    await expect(enderStaking.setAddress(zeroAddress, 2))
        .to.be.revertedWith("ZeroAddress");

    await expect(enderStaking.setAddress(zeroAddress, 3))
        .to.be.revertedWith("ZeroAddress");
});

it("checks whitelisting functionality", async function() {
  const stakeAmount = ethers.utils.parseUnits("100", 18);

  await endToken.connect(owner).mint(signer1.address, stakeAmount);
  await endToken.connect(signer1).approve(enderStaking.address, stakeAmount);

  await enderStaking.connect(owner).whitelist(false);

  await expect(enderStaking.connect(signer1).stake(stakeAmount, signData))
      .to.be.revertedWith("NotWhitelisted");

  await enderStaking.connect(owner).whitelist(true);

  await expect(enderStaking.connect(signer1).stake(stakeAmount, signData))
      .to.emit(enderStaking, 'Stake')
      .withArgs(signer1.address, stakeAmount);
});

it("prevents staking and unstaking when paused", async function() {

  await enderStaking.connect(owner).setStakingPause(true);
  await enderStaking.connect(owner).setStakingEnable(false);
  await enderStaking.connect(owner).setUnstakeEnable(false);

  await expect(enderStaking.connect(signer1).stake(stakeAmount, signData))
      .to.be.revertedWith("NotAllowed");

  await expect(enderStaking.connect(signer1).unstake(stakeAmount))
      .to.be.revertedWith("NotAllowed");

  await enderStaking.connect(owner).setStakingPause(false);
  await enderStaking.connect(owner).setStakingEnable(true);
  await enderStaking.connect(owner).setUnstakeEnable(true);
});

it("allows only the owner to set contract addresses and rejects zero address", async function() {
  const newAddress = signer2.address;
  const addressType = 1; 

  await expect(enderStaking.connect(owner).setAddress(ethers.constants.AddressZero, addressType))
    .to.be.reverted("ZeroAddress");

  await expect(enderStaking.connect(owner).setAddress(newAddress, addressType))
    .to.emit(enderStaking, "AddressUpdated")
    .withArgs(newAddress, addressType);
});


it("updates the rebasing index correctly", async function () {
  const stakeAmount = ethers.parseUnits("1000", 18);
  await endToken.mint(signer1.address, stakeAmount);

  await endToken.connect(signer1).approve(enderStaking.address, stakeAmount);

  const expectedSEndTokens = stakeAmount;

  await enderStaking.connect(signer1).stake(stakeAmount, { user: signer1.address, key: "uniqueKey", signature });

  const expectedRebasingIndex = ethers.parseUnits("1", 18); 

  const rebasingIndex = await enderStaking.rebasingIndex();

  expect(rebasingIndex).to.equal(expectedRebasingIndex, "The rebasing index was not updated correctly after staking");
});



  it("withdraw rewards", async function () {
    const stakeAmount = ethers.parseUnits("100", 18); 

    await endToken.connect(owner).mint(signer1.address, stakeAmount);
    await endToken.connect(signer1).approve(enderStaking.address, stakeAmount);
    

    const message = {
        user: signer1.address,
        key: "uniqueKey" 
    };
    const signature = await signer._signTypedData({
        domain: {
            name: "stakingContract",
            version: "1",
            chainId: await signer.getChainId(),
            verifyingContract: enderStaking.address
        },
        types: {
            signData: [
                {name: "user", type: "address"},
                {name: "key", type: "string"}
            ]
        },
        message: message
    });

    await enderStaking.connect(signer1).stake(stakeAmount, { user: signer1.address, key: "uniqueKey", signature });

    const sEndBalance = await sEndToken.balanceOf(signer1.address);
    expect(sEndBalance).to.be.gte(stakeAmount, "Insufficient sEnd balance to unstake");

    const endTokenInitialBalance = await endToken.balanceOf(signer1.address);

    await enderStaking.connect(signer1).unstake(sEndBalance);

    const endTokenFinalBalance = await endToken.balanceOf(signer1.address);

    expect(endTokenFinalBalance).to.be.gt(endTokenInitialBalance, "endToken balance did not increase as expected after unstaking");

    await expect(enderStaking.connect(signer1).unstake(sEndBalance))
        .to.emit(enderStaking, 'Unstake')
        .withArgs(signer1.address, sEndBalance);

});

//Working test cases, remove "only" to adjust the rest, "complete ender staking provides scenario, add only to it to run it as well"


it.only("allows only the owner to enable staking", async function() {
  const newStakingStatus = true;

  await expect(enderStaking.connect(signer2).setStakingEnable(newStakingStatus))
    .to.be.revertedWith("Ownable: caller is not the owner");

  await expect(enderStaking.connect(owner).setStakingEnable(newStakingStatus))
    .to.emit(enderStaking, "stakingEnableSet")
    .withArgs(newStakingStatus);
});
it.only("allows only the owner to enable unstaking", async function() {
  const newUnstakeStatus = true;

  await expect(enderStaking.connect(signer2).setUnstakeEnable(newUnstakeStatus))
    .to.be.revertedWith("Ownable: caller is not the owner");

  await expect(enderStaking.connect(owner).setUnstakeEnable(newUnstakeStatus))
    .to.emit(enderStaking, "unstakeEnableSet")
    .withArgs(newUnstakeStatus);
});
it("rejects staking of zero amount", async function() {
  const depositAmountEnd = expandTo18Decimals(0);

  await endToken.connect(owner).mint(signer3.address, depositAmountEnd);
  await endToken.connect(signer3).approve(enderStakingAddress, depositAmountEnd);

  await sEnd.connect(owner).whitelist(enderStakingAddress, true);
  await sEnd.connect(owner).setStatus(2);

  let sig3 = await signatureDigest2(signer3);

  await enderStaking.connect(signer3).stake(depositAmountEnd, [signer3.address, "0", sig3]).to.be.reverted;

});

it.only("Can stake", async () => {
  const depositAmountEnd = expandTo18Decimals(5);

  await endToken.connect(owner).mint(signer3.address, depositAmountEnd);
  await endToken.connect(signer3).approve(enderStakingAddress, depositAmountEnd);

  await sEnd.connect(owner).whitelist(enderStakingAddress, true);
  await sEnd.connect(owner).setStatus(2);

  let sig3 = await signatureDigest2(signer3);

  await enderStaking.connect(signer3).stake(depositAmountEnd, [signer3.address, "0", sig3]);

  await increaseTime(90 * 600);

  const sEndAmount = await sEnd.connect(signer3).balanceOf(signer3.address);


});

it("Can stake and checks rebasing index", async () => {
  const depositAmountEnd = expandTo18Decimals(5);

  await endToken.connect(owner).mint(signer3.address, depositAmountEnd);
  await endToken.connect(signer3).approve(enderStaking.address, depositAmountEnd);

  await sEnd.connect(owner).whitelist(enderStaking.address, true);
  await sEnd.connect(owner).setStatus(2); 

  let sig3 = await signatureDigest2(signer3);

  await enderStaking.connect(signer3).stake(depositAmountEnd, [signer3.address, "0", sig3]);

  await increaseTime(90 * 600);

  const totalStakedEndTokens = expandTo18Decimals(10);
  const totalSEndTokenSupply = expandTo18Decimals(10); 

  const expectedRebasingIndex = totalStakedEndTokens.mul(expandTo18Decimals(1)).div(totalSEndTokenSupply);
  const contractRebasingIndex = await enderStaking.rebasingIndex();

  expect(contractRebasingIndex).to.equal(expectedRebasingIndex);
});

it.only("Can unstake", async () => {
  const depositAmountEnd = expandTo18Decimals(5);

  await endToken.connect(owner).mint(signer3.address, depositAmountEnd);
  await endToken.connect(signer3).approve(enderStakingAddress, depositAmountEnd);

  await sEnd.connect(owner).whitelist(enderStakingAddress, true);
  await sEnd.connect(owner).setStatus(2);

  let sig3 = await signatureDigest2(signer3);

  await enderStaking.connect(signer3).stake(depositAmountEnd, [signer3.address, "0", sig3]);

  await increaseTime(90 * 600);

  const sEndAmount = await sEnd.connect(signer3).balanceOf(signer3.address);
  await enderStaking.connect(signer3).unstake(sEndAmount);

});


    it("Complete Ender Staking", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);

      const endTransfer = expandTo18Decimals(1);
      await endToken.setFee(20);

      await endToken.connect(owner).mint(signer1.address, depositAmountEnd);

      await endToken.connect(signer1).transfer(signer2.address, endTransfer);

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

      bondFee = 10000
      maturity = 5

        
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

      bondFee = 5000
      maturity = 50

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
      const sEndAmount = await sEnd.connect(signer3).balanceOf(signer3.address);
      await enderStaking.connect(signer3).unstake(sEndAmount);

      
      await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });

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
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
});