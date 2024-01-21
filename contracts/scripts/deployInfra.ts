import hre, { viem } from "hardhat";
import { AAVE_POOL_CONTRACT_ADDRESS, GHO_CONTRACT_ADDRESS } from "../utils/constants";

async function main() {
  console.log("Deploying...");
  const pool = await viem.deployContract("PawnPool");
  console.log("Pool address: ", pool.address);

  const bidsManager = await viem.deployContract("BidsManager", [pool.address]);
  console.log("Bids Manager", bidsManager.address);

  const auctionManager = await viem.deployContract("AuctionManager", [pool.address, GHO_CONTRACT_ADDRESS]);
  console.log("Auction Manager", auctionManager.address);

  const creditToken = await viem.deployContract("CreditToken", [pool.address]);
  console.log("Credit Token", creditToken.address);

  const receiptToken = await viem.deployContract("ReceiptToken", [pool.address]);
  console.log("Receipt Token", receiptToken.address);

  const hash = await pool.write.initialize([receiptToken.address, creditToken.address, bidsManager.address, auctionManager.address, AAVE_POOL_CONTRACT_ADDRESS, GHO_CONTRACT_ADDRESS]);
  console.log("Hash: ", hash);
  (await viem.getPublicClient()).waitForTransactionReceipt({ hash })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
