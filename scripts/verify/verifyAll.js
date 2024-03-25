const EndToken = "0x74B15125d62AF2B43557D0Bc3B2D8371a2dCf908"; //
const EnderBond = "0x4b973e761467a87325844928bb6841A9cb823845"; //
const SEndToken = "0x5eaD695825d875dC80a97366b3a50427DD02E868"; //
const BondNFT = "0xB2dfEC4cff552fC28fb848a25B69314D8504B20f"; //
const EnderTreasury = "0xa3c0A6Bf245e77fa3d317a258F0B3bD1f922DA16"; //
const EnderStaking = "0x852B7a97574fe805E931c51ed3791784fE68e796"; //
const Weth = "0x94D818e0B85F7b1D3D38871C0D58758A23FF9CcB";
const MockStEth = "0x472ac49b4824C488FcEf79ea30D145945B98082e"; //
const EnderLidoStrategy = "0x9F306B7119F24e78A286265905E80af7a318f3AD";
const EnderOracle = "0x4CE5090196f000C6C486af65af8b55A98bBC728a";
const depositContract = "0xCcb2374039fB1937A65a2233a130391A1643EbE5";
const InstaDapp = "0x39bFa8Ee618B6a98034894BB4a56605a580FE898"; //
const EndETH = "0x99Ed0314da82Fd1c702e9b3fDf0CDEcA15550509";

async function main() {
    try {
        // await hre.run("verify:verify", {
        // address: Weth,
        // constructorArguments: ["wrappedEth", "weth", "0xEe7CA89760a3425Bc06d8aFA201e80C22E5B94E9"],
        // contract: "contracts/ERC20/StEth.sol:mockWETH",
        // });
        // await hre.run("verify:verify", {
        //     address: MockStEth,
        //     constructorArguments: [],
        //     contract: "contracts/ERC20/mockStEth.sol:StETH",
        // });

        // await hre.run("verify:verify", {
        //     address: "0xF660cF784bA21C041E355C589790D7DBc02f7bD8",
        //     contract: "contracts/EnderBondLiquidityDeposit.sol:EnderBondLiquidityDeposit",
        // });

        // await hre.run("verify:verify", {
        //     address: "0xbff25a70f8e5ffb263d9eac806f4206d180a7f8f",
        //     contract: "contracts/OwnedUpgradeabilityProxy.sol:EnderProxy",
        // });

        // await hre.run("verify:verify", {
        //     address: "0x910bB421BB7B01818085DC57EBF5a38071110043",
        //     contract: "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol:TransparentUpgradeableProxy",
        // });
        // await hre.run("verify:verify", {
        //     address: InstaDapp,
        //     constructorArguments: ["InstaToken", "Inst", "0xEe7CA89760a3425Bc06d8aFA201e80C22E5B94E9", "0x3C3a738EdA4bB5E2003e128f174CF0d0A7653a2D"],
        //     contract: "contracts/strategy/instadapp/instadappLite.sol:StinstaToken",
        // });
        await hre.run("verify:verify", {
            address: EndETH,
            contract: "contracts/ERC20/EnderStakeEth.sol:EnderStakeEth",
        });
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
        // });

        // await hre.run("verify:verify", {
        //     address: EnderTreasury,
        //     contract: "contracts/EnderTreasury.sol:EnderTreasury",
        // });

        // await hre.run("verify:verify", {
        //     address: EnderStaking,
        //     contract: "contracts/EnderStaking.sol:EnderStaking",
        // });
        // await hre.run("verify:verify", {
        //     address: EnderOracle,
        //     contract: "contracts/oracle/EnderOracle.sol:EnderOracle",
        // });
    } catch (err) {
        console.log(err);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
