import { expect } from "chai";
import { Wallet } from "ethers";
import { ethers, upgrades } from "hardhat";
import { EndToken } from "../../typechain-types/contracts/ERC20/EndToken";
import { EnderStakeEth } from "../../typechain-types/contracts/ERC20/EnderStakeEth";
import { EnderBond } from "../../typechain-types/contracts/EnderBond";
import { EnderTreasury } from "../../typechain-types/contracts/EnderTreasury";
import { EnderStaking } from "../../typechain-types/contracts/EnderStaking";
import { SEndToken } from "../../typechain-types/contracts/ERC20/SEndToken";
import { StETH } from "../../typechain-types/contracts/ERC20/mockStEth.sol/StETH";
import { BondNFT } from "../../typechain-types/contracts/NFT";
import { StinstaToken } from "../../typechain-types/contracts/strategy/instadapp/instadappLite.sol";

const signature = "0xA2fFDf332d92715e88a958A705948ADF75d07d01";
const baseURI = "https://endworld-backend-git-dev-metagaming.vercel.app/nft/metadata/";
const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
const ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";

function expandTo18Decimals(n: number) {
    return ethers.parseUnits(n.toString(), 18);
}

describe("EnderBond Deposit and Withdraw", function () {
    let owner: Wallet,
        signer: Wallet,
        signer1: Wallet,
        signer2: Wallet,
        signer3: Wallet,
        signer4: Wallet;
    let endTokenAddress,
        endETHAddress,
        enderBondAddress: string,
        enderBondLiquidityDepositAddress,
        enderTreasuryAddress: string,
        enderStakingAddress: string,
        sEndTokenAddress: string,
        stEthAddress: string,
        bondNFTAddress: string,
        mockWETHAddress,
        instadappLiteAddress: string;

    let endToken: EndToken,
        endETHToken: EnderStakeEth,
        enderBond: EnderBond,
        enderBondLiquidityDeposit,
        enderTreasury: EnderTreasury,
        enderELStrategy,
        enderStaking: EnderStaking,
        sEnd: SEndToken,        
        instadappLitelidoStaking: StinstaToken,
        WETH,
        stEth: StETH,
        bondNFT: BondNFT;
    let userSign: EnderBond.SignDataStruct,
        sig: string,
        sig_1: string,
        sig_2: string;
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
        const EndETHToken = await ethers.getContractFactory("EnderStakeEth");
        // const Oracle = await ethers.getContractFactory("EnderOracle");

        [owner, signer, signer1, signer2, signer3, signer4] = (await ethers.getSigners()) as unknown as Wallet[];

        stEth = (await StEth.deploy()) as unknown as StETH;
        stEthAddress = await stEth.getAddress();

        // sEnd = await SEnd.connect(owner).deploy();
        sEnd = (await upgrades.deployProxy(SEnd, [], {
            initializer: "initialize",
        })) as unknown as SEndToken;
        sEndTokenAddress = await sEnd.connect(owner).getAddress();

        enderBondLiquidityDeposit = await upgrades.deployProxy(
            EnderBondLiquidityBond,
            [stEthAddress, stEthAddress, owner.address, owner.address],
            {
                initializer: "initialize",
            },
        );

        instadappLitelidoStaking = (await InstadappLite.deploy(
            "InstaToken",
            "Inst",
            owner.address,
            stEthAddress,
        )) as unknown as StinstaToken;
        instadappLiteAddress = await instadappLitelidoStaking.getAddress();
        endToken = (await upgrades.deployProxy(EndToken, [], {
            initializer: "initialize",
        })) as unknown as EndToken;
        endTokenAddress = await endToken.getAddress();

        endETHToken = (await upgrades.deployProxy(EndETHToken, [], {
            initializer: "initialize",
        })) as unknown as EnderStakeEth;
        endETHAddress = await endETHToken.getAddress();

        enderBond = (await upgrades.deployProxy(
            EnderBond,
            [endTokenAddress, endETHAddress, ethers.ZeroAddress, signer.address],
            {
                initializer: "initialize",
            },
        )) as unknown as EnderBond;

        enderBondAddress = await enderBond.getAddress();

        await endToken.setBond(enderBondAddress);

        enderStaking = (await upgrades.deployProxy(
            EnderStaking,
            [endTokenAddress, sEndTokenAddress, stEthAddress, signer.address],
            {
                initializer: "initialize",
            },
        )) as unknown as EnderStaking;
        enderStakingAddress = await enderStaking.getAddress();

        enderTreasury = (await upgrades.deployProxy(
            EnderTreasury,
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

        const BondNFT = await ethers.getContractFactory("BondNFT");
        bondNFT = (await upgrades.deployProxy(BondNFT, [enderBondAddress, baseURI], {
            initializer: "initialize",
        })) as unknown as BondNFT;
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
        await endToken.grantRole(
            "0xe13c49f41ace7b3f26b0cf23ab168b4c48591998827e86cfa78a62930e4d6953",
            enderBondAddress,
        );
        await endToken.grantRole(
            "0xe13c49f41ace7b3f26b0cf23ab168b4c48591998827e86cfa78a62930e4d6953",
            owner.address,
        );

        await enderBond.setBool(true);
        // await endToken.grantRole()

        await endETHToken.setTreasury(enderTreasuryAddress);
        await endETHToken.grantRole(MINTER_ROLE, enderBondAddress);

        //signature
        sig = await signatureDigest();
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

            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

            await enderTreasury.setAddress(instadappLiteAddress, 5);

            //this is where the user will deposit the StEth in to the contract
            //in the deposit the amount will be divided in to 30 and 70% where the admin Will have access to further
            //deposit it into the strategy for every 24 hours
            await sleep(1200);
            console.log("Here");
            userSign = {
                user: signer1.address,
                key: "0",
                signature: sig
            }
            const tokenId = await depositAndSetup(
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
            userSign = {
                user: signer2.address,
                key: "0",
                signature: sig_1
            }
            const tokenId1 = await depositAndSetup(
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

            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);
            await enderTreasury.setAddress(instadappLitelidoStaking, 5);
            await enderTreasury.setStrategy([instadappLitelidoStaking], true);
            await enderTreasury.setPriorityStrategy(instadappLitelidoStaking);
            await enderTreasury.depositInStrategy(
                stEthAddress,
                instadappLitelidoStaking,
                "2000000000000000000",
            );
            userSign = {
                user: signer1.address,
                key: "0",
                signature: sig
            };

            const tokenId2 = await depositAndSetup(
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
            userSign = {
                user: signer3.address, 
                key: "0",
                signature: sig_2
            }
            await enderStaking
                .connect(signer3)
                .stake(depositAmountEnd, userSign);

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
            console.log(
                "get the stEth--------->>>>>>>",
                await stEth.connect(signer1).balanceOf(signer1.address),
            );

            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

            await enderTreasury.setAddress(instadappLiteAddress, 5);
            await sleep(1200);

            userSign = {
                user: signer1.address,
                key: "0",
                signature: sig
            };

            const tokenId = await depositAndSetup(
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

            userSign = {
                user: signer2.address,
                key: "0",
                signature: sig_1
            }

            const tokenId1 = await depositAndSetup(
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

            userSign = {
                user: signer1.address,
                key: "0",
                signature: sig
            };
            const tokenId2 = await depositAndSetup(
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
            userSign = {
                user: signer3.address, 
                key: "0", 
                signature: sig_2
            }
            await enderStaking
                .connect(signer3)
                .stake(depositAmountEnd, userSign);

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
            console.log(
                "get the stEth--------->>>>>>>",
                await stEth.connect(signer1).balanceOf(signer1.address),
            );

            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);
            await enderTreasury.setAddress(instadappLiteAddress, 5);
            await sleep(1200);

            console.log("signer address:- ", signer.address);
            userSign = {
                user: signer1.address,
                key: "0",
                signature: sig
            };
            const tokenId = await depositAndSetup(
                signer1,
                depositPrincipalStEth,
                maturity,
                bondFee,
                userSign,
            );
            await endToken.connect(signer1).transfer(signer2.address, "1000000000000000000");
            await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer2).approve(enderBondAddress, depositPrincipalStEth);

            userSign = {
                user: signer2.address,
                key: "0",
                signature: sig_1
            };

            const tokenId1 = await depositAndSetup(
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
            userSign = {
                user: signer1.address,
                key: "0",
                signature: sig
            };

            const tokenId2 = await depositAndSetup(
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

            userSign = {
                user: signer3.address,
                key: "0",
                signature: sig_2
            }
            await enderStaking
                .connect(signer3)
                .stake(depositAmountEnd, userSign);
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
            console.log(
                "get the stEth--------->>>>>>>",
                await stEth.connect(signer1).balanceOf(signer1.address),
            );

            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);
            await enderTreasury.setAddress(instadappLiteAddress, 5);
            await sleep(1200);

            userSign = {
                user: signer1.address,
                key: "0",
                signature: sig
            };

            const tokenId = await depositAndSetup(
                signer1,
                depositPrincipalStEth,
                maturity,
                bondFee,
                userSign,
            );
            await endToken.connect(signer1).transfer(signer2.address, "1000000000000000000");
            await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer2).approve(enderBondAddress, depositPrincipalStEth);

            userSign = {
                user: signer2.address,
                key: "0",
                signature: sig_1
            };

            const tokenId1 = await depositAndSetup(
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
            userSign = {
                user: signer1.address,
                key: "0",
                signature: sig
            };

            const tokenId2 = await depositAndSetup(
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

            userSign = {
                user: signer3.address,
                key: "0",
                signature: sig_2
            }
            await enderStaking
                .connect(signer3)
                .stake(depositAmountEnd, userSign);
            await increaseTime(90 * 600);
            await stEth.connect(signer1).transfer(instadappLiteAddress, depositPrincipalStEth);
            const sEndAmount = await sEnd.connect(signer3).balanceOf(signer3.address);
            await enderStaking.connect(signer3).unstake(sEndAmount);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).transfer(instadappLiteAddress, depositPrincipalStEth);
            await withdrawAndSetup(signer1, tokenId);
            console.log("Withdraw");
            await expect(withdrawAndSetup(signer4, tokenId2)).to.be.revertedWithCustomError(enderBond, "InsufficientEndETH");

            await endETHToken.mint(signer4.address, depositPrincipalStEth, bondFee);
            await withdrawAndSetup(signer4, tokenId2);
        });

        it("Ender protocol scenario 4:- BondFee is 100% and maturity is 5 days", async () => {
            const maturity = 7;
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
            console.log(
                "get the stEth--------->>>>>>>",
                await stEth.connect(signer1).balanceOf(signer1.address),
            );

            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);
            await enderTreasury.setAddress(instadappLiteAddress, 5);
            await sleep(1200);

            userSign = {
                user: signer1.address,
                key: "0",
                signature: sig
            };

            const tokenId = await depositAndSetup(
                signer1,
                depositPrincipalStEth,
                maturity,
                bondFee,
                userSign,
            );
            await endToken.connect(signer1).transfer(signer2.address, "1000000000000000000");
            await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer2).approve(enderBondAddress, depositPrincipalStEth);

            userSign = {
                user: signer2.address,
                key: "0",
                signature: sig_1
            };
            const tokenId1 = await depositAndSetup(
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
            userSign = {
                user: signer1.address,
                key: "0",
                signature: sig
            };

            const tokenId2 = await depositAndSetup(
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

            userSign = {
                user: signer3.address,
                key: "0",
                signature: sig_2
            }
            await enderStaking
                .connect(signer3)
                .stake(depositAmountEnd, userSign);
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
            console.log(
                "get the stEth--------->>>>>>>",
                await stEth.connect(signer1).balanceOf(signer1.address),
            );

            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);
            await enderTreasury.setAddress(instadappLiteAddress, 5);
            await sleep(1200);

            console.log("-------------deposit 1-------------------");

            userSign = {
                user: signer1.address,
                key: "0",
                signature: sig
            }
            const tokenId = await depositAndSetup(
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

            userSign = {
                user: signer2.address,
                key: "0",
                signature: sig_1
            };

            const tokenId1 = await depositAndSetup(
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

            userSign = {
                user: signer1.address,
                key: "0",
                signature: sig
            };

            const tokenId2 = await depositAndSetup(
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

            userSign = {
                user: signer3.address,
                key: "0",
                signature: sig_2
            };

            await enderStaking
                .connect(signer3)
                .stake(depositAmountEnd, userSign);
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
            console.log(
                "get the stEth--------->>>>>>>",
                await stEth.connect(signer1).balanceOf(signer1.address),
            );

            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);
            await enderTreasury.setAddress(instadappLiteAddress, 5);
            await sleep(1200);

            userSign = {
                user: signer1.address,
                key: "0",
                signature: sig
            };

            const tokenId = await depositAndSetup(
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

            userSign = {
                user: signer2.address,
                key: "0",
                signature: sig_1
            };

            const tokenId1 = await depositAndSetup(
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

            userSign = {
                user: signer1.address,
                key: "0",
                signature: sig
            }

            const tokenId2 = await depositAndSetup(
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

            userSign = {
                user: signer3.address,
                key: "0",
                signature: sig_2
            };
            await enderStaking
                .connect(signer3)
                .stake(depositAmountEnd, userSign);
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
            const depositAmountEnd = expandTo18Decimals(5);
            // const depositPrincipalStEth = expandTo18Decimals(1);
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

            userSign = {
                user: signer1.address,
                key: "0",
                signature: sig
            }
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
            const depositAmountEnd = expandTo18Decimals(5);
            const depositPrincipalStEth = expandTo18Decimals(1);
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

            userSign = {
                user: signer.address,
                key: "0",
                signature: sig
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
                        userSign
                    ),
            ).to.be.revertedWithCustomError(enderBond, "NotBondableToken");
        });

        it("Deposit Revert InvalidAmount by Sending Ether", async () => {
            let maturity = 90;
            let bondFee = 1;
            const depositAmountEnd = expandTo18Decimals(5);
            const depositPrincipalStEth = expandTo18Decimals(1);
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

            userSign = {
                user: signer.address,
                key: "0",
                signature: sig
            };
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

    async function withdrawAndSetup(signer: Wallet, tokenId: bigint) {
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
                user: signer3.address,
                key: "0",
            },
        );
        return sig;
    }

    async function increaseTime(seconds: number) {
        await ethers.provider.send("evm_increaseTime", [seconds]);
        await ethers.provider.send("evm_mine");
    }
    function sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
});
