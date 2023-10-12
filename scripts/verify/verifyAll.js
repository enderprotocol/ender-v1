const EndToken = require(`../../deployments/goerli/EndToken.json`);
const EnderBond = require(`../../deployments/goerli/EnderBond.json`);
const BondNFT = require(`../../deployments/goerli/BondNFT.json`);
const EnderTreasury = require(`../../deployments/goerli/EnderTreasury.json`);
const EnderStaking = require(`../../deployments/goerli/EnderStaking.json`);
const EnderELStrategy = require(`../../deployments/goerli/EnderELStrategy.json`);
const EnderLidoStrategy = require(`../../deployments/goerli/EnderLidoStrategy.json`);
const EnderOracle = require(`../../deployments/goerli/EnderOracle.json`);

async function main() {
    try {
        await hre.run("verify:verify", {
            address: EndToken[hre.network.name].impls,
            contract: "contracts/ERC20/EndToken.sol:EndToken",
        });

        await hre.run("verify:verify", {
            address: EnderBond[hre.network.name].impls,
            contract: "contracts/EnderBond.sol:EnderBond",
        });

        await hre.run("verify:verify", {
            address: BondNFT[hre.network.name].impls,
            contract: "contracts/NFT/BondNFT.sol:BondNFT",
        });;

        await hre.run("verify:verify", {
            address: EnderTreasury[hre.network.name].impls,
            contract: "contracts/EnderTreasury.sol:EnderTreasury",
        });

        await hre.run("verify:verify", {
            address: EnderStaking[hre.network.name].impls,
            contract: "contracts/EnderStaking.sol:EnderStaking",
        });

        await hre.run("verify:verify", {
            address: EnderELStrategy[hre.network.name].impls,
            contract: "contracts/strategy/eigenlayer/EnderELStrategy.sol:EnderELStrategy",
        });

        await hre.run("verify:verify", {
            address: EnderLidoStrategy[hre.network.name].impls,
            contract: "contracts/strategy/lido/EnderLidoStrategy.sol:EnderLidoStrategy",
        });

        await hre.run("verify:verify", {
            address: EnderOracle[hre.network.name].impls,
            contract: "contracts/oracle/EnderOracle.sol:EnderOracle",
        });
    } catch (err) {
        console.log(err);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});