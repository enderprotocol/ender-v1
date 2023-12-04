const EndToken =  "0x856efF458Ad74E61808a706C9BA10b2404A5ec8C"
const EnderBond =   "0xc7f763b2841bA5876d1D6b9d6289c3844A989c6a"
const SEndToken ="0x1e4AFA577491129c19D8C74a276e6A3FF71f9276"
const BondNFT =   "0xBaC27F74a2c3752701b7536c772c4caC3258F913"
const EnderTreasury =   "0x7B567bAb69706E4DaF95CAECDB472E379d5CB15c"
const EnderStaking =   "0xFc0c170413c85b62e6FfcA1ab290bFEaDc3B0918"
const EnderELStrategy =   ""
const EnderLidoStrategy =   ""
const EnderOracle = "0x182CE5f581b9DAf9EBaDD046fc31F0a6a6d701a7"

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