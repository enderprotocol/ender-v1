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

describe("Initialization", function () {
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

    it("should fail on second initialization attempt", async function () {            
      await expect(enderStaking.initialize(endTokenAddress, sEndTokenAddress, stEthAddress, signer.address))
        .to.be.revertedWith("Initializable: contract is already initialized"); 
  });

  });

    describe("Ender Staking Functionality", function () {
      let depositAmountEnd;
      let sEndAmountBeforeStake;
      let sEndAmountAfterStake;
      let sEndAmountBeforeUnstake;
      let sEndAmountAfterUnstake;
  
      beforeEach(async function () {
          depositAmountEnd = expandTo18Decimals(5);
      });

      it("Should allow users to stake tokens", async function () {
      enderStaking.setStakingPause(true);
          await endToken.connect(owner).mint(signer3.address, depositAmountEnd);
          await endToken.connect(signer3).approve(enderStakingAddress, depositAmountEnd);
          sEndAmountBeforeStake = await sEnd.balanceOf(signer3.address);
  
          let sig = await signatureDigest2();
          await enderStaking.connect(signer3).stake(depositAmountEnd, [signer3.address, "0", sig]);
  
          sEndAmountAfterStake = await sEnd.balanceOf(signer3.address);
          expect(sEndAmountAfterStake).to.be.gt(sEndAmountBeforeStake);
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
  
  
      it("Ender staking:- setStakingEnable", async () => {
        let maturity = 90;
        let bondFee = 1;
        const depositAmountEnd = expandTo18Decimals(5);
        const depositPrincipalStEth = expandTo18Decimals(1);
        await enderStaking.setStakingEnable(true);
      })
  it ("Should revert if non owner tries to set address", async function (){
    await expect(
      sEnd.connect(signer3).setAddress(enderStakingAddress, 1)
  ).to.be.reverted; 

  });
  it("unstake is reverted with not allowed staking contract paused", async () => {
    let stakingContractPause = await enderStaking.stakingContractPause();
    expect(stakingContractPause).to.equal(true);

    await enderStaking.setStakingPause(false);
    stakingContractPause = await enderStaking.stakingContractPause();
    expect(stakingContractPause).to.equal(false);

    await expect(enderStaking.unstake(10)).to.be.revertedWithCustomError(enderStaking, "NotAllowed");

    await enderStaking.setStakingPause(true);
    stakingContractPause = await enderStaking.stakingContractPause();
    expect(stakingContractPause).to.equal(true);
});
it("should revert when unstaking with InvalidAmount", async () => {
  await expect(enderStaking.unstake(0)).to.be.revertedWithCustomError(enderStaking, "InvalidAmount");
});

  it("should fail to initialize again", async function () {            
    await expect(enderStaking.initialize(endTokenAddress, sEndTokenAddress, stEthAddress, signer.address))
      .to.be.revertedWith("Initializable: contract is already initialized"); 
});
  it("Should revert when stakingContractPause is false and stakingContractPaused modifier is invoked", async function () {
    await enderStaking.connect(owner).setStakingPause(false);
    
    let sig = await signatureDigest2();
    await expect(enderStaking.connect(signer3).stake(depositAmountEnd, {
        user: signer3.address,
        key: "0",
        signature: sig
    })).to.be.reverted;
});
it("Should revert if called by a non-owner", async function () {
  // Attempt to call `setAddress` from a non-owner account
  await expect(enderStaking.connect(signer1).setAddress(enderStakingAddress, 1))
      .to.be.revertedWith("Ownable: caller is not the owner");
});

it("Should revert if attempting to set a zero address", async function () {
  zero ="0x0000000000000000000000000000000000000000";
  // Attempt to call `setAddress` with address(0)
  await expect(enderStaking.connect(owner).setAddress(zero, 1))
      .to.be.revertedWithCustomError(enderStaking, "ZeroAddress");
});
      it("Should not allow staking when staking is disabled", async function () {
        await enderStaking.setStakingEnable(false);
        const depositAmountEnd = expandTo18Decimals(5);
  
        let sig = await signatureDigest2();
        await expect(
            enderStaking.connect(signer3).stake(depositAmountEnd, [signer3.address, "0", sig])
        ).to.be.reverted; 
  
        await enderStaking.setStakingEnable(true);
    });
    it("Should not allow staking when amount is 0", async function () {
      await enderStaking.setStakingEnable(true);
      const depositAmountEnd = expandTo18Decimals(0);

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
    it("Should not allow unstaking when value is zero", async function () {
      
      await enderStaking.setStakingEnable(true);

      const sEndAmount = expandTo18Decimals(0); 
      await expect(
          enderStaking.connect(signer3).unstake(sEndAmount)
      ).to.be.reverted; 

      await enderStaking.setStakingEnable(true); 
  });
    it("Should not allow unstaking when unstaking is disabled", async function () {
      
      await enderStaking.setUnstakeEnable(false);

      const sEndAmount = expandTo18Decimals(1); 
      await expect(
          enderStaking.connect(signer3).unstake(sEndAmount)
      ).to.be.reverted; 

      await enderStaking.setUnstakeEnable(true); 
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

    it("Should fail to stake for non-whitelisted user", async function () {
      
        await endToken.connect(owner).mint(signer4.address, depositAmountEnd);
        await endToken.connect(signer4).approve(enderStakingAddress, depositAmountEnd);
        
        let sigForNonWhitelistedUser = await signatureDigest2(); 
        await expect(
            enderStaking.connect(signer4).stake(depositAmountEnd, [signer4.address, "0", sigForNonWhitelistedUser])
        );
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
    
        const expectedRebasingIndexAfterReward = 21000000000000000000n;
        expect(finalRebasingIndex).to.equal(expectedRebasingIndexAfterReward, "Final rebasing index does not match the expected value after reward distribution");
        expect(finalSEndTotalSupply).to.equal(initialSEndTotalSupply, "Total sEND supply should not change after rebasing");
      });
      it("sets rebasing index to 1e18 if sEndTotalSupply is 0", async function () {
        const sEndTotalSupplyBefore = await sEnd.totalSupply();
        expect(sEndTotalSupplyBefore).to.equal(0, "sEnd total supply should initially be 0 for this test");
    
        const rewardAmount = ethers.parseEther("100");
        await endToken.connect(owner).mint(enderStakingAddress, rewardAmount);
        await enderStaking.connect(owner).epochStakingReward(stEthAddress); 
    
        const rebasingIndex = await enderStaking.rebasingIndex();
        expect(rebasingIndex).to.equal(ethers.parseEther("1"), "rebasingIndex should be set to 1e18 when sEndTotalSupply is 0");
    });
        
      it("Should allow users to unstake tokens", async function () {
        await enderStaking.setUnstakeEnable(true);
        await enderStaking.setStakingEnable(true); 

          await endToken.connect(owner).mint(signer3.address, depositAmountEnd);
          await endToken.connect(signer3).approve(enderStakingAddress, depositAmountEnd);
          let sig = await signatureDigest2();
          await enderStaking.connect(signer3).stake(depositAmountEnd, [signer3.address, "0", sig]);
  
          sEndAmountBeforeUnstake = await sEnd.balanceOf(signer3.address);
            await enderStaking.connect(signer3).unstake(sEndAmountBeforeUnstake);
  
          sEndAmountAfterUnstake = await sEnd.balanceOf(signer3.address);
          expect(sEndAmountAfterUnstake).to.be.lt(sEndAmountBeforeUnstake);
      });
      it("Should allow users to stake tokens with a valid signature", async function () {
        await endToken.connect(owner).mint(signer3.address, depositAmountEnd);
        await endToken.connect(signer3).approve(enderStakingAddress, depositAmountEnd);
        
        let validSig = await signatureDigest2();
    
        await expect(
          enderStaking.connect(signer3).stake(depositAmountEnd, [signer3.address, "0", validSig])
        ).to.not.be.reverted; 
    });
    
    it("Should fail to stake with an invalid signature", async function () {
      await endToken.connect(owner).mint(signer3.address, depositAmountEnd);
      await endToken.connect(signer3).approve(enderStakingAddress, depositAmountEnd);
      await enderStaking.whitelist(true);
      
      let invalidSignature = await signer.signTypedData(
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
          user: signer.address,
          key: "0",
        }
      );
  
      await expect(enderStaking.connect(signer3).stake(depositAmountEnd, {
        user: signer3.address,
        key: "0",
        signature: invalidSignature
      })).to.be.reverted;
  });
  it("Should revert when userSign.user does not match msg.sender", async function () {
    await enderStaking.whitelist(true);

    await endToken.connect(owner).mint(signer1.address, depositAmountEnd);
    await endToken.connect(signer1).approve(enderStakingAddress, depositAmountEnd);

    let validSignature = await signatureDigest1();
    
    await expect(enderStaking.connect(signer3).stake(depositAmountEnd, {
      user: signer1.address,
      key: "0",
      signature: validSignature
    })).to.be.reverted;
});
it("Should revert when userSign.user does not match msg.sender", async function () {
  // Enable whitelisting to enforce signature verification
  await enderStaking.connect(owner).whitelist(true);

  // Mint and approve tokens for signer3
  await endToken.connect(owner).mint(signer3.address, depositAmountEnd);
  await endToken.connect(signer3).approve(enderStakingAddress, depositAmountEnd);

  // Create a valid signature with signer3's data
  let validSignature = await signatureDigest2();

  // Attempt to stake using signer1, but with signer3's signature
  await expect(
    enderStaking.connect(signer1).stake(depositAmountEnd, {
      user: signer3.address,
      key: "0",
      signature: validSignature
    })
  ).to.be.reverted;
});


    it("Should fail to stake tokens with an invalid signature", async function () {
      await endToken.connect(owner).mint(signer3.address, depositAmountEnd);
      await endToken.connect(signer3).approve(enderStakingAddress, depositAmountEnd);
    
      let invalidSig = await signatureDigestOfEarlyBond1(); 
    
      await expect(
        enderStaking.connect(signer3).stake(depositAmountEnd, [signer3.address, "0", invalidSig])
      );
    });
    
  });


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


