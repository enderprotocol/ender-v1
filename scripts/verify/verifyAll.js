const EndToken =  "0x4d67b57b73DfAD4C27dEE8bCee4392d381FAB956"//
const EnderBond =   "0x6995c8a643bf95739708e318ffd32c557edbe168" //
const SEndToken ="0xf40eb2ada82d7be2621152f4aaa5d6838b8b7a50"
const BondNFT =   "0x383e31361c03a84afc7d22e5e5381eea04946f8d"
const EnderTreasury =   "0xdf9f3f68d5a70d1692e3a5c8ea93c3446a46fa15"  
const EnderStaking =   "0x38504A7A5b48f6493065BEa5C5fCe3d4b3DADD7e" 
const Weth =   "0x94D818e0B85F7b1D3D38871C0D58758A23FF9CcB"
const MockStEth = "0x2cDc4e31844b27283D700685ef504E3b91fEA00F" 
const EnderLidoStrategy =   "0x9F306B7119F24e78A286265905E80af7a318f3AD"
const EnderOracle = "0x4CE5090196f000C6C486af65af8b55A98bBC728a"
const depositContract = "0xCcb2374039fB1937A65a2233a130391A1643EbE5"
const InstaDapp = "0x896799A36F227090b0774aBFb9e5E171575A22bF" 
 
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
        //     constructorArguments: ["InstaToken", "Inst", "0xEe7CA89760a3425Bc06d8aFA201e80C22E5B94E9", "0xd8BEf5b8e0a54C279Ac03258941a214bA68Ed5a1"],
        //     contract: "contracts/strategy/instadapp/instadappLite.sol:StinstaToken",
        // });
        await hre.run("verify:verify", {
            address: EndToken,
            contract: "contracts/ERC20/EndToken.sol:EndToken",
        });
        // await hre.run("verify:verify", {
        //     address: "0xDec056C27ad12d3Eb405230086d3c9eDf157bC1A",
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