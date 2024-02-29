const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { BigNumber } = require("ethers");

const { EigenLayerStrategyManagerAddress } = require("../utils/common");
const exp = require("constants");
const { sign } = require("crypto");
const { log } = require("console");

const baseURI = "https://endworld-backend-git-dev-metagaming.vercel.app/nft/metadata/";
const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
const ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";

function expandTo18Decimals(n) {
  return ethers.parseUnits(n.toString(), 18);
}

describe("Ender Bond deposit and withdraw", async() => {

    let 
    owner, 
    signer,
    wallet,
    signer1, 
    signer2, 
    signer3, 
    signer4,

    stEthAddress,
    enderBondAddress,
    enderBondLiquidityDepositAddress,
    endTokenAddress,
    sEndTokenAddress,
    enderTreasuryAddress,
    bondNFTAddress,
    instadappLiteAddress,
    enderStakingAddress,

    stEth,
    enderBond,
    enderBondLiquidityDeposit,
    endToken,
    sEndToken,
    enderTreasury,
    bondNFT,
    instadappLitelidoStaking,
    enderStaking,
    
    signature1, 
    signature2,
    signature3,

    tokenId1,
    tokenId2,
    tokenId3;

    before(async function () {
        const stEthFactory = await ethers.getContractFactory("StETH");
        const instadappLiteFactory = await ethers.getContractFactory("StinstaToken");
        const endTokenFactory = await ethers.getContractFactory("EndToken");
        const enderBondLiquidityBondFactory = await ethers.getContractFactory("EnderBondLiquidityDeposit");
        const enderBondFactory = await ethers.getContractFactory("EnderBond");
        const enderTreasuryFactory = await ethers.getContractFactory("EnderTreasury");
        const enderStakingFactory = await ethers.getContractFactory("EnderStaking");
        const sEndTokenFactory = await ethers.getContractFactory("SEndToken");
        const bondNftFactory = await ethers.getContractFactory("BondNFT");
    
        //Owner and signers addresses
        [owner, signer, wallet, signer1, signer2, signer3, signer4] = await ethers.getSigners();
    
        //delpoy stEth
        stEth = await stEthFactory.deploy();
        stEthAddress = await stEth.getAddress();
    
        //deploy sEnd
        sEndToken = await upgrades.deployProxy(sEndTokenFactory, [], {
          initializer: "initialize",
        });
        sEndTokenAddress = await sEndToken.connect(owner).getAddress();
    
        //deploy enderBondLiquidityDeposit
        enderBondLiquidityDeposit = await upgrades.deployProxy(
          enderBondLiquidityBondFactory,
          [stEthAddress, stEthAddress, owner.address, owner.address],
          {
            initializer: "initialize",
          }
        );
        enderBondLiquidityDepositAddress = await enderBondLiquidityDeposit.getAddress();
    
        //deploy insta app Lido Staking
        instadappLitelidoStaking = await instadappLiteFactory.deploy("InstaToken", "Inst", owner.address, stEthAddress);
        instadappLiteAddress = await instadappLitelidoStaking.getAddress();

        //deploy endToken
        endToken = await upgrades.deployProxy(endTokenFactory, [], {
          initializer: "initialize",
        });
        endTokenAddress = await endToken.getAddress();
    
        //deploy enderBond
        enderBond = await upgrades.deployProxy(
          enderBondFactory,
          [endTokenAddress, ethers.ZeroAddress, signer.address],
          {
            initializer: "initialize",
          }
        );
        enderBondAddress = await enderBond.getAddress();

        //set enderBond address in endToken
        await endToken.setBond(enderBondAddress);
    
        //deploy ender Staking contract
        enderStaking = await upgrades.deployProxy(
          enderStakingFactory,
          [endTokenAddress, sEndTokenAddress, stEthAddress, signer.address],
          {
            initializer: "initialize",
          }
        );
        enderStakingAddress = await enderStaking.getAddress();
    
        //deploy ender Treasury contract
        enderTreasury = await upgrades.deployProxy(
          enderTreasuryFactory,
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

        //deploy bond NFT contract
        bondNFT = await upgrades.deployProxy(bondNftFactory, [enderBondAddress, baseURI], {
          initializer: "initialize",
        });
        await bondNFT.waitForDeployment();
        bondNFTAddress = await bondNFT.getAddress();

        //set addresses, whitelists, grant roles
        await sEndToken.setAddress(enderStakingAddress, 1);

        await enderStaking.setAddress(enderBondAddress, 1);
        await enderStaking.setAddress(enderTreasuryAddress, 2);
        await enderStaking.setAddress(stEthAddress, 6);

        await enderBond.setBondableTokens([stEthAddress], true);
        await enderBond.setAddress(enderTreasuryAddress, 1);
        await enderBond.setAddress(bondNFTAddress, 3);
        await enderBond.setAddress(sEndTokenAddress, 9);

        await sEndToken.setStatus(2);
        await sEndToken.whitelist(enderBondAddress, true);

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

        //signature
        signature1 = await signatureDigest();
        signature2 = await signatureDigest1();
        signature3 = await signatureDigest2();

    });


    describe("TESTCASES", async() => {
        it("Simple 1 deposit, mature, withdraw", async() => {
          const maturity = 90;
          const bondFee = 500;
          const depositPrincipalStEth = expandTo18Decimals(1);

          //mint stEth to signer1 and approve enderBond
          await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
          await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

          //deposit by signer1
          expect(tokenId1 = await depositAndSetup(signer1, depositPrincipalStEth, maturity, bondFee, [signer1.address, "0", signature1]))
          .to
          .changeTokenBalance(stEth, [signer1.address, enderTreasuryAddress], [-depositPrincipalStEth, depositPrincipalStEth]);

          //mature the bond
          increaseTime(maturity);

          //balance of signer1 before withdrawal
          const balanceBefore =  await stEth.balanceOf(signer1.address);

          //withdraw
          await withdrawAndSetup(signer1, tokenId1)

          expect(await stEth.balanceOf(signer1.address)).to.be.greaterThan(balanceBefore);

        });

        it("Simple 3 deposits, matures, withdraws", async() => {
          const maturity = 90;
          const bondFee = 500;
          const depositPrincipalStEth = expandTo18Decimals(1);

          //mint stEth to signer1, signer2, signer3 and approve enderBond
          await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
          await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);
          await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });
          await stEth.connect(signer2).approve(enderBondAddress, depositPrincipalStEth);
          await stEth.connect(signer3).submit({ value: ethers.parseEther("1.0") });
          await stEth.connect(signer3).approve(enderBondAddress, depositPrincipalStEth);

          console.log("----------------Deposit1--------------------");

          //deposit by signer1
          expect(tokenId1 = await depositAndSetup(signer1, depositPrincipalStEth, maturity, bondFee, [signer1.address, "0", signature1]))
          .to
          .changeTokenBalance(stEth, [signer1.address, enderTreasuryAddress], [-depositPrincipalStEth, depositPrincipalStEth]);

          //mature the bond
          increaseTime(maturity/2);

          console.log("----------------Deposit2-------------------");

          //deposit by signer2
          expect(tokenId2 = await depositAndSetup(signer2, depositPrincipalStEth, maturity/2, bondFee/2, [signer2.address, "0", signature2]))
          .to
          .changeTokenBalance(stEth, [signer2.address, enderTreasuryAddress], [-depositPrincipalStEth, depositPrincipalStEth]);

          
          //mature the bond
          increaseTime(maturity/3);
          
          console.log("----------------Deposit3-------------------");

          //deposit by signer3
          expect(tokenId3 = await depositAndSetup(signer3, depositPrincipalStEth, maturity/3, bondFee*2, [signer3.address, "0", signature3]))
          .to
          .changeTokenBalance(stEth, [signer3.address, enderTreasuryAddress], [-depositPrincipalStEth, depositPrincipalStEth]);

          //mature the bond
          increaseTime(maturity/2);

          //balance of signer1 before withdrawal
          const balanceBefore1 =  await stEth.balanceOf(signer1.address);
          const balanceBefore2 =  await stEth.balanceOf(signer2.address);
          const balanceBefore3 =  await stEth.balanceOf(signer3.address);

          //withdraw
          await withdrawAndSetup(signer1, tokenId1);
          await withdrawAndSetup(signer2, tokenId2);
          await withdrawAndSetup(signer3, tokenId3);

          expect(await stEth.balanceOf(signer1.address)).to.be.greaterThan(balanceBefore1);
          expect(await stEth.balanceOf(signer2.address)).to.be.greaterThan(balanceBefore2);
          expect(await stEth.balanceOf(signer3.address)).to.be.greaterThan(balanceBefore3);

        });

        it.only("deposit, claim refraction reward, withdraw", async() => {
          const maturity = 90;
          const bondFee = 500;
          const depositAmountEnd = expandTo18Decimals(5);
          const depositPrincipalStEth = expandTo18Decimals(1);

          //mint stEth to signer1 and approve enderBond
          await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
          await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

          //deposit by signer1
          expect(tokenId1 = await depositAndSetup(signer1, depositPrincipalStEth, maturity, bondFee, [signer1.address, "0", signature1]))
          .to
          .changeTokenBalance(stEth, [signer1.address, enderTreasuryAddress], [-depositPrincipalStEth, depositPrincipalStEth]);

          //reward Share "S" will be 0 as no refraction reward has yet been collected
          expect(await enderBond.rewardShareIndex()).to.be.equal(0);

          //token transfers to collect refraction reward 
          await endToken.connect(owner).mint(signer2.address, depositAmountEnd);
          await endToken.connect(signer2).transfer(signer3.address, depositAmountEnd);

          /* If signer 2 deposits now then he won't be eligible for refraction reward for the above transfers */

          //mint stEth to signer2 and approve enderBond
          await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });
          await stEth.connect(signer2).approve(enderBondAddress, depositPrincipalStEth);

          //deposit by signer2
          expect(tokenId2 = await depositAndSetup(signer2, depositPrincipalStEth, maturity, bondFee, [signer2.address, "0", signature2]))
          .to
          .changeTokenBalance(stEth, [signer1.address, enderTreasuryAddress], [-depositPrincipalStEth, depositPrincipalStEth]);


          //distribute the collected refraction reward
          await endToken.distributeRefractionFees();

          //reward Share "S" will be not be 0 now
          expect(await enderBond.rewardShareIndex()).to.be.greaterThan(0);

          //mature the bond
          increaseTime(maturity);

          //withdraw with refraction reward
          await withdrawAndSetup(signer1, tokenId1);

          //withdraw without refraction reward
          await withdrawAndSetup(signer2, tokenId2);

          //signer1 gets more because of refraction reward
          expect(await endToken.balanceOf(signer1.address)).to.be.greaterThan(await endToken.balanceOf(signer2.address));

        });

        it.only("deposit, stake, stake reward, unstake, mature, withdraw", async() => {
          const maturity = 90;
          const bondFee = 500;
          const depositAmountEnd = expandTo18Decimals(5);
          const depositPrincipalStEth = expandTo18Decimals(1);

          //mint stEth to signer1 and approve enderBond
          await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
          await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

          //deposit by signer1
          expect(tokenId1 = await depositAndSetup(signer1, depositPrincipalStEth, maturity, bondFee, [signer1.address, "0", signature1]))
          .to
          .changeTokenBalance(stEth, [signer1.address, enderTreasuryAddress], [-depositPrincipalStEth, depositPrincipalStEth]);

          //token transfers to collect refraction reward 
          await endToken.connect(owner).mint(signer2.address, depositAmountEnd);
          await endToken.connect(signer2).transfer(signer3.address, depositAmountEnd);

          //distribute the collected refraction reward
          await endToken.distributeRefractionFees();

          const stakeAmount = await endToken.balanceOf(signer1.address);

          //stake
          enderStaking.stake(stakeAmount, [signer1.address, "0", signature1]);

          //deposit in statergy from treasury
          await enderTreasury.setAddress(instadappLitelidoStaking, 5);
          await enderTreasury.setStrategy([instadappLitelidoStaking], true);
          await enderTreasury.setPriorityStrategy(instadappLitelidoStaking);
          await enderTreasury.depositInStrategy(stEthAddress, instadappLitelidoStaking, await stEth.balanceOf(enderTreasuryAddress));
          
          enderStaking.unstake(await sEndToken.balanceOf(signer1.address), [signer1.address, "0", signature1]);

          expect(await endToken.balanceOf(signer1.address)).to.be.equal(stakeAmount);

          //mature the bond
          increaseTime(maturity);

          //balance of signer1 before withdrawal
          const balanceBefore =  await stEth.balanceOf(signer1.address);

          //withdraw
          await withdrawAndSetup(signer1, tokenId1)

          expect(await stEth.balanceOf(signer1.address)).to.be.greaterThan(balanceBefore);

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
    }

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
    }
    
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
    }
    
    async function signatureDigest2() {
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
            user: signer3.address,
            key: "0",
          }
        )
        return sig;
    }
   
    async function increaseTime(days) {
      await ethers.provider.send("evm_increaseTime", [days*600]);
      await ethers.provider.send("evm_mine");
    }



});