import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

import { StETH } from "../../typechain-types/contracts/ERC20/mockStEth.sol/StETH";
import { EnderBond } from "../../typechain-types/contracts/EnderBond";
import { EnderBondLiquidityDeposit } from "../../typechain-types/contracts/EnderBondLiquidityDeposit";
import { MockWETH } from "../../typechain-types/contracts/ERC20/StEth.sol/MockWETH";
import { Deployer } from "../utils/deployer";
import { expandToDecimals, signatureDigest } from "../utils/utils";

describe("enderBondLiquidityDeposit testing", function () {
    let owner: HardhatEthersSigner,
        signer: HardhatEthersSigner,
        wallet: HardhatEthersSigner,
        signer1: HardhatEthersSigner,
        signer2: HardhatEthersSigner,
        signer3: HardhatEthersSigner,
        signer4,
        stEthAddress: string,
        enderBondAddress: string,
        enderBondLiquidityDepositAddress: string,
        sEndTokenAddress,
        enderTreasuryAddress: string,
        wEth: MockWETH,
        stEth: StETH,
        enderBond: EnderBond,
        enderBondLiquidityDeposit: EnderBondLiquidityDeposit,
        signature: string,
        signature2: string,
        userSign: EnderBondLiquidityDeposit.SignDataStruct;

    const deployer = new Deployer();

    before(async function () {
        [owner, signer, wallet, signer1, signer2, signer3, signer4] = await ethers.getSigners();
        const contracts = await deployer.prepareEndBondTest({
            owner: owner.address,
            signer: signer.address,
        });

        stEth = contracts.stEth;
        stEthAddress = contracts.stEthAddr;

        //deploy wEth
        const wEthFactory = await ethers.getContractFactory("mockWETH");
        wEth = (await wEthFactory
            .connect(owner)
            .deploy("wrappedETH", "weth", owner.address)) as unknown as MockWETH;

        sEndTokenAddress = contracts.sEndTokenAddr;

        enderBondLiquidityDeposit = contracts.enderBondLiquidityDeposit;
        enderBondLiquidityDepositAddress = contracts.enderBondLiquidityDepositAddress;

        enderBond = contracts.enderBond;
        enderBondAddress = contracts.enderBondAddress;

        enderTreasuryAddress = contracts.enderTreasuryAddress;

        //signature
        signature = await signatureDigest(
            owner,
            "depositContract",
            enderBondLiquidityDepositAddress,
            signer1,
        );
        signature2 = await signatureDigest(
            owner,
            "depositContract",
            enderBondLiquidityDepositAddress,
            signer2,
        );
    });

    it("setting ender deposit contract to live", async () => {
        await enderBondLiquidityDeposit.setDepositEnable(true);
    });

    it("setting", async () => {
        // invalid signer
        await expect(
            enderBondLiquidityDeposit.connect(owner).setsigner(ethers.ZeroAddress),
        ).to.be.revertedWith("Address can't be zero");

        await enderBondLiquidityDeposit.connect(owner).setsigner(signer.address);
        const signerAddress = await enderBondLiquidityDeposit.contractSigner();
        expect(signerAddress).to.be.equal(signer.address);

        // set it back
        await enderBondLiquidityDeposit.connect(owner).setsigner(owner.address);

        // setting min deposit amount
        const oldAmount = await enderBondLiquidityDeposit.minDepositAmount();

        const newAmount = expandToDecimals(10, 18);
        await enderBondLiquidityDeposit.connect(owner).setMinDepAmount(newAmount);
        const minDepositAmount = await enderBondLiquidityDeposit.minDepositAmount();

        expect(minDepositAmount).to.be.equal(newAmount);

        // set it back
        await enderBondLiquidityDeposit.connect(owner).setMinDepAmount(oldAmount);

        // set zero address
        await expect(
            enderBondLiquidityDeposit.connect(owner).setAddress(ethers.ZeroAddress, 1),
        ).to.be.revertedWithCustomError(enderBondLiquidityDeposit, "ZeroAddress()");

        // set address
        const oldStEthAddress = await enderBondLiquidityDeposit.stEth();
        const oldLidoAddress = await enderBondLiquidityDeposit.lido();

        const randomTestAddress = "0x85df364E61C35aBd0384DBb33598b6cCd2d90588";

        await enderBondLiquidityDeposit.connect(owner).setAddress(randomTestAddress, 1);
        await enderBondLiquidityDeposit.connect(owner).setAddress(randomTestAddress, 2);

        const newStEthAddress = await enderBondLiquidityDeposit.stEth();
        const newLidoAddress = await enderBondLiquidityDeposit.lido();

        expect(newStEthAddress).to.be.equal(randomTestAddress);
        expect(newLidoAddress).to.be.equal(randomTestAddress);

        // set it back
        await enderBondLiquidityDeposit.connect(owner).setAddress(oldStEthAddress, 1);
        await enderBondLiquidityDeposit.connect(owner).setAddress(oldLidoAddress, 2);
    });

    it("Bond Fees:- bondfees and maturity checks", async () => {
        const maturity = 365;
        const bondFee = 10000;
        const depositPrincipalStEth = expandToDecimals(1, 16);

        await enderBondLiquidityDeposit.setDepositEnable(true);
        await wEth.mint(signer1.address, depositPrincipalStEth);
        await wEth.connect(signer1).approve(stEthAddress, depositPrincipalStEth);
        await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
        await stEth
            .connect(signer1)
            .approve(enderBondLiquidityDepositAddress, depositPrincipalStEth);

        userSign = {
            user: signer1.address,
            key: "0",
            signature: signature,
        };

        await expect(
            enderBondLiquidityDeposit
                .connect(signer1)
                .deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, userSign),
        ).to.be.revertedWithCustomError(enderBondLiquidityDeposit, "InvalidAmount()");
    });

    it("Deposit:- invalid deposit params", async () => {
        const maturity = 365;
        const bondFee = 10000;
        const depositPrincipalStEth = expandToDecimals(2, 18);

        await enderBondLiquidityDeposit.setDepositEnable(true);
        await wEth.mint(signer1.address, depositPrincipalStEth);
        await wEth.connect(signer1).approve(stEthAddress, depositPrincipalStEth);
        await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
        await stEth
            .connect(signer1)
            .approve(enderBondLiquidityDepositAddress, depositPrincipalStEth);

        userSign = {
            user: signer1.address,
            key: "0",
            signature: signature,
        };

        const invalidPrincipalStEth = expandToDecimals(2, 16);
        await expect(
            enderBondLiquidityDeposit
                .connect(signer1)
                .deposit(invalidPrincipalStEth, maturity, bondFee, stEthAddress, userSign),
        ).to.be.revertedWithCustomError(enderBondLiquidityDeposit, "InvalidAmount()");

        const bigMaturity = 366;
        await expect(
            enderBondLiquidityDeposit
                .connect(signer1)
                .deposit(depositPrincipalStEth, bigMaturity, bondFee, stEthAddress, userSign),
        ).to.be.revertedWithCustomError(enderBondLiquidityDeposit, "InvalidMaturity()");

        const smallMaturity = 6;
        await expect(
            enderBondLiquidityDeposit
                .connect(signer1)
                .deposit(depositPrincipalStEth, smallMaturity, bondFee, stEthAddress, userSign),
        ).to.be.revertedWithCustomError(enderBondLiquidityDeposit, "InvalidMaturity()");

        const invalidTokenAddress = "0x0c06B6D4EC451987e8C0B772ffcf7F080c46447A";
        await expect(
            enderBondLiquidityDeposit
                .connect(signer1)
                .deposit(depositPrincipalStEth, maturity, bondFee, invalidTokenAddress, userSign),
        ).to.be.revertedWithCustomError(enderBondLiquidityDeposit, "NotBondableToken()");

        const invalidBondFee = 100001;
        await expect(
            enderBondLiquidityDeposit
                .connect(signer1)
                .deposit(depositPrincipalStEth, maturity, invalidBondFee, stEthAddress, userSign),
        ).to.be.revertedWithCustomError(enderBondLiquidityDeposit, "InvalidBondFee()");

        // invalid amount of eth
        const principalAmount = expandToDecimals(3, 18);
        const differentEthAmount = expandToDecimals(2, 18);
        await expect(
            enderBondLiquidityDeposit
                .connect(signer1)
                .deposit(principalAmount, maturity, bondFee, ethers.ZeroAddress, userSign, {
                    value: differentEthAmount,
                }),
        ).to.be.revertedWithCustomError(enderBondLiquidityDeposit, "InvalidAmount()");

        const invalidSignature = signature2;

        userSign = {
            user: signer1.address,
            key: "0",
            signature: invalidSignature,
        };

        await expect(
            enderBondLiquidityDeposit
                .connect(signer1)
                .deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, userSign),
        ).to.be.revertedWith("user is not whitelisted");

        // deposit enable is false
        await enderBondLiquidityDeposit.connect(owner).setDepositEnable(false);
        let depositEnable = await enderBondLiquidityDeposit.depositEnable();
        expect(depositEnable).to.be.equal(false);

        userSign = {
            user: signer1.address,
            key: "0",
            signature,
        };

        await expect(
            enderBondLiquidityDeposit
                .connect(signer1)
                .deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, userSign),
        ).to.be.revertedWithCustomError(enderBondLiquidityDeposit, "NotAllowed()");

        await enderBondLiquidityDeposit.connect(owner).setDepositEnable(true);
        depositEnable = await enderBondLiquidityDeposit.depositEnable();
        expect(depositEnable).to.be.equal(true);
    });

    it("enderBondLiquidityDeposit:- deposit function", async () => {
        const maturity = 90;
        const bondFee = 500;
        const depositPrincipalStEth = expandToDecimals(1, 18);

        await wEth.mint(signer1.address, depositPrincipalStEth);
        await wEth.connect(signer1).approve(stEthAddress, depositPrincipalStEth);
        await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
        await stEth
            .connect(signer1)
            .approve(enderBondLiquidityDepositAddress, depositPrincipalStEth);

        userSign = {
            user: signer1.address,
            key: "0",
            signature,
        };

        await enderBondLiquidityDeposit
            .connect(signer1)
            .deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, userSign);
    });

    it("enderBondLiquidityDeposit:- deposit function also checking reward share index", async () => {
        const maturity = 90;
        const bondFee = 500;
        const depositPrincipalStEth = expandToDecimals(1, 18);

        await enderBondLiquidityDeposit.setDepositEnable(true);

        await wEth.mint(signer1.address, depositPrincipalStEth);
        await wEth.connect(signer1).approve(stEthAddress, depositPrincipalStEth);

        await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
        await stEth
            .connect(signer1)
            .approve(enderBondLiquidityDepositAddress, depositPrincipalStEth);

        userSign = {
            user: signer1.address,
            key: "0",
            signature,
        };

        await enderBondLiquidityDeposit
            .connect(signer1)
            .deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, userSign);

        await wEth.mint(signer2.address, depositPrincipalStEth);
        await wEth.connect(signer2).approve(stEthAddress, depositPrincipalStEth);

        await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });
        await wEth.mint(signer1.address, depositPrincipalStEth);

        await wEth.connect(signer1).transfer(stEthAddress, depositPrincipalStEth);
        await stEth
            .connect(signer2)
            .approve(enderBondLiquidityDepositAddress, 1500000000000000000n);

        userSign = {
            user: signer2.address,
            key: "0",
            signature: signature2,
        };

        await enderBondLiquidityDeposit
            .connect(signer2)
            .deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, userSign);
    });

    it("enderBondLiquidityDeposit:- multiple deposit", async () => {
        const maturity = 90;
        const bondFee = 500;
        const depositPrincipalStEth = expandToDecimals(1, 18);

        await enderBondLiquidityDeposit.setDepositEnable(true);

        await wEth.mint(signer1.address, depositPrincipalStEth);
        await wEth.connect(signer1).approve(stEthAddress, depositPrincipalStEth);

        await enderBond.whitelist(false);

        await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
        await stEth
            .connect(signer1)
            .approve(enderBondLiquidityDepositAddress, depositPrincipalStEth);

        userSign = {
            user: signer1.address,
            key: "0",
            signature,
        };

        await enderBondLiquidityDeposit
            .connect(signer1)
            .deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, userSign);

        await wEth.mint(signer1.address, depositPrincipalStEth);
        await wEth.connect(signer1).transfer(stEthAddress, depositPrincipalStEth);

        await wEth.mint(signer2.address, depositPrincipalStEth);
        await wEth.connect(signer2).approve(stEthAddress, depositPrincipalStEth);

        await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });
        await stEth
            .connect(signer2)
            .approve(enderBondLiquidityDepositAddress, 1500000000000000000n);

        userSign = {
            user: signer2.address,
            key: "0",
            signature: signature2,
        };

        await enderBondLiquidityDeposit
            .connect(signer2)
            .deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, userSign);

        await enderBond.setAddress(enderBondLiquidityDepositAddress, 10);
        await enderBond.setAddress(enderTreasuryAddress, 1);

        await enderBondLiquidityDeposit.approvalForBond(
            enderBondAddress,
            await stEth.balanceOf(enderBondLiquidityDepositAddress),
        );
        userSign = {
            user: signer1.address,
            key: "0",
            signature,
        };
        await enderBond.userInfoDepositContract([1, 2], userSign);
    });

    it("enderBondLiquidityDeposit testing for mainnet:- multiple deposit", async () => {
        const maturity = 90;
        const bondFee = 500;
        const depositPrincipalStEth = expandToDecimals(1, 18);

        await enderBondLiquidityDeposit.setDepositEnable(true);

        await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
        await stEth
            .connect(signer1)
            .approve(enderBondLiquidityDepositAddress, depositPrincipalStEth);

        userSign = {
            user: signer1.address,
            key: "0",
            signature,
        };

        await enderBondLiquidityDeposit
            .connect(signer1)
            .deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, userSign);

        await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });
        await stEth
            .connect(signer2)
            .approve(enderBondLiquidityDepositAddress, 1500000000000000000n);

        userSign = {
            user: signer2.address,
            key: "0",
            signature: signature2,
        };

        await enderBondLiquidityDeposit
            .connect(signer2)
            .deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, userSign);
    });

    it("testing the stEth", async () => {
        const depositPrincipalStEth = expandToDecimals(1, 18);

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
    });
});

// npx hardhat coverage --testfiles test/unit/EnderBondLiquidityDeposit.test.js
