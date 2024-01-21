import { viem } from "hardhat"
import { expect } from "chai";
import { GHO_CONTRACT_ADDRESS, AAVE_POOL_CONTRACT_ADDRESS, USDC_CONTRACT_ADDRESS, USDC_HOLDER_ADDRESS, GHO_DEBT_TOKEN_ADDRESS } from "../utils/constants";
import { loadUSDC } from "../utils/usdc";
import { parseEther } from "ethers/lib/utils";

const RAY = BigInt("1000000000000000000000000000");
const WAD = BigInt("1000000000000000000");

describe("PawnPool", () => {
  it("Testing success scenario", async () => {
    const [wallet, wallet2] = await viem.getWalletClients();
    const [address] = await wallet.getAddresses();
    const [address2] = await wallet2.getAddresses();
    
    const pool = await viem.deployContract("PawnPool");
    const bidsManager = await viem.deployContract("BidsManager", [pool.address]);
    const auctionManager = await viem.deployContract("AuctionManager", [pool.address, GHO_CONTRACT_ADDRESS]);
    const creditToken = await viem.deployContract("CreditToken", [pool.address]);
    const receiptToken = await viem.deployContract("ReceiptToken", [pool.address]);
    const aavePool = await viem.getContractAt("IPool", AAVE_POOL_CONTRACT_ADDRESS);
    const ghoToken = await viem.getContractAt("IERC20", GHO_CONTRACT_ADDRESS);
    const usdcToken = await viem.getContractAt("IERC20", USDC_CONTRACT_ADDRESS);
    const ghoDebtToken = await viem.getContractAt("ICreditDelegationToken", GHO_DEBT_TOKEN_ADDRESS);

    await pool.write.initialize([receiptToken.address, creditToken.address, bidsManager.address, auctionManager.address, AAVE_POOL_CONTRACT_ADDRESS, GHO_CONTRACT_ADDRESS]);
    
    const fakeCollateral = await viem.deployContract("MockERC721");
    const fakeCollateralId = 1n;
    await fakeCollateral.write.mint([fakeCollateralId]);
    await fakeCollateral.write.approve([pool.address, fakeCollateralId])
    expect(await fakeCollateral.read.balanceOf([address])).to.equal(1n);

    await pool.write.requestLoan([fakeCollateral.address, fakeCollateralId, 100n * WAD, 5n * RAY, BigInt(2*24*60*60)])
    expect(await receiptToken.read.balanceOf([address])).to.equal(1n);
    expect((await fakeCollateral.read.ownerOf([fakeCollateralId])).toLowerCase()).to.equal(pool.address);

    // const filter = await receiptToken.createEventFilter.Transfer({ to: address });
    // const logs = await (await viem.getPublicClient()).getFilterChanges({ filter });
    // console.log(logs);
    
    await wallet.sendTransaction({
      account: address,
      to: USDC_HOLDER_ADDRESS,
      value: parseEther("1").toBigInt()
    })

    await loadUSDC(address2, 100000n * 1000000n);
    expect((await usdcToken.read.balanceOf([address2])) >= 100000n * 1000000n).to.true;

    await usdcToken.write.approve([aavePool.address, 100000n * 1000000n])
    await aavePool.write.supply([usdcToken.address, 100000n * 1000000n, address2, 0], {
      account: address2
    })

    await ghoDebtToken.write.approveDelegation([pool.address, 500n * WAD]);
    // await aavePool.write.borrow([ghoToken.address, 100n * WAD, 2n, 0, address2], {
    //   account: address
    // });

    // console.log(await ghoToken.read.balanceOf([address]));
    
    await pool.write.placeBid([1n, 2n * RAY, 100n * WAD], {
      account: address2
    });

    // await aavePool.write.borrow([ghoToken.address, 88007n * WAD, 2n, 0, address2], {
    //   account: address2
    // });

    // console.log(await usdcToken.read.balanceOf([address2]));
    // console.log(await ghoToken.read.balanceOf([address2]));
    // console.log(await aavePool.read.getUserAccountData([address2]));
  });
});