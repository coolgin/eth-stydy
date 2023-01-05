require("dotenv").config();
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/config";
//import "hardhat-deploy";

const networks = {
  localhost: {
    accounts: [process.env.PRIVATE_KEY || ''],
    forking: {
      url: 'https://eth-mainnet.g.alchemy.com/v2/4Xp19JnP1z2aqbbmq92K3c9oMgflSwW_',
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
      url: 'https://eth-mainnet.g.alchemy.com/v2/4Xp19JnP1z2aqbbmq92K3c9oMgflSwW_',
      blockNumber: 14390000
    },
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
    apiKey: process.env.POLYGONSCAN_API_KEY
  },
  mocha: {
    timeout: 100000,
  },
  /*namedAccounts: {
    deployer: {
      default: 0,
    },
  },*/
  solidity: "0.8.17",
};

export default config;
