import { expect } from "chai";
import { Wallet } from "ethers";
import { ethers, upgrades } from "hardhat";
import { EndToken } from "../../typechain-types/contracts/ERC20/EndToken";
import { EnderStakeEth } from "../../typechain-types/contracts/ERC20/EnderStakeEth";
import { EnderBond } from "../../typechain-types/contracts/EnderBond";
import { EnderTreasury } from "../../typechain-types/contracts/EnderTreasury";
import { StETH } from "../../typechain-types/contracts/ERC20/mockStEth.sol/StETH";

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
        enderTreasuryAddress: string,
        enderStakingAddress: string,
        stEthAddress: string,
        bondNFTAddress: string,
        mockWETHAddress,
        instadappLiteAddress: string;

    let endToken: EndToken,
        endETHToken: EnderStakeEth,
        enderBond: EnderBond,
        enderTreasury: EnderTreasury,
        enderELStrategy,
        enderStaking,
        sEnd,
        sEndTokenAddress,
        instadappLitelidoStaking,
        WETH,
        stEth: StETH,
        bondNFT,
        oracle,
        oracleAddress;
    let stEthBlanceOfTreasury: bigint,
        userSign: EnderBond.SignDataStruct,
        sig1: string;

    before(async function () {
        const wETH = await ethers.getContractFactory("mockWETH");
        const StEth = await ethers.getContractFactory("StETH");
        const InstadappLite = await ethers.getContractFactory("StinstaToken");
        const EndToken = await ethers.getContractFactory("EndToken");
        const EnderBond = await ethers.getContractFactory("EnderBond");
        const EnderTreasury = await ethers.getContractFactory("EnderTreasury");
        const EnderStaking = await ethers.getContractFactory("EnderStaking");
        const SEnd = await ethers.getContractFactory("SEndToken");
        const Oracle = await ethers.getContractFactory("EnderOracle");
        const EndETHToken = await ethers.getContractFactory("EnderStakeEth");

        [owner, signer, signer1, signer2, signer3, signer4] = (await ethers.getSigners()) as unknown as Wallet[];

        stEth = (await StEth.deploy()) as unknown as StETH;
        stEthAddress = await stEth.getAddress();

        // sEnd = await SEnd.connect(owner).deploy();
        sEnd = await upgrades.deployProxy(SEnd, [], {
            initializer: "initialize",
        });
        sEndTokenAddress = await sEnd.connect(owner).getAddress();

        instadappLitelidoStaking = await InstadappLite.deploy(
            "InstaToken",
            "Inst",
            owner.address,
            stEthAddress,
        );
        instadappLiteAddress = await instadappLitelidoStaking.getAddress();
        endToken = (await upgrades.deployProxy(EndToken, [], {
            initializer: "initialize",
        })) as unknown as EndToken;
        endTokenAddress = await endToken.getAddress();

        oracle = await upgrades.deployProxy(Oracle, [], {
            initializer: "initialize",
        });

        oracleAddress = await oracle.getAddress();

        // deploy endETH token
        endETHToken = (await upgrades.deployProxy(EndETHToken, [], {
            initializer: "initialize"
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

        console.log("Before Staking Deploy Proxy");
        enderStaking = await upgrades.deployProxy(
            EnderStaking,
            [endTokenAddress, sEndTokenAddress, stEthAddress, signer.address],
            {
                initializer: "initialize",
            },
        );

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
        await endToken.grantRole(
            "0xe13c49f41ace7b3f26b0cf23ab168b4c48591998827e86cfa78a62930e4d6953",
            enderBondAddress,
        );
        await endToken.grantRole(
            "0xe13c49f41ace7b3f26b0cf23ab168b4c48591998827e86cfa78a62930e4d6953",
            owner.address,
        );

        await enderBond.setBool(true);
        await enderBond.whitelist(false);
        // await endToken.grantRole()

        await endETHToken.setTreasury(enderTreasuryAddress);
        await endETHToken.grantRole(MINTER_ROLE, enderBondAddress);

        sig1 = await signatureDigest();
    });

    describe("deposit and withdraw", async () => {
        it("scenario 1", async () => {
            console.log("Inside my First Test Case ");
            const maturity = 90;
            const bondFee = 500;
            const depositAmountEnd = expandTo18Decimals(5);
            const depositPrincipalStEth = expandTo18Decimals(1);

            const endTransfer = expandTo18Decimals(1);
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
                signature: sig1
            };

            await ethers.provider.send("evm_increaseTime", [600]); // 86400 seconds = 1 day
            await ethers.provider.send("evm_mine");

            const tokenId = await depositAndSetup(
                signer1,
                depositPrincipalStEth,
                maturity,
                bondFee,
                userSign
            );
        });

        it("scenario 2", async () => {
            console.log("Inside my First Test Case ");
            const maturity = 90;
            const bondFee = 9999;
            const depositAmountEnd = expandTo18Decimals(5);
            const depositPrincipalStEth = expandTo18Decimals(1);

            const endTransfer = expandTo18Decimals(1);
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
                signature: sig1
            };

            await ethers.provider.send("evm_increaseTime", [600]); // 86400 seconds = 1 day
            await ethers.provider.send("evm_mine");

            const tokenId = await depositAndSetup(
                signer1,
                depositPrincipalStEth,
                maturity,
                bondFee,
                userSign
            );
        });

        it("scenario 3", async () => {
            console.log("Inside my First Test Case ");
            const maturity = 90;
            const bondFee = 0;
            const depositAmountEnd = expandTo18Decimals(5);
            const depositPrincipalStEth = expandTo18Decimals(1);

            const endTransfer = expandTo18Decimals(1);
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
                signature: sig1
            };

            await ethers.provider.send("evm_increaseTime", [600]); // 86400 seconds = 1 day
            await ethers.provider.send("evm_mine");

            const tokenId = await depositAndSetup(
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
            const depositAmountEnd = expandTo18Decimals(5);
            const depositPrincipalStEth = expandTo18Decimals(1);

            const endTransfer = expandTo18Decimals(1);
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
                signature: sig1
            };

            await ethers.provider.send("evm_increaseTime", [600]); // 86400 seconds = 1 day
            await ethers.provider.send("evm_mine");

            const tokenId = await depositAndSetup(
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
            const depositAmountEnd = expandTo18Decimals(5);
            const depositPrincipalStEth = expandTo18Decimals(1);

            const endTransfer = expandTo18Decimals(1);
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
                signature: sig1
            };

            await ethers.provider.send("evm_increaseTime", [600]); // 86400 seconds = 1 day
            await ethers.provider.send("evm_mine");

            const tokenId = await depositAndSetup(
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
            const depositAmountEnd = expandTo18Decimals(5);
            const depositPrincipalStEth = expandTo18Decimals(1);

            const endTransfer = expandTo18Decimals(1);
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
                signature: sig1
            };

            await ethers.provider.send("evm_increaseTime", [600]); // 86400 seconds = 1 day
            await ethers.provider.send("evm_mine");

            for (let i = 0; i < 100; i++) {
                const tokenId = await depositAndSetup(
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
            const depositAmountEnd = expandTo18Decimals(5);
            const depositPrincipalStEth = expandTo18Decimals(5);

            const endTransfer = expandTo18Decimals(1);
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
                signature: sig1
            };
            // mint to signer1
            await endToken.connect(owner).mint(signer1.address, depositAmountEnd);

            await ethers.provider.send("evm_increaseTime", [600]);
            await ethers.provider.send("evm_mine");

            const tokenId = await depositAndSetup(
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
            const depositAmountEnd = expandTo18Decimals(5);
            const depositPrincipalStEth = expandTo18Decimals(1);
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
                signature: sig1
            };

            await expect(
                enderBond
                    .connect(signer1)
                    .deposit(
                        signer1.address,
                        10000,
                        maturity,
                        bondFee,
                        stEthAddress, 
                        userSign
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
            userSign = {
                user: signer1.address,
                key: "0",
                signature: sig1
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

            userSign = {
                user: signer1.address,
                key: "0",
                signature: sig1
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

            userSign = {
                user: signer1.address,
                key: "0",
                signature: sig1
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
                        userSign
                    ),
            ).to.be.revertedWithCustomError(enderBond, "InvalidBondFee");
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
            .deposit(
                signer,
                depositAmount,
                maturity,
                bondFee,
                stEthAddress, signData
            );
        const filter = enderBond.filters.Deposit;
        const events = await enderBond.queryFilter(filter, -1);

        const event1 = events[0];

        const args1 = event1.args;
        const tokenId = args1.tokenId;

        return tokenId;
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
});

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
