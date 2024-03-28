require("@nomicfoundation/hardhat-toolbox");
// require("@nomiclabs/hardhat-web3");
import "@nomicfoundation/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
import "@nomicfoundation/hardhat-chai-matchers";
require("solidity-coverage");
require("dotenv").config();

module.exports = {
    // defaultNetwork: "matic",
    networks: {
        hardhat: {
            allowUnlimitedContractSize: true,
        },
        // mumbai: {
        //     url: process.env.RPC,
        //     accounts: [`0x${process.env.PVTKEY}`],
        // },
        // ethereum: {
        //     // url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_PVT_KEY}`,
        //     url: `${process.env.RPC}`,
        //     accounts: [`0x${process.env.PVTKEY}`],
        // },
        // goerli: {
        //     // url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_PVT_KEY}`,
        //     url: `${process.env.ETHRPC}`,
        //     accounts: [`0x${process.env.PVTKEY}`],
        // },
    },
    etherscan: {
        apiKey: process.env.API_KEY_POLYGON,
    },
    mocha: {
        timeout: 200000, // 200 seconds max for running tests
    },
    solidity: {
        coverage: {
            enabled: true,
        },
        compilers: [
            {
                version: "0.8.20",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                    outputSelection: {
                        "*": {
                            "*": ["warnings"],
                        },
                    },
                },
            },
        ],
    },
};
