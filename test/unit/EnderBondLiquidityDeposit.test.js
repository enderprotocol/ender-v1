const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { BigNumber } = require("ethers");
const { EigenLayerStrategyManagerAddress } = require("../utils/common");
const { sign } = require("crypto");
const { log } = require("console");
const signature = "0xA2fFDf332d92715e88a958A705948ADF75d07d01";
const baseURI = "https://endworld-backend-git-dev-metagaming.vercel.app/nft/metadata/";
const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
const ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";

function expandTo18Decimals(n) {
    return ethers.parseUnits(n.toString(), 18);
}

function expandTo16Decimals(n) {
    return ethers.parseUnits(n.toString(), 16);
}

describe("enderBondLiquidityDeposit testing", function () {
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
        enderBondLiquidityDepositAddress,
        endTokenAddress,
        endETHAddress,
        sEndTokenAddress,
        enderTreasuryAddress,
        bondNFTAddress,
        instadappLiteAddress,
        enderStakingAddress,
        wEth,
        stEth,
        enderBond,
        enderBondLiquidityDeposit,
        endToken,
        endETHToken,
        sEndToken,
        enderTreasury,
        bondNFT,
        instadappLitelidoStaking,
        enderStaking,
        signature,
        signature2;

    before(async function () {
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
        const EndETHFactory = await ethers.getContractFactory("EnderStakeEth");

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

        // deploy endETH token
        endETHToken = await upgrades.deployProxy(EndETHFactory, [], {
            initializer: "initialize"
        });
        endETHAddress = await endETHToken.getAddress();

        //deploy enderBond
        enderBond = await upgrades.deployProxy(
            enderBondFactory,
            [endTokenAddress, endETHAddress, ethers.ZeroAddress, signer.address],
            {
                initializer: "initialize",
            },
        );
        enderBondAddress = await enderBond.getAddress();

        //set enderBond address in endToken
        await endToken.setBond(enderBondAddress);

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

        await endETHToken.setTreasury(enderTreasuryAddress);
        await endETHToken.grantRole(MINTER_ROLE, enderBondAddress);

        //signature
        signature = await signatureDigest1();
        signature2 = await signatureDigest2();
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
        const signerAddress = await enderBondLiquidityDeposit.signer();
        expect(signerAddress).to.be.equal(signer.address);

        // set it back
        await enderBondLiquidityDeposit.connect(owner).setsigner(owner.address);

        // setting min deposit amount
        const oldAmount = await enderBondLiquidityDeposit.minDepositAmount();

        const newAmount = expandTo18Decimals(10);
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
        const depositPrincipalStEth = expandTo16Decimals(1);

        await enderBondLiquidityDeposit.setDepositEnable(true);
        await wEth.mint(signer1.address, depositPrincipalStEth);
        await wEth.connect(signer1).approve(stEthAddress, depositPrincipalStEth);
        await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
        await stEth
            .connect(signer1)
            .approve(enderBondLiquidityDepositAddress, depositPrincipalStEth);

        await expect(
            enderBondLiquidityDeposit
                .connect(signer1)
                .deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, [
                    signer1.address,
                    "0",
                    signature,
                ]),
        ).to.be.revertedWithCustomError(enderBondLiquidityDeposit, "InvalidAmount()");
    });

    it("Deposit:- invalid deposit params", async () => {
        const maturity = 365;
        const bondFee = 10000;
        const depositPrincipalStEth = expandTo18Decimals(2);

        await enderBondLiquidityDeposit.setDepositEnable(true);
        await wEth.mint(signer1.address, depositPrincipalStEth);
        await wEth.connect(signer1).approve(stEthAddress, depositPrincipalStEth);
        await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
        await stEth
            .connect(signer1)
            .approve(enderBondLiquidityDepositAddress, depositPrincipalStEth);

        const invalidPrincipalStEth = expandTo16Decimals(2);
        await expect(
            enderBondLiquidityDeposit
                .connect(signer1)
                .deposit(invalidPrincipalStEth, maturity, bondFee, stEthAddress, [
                    signer1.address,
                    "0",
                    signature,
                ]),
        ).to.be.revertedWithCustomError(enderBondLiquidityDeposit, "InvalidAmount()");

        const bigMaturity = 366;
        await expect(
            enderBondLiquidityDeposit
                .connect(signer1)
                .deposit(depositPrincipalStEth, bigMaturity, bondFee, stEthAddress, [
                    signer1.address,
                    "0",
                    signature,
                ]),
        ).to.be.revertedWithCustomError(enderBondLiquidityDeposit, "InvalidMaturity()");

        const smallMaturity = 6;
        await expect(
            enderBondLiquidityDeposit
                .connect(signer1)
                .deposit(depositPrincipalStEth, smallMaturity, bondFee, stEthAddress, [
                    signer1.address,
                    "0",
                    signature,
                ]),
        ).to.be.revertedWithCustomError(enderBondLiquidityDeposit, "InvalidMaturity()");

        const invalidTokenAddress = "0x0c06B6D4EC451987e8C0B772ffcf7F080c46447A";
        await expect(
            enderBondLiquidityDeposit
                .connect(signer1)
                .deposit(depositPrincipalStEth, maturity, bondFee, invalidTokenAddress, [
                    signer1.address,
                    "0",
                    signature,
                ]),
        ).to.be.revertedWithCustomError(enderBondLiquidityDeposit, "NotBondableToken()");

        const invalidBondFee = 100001;
        await expect(
            enderBondLiquidityDeposit
                .connect(signer1)
                .deposit(depositPrincipalStEth, maturity, invalidBondFee, stEthAddress, [
                    signer1.address,
                    "0",
                    signature,
                ]),
        ).to.be.revertedWithCustomError(enderBondLiquidityDeposit, "InvalidBondFee()");

        // invalid amount of eth
        const principalAmount = expandTo18Decimals(3);
        const differentEthAmount = expandTo18Decimals(2);
        await expect(
            enderBondLiquidityDeposit
                .connect(signer1)
                .deposit(
                    principalAmount,
                    maturity,
                    bondFee,
                    ethers.ZeroAddress,
                    [signer1.address, "0", signature],
                    {
                        value: differentEthAmount,
                    },
                ),
        ).to.be.revertedWithCustomError(enderBondLiquidityDeposit, "InvalidAmount()");

        const invalidSignature = signature2;
        await expect(
            enderBondLiquidityDeposit
                .connect(signer1)
                .deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, [
                    signer1.address,
                    "0",
                    invalidSignature,
                ]),
        ).to.be.revertedWith("user is not whitelisted");

        // deposit enable is false
        await enderBondLiquidityDeposit.connect(owner).setDepositEnable(false);
        let depositEnable = await enderBondLiquidityDeposit.depositEnable();
        expect(depositEnable).to.be.equal(false);

        await expect(
            enderBondLiquidityDeposit
                .connect(signer1)
                .deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, [
                    signer1.address,
                    "0",
                    signature,
                ]),
        ).to.be.revertedWithCustomError(enderBondLiquidityDeposit, "NotAllowed()");

        await enderBondLiquidityDeposit.connect(owner).setDepositEnable(true);
        depositEnable = await enderBondLiquidityDeposit.depositEnable();
        expect(depositEnable).to.be.equal(true);
    });

    it("enderBondLiquidityDeposit:- deposit function", async () => {
        const maturity = 90;
        const bondFee = 500;
        const depositPrincipalStEth = expandTo18Decimals(1);

        await wEth.mint(signer1.address, depositPrincipalStEth);
        await wEth.connect(signer1).approve(stEthAddress, depositPrincipalStEth);
        await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
        await stEth
            .connect(signer1)
            .approve(enderBondLiquidityDepositAddress, depositPrincipalStEth);
        await enderBondLiquidityDeposit
            .connect(signer1)
            .deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, [
                signer1.address,
                "0",
                signature,
            ]);
    });

    it("enderBondLiquidityDeposit:- deposit function also checking reward share index", async () => {
        const maturity = 90;
        const bondFee = 500;
        const depositPrincipalStEth = expandTo18Decimals(1);

        await enderBondLiquidityDeposit.setDepositEnable(true);

        await wEth.mint(signer1.address, depositPrincipalStEth);
        await wEth.connect(signer1).approve(stEthAddress, depositPrincipalStEth);

        await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
        await stEth
            .connect(signer1)
            .approve(enderBondLiquidityDepositAddress, depositPrincipalStEth);

        await enderBondLiquidityDeposit
            .connect(signer1)
            .deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, [
                signer1.address,
                "0",
                signature,
            ]);

        await wEth.mint(signer2.address, depositPrincipalStEth);
        await wEth.connect(signer2).approve(stEthAddress, depositPrincipalStEth);

        await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });
        await wEth.mint(signer1.address, depositPrincipalStEth);

        await wEth.connect(signer1).transfer(stEthAddress, depositPrincipalStEth);
        await stEth
            .connect(signer2)
            .approve(enderBondLiquidityDepositAddress, 1500000000000000000n);

        await enderBondLiquidityDeposit
            .connect(signer2)
            .deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, [
                signer2.address,
                "0",
                signature2,
            ]);
    });

    it("enderBondLiquidityDeposit:- multiple deposit", async () => {
        const maturity = 90;
        const bondFee = 500;
        const depositPrincipalStEth = expandTo18Decimals(1);

        await enderBondLiquidityDeposit.setDepositEnable(true);

        await wEth.mint(signer1.address, depositPrincipalStEth);
        await wEth.connect(signer1).approve(stEthAddress, depositPrincipalStEth);

        await enderBond.whitelist(false);

        await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
        await stEth
            .connect(signer1)
            .approve(enderBondLiquidityDepositAddress, depositPrincipalStEth);

        await enderBondLiquidityDeposit
            .connect(signer1)
            .deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, [
                signer1.address,
                "0",
                signature,
            ]);

        await wEth.mint(signer1.address, depositPrincipalStEth);
        await wEth.connect(signer1).transfer(stEthAddress, depositPrincipalStEth);

        await wEth.mint(signer2.address, depositPrincipalStEth);
        await wEth.connect(signer2).approve(stEthAddress, depositPrincipalStEth);

        await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });
        await stEth
            .connect(signer2)
            .approve(enderBondLiquidityDepositAddress, 1500000000000000000n);

        await enderBondLiquidityDeposit
            .connect(signer2)
            .deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, [
                signer2.address,
                "0",
                signature2,
            ]);

        await enderBond.setAddress(enderBondLiquidityDepositAddress, 10);
        await enderBond.setAddress(enderTreasuryAddress, 1);

        await enderBondLiquidityDeposit.approvalForBond(
            enderBondAddress,
            await stEth.balanceOf(enderBondLiquidityDepositAddress),
        );
        await enderBond.userInfoDepositContract([1, 2], [signer1.address, "0", signature]);
    });

    it("enderBondLiquidityDeposit testing for mainnet:- multiple deposit", async () => {
        const maturity = 90;
        const bondFee = 500;
        const depositPrincipalStEth = expandTo18Decimals(1);

        await enderBondLiquidityDeposit.setDepositEnable(true);

        await stEth.connect(signer1).submit({ value: ethers.parseEther("1.0") });
        await stEth
            .connect(signer1)
            .approve(enderBondLiquidityDepositAddress, depositPrincipalStEth);

        await enderBondLiquidityDeposit
            .connect(signer1)
            .deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, [
                signer1.address,
                "0",
                signature,
            ]);

        await stEth.connect(signer2).submit({ value: ethers.parseEther("1.0") });
        await stEth
            .connect(signer2)
            .approve(enderBondLiquidityDepositAddress, 1500000000000000000n);

        await enderBondLiquidityDeposit
            .connect(signer2)
            .deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, [
                signer2.address,
                "0",
                signature2,
            ]);
    });

    it("testing the stEth", async () => {
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
    });

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

    async function signatureDigest2() {
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
});

// npx hardhat coverage --testfiles test/unit/EnderBondLiquidityDeposit.test.js
