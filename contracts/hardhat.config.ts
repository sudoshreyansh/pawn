import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomiclabs/hardhat-ethers";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      forking: {
        url: 'https://eth-mainnet.g.alchemy.com/v2/0SloeqPBVEv90hh23uyA_iRe0wtQE7Kc',
        blockNumber: 19013000
      }
    }
  }
};

export default config;
