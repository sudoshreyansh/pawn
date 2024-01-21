import { USDC_CONTRACT_ADDRESS, USDC_HOLDER_ADDRESS } from "../utils/constants";
import { network, viem } from "hardhat";

export async function loadUSDC(receiver: string, amount: BigInt) {
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

  await usdcContract.write.transfer([receiver as `0x${string}`, amount.valueOf()]);

  await network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [USDC_HOLDER_ADDRESS],
  });
}