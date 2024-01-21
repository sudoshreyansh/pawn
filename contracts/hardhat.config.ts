import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomiclabs/hardhat-ethers";
import 'dotenv/config';

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      forking: {
        url: process.env.ALCHEMY_URI!,
        blockNumber: 5123381
      }
    },
    sepolia: {
      url: process.env.ALCHEMY_URI!,
      accounts: [process.env.PRIVATE_KEY!]
    }
  }
};

export default config;
