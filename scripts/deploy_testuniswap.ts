import { ethers } from "hardhat";

async function main() {

  const TestUniswap = await ethers.getContractFactory("TestUniswap");
  const testUniswap = await TestUniswap.deploy();

  await testUniswap.deployed();

  console.log(`TestUniswap deployed to ${testUniswap.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
