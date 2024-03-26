import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

import { StETH } from "../../typechain-types/contracts/ERC20/mockStEth.sol/StETH";
import { EnderBond } from "../../typechain-types/contracts/EnderBond";
import { EndToken } from "../../typechain-types/contracts/ERC20/EndToken";
import { SEndToken } from "../../typechain-types/contracts/ERC20/SEndToken";
import { EnderTreasury } from "../../typechain-types/contracts/EnderTreasury";
import { StinstaToken } from "../../typechain-types/contracts/strategy/instadapp/instadappLite.sol";
import { EnderStaking } from "../../typechain-types/contracts/EnderStaking";
import { depositAndSetup, expandToDecimals, signatureDigest } from "../utils/utils";
import { Deployer } from "../utils/deployer";
import { MINTER_ROLE } from "../utils/constants";

describe("Ender Bond deposit and withdraw", async () => {
    let owner: HardhatEthersSigner,
        signer: HardhatEthersSigner,
        signer1: HardhatEthersSigner,
        signer2: HardhatEthersSigner,
        signer3: HardhatEthersSigner,
        signer4: HardhatEthersSigner,
        signer5: HardhatEthersSigner,
        stEthAddress: string,
        enderBondAddress: string,
        enderTreasuryAddress: string,
        instadappLiteAddress: string,
        enderStakingAddress: string,
        stEth: StETH,
        enderBond: EnderBond,
        endToken: EndToken,
        sEndToken: SEndToken,
        enderTreasury: EnderTreasury,
        instadappLitelidoStaking: StinstaToken,
        enderStaking: EnderStaking,
        signature1: string,
        signature2: string,
        signature3: string,
        stakingSignature1: string,
        tokenId_1_1,
        tokenId_1_2,
        tokenId_2_1,
        tokenId1,
        tokenId2,
        tokenId3,
        userSign: EnderBond.SignDataStruct;

    const deployer = new Deployer();

    before(async function () {
        [owner, signer, signer1, signer2, signer3, signer4, signer5] = await ethers.getSigners();
        const contracts = await deployer.prepareEndBondTest({
            owner: owner.address,
            signer: signer.address,
        });

        stEth = contracts.stEth;
        stEthAddress = contracts.stEthAddr;

        sEndToken = contracts.sEndToken;

        instadappLitelidoStaking = contracts.instadappLitelidoStaking;
        instadappLiteAddress = contracts.instadappLiteAddress;

        endToken = contracts.endToken;

        enderBond = contracts.enderBond;
        enderBondAddress = contracts.enderBondAddress;

        enderStaking = contracts.enderStaking;
        enderStakingAddress = contracts.enderStakingAddress;

        enderTreasury = contracts.enderTreasury;
        enderTreasuryAddress = contracts.enderTreasuryAddress;

        //signature
        signature1 = await signatureDigest(signer, "bondContract", enderBondAddress, signer1);
        signature2 = await signatureDigest(signer, "bondContract", enderBondAddress, signer2);
        signature3 = await signatureDigest(signer, "bondContract", enderBondAddress, signer3);
        stakingSignature1 = await signatureDigest(
            signer,
            "stakingContract",
            enderStakingAddress,
            signer1,
        );
    });

    describe("TESTCASES", async () => {
        it("Simple 1 deposit, mature, withdraw", async () => {
            const maturity = 90;
            const bondFee = 500;
            const depositPrincipalStEth = expandToDecimals(1, 18);

            //mint stEth to signer1 and approve enderBond
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

            userSign = { user: signer1.address, key: "0", signature: signature1 };

            //deposit by signer1
            expect(
                (tokenId1 = await depositAndSetup(
                    enderBond,
                    stEthAddress,
                    signer1,
                    depositPrincipalStEth,
                    maturity,
                    bondFee,
                    userSign,
                )),
            ).to.changeTokenBalance(
                stEth,
                [signer1.address, enderTreasuryAddress],
                [-depositPrincipalStEth, depositPrincipalStEth],
            );

            //mature the bond
            increaseTime(maturity);

            //balance of signer1 before withdrawal
            const balanceBefore = await stEth.balanceOf(signer1.address);

            //withdraw
            await withdrawAndSetup(signer1, tokenId1);

            expect(await stEth.balanceOf(signer1.address)).to.be.greaterThan(balanceBefore);
        });

        it("EnderBond:- performUpkeep", async () => {
            const maturity = 90;
            const bondFee = 500;
            const depositPrincipalStEth = expandToDecimals(1, 18);

            //mint stEth to signer1 and approve enderBond
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

            userSign = { user: signer1.address, key: "0", signature: signature1 };

            //deposit by signer1
            expect(
                (tokenId1 = await depositAndSetup(
                    enderBond,
                    stEthAddress,
                    signer1,
                    depositPrincipalStEth,
                    maturity,
                    bondFee,
                    userSign,
                )),
            ).to.changeTokenBalance(
                stEth,
                [signer1.address, enderTreasuryAddress],
                [-depositPrincipalStEth, depositPrincipalStEth],
            );
            await enderBond.connect(signer1).performUpkeep("0x1234");
            //mature the bond
            increaseTime(maturity);

            //balance of signer1 before withdrawal
            const balanceBefore = await stEth.balanceOf(signer1.address);

            //withdraw
            await withdrawAndSetup(signer1, tokenId1);

            expect(await stEth.balanceOf(signer1.address)).to.be.greaterThan(balanceBefore);
        });

        it("EnderBond:- calculating rewards", async () => {
            const maturity = 90;
            const bondFee = 500;
            const depositAmountEnd = expandToDecimals(5, 18);
            const depositPrincipalStEth = expandToDecimals(1, 18);

            //mint stEth to signer1 and approve enderBond
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

            userSign = { user: signer1.address, key: "0", signature: signature1 };

            //deposit by signer1
            expect(
                (tokenId1 = await depositAndSetup(
                    enderBond,
                    stEthAddress,
                    signer1,
                    depositPrincipalStEth,
                    maturity,
                    bondFee,
                    userSign,
                )),
            ).to.changeTokenBalance(
                stEth,
                [signer1.address, enderTreasuryAddress],
                [-depositPrincipalStEth, depositPrincipalStEth],
            );
            await enderBond.connect(signer1).performUpkeep("0x1234");
            await enderBond.connect(signer1).calculateBondRewardAmount(tokenId1, 0);
            await enderBond.connect(signer1).calculateStakingReward(tokenId1, 0);

            await endToken.connect(owner).mint(signer2.address, depositAmountEnd);
            await endToken.connect(signer2).transfer(signer3.address, depositAmountEnd);

            await endToken.distributeRefractionFees();

            await enderBond.connect(signer1).calculateRefractionRewards(tokenId1, 0);
            //mature the bond
            increaseTime(maturity);

            //balance of signer1 before withdrawal
            const balanceBefore = await stEth.balanceOf(signer1.address);

            //withdraw
            await withdrawAndSetup(signer1, tokenId1);

            expect(await stEth.balanceOf(signer1.address)).to.be.greaterThan(balanceBefore);
        });

        it("EnderBond:- updating states without performUpKeep", async () => {
            const maturity = 90;
            const bondFee = 500;
            const depositPrincipalStEth = expandToDecimals(1, 18);

            //mint stEth to signer1 and approve enderBond
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

            userSign = { user: signer1.address, key: "0", signature: signature1 };

            //deposit by signer1
            expect(
                (tokenId1 = await depositAndSetup(
                    enderBond,
                    stEthAddress,
                    signer1,
                    depositPrincipalStEth,
                    maturity,
                    bondFee,
                    userSign,
                )),
            ).to.changeTokenBalance(
                stEth,
                [signer1.address, enderTreasuryAddress],
                [-depositPrincipalStEth, depositPrincipalStEth],
            );
            await enderBond.epochBondYieldShareIndex();
            await enderBond.epochRewardShareIndexByPass();
            await enderBond.epochRewardShareIndexSendByPass();
            await enderBond.getLoopCount();
            await enderStaking.epochStakingReward(stEthAddress);
            //mature the bond
            increaseTime(maturity);

            //balance of signer1 before withdrawal
            const balanceBefore = await stEth.balanceOf(signer1.address);

            //withdraw
            await withdrawAndSetup(signer1, tokenId1);

            expect(await stEth.balanceOf(signer1.address)).to.be.greaterThan(balanceBefore);
        });

        it("Ender Bond:- claim Reward function calling without depositing in the enderBond", async () => {
            const maturity = 90;
            const bondFee = 500;
            const depositPrincipalStEth = expandToDecimals(1, 18);

            //mint stEth to signer1 and approve enderBond
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

            userSign = { user: signer1.address, key: "0", signature: signature1 };

            //deposit by signer1
            expect(
                (tokenId1 = await depositAndSetup(
                    enderBond,
                    stEthAddress,
                    signer1,
                    depositPrincipalStEth,
                    maturity,
                    bondFee,
                    userSign,
                )),
            ).to.changeTokenBalance(
                stEth,
                [signer1.address, enderTreasuryAddress],
                [-depositPrincipalStEth, depositPrincipalStEth],
            );

            await expect(
                enderBond.connect(signer2).claimRewards(tokenId1),
            ).to.be.revertedWithCustomError(enderBond, "NotBondUser");
        });

        it("Ender Bond:- Bond Not Matured", async () => {
            const maturity = 90;
            const bondFee = 500;
            const depositPrincipalStEth = expandToDecimals(1, 18);

            //mint stEth to signer1 and approve enderBond
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

            userSign = { user: signer1.address, key: "0", signature: signature1 };

            //deposit by signer1
            expect(
                (tokenId1 = await depositAndSetup(
                    enderBond,
                    stEthAddress,
                    signer1,
                    depositPrincipalStEth,
                    maturity,
                    bondFee,
                    userSign,
                )),
            ).to.changeTokenBalance(
                stEth,
                [signer1.address, enderTreasuryAddress],
                [-depositPrincipalStEth, depositPrincipalStEth],
            );

            //mature the bond
            // increaseTime(maturity);

            //balance of signer1 before withdrawal
            const balanceBefore = await stEth.balanceOf(signer1.address);

            //withdraw
            // await withdrawAndSetup(signer1, tokenId1)
            await expect(
                enderBond.connect(signer1).withdraw(tokenId1),
            ).to.be.revertedWithCustomError(enderBond, "BondNotMatured");
        });

        it("Simple 3 deposits, matures, withdraws", async () => {
            const maturity = 90;
            const bondFee = 500;
            const depositPrincipalStEth = expandToDecimals(1, 18);

            //mint stEth to signer1, signer2, signer3 and approve enderBond
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);
            await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer2).approve(enderBondAddress, depositPrincipalStEth);
            await stEth.connect(signer3).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer3).approve(enderBondAddress, depositPrincipalStEth);

            console.log("----------------Deposit1--------------------");

            userSign = { user: signer1.address, key: "0", signature: signature1 };

            //deposit by signer1
            expect(
                (tokenId1 = await depositAndSetup(
                    enderBond,
                    stEthAddress,
                    signer1,
                    depositPrincipalStEth,
                    maturity,
                    bondFee,
                    userSign,
                )),
            ).to.changeTokenBalance(
                stEth,
                [signer1.address, enderTreasuryAddress],
                [-depositPrincipalStEth, depositPrincipalStEth],
            );

            //mature the bond
            increaseTime(maturity / 2);

            console.log("----------------Deposit2-------------------");

            userSign = { user: signer2.address, key: "0", signature: signature2 };

            //deposit by signer2
            expect(
                (tokenId2 = await depositAndSetup(
                    enderBond,
                    stEthAddress,
                    signer2,
                    depositPrincipalStEth,
                    maturity / 2,
                    bondFee / 2,
                    userSign,
                )),
            ).to.changeTokenBalance(
                stEth,
                [signer2.address, enderTreasuryAddress],
                [-depositPrincipalStEth, depositPrincipalStEth],
            );

            //mature the bond
            increaseTime(maturity / 3);

            console.log("----------------Deposit3-------------------");

            userSign = { user: signer3.address, key: "0", signature: signature3 };

            //deposit by signer3
            expect(
                (tokenId3 = await depositAndSetup(
                    enderBond,
                    stEthAddress,
                    signer3,
                    depositPrincipalStEth,
                    maturity / 3,
                    bondFee * 2,
                    userSign,
                )),
            ).to.changeTokenBalance(
                stEth,
                [signer3.address, enderTreasuryAddress],
                [-depositPrincipalStEth, depositPrincipalStEth],
            );

            //mature the bond
            increaseTime(maturity / 2);

            //balance of signer1 before withdrawal
            const balanceBefore1 = await stEth.balanceOf(signer1.address);
            const balanceBefore2 = await stEth.balanceOf(signer2.address);
            const balanceBefore3 = await stEth.balanceOf(signer3.address);

            //withdraw
            await withdrawAndSetup(signer1, tokenId1);
            await withdrawAndSetup(signer2, tokenId2);
            await withdrawAndSetup(signer3, tokenId3);

            expect(await stEth.balanceOf(signer1.address)).to.be.greaterThan(balanceBefore1);
            expect(await stEth.balanceOf(signer2.address)).to.be.greaterThan(balanceBefore2);
            expect(await stEth.balanceOf(signer3.address)).to.be.greaterThan(balanceBefore3);
        });

        it("deposit, claim refraction reward, withdraw", async () => {
            const maturity = 90;
            const bondFee = 500;
            const depositAmountEnd = expandToDecimals(5, 18);
            const depositPrincipalStEth = expandToDecimals(1, 18);

            //mint stEth to signer1 and approve enderBond
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

            userSign = { user: signer1.address, key: "0", signature: signature1 };

            //deposit by signer1
            expect(
                (tokenId1 = await depositAndSetup(
                    enderBond,
                    stEthAddress,
                    signer1,
                    depositPrincipalStEth,
                    maturity,
                    bondFee,
                    userSign,
                )),
            ).to.changeTokenBalance(
                stEth,
                [signer1.address, enderTreasuryAddress],
                [-depositPrincipalStEth, depositPrincipalStEth],
            );

            //token transfers to collect refraction reward
            await endToken.connect(owner).mint(signer2.address, depositAmountEnd);
            await endToken.connect(signer2).transfer(signer3.address, depositAmountEnd);

            /* If signer 2 deposits now then he won't be eligible for refraction reward for the above transfers */

            //mint stEth to signer2 and approve enderBond
            await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer2).approve(enderBondAddress, depositPrincipalStEth);

            userSign = { user: signer2.address, key: "0", signature: signature2 };

            //deposit by signer2
            expect(
                (tokenId2 = await depositAndSetup(
                    enderBond,
                    stEthAddress,
                    signer2,
                    depositPrincipalStEth,
                    maturity,
                    bondFee,
                    userSign,
                )),
            ).to.changeTokenBalance(
                stEth,
                [signer1.address, enderTreasuryAddress],
                [-depositPrincipalStEth, depositPrincipalStEth],
            );

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
            expect(await endToken.balanceOf(signer1.address)).to.be.greaterThan(
                await endToken.balanceOf(signer2.address),
            );
        });

        it("deposit, stake, stake reward, unstake, mature, withdraw", async () => {
            const maturity = 90;
            const bondFee = 500;
            const depositAmountEnd = expandToDecimals(5, 18);
            const depositPrincipalStEth = expandToDecimals(1, 18);

            //mint stEth to signer1 and approve enderBond
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

            userSign = { user: signer1.address, key: "0", signature: signature1 };

            //deposit by signer1
            expect(
                (tokenId1 = await depositAndSetup(
                    enderBond,
                    stEthAddress,
                    signer1,
                    depositPrincipalStEth,
                    maturity,
                    bondFee,
                    userSign,
                )),
            ).to.changeTokenBalance(
                stEth,
                [signer1.address, enderTreasuryAddress],
                [-depositPrincipalStEth, depositPrincipalStEth],
            );

            //token transfers to collect refraction reward
            await endToken.connect(owner).mint(signer2.address, depositAmountEnd);
            await endToken.connect(signer2).transfer(signer3.address, depositAmountEnd);

            //collect the accumulated refraction reward
            await enderBond.connect(signer1).claimRewards(tokenId1);

            const stakeAmount = await endToken.balanceOf(signer1.address);

            //allowing staking contract
            endToken.connect(signer1).approve(enderStakingAddress, stakeAmount);

            userSign = { user: signer1.address, key: "0", signature: stakingSignature1 };

            //stake
            await enderStaking.connect(signer1).stake(stakeAmount, userSign);

            //deposit in statergy from treasury
            await enderTreasury.depositInStrategy(
                stEthAddress,
                instadappLitelidoStaking,
                await stEth.balanceOf(enderTreasuryAddress),
            );

            //after 1 epoch
            await passEpoch(1);

            //rewards from statergy
            await stEth.connect(signer3).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer3).transfer(instadappLiteAddress, depositPrincipalStEth);

            //epoch reward share
            await enderStaking.epochStakingReward(stEthAddress);

            //unstake
            await enderStaking.connect(signer1).unstake(await sEndToken.balanceOf(signer1.address));

            expect(await endToken.balanceOf(signer1.address)).to.be.greaterThan(stakeAmount);

            //collect the accumulated refraction reward
            await enderBond.connect(signer1).claimRewards(tokenId1);

            expect(await sEndToken.balanceOf(signer1.address)).to.be.greaterThan(0);

            //mature the bond
            increaseTime(maturity);

            //balance of signer1 before withdrawal
            const balanceBefore = await stEth.balanceOf(signer1.address);
            //withdraw
            await withdrawAndSetup(signer1, tokenId1);
            expect(await stEth.balanceOf(signer1.address)).to.be.greaterThan(balanceBefore);
        });

        it("multiple deposits, multiple stakes, multiple claimrewards", async () => {
            const maturity = 90;
            const bondFee = 500;
            const depositPrincipalStEth = expandToDecimals(1, 18);
            const depositAmountEnd = expandToDecimals(5, 18);

            //mint stEth to signer1 and approve enderBond
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

            userSign = { user: signer1.address, key: "0", signature: signature1 };

            /*<-------------------------deposit by signer1(1.1)------------------->*/
            expect(
                (tokenId_1_1 = await depositAndSetup(
                    enderBond,
                    stEthAddress,
                    signer1,
                    depositPrincipalStEth,
                    maturity,
                    bondFee,
                    userSign,
                )),
            ).to.changeTokenBalance(
                stEth,
                [signer1.address, enderTreasuryAddress],
                [-depositPrincipalStEth, depositPrincipalStEth],
            );

            //token transfers to collect refraction reward
            await endToken.connect(owner).mint(signer4.address, depositAmountEnd);
            await endToken.connect(signer4).transfer(signer5.address, depositAmountEnd);

            //deposit in statergy from treasury
            await enderTreasury.depositInStrategy(
                stEthAddress,
                instadappLitelidoStaking,
                await stEth.balanceOf(enderTreasuryAddress),
            );

            //rewards from statergy
            await stEth.connect(signer3).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer3).transfer(instadappLiteAddress, depositPrincipalStEth);

            //2 days
            await passEpoch(2);

            // signer1 collects refraction + bondYeild + rewards from statergy returns
            console.log("--------------Token(1.1)--Claim:1-----------------------");
            await enderBond.connect(signer1).claimRewards(tokenId_1_1);
            console.log("--------------------------------------------------------");

            /******************************************************************************** */

            //token transfers to collect refraction reward
            await endToken.connect(owner).mint(signer4.address, depositAmountEnd);
            await endToken.connect(signer4).transfer(signer5.address, depositAmountEnd);

            //mint stEth to signer1 and approve enderBond
            await stEth.connect(signer1).submit({ value: ethers.parseEther("2.0") });
            await stEth.connect(signer1).approve(enderBondAddress, 2n * depositPrincipalStEth);

            userSign = { user: signer1.address, key: "0", signature: signature1 };

            /*<-------------------------deposit by signer1(1.2)------------------->*/
            expect(
                (tokenId_1_2 = await depositAndSetup(
                    enderBond,
                    stEthAddress,
                    signer1,
                    2n * depositPrincipalStEth,
                    maturity,
                    bondFee,
                    userSign,
                )),
            ).to.changeTokenBalance(
                stEth,
                [signer1.address, enderTreasuryAddress],
                [-2n * depositPrincipalStEth, 2n * depositPrincipalStEth],
            );

            //deposit in statergy from treasury
            await enderTreasury.depositInStrategy(
                stEthAddress,
                instadappLitelidoStaking,
                await stEth.balanceOf(enderTreasuryAddress),
            );

            //rewards from statergy
            await stEth.connect(signer3).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer3).transfer(instadappLiteAddress, depositPrincipalStEth);

            //token transfers to collect refraction reward
            await endToken.connect(owner).mint(signer4.address, depositAmountEnd);
            await endToken.connect(signer4).transfer(signer5.address, depositAmountEnd);

            //signer1 collects refraction + bondYeild + rewards from statergy returns
            console.log("--------------Token(1.1)--Claim:2-----------------------");
            await enderBond.connect(signer1).claimRewards(tokenId_1_1);
            console.log("--------------------------------------------------------");

            //signer1 collects refraction + bondYeild  + rewards from statergy returns
            console.log("--------------Token(1.2)--Claim:1-----------------------");
            await enderBond.connect(signer1).claimRewards(tokenId_1_2);
            console.log("--------------------------------------------------------");

            // enderTreasury.setNominalYield(20000);

            await passEpoch(1);

            //signer1 collects refraction + bondYeild + rewards from statergy returns
            console.log("--------------Token(1.1)--Claim:3-----------------------");
            await enderBond.connect(signer1).claimRewards(tokenId_1_1);
            console.log("--------------------------------------------------------");

            //signer1 collects refraction + bondYeild + rewards from statergy returns
            console.log("--------------Token(1.1)--Claim:2-----------------------");
            await enderBond.connect(signer1).claimRewards(tokenId_1_2);
            console.log("--------------------------------------------------------");

            await passEpoch(3);

            /******************************************************************************** */

            //token transfers to collect refraction reward
            await endToken.connect(owner).mint(signer4.address, depositAmountEnd);
            await endToken.connect(signer4).transfer(signer5.address, depositAmountEnd);

            //mint stEth to signer1 and approve enderBond
            await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer2).approve(enderBondAddress, depositPrincipalStEth);

            userSign = { user: signer2.address, key: "0", signature: signature2 };

            /*<-------------------------deposit by signer1(1.2)------------------->*/
            expect(
                (tokenId_2_1 = await depositAndSetup(
                    enderBond,
                    stEthAddress,
                    signer2,
                    depositPrincipalStEth,
                    maturity,
                    bondFee,
                    userSign,
                )),
            ).to.changeTokenBalance(
                stEth,
                [signer2.address, enderTreasuryAddress],
                [-depositPrincipalStEth, depositPrincipalStEth],
            );

            /*<--------------------------Stake by signer 1------------------>*/
            const stakeAmount = await endToken.balanceOf(signer1.address);

            //allowing staking contract
            endToken.connect(signer1).approve(enderStakingAddress, stakeAmount);

            userSign = {
                user: signer1.address,
                key: "0",
                signature: stakingSignature1,
            };

            //stake
            await enderStaking.connect(signer1).stake(stakeAmount, userSign);

            //signer2 collects refraction + bondYeild + rewards from statergy returns
            console.log("--------------Token(2.1)--Claim:1-----------------------");
            await enderBond.connect(signer2).claimRewards(tokenId_2_1);
            console.log("--------------------------------------------------------");

            /*<--------------------------Stake by signer 2------------------>*/

            const stakeAmount2 = await endToken.balanceOf(signer2.address);

            //allowing staking contract
            endToken.connect(signer2).approve(enderStakingAddress, stakeAmount2);

            userSign = {
                user: signer2.address,
                key: "0",
                signature: stakingSignature1,
            };

            //stake
            await enderStaking.connect(signer2).stake(stakeAmount2, userSign);

            /*<-----------------Unstake by signer 1------------------>*/
            await enderStaking.connect(signer1).unstake(await sEndToken.balanceOf(signer1.address));

            expect(await endToken.balanceOf(signer1.address)).to.be.greaterThan(stakeAmount);

            /*<-----------------Unstake by signer 2------------------>*/
            await enderStaking.connect(signer2).unstake(await sEndToken.balanceOf(signer2.address));

            expect(await endToken.balanceOf(signer2.address)).to.be.lessThanOrEqual(stakeAmount2);

            //deposit in statergy from treasury
            await enderTreasury.depositInStrategy(
                stEthAddress,
                instadappLitelidoStaking,
                await stEth.balanceOf(enderTreasuryAddress),
            );

            //rewards from statergy
            await stEth.connect(signer3).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer3).transfer(instadappLiteAddress, depositPrincipalStEth);

            //signer1 collects refraction + bondYeild + rewards from statergy returns
            console.log("--------------Token(1.1)--Claim:3-----------------------");
            await enderBond.connect(signer1).claimRewards(tokenId_1_1);
            console.log("--------------------------------------------------------");

            //signer1 collects refraction + bondYeild + rewards from statergy returns
            console.log("--------------Token(1.2)--Claim:2-----------------------");
            await enderBond.connect(signer1).claimRewards(tokenId_1_2);
            console.log("--------------------------------------------------------");

            //signer2 collects refraction + bondYeild + rewards from statergy returns
            console.log("--------------Token(2.1)--Claim:1-----------------------");
            await enderBond.connect(signer2).claimRewards(tokenId_2_1);
            console.log("--------------------------------------------------------");

            await passEpoch(1);

            //signer1 collects refraction + bondYeild + rewards from statergy returns
            console.log("--------------Token(1.1)--Claim:4-----------------------");
            await enderBond.connect(signer1).claimRewards(tokenId_1_1);
            console.log("--------------------------------------------------------");

            //signer1 collects refraction + bondYeild + rewards from statergy returns
            console.log("--------------Token(1.2)--Claim:3-----------------------");
            await enderBond.connect(signer1).claimRewards(tokenId_1_2);
            console.log("--------------------------------------------------------");

            //signer2 collects refraction + bondYeild + rewards from statergy returns
            console.log("--------------Token(2.1)--Claim:2-----------------------");
            await enderBond.connect(signer2).claimRewards(tokenId_2_1);
            console.log("--------------------------------------------------------");

            /******************************************************************************* */

            //rewards from statergy
            await stEth.connect(signer3).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer3).transfer(instadappLiteAddress, depositPrincipalStEth);

            //token transfers to collect refraction reward
            await endToken.connect(owner).mint(signer4.address, depositAmountEnd);
            await endToken.connect(signer4).transfer(signer5.address, depositAmountEnd);

            await increaseTime(4);

            //rewards from statergy
            await stEth.connect(signer3).submit({ value: ethers.parseEther("2.0") });
            await stEth.connect(signer3).transfer(instadappLiteAddress, 2n * depositPrincipalStEth);

            //token transfers to collect refraction reward
            await endToken.connect(owner).mint(signer4.address, 5n * depositAmountEnd);
            await endToken.connect(signer4).transfer(signer5.address, 5n * depositAmountEnd);

            //rewards from statergy
            await stEth.connect(signer3).submit({ value: ethers.parseEther("10.0") });
            await stEth
                .connect(signer3)
                .transfer(instadappLiteAddress, 10n * depositPrincipalStEth);

            //token transfers to collect refraction reward
            await endToken.connect(owner).mint(signer4.address, 10n * depositAmountEnd);
            await endToken.connect(signer4).transfer(signer5.address, 10n * depositAmountEnd);

            await increaseTime(2);

            //mint stEth to signer1 and approve enderBond
            await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer2).approve(enderBondAddress, depositPrincipalStEth);

            userSign = {
                user: signer2.address,
                key: "0",
                signature: signature2,
            };

            /*<-------------------------deposit by signer1(1.2)------------------->*/
            expect(
                await depositAndSetup(
                    enderBond,
                    stEthAddress,
                    signer2,
                    depositPrincipalStEth,
                    maturity,
                    bondFee,
                    userSign,
                ),
            ).to.changeTokenBalance(
                stEth,
                [signer2.address, enderTreasuryAddress],
                [-depositPrincipalStEth, depositPrincipalStEth],
            );

            await increaseTime(90);
            await passEpoch(1);

            //withdraw
            console.log("<------------------Withdraw------------------>");
            await withdrawAndSetup(signer1, tokenId_1_1);
        });
    });

    async function withdrawAndSetup(signer: HardhatEthersSigner, tokenId: bigint) {
        await endToken.grantRole(MINTER_ROLE, enderTreasuryAddress);
        await enderBond.connect(signer).withdraw(tokenId);
    }

    async function passEpoch(epoch: number) {
        while (epoch--) {
            await enderBond.epochBondYieldShareIndex();
            await enderBond.epochRewardShareIndexByPass();
            await enderBond.epochRewardShareIndexSendByPass();
            await enderStaking.epochStakingReward(stEthAddress);
            await enderBond.getLoopCount();
            await increaseTime(1);
        }
    }

    async function increaseTime(days: number) {
        await ethers.provider.send("evm_increaseTime", [days * 600]);
        await ethers.provider.send("evm_mine");
    }
});
