import { loadUSDC } from "../utils/usdc";
import { viem } from "hardhat";
import { expect } from "chai";

describe("GHO", () => {
  it("Test", async () => {
    const [wallet] = await viem.getWalletClients();
    const [address] = await wallet.getAddresses();
    await loadUSDC(address, 10);

    

    await expect(true).to.equal(true);
  })
})