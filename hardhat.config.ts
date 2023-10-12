import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomicfoundation/hardhat-chai-matchers";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@openzeppelin/hardhat-upgrades";
import { HardhatUserConfig } from "hardhat/config";

require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
const GOERLI_KEY = process.env.GOERLI_KEY || ''

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    src: "./contracts",
  },
  networks: {
    hardhat: {
      chainId: 1337,
      forking: {
        // fork url
        url: process.env.ENVIORNMENT === 'prod' ? "https://rpc.ankr.com/eth" : "https://rpc.ankr.com/eth_goerli",
      },
    },
    goerli: {
      chainId: 5,
      url: "https://rpc.ankr.com/eth_goerli",
      accounts: [GOERLI_KEY]
    },
    sepolia: {
      chainId: 11155111,
      url: "https://ethereum-sepolia.blockpi.network/v1/rpc/public",
      accounts: [PRIVATE_KEY],
    }
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
    deploy: "./scripts/deploy",
    deployments: "./deployments",
  },
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          metadata: {
            bytecodeHash: "none",
          },
          optimizer: {
            enabled: true,
            runs: 100000,
          },
        },
      },
    ],
    settings: {
      outputSelection: {
        "*": {
          "*": ["storageLayout"],
        },
      },
    },
  },
  typechain: {
    outDir: "types",
    target: "ethers-v5",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  mocha: {
    timeout: 1000000,
  },
};

export default config;
