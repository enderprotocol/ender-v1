const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { BigNumber } = require("ethers");

const { EigenLayerStrategyManagerAddress } = require("../utils/common");
// const { describe } = require("node:test");
const signature = "0xA2fFDf332d92715e88a958A705948ADF75d07d01";
const baseURI = "https://endworld-backend-git-dev-metagaming.vercel.app/nft/metadata/";
const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
const ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";

function expandTo18Decimals(n) {
    return BigNumber.from(n).mul(BigNumber.from(10).pow(18));
}
function convert(number) {
    return ethers.BigNumber.from(number).toNumber();
}

describe("EnderBond", function () {
    let owner, wallet1, signer1, signer2, signer3;
    let endTokenAddress,
        enderBondAddress,
        enderTreasuryAddress,
        enderStakingAddress,
        instadappLiteAddress,
        enderOracleAddress;

    let endToken,
        enderBond,
        enderTreasury,
        enderELStrategy,
        enderStaking,
        sEnd,
        sEndTokenAddress,
        instadappLitelidoStaking,
        stEth,
        bondNFT,
        enderOracle;

    before(async function () {
        const StEth = await ethers.getContractFactory("StEth");
        const InstadappLite = await ethers.getContractFactory("instadappLite");
        const EndToken = await ethers.getContractFactory("EndToken");
        const EnderBond = await ethers.getContractFactory("EnderBond");
        const EnderTreasury = await ethers.getContractFactory("EnderTreasury");
        const EnderStaking = await ethers.getContractFactory("EnderStaking");
        const SEnd = await ethers.getContractFactory("SEndToken");
        const EnderOracle = await ethers.getContractFactory("EnderOracle");

        enderOracle = await upgrades.deployProxy(EnderOracle, [], {
            initializer: "initialize",
        });
        enderOracleAddress = await enderOracle.getAddress();

        stEth = await StEth.deploy();
        stEthAddress = await stEth.getAddress();

        sEnd = await SEnd.deploy();
        sEndTokenAddress = await sEnd.getAddress();

        instadappLite = await InstadappLite.deploy(stEthAddress);
        instadappLiteAddress = await instadappLite.getAddress();

        endToken = await upgrades.deployProxy(EndToken, [], {
            initializer: "initialize",
        });
        await endToken.waitForDeployment();
        endTokenAddress = await endToken.getAddress();

        enderBond = await upgrades.deployProxy(EnderBond, [endTokenAddress, instadappLiteAddress], {
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
                instadappLiteAddress,
                ethers.ZeroAddress,
                ethers.ZeroAddress,
                30,
                70,
                enderOracleAddress,
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
            expect(await enderStaking.owner()).to.equal(owner.address);
            expect(await enderStaking.endToken()).to.equal(endTokenAddress);
        });
        it("Should set bond and treasurry addresses", async function () {
            await enderStaking.setAddress(enderBondAddress, 1);
            await enderStaking.setAddress(enderTreasuryAddress, 2);
            expect(await enderStaking.sEndToken()).to.equal(sEndTokenAddress);
            expect(await enderStaking.enderBond()).to.equal(enderBondAddress);
        });
        it("Should stake end tokens", async function () {
            let stakeAmount = "100000000";
            await endToken.approve(enderStakingAddress, stakeAmount);
            await enderStaking.stake(stakeAmount);
            const timeStamp = await ethers.provider.getBlock("latest");
            let userInfo = await enderStaking.userInfo(await owner.getAddress());
            expect(userInfo[0]).to.equal(stakeAmount);
            expect(userInfo[1]).to.equal(timeStamp.timestamp);
            expect(await sEnd.balanceOf(await owner.getAddress())).to.be.equal(stakeAmount);
        });

        // it("Should re-stake end tokens", async function () {
        //     let stakeAmount = "100000000";
        //     await endToken.approve(enderStakingAddress, stakeAmount);
        //     await enderStaking.stake(stakeAmount);
        //     const timeStamp = await ethers.provider.getBlock("latest");
        //     let userInfo = await enderStaking.userInfo(await owner.getAddress());
        //     expect(userInfo[0]).to.equal("300000000");
        //     expect(await enderStaking.calculateRebaseIndex()).to.equal(1);
        //     expect(userInfo[1]).to.equal(timeStamp.timestamp);
        //     expect(await sEnd.balanceOf(await owner.getAddress())).to.be.equal(stakeAmount * 3);

        // });
        it("Should withdraw end tokens", async function () {
            let withdrawpSendAmount = "100000000";
            await sEnd.approve(enderStakingAddress, withdrawpSendAmount);
            await enderStaking.withdraw(withdrawpSendAmount);
            let endBalOwner = await endToken.balanceOf(await owner.getAddress());
            expect(endBalOwner).to.be.equal("10000000000000");
            let userInfo = await enderStaking.userInfo(await owner.getAddress());
            expect(userInfo[0]).to.equal(0);
            expect(userInfo[1]).to.equal(0);
            expect(await sEnd.balanceOf(await owner.getAddress())).to.be.equal(0);
        });
    });
});