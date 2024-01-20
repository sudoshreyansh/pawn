import { viem } from "hardhat"
import { expect } from "chai";

const RAY = BigInt("1000000000000000000000000000");
const WAD = BigInt("1000000000000000000");

describe("BidsManager", () => {
  it("Testing success scenario", async () => {
    const [wallet] = await viem.getWalletClients();
    const [address] = await wallet.getAddresses();

    const manager = await viem.deployContract("BidsManager", [address]);
    await manager.write.initializeLoan([1n, 200n * WAD, 5n * RAY]);
    
    const { result: bid1 } = await manager.simulate.placeBid([1n, 100n * WAD, 2n * RAY]);
    await manager.write.placeBid([1n, 100n * WAD, 2n * RAY]);
    expect(await manager.read.isLoanFulfilled([1n])).to.false;

    const { result: bid2 } = await manager.simulate.placeBid([1n, 100n * WAD, 1n * RAY]);
    await manager.write.placeBid([1n, 100n * WAD, 1n * RAY]);
    expect(await manager.read.getLoanPremiumIndex([1n])).to.equal(BigInt(100*2 + 100*1) * RAY);

    const { result: bid3 } = await manager.simulate.placeBid([1n, 50n * WAD, (5n * RAY) / 10n]);
    await manager.write.placeBid([1n, 50n * WAD, (5n * RAY) / 10n]);
    expect(await manager.read.isLoanFulfilled([1n])).to.true;
    expect(await manager.read.getLoanPremiumIndex([1n])).to.equal(BigInt(100*1 + 50*2 + 5*5) * RAY);

    expect(await manager.read.getBidReturnAmount([bid1])).to.equal(50n * WAD);
    expect(await manager.read.getBidReturnAmount([bid2])).to.equal(0n);
    expect(await manager.read.getBidReturnAmount([bid3])).to.equal(0n);
  })
})