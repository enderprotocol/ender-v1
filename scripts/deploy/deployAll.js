const { ethers, upgrades } = require("hardhat");
const path = require('path');
const fs = require('fs');

const dirPath = path.join(__dirname, '../../deployments');
fs.mkdirSync(dirPath, { recursive: true });

const EigenLayerStrategyManagerAddress = "0x858646372CC42E1A627fcE94aa7A7033e7CF075A";
const LidoAgentAddress = "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c";
// const baseURI = "https://lazy-tick-galoshes.cyclic.app/metadata/";
const baseURI = "https://endworld-backend.vercel.app/nft/metadata/";
const signature = "0xA2fFDf332d92715e88a958A705948ADF75d07d01";

async function main() {
    // Deploy EndToken
    const EndToken = await ethers.getContractFactory("EndToken");
    console.log("Deploying EndToken...");
    const endTokenInstance = await upgrades.deployProxy(EndToken, [100], {
        initializer: "initialize",
    });
    await endTokenInstance.waitForDeployment();
    const endTokenAddress = await endTokenInstance.getAddress();
    console.log("EndToken deployed to:", endTokenAddress);

    const endTokenImplAddress = await upgrades.erc1967.getImplementationAddress(endTokenAddress);
    fs.writeFileSync(path.join(dirPath, 'EndToken.json'), JSON.stringify({
        goerli: {
            proxy: endTokenAddress,
            impls: endTokenImplAddress
        }
    }, null, 2));

    // Deploy EnderBond
    const EnderBond = await ethers.getContractFactory("EnderBond");
    console.log("Deploying EnderBond...");
    const enderBondInstance = await upgrades.deployProxy(EnderBond, [endTokenAddress, signature], {
        initializer: "initialize",
    });
    await enderBondInstance.waitForDeployment();
    const enderBondAddress = await enderBondInstance.getAddress();
    console.log("EnderBond deployed to:", enderBondAddress);

    const enderBondImplAddress = await upgrades.erc1967.getImplementationAddress(enderBondAddress);
    fs.writeFileSync(path.join(dirPath, 'EnderBond.json'), JSON.stringify({
        goerli: {
            proxy: enderBondAddress,
            impls: enderBondImplAddress
        }
    }, null, 2));

    // Deploy BondNFT
    const BondNFT = await ethers.getContractFactory("BondNFT");
    console.log("Deploying BondNFT...");
    const bondNFTInstance = await upgrades.deployProxy(BondNFT, [enderBondAddress, baseURI], {
        initializer: "initialize",
    });
    await bondNFTInstance.waitForDeployment();
    const bondNFTAddress = await bondNFTInstance.getAddress();
    console.log("BondNFT deployed to:", bondNFTAddress);

    const bondNFTImplAddress = await upgrades.erc1967.getImplementationAddress(bondNFTAddress);
    fs.writeFileSync(path.join(dirPath, 'BondNFT.json'), JSON.stringify({
        goerli: {
            proxy: bondNFTAddress,
            impls: bondNFTImplAddress
        }
    }, null, 2));

    // Deploy EnderTreasury
    const EnderTreasury = await ethers.getContractFactory("EnderTreasury");
    console.log("Deploying EnderTreasury...");
    const enderTreasuryInstance = await upgrades.deployProxy(EnderTreasury, [endTokenAddress, enderBondAddress], {
        initializer: "initialize",
    });
    await enderTreasuryInstance.waitForDeployment();
    const enderTreasuryAddress = await enderTreasuryInstance.getAddress();
    console.log("EnderTreasury deployed to:", enderTreasuryAddress);

    const enderTreasuryImplAddress = await upgrades.erc1967.getImplementationAddress(enderTreasuryAddress);
    fs.writeFileSync(path.join(dirPath, 'EnderTreasury.json'), JSON.stringify({
        goerli: {
            proxy: enderTreasuryAddress,
            impls: enderTreasuryImplAddress
        }
    }, null, 2));

    // Deploy EnderStaking
    const EnderStaking = await ethers.getContractFactory("EnderStaking");
    console.log("Deploying EnderStaking...");
    const enderStakingInstance = await upgrades.deployProxy(EnderStaking, [endTokenAddress], {
        initializer: "initialize",
    });
    await enderStakingInstance.waitForDeployment();
    const enderStakingAddress = await enderStakingInstance.getAddress();
    console.log("EnderStaking deployed to:", enderStakingAddress);

    const enderStakingImplAddress = await upgrades.erc1967.getImplementationAddress(enderStakingAddress);
    fs.writeFileSync(path.join(dirPath, 'EnderStaking.json'), JSON.stringify({
        goerli: {
            proxy: enderStakingAddress,
            impls: enderStakingImplAddress
        }
    }, null, 2));

    // Deploy EnderELStrategy
    const EnderELStrategy = await ethers.getContractFactory("EnderELStrategy");
    console.log("Deploying EnderELStrategy...");
    const enderELStrategyInstance = await upgrades.deployProxy(EnderELStrategy, [enderTreasuryAddress, EigenLayerStrategyManagerAddress], {
        initializer: "initialize",
    });
    await enderELStrategyInstance.waitForDeployment();
    const enderELStrategyAddress = await enderELStrategyInstance.getAddress();
    console.log("EnderELStrategy deployed to:", enderELStrategyAddress);

    const enderELStrategyImplAddress = await upgrades.erc1967.getImplementationAddress(enderELStrategyAddress);
    fs.writeFileSync(path.join(dirPath, 'EnderELStrategy.json'), JSON.stringify({
        goerli: {
            proxy: enderELStrategyAddress,
            impls: enderELStrategyImplAddress
        }
    }, null, 2));

    // Deploy EnderLidoStrategy
    const EnderLidoStrategy = await ethers.getContractFactory("EnderLidoStrategy");
    console.log("Deploying EnderLidoStrategy...");
    const enderLidoStrategyInstance = await upgrades.deployProxy(EnderLidoStrategy, [enderTreasuryAddress, LidoAgentAddress], {
        initializer: "initialize",
    });
    await enderLidoStrategyInstance.waitForDeployment();
    const enderLidoStrategyAddress = await enderLidoStrategyInstance.getAddress();
    console.log("EnderLidoStrategy deployed to:", enderLidoStrategyAddress);

    const enderLidoStrategyImplAddress = await upgrades.erc1967.getImplementationAddress(enderLidoStrategyAddress);
    fs.writeFileSync(path.join(dirPath, 'EnderLidoStrategy.json'), JSON.stringify({
        goerli: {
            proxy: enderLidoStrategyAddress,
            impls: enderLidoStrategyImplAddress
        }
    }, null, 2));

    // Deploy EnderOracle
    const EnderOracle = await ethers.getContractFactory("EnderOracle");
    console.log("Deploying EnderOracle...");
    const enderOracleInstance = await upgrades.deployProxy(EnderOracle, [], {
        initializer: "initialize",
    });
    await enderOracleInstance.waitForDeployment();
    const enderOracleAddress = await enderOracleInstance.getAddress();
    console.log("EnderLidoStrategy deployed to:", enderOracleAddress);

    const enderOracleImplAddress = await upgrades.erc1967.getImplementationAddress(enderOracleAddress);
    fs.writeFileSync(path.join(dirPath, 'EnderOracle.json'), JSON.stringify({
        goerli: {
        proxy: enderOracleAddress,
        impls: enderOracleImplAddress
        }
    }, null, 2));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});