import { ethers } from "hardhat";
const { DAI, WBTC, WBTC_WHALE } = require("../test/config");
import {TestUniswap} from "../typechain-types";
import {loadFixture} from "@nomicfoundation/hardhat-network-helpers";

const TOKEN_IN = WBTC;
const TOKEN_OUT = DAI;

async function deployTestUniswapFixture() {

  // Contracts are deployed using the first signer/account by default
  const [owner] = await ethers.getSigners();

  const TestUniswap = await ethers.getContractFactory("TestUniswap");
  const testUniswap = await TestUniswap.deploy();

  return {testUniswap, owner};
}

async function main() {
  const {testUniswap, owner} = await loadFixture(deployTestUniswapFixture);

  //const tokenIn = await ethers.getContractAt('IERC20', TOKEN_IN, owner)
  const tokenOut = await ethers.getContractAt('IERC20', TOKEN_OUT, owner)

  console.log(`out ${await tokenOut.balanceOf(owner.address)}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
