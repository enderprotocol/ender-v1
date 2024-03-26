import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

import { EndToken } from "../../typechain-types/contracts/ERC20/EndToken";
import { EnderStakeEth } from "../../typechain-types/contracts/ERC20/EnderStakeEth";
import { EnderBond } from "../../typechain-types/contracts/EnderBond";
import { EnderTreasury } from "../../typechain-types/contracts/EnderTreasury";
import { EnderStaking } from "../../typechain-types/contracts/EnderStaking";
import { SEndToken } from "../../typechain-types/contracts/ERC20/SEndToken";
import { StETH } from "../../typechain-types/contracts/ERC20/mockStEth.sol/StETH";
import { BondNFT } from "../../typechain-types/contracts/NFT";
import { StinstaToken } from "../../typechain-types/contracts/strategy/instadapp/instadappLite.sol";
import { Deployer } from "../utils/deployer";
import {
    depositAndSetup,
    expandToDecimals,
    increaseTime,
    signatureDigest,
    sleep,
} from "../utils/utils";
import { MINTER_ROLE } from "../utils/constants";

describe("EnderBond Deposit and Withdraw", function () {
    let owner: HardhatEthersSigner,
        signer: HardhatEthersSigner,
        signer1: HardhatEthersSigner,
        signer2: HardhatEthersSigner,
        signer3: HardhatEthersSigner,
        signer4: HardhatEthersSigner;
    let enderBondAddress: string,
        enderTreasuryAddress: string,
        enderStakingAddress: string,
        sEndTokenAddress: string,
        stEthAddress: string,
        instadappLiteAddress: string;

    let endToken: EndToken,
        endETHToken: EnderStakeEth,
        enderBond: EnderBond,
        enderTreasury: EnderTreasury,
        enderStaking: EnderStaking,
        sEnd: SEndToken,
        instadappLitelidoStaking: StinstaToken,
        stEth: StETH,
        bondNFT: BondNFT;
    let userSign: EnderBond.SignDataStruct, sig: string, sig_1: string, sig_2: string;

    const deployer = new Deployer();

    this.beforeEach(async function () {
        [owner, signer, signer1, signer2, signer3, signer4] = await ethers.getSigners();
        const contracts = await deployer.prepareEndBondTest({
            owner: owner.address,
            signer: signer.address,
        });

        stEth = contracts.stEth;
        stEthAddress = contracts.stEthAddr;

        sEnd = contracts.sEndToken;
        sEndTokenAddress = contracts.sEndTokenAddr;

        instadappLitelidoStaking = contracts.instadappLitelidoStaking;
        instadappLiteAddress = contracts.instadappLiteAddress;

        endToken = contracts.endToken;

        endETHToken = contracts.enderStakeEth;

        enderBond = contracts.enderBond;
        enderBondAddress = contracts.enderBondAddress;

        enderStaking = contracts.enderStaking;
        enderStakingAddress = contracts.enderStakingAddress;

        enderTreasury = contracts.enderTreasury;
        enderTreasuryAddress = contracts.enderTreasuryAddress;

        bondNFT = contracts.bondNFT;

        await endETHToken.setTreasury(enderTreasuryAddress);
        await endETHToken.grantRole(MINTER_ROLE, enderBondAddress);

        //signature
        sig = await signatureDigest(signer, "bondContract", enderBondAddress, signer1);
        sig_1 = await signatureDigest(signer, "bondContract", enderBondAddress, signer2);
        sig_2 = await signatureDigest(signer, "bondContract", enderBondAddress, signer3);
    });

    describe("deposit and withdraw", async () => {
        it("should successfully withdraw and update balances", async () => {
            const maturity = 90;
            const bondFee = 500;
            const depositAmountEnd = expandToDecimals(5, 18);
            const depositPrincipalStEth = expandToDecimals(1, 18);

            const endTransfer = expandToDecimals(1, 18);
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

            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

            await enderTreasury.setAddress(instadappLiteAddress, 5);

            //this is where the user will deposit the StEth in to the contract
            //in the deposit the amount will be divided in to 30 and 70% where the admin Will have access to further
            //deposit it into the strategy for every 24 hours
            await sleep(200);
            console.log("Here");
            userSign = { user: signer1.address, key: "0", signature: sig };
            const tokenId = await depositAndSetup(
                enderBond,
                stEthAddress,
                signer1,
                depositPrincipalStEth,
                maturity,
                bondFee,
                userSign,
            );

            await endToken.connect(signer1).transfer(signer2.address, "1000000000000000000");
            // await WETH.mint(signer2.address, depositPrincipalStEth);
            // await WETH.connect(signer2).approve(stEthAddress, depositPrincipalStEth);
            await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });

            await stEth.connect(signer2).approve(enderBondAddress, depositPrincipalStEth);

            //this is where the user will deposit the StEth in to the contract
            //in the deposit the amount will be divided in to 30 and 70% where the admin Will have access to further
            //deposit it into the strategy for every 24 hours
            userSign = { user: signer2.address, key: "0", signature: sig_1 };
            const tokenId1 = await depositAndSetup(
                enderBond,
                stEthAddress,
                signer2,
                depositPrincipalStEth,
                maturity,
                bondFee,
                userSign,
            );
            //this fundtion will set the bondYeildShareIndex where it is used to calculate the user S0
            increaseTime(6000);
            await enderBond.epochBondYieldShareIndex();
            //user cant collect the refraction rewards before the Distribution is done
            // await expect(
            //   enderBond.connect(signer1).calculateRefractionRewards(tokenId)
            // ).to.be.revertedWithCustomError(enderBond, "NotAllowed");

            expect(await enderBond.bondYieldShareIndex()).to.be.greaterThan(
                await enderBond.userBondYieldShareIndex(tokenId),
            );

            await endToken.distributeRefractionFees();
            // await enderBond.connect(signer1).claimRewards(tokenId);

            //now this can be called because the first deposit has done

            //  there are two tx done above which have 20% fee it will be equal to 400000000000000000
            // expect(await endToken.balanceOf(enderBondAddress)).to.be.equal(
            //   expandToDecimals(0.4)
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

            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);
            await enderTreasury.setAddress(instadappLitelidoStaking, 5);
            await enderTreasury.setStrategy([instadappLitelidoStaking], true);
            await enderTreasury.setPriorityStrategy(instadappLitelidoStaking);
            await enderTreasury.depositInStrategy(
                stEthAddress,
                instadappLitelidoStaking,
                "2000000000000000000",
            );
            userSign = { user: signer1.address, key: "0", signature: sig };

            const tokenId2 = await depositAndSetup(
                enderBond,
                stEthAddress,
                signer1,
                depositPrincipalStEth,
                maturity,
                bondFee,
                userSign,
            );
            await enderTreasury.depositInStrategy(
                stEthAddress,
                instadappLitelidoStaking,
                depositPrincipalStEth,
            );

            //this fundtion will set the bondYeildShareIndex where it is used to calculate the user S0
            await enderBond.epochBondYieldShareIndex();
            expect(await enderBond.bondYieldShareIndex()).to.be.greaterThan(
                await enderBond.userBondYieldShareIndex(tokenId2),
            );

            expect(await bondNFT.ownerOf(tokenId2)).to.be.equal(await bondNFT.ownerOf(tokenId));

            //increasing the time 1 day

            increaseTime(600);
            const initalBalanceOfEnderBond = await endToken.balanceOf(enderBondAddress);
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
            userSign = { user: signer3.address, key: "0", signature: sig_2 };
            await enderStaking.connect(signer3).stake(depositAmountEnd, userSign);

            // Wait for the bond to mature
            await increaseTime(180 * 600);
            const sEndAmount = await sEnd.connect(signer3).balanceOf(signer3.address);

            await enderStaking.connect(signer3).unstake(sEndAmount);

            //   await endToken.distributeRefractionFees();

            // await WETH.mint(signer1.address, depositPrincipalStEth);
            // await WETH.connect(signer1).approve(stEthAddress, depositPrincipalStEth);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).transfer(instadappLiteAddress, depositPrincipalStEth);
            await withdrawAndSetup(signer1, tokenId);

            // await withdrawAndSetup(signer1, tokenId2);

            // expect(await stEth.balanceOf(signer1.address)).to.be.equal(
            //   expandToDecimals(1.9)
            //   );
        });

        it("complete Ender protocol scenario 1", async () => {
            const maturity = 90;
            const bondFee = 500;
            const depositAmountEnd = expandToDecimals(5, 18);
            const depositPrincipalStEth = expandToDecimals(1, 18);

            const endTransfer = expandToDecimals(1, 18);
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
            console.log(
                "get the stEth--------->>>>>>>",
                await stEth.connect(signer1).balanceOf(signer1.address),
            );

            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

            await enderTreasury.setAddress(instadappLiteAddress, 5);
            await sleep(1200);

            userSign = { user: signer1.address, key: "0", signature: sig };

            const tokenId = await depositAndSetup(
                enderBond,
                stEthAddress,
                signer1,
                depositPrincipalStEth,
                maturity,
                bondFee,
                userSign,
            );

            await endToken.connect(signer1).transfer(signer2.address, "1000000000000000000");
            // await WETH.mint(signer2.address, depositPrincipalStEth);
            // await WETH.connect(signer2).approve(stEthAddress, depositPrincipalStEth);
            await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });

            await stEth.connect(signer2).approve(enderBondAddress, depositPrincipalStEth);

            userSign = { user: signer2.address, key: "0", signature: sig_1 };

            const tokenId1 = await depositAndSetup(
                enderBond,
                stEthAddress,
                signer2,
                depositPrincipalStEth,
                maturity,
                bondFee,
                userSign,
            );
            increaseTime(6000);
            // await enderBond.epochBondYieldShareIndex();

            expect(await enderBond.bondYieldShareIndex()).to.be.greaterThan(
                await enderBond.userBondYieldShareIndex(tokenId),
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

            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);
            await enderTreasury.setAddress(instadappLitelidoStaking, 5);
            await enderTreasury.setStrategy([instadappLitelidoStaking], true);
            await enderTreasury.setPriorityStrategy(instadappLitelidoStaking);
            await enderTreasury.depositInStrategy(
                stEthAddress,
                instadappLitelidoStaking,
                "2000000000000000000",
            );
            await increaseTime(20 * 600);
            console.log(
                "---------------------------------------------------3rd-deposit-----------------------------------",
            );

            userSign = { user: signer1.address, key: "0", signature: sig };
            const tokenId2 = await depositAndSetup(
                enderBond,
                stEthAddress,
                signer1,
                depositPrincipalStEth,
                maturity,
                bondFee,
                userSign,
            );
            await enderTreasury.depositInStrategy(
                stEthAddress,
                instadappLitelidoStaking,
                depositPrincipalStEth,
            );
            // //this fundtion will set the bondYeildShareIndex where it is used to calculate the user S0
            await enderBond.epochBondYieldShareIndex();
            expect(await enderBond.bondYieldShareIndex()).to.be.greaterThan(
                await enderBond.userBondYieldShareIndex(tokenId2),
            );

            expect(await bondNFT.ownerOf(tokenId2)).to.be.equal(await bondNFT.ownerOf(tokenId));
            await bondNFT.connect(signer1).transferFrom(signer1.address, signer4.address, tokenId2);

            //increasing the time 1 day

            increaseTime(600);
            const initalBalanceOfEnderBond = await endToken.balanceOf(enderBondAddress);
            //   await endToken.distributeRefractionFees();

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

            let receiptTokenAmount = await enderStaking.calculateSEndTokens(depositAmountEnd);
            userSign = { user: signer3.address, key: "0", signature: sig_2 };
            await enderStaking.connect(signer3).stake(depositAmountEnd, userSign);

            // Wait for the bond to mature
            await increaseTime(180 * 600);
            await stEth.connect(signer1).transfer(instadappLiteAddress, depositPrincipalStEth);
            const sEndAmount = await sEnd.connect(signer3).balanceOf(signer3.address);

            await enderStaking.connect(signer3).unstake(sEndAmount);

            //   await endToken.distributeRefractionFees();

            // await WETH.mint(signer1.address, depositPrincipalStEth);
            // await WETH.connect(signer1).approve(stEthAddress, depositPrincipalStEth);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).transfer(instadappLiteAddress, depositPrincipalStEth);
            // await withdrawAndSetup(signer1, tokenId);

            // await withdrawAndSetup(signer4, tokenId2);
        });

        it("Ender protocol scenario 2:- BondFee is 100% and maturity is 365 days", async () => {
            const maturity = 90;
            const bondFee = 10000;
            const depositAmountEnd = expandToDecimals(5, 18);
            const depositPrincipalStEth = expandToDecimals(1, 18);

            const endTransfer = expandToDecimals(1, 18);
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
            console.log(
                "get the stEth--------->>>>>>>",
                await stEth.connect(signer1).balanceOf(signer1.address),
            );

            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);
            await enderTreasury.setAddress(instadappLiteAddress, 5);
            await sleep(1200);

            console.log("signer address:- ", signer.address);
            userSign = { user: signer1.address, key: "0", signature: sig };
            const tokenId = await depositAndSetup(
                enderBond,
                stEthAddress,
                signer1,
                depositPrincipalStEth,
                maturity,
                bondFee,
                userSign,
            );
            await endToken.connect(signer1).transfer(signer2.address, "1000000000000000000");
            await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer2).approve(enderBondAddress, depositPrincipalStEth);

            userSign = { user: signer2.address, key: "0", signature: sig_1 };

            const tokenId1 = await depositAndSetup(
                enderBond,
                stEthAddress,
                signer2,
                depositPrincipalStEth,
                maturity,
                bondFee,
                userSign,
            );
            increaseTime(6000);
            await endToken.distributeRefractionFees();
            const initialBalanceOfuser = await endToken.balanceOf(signer1.address);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);
            await enderTreasury.setAddress(instadappLitelidoStaking, 5);
            await enderTreasury.setStrategy([instadappLitelidoStaking], true);
            await enderTreasury.setPriorityStrategy(instadappLitelidoStaking);
            await enderTreasury.depositInStrategy(
                stEthAddress,
                instadappLitelidoStaking,
                "2000000000000000000",
            );
            await increaseTime(20 * 600);
            userSign = { user: signer1.address, key: "0", signature: sig };

            const tokenId2 = await depositAndSetup(
                enderBond,
                stEthAddress,
                signer1,
                depositPrincipalStEth,
                maturity,
                bondFee,
                userSign,
            );
            await enderTreasury.depositInStrategy(
                stEthAddress,
                instadappLitelidoStaking,
                depositPrincipalStEth,
            );
            console.log(
                "---------------------------------------------------3rd-deposit-----------------------------------",
            );
            expect(await bondNFT.ownerOf(tokenId2)).to.be.equal(await bondNFT.ownerOf(tokenId));
            await bondNFT.connect(signer1).transferFrom(signer1.address, signer4.address, tokenId2);

            //increasing the time 1 day
            increaseTime(600);
            const initalBalanceOfEnderBond = await endToken.balanceOf(enderBondAddress);
            const initialBalanceOfuser1 = await endToken.balanceOf(signer1.address);
            const userAddressBefore = await endToken.balanceOf(signer1.address);
            await endToken.connect(owner).mint(signer3.address, depositAmountEnd);
            await endToken.connect(signer3).approve(enderStakingAddress, depositAmountEnd);
            await sEnd.connect(owner).whitelist(enderStakingAddress, true);
            await sEnd.connect(owner).setStatus(2);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });

            userSign = { user: signer3.address, key: "0", signature: sig_2 };
            await enderStaking.connect(signer3).stake(depositAmountEnd, userSign);
            await increaseTime(90 * 600);
            await stEth.connect(signer1).transfer(instadappLiteAddress, depositPrincipalStEth);
            const sEndAmount = await sEnd.connect(signer3).balanceOf(signer3.address);
            await enderStaking.connect(signer3).unstake(sEndAmount);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).transfer(instadappLiteAddress, depositPrincipalStEth);
            // await withdrawAndSetup(signer1, tokenId);

            // await withdrawAndSetup(signer4, tokenId2);
        });

        it("Ender protocol scenario 3:- BondFee is 0.01%% and maturity is 5 days", async () => {
            const maturity = 7;
            const bondFee = 1;
            const depositAmountEnd = expandToDecimals(5, 18);
            const depositPrincipalStEth = expandToDecimals(1, 18);

            const endTransfer = expandToDecimals(1, 18);
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
            console.log(
                "get the stEth--------->>>>>>>",
                await stEth.connect(signer1).balanceOf(signer1.address),
            );

            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);
            await enderTreasury.setAddress(instadappLiteAddress, 5);
            await sleep(1200);

            userSign = { user: signer1.address, key: "0", signature: sig };

            const tokenId = await depositAndSetup(
                enderBond,
                stEthAddress,
                signer1,
                depositPrincipalStEth,
                maturity,
                bondFee,
                userSign,
            );
            await endToken.connect(signer1).transfer(signer2.address, "1000000000000000000");
            await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer2).approve(enderBondAddress, depositPrincipalStEth);

            userSign = { user: signer2.address, key: "0", signature: sig_1 };

            const tokenId1 = await depositAndSetup(
                enderBond,
                stEthAddress,
                signer2,
                depositPrincipalStEth,
                maturity,
                bondFee,
                userSign,
            );
            increaseTime(6000);
            await endToken.distributeRefractionFees();
            const initialBalanceOfuser = await endToken.balanceOf(signer1.address);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);
            await enderTreasury.setAddress(instadappLitelidoStaking, 5);
            await enderTreasury.setStrategy([instadappLitelidoStaking], true);
            await enderTreasury.setPriorityStrategy(instadappLitelidoStaking);
            await enderTreasury.depositInStrategy(
                stEthAddress,
                instadappLitelidoStaking,
                "2000000000000000000",
            );
            await increaseTime(20 * 600);
            userSign = { user: signer1.address, key: "0", signature: sig };

            const tokenId2 = await depositAndSetup(
                enderBond,
                stEthAddress,
                signer1,
                depositPrincipalStEth,
                maturity,
                bondFee,
                userSign,
            );
            await enderTreasury.depositInStrategy(
                stEthAddress,
                instadappLitelidoStaking,
                depositPrincipalStEth,
            );
            console.log(
                "---------------------------------------------------3rd-deposit-----------------------------------",
            );
            expect(await bondNFT.ownerOf(tokenId2)).to.be.equal(await bondNFT.ownerOf(tokenId));
            await bondNFT.connect(signer1).transferFrom(signer1.address, signer4.address, tokenId2);

            //increasing the time 1 day
            increaseTime(600);
            const initalBalanceOfEnderBond = await endToken.balanceOf(enderBondAddress);
            const initialBalanceOfuser1 = await endToken.balanceOf(signer1.address);
            const userAddressBefore = await endToken.balanceOf(signer1.address);
            await endToken.connect(owner).mint(signer3.address, depositAmountEnd);
            await endToken.connect(signer3).approve(enderStakingAddress, depositAmountEnd);
            await sEnd.connect(owner).whitelist(enderStakingAddress, true);
            await sEnd.connect(owner).setStatus(2);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });

            userSign = { user: signer3.address, key: "0", signature: sig_2 };
            await enderStaking.connect(signer3).stake(depositAmountEnd, userSign);
            await increaseTime(90 * 600);
            await stEth.connect(signer1).transfer(instadappLiteAddress, depositPrincipalStEth);
            const sEndAmount = await sEnd.connect(signer3).balanceOf(signer3.address);
            await enderStaking.connect(signer3).unstake(sEndAmount);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).transfer(instadappLiteAddress, depositPrincipalStEth);
            await withdrawAndSetup(signer1, tokenId);
            console.log("Withdraw");
            await expect(withdrawAndSetup(signer4, tokenId2)).to.be.revertedWithCustomError(
                enderBond,
                "InsufficientEndETH",
            );

            await endETHToken.mint(signer4.address, depositPrincipalStEth, bondFee);
            await withdrawAndSetup(signer4, tokenId2);
        });

        it("Ender protocol scenario 4:- BondFee is 100% and maturity is 5 days", async () => {
            const maturity = 7;
            const bondFee = 10000;
            const depositAmountEnd = expandToDecimals(5, 18);
            const depositPrincipalStEth = expandToDecimals(1, 18);

            const endTransfer = expandToDecimals(1, 18);
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
            console.log(
                "get the stEth--------->>>>>>>",
                await stEth.connect(signer1).balanceOf(signer1.address),
            );

            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);
            await enderTreasury.setAddress(instadappLiteAddress, 5);
            await sleep(1200);

            userSign = { user: signer1.address, key: "0", signature: sig };

            const tokenId = await depositAndSetup(
                enderBond,
                stEthAddress,
                signer1,
                depositPrincipalStEth,
                maturity,
                bondFee,
                userSign,
            );
            await endToken.connect(signer1).transfer(signer2.address, "1000000000000000000");
            await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer2).approve(enderBondAddress, depositPrincipalStEth);

            userSign = { user: signer2.address, key: "0", signature: sig_1 };
            const tokenId1 = await depositAndSetup(
                enderBond,
                stEthAddress,
                signer2,
                depositPrincipalStEth,
                maturity,
                bondFee,
                userSign,
            );
            increaseTime(6000);
            await endToken.distributeRefractionFees();
            const initialBalanceOfuser = await endToken.balanceOf(signer1.address);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);
            await enderTreasury.setAddress(instadappLitelidoStaking, 5);
            await enderTreasury.setStrategy([instadappLitelidoStaking], true);
            await enderTreasury.setPriorityStrategy(instadappLitelidoStaking);
            await enderTreasury.depositInStrategy(
                stEthAddress,
                instadappLitelidoStaking,
                "2000000000000000000",
            );
            await increaseTime(20 * 600);
            userSign = { user: signer1.address, key: "0", signature: sig };

            const tokenId2 = await depositAndSetup(
                enderBond,
                stEthAddress,
                signer1,
                depositPrincipalStEth,
                maturity,
                bondFee,
                userSign,
            );
            await enderTreasury.depositInStrategy(
                stEthAddress,
                instadappLitelidoStaking,
                depositPrincipalStEth,
            );
            console.log(
                "---------------------------------------------------3rd-deposit-----------------------------------",
            );
            expect(await bondNFT.ownerOf(tokenId2)).to.be.equal(await bondNFT.ownerOf(tokenId));
            await bondNFT.connect(signer1).transferFrom(signer1.address, signer4.address, tokenId2);

            //increasing the time 1 day
            increaseTime(600);
            const initalBalanceOfEnderBond = await endToken.balanceOf(enderBondAddress);
            const initialBalanceOfuser1 = await endToken.balanceOf(signer1.address);
            const userAddressBefore = await endToken.balanceOf(signer1.address);
            await endToken.connect(owner).mint(signer3.address, depositAmountEnd);
            await endToken.connect(signer3).approve(enderStakingAddress, depositAmountEnd);
            await sEnd.connect(owner).whitelist(enderStakingAddress, true);
            await sEnd.connect(owner).setStatus(2);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });

            userSign = { user: signer3.address, key: "0", signature: sig_2 };
            await enderStaking.connect(signer3).stake(depositAmountEnd, userSign);
            await increaseTime(90 * 600);
            await stEth.connect(signer1).transfer(instadappLiteAddress, depositPrincipalStEth);
            const sEndAmount = await sEnd.connect(signer3).balanceOf(signer3.address);
            await enderStaking.connect(signer3).unstake(sEndAmount);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).transfer(instadappLiteAddress, depositPrincipalStEth);
            await withdrawAndSetup(signer1, tokenId);
            console.log("Withdraw");
            await withdrawAndSetup(signer4, tokenId2);
        });

        it("Ender protocol scenario 5:- BondFee is 0.01% and maturity is 90 days", async () => {
            const maturity = 45;
            const bondFee = 1;
            const depositAmountEnd = expandToDecimals(5, 18);
            const depositPrincipalStEth = expandToDecimals(1, 18);

            const endTransfer = expandToDecimals(1, 18);
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
            console.log(
                "get the stEth--------->>>>>>>",
                await stEth.connect(signer1).balanceOf(signer1.address),
            );

            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);
            await enderTreasury.setAddress(instadappLiteAddress, 5);
            await sleep(1200);

            console.log("-------------deposit 1-------------------");

            userSign = { user: signer1.address, key: "0", signature: sig };
            const tokenId = await depositAndSetup(
                enderBond,
                stEthAddress,
                signer1,
                depositPrincipalStEth,
                maturity,
                bondFee,
                userSign,
            );
            console.log("-------------deposit 1-------------------");

            await endToken.connect(signer1).transfer(signer2.address, "1000000000000000000");
            await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer2).approve(enderBondAddress, depositPrincipalStEth);

            console.log("-------------deposit 2-------------------");

            userSign = { user: signer2.address, key: "0", signature: sig_1 };

            const tokenId1 = await depositAndSetup(
                enderBond,
                stEthAddress,
                signer2,
                depositPrincipalStEth,
                maturity,
                bondFee,
                userSign,
            );
            console.log("-------------deposit 2-------------------");

            increaseTime(6000);
            await endToken.distributeRefractionFees();
            const initialBalanceOfuser = await endToken.balanceOf(signer1.address);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);
            await enderTreasury.setAddress(instadappLitelidoStaking, 5);
            await enderTreasury.setStrategy([instadappLitelidoStaking], true);
            await enderTreasury.setPriorityStrategy(instadappLitelidoStaking);
            await enderTreasury.depositInStrategy(
                stEthAddress,
                instadappLitelidoStaking,
                "2000000000000000000",
            );
            await increaseTime(20 * 600);
            console.log("-------------deposit 3-------------------");

            userSign = { user: signer1.address, key: "0", signature: sig };

            const tokenId2 = await depositAndSetup(
                enderBond,
                stEthAddress,
                signer1,
                depositPrincipalStEth,
                maturity,
                bondFee,
                userSign,
            );
            console.log(
                "---------------------------------------------------3rd-deposit-----------------------------------",
            );
            await enderTreasury.depositInStrategy(
                stEthAddress,
                instadappLitelidoStaking,
                depositPrincipalStEth,
            );
            expect(await bondNFT.ownerOf(tokenId2)).to.be.equal(await bondNFT.ownerOf(tokenId));
            await bondNFT.connect(signer1).transferFrom(signer1.address, signer4.address, tokenId2);

            //increasing the time 1 day
            increaseTime(600);
            const initalBalanceOfEnderBond = await endToken.balanceOf(enderBondAddress);
            const initialBalanceOfuser1 = await endToken.balanceOf(signer1.address);
            const userAddressBefore = await endToken.balanceOf(signer1.address);
            await endToken.connect(owner).mint(signer3.address, depositAmountEnd);
            await endToken.connect(signer3).approve(enderStakingAddress, depositAmountEnd);
            await sEnd.connect(owner).whitelist(enderStakingAddress, true);
            await sEnd.connect(owner).setStatus(2);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });

            userSign = { user: signer3.address, key: "0", signature: sig_2 };

            await enderStaking.connect(signer3).stake(depositAmountEnd, userSign);
            await increaseTime(14 * 600);
            await stEth.connect(signer1).transfer(instadappLiteAddress, depositPrincipalStEth);
            const sEndAmount = await sEnd.connect(signer3).balanceOf(signer3.address);
            await enderStaking.connect(signer3).unstake(sEndAmount);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).transfer(instadappLiteAddress, depositPrincipalStEth);
            await withdrawAndSetup(signer1, tokenId);
            console.log("Withdraw---------");
            await increaseTime(30 * 600);
            await enderBond.epochBondYieldShareIndex();
            await withdrawAndSetup(signer2, tokenId1);
        });

        it("Ender protocol scenario 5:- Multiple deposit with different-different bond fees and maturity", async () => {
            let maturity = 90;
            let bondFee = 1;
            const depositAmountEnd = expandToDecimals(5, 18);
            const depositPrincipalStEth = expandToDecimals(1, 18);

            const endTransfer = expandToDecimals(1, 18);
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
            console.log(
                "get the stEth--------->>>>>>>",
                await stEth.connect(signer1).balanceOf(signer1.address),
            );

            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);
            await enderTreasury.setAddress(instadappLiteAddress, 5);
            await sleep(1200);

            userSign = { user: signer1.address, key: "0", signature: sig };

            const tokenId = await depositAndSetup(
                enderBond,
                stEthAddress,
                signer1,
                depositPrincipalStEth,
                maturity,
                bondFee,
                userSign,
            );
            await endToken.connect(signer1).transfer(signer2.address, "1000000000000000000");
            await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer2).approve(enderBondAddress, depositPrincipalStEth);

            bondFee = 10000;
            maturity = 7;

            userSign = { user: signer2.address, key: "0", signature: sig_1 };

            const tokenId1 = await depositAndSetup(
                enderBond,
                stEthAddress,
                signer2,
                depositPrincipalStEth,
                maturity,
                bondFee,
                userSign,
            );
            increaseTime(6000);
            await endToken.distributeRefractionFees();
            const initialBalanceOfuser = await endToken.balanceOf(signer1.address);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);
            await enderTreasury.setAddress(instadappLitelidoStaking, 5);
            await enderTreasury.setStrategy([instadappLitelidoStaking], true);
            await enderTreasury.setPriorityStrategy(instadappLitelidoStaking);
            await enderTreasury.depositInStrategy(
                stEthAddress,
                instadappLitelidoStaking,
                "2000000000000000000",
            );
            await increaseTime(20 * 600);

            bondFee = 5000;
            maturity = 50;

            userSign = { user: signer1.address, key: "0", signature: sig };

            const tokenId2 = await depositAndSetup(
                enderBond,
                stEthAddress,
                signer1,
                depositPrincipalStEth,
                maturity,
                bondFee,
                userSign,
            );
            await enderTreasury.depositInStrategy(
                stEthAddress,
                instadappLitelidoStaking,
                depositPrincipalStEth,
            );
            console.log(
                "---------------------------------------------------3rd-deposit-----------------------------------",
            );
            expect(await bondNFT.ownerOf(tokenId2)).to.be.equal(await bondNFT.ownerOf(tokenId));
            await bondNFT.connect(signer1).transferFrom(signer1.address, signer4.address, tokenId2);

            //increasing the time 1 day
            increaseTime(600);
            const initalBalanceOfEnderBond = await endToken.balanceOf(enderBondAddress);
            const initialBalanceOfuser1 = await endToken.balanceOf(signer1.address);
            const userAddressBefore = await endToken.balanceOf(signer1.address);
            await endToken.connect(owner).mint(signer3.address, depositAmountEnd);
            await endToken.connect(signer3).approve(enderStakingAddress, depositAmountEnd);
            await sEnd.connect(owner).whitelist(enderStakingAddress, true);
            await sEnd.connect(owner).setStatus(2);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });

            userSign = { user: signer3.address, key: "0", signature: sig_2 };
            await enderStaking.connect(signer3).stake(depositAmountEnd, userSign);
            await increaseTime(90 * 600);
            // await stEth.connect(signer1).transfer(instadappLiteAddress, depositPrincipalStEth);
            const sEndAmount = await sEnd.connect(signer3).balanceOf(signer3.address);
            await enderStaking.connect(signer3).unstake(sEndAmount);

            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            // await stEth.connect(signer1).transfer(instadappLiteAddress, depositPrincipalStEth)
            // await withdrawAndSetup(signer1, tokenId);
            // console.log("Withdraw");
            // await withdrawAndSetup(signer4, tokenId2);
        });

        it("Deposit Revert InvalidAmount()", async () => {
            let maturity = 90;
            let bondFee = 1;
            const depositAmountEnd = expandToDecimals(5, 18);
            // const depositPrincipalStEth = expandToDecimals(1);
            const depositPrincipalStEth = 100000000000000;
            await endToken.setFee(20);

            expect(await enderBond.rewardShareIndex()).to.be.equal(0);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            console.log(
                "get the stEth--------->>>>>>>",
                await stEth.connect(signer1).balanceOf(signer1.address),
            );

            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

            await enderTreasury.setAddress(instadappLiteAddress, 5);
            await sleep(1200);

            userSign = { user: signer1.address, key: "0", signature: sig };
            await expect(
                enderBond
                    .connect(signer1)
                    .deposit(
                        signer1.address,
                        depositPrincipalStEth,
                        maturity,
                        bondFee,
                        stEthAddress,
                        userSign,
                    ),
            ).to.be.revertedWithCustomError(enderBond, "InvalidAmount");
        });

        it("Deposit Revert NotBondableToken() ", async () => {
            let maturity = 90;
            let bondFee = 1;
            const depositAmountEnd = expandToDecimals(5, 18);
            const depositPrincipalStEth = expandToDecimals(1, 18);
            await endToken.setFee(20);

            expect(await enderBond.rewardShareIndex()).to.be.equal(0);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            console.log(
                "get the stEth--------->>>>>>>",
                await stEth.connect(signer1).balanceOf(signer1.address),
            );

            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

            await enderTreasury.setAddress(instadappLiteAddress, 5);
            await sleep(1200);

            userSign = { user: signer.address, key: "0", signature: sig };
            await expect(
                enderBond
                    .connect(signer1)
                    .deposit(
                        signer1.address,
                        depositPrincipalStEth,
                        maturity,
                        bondFee,
                        endToken,
                        userSign,
                    ),
            ).to.be.revertedWithCustomError(enderBond, "NotBondableToken");
        });

        it("Deposit Revert InvalidAmount by Sending Ether", async () => {
            let maturity = 90;
            let bondFee = 1;
            const depositAmountEnd = expandToDecimals(5, 18);
            const depositPrincipalStEth = expandToDecimals(1, 18);
            await endToken.setFee(20);

            expect(await enderBond.rewardShareIndex()).to.be.equal(0);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            console.log(
                "get the stEth--------->>>>>>>",
                await stEth.connect(signer1).balanceOf(signer1.address),
            );

            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

            await enderTreasury.setAddress(instadappLiteAddress, 5);
            await sleep(1200);

            userSign = { user: signer.address, key: "0", signature: sig };
            await expect(
                enderBond
                    .connect(signer1)
                    .deposit(
                        signer1.address,
                        depositPrincipalStEth,
                        maturity,
                        bondFee,
                        sEndTokenAddress,
                        userSign,
                    ),
            ).to.be.revertedWithCustomError(enderBond, "NotBondableToken");
        });

        it("Ender Bond:- setDepositEnable", async () => {
            await enderBond.setDepositEnable(true);
            const depositEnable = await enderBond.depositEnable();
            expect(depositEnable).to.eq(true);
        });

        it("Ender Bond:- setDepositEnable revert with invalid caller", async () => {
            await expect(enderBond.connect(signer2).setDepositEnable(true)).to.be.revertedWith(
                "Ownable: caller is not the owner",
            );
        });

        it("Ender Bond:- setWithdrawPause", async () => {
            await enderBond.setWithdrawPause(true);
            const isWithdrawPause = await enderBond.isWithdrawPause();
            expect(isWithdrawPause).to.eq(true);
        });

        it("Ender Bond:- setWithdrawPause revert with invalid caller", async () => {
            await expect(enderBond.connect(signer2).setWithdrawPause(true)).to.be.revertedWith(
                "Ownable: caller is not the owner",
            );
        });

        it("Ender Bond:- setBondPause", async () => {
            await enderBond.setBondPause(true);
            const bondPause = await enderBond.bondPause();
            expect(bondPause).to.eq(true);
        });
        it("Ender Bond:- setBondPause revert with invalid caller", async () => {
            await expect(enderBond.connect(signer2).setBondPause(true)).to.be.rejectedWith(
                "Ownable: caller is not the owner",
            );
        });

        it("Ender Bond:- setWhitelist", async () => {
            await enderBond.whitelist(true);
            const isWhitelisted = await enderBond.isWhitelisted();
            expect(isWhitelisted).to.eq(true);
        });
        it("Ender Bond:- setWhitelist revert with invalid caller", async () => {
            await expect(enderBond.connect(signer2).whitelist(true)).to.be.rejectedWith(
                "Ownable: caller is not the owner",
            );
        });
        it("Ender Treasury:- setBondYieldBaseRate", async () => {
            const newBondYieldBaseRate = 50;
            await enderTreasury.setBondYieldBaseRate(newBondYieldBaseRate);
            const bondYieldBaseRate = await enderTreasury.bondYieldBaseRate();
            expect(bondYieldBaseRate).to.eq(newBondYieldBaseRate);
        });
        it("Ender Treasury:- setBondYieldBaseRate revert with invalid caller", async () => {
            await expect(
                enderTreasury.connect(signer2).setBondYieldBaseRate(50),
            ).to.be.rejectedWith("Ownable: caller is not the owner");
        });

        it("Ender Treasury:- setBondYieldBaseRate revert with InvalidBaseRate", async () => {
            await expect(enderTreasury.setBondYieldBaseRate(0)).to.be.revertedWithCustomError(
                enderTreasury,
                "InvalidBaseRate",
            );
        });

        it("Ender Treasury:- setNominalYield revert with invalid caller", async () => {
            await expect(enderTreasury.connect(signer2).setNominalYield(50)).to.be.revertedWith(
                "Ownable: caller is not the owner",
            );
        });
        it("Ender Treasury:- setNominalYield", async () => {
            const newNominalYield = 50;
            await enderTreasury.setNominalYield(newNominalYield);
            const nominalYield = await enderTreasury.nominalYield();
            expect(nominalYield).to.eq(newNominalYield);
        });

        it("Ender Treasury:- setNominalYield revert with invaild owner", async () => {
            await expect(enderTreasury.connect(signer2).setNominalYield(50)).to.be.revertedWith(
                "Ownable: caller is not the owner",
            );
        });

        it("Ender staking:- setStakingEnable", async () => {
            await enderStaking.setStakingEnable(true);
            const stakingEnable = await enderStaking.stakingEnable();
            expect(stakingEnable).to.eq(true);
        });

        it("Ender staking:- setStakingEnable revert with invaild owner", async () => {
            await expect(enderStaking.connect(signer2).setStakingEnable(true)).to.be.revertedWith(
                "Ownable: caller is not the owner",
            );
        });

        it("Ender staking:- setUnstakeEnable", async () => {
            await enderStaking.setUnstakeEnable(true);
            const unstakeEnable = await enderStaking.unstakeEnable();
            expect(unstakeEnable).to.eq(true);
        });

        it("Ender staking:- setUnstakeEnable revert with invaild owner", async () => {
            await expect(enderStaking.connect(signer2).setUnstakeEnable(true)).to.be.revertedWith(
                "Ownable: caller is not the owner",
            );
        });
        it("Ender staking:- setStakingPause", async () => {
            await enderStaking.setStakingPause(true);
            const stakingContractPause = await enderStaking.stakingContractPause();
            expect(stakingContractPause).to.eq(true);
        });
        it("Ender staking:- setStakingPause revert with invaild owner", async () => {
            await expect(enderStaking.connect(signer2).setStakingPause(true)).to.be.revertedWith(
                "Ownable: caller is not the owner",
            );
        });

        it("Ender staking:- setsigner", async () => {
            await enderStaking.setsigner(signer2.address);
            const contractSinger = await enderStaking.contractSigner();
            expect(contractSinger).to.eq(signer2.address);
        });

        it("Ender staking:- setsigner revert with invaild owner", async () => {
            await expect(
                enderStaking.connect(signer2).setsigner(signer2.address),
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Ender staking:- setsigner revert with ZeroAddress", async () => {
            await expect(enderStaking.setsigner(ethers.ZeroAddress)).to.be.revertedWithCustomError(
                enderStaking,
                "ZeroAddress",
            );
        });
        it("Ender staking:- setBondRewardPercentage", async () => {
            await enderStaking.setBondRewardPercentage(10);
            const bondRewardPercentage = await enderStaking.bondRewardPercentage();
            expect(bondRewardPercentage).to.eq(10);
        });

        it("Ender staking:- setBondRewardPercentage revert with invaild owner", async () => {
            await expect(
                enderStaking.connect(signer2).setBondRewardPercentage(10),
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Ender staking:- setBondRewardPercentage revert with InvalidAmount", async () => {
            await expect(enderStaking.setBondRewardPercentage(0)).to.be.revertedWithCustomError(
                enderStaking,
                "InvalidAmount",
            );
        });
        it("Ender staking:- setWhitelist", async () => {
            await enderStaking.whitelist(false);
            const isWhitelisted = await enderStaking.isWhitelisted();
            expect(isWhitelisted).to.eq(false);
        });
        it("Ender staking:- setWhitelist revert with invalid caller", async () => {
            await expect(enderStaking.connect(signer2).whitelist(false)).to.be.rejectedWith(
                "Ownable: caller is not the owner",
            );
        });
    });

    async function withdrawAndSetup(signer: HardhatEthersSigner, tokenId: bigint) {
        await endToken.grantRole(MINTER_ROLE, enderTreasuryAddress);
        await enderBond.connect(signer).withdraw(tokenId);
    }
});
