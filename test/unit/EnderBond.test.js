const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");
const { BigNumber, ZeroAddress } = require("ethers");
const { EigenLayerStrategyManagerAddress } = require("../utils/common");
const exp = require("constants");
const { sign } = require("crypto");
const { log, assert } = require("console");
const ether = require("@openzeppelin/test-helpers/src/ether");
const signatureAddr = "0xA2fFDf332d92715e88a958A705948ADF75d07d01";
const baseURI = "https://endworld-backend-git-dev-metagaming.vercel.app/nft/metadata/";
const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
const ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";

function expandTo18Decimals(n) {
    return ethers.parseUnits(n.toString(), 18);
}

function expandTo16Decimals(n) {
    return ethers.parseUnits(n.toString(), 16);
}

describe("enderBond setting funtions and missing testing", function () {
    let owner,
        signer,
        admin,
        wallet,
        signer1,
        signer2,
        signer3,
        signer4,
        wEthAddress,
        stEthAddress,
        enderBondAddress,
        mockEnderBondAddress,
        mockLidoAddress,
        enderBondLiquidityDepositAddress,
        endTokenAddress,
        sEndTokenAddress,
        enderTreasuryAddress,
        bondNFTAddress,
        instadappLiteAddress,
        enderStakingAddress,
        wEth,
        stEth,
        enderBond,
        mockEnderBond,
        mockLido,
        enderBondLiquidityDeposit,
        endToken,
        sEndToken,
        enderTreasury,
        bondNFT,
        instadappLitelidoStaking,
        enderStaking,
        signature,
        signature1,
        secondInDay;

    beforeEach(async function () {
        const wEthFactory = await ethers.getContractFactory("mockWETH");
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
        const MockEnderBond = await ethers.getContractFactory("MockEnderBond");
        const MockLido = await ethers.getContractFactory("MockLido");
        //Owner and signers addresses
        [owner, signer, wallet, signer1, signer2, signer3, signer4] = await ethers.getSigners();

        //delpoy stEth
        stEth = await stEthFactory.deploy();
        stEthAddress = await stEth.getAddress();

        //deploy wEth
        wEth = await wEthFactory.connect(owner).deploy("wrappedETH", "weth", owner.address);
        wEthAddress = await wEth.getAddress();

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
            },
        );
        enderBondLiquidityDepositAddress = await enderBondLiquidityDeposit.getAddress();

        //deploy insta app Lido Staking
        instadappLitelidoStaking = await instadappLiteFactory.deploy(
            "InstaToken",
            "Inst",
            owner.address,
            stEthAddress,
        );
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
            },
        );
        enderBondAddress = await enderBond.getAddress();

        //set enderBond address in endToken
        await endToken.setBond(enderBondAddress);

        // deploy mock EnderBond
        mockEnderBond = await upgrades.deployProxy(
            MockEnderBond,
            [endTokenAddress, ethers.ZeroAddress, signer.address],
            {
                initializer: "initialize",
            },
        );
        mockEnderBondAddress = await mockEnderBond.getAddress();

        //set mockEnderBond address in endToken
        await endToken.setBond(mockEnderBondAddress);

        mockLido = await MockLido.deploy();
        mockLidoAddress = await mockLido.getAddress();

        //deploy ender Staking contract
        enderStaking = await upgrades.deployProxy(
            enderStakingFactory,
            [endTokenAddress, sEndTokenAddress, stEthAddress, signer.address],
            {
                initializer: "initialize",
            },
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
                30,
            ],
            {
                initializer: "initializeTreasury",
            },
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
        await endToken.grantRole(
            "0xe13c49f41ace7b3f26b0cf23ab168b4c48591998827e86cfa78a62930e4d6953",
            enderBondAddress,
        );
        await endToken.grantRole(
            "0xe13c49f41ace7b3f26b0cf23ab168b4c48591998827e86cfa78a62930e4d6953",
            owner.address,
        );

        await enderBond.setBool(true);

        // mockEnderBond setting
        await mockEnderBond.setBondableTokens([stEthAddress], true);
        await mockEnderBond.setAddress(enderTreasuryAddress, 1);
        await mockEnderBond.setAddress(bondNFTAddress, 3);
        await mockEnderBond.setAddress(sEndTokenAddress, 9);
        await mockEnderBond.setAddress(stEthAddress, 6);       

        //signature
        signature = await signatureDigest(owner, enderBondAddress, signer1);
        signature1 = await signatureDigest(owner, enderBondAddress, signer2);

        secondInDay = await enderBond.SECONDS_IN_DAY();
    });

    it("should fail on second initialization attempt", async function () {
        // Attempt to re-initialize
        await expect(
            enderBond.initialize(endTokenAddress, ethers.ZeroAddress, signer.address),
        ).to.be.revertedWith("Initializable: contract is already initialized");
    });

    it("epochRewardShareIndexByPass function test", async () => {
        const beforelastSecOfRefraction = await mockEnderBond.lastSecOfRefraction();
        await mockEnderBond.epochRewardShareIndexByPass();
        const lastSecOfRefraction = await mockEnderBond.lastSecOfRefraction();

        const blockNumBefore = await ethers.provider.getBlockNumber();
        const blockBefore = await ethers.provider.getBlock(blockNumBefore);
        const timestampBefore = blockBefore.timestamp;

        const timeNow = BigInt(timestampBefore) / secondInDay;
        const lastTimeNow = lastSecOfRefraction / secondInDay;

        expect(timeNow).to.eq(lastTimeNow);

        const afterDayToRefractionShareUpdation =
            await mockEnderBond.getDayToRefractionShareUpdation(Number(timeNow));
        expect(afterDayToRefractionShareUpdation[0]).to.eq(beforelastSecOfRefraction);
    });

    it("epochRewardShareIndexSendByPass function test", async () => {
        const beforelastSecOfSendReward = await mockEnderBond.lastSecOfSendReward();
        await mockEnderBond.epochRewardShareIndexSendByPass();
        const lastSecOfSendReward = await mockEnderBond.lastSecOfSendReward();

        const blockNumBefore = await ethers.provider.getBlockNumber();
        const blockBefore = await ethers.provider.getBlock(blockNumBefore);
        const timestampBefore = blockBefore.timestamp;

        const timeNow = BigInt(timestampBefore) / secondInDay;
        const lastTimeNow = lastSecOfSendReward / secondInDay;

        expect(timeNow).to.eq(lastTimeNow);

        let afterDayToRefractionShareUpdationSend =
            await mockEnderBond.getDayToRefractionShareUpdationSend(Number(timeNow));
        expect(afterDayToRefractionShareUpdationSend[0]).to.eq(beforelastSecOfSendReward);

        await mockEnderBond.epochRewardShareIndexSendByPass();

        afterDayToRefractionShareUpdationSend =
            await mockEnderBond.getDayToRefractionShareUpdationSend(Number(timeNow));
        expect(afterDayToRefractionShareUpdationSend[0]).to.eq(beforelastSecOfSendReward);
    });

    it("setting interval", async () => {
        const interval = 10;
        await enderBond.setInterval(interval);
        const updatedInterval = await enderBond.interval();

        expect(updatedInterval).to.equal(interval);
    });

    it("setting address", async () => {
        await expect(enderBond.setAddress(ethers.ZeroAddress, 1)).to.be.revertedWithCustomError(
            enderBond,
            "ZeroAddress()",
        );
        await expect(enderBond.setAddress(signatureAddr, 0)).to.be.revertedWithCustomError(
            enderBond,
            "InvalidAddress()",
        );
    });

    it("setting new signer", async () => {
        const signerAddr = "0x0000000000000000000000000000000000000123";
        const oldSigner = await enderBond.signer();
        await enderBond.setsigner(signerAddr);
        const newSigner = await enderBond.signer();

        expect(newSigner).to.equal(signerAddr);
        expect(newSigner).to.not.equal(oldSigner);

        await expect(enderBond.setsigner(ethers.ZeroAddress)).to.be.revertedWithCustomError(
            enderBond,
            "ZeroAddress()",
        );
    });

    it("setting minimum deposit amount", async () => {
        const depositAmt = 10;
        await enderBond.setMinDepAmount(depositAmt);
        const minDepositAmount = await enderBond.minDepositAmount();

        expect(minDepositAmount).to.equal(depositAmt);
    });

    it("setting transaction fee", async () => {
        const txFeeAmt = 10;
        await enderBond.setTxFees(txFeeAmt);
        const txFees = await enderBond.txFees();

        expect(txFees).to.equal(txFeeAmt);
    });

    it("setting bond yield base rate", async () => {
        const yieldRate = 10;
        await enderBond.setBondYieldBaseRate(yieldRate);
        const bondYieldBaseRate = await enderBond.bondYieldBaseRate();

        expect(bondYieldBaseRate).to.equal(yieldRate);
    });

    it("getting addresses", async () => {
        await expect(enderBond.getPrivateAddress(0)).to.be.revertedWithCustomError(
            enderBond,
            "ZeroAddress()",
        );

        const addr1 = await enderBond.getPrivateAddress(1);
        expect(addr1).to.equal(enderTreasuryAddress);

        const addr2 = await enderBond.getPrivateAddress(2);
        expect(addr2).to.equal(endToken);

        const addr3 = await enderBond.getPrivateAddress(3);
        expect(addr3).to.equal(bondNFTAddress);

        await enderBond.setAddress(signatureAddr, 4);
        const addr4 = await enderBond.getPrivateAddress(4);
        expect(addr4).to.equal(signatureAddr);

        const addr5 = await enderBond.getPrivateAddress(5);
        const lidoAddr = await enderBond.lido();
        expect(addr5).to.equal(lidoAddr);

        const addr6 = await enderBond.getPrivateAddress(6);
        expect(addr6).to.equal(stEthAddress);

        const addr7 = await enderBond.getPrivateAddress(7);
        expect(addr7).to.equal(ethers.ZeroAddress);

        const addr8 = await enderBond.getPrivateAddress(8);
        expect(addr8).to.equal(enderStakingAddress);

        const addr9 = await enderBond.getPrivateAddress(9);
        expect(addr9).to.equal(sEndTokenAddress);

        await enderBond.setAddress(enderBondLiquidityDepositAddress, 10);
        const addr10 = await enderBond.getPrivateAddress(10);
        expect(addr10).to.equal(enderBondLiquidityDepositAddress);

        await expect(enderBond.getPrivateAddress(11)).to.be.revertedWithCustomError(
            enderBond,
            "InvalidAddress()",
        );
    });

    it("setting available bond fee", async () => {
        await mockEnderBond.setAddress(signer1, 1);
        const treasuryAddr = await mockEnderBond.getPrivateAddress(1);
        expect(treasuryAddr).to.equal(signer1.address);
        await mockEnderBond.initAvailableBondFee(20);

        const bondFeeAmt = 5;
        const originalAvailableBondFee = await mockEnderBond.getAvailableBondFee();
        await mockEnderBond.connect(signer1).setAvailableBondFee(bondFeeAmt);
        const availableBondFee = await mockEnderBond.getAvailableBondFee();

        await expect(
            mockEnderBond.connect(signer2).setAvailableBondFee(bondFeeAmt),
        ).to.be.revertedWithCustomError(mockEnderBond, "NoTreasury()");

        expect(availableBondFee).to.equal(originalAvailableBondFee - BigInt(bondFeeAmt));
    });

    it("deposit revert owing to disabled", async () => {
        let maturity = 90;
        let bondFee = 1;
        let isAllowed = await enderBond.depositEnable();
        expect(isAllowed).to.equal(true);

        await enderBond.setDepositEnable(false);
        isAllowed = await enderBond.depositEnable();
        expect(isAllowed).to.equal(false);

        let sig1 = signatureDigest(owner, enderBondAddress, signer1);

        await expect(
            enderBond
                .connect(signer)
                .deposit(signer, 10, maturity, bondFee, stEthAddress, [signer1.address, "0", sig1]),
        ).to.be.revertedWithCustomError(enderBond, "NotAllowed()");
    });

    describe("withdraw & _withdraw function test", function () {
        it("withdraw revert owing to not allowed", async () => {
            let isWithdrawPause = await enderBond.isWithdrawPause();
            expect(isWithdrawPause).to.equal(true);

            await enderBond.setWithdrawPause(false);
            isWithdrawPause = await enderBond.isWithdrawPause();
            expect(isWithdrawPause).to.equal(false);

            await expect(enderBond.withdraw(1)).to.be.revertedWithCustomError(
                enderBond,
                "NotAllowed()",
            );
        });

        it("withdraw is reverted with BondAlreadyWithdrawn custom error", async () => {
            const depositPrincipalStEth = expandTo16Decimals(1);
            const sig1 = await signatureDigest(owner, enderBondAddress, owner);
            let maturity = 7;
            let bondFee = 5;

            await enderBond.whitelist(false);
            await enderBond.setWithdrawPause(true);
            await enderBond.setAddress(enderTreasuryAddress, 1);
            await enderBond.setAddress(owner.address, 10);
            await stEth.submit({ value: ethers.parseEther("1.0") });
            await stEth.approve(enderBondAddress, depositPrincipalStEth);

            await enderBond.deposit(
                owner,
                depositPrincipalStEth,
                maturity,
                bondFee,
                stEthAddress,
                [owner.address, "0", sig1],
                { value: depositPrincipalStEth },
            );
            filter = enderBond.filters.Deposit;
            const events = await enderBond.queryFilter(filter, -1);

            const event1 = events[0];

            const args1 = event1.args;
            const tokenId = args1.tokenId;
            await time.increase(7200);
            await enderBond.withdraw(tokenId);

            await expect(enderBond.withdraw(1)).to.be.revertedWithCustomError(
                enderBond,
                "BondAlreadyWithdrawn()",
            );
        });
    });

    it("bond revert owing to not allowed", async () => {
        let bondPause = await enderBond.bondPause();
        expect(bondPause).to.equal(true);

        await enderBond.setBondPause(false);
        bondPause = await enderBond.bondPause();
        expect(bondPause).to.equal(false);

        await enderBond.setDepositEnable(true);
        const depositEnable = await enderBond.depositEnable();
        expect(depositEnable).to.be.equal(true);

        let maturity = 90;
        let bondFee = 1;
        let sig1 = signatureDigest(owner, enderBondAddress, signer1);

        await expect(
            enderBond
                .connect(signer)
                .deposit(signer, 10, maturity, bondFee, stEthAddress, [signer1.address, "0", sig1]),
        ).to.be.revertedWithCustomError(enderBond, "NotAllowed()");

        await enderBond.setWithdrawPause(true);
        const isWithdrawPause = await enderBond.isWithdrawPause();
        expect(isWithdrawPause).to.equal(true);

        await expect(enderBond.withdraw(1)).to.be.revertedWithCustomError(
            enderBond,
            "NotAllowed()",
        );

        await enderBond.setBondPause(true);
        bondPause = await enderBond.bondPause();
        expect(bondPause).to.equal(true);
    });

    it("getting the rate along with muturity", async () => {
        await enderBond.setBondYieldBaseRate(1);
        const bondYieldBaseRate = await enderBond.bondYieldBaseRate();
        expect(bondYieldBaseRate).to.equal(1);

        let rate = await enderBond.getInterest(360);
        expect(rate).to.equal(150);

        rate = await enderBond.getInterest(320);
        expect(rate).to.equal(140);

        rate = await enderBond.getInterest(280);
        expect(rate).to.equal(130);

        rate = await enderBond.getInterest(260);
        expect(rate).to.equal(125);

        rate = await enderBond.getInterest(220);
        expect(rate).to.equal(120);

        rate = await enderBond.getInterest(180);
        expect(rate).to.equal(115);

        rate = await enderBond.getInterest(150);
        expect(rate).to.equal(110);

        rate = await enderBond.getInterest(120);
        expect(rate).to.equal(105);

        rate = await enderBond.getInterest(60);
        expect(rate).to.equal(90);

        rate = await enderBond.getInterest(15);
        expect(rate).to.equal(80);

        rate = await enderBond.getInterest(7);
        expect(rate).to.equal(70);
    });

    it("findClosestS in the array", async () => {
        let sVal = await mockEnderBond._findClosestS([1, 2, 4, 8, 9, 16], 10);
        expect(sVal).to.equal(9);
        sVal = await mockEnderBond._findClosestS([1, 8, 11, 12, 16], 10);
        expect(sVal).to.equal(8);
        sVal = await mockEnderBond._findClosestS([1, 8, 9, 10, 11, 13, 15, 16, 18], 10);
        expect(sVal).to.equal(10);
        sVal = await mockEnderBond._findClosestS([11, 12, 13, 14], 10);
        expect(sVal).to.equal(11);
        sVal = await mockEnderBond._findClosestS([1, 2, 4, 8], 10);
        expect(sVal).to.equal(8);
        sVal = await mockEnderBond._findClosestS([11], 10);
        expect(sVal).to.equal(11);
        sVal = await mockEnderBond._findClosestS([9], 10);
        expect(sVal).to.equal(9);
        sVal = await mockEnderBond._findClosestS(
            [1, 8, 9, 10, 10, 10, 10, 10, 10, 11, 13, 15, 16, 18],
            10,
        );
        expect(sVal).to.equal(10);
        sVal = await mockEnderBond._findClosestS([], 10);
        expect(sVal).to.equal(0);
    });

    describe("setIndexesOfUser function test", function () {
        it("setIndexesOfUser setting", async () => {
            const refractionSIndex = 1;
            const stakingSendIndex = 2;
            const YieldIndex = 3;
            const tokenIds = [1, 2];
            await enderBond.setIndexesOfUser(
                tokenIds,
                refractionSIndex,
                stakingSendIndex,
                YieldIndex,
            );
            const bond_1 = await enderBond.bonds(1);

            expect(bond_1.refractionSIndex).to.equal(refractionSIndex);
            expect(bond_1.stakingSendIndex).to.equal(stakingSendIndex);
            expect(bond_1.YieldIndex).to.equal(YieldIndex);

            const bond_2 = await enderBond.bonds(2);

            expect(bond_2.refractionSIndex).to.equal(refractionSIndex);
            expect(bond_2.stakingSendIndex).to.equal(stakingSendIndex);
            expect(bond_2.YieldIndex).to.equal(YieldIndex);
        });

        it("setIndexesOfUser is reverted with invalid caller", async () => {
            const refractionSIndex = 1;
            const stakingSendIndex = 2;
            const YieldIndex = 3;
            const tokenIds = [1, 2];
            await expect(
                enderBond
                    .connect(signer1)
                    .setIndexesOfUser(tokenIds, refractionSIndex, stakingSendIndex, YieldIndex),
            ).to.be.rejectedWith("Ownable: caller is not the owner");
        });

        it("setIndexOfUser is reverted with ZeroValue custom error", async () => {
            const refractionSIndex = 1;
            const stakingSendIndex = 2;
            const YieldIndex = 3;
            const tokenIds = [1, 2];

            await expect(
                enderBond.setIndexesOfUser(tokenIds, 0, stakingSendIndex, YieldIndex),
            ).to.be.revertedWithCustomError(enderBond, "ZeroValue()");

            await expect(
                enderBond.setIndexesOfUser(tokenIds, refractionSIndex, 0, YieldIndex),
            ).to.be.revertedWithCustomError(enderBond, "ZeroValue()");

            await expect(
                enderBond.setIndexesOfUser(tokenIds, refractionSIndex, stakingSendIndex, 0),
            ).to.be.revertedWithCustomError(enderBond, "ZeroValue()");
        });
    });

    it("setInterval is reverted with invalid caller", async () => {
        await expect(enderBond.connect(signer1).setInterval(10)).to.be.revertedWith(
            "Ownable: caller is not the owner",
        );
    });

    it("setBool is reverted with invalid caller", async () => {
        await expect(enderBond.connect(signer1).setBool(true)).to.be.revertedWith(
            "Ownable: caller is not the owner",
        );
    });

    it("setAddress is reverted with invalid caller", async () => {
        await expect(enderBond.connect(signer1).setAddress(owner.address, 5)).to.be.revertedWith(
            "Ownable: caller is not the owner",
        );
    });

    it("setting the lido and keeper address", async () => {
        const lidoAddr = signer1.address;
        const keeperAddr = signer2.address;

        await enderBond.setAddress(lidoAddr, 5);
        const lido = await enderBond.getPrivateAddress(5);
        expect(lido).to.equal(lidoAddr);

        await enderBond.setAddress(keeperAddr, 7);
        const keeper = await enderBond.getPrivateAddress(7);
        expect(keeper).to.equal(keeperAddr);
    });

    it("setsigner is reverted with invalid caller", async () => {
        await expect(enderBond.connect(signer1).setsigner(owner)).to.be.revertedWith(
            "Ownable: caller is not the owner",
        );
    });

    it("setMinDepAmount is reverted with invalid caller", async () => {
        await expect(enderBond.connect(signer1).setMinDepAmount(10)).to.be.revertedWith(
            "Ownable: caller is not the owner",
        );
    });

    it("setTxFees is reverted with invalid caller", async () => {
        await expect(enderBond.connect(signer1).setTxFees(5)).to.be.revertedWith(
            "Ownable: caller is not the owner",
        );
    });

    it("setBondYieldBaseRate is reverted with invalid caller", async () => {
        await expect(enderBond.connect(signer1).setBondYieldBaseRate(5)).to.be.revertedWith(
            "Ownable: caller is not the owner",
        );
    });

    it("setBondableTokens is reverted with invalid caller", async () => {
        await expect(
            enderBond.connect(signer1).setBondableTokens([stEthAddress], true),
        ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("userInfoDepositContract is reverted with invalid caller", async () => {
        await expect(
            enderBond
                .connect(signer1)
                .userInfoDepositContract([1, 2], [signer1.address, "0", signature]),
        ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("userInfoDepositContract", async () => {
        await enderBond.userInfoDepositContract([], [signer1.address, "0", signature]);
    });

    it("deductFeesFromTransfer is reverted with NotBondNFT error", async () => {
        await expect(
            enderBond.connect(signer1).deductFeesFromTransfer(1),
        ).to.be.revertedWithCustomError(enderBond, "NotBondNFT()");
    });

    it("epochRewardShareIndex is reverted with NotEndToken", async () => {
        await expect(
            enderBond.connect(signer1).epochRewardShareIndex(1),
        ).to.be.revertedWithCustomError(enderBond, "NotEndToken()");
    });

    describe("resetEndMint function test", function () {
        it("resetEndMint is reverted with invalid sender", async () => {
            await expect(enderBond.connect(signer1).resetEndMint()).to.be.revertedWithCustomError(
                enderBond,
                "NoTreasury()",
            );
        });
    });

    describe("deposit function test", function () {
        beforeEach(async () => {
            await mockEnderBond.setAddress(enderTreasuryAddress, 1);
        });

        it("deposit call with zero token address", async () => {
            let maturity = 10;
            let bondFee = 1;
            const depositPrincipalStEth = expandTo16Decimals(1) * BigInt(2);
            await endToken.setFee(20);

            expect(await mockEnderBond.rewardShareIndex()).to.be.equal(0);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).approve(mockEnderBondAddress, depositPrincipalStEth);

            let mocksig = signatureDigest(signer, mockEnderBondAddress, signer1);
            const userSign = [signer1.address, "0", mocksig];
            const userSignerAddr = await mockEnderBond.verify(userSign);
            const contractSignerAddr = await mockEnderBond.signer();
            expect(userSignerAddr).to.eq(contractSignerAddr);

            await enderTreasury.setAddress(mockEnderBondAddress, 2);
            await bondNFT.setBondContract(mockEnderBondAddress);

            const sendAmt = await stEth.balanceOf(mockEnderBondAddress);

            await expect(
                mockEnderBond.deposit(
                    signer1.address,
                    depositPrincipalStEth,
                    maturity,
                    bondFee,
                    ethers.ZeroAddress,
                    userSign,
                    { value: depositPrincipalStEth },
                ),
            )
                .to.emit(mockEnderBond, "Deposit")
                .withArgs(signer1.address, 1, sendAmt, maturity, ethers.ZeroAddress, bondFee);

            await mockEnderBond.setAddress(mockLidoAddress, 5);
            await expect(
                mockEnderBond.deposit(
                    signer1.address,
                    depositPrincipalStEth,
                    maturity,
                    bondFee,
                    ethers.ZeroAddress,
                    userSign,
                    { value: depositPrincipalStEth },
                ),
            ).to.be.revertedWith("lido eth deposit failed");
        });

        it("deposit with zero token address is reverted with InvalidAmount owing the msg.value", async () => {
            let maturity = 10;
            let bondFee = 1;
            const depositPrincipalStEth = expandTo16Decimals(1) * BigInt(2);
            await endToken.setFee(20);

            expect(await mockEnderBond.rewardShareIndex()).to.be.equal(0);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
            await stEth.connect(signer1).approve(mockEnderBondAddress, depositPrincipalStEth);

            let mocksig = signatureDigest(signer, mockEnderBondAddress, signer1);
            const userSign = [signer1.address, "0", mocksig];
            const userSignerAddr = await mockEnderBond.verify(userSign);
            const contractSignerAddr = await mockEnderBond.signer();
            expect(userSignerAddr).to.eq(contractSignerAddr);

            await enderTreasury.setAddress(mockEnderBondAddress, 2);
            await bondNFT.setBondContract(mockEnderBondAddress);

            await expect(
                mockEnderBond.deposit(
                    signer1.address,
                    depositPrincipalStEth,
                    maturity,
                    bondFee,
                    ethers.ZeroAddress,
                    userSign,
                ),
            ).to.be.revertedWithCustomError(mockEnderBond, "InvalidAmount");
        });

        it("Deposit Revert InvalidMaturity() maturity < 5", async () => {
            let maturity = 4;
            let bondFee = 1;
            const depositAmountEnd = expandTo18Decimals(5);
            const depositPrincipalStEth = expandTo18Decimals(1);
            await endToken.setFee(20);

            expect(await enderBond.rewardShareIndex()).to.be.equal(0);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });

            await stEth.connect(signer1).approve(enderBondAddress, depositPrincipalStEth);

            await enderTreasury.setAddress(instadappLiteAddress, 5);
            await sleep(1200);
            let sig1 = signatureDigest(owner, enderBondAddress, signer1);
            await expect(
                enderBond
                    .connect(signer1)
                    .deposit(
                        signer1.address,
                        depositPrincipalStEth,
                        maturity,
                        bondFee,
                        stEthAddress,
                        [signer1.address, "0", sig1],
                    ),
            ).to.be.revertedWithCustomError(enderBond, "InvalidMaturity");
        });

        it("Deposit Revert NotWhitelisted with wrong signer address", async () => {
            let maturity = 10;
            let bondFee = 1;
            const depositPrincipalStEth = expandTo18Decimals(1);
            await endToken.setFee(20);

            expect(await mockEnderBond.rewardShareIndex()).to.be.equal(0);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });

            await stEth.connect(signer1).approve(mockEnderBondAddress, depositPrincipalStEth);

            await enderTreasury.setAddress(instadappLiteAddress, 5);
            await sleep(1200);
            let sig = signatureDigest(owner, enderBondAddress, signer1);
            const userSign = [signer1.address, "0", sig];
            const userSignerAddr = await mockEnderBond.verify(userSign);
            const contractSignerAddr = await mockEnderBond.signer();
            expect(userSignerAddr).to.be.not.equal(contractSignerAddr);

            await expect(
                mockEnderBond
                    .connect(signer1)
                    .deposit(
                        signer1.address,
                        depositPrincipalStEth,
                        maturity,
                        bondFee,
                        ethers.ZeroAddress,
                        userSign,
                    ),
            ).to.be.revertedWithCustomError(mockEnderBond, "NotWhitelisted");
        });

        it("Deposit Revert NotWhitelisted with wrong sender address", async () => {
            let maturity = 10;
            let bondFee = 1;
            const depositPrincipalStEth = expandTo18Decimals(1);
            await endToken.setFee(20);

            expect(await mockEnderBond.rewardShareIndex()).to.be.equal(0);
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });

            await stEth.connect(signer1).approve(mockEnderBondAddress, depositPrincipalStEth);

            await enderTreasury.setAddress(instadappLiteAddress, 5);
            await sleep(1200);
            let mocksig = signatureDigest(signer, mockEnderBondAddress, signer1);
            const userSign = [signer1.address, "0", mocksig];
            const userSignerAddr = await mockEnderBond.verify(userSign);
            const contractSignerAddr = await mockEnderBond.signer();
            expect(userSignerAddr).to.eq(contractSignerAddr);

            await expect(
                mockEnderBond
                    .connect(signer2)
                    .deposit(
                        signer1.address,
                        depositPrincipalStEth,
                        maturity,
                        bondFee,
                        ethers.ZeroAddress,
                        userSign,
                    ),
            ).to.be.revertedWithCustomError(mockEnderBond, "NotWhitelisted");
        });

        it("calculateRefractionData is reverted with NotBondUser custom error", async () => {
            const depositPrincipalStEth = expandTo16Decimals(1);
            const sig1 = await signatureDigest(owner, enderBondAddress, owner);
            let maturity = 7;
            let bondFee = 5;

            await mockEnderBond.whitelist(false);
            await mockEnderBond.setWithdrawPause(true);
            await mockEnderBond.setAddress(enderTreasuryAddress, 1);
            await mockEnderBond.setAddress(owner.address, 10);
            await stEth.submit({ value: ethers.parseEther("1.0") });
            await stEth.approve(mockEnderBondAddress, depositPrincipalStEth);
            await enderTreasury.setAddress(mockEnderBondAddress, 2);
            await bondNFT.setBondContract(mockEnderBondAddress);

            await mockEnderBond.deposit(
                owner,
                depositPrincipalStEth,
                maturity,
                bondFee,
                stEthAddress,
                [owner.address, "0", sig1],
                { value: depositPrincipalStEth },
            );
            filter = mockEnderBond.filters.Deposit;
            const events = await mockEnderBond.queryFilter(filter, -1);

            const event1 = events[0];

            const args1 = event1.args;
            const tokenId = args1.tokenId;

            const reason = mockEnderBond._calculateRefractionData(
                signer1.address,
                depositPrincipalStEth,
                maturity,
                tokenId,
                bondFee,
            );

            await expect(reason).to.be.revertedWithCustomError(mockEnderBond, "NotBondUser()");
        });

        describe("calculateReward functions test", function () {
            const depositPrincipalStEth = expandTo16Decimals(1);
            let maturity = 7;
            let bondFee = 5;
            const precalUsers = 100;
            let tokenId;
            let mockTokenId;

            beforeEach(async () => {
                const sig1 = await signatureDigest(owner, enderBondAddress, owner);

                await enderBond.whitelist(false);
                await enderBond.setWithdrawPause(true);
                await enderBond.setAddress(enderTreasuryAddress, 1);
                await enderBond.setAddress(owner.address, 10);
                await stEth.submit({ value: ethers.parseEther("1.0") });
                await stEth.approve(enderBondAddress, depositPrincipalStEth);
                await enderTreasury.setAddress(enderBondAddress, 2);
                await bondNFT.setBondContract(enderBondAddress);

                await enderBond.deposit(
                    owner,
                    depositPrincipalStEth,
                    maturity,
                    bondFee,
                    stEthAddress,
                    [owner.address, "0", sig1],
                    { value: depositPrincipalStEth },
                );
                filter = enderBond.filters.Deposit;
                let events = await enderBond.queryFilter(filter, -1);

                let event1 = events[0];

                let args1 = event1.args;
                tokenId = args1.tokenId;

                const mocksig1 = await signatureDigest(owner, mockEnderBondAddress, owner);

                await mockEnderBond.whitelist(false);
                await mockEnderBond.setWithdrawPause(true);
                await mockEnderBond.setAddress(enderTreasuryAddress, 1);
                await mockEnderBond.setAddress(owner.address, 10);
                await stEth.submit({ value: ethers.parseEther("1.0") });
                await stEth.approve(mockEnderBondAddress, depositPrincipalStEth);
                await enderTreasury.setAddress(mockEnderBondAddress, 2);
                await bondNFT.setBondContract(mockEnderBondAddress);

                await mockEnderBond.deposit(
                    owner,
                    depositPrincipalStEth,
                    maturity,
                    bondFee,
                    stEthAddress,
                    [owner.address, "0", mocksig1],
                    { value: depositPrincipalStEth },
                );
                filter = mockEnderBond.filters.Deposit;
                events = await mockEnderBond.queryFilter(filter, -1);

                event1 = events[0];

                args1 = event1.args;
                mockTokenId = args1.tokenId;
            });

            describe("calculateStakingReward function test", function () {
                it("reward calculating when precalUsers isn't zero", async () => {
                    const bond = await mockEnderBond.bonds(mockTokenId);
                    const rewardPrincipal = bond.principal;
                    const rewardSharePerUserIndexSend =
                        await mockEnderBond.rewardSharePerUserIndexSend(mockTokenId);
                    let sEndTokenReward = 0
                    if (precalUsers > Number(rewardSharePerUserIndexSend))
                        sEndTokenReward = (rewardPrincipal * (BigInt(precalUsers) - rewardSharePerUserIndexSend)) /
                        BigInt(1e18);
                    let rewardAmt = await mockEnderBond.calculateStakingReward(mockTokenId, precalUsers);
                    expect(rewardAmt).to.eq(sEndTokenReward);

                    await mockEnderBond.setRewardSharePerUserIndexSend(mockTokenId, precalUsers + 10);
                    rewardAmt = await mockEnderBond.calculateStakingReward(mockTokenId, precalUsers);
                    expect(rewardAmt).to.eq(0);
                });

                it("calculateStakingReward is reverted with NotBondUser custom error owing to invalid caller", async () => {
                    await expect(
                        enderBond.connect(signer1).calculateStakingReward(tokenId, 0),
                    ).to.be.revertedWithCustomError(enderBond, "NotBondUser");
                });

                it("calculateStakingReward is reverted with NotAllowed custom error when isSet is false", async () => {
                    await enderBond.setBool(false);
                    let isSet = await enderBond.isSet();
                    expect(isSet).to.eq(false);

                    await expect(
                        enderBond.calculateStakingReward(tokenId, 0),
                    ).to.be.revertedWithCustomError(enderBond, "NotAllowed");

                    await enderBond.setBool(true);
                    isSet = await enderBond.isSet();
                    expect(isSet).to.eq(true);
                });

                it("calculateStakingReward is tested with dayRewardShareIndexForSend", async () => {
                    const bond = await mockEnderBond.bonds(mockTokenId);
                    const startTime = bond.startTime;

                    await time.increase(3600);
                    await mockEnderBond.setAddress(owner.address, 8);
                    await mockEnderBond.epochRewardShareIndexForSend(1);
                    await mockEnderBond.setBool(true);

                    const blockNumBefore = await ethers.provider.getBlockNumber();
                    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
                    const timestampBefore = blockBefore.timestamp;

                    await mockEnderBond.setDayRewardShareIndexForSend(
                        maturity + Number(startTime / secondInDay),
                        timestampBefore,
                    );

                    const dayRewardShareIndexForSend =
                        await mockEnderBond.dayRewardShareIndexForSend(
                            maturity + Number(startTime / secondInDay),
                        );
                    expect(dayRewardShareIndexForSend).to.eq(timestampBefore);

                    rewardAmt = await mockEnderBond.calculateStakingReward(tokenId, 0);
                    expect(rewardAmt).to.eq(0);

                    await mockEnderBond.setAddress(enderStakingAddress, 8);
                });

                it("calculateStakingReward is returned the reward when dayRewardShareIndexForSend is not zero", async () => {
                    const bond = await mockEnderBond.bonds(mockTokenId);
                    const idx = bond.startTime / secondInDay + bond.maturity;

                    const dayRewardShareIndexForSend = await mockEnderBond.dayRewardShareIndexForSend(idx);

                    expect(dayRewardShareIndexForSend).to.eq(0);

                    await mockEnderBond.setDayRewardShareIndexForSend(idx, 1);
                    await mockEnderBond.setBool(true);
                    await mockEnderBond.setRewardShareIndexSend(1);

                    const rewardPrincipal = bond.principal;

                    let dayToRefractionShareUpdationSend = await mockEnderBond.getDayToRefractionShareUpdationSend(idx);

                    let sTime;

                    if (dayToRefractionShareUpdationSend.length === 1) {
                        sTime = dayToRefractionShareUpdationSend[0];
                    } else {
                        sTime = await mockEnderBond._findClosestS(dayToRefractionShareUpdationSend, bond.maturity * secondInDay + bond.startTime);
                    }

                    let userS = await mockEnderBond.secondsRefractionShareIndexSend(sTime);
                    let rewardSharePerUserIndexSend = await mockEnderBond.rewardSharePerUserIndexSend(mockTokenId);

                    let calcReward = 0;
                    if (userS > rewardSharePerUserIndexSend) calcReward = (rewardPrincipal * (userS - rewardSharePerUserIndexSend)) / BigInt(1e18);
                    let reward = await mockEnderBond.calculateStakingReward(mockTokenId, 0);
                    expect(reward).to.eq(calcReward);

                    await mockEnderBond.setSecondsRefractionShareIndexSend(sTime, rewardSharePerUserIndexSend + BigInt(200));
                    userS = await mockEnderBond.secondsRefractionShareIndexSend(sTime);

                    calcReward = (rewardPrincipal * (userS - rewardSharePerUserIndexSend)) / BigInt(1e18);
                    reward = await mockEnderBond.calculateStakingReward(mockTokenId, 0);
                    expect(reward).to.eq(calcReward);

                    await mockEnderBond.setRewardSharePerUserIndexSend(mockTokenId, userS + BigInt(100));
                    reward = await mockEnderBond.calculateStakingReward(mockTokenId, 0);
                    expect(reward).to.eq(BigInt(0));

                    await mockEnderBond.setDayToRefractionShareUpdationSend(idx, bond.startTime);
                    dayToRefractionShareUpdationSend = await mockEnderBond.getDayToRefractionShareUpdationSend(idx);
                    sTime = dayToRefractionShareUpdationSend[0];

                    userS = await mockEnderBond.secondsRefractionShareIndexSend(sTime);
                    rewardSharePerUserIndexSend = await mockEnderBond.rewardSharePerUserIndexSend(mockTokenId);

                    if (userS > rewardSharePerUserIndexSend) {
                        calcReward = (rewardPrincipal * (userS - rewardSharePerUserIndexSend)) / BigInt(1e18);
                    } else {
                        calcReward = 0;
                    }                    
                    reward = await mockEnderBond.calculateStakingReward(mockTokenId, 0);
                    expect(reward).to.eq(calcReward);
                });
            });

            describe("calculateRefractionRewards function test", function () {
                it("reward calculating when precalUsers isn't zero", async () => {
                    const bond = await mockEnderBond.bonds(mockTokenId);
                    const refractionPrincipal = bond.refractionPrincipal;
                    const rewardSharePerUserIndex =
                        await mockEnderBond.rewardSharePerUserIndex(mockTokenId);
                    const reward =
                        (refractionPrincipal * (BigInt(precalUsers) - rewardSharePerUserIndex)) /
                        BigInt(1e18);
                    let rewardAmt = await mockEnderBond.calculateRefractionRewards(
                        mockTokenId,
                        precalUsers,
                    );
                    expect(rewardAmt).to.eq(reward);

                    await mockEnderBond.setRewardSharePerUserIndex(mockTokenId, precalUsers + 1);
                    rewardAmt = await mockEnderBond.calculateRefractionRewards(
                        mockTokenId,
                        precalUsers,
                    );
                    expect(rewardAmt).to.eq(0);
                });

                it("calculateRefractionRewards is reverted with NotBondUser owing to invalid caller", async () => {
                    await enderBond.setBool(true);
                    await expect(
                        enderBond.connect(signer1).calculateRefractionRewards(tokenId, 0),
                    ).to.be.revertedWithCustomError(enderBond, "NotBondUser");
                });

                it("calculateRefractionRewards is reverted with NotAllowed custom error when isSet is false", async () => {
                    await enderBond.setBool(false);
                    let isSet = await enderBond.isSet();
                    expect(isSet).to.eq(false);

                    await expect(
                        enderBond.calculateRefractionRewards(tokenId, 0),
                    ).to.be.revertedWithCustomError(enderBond, "NotAllowed");

                    await enderBond.setBool(true);
                    isSet = await enderBond.isSet();
                    expect(isSet).to.eq(true);
                });

                it("calculateRefractionRewards is reverted with NoRewardCollected custom error", async () => {
                    await enderBond.setBool(true);
                    const rewardShareIndex = await enderBond.rewardShareIndex();
                    const rewardSharePerUserIndex =
                        await enderBond.rewardSharePerUserIndex(tokenId);

                    expect(rewardShareIndex).to.eq(rewardSharePerUserIndex);

                    await expect(
                        enderBond.calculateRefractionRewards(tokenId, 0),
                    ).to.be.revertedWithCustomError(enderBond, "NoRewardCollected");
                });

                it("calculateRefractionRewards returns zero", async () => {
                    await mockEnderBond.setBool(true);
                    const rewardShareIndex = await mockEnderBond.rewardShareIndex();
                    const rewardSharePerUserIndex =
                        await mockEnderBond.rewardSharePerUserIndex(mockTokenId);

                    expect(rewardShareIndex).to.eq(rewardSharePerUserIndex);

                    await mockEnderBond.setRewardSharePerUserIndex(
                        mockTokenId,
                        Number(rewardShareIndex) + 1,
                    );

                    const rewardAmt = await mockEnderBond.calculateRefractionRewards(
                        mockTokenId,
                        0,
                    );

                    expect(rewardAmt).to.eq(0);
                });

                it("calculateRefractionRewards is returned the reward when dayToRewardShareIndex is not zero", async () => {
                    const bond = await mockEnderBond.bonds(mockTokenId);
                    const idx = bond.startTime / secondInDay + bond.maturity;

                    const dayToRewardShareIndex = await mockEnderBond.dayToRewardShareIndex(idx);

                    expect(dayToRewardShareIndex).to.eq(0);

                    await mockEnderBond.setDayToRewardShareIndex(idx, 1);
                    await mockEnderBond.setBool(true);
                    await mockEnderBond.setRewardShareIndex(1);

                    const rewardPrincipal = bond.refractionPrincipal;

                    let dayToRefractionShareUpdation = await mockEnderBond.getDayToRefractionShareUpdation(idx);

                    let sTime;

                    if (dayToRefractionShareUpdation.length === 1) {
                        sTime = dayToRefractionShareUpdation[0];
                    } else {
                        sTime = await mockEnderBond._findClosestS(dayToRefractionShareUpdation, bond.maturity * secondInDay + bond.startTime);
                    }

                    let userS = await mockEnderBond.secondsRefractionShareIndex(sTime);
                    let rewardSharePerUserIndex = await mockEnderBond.rewardSharePerUserIndex(mockTokenId);

                    let calcReward = (rewardPrincipal * (userS - rewardSharePerUserIndex)) / BigInt(1e18);
                    let reward = await mockEnderBond.calculateRefractionRewards(mockTokenId, 0);
                    expect(reward).to.eq(calcReward);

                    await mockEnderBond.setSecondsRefractionShareIndex(sTime, Number(rewardSharePerUserIndex) + 200);
                    userS = await mockEnderBond.secondsRefractionShareIndex(sTime);

                    calcReward = (rewardPrincipal * (userS - rewardSharePerUserIndex)) / BigInt(1e18);
                    reward = await mockEnderBond.calculateRefractionRewards(mockTokenId, 0);
                    expect(reward).to.eq(calcReward);

                    await mockEnderBond.setRewardSharePerUserIndex(mockTokenId, Number(userS) + 100);
                    reward = await mockEnderBond.calculateRefractionRewards(mockTokenId, 0);
                    expect(reward).to.eq(BigInt(0));

                    await mockEnderBond.setDayToRefractionShareUpdation(idx, bond.startTime);
                    dayToRefractionShareUpdation = await mockEnderBond.getDayToRefractionShareUpdation(idx);
                    sTime = dayToRefractionShareUpdation[0];

                    userS = await mockEnderBond.secondsRefractionShareIndex(sTime);
                    rewardSharePerUserIndex = await mockEnderBond.rewardSharePerUserIndex(mockTokenId);

                    if (userS > rewardSharePerUserIndex) {
                        calcReward = (rewardPrincipal * (userS - rewardSharePerUserIndex)) / BigInt(1e18);
                    } else {
                        calcReward = 0;
                    }                    
                    reward = await mockEnderBond.calculateRefractionRewards(mockTokenId, 0);
                    expect(reward).to.eq(calcReward);
                });
            });

            describe("calculateBondRewardAmount function test", function () {
                it("reward calculating when precalUsers isn't zero", async () => {
                    const bond = await mockEnderBond.bonds(mockTokenId);
                    const depositPrincipal = bond.depositPrincipal;
                    const userBondYieldShareIndex =
                        await mockEnderBond.userBondYieldShareIndex(mockTokenId);

                    let reward = 0;
                    if (precalUsers > Number(userBondYieldShareIndex))
                        reward = depositPrincipal * (BigInt(precalUsers) - userBondYieldShareIndex);
                    let rewardAmt = await mockEnderBond.calculateBondRewardAmount(mockTokenId, precalUsers);
                    expect(rewardAmt).to.eq(reward);

                    rewardAmt = await mockEnderBond.calculateBondRewardAmount(
                        mockTokenId,
                        Number(userBondYieldShareIndex) + 1,
                    );
                    expect(rewardAmt).to.eq(depositPrincipal);

                    await mockEnderBond.setUserBondYieldShareIndex(mockTokenId, precalUsers + 1);
                    rewardAmt = await mockEnderBond.calculateBondRewardAmount(
                        mockTokenId,
                        precalUsers,
                    );
                    expect(rewardAmt).to.eq(0);
                });

                it("calculateBondRewardAmount is reverted with NotAllowed custom error when isSet is false", async () => {
                    await enderBond.setBool(false);
                    let isSet = await enderBond.isSet();
                    expect(isSet).to.eq(false);

                    await expect(
                        enderBond.calculateBondRewardAmount(tokenId, 0),
                    ).to.be.revertedWithCustomError(enderBond, "NotAllowed");

                    await enderBond.setBool(true);
                    isSet = await enderBond.isSet();
                    expect(isSet).to.eq(true);
                });

                it("calculateBondRewardAmount is returned the reward when dayBondYieldShareIndex is not zero", async () => {
                    const bond = await mockEnderBond.bonds(mockTokenId);
                    const idx = bond.startTime / secondInDay + bond.maturity;

                    const dayBondYieldShareIndex = await mockEnderBond.dayBondYieldShareIndex(idx);

                    expect(dayBondYieldShareIndex).to.eq(0);

                    await mockEnderBond.setDayBondYieldShareIndex(idx, 1);
                    await mockEnderBond.setBool(true);

                    const rewardPrincipal = bond.depositPrincipal;

                    let dayToYeildShareUpdation = await mockEnderBond.getDayToYeildShareUpdation(idx);

                    let sTime;

                    if (dayToYeildShareUpdation.length === 1) {
                        sTime = dayToYeildShareUpdation[0];
                    } else {
                        sTime = await mockEnderBond._findClosestS(dayToYeildShareUpdation, bond.maturity * secondInDay + bond.startTime);
                    }

                    let userS = await mockEnderBond.secondsBondYieldShareIndex(sTime);
                    let userBondYieldShareIndex = await mockEnderBond.userBondYieldShareIndex(mockTokenId);
                    let calcReward = 0;
                    if (userS > userBondYieldShareIndex)
                        calcReward = (rewardPrincipal * (userS - userBondYieldShareIndex));
                    let reward = await mockEnderBond.calculateBondRewardAmount(mockTokenId, 0);
                    expect(reward).to.eq(calcReward);

                    await mockEnderBond.setSecondsBondYieldShareIndex(sTime, Number(userBondYieldShareIndex) + 200);
                    userS = await mockEnderBond.secondsBondYieldShareIndex(sTime);

                    calcReward = (rewardPrincipal * (userS - userBondYieldShareIndex));
                    reward = await mockEnderBond.calculateBondRewardAmount(mockTokenId, 0);
                    expect(reward).to.eq(calcReward);

                    await mockEnderBond.setUserBondYieldShareIndex(mockTokenId, Number(userS) + 100);
                    reward = await mockEnderBond.calculateBondRewardAmount(mockTokenId, 0);
                    expect(reward).to.eq(BigInt(0));

                    await mockEnderBond.setDayToYeildShareUpdation(idx, bond.startTime);
                    dayToYeildShareUpdation = await mockEnderBond.getDayToYeildShareUpdation(idx);
                    sTime = dayToYeildShareUpdation[0];

                    userS = await mockEnderBond.secondsBondYieldShareIndex(sTime);
                    userBondYieldShareIndex = await mockEnderBond.userBondYieldShareIndex(mockTokenId);

                    if (userS > userBondYieldShareIndex) {
                        calcReward = (rewardPrincipal * (userS - userBondYieldShareIndex));
                    } else {
                        calcReward = 0;
                    }                    
                    reward = await mockEnderBond.calculateBondRewardAmount(mockTokenId, 0);
                    expect(reward).to.eq(calcReward);
                });
            });
        });

        describe("epochRewardShareIndexForSend function test", function () {
            it("epochRewardShareIndexForSend is reverted with invalid sender", async () => {
                await expect(
                    enderBond.connect(signer1).epochRewardShareIndexForSend(1),
                ).to.be.revertedWithCustomError(enderBond, "NotEnderStaking()");
            });
    
            it("epochRewardShareIndexForSend calculate the reward when dayToRefractionShareUpdationSend length is zero", async () => {
                let lastSecOfSendReward = await mockEnderBond.lastSecOfSendReward();

                await time.increase(3600);
    
                const blockNumBefore = await ethers.provider.getBlockNumber();
                const blockBefore = await ethers.provider.getBlock(blockNumBefore);
                const timestampBefore = blockBefore.timestamp;
                const timeNow = BigInt(timestampBefore) / secondInDay;
    
                let dayToRefractionShareUpdationSend = await mockEnderBond.getDayToRefractionShareUpdationSend(timeNow);
    
                const totalDeposit = await mockEnderBond.totalDeposit();
                const amountRequired = await mockEnderBond.getAmountRequired();
    
                await mockEnderBond.setTotalDeposit(amountRequired + BigInt(100));
    
                await mockEnderBond.setAddress(owner.address, 8);
                await mockEnderBond.epochRewardShareIndexForSend(1);
    
                dayToRefractionShareUpdationSend = await mockEnderBond.getDayToRefractionShareUpdationSend(timeNow);
                expect(dayToRefractionShareUpdationSend[0]).to.eq(lastSecOfSendReward);
            });
        });

        it("checkUpkeep", async () => {
            const lastTimeStamp = await enderBond.lastTimeStamp();

            const blockNumBefore = await ethers.provider.getBlockNumber();
            const blockBefore = await ethers.provider.getBlock(blockNumBefore);
            const timestampBefore = blockBefore.timestamp;

            const interval = await enderBond.interval();

            const isCheck = (BigInt(timestampBefore) - lastTimeStamp) > interval;
            const {upkeepNeeded, _} = await enderBond.checkUpkeep("0x0011");
            expect(upkeepNeeded).to.eq(isCheck);
        });
    });

    async function signatureDigest(signature, verifyContractAddress, user) {
        let sig = await signature.signTypedData(
            {
                name: "bondContract",
                version: "1",
                chainId: 31337,
                verifyingContract: verifyContractAddress,
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
                user: user.address,
                key: "0",
            },
        );
        return sig;
    }

    async function depositAndSetup(
        signer,
        depositAmount,
        maturity,
        bondFee,
        tokenAddress,
        [user, key, signature],
    ) {
        await enderBond
            //   .connect(signer)
            .deposit(signer, depositAmount, maturity, bondFee, tokenAddress, [
                user,
                key,
                signature,
            ]);
        filter = enderBond.filters.Deposit;
        const events = await enderBond.queryFilter(filter, -1);

        const event1 = events[0];

        const args1 = event1.args;
        const tokenId = args1.tokenId;

        return tokenId;
    }

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
});
