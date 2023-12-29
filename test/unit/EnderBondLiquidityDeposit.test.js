const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { BigNumber } = require("ethers");

const { EigenLayerStrategyManagerAddress } = require("../utils/common");
const exp = require("constants");
const { sign } = require("crypto");
const { log } = require("console");
const signature = "0xA2fFDf332d92715e88a958A705948ADF75d07d01";
// const admin = "0x51B560a6cfb409EBDc84232b03feDa7Ad67A16A0";
const baseURI =
  "https://endworld-backend-git-dev-metagaming.vercel.app/nft/metadata/";
const MINTER_ROLE =
  "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
const ADMIN_ROLE =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
function expandTo18Decimals(n) {
    return ethers.parseUnits(n.toString(), 18);
}

describe.only("enderBondLiquidityDeposit testing", function () {
    let admin, owner, signer1, signer2, signer3, signer4;

    let wEthAddress;
    let stEthAddress;
    let enderBondAddress;
    let enderBondLiquidityDepositAddress;

    let endTokenAddress,
    enderTreasuryAddress,
    bondNFTAddress,
    enderStakingAddress;

    let endToken,
    enderTreasury,
    bondNFT,
    enderStaking;
    let WEth;
    let enderBond;
    let StEth;
    let enderBondLiquidityDeposit;

    before(async function () {
        const wETH = await ethers.getContractFactory("mockWETH");
        const stEth = await ethers.getContractFactory("MockStEth");
        const EnderBond = await ethers.getContractFactory("EnderBond");
        const EnderBondLiquidityBond = await ethers.getContractFactory("EnderBondLiquidityDeposit");
        const EnderTreasury = await ethers.getContractFactory("EnderTreasury");
        const EnderStaking = await ethers.getContractFactory("EnderStaking");
        const EndToken = await ethers.getContractFactory("EndToken");

        [admin, owner, wallet1, signer1, signer2, signer3, signer4] = await ethers.getSigners();
        const BondNFT = await ethers.getContractFactory("BondNFT");
        
        endToken = await upgrades.deployProxy(EndToken, [], {
            initializer: "initialize",
        });
        endTokenAddress = await endToken.getAddress();
        
        WETH = await wETH.connect(owner).deploy("wrappedETH", "weth", owner.address);
        mockWETHAddress = await WETH.getAddress();
        
        StEth = await stEth.deploy(mockWETHAddress ,owner.address);
        stEthAddress = await StEth.getAddress();

        enderBondLiquidityDeposit = await upgrades.deployProxy(
            EnderBondLiquidityBond,
            [stEthAddress, stEthAddress],
            {
              initializer: "initialize",
            }
          );

          enderBond = await upgrades.deployProxy(
              EnderBond,
              [endTokenAddress, ethers.ZeroAddress, ethers.ZeroAddress],
              {
                  initializer: "initialize",
                }
                );
                
            enderBondAddress = await enderBond.getAddress();
                
            bondNFT = await upgrades.deployProxy(BondNFT, [enderBondAddress, baseURI], {
                initializer: "initialize",
            });
            await bondNFT.waitForDeployment();
            bondNFTAddress = await bondNFT.getAddress();
          enderBondLiquidityDepositAddress = await enderBondLiquidityDeposit.getAddress();

    });
    it("setting ender deposit contract to live", async () => {
        await enderBondLiquidityDeposit.setDepositEnable(true);
    });

    it("enderBondLiquidityDeposit:- deposit function", async() => {
        const maturity = 90;
        const bondFee = 500;
        const depositPrincipalStEth = expandTo18Decimals(1);
        await WETH.mint(signer1.address, depositPrincipalStEth);
        await WETH.connect(signer1).approve(stEthAddress, depositPrincipalStEth);
        await StEth.connect(signer1).mintShare(depositPrincipalStEth);
        let signature = await signatureDigest();
        await StEth.connect(signer1).approve(enderBondLiquidityDepositAddress, depositPrincipalStEth);
        await enderBondLiquidityDeposit.connect(signer1).deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, [admin.address, 0, signature]);
    });

    it("enderBondLiquidityDeposit:- deposit function also checking reward share index", async() => {
        const maturity = 90;
        const bondFee = 500;
        const depositPrincipalStEth = expandTo18Decimals(1);
        await enderBondLiquidityDeposit.setDepositEnable(true);
        await WETH.mint(signer1.address, depositPrincipalStEth);
        await WETH.connect(signer1).approve(stEthAddress, depositPrincipalStEth);
        await StEth.connect(signer1).mintShare(depositPrincipalStEth);
        let signature = await signatureDigest();
        await StEth.connect(signer1).approve(enderBondLiquidityDepositAddress, depositPrincipalStEth);
        await enderBondLiquidityDeposit.connect(signer1).deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, [admin.address, 0, signature]);
        
        await WETH.mint(signer2.address, depositPrincipalStEth);
        await WETH.connect(signer2).approve(stEthAddress, depositPrincipalStEth);
        await StEth.connect(signer2).mintShare(depositPrincipalStEth);
        await WETH.mint(signer1.address, depositPrincipalStEth);

        await WETH.connect(signer1).transfer(stEthAddress, depositPrincipalStEth);
        let signature1 = await signatureDigest();
        await StEth.connect(signer2).approve(enderBondLiquidityDepositAddress, 1500000000000000000n);
        await enderBondLiquidityDeposit.connect(signer2).deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, [admin.address, 0, signature1]);
    });

    it.only("enderBondLiquidityDeposit:- multiple deposit", async() => {
        const maturity = 90;
        const bondFee = 500;
        const depositPrincipalStEth = expandTo18Decimals(1);
        await enderBondLiquidityDeposit.setDepositEnable(true);
        await WETH.mint(signer1.address, depositPrincipalStEth);
        await WETH.connect(signer1).approve(stEthAddress, depositPrincipalStEth);
        await StEth.connect(signer1).mintShare(depositPrincipalStEth);
        let signature = await signatureDigest();
        await StEth.connect(signer1).approve(enderBondLiquidityDepositAddress, depositPrincipalStEth);
        await enderBondLiquidityDeposit.connect(signer1).deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, [admin.address, 0, signature]);

        await WETH.mint(signer2.address, depositPrincipalStEth);
        await WETH.connect(signer2).approve(stEthAddress, depositPrincipalStEth);
        await StEth.connect(signer2).mintShare(depositPrincipalStEth);

        let signature1 = await signatureDigest();
        await StEth.connect(signer2).approve(enderBondLiquidityDepositAddress, 1500000000000000000n);
        await enderBondLiquidityDeposit.connect(signer2).deposit(depositPrincipalStEth, maturity, bondFee, stEthAddress, [admin.address, 0, signature1]);
        await enderBondLiquidityDeposit.depositedIntoBond(1, enderBondAddress);
        await enderBondLiquidityDeposit.depositedIntoBond(2, enderBondAddress);
    });

    async function signatureDigest() { 
        let sig = await admin.signTypedData(
            {
                name: "depositContract",
                version: "1",
                chainId: 31337,
                verifyingContract: enderBondLiquidityDepositAddress,
            },
            {
                userSign: [
                    {
                        name: 'admin',
                        type: 'address',
                    },
                    {
                        name: 'key',
                        type: 'uint256',
                    },
                ],
            },
            {
                admin: admin.address,
                key: 0,
            }
        )
        return sig;
    };

});
