import hre from "hardhat";

async function main() {
  const token = await hre.viem.getContractAt("MockERC721", '0x17eaf4c33ec49ec2eddd067f202507b034632edf');
  await token.write.mint([29000003n]);
  await token.write.mint([29000004n]);
  console.log('Done: ');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
