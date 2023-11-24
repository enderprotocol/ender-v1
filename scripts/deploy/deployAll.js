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


    stEth = await StEth.deploy();
    stEthAddress = await stEth.getAddress();

    sEnd = await upgrades.deployProxy(SEndToken, [], {
        initializer: "initialize",
    });
    sEndTokenAddress = await sEnd.getAddress();

    endToken = await upgrades.deployProxy(EndToken, [], {
        initializer: "initialize",
    });
    await endToken.waitForDeployment();
    endTokenAddress = await endToken.getAddress();


    enderBond = await upgrades.deployProxy(
        EnderBond,
        [endTokenAddress,/*lido address*/,/*oracle address*/  ],
        {
            initializer: "initialize",
        },
    );
   enderBondAddress = await enderBond.getAddress();

   
   bondNFT = await upgrades.deployProxy(BondNFT, [enderBondAddress, baseURI], {
    initializer: "initialize",
});
bondNFTAddress = await bondNFT.getAddress();

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
enderTreasuryAddress = await enderTreasury.getAddress();


enderStaking = await upgrades.deployProxy(EnderStaking, [endTokenAddress, sEndTokenAddress], {
    initializer: "initialize",
});
enderStakingAddress = await enderStaking.getAddress();

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});