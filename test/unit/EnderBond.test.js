const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");
const { BigNumber, ZeroAddress } = require("ethers");
const { EigenLayerStrategyManagerAddress } = require("../utils/common");
const exp = require("constants");
const { sign } = require("crypto");
const { log, assert } = require("console");
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
    let 
    owner, 
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
    mockEnderBondV1Address,
    mockEnderBondV2Address,
    mockEnderBondV3Address,
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
    mockEnderBondV1,
    mockEnderBondV2,
    mockEnderBondV3,
    enderBondLiquidityDeposit,
    endToken,
    sEndToken,
    enderTreasury,
    bondNFT,
    instadappLitelidoStaking,
    enderStaking,
    
    signature, 
    signature1;

    before(async function () {
        const wEthFactory = await ethers.getContractFactory("mockWETH");
        const stEthFactory = await ethers.getContractFactory("StETH");
        const instadappLiteFactory = await ethers.getContractFactory("StinstaToken");
        const endTokenFactory = await ethers.getContractFactory("EndToken");
        const enderBondLiquidityBondFactory = await ethers.getContractFactory("EnderBondLiquidityDeposit");
        const enderBondFactory = await ethers.getContractFactory("EnderBond");
        const enderTreasuryFactory = await ethers.getContractFactory("EnderTreasury");
        const enderStakingFactory = await ethers.getContractFactory("EnderStaking");
        const sEndTokenFactory = await ethers.getContractFactory("SEndToken");
        const bondNftFactory = await ethers.getContractFactory("BondNFT");
        const MockEnderBond = await ethers.getContractFactory("MockEnderBond");
        const MockEnderBondV1 = await ethers.getContractFactory("MockEnderBondV1");
        const MockEnderBondV2 = await ethers.getContractFactory("MockEnderBondV2");
        const MockEnderBondV3 = await ethers.getContractFactory("MockEnderBondV3");
    
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

        // deploy mock EnderBond
        mockEnderBond = await upgrades.deployProxy(
            MockEnderBond,
            [endTokenAddress, ethers.ZeroAddress, signer.address],
            {
                initializer: "initialize",
            }
        );
        mockEnderBondAddress = await mockEnderBond.getAddress();

        //set mockEnderBond address in endToken
        await endToken.setBond(mockEnderBondAddress);

        // deploy mock EnderBondV1
        mockEnderBondV1 = await upgrades.deployProxy(
            MockEnderBondV1,
            [endTokenAddress, ethers.ZeroAddress, signer.address],
            {
                initializer: "initialize",
            }
        );
        mockEnderBondV1Address = await mockEnderBondV1.getAddress();

        //set mockEnderBondV1 address in endToken
        await endToken.setBond(mockEnderBondV1Address);

        // deploy mock EnderBondV2
        mockEnderBondV2 = await upgrades.deployProxy(
            MockEnderBondV2,
            [endTokenAddress, ethers.ZeroAddress, signer.address],
            {
                initializer: "initialize",
            }
        );
        mockEnderBondV2Address = await mockEnderBondV2.getAddress();

        //set mockEnderBondV2 address in endToken
        await endToken.setBond(mockEnderBondV2Address);

        // deploy mock EnderBondV3
        mockEnderBondV3 = await upgrades.deployProxy(
            MockEnderBondV3,
            [endTokenAddress, ethers.ZeroAddress, signer.address],
            {
                initializer: "initialize",
            }
        );
        mockEnderBondV3Address = await mockEnderBondV3.getAddress();

        //set mockEnderBondV3 address in endToken
        await endToken.setBond(mockEnderBondV3Address);
    
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

        // mockEnderBond setting
        await mockEnderBond.setBondableTokens([stEthAddress], true);
        await mockEnderBond.setAddress(enderTreasuryAddress, 1);
        await mockEnderBond.setAddress(bondNFTAddress, 3);
        await mockEnderBond.setAddress(sEndTokenAddress, 9);
        await mockEnderBond.setAddress(stEthAddress, 6);

        // mockEnderBondV1 setting
        await mockEnderBondV1.setBondableTokens([stEthAddress], true);
        await mockEnderBondV1.setAddress(enderTreasuryAddress, 1);
        await mockEnderBondV1.setAddress(bondNFTAddress, 3);
        await mockEnderBondV1.setAddress(sEndTokenAddress, 9);
        await mockEnderBondV1.setAddress(stEthAddress, 6);

        // mockEnderBondV2 setting
        await mockEnderBondV2.setBondableTokens([stEthAddress], true);
        await mockEnderBondV2.setAddress(enderTreasuryAddress, 1);
        await mockEnderBondV2.setAddress(bondNFTAddress, 3);
        await mockEnderBondV2.setAddress(sEndTokenAddress, 9);
        await mockEnderBondV2.setAddress(stEthAddress, 6);

        // mockEnderBondV3 setting
        await mockEnderBondV3.setBondableTokens([stEthAddress], true);
        await mockEnderBondV3.setAddress(enderTreasuryAddress, 1);
        await mockEnderBondV3.setAddress(bondNFTAddress, 3);
        await mockEnderBondV3.setAddress(sEndTokenAddress, 9);
        await mockEnderBondV3.setAddress(stEthAddress, 6);

        //signature
        signature = await signatureDigest(owner, enderBondAddress, signer1);
        signature1 = await signatureDigest(owner, enderBondAddress, signer2);

    });

    it("should fail on second initialization attempt", async function () {            
        // Attempt to re-initialize
        await expect(enderBond.initialize(endTokenAddress, ethers.ZeroAddress, signer.address))
          .to.be.revertedWith("Initializable: contract is already initialized");
    });

    it("epochRewardShareIndexByPass function test", async () => {
        const beforelastSecOfRefraction = await mockEnderBondV1.lastSecOfRefraction();
        await mockEnderBondV1.epochRewardShareIndexByPass();
        const lastSecOfRefraction = await mockEnderBondV1.lastSecOfRefraction();
        const secondInDay = await mockEnderBondV1.SECONDS_IN_DAY();

        const blockNumBefore = await ethers.provider.getBlockNumber();
        const blockBefore = await ethers.provider.getBlock(blockNumBefore);
        const timestampBefore = blockBefore.timestamp;

        const timeNow = BigInt(timestampBefore) / secondInDay;
        const lastTimeNow = lastSecOfRefraction / secondInDay;

        expect(timeNow).to.eq(lastTimeNow);

        const afterDayToRefractionShareUpdation = await mockEnderBondV1.getDayToRefractionShareUpdation(Number(timeNow));
        expect(afterDayToRefractionShareUpdation[0]).to.eq(beforelastSecOfRefraction);
    });

    it("epochRewardShareIndexSendByPass function test", async () => {
        const beforelastSecOfSendReward = await mockEnderBondV1.lastSecOfSendReward();
        await mockEnderBondV1.epochRewardShareIndexSendByPass();
        const lastSecOfSendReward = await mockEnderBondV1.lastSecOfSendReward();
        const secondInDay = await mockEnderBondV1.SECONDS_IN_DAY();

        const blockNumBefore = await ethers.provider.getBlockNumber();
        const blockBefore = await ethers.provider.getBlock(blockNumBefore);
        const timestampBefore = blockBefore.timestamp;

        const timeNow = BigInt(timestampBefore) / secondInDay;
        const lastTimeNow = lastSecOfSendReward / secondInDay;

        console.log("d ->", beforelastSecOfSendReward, lastSecOfSendReward,timeNow )

        expect(timeNow).to.eq(lastTimeNow);

        let afterDayToRefractionShareUpdationSend = await mockEnderBondV1.getDayToRefractionShareUpdationSend(Number(timeNow));
        expect(afterDayToRefractionShareUpdationSend[0]).to.eq(beforelastSecOfSendReward);

        await mockEnderBondV1.epochRewardShareIndexSendByPass();

        afterDayToRefractionShareUpdationSend = await mockEnderBondV1.getDayToRefractionShareUpdationSend(Number(timeNow));
        expect(afterDayToRefractionShareUpdationSend[0]).to.eq(beforelastSecOfSendReward);

    });

    it("setting interval", async () => {
        const interval = 10;
        await enderBond.setInterval(interval);
        const updatedInterval = await enderBond.interval();

        expect(updatedInterval).to.equal(interval);
    });

    it("setting address", async () => {
        await expect(enderBond.setAddress(ethers.ZeroAddress, 1)).to.be.revertedWithCustomError(enderBond, "ZeroAddress()");
        await expect(enderBond.setAddress(signatureAddr, 0)).to.be.revertedWithCustomError(enderBond, "InvalidAddress()");
    });

    it("setting new signer", async () => {
        const signerAddr = "0x0000000000000000000000000000000000000123";
        const oldSigner = await enderBond.signer();
        await enderBond.setsigner(signerAddr);
        const newSigner = await enderBond.signer();

        expect(newSigner).to.equal(signerAddr);
        expect(newSigner).to.not.equal(oldSigner);

        await expect(enderBond.setsigner(ethers.ZeroAddress)).to.be.revertedWithCustomError(enderBond, "ZeroAddress()");
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
        await expect(enderBond.getPrivateAddress(0)).to.be.revertedWithCustomError(enderBond, "ZeroAddress()");

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

        await expect(enderBond.getPrivateAddress(11)).to.be.revertedWithCustomError(enderBond, "InvalidAddress()");
    });

    it("setting available bond fee", async () => {
        await mockEnderBondV2.setAddress(signer1, 1);
        const treasuryAddr = await mockEnderBondV2.getPrivateAddress(1);
        expect(treasuryAddr).to.equal(signer1.address);
        await mockEnderBondV2.initAvailableBondFee(20);

        const bondFeeAmt = 5;
        const originalAvailableBondFee = await mockEnderBondV2.getAvailableBondFee();
        await mockEnderBondV2.connect(signer1).setAvailableBondFee(bondFeeAmt);
        const availableBondFee = await mockEnderBondV2.getAvailableBondFee();

        await expect(mockEnderBondV2.connect(signer2).setAvailableBondFee(bondFeeAmt)).to.be.revertedWithCustomError(mockEnderBondV2, "NoTreasury()");

        expect(availableBondFee).to.equal(originalAvailableBondFee-BigInt(bondFeeAmt));
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
                .deposit(signer, 10, maturity, bondFee, stEthAddress, [signer1.address, "0", sig1])
            ).to.be.revertedWithCustomError(enderBond, "NotAllowed()");
    });

    describe("withdraw & _withdraw function test", function() {
        it("withdraw revert owing to not allowed", async () => {
            let isWithdrawPause = await enderBond.isWithdrawPause();
            expect(isWithdrawPause).to.equal(true);
    
            await enderBond.setWithdrawPause(false);
            isWithdrawPause = await enderBond.isWithdrawPause();
            expect(isWithdrawPause).to.equal(false);
    
            await expect(enderBond.withdraw(1)).to.be.revertedWithCustomError(enderBond, "NotAllowed()");
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
            await stEth
                .approve(enderBondAddress, depositPrincipalStEth);
    
            await enderBond.deposit(
                owner,
                depositPrincipalStEth,
                maturity,
                bondFee,
                stEthAddress,
                [owner.address, "0", sig1],
                {value: depositPrincipalStEth}
            );
            filter = enderBond.filters.Deposit;
            const events = await enderBond.queryFilter(filter, -1);
        
            const event1 = events[0];
        
            const args1 = event1.args;
            const tokenId = args1.tokenId;
            await time.increase(7200);
            await enderBond.withdraw(tokenId);
    
            await expect(enderBond.withdraw(1)).to.be.revertedWithCustomError(enderBond, "BondAlreadyWithdrawn()");
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
                .deposit(signer, 10, maturity, bondFee, stEthAddress, [signer1.address, "0", sig1])
            ).to.be.revertedWithCustomError(enderBond, "NotAllowed()");

        await enderBond.setWithdrawPause(true);
        const isWithdrawPause = await enderBond.isWithdrawPause();
        expect(isWithdrawPause).to.equal(true);

        await expect(enderBond.withdraw(1)).to.be.revertedWithCustomError(enderBond, "NotAllowed()");

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
        sVal = await mockEnderBond._findClosestS([1, 8, 9, 10, 10, 10, 10, 10, 10, 11, 13, 15, 16, 18], 10);
        expect(sVal).to.equal(10);
        sVal = await mockEnderBond._findClosestS([], 10);
        expect(sVal).to.equal(0);
    });

    describe("setIndexesOfUser function test", function() {
        it("setIndexesOfUser setting", async () => {
            const refractionSIndex = 1;
            const stakingSendIndex = 2;
            const YieldIndex = 3;
            const tokenIds = [1, 2];
            await enderBond.setIndexesOfUser(tokenIds, refractionSIndex, stakingSendIndex, YieldIndex);
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
                enderBond.connect(signer1).setIndexesOfUser(tokenIds, refractionSIndex, stakingSendIndex, YieldIndex)
            ).to.be.rejectedWith("Ownable: caller is not the owner");        
        });
    
        it("setIndexOfUser is reverted with ZeroValue custom error", async () => {
            const refractionSIndex = 1;
            const stakingSendIndex = 2;
            const YieldIndex = 3;
            const tokenIds = [1, 2];
    
            await expect(
                enderBond.setIndexesOfUser(tokenIds, 0, stakingSendIndex, YieldIndex)
            ).to.be.revertedWithCustomError(enderBond, "ZeroValue()");
    
            await expect(
                enderBond.setIndexesOfUser(tokenIds, refractionSIndex, 0, YieldIndex)
            ).to.be.revertedWithCustomError(enderBond, "ZeroValue()");
    
            await expect(
                enderBond.setIndexesOfUser(tokenIds, refractionSIndex, stakingSendIndex, 0)
            ).to.be.revertedWithCustomError(enderBond, "ZeroValue()");
        });
    });

    it("setInterval is reverted with invalid caller", async () => {
        await expect(
            enderBond.connect(signer1).setInterval(10)
        ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("setBool is reverted with invalid caller", async () => {
        await expect(
            enderBond.connect(signer1).setBool(true)
        ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("setAddress is reverted with invalid caller", async () => {
        await expect(
            enderBond.connect(signer1).setAddress(owner.address, 5)
        ).to.be.revertedWith("Ownable: caller is not the owner");
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
        await expect(
            enderBond.connect(signer1).setsigner(owner)
        ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("setMinDepAmount is reverted with invalid caller", async () => {
        await expect(
            enderBond.connect(signer1).setMinDepAmount(10)
        ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("setTxFees is reverted with invalid caller", async () => {
        await expect(
            enderBond.connect(signer1).setTxFees(5)
        ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("setBondYieldBaseRate is reverted with invalid caller", async () => {
        await expect(
            enderBond.connect(signer1).setBondYieldBaseRate(5)
        ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("setBondableTokens is reverted with invalid caller", async () => {
        await expect(
            enderBond.connect(signer1).setBondableTokens([stEthAddress], true)
        ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("userInfoDepositContract is reverted with invalid caller", async () => {
        await expect(
            enderBond.connect(signer1).userInfoDepositContract([1,2], [signer1.address, "0", signature])
        ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("userInfoDepositContract", async () => {
        await enderBond.userInfoDepositContract([], [signer1.address, "0", signature]);
    });

    it("deductFeesFromTransfer is reverted with NotBondNFT error", async () => {
        await expect(
            enderBond.connect(signer1).deductFeesFromTransfer(1)
        ).to.be.revertedWithCustomError(enderBond, "NotBondNFT()");
    });

    it("epochRewardShareIndex is reverted with NotEndToken", async () => {
        await expect(
            enderBond.connect(signer1).epochRewardShareIndex(1)
        ).to.be.revertedWithCustomError(enderBond, "NotEndToken()");
    });

    describe("epochRewardShareIndexForSend function test", function() {
        it("epochRewardShareIndexForSend is reverted with invalid sender", async () => {
            await expect(
                enderBond.connect(signer1).epochRewardShareIndexForSend(1)
            ).to.be.revertedWithCustomError(enderBond, "NotEnderStaking()");
        });
    });

    describe("resetEndMint function test", function() {
        it("resetEndMint is reverted with invalid sender", async() => {
            await expect(
                enderBond.connect(signer1).resetEndMint()
            ).to.be.revertedWithCustomError(enderBond, "NoTreasury()");
        });    
    });

    describe("deposit function test", function() {

        beforeEach(async () => {
            await mockEnderBond.setAddress(enderTreasuryAddress, 1);
        })

        it("deposit call with zero token address", async () => {
            let maturity = 10;
            let bondFee = 1;
            const depositPrincipalStEth = expandTo16Decimals(1) * BigInt(2);
            await endToken.setFee(20);

            expect(await mockEnderBond.rewardShareIndex()).to.be.equal(0);                                                   
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });      
            await stEth
                .connect(signer1)
                .approve(mockEnderBondAddress, depositPrincipalStEth);
    
            let mocksig = signatureDigest(signer, mockEnderBondAddress, signer1);        
            const userSign = [signer1.address, "0", mocksig];
            const userSignerAddr = await mockEnderBond.verify(userSign);
            const contractSignerAddr = await mockEnderBond.signer();
            expect(userSignerAddr).to.eq(contractSignerAddr);
    
            await enderTreasury.setAddress(mockEnderBondAddress, 2);
            await bondNFT.setBondContract(mockEnderBondAddress);
    
            const sendAmt = await stEth.balanceOf(mockEnderBondAddress);
    
            await expect(mockEnderBond.deposit(
                signer1.address,
                depositPrincipalStEth,
                maturity,
                bondFee,
                ethers.ZeroAddress,
                userSign, {value: depositPrincipalStEth}
            )).to.emit(mockEnderBond, "Deposit")
            .withArgs(signer1.address, 2, sendAmt, maturity, ethers.ZeroAddress, bondFee );
        });

        it("deposit with zero token address is reverted with InvalidAmount owing the msg.value", async () => {
            let maturity = 10;
            let bondFee = 1;
            const depositPrincipalStEth = expandTo16Decimals(1) * BigInt(2);
            await endToken.setFee(20);    
          
            expect(await mockEnderBond.rewardShareIndex()).to.be.equal(0);                                                   
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });      
            await stEth
                .connect(signer1)
                .approve(mockEnderBondAddress, depositPrincipalStEth);
    
            let mocksig = signatureDigest(signer, mockEnderBondAddress, signer1);        
            const userSign = [signer1.address, "0", mocksig];
            const userSignerAddr = await mockEnderBond.verify(userSign);
            const contractSignerAddr = await mockEnderBond.signer();
            expect(userSignerAddr).to.eq(contractSignerAddr);
    
            await enderTreasury.setAddress(mockEnderBondAddress, 2);
            await bondNFT.setBondContract(mockEnderBondAddress);
    
            await expect(mockEnderBond.deposit(
                signer1.address,
                depositPrincipalStEth,
                maturity,
                bondFee,
                ethers.ZeroAddress,
                userSign
            )).to.be.revertedWithCustomError(mockEnderBond, "InvalidAmount");
        });
    
        it("Deposit Revert InvalidMaturity() maturity < 5", async () => {
            let maturity = 4;
            let bondFee = 1;
            const depositAmountEnd = expandTo18Decimals(5);
            const depositPrincipalStEth = expandTo18Decimals(1);
            await endToken.setFee(20);
          
          
            expect(await enderBond.rewardShareIndex()).to.be.equal(0);                                                   
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
          
            await stEth
            .connect(signer1)
            .approve(enderBondAddress, depositPrincipalStEth);
          
            await enderTreasury.setAddress(instadappLiteAddress, 5);
            await sleep(1200);
            let sig1 = signatureDigest(owner, enderBondAddress, signer1);    
            await expect(
              enderBond.connect(signer1).deposit(
                signer1.address,
                depositPrincipalStEth,
                maturity,
                bondFee,
                stEthAddress,
                [signer1.address, "0", sig1]
              )
            ).to.be.revertedWithCustomError(enderBond, "InvalidMaturity");
        });
    
        it("Deposit Revert NotWhitelisted with wrong signer address", async () => {
            let maturity = 10;
            let bondFee = 1;
            const depositPrincipalStEth = expandTo18Decimals(1);
            await endToken.setFee(20);
          
          
            expect(await mockEnderBond.rewardShareIndex()).to.be.equal(0);                                                   
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
          
            await stEth
                .connect(signer1)
                .approve(mockEnderBondAddress, depositPrincipalStEth);
          
            await enderTreasury.setAddress(instadappLiteAddress, 5);
            await sleep(1200);
            let sig = signatureDigest(owner, enderBondAddress, signer1);
            const userSign = [signer1.address, "0", sig];
            const userSignerAddr = await mockEnderBond.verify(userSign);
            const contractSignerAddr = await mockEnderBond.signer();
            expect(userSignerAddr).to.be.not.equal(contractSignerAddr);
            
            await expect(
              mockEnderBond.connect(signer1).deposit(
                signer1.address,
                depositPrincipalStEth,
                maturity,
                bondFee,
                ethers.ZeroAddress,
                userSign
              )
            ).to.be.revertedWithCustomError(mockEnderBond, "NotWhitelisted");
        });
    
        it("Deposit Revert NotWhitelisted with wrong sender address", async () => {
            let maturity = 10;
            let bondFee = 1;
            const depositPrincipalStEth = expandTo18Decimals(1);
            await endToken.setFee(20);
          
          
            expect(await mockEnderBond.rewardShareIndex()).to.be.equal(0);                                                   
            await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
          
            await stEth
                .connect(signer1)
                .approve(mockEnderBondAddress, depositPrincipalStEth);
          
            await enderTreasury.setAddress(instadappLiteAddress, 5);
            await sleep(1200);
            let mocksig = signatureDigest(signer, mockEnderBondAddress, signer1);        
            const userSign = [signer1.address, "0", mocksig];
            const userSignerAddr = await mockEnderBond.verify(userSign);
            const contractSignerAddr = await mockEnderBond.signer();
            expect(userSignerAddr).to.eq(contractSignerAddr);
            
            await expect(
              mockEnderBond.connect(signer2).deposit(
                signer1.address,
                depositPrincipalStEth,
                maturity,
                bondFee,
                ethers.ZeroAddress,
                userSign
              )
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
            await stEth
                .approve(mockEnderBondAddress, depositPrincipalStEth);
            await enderTreasury.setAddress(mockEnderBondAddress, 2);
            await bondNFT.setBondContract(mockEnderBondAddress);
    
            await mockEnderBond.deposit(
                owner,
                depositPrincipalStEth,
                maturity,
                bondFee,
                stEthAddress,
                [owner.address, "0", sig1],
                {value: depositPrincipalStEth}
            );
            filter = mockEnderBond.filters.Deposit;
            const events = await mockEnderBond.queryFilter(filter, -1);
        
            const event1 = events[0];
        
            const args1 = event1.args;
            const tokenId = args1.tokenId;
    
            const reason = mockEnderBond._calculateRefractionData(signer1.address, depositPrincipalStEth, maturity, tokenId, bondFee);
    
            await expect(reason).to.be.revertedWithCustomError(mockEnderBond, "NotBondUser()");
        });

        describe("calculateReward functions test", function() {
            const depositPrincipalStEth = expandTo16Decimals(1);                
            let maturity = 7;
            let bondFee = 5;
            const precalUsers = 100;
            let tokenId;
            let mockV1TokenId;
            let mockV2TokenId;
            let mockV3TokenId;

            beforeEach( async () => {
                const sig1 = await signatureDigest(owner, enderBondAddress, owner);
        
                await enderBond.whitelist(false);
                await enderBond.setWithdrawPause(true);
                await enderBond.setAddress(enderTreasuryAddress, 1);
                await enderBond.setAddress(owner.address, 10);
                await stEth.submit({ value: ethers.parseEther("1.0") });      
                await stEth
                    .approve(enderBondAddress, depositPrincipalStEth);
                await enderTreasury.setAddress(enderBondAddress, 2);
                await bondNFT.setBondContract(enderBondAddress);
        
                await enderBond.deposit(
                    owner,
                    depositPrincipalStEth,
                    maturity,
                    bondFee,
                    stEthAddress,
                    [owner.address, "0", sig1],
                    {value: depositPrincipalStEth}
                );
                filter = enderBond.filters.Deposit;
                let events = await enderBond.queryFilter(filter, -1);
            
                let event1 = events[0];
            
                let args1 = event1.args;
                tokenId = args1.tokenId;


                const mockV1sig1 = await signatureDigest(owner, mockEnderBondV1Address, owner);
        
                await mockEnderBondV1.whitelist(false);
                await mockEnderBondV1.setWithdrawPause(true);
                await mockEnderBondV1.setAddress(enderTreasuryAddress, 1);
                await mockEnderBondV1.setAddress(owner.address, 10);
                await stEth.submit({ value: ethers.parseEther("1.0") });      
                await stEth
                    .approve(mockEnderBondV1Address, depositPrincipalStEth);
                await enderTreasury.setAddress(mockEnderBondV1Address, 2);
                await bondNFT.setBondContract(mockEnderBondV1Address);
        
                await mockEnderBondV1.deposit(
                    owner,
                    depositPrincipalStEth,
                    maturity,
                    bondFee,
                    stEthAddress,
                    [owner.address, "0", mockV1sig1],
                    {value: depositPrincipalStEth}
                );
                filter = mockEnderBondV1.filters.Deposit;
                events = await mockEnderBondV1.queryFilter(filter, -1);
            
                event1 = events[0];
            
                args1 = event1.args;
                mockV1TokenId = args1.tokenId;

                const mockV2sig1 = await signatureDigest(owner, mockEnderBondV2Address, owner);
        
                await mockEnderBondV2.whitelist(false);
                await mockEnderBondV2.setWithdrawPause(true);
                await mockEnderBondV2.setAddress(enderTreasuryAddress, 1);
                await mockEnderBondV2.setAddress(owner.address, 10);
                await stEth.submit({ value: ethers.parseEther("1.0") });      
                await stEth
                    .approve(mockEnderBondV2Address, depositPrincipalStEth);
                await enderTreasury.setAddress(mockEnderBondV2Address, 2);
                await bondNFT.setBondContract(mockEnderBondV2Address);
        
                await mockEnderBondV2.deposit(
                    owner,
                    depositPrincipalStEth,
                    maturity,
                    bondFee,
                    stEthAddress,
                    [owner.address, "0", mockV2sig1],
                    {value: depositPrincipalStEth}
                );
                filter = mockEnderBondV2.filters.Deposit;
                events = await mockEnderBondV2.queryFilter(filter, -1);
            
                event1 = events[0];
            
                args1 = event1.args;
                mockV2TokenId = args1.tokenId;

                const mockV3sig1 = await signatureDigest(owner, mockEnderBondV3Address, owner);
        
                await mockEnderBondV3.whitelist(false);
                await mockEnderBondV3.setWithdrawPause(true);
                await mockEnderBondV3.setAddress(enderTreasuryAddress, 1);
                await mockEnderBondV3.setAddress(owner.address, 10);
                await stEth.submit({ value: ethers.parseEther("1.0") });      
                await stEth
                    .approve(mockEnderBondV3Address, depositPrincipalStEth);
                await enderTreasury.setAddress(mockEnderBondV3Address, 2);
                await bondNFT.setBondContract(mockEnderBondV3Address);
        
                await mockEnderBondV3.deposit(
                    owner,
                    depositPrincipalStEth,
                    maturity,
                    bondFee,
                    stEthAddress,
                    [owner.address, "0", mockV3sig1],
                    {value: depositPrincipalStEth}
                );
                filter = mockEnderBondV3.filters.Deposit;
                events = await mockEnderBondV3.queryFilter(filter, -1);
            
                event1 = events[0];
            
                args1 = event1.args;
                mockV3TokenId = args1.tokenId;
            });

            describe("calculateStakingReward function test", function() {
                it("reward calculating when precalUsers isn't zero", async () => { 
                    const bond = await enderBond.bonds(tokenId);
                    const rewardPrincipal = bond.principal;
                    const rewardSharePerUserIndexSend = await enderBond.rewardSharePerUserIndexSend(tokenId);
                    const sEndTokenReward = (rewardPrincipal * (BigInt(precalUsers) - rewardSharePerUserIndexSend)) / BigInt(1e18);
                    let rewardAmt = await enderBond.calculateStakingReward(tokenId, precalUsers);
                    expect(rewardAmt).to.eq(sEndTokenReward);
    
                    rewardAmt = await enderBond.calculateStakingReward(tokenId, 10);
                    expect(rewardAmt).to.eq(0);
                });
    
                it("calculateStakingReward is reverted with NotBondUser custom error owing to invalid caller", async () => {
                    await expect(
                        enderBond.connect(signer1).calculateStakingReward(tokenId, 0)
                    ).to.be.revertedWithCustomError(enderBond, "NotBondUser");
                });
    
                it("calculateStakingReward is reverted with NotAllowed custom error when isSet is false", async () => {
                    await enderBond.setBool(false);
                    let isSet = await enderBond.isSet();
                    expect(isSet).to.eq(false);
    
                    await expect(
                        enderBond.calculateStakingReward(tokenId, 0)
                    ).to.be.revertedWithCustomError(enderBond, "NotAllowed");
    
                    await enderBond.setBool(true);
                    isSet = await enderBond.isSet();
                    expect(isSet).to.eq(true);
                });
    
                it("calculateStakingReward is tested with dayRewardShareIndexForSend", async () => {
                    const bond = await mockEnderBondV1.bonds(mockV2TokenId);
                    const startTime = bond.startTime;
                    const secondInDay = await mockEnderBondV2.SECONDS_IN_DAY();
    
                    await time.increase(3600);
                    await mockEnderBondV2.setAddress(owner.address, 8);
                    await mockEnderBondV2.epochRewardShareIndexForSend(1);
                    await mockEnderBondV2.setBool(true);
    
                    const blockNumBefore = await ethers.provider.getBlockNumber();
                    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
                    const timestampBefore = blockBefore.timestamp;
    
                    await mockEnderBondV2.setDayRewardShareIndexForSend(maturity + Number(startTime/secondInDay), timestampBefore);
    
                    const dayRewardShareIndexForSend = await mockEnderBondV2.dayRewardShareIndexForSend(maturity + Number(startTime/secondInDay));
                    expect(dayRewardShareIndexForSend).to.eq(timestampBefore);
    
                    rewardAmt = await mockEnderBondV2.calculateStakingReward(tokenId, 0);
                    expect(rewardAmt).to.eq(0);
    
                    await mockEnderBondV2.setAddress(enderStakingAddress, 8);
                });
            });

            describe("calculateRefractionRewards function test", function() {
                it("reward calculating when precalUsers isn't zero", async () => {
                    const bond = await enderBond.bonds(tokenId);
                    const refractionPrincipal = bond.refractionPrincipal;
                    const rewardSharePerUserIndex = await enderBond.rewardSharePerUserIndex(tokenId);
                    const reward = (refractionPrincipal * (BigInt(precalUsers) - rewardSharePerUserIndex)) / BigInt(1e18);
                    let rewardAmt = await enderBond.calculateRefractionRewards(tokenId, precalUsers);
                    expect(rewardAmt).to.eq(reward);
                });

                it("calculateRefractionRewards is reverted with NotBondUser owing to invalid caller", async () => {
                    await enderBond.setBool(true);
                    await expect(
                        enderBond.connect(signer1).calculateRefractionRewards(tokenId, 0)
                    ).to.be.revertedWithCustomError(enderBond, "NotBondUser");
                });

                it("calculateRefractionRewards is reverted with NotAllowed custom error when isSet is false", async () => {
                    await enderBond.setBool(false);
                    let isSet = await enderBond.isSet();
                    expect(isSet).to.eq(false);
    
                    await expect(
                        enderBond.calculateRefractionRewards(tokenId, 0)
                    ).to.be.revertedWithCustomError(enderBond, "NotAllowed");
    
                    await enderBond.setBool(true);
                    isSet = await enderBond.isSet();
                    expect(isSet).to.eq(true);
                });

                it("calculateRefractionRewards is reverted with NoRewardCollected custom error", async () => {
                    await enderBond.setBool(true);
                    const rewardShareIndex = await enderBond.rewardShareIndex();
                    const rewardSharePerUserIndex = await enderBond.rewardSharePerUserIndex(tokenId);

                    expect(rewardShareIndex).to.eq(rewardSharePerUserIndex);

                    await expect(
                        enderBond.calculateRefractionRewards(tokenId, 0)
                    ).to.be.revertedWithCustomError(enderBond, "NoRewardCollected");
                });

                it("calculateRefractionRewards returns zero", async () => {
                    await mockEnderBondV3.setBool(true);
                    const rewardShareIndex = await mockEnderBondV3.rewardShareIndex();
                    const rewardSharePerUserIndex = await mockEnderBondV3.rewardSharePerUserIndex(mockV3TokenId);

                    expect(rewardShareIndex).to.eq(rewardSharePerUserIndex);

                    await mockEnderBondV3.setRewardSharePerUserIndex(mockV3TokenId, Number(rewardShareIndex) + 1);

                    const rewardAmt = await mockEnderBondV3.calculateRefractionRewards(mockV3TokenId, 0);

                    expect(rewardAmt).to.eq(0);
                });
            });

            describe("calculateBondRewardAmount function test", function() {
                it("reward calculating when precalUsers isn't zero", async () => {
                    const bond = await enderBond.bonds(tokenId);
                    const depositPrincipal = bond.depositPrincipal;
                    const userBondYieldShareIndex = await enderBond.userBondYieldShareIndex(tokenId);

                    let reward = 0;
                    if (precalUsers > Number(userBondYieldShareIndex))
                        reward = (depositPrincipal * (BigInt(precalUsers) - userBondYieldShareIndex));
                    let rewardAmt = await enderBond.calculateBondRewardAmount(tokenId, precalUsers);
                    expect(rewardAmt).to.eq(reward);

                    rewardAmt = await enderBond.calculateBondRewardAmount(tokenId, Number(userBondYieldShareIndex)+1);
                    expect(rewardAmt).to.eq(depositPrincipal);
                });

                it("calculateBondRewardAmount is reverted with NotAllowed custom error when isSet is false", async () => {
                    await enderBond.setBool(false);
                    let isSet = await enderBond.isSet();
                    expect(isSet).to.eq(false);
    
                    await expect(
                        enderBond.calculateBondRewardAmount(tokenId, 0)
                    ).to.be.revertedWithCustomError(enderBond, "NotAllowed");
    
                    await enderBond.setBool(true);
                    isSet = await enderBond.isSet();
                    expect(isSet).to.eq(true);
                });
            });
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
                user: user.address,
                key: "0",
            }
        )
        return sig;
    };

    async function depositAndSetup(signer, depositAmount, maturity, bondFee, tokenAddress, [user, key, signature]) {
        await enderBond
        //   .connect(signer)
          .deposit(signer, depositAmount, maturity, bondFee, tokenAddress, [user, key, signature]);
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
