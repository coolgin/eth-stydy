require("dotenv").config();
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/config";
import "hardhat-deploy";
require("hardhat-gas-reporter");

const networks = {
  localhost: {
    accounts: [process.env.PRIVATE_KEY || ''],
    forking: {
      url: process.env.MAIN_RPC || '',
      blockNumber: 14390000
    },
    gas: 21000,
    gasPrice: 80000000000,
    /*
      if there is no mnemonic, it will just use account 0 of the hardhat node to deploy
      (you can put in a mnemonic here to set the deployer locally)
    */
    // accounts: {
    //   mnemonic: getMnemonic(),
    // },
  },
  hardhat: {
    forking: {
      url: process.env.MAIN_RPC || '',
    }
  },
  mumbai: {
    url: process.env.TESTNET_RPC,
    accounts: [process.env.PRIVATE_KEY || '']
  },
};

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  networks: networks,
  etherscan: {
    apiKey: {
      mumbai: process.env.POLYGONSCAN_API_KEY || ''
    }
  },
  paths: {
    sources: "./contracts", // 合约目录
    tests: "./test",  // 测试文件目录
    cache: "./cache", // 缓存目录，由hardhat自动生成
    artifacts: "./artifacts" // 编译结果目录，由hardhat自动生成
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 100,
    enabled: process.env.REPORT_GAS ? true : false,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY || '',
    maxMethodDiff: 10,
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
  },
  mocha: {
    timeout: 100000,
  },
  namedAccounts: {
    deployer: 0,
  },
  /*namedAccounts: {
    deployer: {
      default: 0,
    },
  },*/
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
};

export default config;
