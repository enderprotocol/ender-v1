const { ethers } = require("hardhat");

const EndToken = require(`../../deployments/goerli/EndToken.json`);
const EnderBond = require(`../../deployments/goerli/EnderBond.json`);
const BondNFT = require(`../../deployments/goerli/BondNFT.json`);
const EnderTreasury = require(`../../deployments/goerli/EnderTreasury.json`);
const EnderStaking = require(`../../deployments/goerli/EnderStaking.json`);
const EnderOracle = require(`../../deployments/goerli/EnderOracle.json`);
const EnderLidoStrategy = require(`../../deployments/goerli/EnderLidoStrategy.json`);

async function main() {
  const endTokenInstance = await ethers.getContractAt("EndToken", EndToken.goerli.proxy)
  const enderBondInstance = await ethers.getContractAt("EnderBond", EnderBond.goerli.proxy)
  const enderTreasuryInstance = await ethers.getContractAt("EnderTreasury", EnderTreasury.goerli.proxy)
  const enderOracleInstance = await ethers.getContractAt("EnderOracle", EnderOracle.goerli.proxy)
  const bondNFTInstance = await ethers.getContractAt("BondNFT", BondNFT.goerli.proxy);
  const enderStakingInstance = await ethers.getContractAt("EnderStaking", "0x5215dfa5ec17192b488053c1c1e76407ac566428")

  // // update base uri
  await bondNFTInstance.setBaseURI("https://beta.metagaming.lol/nft/metadata/") // await bondNFTInstance.setBaseURI("https://endworld-backend-git-dev-metagaming.vercel.app/nft/metadata/")

  // get minter role
  const minterRole = await endTokenInstance.MINTER_ROLE()

  // grant minter role to treasury contract
  // await endTokenInstance.grantRole(minterRole, EnderTreasury.goerli.proxy);
  // await endTokenInstance.grantRole(minterRole, EnderStaking.goerli.proxy);

  await enderStakingInstance.setReward(703)

  console.log('completed config')
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
