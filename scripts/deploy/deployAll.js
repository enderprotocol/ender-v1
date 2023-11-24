const { ethers, upgrades } = require("hardhat");

const baseURI = "https://endworld-backend.vercel.app/nft/metadata/";
function sleep(ms)
 {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function main() {
    const StEth = await ethers.getContractFactory("StEth");
    const SEndToken = await ethers.getContractFactory("SEndToken");
    const EndToken = await ethers.getContractFactory("EndToken");
    const BondNFT = await ethers.getContractFactory("BondNFT");
    const EnderBond = await ethers.getContractFactory("EnderBond");
    const EnderTreasury = await ethers.getContractFactory("EnderTreasury");
    const EnderStaking = await ethers.getContractFactory("EnderStaking");
    const oracle = await ethers.getContractFactory("EnderOracle");
    let endTokenAddress,
        enderBondAddress,
        enderTreasuryAddress,
        enderStakingAddress,
        enderOracleAddress;

    let endToken,
        enderBond,
        sEndTokenAddress,
        enderTreasury,
        enderStaking,
        enderOracle,
        sEnd,
        stEth,
        bondNFT;


    stEth = await StEth.deploy();
    stEthAddress = await stEth.getAddress();
    console.log(stEthAddress, "stEthAddress")
    await sleep(6000);
    console.log("AA");
    sEnd = await upgrades.deployProxy(SEndToken, [], {
        initializer: "initialize",
    });
    await sleep(6000);
    sEndTokenAddress = await sEnd.getAddress();
    console.log(sEndTokenAddress, "sEndTokenAddress")


    endToken = await upgrades.deployProxy(EndToken, [], {
        initializer: "initialize",
    });
    await endToken.waitForDeployment();
    await sleep(6000);
    endTokenAddress = await endToken.getAddress();
    console.log(endTokenAddress, "endeToken")

    enderOracle = await upgrades.deployProxy(oracle, [], {
        initializer: "initialize",
    });
    await sleep(6000);
    enderOracleAddress = await enderOracle.getAddress();
    console.log("enderOracleAddress", enderOracleAddress);

    enderBond = await upgrades.deployProxy(
        EnderBond,
        [endTokenAddress,"0x0000000000000000000000000000000000000000",enderOracleAddress  ],
        {
            initializer: "initialize",
        },
    );
    await sleep(6000);
   enderBondAddress = await enderBond.getAddress();
   console.log("enderBondAddress", enderBondAddress);

   
   bondNFT = await upgrades.deployProxy(BondNFT, [enderBondAddress, baseURI], {
    initializer: "initialize",
});
await sleep(6000);
bondNFTAddress = await bondNFT.getAddress();
console.log("bondNFTAddress", bondNFTAddress);
enderStaking = await upgrades.deployProxy(EnderStaking, [endTokenAddress, sEndTokenAddress], {
initializer: "initialize",
});
await sleep(6000);
enderStakingAddress = await enderStaking.getAddress();
console.log("enderStakingAddress", enderStakingAddress);


   enderTreasury = await upgrades.deployProxy(
    EnderTreasury,
    [
        endTokenAddress,
        enderStakingAddress,
        enderBondAddress,
        "0x0000000000000000000000000000000000000000",
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
await sleep(6000);
enderTreasuryAddress = await enderTreasury.getAddress();
console.log("enderTreasuryAddress", enderTreasuryAddress);



}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});