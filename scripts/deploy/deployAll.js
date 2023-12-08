const { ethers, upgrades } = require("hardhat");

const baseURI = "https://endworld-backend.vercel.app/nft/metadata/";
function sleep(ms)
 {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function main() {
    const weth = await ethers.getContractFactory("mockWETH")
    const StEth = await ethers.getContractFactory("MockStEth");
    const InstaDapp = await ethers.getContractFactory("StinstaToken");
    const SEndToken = await ethers.getContractFactory("SEndToken");
    const EndToken = await ethers.getContractFactory("EndToken");
    const BondNFT = await ethers.getContractFactory("BondNFT");
    const EnderBond = await ethers.getContractFactory("EnderBond");
    const EnderTreasury = await ethers.getContractFactory("EnderTreasury");
    const EnderStaking = await ethers.getContractFactory("EnderStaking");
    const oracle = await ethers.getContractFactory("EnderOracle");
    let endTokenAddress,
        wEthAddress,
        stEthAddress,
        InstaDappAddress,
        enderBondAddress,
        enderTreasuryAddress,
        enderStakingAddress,
        enderOracleAddress;

    let endToken,
        wEth,
        instaDappLite,
        enderBond,
        sEndTokenAddress,
        enderTreasury,
        enderStaking,
        enderOracle,
        sEnd,
        stEth,
        bondNFT;


    wEth = await weth.deploy("wrappedEth", "weth", "0xEe7CA89760a3425Bc06d8aFA201e80C22E5B94E9");
    wEthAddress = await wEth.getAddress();
    console.log("wEthAddress--> ", wEthAddress);
    await sleep(9000);

    stEth = await StEth.deploy(wEthAddress, "0xEe7CA89760a3425Bc06d8aFA201e80C22E5B94E9");
    stEthAddress = await stEth.getAddress();
    console.log("stEthAddress-->", stEthAddress)
    await sleep(9000);

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

    enderOracle = await upgrades.deployProxy(oracle, [], {
        initializer: "initialize",
    });
    await sleep(9000);
    enderOracleAddress = await enderOracle.getAddress();
    console.log("enderOracleAddress-->", enderOracleAddress);

    enderBond = await upgrades.deployProxy(
        EnderBond,
        [endTokenAddress,"0x0000000000000000000000000000000000000000",enderOracleAddress  ],
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

enderStaking = await upgrades.deployProxy(EnderStaking, [endTokenAddress, sEndTokenAddress], {
initializer: "initialize",
});
await sleep(9000);
enderStakingAddress = await enderStaking.getAddress();
console.log("enderStakingAddress-->", enderStakingAddress);

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
        30,
        enderOracleAddress,
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
await enderBond.setAddress(enderStakingAddress,8);

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
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});