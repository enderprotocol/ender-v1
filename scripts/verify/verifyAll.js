const EndToken =  "0xaDb1dAa108bBB67EAD6D2ce0Dfca766551D21136" //
const EnderBond =   "0x8fc9740707FaC3C327ef8AC60f10613e9Ee35468"// 
const SEndToken ="0x7cC9546b5C8a0b898b8c8A571BAe8B1061A6f7A7" //
const BondNFT =   "0xf15a811a70fDaE327547C5C66da39483c8470E13"//
const EnderTreasury =   "0x68C4c3E919584Db95779e3437d6421B9dEda90fD"//  
const EnderStaking =   "0xe1F63899584D5d09DC483CA9Cce963eCa2D9404b"// 
const Weth =   "0x94D818e0B85F7b1D3D38871C0D58758A23FF9CcB"
const MockStEth = "0x3C3a738EdA4bB5E2003e128f174CF0d0A7653a2D"// 
const EnderLidoStrategy =   "0x9F306B7119F24e78A286265905E80af7a318f3AD"
const EnderOracle = "0x4CE5090196f000C6C486af65af8b55A98bBC728a"
const depositContract = "0xCcb2374039fB1937A65a2233a130391A1643EbE5"
const InstaDapp = "0x4407422216Be505770be35b6e108dD9AbDA80f1B" //
 
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
        // await hre.run("verify:verify", {
        //     address: EndToken,
        //     contract: "contracts/ERC20/EndToken.sol:EndToken",
        // });
        await hre.run("verify:verify", {
            address: SEndToken,
            contract: "contracts/ERC20/SEndToken.sol:SEndToken",
        });

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