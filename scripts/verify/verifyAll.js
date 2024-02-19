const EndToken =  "0x77c9b9930aa3d6957f18c41381f5969dc6f05120"
const EnderBond =   "0x2f9f32769b18118e65d4e095980d63274d3bdf3b"
const SEndToken ="0xf40eb2ada82d7be2621152f4aaa5d6838b8b7a50"
const BondNFT =   "0x7905d57c8cbd5610e01cad28e987c7ec2fae2f20"
const EnderTreasury =   "0x67e495d73cd79026a698a53479503ab0d2c19ffa"
const EnderStaking =   "0xc28e03566ff7193709e62c43e83b91a407370ef5"
const Weth =   "0x94D818e0B85F7b1D3D38871C0D58758A23FF9CcB"
const MockStEth = "0xaE46bd402a3bd35B7A3Fb931E66833a560b32d21"
const EnderLidoStrategy =   "0x9F306B7119F24e78A286265905E80af7a318f3AD"
const EnderOracle = "0x4CE5090196f000C6C486af65af8b55A98bBC728a"
const depositContract = "0xCcb2374039fB1937A65a2233a130391A1643EbE5"
const InstaDapp = "0xC6Aa9df2E12fB4D2bDDde7A6Db5015dD480F1512"
 
async function main() {
    try {
        // await hre.run("verify:verify", {
        // address: Weth,
        // constructorArguments: ["wrappedEth", "weth", "0xEe7CA89760a3425Bc06d8aFA201e80C22E5B94E9"],
        // contract: "contracts/ERC20/StEth.sol:mockWETH",
        // });  
        // await hre.run("verify:verify", {
        //     address: "0x3289c1746C8da8aC27d152af807c36D22b4A657b",
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
        //     constructorArguments: ["InstaToken", "Inst", "0xEe7CA89760a3425Bc06d8aFA201e80C22E5B94E9", MockStEth],
        //     contract: "contracts/strategy/instadapp/instadappLite.sol:StinstaToken",
        // });
        // await hre.run("verify:verify", {
        //     address: "0xf3E198B9FD70B639fBac991F4488ADE994e120e8",
        //     contract: "contracts/ERC20/EndToken.sol:EndToken",
        // });
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