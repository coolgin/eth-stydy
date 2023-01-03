import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";


import {TestUniswap} from "../typechain-types";
import * as Contracts from "../typechain-types";

const BN = require("bn.js");
const { sendEther } = require("./util");
const { DAI, WBTC, WBTC_WHALE } = require("./config");

describe("TEST-uniswap", function () {

  const WHALE = WBTC_WHALE;
  const TOKEN_IN = WBTC;
  const TOKEN_OUT = DAI;
  const AMOUNT_IN = 100000000;
  const AMOUNT_OUT_MIN = 1;

  let testUniswapAddr: string
  let ownerAddr: string
  let otherAccountAddr: string

  /*this.beforeEach(async () => {
    console.log("in beforeEach...");

    const {testUniswap, owner} = await loadFixture(deployTestUniswapFixture);

    testUniswapAddr = testUniswap.address
    ownerAddr = owner.address

    console.log("testUniswapAddr:", testUniswapAddr);
    console.log("ownerAddr:", ownerAddr);
  })*/

  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployTestUniswapFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner] = await ethers.getSigners();

    const TestUniswap = await ethers.getContractFactory("TestUniswap");
    const testUniswap = await TestUniswap.deploy();

    return {testUniswap, owner};
  }

  describe("swap", function () {
    it("swap2", async function () {
      this.timeout(10000);  //add timeout.
      const {testUniswap, owner} = await loadFixture(deployTestUniswapFixture);

      let tokenIn = await ethers.getContractAt('IERC20', TOKEN_IN, owner)
      let tokenOut = await ethers.getContractAt('IERC20', TOKEN_OUT, owner)
      //console.log("tokenIn:", tokenIn);
      //console.log("tokenOut:", tokenOut);

      await tokenIn.approve(testUniswap.address, AMOUNT_IN);
      //expect(await lock.unlockTime()).to.equal(unlockTime);

      await testUniswap.swap(
          tokenIn.address,
          tokenOut.address,
          AMOUNT_IN,
          AMOUNT_OUT_MIN,
          owner.address,
      );

      console.log(`in ${AMOUNT_IN}`);
      console.log(`out ${await tokenOut.balanceOf(ownerAddr)}`);
    });
  });
});