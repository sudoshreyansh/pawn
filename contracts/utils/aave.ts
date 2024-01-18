import { ethers } from "hardhat";
import { EthereumTransactionTypeExtended, Pool } from "@aave/contract-helpers";
import { BigNumber } from "ethers";
import { AAVE_POOL_CONTRACT_ADDRESS } from "./constants";

async function submitTransaction(tx: EthereumTransactionTypeExtended) {
  const extendedTxData = await tx.tx();
  const { from, ...txData } = extendedTxData;
  const signer = ethers.provider.getSigner(from);
  
  await signer.sendTransaction({
    ...txData,
    value: txData.value ? BigNumber.from(txData.value) : undefined,
  });
}

export async function supply() {
  const pool = new Pool(ethers.provider, {
    POOL: AAVE_POOL_CONTRACT_ADDRESS
  });
}