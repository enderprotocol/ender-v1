const { ethers, upgrades } = require("hardhat");
const { BigNumber } = require("ethers");

// const { EigenLayerStrategyManagerAddress } = require("../utils/common");
const exp = require("constants");
const { sign } = require("crypto");
const { log } = require("console");
const baseURI = "https://endworld-backend.vercel.app/nft/metadata/";
function sleep(ms)
 {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function main() {

    const weth = await ethers.getContractFactory("mockWETH")
    const StEth = await ethers.getContractFactory("StETH");
    const InstaDapp = await ethers.getContractFactory("StinstaToken");
    const SEndToken = await ethers.getContractFactory("SEndToken");
    const EndToken = await ethers.getContractFactory("EndToken");
    const BondNFT = await ethers.getContractFactory("BondNFT");
    const EnderBond = await ethers.getContractFactory("EnderBond");
    const EnderTreasury = await ethers.getContractFactory("EnderTreasury");
    const EnderStaking = await ethers.getContractFactory("EnderStaking");
    const DepositContract = await ethers.getContractFactory("EnderBondLiquidityDeposit");
    const oracle = await ethers.getContractFactory("EnderOracle");
    const proxy = await ethers.getContractFactory("EnderProxy");
    // let admin, owner, signer1, signer2, signer3, signer4;
    let endTokenAddress,
        wEthAddress,
        stEthAddress,
        depositContractAddress,
        InstaDappAddress,
        enderBondAddress,
        enderTreasuryAddress,
        enderStakingAddress,
        enderOracleAddress;

    let endToken,
        wEth,
        instaDappLite,
        enderBond,
        depositContract,
        sEndTokenAddress,
        enderTreasury,
        enderStaking,
        enderOracle,
        sEnd,
        stEth,
        bondNFT;
    
    //     await sleep(9000);
    // wEth = await weth.deploy("wrappedEth", "weth", "0xEe7CA89760a3425Bc06d8aFA201e80C22E5B94E9");
    // wEthAddress = await wEth.getAddress();
    // console.log("wEthAddress--> ", wEthAddress);
    // await sleep(9000);

    stEth = await StEth.deploy();
    stEthAddress = await stEth.getAddress();
    console.log("stEthAddress-->", stEthAddress)
    await sleep(9000);

    // depositContract = await upgrades.deployProxy(DepositContract, ["0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84", "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84", "0x8feF51D82E188B4cB41dcF6b23DA22284E28c835", "0x6965C9b015AfC8FbF088936614d40877E3f058Ae"], {
    //     initializer: "initialize",
    // });

    // await upgrades.upgradeProxy("0x41f0Cc6865Ae1cA32d096b3bE317ae84C48A99e8",DepositContract);
    // console.log(upgrades.upgradeProxy);

    // console.log("--------------------------------------");
    // depositContractAddress = await depositContract.getAddress();
    // console.log("depositContractAddress-->", depositContractAddress);
    // await sleep(9000);

    // await upgrades.transferOwnership("0x6965C9b015AfC8FbF088936614d40877E3f058Ae");

    // impl = await DepositContract.deploy();
    // Impl = await impl.getAddress();
    // console.log(Impl);
    
    // initializeData = DepositContract.interface.encodeFunctionData('initialize',[stEthAddress, stEthAddress, "0xEe7CA89760a3425Bc06d8aFA201e80C22E5B94E9", "0xEe7CA89760a3425Bc06d8aFA201e80C22E5B94E9"]);
    // Proxy = await proxy.deploy();
    // await sleep(9000);
    // console.log(await Proxy.getAddress());       
    // console.log("Proxy",Proxy);
    // await Proxy.upgradeToAndCall(Impl, initializeData);
    // await sleep(9000);
    // await Proxy.transferProxyOwnership("0x6965C9b015AfC8FbF088936614d40877E3f058Ae");

    instaDappLite = await InstaDapp.deploy("InstaToken", "Inst", "0xEe7CA89760a3425Bc06d8aFA201e80C22E5B94E9", stEthAddress);
    InstaDappAddress = await instaDappLite.getAddress();
    console.log("InstadappAddress-->", InstaDappAddress);
    await sleep(9000);

    sEnd = await upgrades.deployProxy(SEndToken, [], {
        initializer: "initialize",
    });
    await sleep(9000);
    sEndTokenAddress = await sEnd.getAddress();
    console.log("sEndTokenAddress-->", sEndTokenAddress)


    endToken = await upgrades.deployProxy(EndToken, [], {
        initializer: "initialize",
    });
    
    await sleep(10000);

    await endToken.waitForDeployment();
    await sleep(9000);
    endTokenAddress = await endToken.getAddress();
    console.log("endeToken-->", endTokenAddress)

//     enderOracle = await upgrades.deployProxy(oracle, [], {
//         initializer: "initialize",
//     });
//     await sleep(9000);
//     enderOracleAddress = await enderOracle.getAddress();
//     console.log("enderOracleAddress-->", enderOracleAddress);

    enderBond = await upgrades.deployProxy(
        EnderBond,
        [
            endTokenAddress,
            "0x0000000000000000000000000000000000000000",
            "0xEe7CA89760a3425Bc06d8aFA201e80C22E5B94E9"
        ],
        {
            initializer: "initialize",
        },
    );
    await sleep(9000);
   enderBondAddress = await enderBond.getAddress();
   console.log("enderBondAddress-->", enderBondAddress);
   
   bondNFT = await upgrades.deployProxy(BondNFT, [enderBondAddress, baseURI], {
    initializer: "initialize",
});
await sleep(9000);
bondNFTAddress = await bondNFT.getAddress();
console.log("bondNFTAddress-->", bondNFTAddress);

enderStaking = await upgrades.deployProxy(EnderStaking, [endTokenAddress, sEndTokenAddress,stEthAddress ,"0xEe7CA89760a3425Bc06d8aFA201e80C22E5B94E9"], {
initializer: "initialize",
});
await sleep(9000);
enderStakingAddress = await enderStaking.getAddress();
console.log("enderStakingAddress-->", enderStakingAddress);

// const EndTokenProxy = "0x5968b7eCdA2b9D912Caf4645aA046556644661A7";
// await upgrades.upgradeProxy(EndTokenProxy,EndToken);
// console.log("Ender Upgraded");

enderTreasury = await upgrades.deployProxy(
    EnderTreasury,
    [
        endTokenAddress,
        enderStakingAddress,
        enderBondAddress,
        InstaDappAddress,
        "0x0000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000",
        70,
        30
    ],
    {
        initializer: "initializeTreasury",
    },
);
await sleep(9000);
enderTreasuryAddress = await enderTreasury.getAddress();
console.log("enderTreasuryAddress-->", enderTreasuryAddress);

await sleep(9000);
await enderStaking.setAddress(enderBondAddress, 1);

await sleep(9000);
await enderStaking.setAddress(enderTreasury, 2);

await sleep(9000);
await enderBond.setBondableTokens([stEthAddress], true);

await sleep(9000);
await enderBond.setAddress(enderTreasuryAddress, 1);

await sleep(9000);
await enderBond.setAddress(bondNFTAddress, 3);

await sleep(9000);
await endToken.setFee(20);

await sleep(9000);
await endToken.setExclude([enderBondAddress, enderStakingAddress, enderTreasuryAddress], true);

await sleep(9000);
await endToken.grantRole("0xe13c49f41ace7b3f26b0cf23ab168b4c48591998827e86cfa78a62930e4d6953", enderBondAddress);

await sleep(9000);
await endToken.grantRole("0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6", "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84");

await sleep(9000);
await endToken.grantRole("0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6", "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84");

await sleep(9000);
await endToken.grantRole("0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6", enderStakingAddress);

await sleep(9000);
await enderBond.setAddress(enderStakingAddress,8);

await sleep(9000);
await enderStaking.setAddress(stEthAddress, 6);

await sleep(9000);
await enderBond.setAddress(stEthAddress,6);

await sleep(9000);
await enderBond.setBool(true);

await sleep(9000);
await endToken.setBond(enderBondAddress);

await sleep(9000);
await enderTreasury.setAddress(InstaDappAddress, 5);

await sleep(9000);
await enderTreasury.setStrategy([InstaDappAddress], true);

await sleep(9000);
await enderTreasury.setPriorityStrategy(InstaDappAddress);


await sleep(9000);
await sEnd.setAddress(enderStakingAddress, 1);

await sleep(9000);
await enderBond.setAddress(sEndTokenAddress, 9);

await sleep(9000);
await sEnd.setStatus(2);

await sleep(9000);
await sEnd.whitelist(enderBondAddress, true);



}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
