const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

const { EigenLayerStrategyManagerAddress } = require("../utils/common");
const signature = "0xA2fFDf332d92715e88a958A705948ADF75d07d01";
const baseURI = "https://endworld-backend-git-dev-metagaming.vercel.app/nft/metadata/";

describe("EnderBond", function () {
    let owner, wallet1, signer1, signer2, signer3;
    let endTokenAddress,
        enderBondAddress,
        enderTreasuryAddress,
        enderStakingAddress,
        lidoStakingAddress;

    let endToken,
        enderBond,
        enderTreasury,
        enderELStrategy,
        enderStaking,
        sEnd,
        sEndTokenAddress,
        lidoStaking,
        stEth,
        bondNFT;

    before(async function () {
        const StEth = await ethers.getContractFactory("StEth");
        const LidoStaking = await ethers.getContractFactory("lidoStaking");
        const EndToken = await ethers.getContractFactory("EndToken");
        const EnderBond = await ethers.getContractFactory("EnderBond");
        const EnderTreasury = await ethers.getContractFactory("EnderTreasury");
        const EnderStaking = await ethers.getContractFactory("EnderStaking");
        const SEnd = await ethers.getContractFactory("SEndToken");

        stEth = await StEth.deploy();
        stEthAddress = await stEth.getAddress();

        sEnd = await SEnd.deploy();
        sEndTokenAddress = await sEnd.getAddress();

        lidoStaking = await LidoStaking.deploy(stEthAddress);
        lidoStakingAddress = await lidoStaking.getAddress();

        endToken = await upgrades.deployProxy(EndToken, [], {
            initializer: "initialize",
        });
        await endToken.waitForDeployment();
        endTokenAddress = await endToken.getAddress();

        enderBond = await upgrades.deployProxy(EnderBond, [endTokenAddress, lidoStakingAddress], {
            initializer: "initialize",
        });
        // await enderBond.waitForDeployment();
        // enderBond = await upgrades.upgradeProxy(await enderBond.getAddress(), EnderBond);

        enderBondAddress = await enderBond.getAddress();

        await endToken.setBond(enderBondAddress);
        await endToken.setFee(1);

        enderStaking = await upgrades.deployProxy(
            EnderStaking,
            [endTokenAddress, sEndTokenAddress],
            {
                initializer: "initialize",
            },
        );
        enderStakingAddress = await enderStaking.getAddress();
        // console.log(
        //     endTokenAddress,
        //     enderStakingAddress,
        //     enderBondAddress,
        //     lidoStakingAddress,
        //     ethers.ZeroAddress,
        //     ethers.ZeroAddress,
        // );
        // console.log({EnderTreasury});
        enderTreasury = await upgrades.deployProxy(
            EnderTreasury,
            [
                endTokenAddress,
                enderStakingAddress,
                enderBondAddress,
                lidoStakingAddress,
                ethers.ZeroAddress,
                ethers.ZeroAddress,
                30,
                70,
            ],
            {
                initializer: "initializeTreasury",
            },
        );
        // console.log("-------------------------------------------------------------------------");

        enderTreasuryAddress = await enderTreasury.getAddress();

        const BondNFT = await ethers.getContractFactory("BondNFT");
        bondNFT = await upgrades.deployProxy(BondNFT, [enderBondAddress, baseURI], {
            initializer: "initialize",
        });
        await bondNFT.waitForDeployment();
        bondNFTAddress = await bondNFT.getAddress();

        await enderStaking.setAddress(enderBondAddress, 1);
        await enderStaking.setAddress(enderTreasuryAddress, 2);

        // console.log({enderBond});
        await enderBond.setBondableTokens([stEthAddress], true);
        await enderBond.setAddress(enderTreasuryAddress, 1);
        await enderBond.setAddress(bondNFTAddress, 3);
        [owner, wallet1, signer1, signer2, signer3] = await ethers.getSigners();
    });

    describe("initialize", function () {
        it("Should set the right owner", async function () {
            expect(await enderBond.owner()).to.equal(owner.address);
        });
    });
    describe("EnderBond StEth", function () {
        it("Should allow a user to deposit with valid parameters", async function () {
            const depositPrincipal = 1000;
            const maturity = 90;
            const bondFee = 5;

            await stEth.mint(await signer1.getAddress(), "1000000000000000000000000000");
            await enderBond.connect(owner).setBondableTokens([endTokenAddress], true);

            await stEth.connect(signer1).approve(enderBondAddress, 1000);
            await enderBond
                .connect(signer1)
                .deposit(depositPrincipal, maturity, bondFee, stEthAddress);
        });
        it("TokenId should change every time when the same user comes", async function () {
            const depositPrincipal = 1000;
            const maturity = 90;
            const bondFee = 5;

            await stEth.mint(await signer1.getAddress(), "1000000000000000000000000000");
            await enderBond.connect(owner).setBondableTokens([endTokenAddress], true);
            await stEth.connect(signer1).approve(enderBondAddress, 2000);

            // Make the first deposit and capture tokenId1
            await enderBond
                .connect(signer1)
                .deposit(depositPrincipal, maturity, bondFee, stEthAddress);

            await enderBond
                .connect(signer1)
                .deposit(depositPrincipal, maturity, bondFee, stEthAddress);
            filter = enderBond.filters.Deposit;
            const events = await enderBond.queryFilter(filter, -1);

            const event1 = events[0];
            const event2 = events[1];
            const args1 = event1.args;
            const args2 = event2.args;
            expect(args1.tokenId).to.not.equal(args2.tokenId);
            expect(args1.user).to.be.equal(args2.user);
        });

        it("checking the owner of the tokenId", async function () {
            const depositPrincipal = 1000;
            const maturity = 90;
            const bondFee = 5;

            await stEth.mint(await signer1.getAddress(), "1000000000000000000000000000");
            await enderBond.connect(owner).setBondableTokens([endTokenAddress], true);

            await stEth.connect(signer1).approve(enderBondAddress, 2000);

            await enderBond
                .connect(signer1)
                .deposit(depositPrincipal, maturity, bondFee, stEthAddress);
            filter = enderBond.filters.Deposit;
            const events = await enderBond.queryFilter(filter, -1);

            const event1 = events[0];

            const args1 = event1.args;

            expect(await bondNFT.ownerOf(args1.tokenId)).to.be.equal(signer1.address);
        });
    });
    describe("Deposit Reverts", function () {
        it("Should not allow principal to be zero", async function () {
            const depositPrincipal = 0;
            const maturity = 90;
            const bondFee = 5;
            await stEth.connect(signer1).approve(enderBondAddress, 1000);
            await expect(
                enderBond
                    .connect(signer1)
                    .deposit(depositPrincipal, maturity, bondFee, stEthAddress),
            ).to.be.revertedWithCustomError(enderBond, "InvalidAmount()");
        });

        it("Should not allow maturity to be greater than 365 days and less than 7 days", async function () {
            const depositPrincipal = 1000;
            const maturity = 366;
            const bondFee = 5;
            await stEth.connect(signer1).approve(enderBondAddress, 1000);
            await expect(
                enderBond
                    .connect(signer1)
                    .deposit(depositPrincipal, maturity, bondFee, stEthAddress),
            ).to.be.revertedWithCustomError(enderBond, "InvalidMaturity()");

            await expect(
                enderBond.connect(signer1).deposit(1000, 6, 5, stEthAddress),
            ).to.be.revertedWithCustomError(enderBond, "InvalidMaturity()");
        });

        it("Should not allow tokens other than bondable token", async function () {
            const depositPrincipal = 1000;
            const maturity = 365;
            const bondFee = 5;
            const usdc = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
            await stEth.connect(signer1).approve(enderBondAddress, 1000);
            await expect(
                enderBond.connect(signer1).deposit(depositPrincipal, maturity, bondFee, usdc),
            ).to.be.revertedWithCustomError(enderBond, "NotBondableToken()");
        });
        it("Should not allow bond fees above 100 and below or equal to zero", async function () {
            const depositPrincipal = 1000;
            const maturity = 365;
            const bondFee = 101;
            await expect(
                enderBond
                    .connect(signer1)
                    .deposit(depositPrincipal, maturity, bondFee, stEthAddress),
            ).to.be.revertedWithCustomError(enderBond, "InvalidBondFee()");
        });
    });

    describe("Should properly set state variables", function () {
        it("Should allow a user to deposit with valid parameters", async function () {
            const depositPrincipal = 1000;
            const maturity = 90;
            const bondFee = 5;
            const tokenId = 1;

            await stEth.mint(await signer1.getAddress(), "1000000000000000000000000000");

            await stEth.connect(signer1).approve(enderBondAddress, 1000);
            await enderBond
                .connect(signer1)
                .deposit(depositPrincipal, maturity, bondFee, stEthAddress);
            filter = enderBond.filters.Deposit;
            const events = await enderBond.queryFilter(filter, -1);

            const event1 = events[0];

            const args1 = event1.args;

            expect(await enderBond.availableFundsAtMaturity(19745)).to.be.equal(5000);
            expect(await enderBond.rewardSharePerUserIndex(args1.tokenId)).to.be.equal(0);
            expect(await enderBond.rewardSharePerUserIndexSend(args1.tokenId)).to.be.equal(0);
            expect(await enderBond.totalDeposit()).to.be.equal(5000);
        });
    });
});
