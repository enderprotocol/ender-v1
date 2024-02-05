const EndToken =  "0xC360b6BE3Fa856e8CC7caA02e33A0C8bF8874eB7"
const EnderBond =   "0xB798B45909F9F2876723424959441cEFdeD87cf5"
const SEndToken ="0x69C4D0FCB3204028A394d18A6afB8823799aFea2"
const BondNFT =   "0xa760f4caf70b14c3d3fa03317b6a93ac973486d1"
const EnderTreasury =   "0x67560B51aaE7D733318548FcaaAFB48D4e2d52F2"
const EnderStaking =   "0xC0caf486959BFf758bD1Aad92Be35CBc3F191a38"
const Weth =   "0x94D818e0B85F7b1D3D38871C0D58758A23FF9CcB"
const MockStEth = "0xaE46bd402a3bd35B7A3Fb931E66833a560b32d21"
const EnderLidoStrategy =   "0x9F306B7119F24e78A286265905E80af7a318f3AD"
const EnderOracle = "0x4CE5090196f000C6C486af65af8b55A98bBC728a"
const depositContract = "0xCcb2374039fB1937A65a2233a130391A1643EbE5"
const InstaDapp = "0x3Dd8Baaa49Df4fA5EA771EDF2DB175bbFc73fa67"
 
async function main() {
    try {
        // await hre.run("verify:verify", {
        // address: Weth,
        // constructorArguments: ["wrappedEth", "weth", "0xEe7CA89760a3425Bc06d8aFA201e80C22E5B94E9"],
        // contract: "contracts/ERC20/StEth.sol:mockWETH",
        // });  
        await hre.run("verify:verify", {
            address: "0x6BE65FA5114826a40fCa65ebe8d9930De4de405c",
            constructorArguments: [],
            contract: "contracts/ERC20/mockStEth.sol:StETH",
        });

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
        await hre.run("verify:verify", {
            address: InstaDapp,
            constructorArguments: ["InstaToken", "Inst", "0xEe7CA89760a3425Bc06d8aFA201e80C22E5B94E9", MockStEth],
            contract: "contracts/strategy/instadapp/instadappLite.sol:StinstaToken",
        });
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

        // await hre.run("verify:verify", {
        //     address: BondNFT,
        //     contract: "contracts/NFT/BondNFT.sol:BondNFT",
        // });;

        await hre.run("verify:verify", {
            address: EnderTreasury,
            contract: "contracts/EnderTreasury.sol:EnderTreasury",
        });

        await hre.run("verify:verify", {
            address: EnderStaking,
            contract: "contracts/EnderStaking.sol:EnderStaking",
        });
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