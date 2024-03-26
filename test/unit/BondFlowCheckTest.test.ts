import { expect } from "chai";
import { Wallet } from "ethers";
import { ethers, upgrades } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

import { EndToken } from "../../typechain-types/contracts/ERC20/EndToken";
import { EnderStakeEth } from "../../typechain-types/contracts/ERC20/EnderStakeEth";
import { EnderBond } from "../../typechain-types/contracts/EnderBond";
import { EnderTreasury } from "../../typechain-types/contracts/EnderTreasury";
import { StETH } from "../../typechain-types/contracts/ERC20/mockStEth.sol/StETH";
import {
    depositAndSetup,
    expandToDecimals,
    increaseTime,
    signatureDigest,
    sleep,
} from "../utils/utils";
import { Deployer } from "../utils/deployer";

describe("EnderBond Deposit and Withdraw", function () {
    let owner: HardhatEthersSigner,
        signer: HardhatEthersSigner,
        signer1: HardhatEthersSigner,
        signer2: HardhatEthersSigner,
        signer3: HardhatEthersSigner,
        signer4: HardhatEthersSigner;

    let endTokenAddress,
        enderBondAddress: string,
        enderTreasuryAddress: string,
        stEthAddress: string,
        instadappLiteAddress: string;

    let endToken: EndToken,
        enderBond: EnderBond,
        enderTreasury: EnderTreasury,
        enderStaking,
        sEnd,
        sEndTokenAddress,
        stEth: StETH,
        oracle,
        oracleAddress;
    let stEthBlanceOfTreasury: bigint, userSign: EnderBond.SignDataStruct, sig1: string;

    const deployer = new Deployer();

    before(async function () {
        [owner, signer, signer1, signer2, signer3, signer4] = await ethers.getSigners();
        const contracts = await deployer.prepareEndBondTest({
            owner: owner.address,
            signer: signer.address,
        });

        stEth = contracts.stEth;
        stEthAddress = contracts.stEthAddr;

        sEnd = contracts.sEndToken;
        sEndTokenAddress = contracts.sEndTokenAddr;

        instadappLiteAddress = contracts.instadappLiteAddress;

        endToken = contracts.endToken;
        endTokenAddress = contracts.endTokenAddr;

        const Oracle = await ethers.getContractFactory("EnderOracle");
        oracle = await upgrades.deployProxy(Oracle, [], {
            initializer: "initialize",
        });
        oracleAddress = await oracle.getAddress();

        enderBond = contracts.enderBond;
        enderBondAddress = contracts.enderBondAddress;

        enderStaking = contracts.enderStaking;

        enderTreasury = contracts.enderTreasury;
        enderTreasuryAddress = contracts.enderTreasuryAddress;

        await enderBond.whitelist(false);

        sig1 = await signatureDigest(signer, "bondContract", enderBondAddress, signer1);
    });

    describe("deposit and withdraw", async () => {
        it("scenario 1", async () => {
            console.log("Inside my First Test Case ");
            const maturity = 90;
            const bondFee = 500;
            const depositAmountEnd = expandToDecimals(5, 18);
            const depositPrincipalStEth = expandToDecimals(1, 18);

            const endTransfer = expandToDecimals(1, 18);
            await endToken.setFee(20);

            //mint to signer1
            //   await endToken.connect(owner).mint(signer1.address, depositAmountEnd);

            //first transfer
            //   await endToken.connect(signer1).transfer(signer2.address, endTransfer);

            //second transfer
            //   await endToken.connect(signer1).transfer(signer2.address, endTransfer);

            expect(await endToken.balanceOf(enderBondAddress)).to.be.equal(0);

            expect(await enderBond.rewardShareIndex()).to.be.equal(0);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1") });
            console.log(
                "get the stEth--------->>>>>>>",
                await stEth.connect(signer1).balanceOf(signer1.address),
            );
            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

            await enderTreasury.setAddress(instadappLiteAddress, 5);
            await sleep(100);

            userSign = {
                user: signer1.address,
                key: "1234",
                signature: sig1,
            };

            await ethers.provider.send("evm_increaseTime", [600]); // 86400 seconds = 1 day
            await ethers.provider.send("evm_mine");

            const tokenId = await depositAndSetup(
                enderBond,
                stEthAddress,
                signer1,
                depositPrincipalStEth,
                maturity,
                bondFee,
                userSign,
            );
        });

        it("scenario 2", async () => {
            console.log("Inside my First Test Case ");
            const maturity = 90;
            const bondFee = 9999;
            const depositAmountEnd = expandToDecimals(5, 18);
            const depositPrincipalStEth = expandToDecimals(1, 18);

            const endTransfer = expandToDecimals(1, 18);
            await endToken.setFee(20);

            expect(await endToken.balanceOf(enderBondAddress)).to.be.equal(0);

            expect(await enderBond.rewardShareIndex()).to.be.equal(0);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1") });
            console.log(
                "get the stEth--------->>>>>>>",
                await stEth.connect(signer1).balanceOf(signer1.address),
            );
            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

            await enderTreasury.setAddress(instadappLiteAddress, 5);
            await sleep(100);

            userSign = {
                user: signer1.address,
                key: "1234",
                signature: sig1,
            };

            await ethers.provider.send("evm_increaseTime", [600]); // 86400 seconds = 1 day
            await ethers.provider.send("evm_mine");

            const tokenId = await depositAndSetup(
                enderBond,
                stEthAddress,
                signer1,
                depositPrincipalStEth,
                maturity,
                bondFee,
                userSign,
            );
        });

        it("scenario 3", async () => {
            console.log("Inside my First Test Case ");
            const maturity = 90;
            const bondFee = 0;
            const depositAmountEnd = expandToDecimals(5, 18);
            const depositPrincipalStEth = expandToDecimals(1, 18);

            const endTransfer = expandToDecimals(1, 18);
            await endToken.setFee(20);

            expect(await endToken.balanceOf(enderBondAddress)).to.be.equal(0);

            expect(await enderBond.rewardShareIndex()).to.be.equal(0);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1") });
            console.log(
                "get the stEth--------->>>>>>>",
                await stEth.connect(signer1).balanceOf(signer1.address),
            );
            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

            await enderTreasury.setAddress(instadappLiteAddress, 5);
            await sleep(120);

            userSign = {
                user: signer1.address,
                key: "1234",
                signature: sig1,
            };

            await ethers.provider.send("evm_increaseTime", [600]); // 86400 seconds = 1 day
            await ethers.provider.send("evm_mine");

            const tokenId = await depositAndSetup(
                enderBond,
                stEthAddress,
                signer1,
                depositPrincipalStEth,
                maturity,
                bondFee,
                userSign,
            );
        });

        it("scenario 4", async () => {
            const maturity = 7;
            const bondFee = 0;
            const depositAmountEnd = expandToDecimals(5, 18);
            const depositPrincipalStEth = expandToDecimals(1, 18);

            const endTransfer = expandToDecimals(1, 18);
            await endToken.setFee(20);
            expect(await endToken.balanceOf(enderBondAddress)).to.be.equal(0);

            expect(await enderBond.rewardShareIndex()).to.be.equal(0);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1") });
            console.log(
                "get the stEth--------->>>>>>>",
                await stEth.connect(signer1).balanceOf(signer1.address),
            );
            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

            await enderTreasury.setAddress(instadappLiteAddress, 5);
            await sleep(1200);

            userSign = {
                user: signer1.address,
                key: "1234",
                signature: sig1,
            };

            await ethers.provider.send("evm_increaseTime", [600]); // 86400 seconds = 1 day
            await ethers.provider.send("evm_mine");

            const tokenId = await depositAndSetup(
                enderBond,
                stEthAddress,
                signer1,
                depositPrincipalStEth,
                maturity,
                bondFee,
                userSign,
            );
        });

        it("Withdraw senerio 1 Matuarity 5 days and bondFee 0 ", async () => {
            console.log("Inside my First Test Case ");
            const maturity = 90;
            const bondFee = 500;
            const depositAmountEnd = expandToDecimals(5, 18);
            const depositPrincipalStEth = expandToDecimals(1, 18);

            const endTransfer = expandToDecimals(1, 18);
            // await endToken.setFee(20);

            expect(await endToken.balanceOf(enderBondAddress)).to.be.equal(0);

            expect(await enderBond.rewardShareIndex()).to.be.equal(0);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1") });
            console.log(
                "get the stEth--------->>>>>>>",
                await stEth.connect(signer1).balanceOf(signer1.address),
            );
            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

            await enderTreasury.setAddress(instadappLiteAddress, 5);
            userSign = {
                user: signer1.address,
                key: "1234",
                signature: sig1,
            };

            await ethers.provider.send("evm_increaseTime", [600]); // 86400 seconds = 1 day
            await ethers.provider.send("evm_mine");

            const tokenId = await depositAndSetup(
                enderBond,
                stEthAddress,
                signer1,
                depositPrincipalStEth,
                maturity,
                bondFee,
                userSign,
            );

            stEthBlanceOfTreasury = await stEth.balanceOf(enderTreasury.target);
            console.log("stEthBlanceOfTreasury", stEthBlanceOfTreasury);

            // await increaseTime(60000);
            // await enderBond.connect(signer1).withdraw(tokenId);
            // balanceOfstEth = await stEth.balanceOf(signer1.address);
            // console.log("balanceOfstEth",balanceOfstEth);
            // balanceOfEndToken = await endToken.balanceOf(signer1.address);
            // console.log("balanceOfEndToken",balanceOfEndToken);

            // stEthBlanceOfTreasury = await stEth.balanceOf(enderTreasury.target);
            // console.log("stEthBlanceOfTreasury",stEthBlanceOfTreasury);
        });

        it("GasLoop", async () => {
            console.log("Inside my First Test Case ");
            const maturity = 90;
            const bondFee = 500;
            const depositAmountEnd = expandToDecimals(5, 18);
            const depositPrincipalStEth = expandToDecimals(1, 18);

            const endTransfer = expandToDecimals(1, 18);
            // await endToken.setFee(20);

            expect(await endToken.balanceOf(enderBondAddress)).to.be.equal(0);

            expect(await enderBond.rewardShareIndex()).to.be.equal(0);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("101") });
            console.log(
                "get the stEth--------->>>>>>>",
                await stEth.connect(signer1).balanceOf(signer1.address),
            );
            await stEth.connect(signer1).approve(enderBondAddress, ethers.parseEther("101"));

            await enderTreasury.setAddress(instadappLiteAddress, 5);
            userSign = {
                user: signer1.address,
                key: "1234",
                signature: sig1,
            };

            await ethers.provider.send("evm_increaseTime", [600]); // 86400 seconds = 1 day
            await ethers.provider.send("evm_mine");

            for (let i = 0; i < 100; i++) {
                const tokenId = await depositAndSetup(
                    enderBond,
                    stEthAddress,
                    signer1,
                    depositPrincipalStEth,
                    maturity,
                    bondFee,
                    userSign,
                );
            }
            await increaseTime(60000);

            await enderBond.getLoopCount();

            stEthBlanceOfTreasury = await stEth.balanceOf(enderTreasury.target);
            console.log("stEthBlanceOfTreasury", stEthBlanceOfTreasury);
        });

        it("Claim Reward ", async () => {
            console.log("Inside my First Test Case ");
            const maturity = 90;
            const bondFee = 500;
            const depositAmountEnd = expandToDecimals(5, 18);
            const depositPrincipalStEth = expandToDecimals(5, 18);

            const endTransfer = expandToDecimals(1, 18);
            // await endToken.setFee(20);

            expect(await endToken.balanceOf(enderBondAddress)).to.be.equal(0);

            expect(await enderBond.rewardShareIndex()).to.be.equal(0);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("101") });
            console.log(
                "get the stEth--------->>>>>>>",
                await stEth.connect(signer1).balanceOf(signer1.address),
            );
            await stEth.connect(signer1).approve(enderBondAddress, ethers.parseEther("5"));

            await enderTreasury.setAddress(instadappLiteAddress, 5);
            userSign = {
                user: signer1.address,
                key: "1234",
                signature: sig1,
            };
            // mint to signer1
            await endToken.connect(owner).mint(signer1.address, depositAmountEnd);

            await ethers.provider.send("evm_increaseTime", [600]);
            await ethers.provider.send("evm_mine");

            const tokenId = await depositAndSetup(
                enderBond,
                stEthAddress,
                signer1,
                depositPrincipalStEth,
                maturity,
                bondFee,
                userSign,
            );
            // first transfer
            // await endToken.connect(signer1).transfer(signer2.address, endTransfer);

            // // second transfer
            // await endToken.connect(signer1).transfer(signer2.address, endTransfer);

            // await endToken.connect(signer1).transfer(signer2.address,endTransfer);

            // await endToken.connect(signer1).transfer(signer2.address,endTransfer);

            // await endToken.connect(signer1).transfer(signer2.address,endTransfer);

            await increaseTime(6000);

            await enderBond.connect(signer1).claimRewards(tokenId);
            await enderBond.connect(signer1).claimRewards(tokenId);

            stEthBlanceOfTreasury = await stEth.balanceOf(enderTreasury.target);
            console.log("stEthBlanceOfTreasury", stEthBlanceOfTreasury);
        });

        it("Deposit Revert InvalidAmount()", async () => {
            let maturity = 90;
            let bondFee = 1;
            const depositAmountEnd = expandToDecimals(5, 18);
            const depositPrincipalStEth = expandToDecimals(1, 18);
            // const depositPrincipalStEth = 10000000000
            await endToken.setFee(20);

            expect(await enderBond.rewardShareIndex()).to.be.equal(0);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            console.log(
                "get the stEth--------->>>>>>>",
                await stEth.connect(signer1).balanceOf(signer1.address),
            );

            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

            await enderTreasury.setAddress(instadappLiteAddress, 5);
            userSign = {
                user: signer1.address,
                key: "0",
                signature: sig1,
            };

            await expect(
                enderBond
                    .connect(signer1)
                    .deposit(signer1.address, 10000, maturity, bondFee, stEthAddress, userSign),
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
            userSign = {
                user: signer1.address,
                key: "0",
                signature: sig1,
            };

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

            userSign = {
                user: signer1.address,
                key: "0",
                signature: sig1,
            };

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
                        { value: ethers.parseEther("1.0") },
                    ),
            ).to.be.revertedWithCustomError(enderBond, "NotBondableToken");
        });

        it("Deposit Revert for InvalidBondFees()", async () => {
            let maturity = 90;
            let bondFee = 1000000;
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

            userSign = {
                user: signer1.address,
                key: "0",
                signature: sig1,
            };

            await expect(
                enderBond
                    .connect(signer1)
                    .deposit(
                        signer1.address,
                        depositPrincipalStEth,
                        maturity,
                        bondFee,
                        stEth,
                        userSign,
                    ),
            ).to.be.revertedWithCustomError(enderBond, "InvalidBondFee");
        });
    });
});
