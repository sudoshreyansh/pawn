import { USDC_CONTRACT_ADDRESS, USDC_HOLDER_ADDRESS } from "../utils/constants";
import { network, viem } from "hardhat";
import { expect } from "chai";

describe("GHO", () => {
  async function loadUSDC(receiver: string, amount: number) {
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [USDC_HOLDER_ADDRESS],
    });

    const impersonatedWallet = await viem.getWalletClient(USDC_HOLDER_ADDRESS);

    const usdcContract = await viem.getContractAt(
      "MockERC20",
      USDC_CONTRACT_ADDRESS,
      {
        walletClient: impersonatedWallet
      }
    );
    
    const response = await usdcContract.write.transfer([receiver as `0x${string}`, BigInt(amount)]);
  }

  it("Test", async () => {
    const [wallet] = await viem.getWalletClients();
    await expect(loadUSDC((await wallet.getAddresses())[0], 10).catch(console.log)).to.be.fulfilled;
  })
})