const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { BigNumber, ZeroAddress } = require("ethers");


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

describe("Treasury", function () {
  let owner, signer, signer1, signer2, signer3, signer4;
  let endTokenAddress,
    enderBondAddress,
    enderBondLiquidityDepositAddress,
    enderTreasuryAddress,
    enderStakingAddress,
    mockWETHAddress,
    instadappLiteAddress,
    eigenLayer,
    lybraFinance;

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


  this.beforeEach(async function () {
    const wETH = await ethers.getContractFactory("mockWETH");
    const StEth = await ethers.getContractFactory("StETH");
    const InstadappLite = await ethers.getContractFactory("StinstaToken");
    const eigenLayer=  await ethers.getContractFactory("StETH");
    const lybraFinance =  await ethers.getContractFactory("StETH");
    const EndToken = await ethers.getContractFactory("EndToken");
    const EnderBondLiquidityBond = await ethers.getContractFactory("EnderBondLiquidityDeposit");
    const EnderBond = await ethers.getContractFactory("EnderBond");
    const EnderTreasury = await ethers.getContractFactory("EnderTreasury");
    const EnderStaking = await ethers.getContractFactory("EnderStaking");
    const SEnd = await ethers.getContractFactory("SEndToken");

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

    sig= await signatureDigest();
    sig_1 = await signatureDigest1();
    sig_2 = await signatureDigest2();
  });

  describe("Ender Treasury", async () => {
  
 
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

    it ("should fail to initialize again", async function(){
      await expect(enderTreasury.initializeTreasury(        
        endTokenAddress,
        enderStakingAddress,
        enderBondAddress,
        instadappLiteAddress,
        ethers.ZeroAddress,
        ethers.ZeroAddress,
        70,
        30)).to.be.revertedWith("Initializable: contract is already initialized"); 
    })
    it("Should revert when called by wrong address", async function () {

        const amount = ethers.parseEther("1");

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

        await expect(enderTreasury.connect(wallet1).withdrawFromStrategy(stEthAddress, wrongStrategyAddress, amount))
          .to.be.revertedWithCustomError(enderTreasury, "NotAllowed");
  
      });
    it("Should revert when called by non-owner", async function () {
        await expect(enderTreasury.connect(wallet1).withdrawBondFee(stEthAddress, ethers.parseEther("1.0")))
          .to.be.revertedWith("Ownable: caller is not the owner");
      });
  
  
//use .only to test this

//     it("Should return the correct addresses for valid input types", async function () {
//            const newEnderDepositorAddress = "0x0B306BF915C4d645ff596e518fAf3F9669b97016";
//            await enderTreasury.setAddress(instadappLiteAddress, 5);

//      await enderTreasury.connect(owner).setAddress(newEnderDepositorAddress, 1);
//      await enderTreasury.connect(owner).setAddress(newEnderDepositorAddress, 2);
//      await enderTreasury.connect(owner).setAddress(newEnderDepositorAddress, 3);
//      await enderTreasury.connect(owner).setAddress(newEnderDepositorAddress, 4);
//      await enderTreasury.connect(owner).setAddress(newEnderDepositorAddress, 5);
//      await enderTreasury.connect(owner).setAddress(newEnderDepositorAddress, 6);

//       expect(await enderTreasury.getAddress(1)).to.equal(newEnderDepositorAddress);
//       expect(await enderTreasury.getAddress(2)).to.equal(newEnderDepositorAddress);
//       expect(await enderTreasury.getAddress(3)).to.equal(newEnderDepositorAddress);
//       expect(await enderTreasury.getAddress(4)).to.equal(newEnderDepositorAddress);
//       expect(await enderTreasury.getAddress(5)).to.equal(instadappLiteAddress);
//       expect(await enderTreasury.getAddress(6)).to.equal(newEnderDepositorAddress);
//   });
  it("Should return ZeroAddress for value 0", async function () {

    expect(await enderTreasury.getAddress(0)).to.be.revertedWith("ZeroAddress");

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
  it("Invalid deposit in strategy zero address", async function () {
    const asset = stEthAddress;
    const strategy = ZeroAddress;
    const amount = ethers.parseEther("2");

    const invalidAmount = ethers.parseEther("0");

    expect(await enderTreasury.strategies(instadappLiteAddress)).to.equal(true);

    const invalidAsset = ethers.ZeroAddress;
    await expect(enderTreasury.connect(owner).depositInStrategy(invalidAsset, strategy, amount))
      .to.be.revertedWithCustomError(enderTreasury, "ZeroAddress");
  });


    it("setBondYieldBaseRate", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      await enderTreasury.setBondYieldBaseRate(50);
    })
    it("setBondYieldBaseRate revert with invalid caller", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      await expect(enderTreasury.connect(signer2).setBondYieldBaseRate(50)).to.be.rejectedWith("Ownable: caller is not the owner");
    })

    it("setBondYieldBaseRate revert with InvalidBaseRate", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      await expect(enderTreasury.setBondYieldBaseRate(0)).to.be.revertedWithCustomError(enderTreasury, "InvalidBaseRate");
    })

    it("setNominalYield revert with invalid caller", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      await expect(enderTreasury.connect(signer2).setNominalYield(50)).to.be.revertedWith("Ownable: caller is not the owner");
    })
    it("setNominalYield", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      enderTreasury.setNominalYield(50);
    })
    it("etNominalYield revert with invaild owner", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      await expect(enderTreasury.connect(signer2).setNominalYield(50)).to.be.revertedWith("Ownable: caller is not the owner");
    })  
    it("withdraw bond fee", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
      const depositPrincipalStEth = expandTo18Decimals(1);
      await endToken.setFee(20);


      expect(await enderBond.rewardShareIndex()).to.be.equal(0);
      await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });

      await stEth
        .connect(owner)
        .approve(enderBondAddress, depositPrincipalStEth);

      await enderTreasury.setAddress(instadappLiteAddress, 5);
      await sleep(1200);
      let sig1 = signatureDigest();
      await expect(
        enderBond.connect(owner).deposit(
          signer1.address,
          depositPrincipalStEth,
          maturity,
          bondFee,
          stEthAddress,
          [signer.address, "0", sig1]
        )
      );
      await expect(enderTreasury.connect(owner).withdrawBondFee(stEthAddress, 1));

    });
    describe("withdrawBondFee functionality", function () {

    });
    
    it("Deposit Revert InvalidAmount()", async () => {
      let maturity = 90;
      let bondFee = 1;
      const depositAmountEnd = expandTo18Decimals(5);
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


