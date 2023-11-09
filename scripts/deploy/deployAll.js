const { ethers, upgrades } = require("hardhat");
const baseURI = "https://endworld-backend.vercel.app/nft/metadata/";

async function main() {
    const StEth = await ethers.getContractFactory("StEth");
    const InstadappLite = await ethers.getContractFactory("instadappLite");
    const EndToken = await ethers.getContractFactory("EndToken");
    const EnderBond = await ethers.getContractFactory("EnderBond");
    const EnderTreasury = await ethers.getContractFactory("EnderTreasury");
    const EnderStaking = await ethers.getContractFactory("EnderStaking");
    const SEnd = await ethers.getContractFactory("SEndToken");
    const EnderOracle = await ethers.getContractFactory("EnderOracle");

    let endTokenAddress,
        enderBondAddress,
        enderTreasuryAddress,
        enderStakingAddress,
        instadappLiteAddress,
        enderOracleAddress;

    let endToken,
        enderBond,
        enderTreasury,
        enderStaking,
        sEnd,
        sEndTokenAddress,
        stEth,
        bondNFT,
        enderOracle;

    enderOracle = await upgrades.deployProxy(EnderOracle, [], {
        initializer: "initialize",
    });
    enderOracleAddress = await enderOracle.getAddress();

    stEth = await StEth.deploy();
    stEthAddress = await stEth.getAddress();

    sEnd = await upgrades.deployProxy(SEnd, [], {
        initializer: "initialize",
    });
    sEndTokenAddress = await sEnd.getAddress();

    instadappLite = await InstadappLite.deploy(stEthAddress);
    instadappLiteAddress = await instadappLite.getAddress();

    endToken = await upgrades.deployProxy(EndToken, [], {
        initializer: "initialize",
    });
    await endToken.waitForDeployment();
    endTokenAddress = await endToken.getAddress();

    enderBond = await upgrades.deployProxy(
        EnderBond,
        [endTokenAddress, instadappLiteAddress, enderOracleAddress],
        {
            initializer: "initialize",
        },
    );

    enderBondAddress = await enderBond.getAddress();

    await endToken.setBond(enderBondAddress);
    await endToken.setFee(1);

    enderStaking = await upgrades.deployProxy(EnderStaking, [endTokenAddress, sEndTokenAddress], {
        initializer: "initialize",
    });
    enderStakingAddress = await enderStaking.getAddress();
    await sEnd.setMinterRole();
    enderTreasury = await upgrades.deployProxy(
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
            enderOracleAddress,
        ],
        {
            initializer: "initializeTreasury",
        },
    );
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
    await endToken.grantRole(MINTER_ROLE, enderStakingAddress);

    console.log({
        enderBondAddress,
        enderTreasuryAddress,
        enderStakingAddress,
        bondNFTAddress,
        endTokenAddress,
        sEndTokenAddress,
        instadappLiteAddress,
        enderOracleAddress,
        stEthAddress
    });
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
