const EndToken =  "0x23d23995b67ab79f962bad8eda7a32f8ff7162f1"
const EnderBond =   "0x18f50e97316f694bd374d1c1afc79450ff23bffa"
const SEndToken ="0xed9c9155979e4ac58345ce1dac282063e5c7a29a"
const BondNFT =   "0x37e8b5d154299fe0adc0ea23b2e5b80ece428303"
const EnderTreasury =   "0x9499c330f5ed02fb459c41fc2bb3d13420609b47"
const EnderStaking =   "0x81bd03f3f5a324ee6a4459a8858970d5875dc015"
const Weth =   "0x97F5d01557C49Fd4492508d662b91FeDe6d84bF7"
const MockStEth = "0x4f1c8dF809CB90200534AC314503A74D9a60CC04"
const EnderLidoStrategy =   "0x9E7c311CfdB5b38f871fD6FCcb1ccD66892C7570"
const EnderOracle = "0xc2985d66eb5eea1f3f50a397e9adb378571979e5"

async function main() {
    try {
        // await hre.run("verify:verify", {
        // address: Weth,
        // constructorArguments: ["wrappedEth", "weth", "0xEe7CA89760a3425Bc06d8aFA201e80C22E5B94E9"],
        // contract: "contracts/ERC20/StEth.sol:mockWETH",
        // });  
        // await hre.run("verify:verify", {
        //     address: MockStEth,
        //     constructorArguments: [Weth, "0xEe7CA89760a3425Bc06d8aFA201e80C22E5B94E9"],
        //     contract: "contracts/ERC20/StEth.sol:MockStEth",
        // });
        // await hre.run("verify:verify", {
        //     address: EnderLidoStrategy,
        //     constructorArguments: ["InstaToken", "Inst", "0xEe7CA89760a3425Bc06d8aFA201e80C22E5B94E9", MockStEth],
        //     contract: "contracts/strategy/instadapp/instadappLite.sol:StinstaToken",
        // });
        // await hre.run("verify:verify", {
        //     address: EndToken,
        //     contract: "contracts/ERC20/EndToken.sol:EndToken",
        // });
        // await hre.run("verify:verify", {
        //     address: SEndToken,
        //     contract: "contracts/ERC20/SEndToken.sol:SEndToken",
        // });

        // await hre.run("verify:verify", {
        //     address: EnderBond,
        //     contract: "contracts/EnderBond.sol:EnderBond",
        // });

        // await hre.run("verify:verify", {
        //     address: BondNFT,
        //     contract: "contracts/NFT/BondNFT.sol:BondNFT",
        // });;

        // await hre.run("verify:verify", {
        //     address: EnderTreasury,
        //     contract: "contracts/EnderTreasury.sol:EnderTreasury",
        // });

        // await hre.run("verify:verify", {
        //     address: EnderStaking,
        //     contract: "contracts/EnderStaking.sol:EnderStaking",
        // });
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