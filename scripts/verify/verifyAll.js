const EndToken =  ""
const EnderBond =   ""
const BondNFT =   ""
const EnderTreasury =   ""
const EnderStaking =   ""
const EnderELStrategy =   ""
const EnderLidoStrategy =   ""
const EnderOracle = ""

async function main() {
    try {
        await hre.run("verify:verify", {
            address: EndToken[hre.network.name].impls,
            contract: "contracts/ERC20/EndToken.sol:EndToken",
        });
        await hre.run("verify:verify", {
            address: EndToken[hre.network.name].impls,
            contract: "contracts/ERC20/SEndToken.sol:SEndToken",
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
            address: EnderOracle[hre.network.name].impls,
            contract: "contracts/oracle/EnderOracle.sol:EnderOracle",
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