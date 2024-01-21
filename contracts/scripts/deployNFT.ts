import hre from "hardhat";

async function main() {
  const token = await hre.viem.deployContract("MockERC721");
  console.log("Deployed with address: ", token.address);

  const hash = await token.write.mint([29000001n]);
  console.log('Transaction hash: ', hash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
