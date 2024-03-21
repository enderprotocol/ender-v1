import { expect } from "chai";
import { Wallet } from "ethers";
import { ethers, upgrades } from "hardhat";
import { StETH } from "../../typechain-types/contracts/ERC20/mockStEth.sol/StETH";
import { EnderBond } from "../../typechain-types/contracts/EnderBond";
import { EndToken } from "../../typechain-types/contracts/ERC20/EndToken";
import { SEndToken } from "../../typechain-types/contracts/ERC20/SEndToken";
import { EnderTreasury } from "../../typechain-types/contracts/EnderTreasury";
import { StinstaToken } from "../../typechain-types/contracts/strategy/instadapp/instadappLite.sol";
import { EnderStaking } from "../../typechain-types/contracts/EnderStaking";

const baseURI = "https://endworld-backend-git-dev-metagaming.vercel.app/nft/metadata/";
const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
const ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";

function expandTo18Decimals(n: number) {
    return ethers.parseUnits(n.toString(), 18);
}

function expandTo15Decimals(n: number) {
    return ethers.parseUnits(n.toString(), 15);
}

describe("Ender Bond deposit and withdraw", async () => {
    let owner: Wallet,
        signer: Wallet,
        signer1: Wallet,
        signer2: Wallet,
        signer3: Wallet,
        signer4: Wallet,
        signer5: Wallet,
        stEthAddress: string,
        enderBondAddress: string,
        enderBondLiquidityDepositAddress: string,
        endTokenAddress,
        endETHAddress,
        sEndTokenAddress,
        enderTreasuryAddress: string,
        bondNFTAddress,
        instadappLiteAddress: string,
        enderStakingAddress: string,
        stEth: StETH,
        enderBond: EnderBond,
        enderBondLiquidityDeposit,
        endToken: EndToken,
        endETHToken,
        sEndToken: SEndToken,
        enderTreasury: EnderTreasury,
        bondNFT,
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

    before(async function () {
        const stEthFactory = await ethers.getContractFactory("StETH");
        const instadappLiteFactory = await ethers.getContractFactory("StinstaToken");
        const endTokenFactory = await ethers.getContractFactory("EndToken");
        const enderBondLiquidityBondFactory = await ethers.getContractFactory(
            "EnderBondLiquidityDeposit",
        );
        const enderBondFactory = await ethers.getContractFactory("EnderBond");
        const enderTreasuryFactory = await ethers.getContractFactory("EnderTreasury");
        const enderStakingFactory = await ethers.getContractFactory("EnderStaking");
        const sEndTokenFactory = await ethers.getContractFactory("SEndToken");
        const bondNftFactory = await ethers.getContractFactory("BondNFT");
        const EndETHToken = await ethers.getContractFactory("EnderStakeEth");

        //Owner and signers addresses
        [owner, signer, signer1, signer2, signer3, signer4, signer5] =
            (await ethers.getSigners()) as unknown as Wallet[];

        //delpoy stEth
        stEth = (await stEthFactory.deploy()) as unknown as StETH;
        stEthAddress = await stEth.getAddress();

        //deploy sEnd
        sEndToken = (await upgrades.deployProxy(sEndTokenFactory, [], {
            initializer: "initialize",
        })) as unknown as SEndToken;
        sEndTokenAddress = await sEndToken.connect(owner).getAddress();

        //deploy enderBondLiquidityDeposit
        enderBondLiquidityDeposit = await upgrades.deployProxy(
            enderBondLiquidityBondFactory,
            [stEthAddress, stEthAddress, owner.address, owner.address],
            {
                initializer: "initialize",
            },
        );
        enderBondLiquidityDepositAddress = await enderBondLiquidityDeposit.getAddress();

        //deploy insta app Lido Staking
        instadappLitelidoStaking = (await instadappLiteFactory.deploy(
            "InstaToken",
            "Inst",
            owner.address,
            stEthAddress,
        )) as unknown as StinstaToken;
        instadappLiteAddress = await instadappLitelidoStaking.getAddress();

        //deploy endToken
        endToken = (await upgrades.deployProxy(endTokenFactory, [], {
            initializer: "initialize",
        })) as unknown as EndToken;
        endTokenAddress = await endToken.getAddress();

        // deploy endETH token
        endETHToken = await upgrades.deployProxy(EndETHToken, [], {
            initializer: "initialize"
        });
        endETHAddress = await endETHToken.getAddress();

        //deploy enderBond
        enderBond = (await upgrades.deployProxy(
            enderBondFactory,
            [endTokenAddress, endETHAddress, ethers.ZeroAddress, signer.address],
            {
                initializer: "initialize",
            },
        )) as unknown as EnderBond;
        enderBondAddress = await enderBond.getAddress();

        //set enderBond address in endToken
        await endToken.setBond(enderBondAddress);

        //deploy ender Staking contract
        enderStaking = (await upgrades.deployProxy(
            enderStakingFactory,
            [endTokenAddress, sEndTokenAddress, stEthAddress, signer.address],
            {
                initializer: "initialize",
            },
        )) as unknown as EnderStaking;
        enderStakingAddress = await enderStaking.getAddress();

        //deploy ender Treasury contract
        enderTreasury = (await upgrades.deployProxy(
            enderTreasuryFactory,
            [
                endTokenAddress,
                enderStakingAddress,
                enderBondAddress,
                instadappLiteAddress,
                ethers.ZeroAddress,
                ethers.ZeroAddress,
                70,
                30,
            ],
            {
                initializer: "initializeTreasury",
            },
        )) as unknown as EnderTreasury;
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
        await endToken.grantRole(
            "0xe13c49f41ace7b3f26b0cf23ab168b4c48591998827e86cfa78a62930e4d6953",
            enderBondAddress,
        );
        await endToken.grantRole(
            "0xe13c49f41ace7b3f26b0cf23ab168b4c48591998827e86cfa78a62930e4d6953",
            owner.address,
        );

        await enderBond.setBool(true);

        await endETHToken.setTreasury(enderTreasuryAddress);
        await endETHToken.grantRole(MINTER_ROLE, enderBondAddress);

        await enderTreasury.setAddress(instadappLitelidoStaking, 5);
        await enderTreasury.setStrategy([instadappLitelidoStaking], true);
        await enderTreasury.setPriorityStrategy(instadappLitelidoStaking);

        //signature
        signature1 = await signatureDigest();
        signature2 = await signatureDigest1();
        signature3 = await signatureDigest2();
        stakingSignature1 = await signatureDigestStaking1();
    });

    describe("TESTCASES", async () => {
        it("Simple 1 deposit, mature, withdraw", async () => {
            const maturity = 90;
            const bondFee = 500;
            const depositPrincipalStEth = expandTo18Decimals(1);

            //mint stEth to signer1 and approve enderBond
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

            userSign = {
                user: signer1.address,
                key: "0",
                signature: signature1
            };

            //deposit by signer1
            expect(
                (tokenId1 = await depositAndSetup(
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
            const depositPrincipalStEth = expandTo18Decimals(1);

            //mint stEth to signer1 and approve enderBond
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

            userSign = {
                user: signer1.address,
                key: "0",
                signature: signature1
            };

            //deposit by signer1
            expect(
                (tokenId1 = await depositAndSetup(
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
            const depositAmountEnd = expandTo18Decimals(5);
            const depositPrincipalStEth = expandTo18Decimals(1);

            //mint stEth to signer1 and approve enderBond
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

            userSign = {
                user: signer1.address,
                key: "0",
                signature: signature1
            };

            //deposit by signer1
            expect(
                (tokenId1 = await depositAndSetup(
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
            const depositPrincipalStEth = expandTo18Decimals(1);

            //mint stEth to signer1 and approve enderBond
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

            userSign = {
                user: signer1.address,
                key: "0",
                signature: signature1
            };

            //deposit by signer1
            expect(
                (tokenId1 = await depositAndSetup(
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
            const depositPrincipalStEth = expandTo18Decimals(1);

            //mint stEth to signer1 and approve enderBond
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

            userSign = {
                user: signer1.address,
                key: "0",
                signature: signature1
            };

            //deposit by signer1
            expect(
                (tokenId1 = await depositAndSetup(
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
            const depositPrincipalStEth = expandTo18Decimals(1);

            //mint stEth to signer1 and approve enderBond
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

            userSign = {
                user: signer1.address,
                key: "0",
                signature: signature1
            };

            //deposit by signer1
            expect(
                (tokenId1 = await depositAndSetup(
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
            await expect(enderBond.connect(signer1).withdraw(tokenId1)).to.be.revertedWithCustomError(
                enderBond,
                "BondNotMatured",
            );
        });

        it("Simple 3 deposits, matures, withdraws", async () => {
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

            userSign = {
                user: signer1.address,
                key: "0",
                signature: signature1
            };

            //deposit by signer1
            expect(
                (tokenId1 = await depositAndSetup(
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

            userSign = {
                user: signer2.address,
                key: "0",
                signature: signature2
            };

            //deposit by signer2
            expect(
                (tokenId2 = await depositAndSetup(
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

            userSign = {
                user: signer3.address,
                key: "0",
                signature: signature3
            };

            //deposit by signer3
            expect(
                (tokenId3 = await depositAndSetup(
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
            const depositAmountEnd = expandTo18Decimals(5);
            const depositPrincipalStEth = expandTo18Decimals(1);

            //mint stEth to signer1 and approve enderBond
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

            userSign = {
                user: signer1.address,
                key: "0",
                signature: signature1
            };

            //deposit by signer1
            expect(
                (tokenId1 = await depositAndSetup(
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

            userSign = {
                user: signer2.address,
                key: "0",
                signature: signature2
            };

            //deposit by signer2
            expect(
                (tokenId2 = await depositAndSetup(
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
            const depositAmountEnd = expandTo18Decimals(5);
            const depositPrincipalStEth = expandTo18Decimals(1);

            //mint stEth to signer1 and approve enderBond
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

            userSign = {
                user: signer1.address,
                key: "0",
                signature: signature1
            };

            //deposit by signer1
            expect(
                (tokenId1 = await depositAndSetup(
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

            userSign = {
                user: signer1.address,
                key: "0",
                signature: stakingSignature1
            };

            //stake
            await enderStaking
                .connect(signer1)
                .stake(stakeAmount, userSign);

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
            const depositPrincipalStEth = expandTo18Decimals(1);
            const depositAmountEnd = expandTo18Decimals(5);

            //mint stEth to signer1 and approve enderBond
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

            userSign = {
                user: signer1.address,
                key: "0",
                signature: signature1
            };

            /*<-------------------------deposit by signer1(1.1)------------------->*/
            expect(
                (tokenId_1_1 = await depositAndSetup(
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

            userSign = {
                user: signer1.address,
                key: "0",
                signature: signature1
            };

            /*<-------------------------deposit by signer1(1.2)------------------->*/
            expect(
                (tokenId_1_2 = await depositAndSetup(
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

            userSign = {
                user: signer2.address,
                key: "0",
                signature: signature2
            };

            /*<-------------------------deposit by signer1(1.2)------------------->*/
            expect(
                (tokenId_2_1 = await depositAndSetup(
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
                 signature: stakingSignature1
            };

            //stake
            await enderStaking
                .connect(signer1)
                .stake(stakeAmount, userSign);

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
                signature: stakingSignature1
            };

            //stake
            await enderStaking
                .connect(signer2)
                .stake(stakeAmount2, userSign);

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
                signature: signature2
            };

            /*<-------------------------deposit by signer1(1.2)------------------->*/
            expect(
                (await depositAndSetup(
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

            await increaseTime(90);
            await passEpoch(1);

            //withdraw
            console.log("<------------------Withdraw------------------>");
            await withdrawAndSetup(signer1, tokenId_1_1);
        });
    });

    async function depositAndSetup(
        signer: Wallet,
        depositAmount: bigint,
        maturity: number,
        bondFee: number,
        signData: EnderBond.SignDataStruct,
    ) {
        await enderBond
            .connect(signer)
            .deposit(signer, depositAmount, maturity, bondFee, stEthAddress, signData);
        const filter = enderBond.filters.Deposit;
        const events = await enderBond.queryFilter(filter, -1);

        const event1 = events[0];

        const args1 = event1.args;
        const tokenId = args1.tokenId;

        return tokenId;
    }

    async function withdrawAndSetup(signer:  Wallet, tokenId: bigint) {
        await endToken.grantRole(MINTER_ROLE, enderTreasuryAddress);
        await enderBond.connect(signer).withdraw(tokenId);
    }

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
                        name: "user",
                        type: "address",
                    },
                    {
                        name: "key",
                        type: "string",
                    },
                ],
            },
            {
                user: signer1.address,
                key: "0",
            },
        );
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
                        name: "user",
                        type: "address",
                    },
                    {
                        name: "key",
                        type: "string",
                    },
                ],
            },
            {
                user: signer2.address,
                key: "0",
            },
        );
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
                        name: "user",
                        type: "address",
                    },
                    {
                        name: "key",
                        type: "string",
                    },
                ],
            },
            {
                user: signer3.address,
                key: "0",
            },
        );
        return sig;
    }

    async function signatureDigestStaking1() {
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
                        name: "user",
                        type: "address",
                    },
                    {
                        name: "key",
                        type: "string",
                    },
                ],
            },
            {
                user: signer1.address,
                key: "0",
            },
        );
        return sig;
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
