const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
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
        signature = await signatureDigest();
        signature1 = await signatureDigest1();

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
        await mockEnderBond.setAddress(signer1, 1);
        const treasuryAddr = await mockEnderBond.getPrivateAddress(1);
        expect(treasuryAddr).to.equal(signer1.address);
        await mockEnderBond.initAvailableBondFee(20);

        const bondFeeAmt = 5;
        const originalAvailableBondFee = await mockEnderBond.getAvailableBondFee();
        await mockEnderBond.connect(signer1).setAvailableBondFee(bondFeeAmt);
        const availableBondFee = await mockEnderBond.getAvailableBondFee();

        await expect(mockEnderBond.connect(signer2).setAvailableBondFee(bondFeeAmt)).to.be.revertedWithCustomError(mockEnderBond, "NoTreasury()");

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

        let sig1 = signatureDigest();

        await expect(
            enderBond
                .connect(signer)
                .deposit(signer, 10, maturity, bondFee, stEthAddress, [signer1.address, "0", sig1])
            ).to.be.revertedWithCustomError(enderBond, "NotAllowed()");
    });

    it("withdraw revert owing to not allowed", async () => {
        let isWithdrawPause = await enderBond.isWithdrawPause();
        expect(isWithdrawPause).to.equal(true);

        await enderBond.setWithdrawPause(false);
        isWithdrawPause = await enderBond.isWithdrawPause();
        expect(isWithdrawPause).to.equal(false);

        await expect(enderBond.withdraw(1)).to.be.revertedWithCustomError(enderBond, "NotAllowed()");
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
        let sig1 = signatureDigest();

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

    it("epochRewardShareIndexForSend is reverted with invalid sender", async () => {
        await expect(
            enderBond.connect(signer1).epochRewardShareIndexForSend(1)
        ).to.be.revertedWithCustomError(enderBond, "NotEnderStaking()");
    });

    it("resetEndMint is reverted with invalid sender", async() => {
        await expect(
            enderBond.connect(signer1).resetEndMint()
        ).to.be.revertedWithCustomError(enderBond, "NoTreasury()");
    });

    // it.only("calculateRefractionData is reverted with NotBondUser custom error", async () => {
    //     let maturity = 90;
    //     let bondFee = 5;
    //     let principal = 1;
    //     // let principal = 10n**14n

    //     console.log('p ->', principal, ethers.parseEther("0.001"));

    //     let sig1 = signatureDigest();
    //     const treasury = await enderBond.getAddress(1);

    //     await stEth.increaseAllowance(treasury, 100);

    //     const tokenId = await enderBond
    //         .deposit(signer1, principal, maturity, bondFee, stEthAddress, [signer1.address, "1234", sig1], { value: principal });
    //     const reason = mockEnderBond._calculateRefractionData(signer2.address, principal, maturity, tokenId, bondFee);

    //     await expect(reason).to.be.revertedWithCustomError(mockEnderBond, "NotBondUser()");
    // })

    // it("withdraw is reverted with BondAlreadyWithdrawn custom error", async () => {
    //     const depositPrincipalStEth = expandTo18Decimals(1);
    //     const signature1 = await signatureDigest();
    //     let maturity = 90;
    //     let bondFee = 5;

    //     const tokenId_1_1 = await depositAndSetup(signer1, depositPrincipalStEth, maturity, bondFee, [signer1.address, "0", signature1]);
    //     await enderBond.withdraw(tokenId_1_1);

    //     // await expect(enderBond.withdraw(1)).to.be.revertedWithCustomError(enderBond, "BondAlreadyWithdrawn()");
    // });

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
        let sig1 = signatureDigest();    
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

    it("Deposit Revert NotWhitelisted()", async () => {
        let maturity = 10;
        let bondFee = 1;
        const depositPrincipalStEth = expandTo18Decimals(1);
        await endToken.setFee(20);
      
      
        expect(await enderBond.rewardShareIndex()).to.be.equal(0);                                                   
        await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
      
        await stEth
        .connect(signer1)
        .approve(enderBondAddress, depositPrincipalStEth);
      
        await enderTreasury.setAddress(instadappLiteAddress, 5);
        await sleep(1200);
        let sig1 = signatureDigest();    
        await expect(
          enderBond.connect(signer1).deposit(
            signer1.address,
            depositPrincipalStEth,
            maturity,
            bondFee,
            stEthAddress,
            [signer1.address, "0", sig1]
          )
        ).to.be.revertedWithCustomError(enderBond, "NotWhitelisted");
    });









    it("setting ender deposit contract to live", async () => {
        await enderBondLiquidityDeposit.setDepositEnable(true);
    });

    it("Bond Fees:- bondfees and maturity checks", async() => {
        const maturity = 365;
        const bondFee = 10000;
        const depositPrincipalStEth = expandTo16Decimals(1);

        await enderBondLiquidityDeposit.setDepositEnable(true);
        await wEth.mint(signer1.address, depositPrincipalStEth);
        await wEth.connect(signer1).approve(stEthAddress, depositPrincipalStEth);
        await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
        await stEth.connect(signer1).approve(enderBondLiquidityDepositAddress, depositPrincipalStEth);

        await expect(enderBondLiquidityDeposit.connect(signer1).deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, [signer1.address, "0", signature]))
        .to.be
        .revertedWithCustomError(enderBondLiquidityDeposit, 'InvalidAmount()');
    })

    it("enderBondLiquidityDeposit:- deposit function", async() => {
        const maturity = 90;
        const bondFee = 500;
        const depositPrincipalStEth = expandTo18Decimals(1);
        
        await wEth.mint(signer1.address, depositPrincipalStEth);
        await wEth.connect(signer1).approve(stEthAddress, depositPrincipalStEth);
        await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
        await stEth.connect(signer1).approve(enderBondLiquidityDepositAddress, depositPrincipalStEth);
        await enderBondLiquidityDeposit.connect(signer1).deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, [signer1.address, "0", signature]);
    });

    it("enderBondLiquidityDeposit:- deposit function also checking reward share index", async() => {
        const maturity = 90;
        const bondFee = 500;
        const depositPrincipalStEth = expandTo18Decimals(1);

        await enderBondLiquidityDeposit.setDepositEnable(true);

        await wEth.mint(signer1.address, depositPrincipalStEth);
        await wEth.connect(signer1).approve(stEthAddress, depositPrincipalStEth);

        await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
        await stEth.connect(signer1).approve(enderBondLiquidityDepositAddress, depositPrincipalStEth);

        await enderBondLiquidityDeposit.connect(signer1).deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, [signer1.address, "0", signature]);
         
        await wEth.mint(signer2.address, depositPrincipalStEth);
        await wEth.connect(signer2).approve(stEthAddress, depositPrincipalStEth);

        await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });
        await wEth.mint(signer1.address, depositPrincipalStEth);

        await wEth.connect(signer1).transfer(stEthAddress, depositPrincipalStEth);
        await stEth.connect(signer2).approve(enderBondLiquidityDepositAddress, 1500000000000000000n);

        await enderBondLiquidityDeposit.connect(signer2).deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, [signer2.address, "0", signature1]);
    });
    
    it("enderBondLiquidityDeposit:- multiple deposit", async() => {
        const maturity = 90;
        const bondFee = 500;
        const depositPrincipalStEth = expandTo18Decimals(1);

        await enderBondLiquidityDeposit.setDepositEnable(true);
        
        await wEth.mint(signer1.address, depositPrincipalStEth);
        await wEth.connect(signer1).approve(stEthAddress, depositPrincipalStEth);
        
        await enderBond.whitelist(false);

        await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
        await stEth.connect(signer1).approve(enderBondLiquidityDepositAddress, depositPrincipalStEth);

        await enderBondLiquidityDeposit.connect(signer1).deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, [signer1.address, "0", signature]);
        
        await wEth.mint(signer1.address, depositPrincipalStEth);
        await wEth.connect(signer1).transfer(stEthAddress, depositPrincipalStEth);

        await wEth.mint(signer2.address, depositPrincipalStEth);
        await wEth.connect(signer2).approve(stEthAddress, depositPrincipalStEth);

        await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });
        await stEth.connect(signer2).approve(enderBondLiquidityDepositAddress, 1500000000000000000n);

        await enderBondLiquidityDeposit.connect(signer2).deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, [signer2.address, "0", signature1]);

        await enderBond.setAddress(enderBondLiquidityDepositAddress, 10);
        await enderBond.setAddress(enderTreasuryAddress, 1);

        await enderBondLiquidityDeposit.approvalForBond(enderBondAddress, await stEth.balanceOf(enderBondLiquidityDepositAddress));
        await enderBond.userInfoDepositContract([1,2], [signer1.address, "0", signature]);
    });

    it("enderBondLiquidityDeposit testing for mainnet:- multiple deposit", async() => {
        const maturity = 90;
        const bondFee = 500;
        const depositPrincipalStEth = expandTo18Decimals(1);

        await enderBondLiquidityDeposit.setDepositEnable(true);

        await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
        await stEth.connect(signer1).approve(enderBondLiquidityDepositAddress, depositPrincipalStEth);

        await enderBondLiquidityDeposit.connect(signer1).deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, [signer1.address, "0", signature]);

        await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });
        await stEth.connect(signer2).approve(enderBondLiquidityDepositAddress, 1500000000000000000n);

        await enderBondLiquidityDeposit.connect(signer2).deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, [signer2.address, "0", signature1]);
    });

    it("testing the stEth", async() =>{
        const depositPrincipalStEth = expandTo18Decimals(1);

        await wEth.mint(signer2.address, depositPrincipalStEth);
        await wEth.connect(signer2).approve(stEthAddress, depositPrincipalStEth);

        await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });

        await wEth.mint(signer1.address, depositPrincipalStEth);
        await wEth.connect(signer1).transfer(stEthAddress, depositPrincipalStEth);

        await wEth.mint(signer3.address, depositPrincipalStEth);
        await wEth.connect(signer3).approve(stEthAddress, depositPrincipalStEth);

        await stEth.connect(signer3).submit({ value: ethers.parseEther("1.0") });

        await wEth.mint(signer1.address, depositPrincipalStEth);
        await wEth.connect(signer1).transfer(stEthAddress, depositPrincipalStEth);

        await wEth.mint(signer2.address, depositPrincipalStEth);
        await wEth.connect(signer2).approve(stEthAddress, depositPrincipalStEth);

        await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });
    })

    async function signatureDigest() { 
        let sig = await owner.signTypedData(
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
    };

    async function signatureDigest1() { 
        let sig = await owner.signTypedData(
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

    async function depositAndSetup(signer, depositAmount, maturity, bondFee, [user, key, signature]) {
        await enderBond
        //   .connect(signer)
          .deposit(signer, depositAmount, maturity, bondFee, stEthAddress, [user, key, signature]);
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
