const { ethers, upgrades } = require("hardhat");
const baseURI = "https://endworld-backend.vercel.app/nft/metadata/";

async function main() {
    const StEth = await ethers.getContractFactory("StEth");
    const SEndToken = await ethers.getContractFactory("SEndToken");
    const EndToken = await ethers.getContractFactory("EndToken");
    const BondNFT = await ethers.getContractFactory("BondNFT");
    const EnderBond = await ethers.getContractFactory("EnderBond");
    const EnderTreasury = await ethers.getContractFactory("EnderTreasury");
    const EnderStaking = await ethers.getContractFactory("EnderStaking");
    
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
        sEnd,
        stEth,
        bondNFT;


    // stEth = await StEth.deploy();
    // await sleep(10000);
    // stEthAddress = await stEth.getAddress();

    sEnd = await upgrades.deployProxy(SEndToken, [], {
        initializer: "initialize",
    });
    console.log("init5");
    await sleep(10000);
    sEndTokenAddress = await sEnd.getAddress();
    console.log(`sEndTokenAddress`, sEndTokenAddress);

    endToken = await upgrades.deployProxy(EndToken, [], {
        initializer: "initialize",
    });
    console.log("init4");
    await sleep(10000);

    await endToken.waitForDeployment();
    console.log("waitForDeployment");
    await sleep(10000);

    endTokenAddress = await endToken.getAddress();
    console.log(`endTokenAddress`, endTokenAddress);

    enderBond = await upgrades.deployProxy(
        EnderBond,
        [endTokenAddress,/*lido address*/,/*oracle address*/  ],
        {
            initializer: "initialize",
        },
    );
    console.log("init3");
    await sleep(10000);

   enderBondAddress = await enderBond.getAddress();
    console.log(`enderBondAddress`, enderBondAddress);
   
   bondNFT = await upgrades.deployProxy(BondNFT, [enderBondAddress, baseURI], {
    initializer: "initialize",
});
console.log("init2");
await sleep(10000);

bondNFTAddress = await bondNFT.getAddress();
console.log(`bondNftAddress`, bondNftAddress);
   enderTreasury = await upgrades.deployProxy(
    EnderTreasury,
    [
        endTokenAddress,
        enderStakingAddress,
        enderBondAddress,
        /*instadappLiteAddress*/,
        /*instadappLiteAddress*/,
        /*instadappLiteAddress*/,
        70,
        30,
        enderOracleAddress,
    ],
    {
        initializer: "initializeTreasury",
    },
);
console.log("deployTreasury");
await sleep(10000);

enderTreasuryAddress = await enderTreasury.getAddress();
console.log(`enderTreasuryAddress`, enderTreasuryAddress);

enderStaking = await upgrades.deployProxy(EnderStaking, [endTokenAddress, sEndTokenAddress], {
    initializer: "initialize",
});
console.log(`init1`);
await sleep(10000);

enderStakingAddress = await enderStaking.getAddress();
console.log("enderStakingAddress",enderStakingAddress);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});