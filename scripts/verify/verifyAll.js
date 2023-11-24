const EndToken =  "0xBCCf1Ef2768bF669B6a20b9ec34575A35ad35139"
const EnderBond =   ""
const SEndToken =""
const BondNFT =   ""
const EnderTreasury =   ""
const EnderStaking =   ""
const EnderELStrategy =   ""
const EnderLidoStrategy =   ""
const EnderOracle = ""

async function main() {
    try {
        await hre.run("verify:verify", {
            address: EndToken,
            contract: "contracts/ERC20/EndToken.sol:EndToken",
        });
        await hre.run("verify:verify", {
            address: SEndToken,
            contract: "contracts/ERC20/SEndToken.sol:SEndToken",
        });

        await hre.run("verify:verify", {
            address: EnderBond,
            contract: "contracts/EnderBond.sol:EnderBond",
        });

        await hre.run("verify:verify", {
            address: BondNFT,
            contract: "contracts/NFT/BondNFT.sol:BondNFT",
        });;

        await hre.run("verify:verify", {
            address: EnderTreasury,
            contract: "contracts/EnderTreasury.sol:EnderTreasury",
        });

        await hre.run("verify:verify", {
            address: EnderStaking,
            contract: "contracts/EnderStaking.sol:EnderStaking",
        });

  

        await hre.run("verify:verify", {
            address: EnderOracle,
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