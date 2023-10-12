const { ethers, upgrades } = require("hardhat");
const path = require('path');
const fs = require('fs');

const dirPath = path.join(__dirname, '../../deployments/goerli');
fs.mkdirSync(dirPath, { recursive: true });

const LidoAgentAddress = "0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F";
const lidoWithdrawQueue = "0xCF117961421cA9e546cD7f50bC73abCdB3039533"
const elStrategyManager = "0x779d1b5315df083e3F9E94cB495983500bA8E907"
const elstETHStrategy = "0xB613E78E2068d7489bb66419fB1cfa11275d14da"
const stETHTokenAddr = "0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F"
const goerliETHFeed = "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
const enderSinature = "0xA2fFDf332d92715e88a958A705948ADF75d07d01"
const baseURI = "https://endworld-backend.vercel.app/nft/metadata/";

async function main() {
  // Deploy EndToken
  const EndToken = await ethers.getContractFactory("EndToken");
  console.log("Deploying EndToken...");
  const endTokenInstance = await upgrades.deployProxy(EndToken, [1], {
    initializer: "initialize",
  });
  await endTokenInstance.waitForDeployment();
  const endTokenAddress = await endTokenInstance.getAddress();

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
  const enderBondInstance = await upgrades.deployProxy(EnderBond, [endTokenAddress, enderSinature], {
    initializer: "initialize",
  });
  await enderBondInstance.waitForDeployment();
  const enderBondAddress = await enderBondInstance.getAddress();

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

  const bondNFTImplAddress = await upgrades.erc1967.getImplementationAddress(bondNFTAddress);
  fs.writeFileSync(path.join(dirPath, 'BondNFT.json'), JSON.stringify({
    goerli: {
      proxy: bondNFTAddress,
      impls: bondNFTImplAddress
    }
  }, null, 2));

  // send bond nft in bond contract
  await enderBondInstance.setAddress(bondNFTAddress, 2);

  // Deploy EnderTreasury
  const EnderTreasury = await ethers.getContractFactory("EnderTreasury");
  console.log("Deploying EnderTreasury...");
  const enderTreasuryInstance = await upgrades.deployProxy(EnderTreasury, [endTokenAddress, enderBondAddress], {
    initializer: "initialize",
  });
  await enderTreasuryInstance.waitForDeployment();
  const enderTreasuryAddress = await enderTreasuryInstance.getAddress();

  const enderTreasuryImplAddress = await upgrades.erc1967.getImplementationAddress(enderTreasuryAddress);
  fs.writeFileSync(path.join(dirPath, 'EnderTreasury.json'), JSON.stringify({
    goerli: {
      proxy: enderTreasuryAddress,
      impls: enderTreasuryImplAddress
    }
  }, null, 2));

  // set treasury in bond contract
  await enderBondInstance.setAddress(enderTreasuryAddress, 0);

  // set bondable default tokens
  await enderBondInstance.setBondableTokens([ethers.ZeroAddress, stETHTokenAddr], true)

  // set treasury in END token contract
  await endTokenInstance.setTreasury(enderTreasuryAddress)

  // get minter role
  const minterRole = await endTokenInstance.MINTER_ROLE()

  // grant minter role to treasury contract
  await endTokenInstance.grantRole(minterRole, enderTreasuryAddress);

  // Deploy EnderStaking
  const EnderStaking = await ethers.getContractFactory("EnderStaking");
  console.log("Deploying EnderStaking...");
  const enderStakingInstance = await upgrades.deployProxy(EnderStaking, [endTokenAddress], {
    initializer: "initialize",
  });
  await enderStakingInstance.waitForDeployment();
  const enderStakingAddress = await enderStakingInstance.getAddress();

  const enderStakingImplAddress = await upgrades.erc1967.getImplementationAddress(enderStakingAddress);
  fs.writeFileSync(path.join(dirPath, 'EnderStaking.json'), JSON.stringify({
    goerli: {
      proxy: enderStakingAddress,
      impls: enderStakingImplAddress
    }
  }, null, 2));

  // set percent rate - 0.0038% per block
  await enderStakingInstance.setReward(380)

  // grant minter role to staking contract
  await endTokenInstance.grantRole(minterRole, enderStakingAddress);

  // Deploy EnderLidoStrategy
  const EnderLidoStrategy = await ethers.getContractFactory("EnderLidoStrategy");
  console.log("Deploying EnderLidoStrategy...");
  const enderLidoStrategyInstance = await upgrades.deployProxy(EnderLidoStrategy, [enderTreasuryAddress, LidoAgentAddress], {
    initializer: "initialize",
  });
  await enderLidoStrategyInstance.waitForDeployment();
  const enderLidoStrategyAddress = await enderLidoStrategyInstance.getAddress();

  const enderLidoStrategyImplAddress = await upgrades.erc1967.getImplementationAddress(enderLidoStrategyAddress);
  fs.writeFileSync(path.join(dirPath, 'EnderLidoStrategy.json'), JSON.stringify({
    goerli: {
      proxy: enderLidoStrategyAddress,
      impls: enderLidoStrategyImplAddress
    }
  }, null, 2));

  // set withdraw nft in lido strategy
  await enderLidoStrategyInstance.setWithdrawStr(lidoWithdrawQueue);

  // Deploy EnderEigenLayer strategy contract
  const EnderELStrategy = await ethers.getContractFactory("EnderELStrategy");
  console.log("Deploying EnderELStrategy...");
  const enderELStrategyInstance = await upgrades.deployProxy(EnderELStrategy, [enderTreasuryAddress, elStrategyManager], {
    initializer: "initialize",
  });
  await enderELStrategyInstance.waitForDeployment();
  const enderELStrategyAddress = await enderELStrategyInstance.getAddress();

  const enderELStrategyImplAddress = await upgrades.erc1967.getImplementationAddress(enderELStrategyAddress);
  fs.writeFileSync(path.join(dirPath, 'EnderELStrategy.json'), JSON.stringify({
    goerli: {
      proxy: enderELStrategyAddress,
      impls: enderELStrategyImplAddress
    }
  }, null, 2));

  // set strategy strategy
  await enderELStrategyInstance.setTokenStrategy(elstETHStrategy);

  // add el strategy in treasury
  await enderTreasuryInstance.setStrategy([enderLidoStrategyAddress, enderELStrategyAddress], true);

  // Deploy oracle contract
  const EnderOracle = await ethers.getContractFactory("EnderOracle");
  console.log("Deploying EnderOracle...");
  const enderOracleInstance = await upgrades.deployProxy(EnderOracle, [], {
    initializer: "initialize",
  });
  await enderOracleInstance.waitForDeployment();
  const enderOracleAddress = await enderOracleInstance.getAddress();

  const enderOracleImplAddress = await upgrades.erc1967.getImplementationAddress(enderOracleAddress);
  fs.writeFileSync(path.join(dirPath, 'EnderOracle.json'), JSON.stringify({
    goerli: {
      proxy: enderOracleAddress,
      impls: enderOracleImplAddress
    }
  }, null, 2));

  // set oracle in treasury
  await enderTreasuryInstance.setAddress(enderOracleAddress, 2);

  // set ETH price feed
  await enderOracleInstance.setFeeds([ethers.ZeroAddress, stETHTokenAddr], [goerliETHFeed, goerliETHFeed])

  // console all addresses
  console.log("EndToken deployed to:", endTokenAddress);
  console.log("EnderBond deployed to:", enderBondAddress);
  console.log("BondNFT deployed to:", bondNFTAddress);
  console.log("EnderTreasury deployed to:", enderTreasuryAddress);
  console.log("EnderStaking deployed to:", enderStakingAddress);
  console.log("EnderOracle deployed to:", enderOracleAddress);
  console.log("EnderLidoStrategy deployed to:", enderLidoStrategyAddress);
  console.log("EnderEigenlayerStrategy deployed to:", enderELStrategyAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
